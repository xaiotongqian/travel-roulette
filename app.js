(function () {
  "use strict";

  const STORAGE_KEY = "travel-roulette-v1";
  const HISTORY_MAX = 20;
  const STAR_WEIGHTS = [0.6, 1.0, 1.4, 1.8, 2.4]; // 1–5 星

  const SCOPE_LABEL = { city: "市内", province: "省内", nearby: "隔壁省", national: "国内" };
  const BUDGET_LABEL = { budget: "穷游", mid: "适中", luxury: "奢一点" };
  const DURATION_LABEL = { day: "一日", weekend: "周末", long: "长假", custom: "自定义天数" };
  const PURPOSE_LABEL = { relax: "散心闲逛", culture: "文化熏陶", outdoor: "户外运动", food: "美食" };
  const MONTH_NAMES = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const SEASON_MONTHS = { spring: [3, 4, 5], summer: [6, 7, 8], autumn: [9, 10, 11], winter: [12, 1, 2] };
  const SEASON_LABEL = { spring: "春季", summer: "夏季", autumn: "秋季", winter: "冬季" };

  const PRESETS = {
    "weekend-budget": { scope: "city", budget: "budget", duration: "weekend", month: "0", maxDistanceKm: 0, label: "市内周末穷游" },
    "province-short": { scope: "province", budget: "mid", duration: "weekend", month: "0", maxDistanceKm: 0, label: "省内短途" },
    "nearby-500": { scope: "nearby", budget: "mid", duration: "weekend", month: "0", maxDistanceKm: 500, label: "隔壁省约500km车程" },
    "national-long": { scope: "national", budget: "mid", duration: "custom", tripDays: 7, month: "0", maxDistanceKm: 0, label: "国内长假·7天" },
  };

  const state = {
    scope: "city",
    budget: "mid",
    duration: "weekend", // day | weekend | custom
    tripDays: 7,         // duration===custom 时的天数
    purposes: [],        // 空=不限；多选 OR 匹配
    month: "0",
    maxDistanceKm: 0, // 0 = 不限；否则为估算行车距离上限（km）
    excludeVisited: true,
    user: loadUser(),
    lastResult: null,
    spinning: false,
    wheelAngle: 0,
    tagFilter: "",
    batchMode: false,
    batchIds: {},
    activePreset: "",
  };

  function defaultUser() {
    return {
      overrides: {},
      custom: [],
      trips: [],
      history: [],
      theme: "light",
      soundMuted: false,
      baseId: "sz",
      useGpsOrigin: false,
      gps: null, // { lat, lng, at }
      homeCity: (window.TRAVEL_DATA && TRAVEL_DATA.homeCity) || "深圳",
    };
  }

  function loadUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultUser();
      const parsed = JSON.parse(raw);
      // 明亮主题上线迁移：旧默认暗色 → 浅色；用户曾点过切换则会有 themeChosen
      var theme = parsed.themeChosen
        ? (parsed.theme === "dark" ? "dark" : "light")
        : "light";
      var bases = (window.TRAVEL_DATA && TRAVEL_DATA.bases) || [];
      var baseId = parsed.baseId || "sz";
      if (!bases.some(function (b) { return b.id === baseId; })) baseId = (bases[0] && bases[0].id) || "sz";
      return Object.assign(defaultUser(), parsed, {
        history: parsed.history || [],
        theme: theme,
        soundMuted: parsed.soundMuted === true,
        baseId: baseId,
        useGpsOrigin: parsed.useGpsOrigin === true,
        gps: parsed.gps && typeof parsed.gps.lat === "number" ? parsed.gps : null,
      });
    } catch (e) {
      return defaultUser();
    }
  }

  function saveUser() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
  }

  function allPlaces() {
    const builtIn = (window.TRAVEL_DATA && TRAVEL_DATA.places) || [];
    return builtIn.concat(state.user.custom || []);
  }

  function getOverride(id) {
    return state.user.overrides[id] || {};
  }

  function mergePlace(p) {
    const o = getOverride(p.id);
    return Object.assign({}, p, {
      visited: o.visited === true,
      weight: typeof o.weight === "number" ? o.weight : (p.weight || 1),
    });
  }

  function enrichPlace(place) {
    if (!place || !place.id) return place;
    var full = allPlaces().find(function (p) { return p.id === place.id; });
    if (!full) return place;
    return mergePlace(Object.assign({}, full, place));
  }

  function getBases() {
    return (window.TRAVEL_DATA && TRAVEL_DATA.bases) || [];
  }

  function currentBase() {
    var bases = getBases();
    var id = (state.user && state.user.baseId) || "sz";
    return bases.find(function (b) { return b.id === id; }) || bases[0] || {
      id: "sz", name: "深圳", lat: 22.5431, lng: 114.0579, province: "广东", neighbors: []
    };
  }

  /** 距离/导航原点：GPS 或基地城市中心 */
  function currentOrigin() {
    if (state.user.useGpsOrigin && state.user.gps && typeof state.user.gps.lat === "number") {
      return {
        lat: state.user.gps.lat,
        lng: state.user.gps.lng,
        label: "当前定位",
        isGps: true,
      };
    }
    var b = currentBase();
    return { lat: b.lat, lng: b.lng, label: b.name, isGps: false };
  }

  function homeCenter() {
    var o = currentOrigin();
    return { lat: o.lat, lng: o.lng, label: o.label };
  }

  function haversineKm(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var toRad = function (d) { return d * Math.PI / 180; };
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function driveHoursText(km) {
    if (km == null || isNaN(km)) return "";
    if (km <= 25) return "约20–40分钟";
    if (km <= 50) return "约45–70分钟";
    if (km <= 100) return "约1–1.5小时";
    if (km <= 180) return "约1.5–2.5小时";
    if (km <= 280) return "约3–4小时";
    if (km <= 450) return "约4–6小时";
    if (km <= 700) return "约6–9小时";
    return "建议拆成两日或高铁+租车";
  }

  /** 相对当前原点估算行车距离（直线×系数） */
  function placeDriveKm(p) {
    if (typeof p.lat !== "number" || typeof p.lng !== "number") return null;
    var o = currentOrigin();
    var straight = haversineKm(o.lat, o.lng, p.lat, p.lng);
    var mul = straight < 40 ? 1.45 : straight < 200 ? 1.3 : 1.25;
    return Math.max(1, Math.round(straight * mul / 5) * 5);
  }

  function distanceLabel(km) {
    if (km == null || isNaN(km)) return "";
    return Math.round(km) + "km";
  }

  function driveDistanceHint(km) {
    if (km == null || isNaN(km)) return "";
    return "估算行车约" + distanceLabel(km);
  }

  function placeDistanceKm(p) {
    return placeDriveKm(p);
  }

  /** 相对基地：市内/省内/隔壁省/国内 */
  function placeEffectiveScope(p) {
    var base = currentBase();
    var city = p.city || "";
    var province = p.province || "";
    if (city && city === base.name) return "city";
    // 直辖市/同名省市
    if (province && province === base.province) {
      // 同省但非本市 → 省内；本市已在上面
      return "province";
    }
    var neighbors = base.neighbors || [];
    if (province && neighbors.indexOf(province) !== -1) return "nearby";
    return "national";
  }

  function buildDriveRouteText(place) {
    var o = currentOrigin();
    var km = placeDriveKm(place);
    var tip = place.driveTip || place.route || "抵达后优先官方停车场；车机用百度地图导航。";
    if (tip.indexOf("路径将按") !== -1) tip = place.driveTip || "抵达后优先官方停车场。";
    var head = km != null
      ? ("从" + o.label + "自驾约" + Math.round(km) + "km（" + driveHoursText(km) + "）。")
      : ("从" + o.label + "出发。");
    return head + tip;
  }

  function nearestBaseId(lat, lng) {
    var bases = getBases();
    var best = bases[0] && bases[0].id;
    var bestD = Infinity;
    bases.forEach(function (b) {
      var d = haversineKm(lat, lng, b.lat, b.lng);
      if (d < bestD) { bestD = d; best = b.id; }
    });
    return { id: best, km: bestD };
  }

  function setVisited(id, visited) {
    if (!state.user.overrides[id]) state.user.overrides[id] = {};
    state.user.overrides[id].visited = visited;
    saveUser();
  }

  function setWeight(id, weight) {
    if (!state.user.overrides[id]) state.user.overrides[id] = {};
    state.user.overrides[id].weight = Math.max(0.1, Math.min(5, Math.round(weight * 10) / 10));
    saveUser();
  }

  function weightToStars(w) {
    var best = 1;
    var bestDiff = Infinity;
    for (var i = 0; i < STAR_WEIGHTS.length; i++) {
      var d = Math.abs(STAR_WEIGHTS[i] - w);
      if (d < bestDiff) { bestDiff = d; best = i + 1; }
    }
    return best;
  }

  function starsToWeight(stars) {
    var i = Math.max(1, Math.min(5, stars)) - 1;
    return STAR_WEIGHTS[i];
  }

  function monthsForFilter(monthKey) {
    if (!monthKey || monthKey === "0" || monthKey === 0) return null;
    if (SEASON_MONTHS[monthKey]) return SEASON_MONTHS[monthKey];
    var n = parseInt(monthKey, 10);
    return n > 0 ? [n] : null;
  }

  function monthFilterLabel(monthKey) {
    if (!monthKey || monthKey === "0" || monthKey === 0) return "";
    if (SEASON_LABEL[monthKey]) return " · " + SEASON_LABEL[monthKey];
    var n = parseInt(monthKey, 10);
    return n ? " · " + MONTH_NAMES[n] : "";
  }

  function placeMatchesBudget(p) {
    var tags = p.budget;
    // 无标注则不放进候选，避免预算筛选「看起来无效」
    if (!tags || !tags.length) return false;
    return tags.indexOf(state.budget) !== -1;
  }

  /** 出行目的：未选=不限；多选时地点 purpose 与任一选中项相交即可 */
  function placeMatchesPurpose(p) {
    if (!state.purposes || !state.purposes.length) return true;
    var tags = p.purpose || [];
    if (!tags.length) return false;
    return state.purposes.some(function (x) { return tags.indexOf(x) !== -1; });
  }

  function purposeFilterLabel() {
    if (!state.purposes || !state.purposes.length) return "";
    return " · 目的" + state.purposes.map(function (x) { return PURPOSE_LABEL[x] || x; }).join("/");
  }

  /**
   * 出行时长匹配：
   * - 一日：地点 duration 含 day
   * - 周末：含 weekend
   * - 自定义 N 天：1→day；2–3→weekend（亦含仅 day 的短途可放宽？按规则 2–3 只需 weekend，也允许同时有 day 的周末点）
   *           ≥4→含 long；≥5 额外放宽：非市内且含 weekend
   */
  function placeMatchesDuration(p) {
    var tags = p.duration;
    if (!tags || !tags.length) return false;
    var mode = state.duration;
    if (mode === "day") return tags.indexOf("day") !== -1;
    if (mode === "weekend") return tags.indexOf("weekend") !== -1;
    // custom
    var days = parseInt(state.tripDays, 10) || 0;
    if (days <= 1) return tags.indexOf("day") !== -1;
    if (days <= 3) return tags.indexOf("weekend") !== -1;
    // ≥4 长假
    if (tags.indexOf("long") !== -1) return true;
    if (days >= 5 && p.scope !== "city" && tags.indexOf("weekend") !== -1) return true;
    return false;
  }

  function durationFilterLabel() {
    if (state.duration === "day") return "一日";
    if (state.duration === "weekend") return "周末";
    var d = parseInt(state.tripDays, 10) || 0;
    return d > 0 ? (d + "天") : "长假";
  }

  function getPool() {
    return allPlaces()
      .map(mergePlace)
      .filter(function (p) {
        if (placeEffectiveScope(p) !== state.scope) return false;
        if (state.excludeVisited && p.visited) return false;
        if (p.weight <= 0) return false;
        if (!placeMatchesBudget(p)) return false;
        if (!placeMatchesDuration(p)) return false;
        if (!placeMatchesPurpose(p)) return false;
        var wantMonths = monthsForFilter(state.month);
        if (wantMonths && p.months && p.months.length) {
          var hit = wantMonths.some(function (m) { return p.months.indexOf(m) !== -1; });
          if (!hit) return false;
        }
        if (state.maxDistanceKm > 0) {
          var d = placeDriveKm(p);
          if (d != null && d > state.maxDistanceKm) return false;
        }
        return true;
      });
  }

  function weightedPick(pool) {
    var total = pool.reduce(function (s, p) { return s + (p.weight || 1); }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < pool.length; i++) {
      r -= pool[i].weight || 1;
      if (r <= 0) return { place: pool[i], index: i };
    }
    return { place: pool[pool.length - 1], index: pool.length - 1 };
  }

  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function formatWhen(iso) {
    var d = new Date(iso);
    return (d.getMonth() + 1) + "/" + d.getDate() + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function switchTab(name) {
    $$(".tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.tab === name);
    });
    $$(".panel").forEach(function (p) {
      p.classList.toggle("active", p.id === "panel-" + name);
    });
    if (name === "places") renderPlaces();
    if (name === "footprint") renderFootprint();
    if (name === "draw") {
      updatePoolHint();
      renderHistory();
    }
  }

  function setSegValue(containerSel, value) {
    var box = $(containerSel);
    if (!box) return;
    box.querySelectorAll(".seg-btn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.value === String(value));
    });
  }

  function bindSeg(containerSel, stateKey) {
    var box = $(containerSel);
    box.addEventListener("click", function (e) {
      var btn = e.target.closest(".seg-btn");
      if (!btn) return;
      box.querySelectorAll(".seg-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      state[stateKey] = btn.dataset.value;
      state.activePreset = "";
      $$(".preset-chip").forEach(function (c) { c.classList.remove("active"); });
      updatePoolHint();
    });
  }

  function syncDistanceUI() {
    var box = $("#seg-distance");
    var input = $("#distance-input");
    var km = state.maxDistanceKm || 0;
    if (box) {
      box.querySelectorAll(".seg-btn").forEach(function (b) {
        var v = parseInt(b.dataset.value, 10) || 0;
        b.classList.toggle("active", v === km);
      });
    }
    if (input) {
      // 自定义输入框：有上限时显示数字，不限则清空
      if (document.activeElement !== input) {
        input.value = km > 0 ? String(km) : "";
      }
    }
  }

  function setMaxDriveKm(km, fromPreset) {
    km = parseInt(km, 10);
    if (isNaN(km) || km < 0) km = 0;
    if (km > 5000) km = 5000;
    state.maxDistanceKm = km;
    if (!fromPreset) {
      state.activePreset = "";
      document.querySelectorAll(".preset-chip").forEach(function (c) { c.classList.remove("active"); });
    }
    syncDistanceUI();
    updatePoolHint();
  }

  function syncDurationUI() {
    var box = $("#seg-duration");
    if (box) {
      box.querySelectorAll(".seg-btn").forEach(function (b) {
        b.classList.toggle("active", state.duration !== "custom" && b.dataset.value === state.duration);
      });
    }
    var quick = $("#seg-duration-quick");
    if (quick) {
      quick.querySelectorAll(".seg-btn").forEach(function (b) {
        var d = parseInt(b.dataset.days, 10);
        b.classList.toggle("active", state.duration === "custom" && state.tripDays === d);
      });
    }
    var input = $("#duration-days-input");
    if (input && document.activeElement !== input) {
      input.value = state.duration === "custom" && state.tripDays > 0 ? String(state.tripDays) : "";
    }
  }

  function setDurationMode(mode, days, fromPreset) {
    if (mode === "custom") {
      days = parseInt(days, 10);
      if (!days || days < 1) {
        toast("请输入 1–30 的天数");
        return;
      }
      if (days > 30) days = 30;
      state.duration = "custom";
      state.tripDays = days;
    } else {
      state.duration = mode; // day | weekend
    }
    if (!fromPreset) {
      state.activePreset = "";
      document.querySelectorAll(".preset-chip").forEach(function (c) { c.classList.remove("active"); });
    }
    syncDurationUI();
    updatePoolHint();
  }

  function syncPurposeUI() {
    var box = $("#purpose-filter");
    if (!box) return;
    var selected = state.purposes || [];
    var isAll = !selected.length;
    box.querySelectorAll(".purpose-chip").forEach(function (b) {
      var v = b.dataset.purpose;
      if (v === "all") b.classList.toggle("active", isAll);
      else b.classList.toggle("active", selected.indexOf(v) !== -1);
    });
  }

  function togglePurpose(key) {
    if (key === "all") {
      state.purposes = [];
    } else {
      var arr = state.purposes ? state.purposes.slice() : [];
      var i = arr.indexOf(key);
      if (i === -1) arr.push(key);
      else arr.splice(i, 1);
      state.purposes = arr;
    }
    state.activePreset = "";
    document.querySelectorAll(".preset-chip").forEach(function (c) { c.classList.remove("active"); });
    syncPurposeUI();
    updatePoolHint();
  }

  function applyFiltersToUI() {
    setSegValue("#seg-scope", state.scope);
    setSegValue("#seg-budget", state.budget);
    setSegValue("#seg-month", state.month);
    syncDurationUI();
    syncDistanceUI();
    syncPurposeUI();
    updatePoolHint();
  }

  function applyPreset(key) {
    var p = PRESETS[key];
    if (!p) return;
    state.scope = p.scope;
    state.budget = p.budget;
    state.month = p.month;
    state.purposes = p.purposes ? p.purposes.slice() : [];
    state.activePreset = key;
    $$(".preset-chip").forEach(function (c) {
      c.classList.toggle("active", c.dataset.preset === key);
    });
    setSegValue("#seg-scope", state.scope);
    setSegValue("#seg-budget", state.budget);
    setSegValue("#seg-month", state.month);
    if (p.duration === "custom") {
      setDurationMode("custom", p.tripDays || 7, true);
    } else {
      setDurationMode(p.duration, 0, true);
    }
    setMaxDriveKm(p.maxDistanceKm || 0, true);
    toast("已套用「" + p.label + "」");
  }

  function updatePoolHint() {
    var pool = getPool();
    var el = $("#pool-hint");
    var empty = $("#empty-pool");
    if (!el) return;
    var scope = SCOPE_LABEL[state.scope];
    el.classList.toggle("warn", pool.length === 0);
    var distTxt = state.maxDistanceKm > 0 ? (" · 行车≤" + state.maxDistanceKm + "km") : "";
    var baseName = currentBase().name;
    var originLabel = currentOrigin().label;
    el.innerHTML = "基地 <strong>" + escapeHtml(baseName) + "</strong>" +
      (originLabel !== baseName ? "（起点:" + escapeHtml(originLabel) + "）" : "") +
      " · 候选 <strong>" + pool.length + "</strong>（" + scope + " · 预算" +
      BUDGET_LABEL[state.budget] + " · " + durationFilterLabel() +
      purposeFilterLabel() +
      monthFilterLabel(state.month) + distTxt + "）";
    if (empty) empty.classList.toggle("hidden", pool.length > 0);
    var btn = $("#btn-draw");
    if (btn) {
      btn.disabled = pool.length === 0 || state.spinning;
      if (!state.spinning) {
        $("#btn-draw-label").textContent = state.lastResult ? "再抽一次" : "开始抽签";
      }
    }
  }

  function buildShareText(place) {
    place = enrichPlace(place) || place;
    var lines = [
      "🎲 旅行抽签抽中了「" + place.name + "」",
      (place.region ? "📍 " + place.region + " · " : "📍 ") + SCOPE_LABEL[place.scope],
      "💬 " + (place.vibe || "说走就走"),
    ];
    if (place.intro) lines.push("📝 " + place.intro);
    if (place.food && place.food.length) lines.push("🍜 美食：" + place.food.slice(0, 3).join("、"));
    if (place.sights && place.sights.length) lines.push("📷 打卡：" + place.sights.slice(0, 3).join("、"));
    if (place.route) lines.push("🗺️ " + place.route);
    lines.push("🏷️ " + (place.tags || []).join(" · "));
    lines.push("🎒 预算" + BUDGET_LABEL[state.budget] + " · " + durationFilterLabel());
    return lines.join("\n");
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { toast("已复制分享文案"); }).catch(fallback);
    }
    return fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast("已复制分享文案"); }
      catch (e) { toast("复制失败，请手动选择"); }
      document.body.removeChild(ta);
    }
  }

  function pushHistory(place) {
    if (!state.user.history) state.user.history = [];
    state.user.history.unshift({
      id: place.id,
      name: place.name,
      scope: place.scope,
      region: place.region || "",
      vibe: place.vibe || "",
      tags: place.tags || [],
      at: new Date().toISOString(),
      budget: state.budget,
      duration: state.duration,
    });
    state.user.history = state.user.history.slice(0, HISTORY_MAX);
    saveUser();
    renderHistory();
  }

  function renderHistory() {
    var list = $("#history-list");
    if (!list) return;
    var items = state.user.history || [];
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = '<li class="empty">还没有抽过，转一次试试</li>';
      return;
    }
    items.forEach(function (h) {
      var li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML =
        '<div class="info"><div class="name">' + escapeHtml(h.name) + "</div>" +
        '<div class="when">' + formatWhen(h.at) + " · " + (SCOPE_LABEL[h.scope] || "") + "</div></div>" +
        '<div class="acts">' +
          '<button type="button" class="btn btn-ghost btn-sm btn-hist-go">再去</button>' +
          '<button type="button" class="btn btn-ghost btn-sm btn-hist-star">加心</button>' +
        "</div>";
      li.querySelector(".btn-hist-go").addEventListener("click", function () {
        var place = allPlaces().map(mergePlace).find(function (p) { return p.id === h.id; });
        if (!place) {
          place = Object.assign({}, h, { visited: false, weight: 1 });
        }
        resetDrawView(false);
        $("#wheel-wrap").classList.remove("hidden");
        setTimeout(function () {
          ceremonialReveal(place, true);
        }, 50);
        toast("已从历史唤回「" + place.name + "」");
      });
      li.querySelector(".btn-hist-star").addEventListener("click", function () {
        var cur = mergePlace(allPlaces().find(function (p) { return p.id === h.id; }) || { id: h.id, weight: 1 });
        var stars = Math.min(5, weightToStars(cur.weight) + 1);
        setWeight(h.id, starsToWeight(stars));
        toast("「" + h.name + "」好感 → " + stars + " 星");
        updatePoolHint();
      });
      list.appendChild(li);
    });
  }

  function buildWheelLabels(pool) {
    var wrap = $("#wheel-labels");
    wrap.innerHTML = "";
    var n = Math.min(pool.length, 8);
    var show = pool.slice(0, n);
    var slice = 360 / show.length;
    show.forEach(function (p, i) {
      var lab = document.createElement("div");
      lab.className = "wheel-label";
      lab.textContent = p.name.length > 6 ? p.name.slice(0, 6) + "…" : p.name;
      lab.style.transform = "rotate(" + (slice * i + slice / 2) + "deg)";
      wrap.appendChild(lab);
    });
  }

  function fillDetailList(el, items, placeholder) {
    if (!el) return;
    if (items && typeof items === "string") items = [items];
    if (items && items.length) {
      el.innerHTML = "<ul>" + items.map(function (x) {
        return "<li>" + escapeHtml(x) + "</li>";
      }).join("") + "</ul>";
    } else {
      el.innerHTML = '<p class="detail-placeholder">' + escapeHtml(placeholder) + "</p>";
    }
  }

  function fillDetailText(el, text, placeholder) {
    if (!el) return;
    if (text && String(text).trim()) {
      el.innerHTML = "<p>" + escapeHtml(String(text).trim()) + "</p>";
    } else {
      el.innerHTML = '<p class="detail-placeholder">' + escapeHtml(placeholder) + "</p>";
    }
  }

  function mapQueryFor(place) {
    return place.mapQuery || (place.region ? place.region + " " + place.name : place.name);
  }

  /** 百度网页驾车导航（当前基地/定位 → 目的地） */
  function baiduDrivingUrl(place) {
    var origin = currentOrigin();
    var name = mapQueryFor(place);
    var destName = encodeURIComponent(name);
    var originPart = "latlng:" + origin.lat + "," + origin.lng + "|name:" + encodeURIComponent(origin.label);
    var destPart;
    if (typeof place.lat === "number" && typeof place.lng === "number") {
      destPart = "latlng:" + place.lat + "," + place.lng + "|name:" + destName;
    } else {
      destPart = "name:" + destName;
    }
    var region = encodeURIComponent(currentBase().name || "中国");
    return "https://api.map.baidu.com/direction?origin=" + originPart +
      "&destination=" + destPart +
      "&mode=driving&region=" + region +
      "&output=html&coord_type=gcj02&src=travel-roulette";
  }

  function setMapLinks(place) {
    var q = encodeURIComponent(mapQueryFor(place));
    var nav = $("#map-baidu-nav");
    var baidu = $("#map-baidu");
    var amap = $("#map-amap");
    var google = $("#map-google");
    var hint = $("#map-nav-hint");
    var o = currentOrigin();
    if (nav) {
      nav.href = baiduDrivingUrl(place);
      nav.title = "从" + o.label + "驾车前往（百度地图）";
    }
    if (baidu) baidu.href = "https://map.baidu.com/search?query=" + q;
    if (amap) {
      if (typeof place.lat === "number" && typeof place.lng === "number") {
        amap.href = "https://uri.amap.com/navigation?from=" + o.lng + "," + o.lat + "," +
          encodeURIComponent(o.label) + "&to=" + place.lng + "," + place.lat + "," +
          encodeURIComponent(mapQueryFor(place)) + "&mode=car&coordinate=gaode&callnative=0";
      } else {
        amap.href = "https://uri.amap.com/search?keyword=" + q;
      }
    }
    if (google) {
      if (typeof place.lat === "number" && typeof place.lng === "number") {
        google.href = "https://www.google.com/maps/dir/?api=1&origin=" + o.lat + "," + o.lng +
          "&destination=" + place.lat + "," + place.lng + "&travelmode=driving";
      } else {
        google.href = "https://www.google.com/maps/search/?api=1&query=" + q;
      }
    }
    if (hint) {
      var km = placeDriveKm(place);
      hint.textContent = "从「" + o.label + "」驾车" +
        (km != null ? "（估算约" + Math.round(km) + "km）" : "") +
        "；车机可开百度导航或搜同名终点。";
    }
  }


  // ——— 抽签仪式：音效 / 粒子 / 揭晓 ———
  var audioCtx = null;
  var tickTimer = null;
  var SPIN_MS = 7200;

  function ensureAudio() {
    if (state.user.soundMuted) return null;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function beep(freq, dur, type, vol) {
    var ctx = ensureAudio();
    if (!ctx) return;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.value = vol || 0.04;
    o.connect(g);
    g.connect(ctx.destination);
    var t = ctx.currentTime;
    g.gain.setValueAtTime(vol || 0.04, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  function playTick() {
    beep(880 + Math.random() * 220, 0.04, "triangle", 0.03);
  }

  function playReveal() {
    beep(523.25, 0.12, "sine", 0.05);
    setTimeout(function () { beep(659.25, 0.14, "sine", 0.05); }, 120);
    setTimeout(function () { beep(783.99, 0.28, "sine", 0.06); }, 260);
  }

  function startTickLoop() {
    stopTickLoop();
    var interval = 120;
    function loop() {
      if (!state.spinning) return;
      playTick();
      var ptr = $("#wheel-pointer");
      if (ptr) {
        ptr.classList.remove("tick");
        void ptr.offsetWidth;
        ptr.classList.add("tick");
      }
      // 逐渐减速的滴答
      interval = Math.min(280, interval + 8);
      tickTimer = setTimeout(loop, interval);
    }
    tickTimer = setTimeout(loop, 80);
  }

  function stopTickLoop() {
    if (tickTimer) clearTimeout(tickTimer);
    tickTimer = null;
  }

  function buildParticles() {
    var box = $("#wheel-particles");
    if (!box) return;
    box.innerHTML = "";
    for (var i = 0; i < 18; i++) {
      var s = document.createElement("span");
      var angle = Math.random() * Math.PI * 2;
      var dist = 40 + Math.random() * 90;
      s.style.left = 50 + Math.cos(angle) * 10 + "%";
      s.style.top = 50 + Math.sin(angle) * 10 + "%";
      s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      s.style.animationDuration = 0.8 + Math.random() * 1.2 + "s";
      s.style.animationDelay = Math.random() * 0.8 + "s";
      s.style.background = i % 3 === 0 ? "var(--accent-2)" : "var(--warm)";
      box.appendChild(s);
    }
  }

  function setSpinningUI(on) {
    var wrap = $("#wheel-wrap");
    var status = $("#spin-status");
    var center = $("#wheel-center");
    if (wrap) wrap.classList.toggle("spinning-active", on);
    if (status) status.classList.toggle("hidden", !on);
    if (center) center.classList.toggle("pulse", on);
    if (on) buildParticles();
  }

  function syncSoundBtn() {
    var btn = $("#btn-sound");
    if (!btn) return;
    btn.textContent = state.user.soundMuted ? "🔇" : "🔊";
    btn.title = state.user.soundMuted ? "点击开启抽签音效" : "点击静音抽签音效";
  }

  function toggleSound() {
    state.user.soundMuted = !state.user.soundMuted;
    saveUser();
    syncSoundBtn();
    if (!state.user.soundMuted) {
      ensureAudio();
      playTick();
    }
    toast(state.user.soundMuted ? "已静音" : "音效已开");
  }

  function hideVeil() {
    var veil = $("#reveal-veil");
    if (!veil) return;
    veil.classList.add("hidden");
    veil.classList.remove("opening", "show");
  }

  function ceremonialReveal(place, fromHistory) {
    var veil = $("#reveal-veil");
    var stage = $("#draw-stage");
    var result = $("#result");
    var wheelWrap = $("#wheel-wrap");
    if (veil) {
      $("#reveal-veil-text").textContent = fromHistory ? "再次邂逅…" : "揭晓命运…";
      veil.classList.remove("hidden", "opening");
    }
    // 短暂停顿后切换内容并揭幕
    setTimeout(function () {
      if (wheelWrap) wheelWrap.classList.add("hidden");
      fillResultContent(place);
      if (result) {
        result.classList.add("show", "ceremony");
      }
      playReveal();
      if (veil) {
        // 强制重绘再开幕
        void veil.offsetWidth;
        veil.classList.add("opening");
        setTimeout(function () {
          hideVeil();
        }, 900);
      }
      $("#btn-draw-label").textContent = "再抽一次";
    }, fromHistory ? 350 : 480);
  }

  function fillResultContent(place) {
    place = enrichPlace(place);
    state.lastResult = place;
    $("#result-badge").textContent = SCOPE_LABEL[placeEffectiveScope(place)] + (place.region ? " · " + place.region : "");
    $("#result-name").textContent = place.name;
    var dkm = placeDriveKm(place);
    var purposeTxt = (place.purpose || []).map(function (x) { return PURPOSE_LABEL[x] || x; }).join("·");
    $("#result-meta").textContent =
      "预算" + BUDGET_LABEL[state.budget] + " · " + durationFilterLabel() +
      (purposeTxt ? " · " + purposeTxt : "") +
      (dkm != null ? " · " + driveDistanceHint(dkm) : "") +
      (place.visited ? " · 已去过" : "");
    $("#result-vibe").textContent = place.vibe || "说走就走，风景在路上。";
    var tagsEl = $("#result-tags");
    tagsEl.innerHTML = "";
    (place.tags || []).forEach(function (t) {
      var s = document.createElement("span");
      s.className = "tag";
      s.textContent = t;
      tagsEl.appendChild(s);
    });
    fillDetailText($("#detail-intro"), place.intro, "暂无简介，可在 data.js 或「添加」里补充。");
    fillDetailList($("#detail-food"), place.food, "暂无美食推荐。");
    fillDetailList($("#detail-sights"), place.sights, "暂无打卡点说明。");
    fillDetailList($("#detail-culture"), place.culture, "暂无文化/氛围说明。");
    fillDetailText($("#detail-route"), buildDriveRouteText(place), "暂无自驾路径建议，可用百度驾车导航规划。");
    fillDetailList($("#detail-tips"), place.tips, "暂无小贴士。");
    setMapLinks(place);
  }

  function showResult(place) {
    // 非转盘路径的兜底：直接仪式揭晓
    ceremonialReveal(place, true);
  }

  function resetDrawView(clearLast) {
    hideVeil();
    stopTickLoop();
    setSpinningUI(false);
    var result = $("#result");
    if (result) result.classList.remove("show", "ceremony");
    $("#wheel-wrap").classList.remove("hidden");
    if (clearLast !== false) state.lastResult = null;
  }

  function doDraw() {
    if (state.spinning) return;
    var pool = getPool();
    if (!pool.length) {
      toast("当前没有候选，可提高行车距离上限或点「不限」");
      $("#empty-pool").classList.remove("hidden");
      return;
    }

    // 每次抽签强制完整转盘动画
    resetDrawView(true);
    ensureAudio();
    state.spinning = true;
    $("#btn-draw").disabled = true;
    $("#btn-draw-label").textContent = "命运转动中…";
    setSpinningUI(true);
    startTickLoop();

    var pick = weightedPick(pool);
    var display = [pick.place];
    var others = pool.filter(function (p) { return p.id !== pick.place.id; });
    for (var i = others.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = others[i]; others[i] = others[j]; others[j] = tmp;
    }
    display = display.concat(others).slice(0, 8);
    for (var i2 = display.length - 1; i2 > 0; i2--) {
      var j2 = Math.floor(Math.random() * (i2 + 1));
      var t2 = display[i2]; display[i2] = display[j2]; display[j2] = t2;
    }
    var idx = 0;
    for (var k = 0; k < display.length; k++) {
      if (display[k].id === pick.place.id) { idx = k; break; }
    }
    buildWheelLabels(display);

    var n = display.length;
    var slice = 360 / n;
    var targetInWheel = slice * idx + slice / 2;
    // 更长、更多圈 + 强减速
    var extra = 7 + Math.floor(Math.random() * 4); // 7–10 圈
    var finalAngle = state.wheelAngle + extra * 360 + (360 - (targetInWheel % 360));

    var wheel = $("#wheel");
    // 重置过渡以保障每次都有动画
    wheel.style.transition = "none";
    wheel.style.transform = "rotate(" + state.wheelAngle + "deg)";
    void wheel.offsetWidth;
    wheel.style.transition = "transform " + (SPIN_MS / 1000) + "s cubic-bezier(0.05, 0.82, 0.08, 1)";
    wheel.classList.add("spinning");
    wheel.style.transform = "rotate(" + finalAngle + "deg)";
    state.wheelAngle = finalAngle;

    setTimeout(function () {
      wheel.classList.remove("spinning");
      stopTickLoop();
      setSpinningUI(false);
      state.spinning = false;
      $("#btn-draw").disabled = false;
      // 停稳后再仪式揭晓
      setTimeout(function () {
        ceremonialReveal(pick.place, false);
        pushHistory(pick.place);
        updatePoolHint();
      }, 380);
    }, SPIN_MS);
  }

  function confirmTrip() {
    if (!state.lastResult) return;
    var place = state.lastResult;
    state.user.trips.unshift({
      id: place.id,
      name: place.name,
      scope: place.scope,
      region: place.region,
      vibe: place.vibe,
      tags: place.tags,
      at: new Date().toISOString(),
      budget: state.budget,
      duration: state.duration,
      tripDays: state.duration === "custom" ? state.tripDays : (state.duration === "day" ? 1 : 2),
    });
    saveUser();
    toast("已记入行程意向：「" + place.name + "」");
    copyText(buildShareText(place));
  }

  function collectTags() {
    var map = {};
    allPlaces().forEach(function (p) {
      (p.tags || []).forEach(function (t) {
        map[t] = (map[t] || 0) + 1;
      });
    });
    return Object.keys(map).sort(function (a, b) { return map[b] - map[a]; }).slice(0, 24);
  }

  function renderTagChips() {
    var box = $("#tag-chips");
    if (!box) return;
    var tags = collectTags();
    box.innerHTML = '<button type="button" class="tag-chip' + (!state.tagFilter ? " active" : "") + '" data-tag="">全部标签</button>';
    tags.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tag-chip" + (state.tagFilter === t ? " active" : "");
      b.dataset.tag = t;
      b.textContent = t;
      box.appendChild(b);
    });
  }

  function starsHtml(weight) {
    var s = weightToStars(weight);
    var html = '<div class="stars" title="好感 ' + s + ' 星">';
    for (var i = 1; i <= 5; i++) {
      html += '<button type="button" class="star-btn' + (i <= s ? " on" : "") + '" data-star="' + i + '">★</button>';
    }
    html += "</div>";
    return html;
  }

  function renderPlaces() {
    renderTagChips();
    var q = ($("#place-search").value || "").trim().toLowerCase();
    var filterScope = $("#place-filter-scope").value;
    var filterVisit = $("#place-filter-visit").value;
    var list = $("#place-list");
    list.innerHTML = "";

    var places = allPlaces().map(mergePlace);
    if (filterScope !== "all") places = places.filter(function (p) { return placeEffectiveScope(p) === filterScope; });
    if (filterVisit === "visited") places = places.filter(function (p) { return p.visited; });
    if (filterVisit === "todo") places = places.filter(function (p) { return !p.visited; });
    if (state.tagFilter) {
      places = places.filter(function (p) { return (p.tags || []).indexOf(state.tagFilter) !== -1; });
    }
    if (q) {
      places = places.filter(function (p) {
        return (p.name + " " + (p.region || "") + " " + (p.tags || []).join(" ")).toLowerCase().indexOf(q) !== -1;
      });
    }

    $("#batch-actions").classList.toggle("hidden", !state.batchMode);
    updateBatchCount();

    if (!places.length) {
      list.innerHTML = '<li class="empty">没有匹配的地点<br><span style="font-size:0.8em">试试清空搜索或换标签</span></li>';
      return;
    }

    places.forEach(function (p) {
      var li = document.createElement("li");
      li.className = "place-item" + (p.visited ? " visited" : "") + (state.batchMode ? "" : " no-check");
      var customBadge = p.custom ? " · 自定义" : "";
      var checkHtml = state.batchMode
        ? '<input type="checkbox" class="place-check" data-id="' + escapeHtml(p.id) + '"' + (state.batchIds[p.id] ? " checked" : "") + " />"
        : "";
      li.innerHTML =
        checkHtml +
        "<div>" +
          '<div class="name">' + escapeHtml(p.name) + (p.visited ? " ✓" : "") + "</div>" +
          '<div class="sub">' + SCOPE_LABEL[placeEffectiveScope(p)] + " · " + escapeHtml(p.region || "") +
            (placeDriveKm(p) != null ? " · " + driveDistanceHint(placeDriveKm(p)) : "") +
            ((p.purpose || []).length ? " · " + (p.purpose || []).map(function (x) { return PURPOSE_LABEL[x] || x; }).join("/") : "") +
            " · " + (p.tags || []).slice(0, 3).map(escapeHtml).join(" / ") + customBadge + "</div>" +
        "</div>" +
        '<div class="place-actions">' +
          '<button type="button" class="btn btn-ghost btn-sm btn-visit">' + (p.visited ? "取消已去" : "标记已去") + "</button>" +
          starsHtml(p.weight) +
          (p.custom ? '<button type="button" class="btn btn-ghost btn-sm btn-del" style="color:var(--danger)">删除</button>' : "") +
        "</div>";

      if (state.batchMode) {
        li.querySelector(".place-check").addEventListener("change", function () {
          if (this.checked) state.batchIds[p.id] = true;
          else delete state.batchIds[p.id];
          updateBatchCount();
        });
      }

      li.querySelector(".btn-visit").addEventListener("click", function () {
        setVisited(p.id, !p.visited);
        renderPlaces();
        updatePoolHint();
        toast(p.visited ? "已取消标记" : "已标记为去过");
      });

      li.querySelectorAll(".star-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var stars = parseInt(btn.dataset.star, 10);
          setWeight(p.id, starsToWeight(stars));
          renderPlaces();
          updatePoolHint();
          toast("「" + p.name + "」→ " + stars + " 星");
        });
      });

      var del = li.querySelector(".btn-del");
      if (del) {
        del.addEventListener("click", function () {
          state.user.custom = state.user.custom.filter(function (c) { return c.id !== p.id; });
          delete state.user.overrides[p.id];
          saveUser();
          renderPlaces();
          updatePoolHint();
          toast("已删除自定义地点");
        });
      }
      list.appendChild(li);
    });
  }

  function updateBatchCount() {
    var n = Object.keys(state.batchIds).length;
    var el = $("#batch-count");
    if (el) el.textContent = "已选 " + n;
  }

  function batchSetVisited(visited) {
    var ids = Object.keys(state.batchIds);
    if (!ids.length) { toast("请先勾选地点"); return; }
    ids.forEach(function (id) { setVisited(id, visited); });
    state.batchIds = {};
    renderPlaces();
    updatePoolHint();
    toast(visited ? "已批量标记 " + ids.length + " 处为已去" : "已取消 " + ids.length + " 处已去标记");
  }

  function renderFootprint() {
    var places = allPlaces().map(mergePlace);
    var visited = places.filter(function (p) { return p.visited; });
    var total = places.length;
    $("#stat-visited").textContent = visited.length;
    $("#stat-total").textContent = total;
    $("#stat-pct").textContent = total ? Math.round((visited.length / total) * 100) + "%" : "0%";

    var regions = {};
    places.forEach(function (p) {
      var r = p.region || "其他";
      if (!regions[r]) regions[r] = { total: 0, done: 0 };
      regions[r].total++;
      if (p.visited) regions[r].done++;
    });
    var mapEl = $("#region-map");
    mapEl.innerHTML = "";
    Object.keys(regions).sort().forEach(function (r) {
      var info = regions[r];
      var chip = document.createElement("span");
      chip.className = "region-chip" + (info.done > 0 ? " done" : "");
      chip.textContent = r + (info.done ? " " + info.done + "/" + info.total : "");
      mapEl.appendChild(chip);
    });

    var vList = $("#visited-list");
    vList.innerHTML = "";
    if (!visited.length) {
      vList.innerHTML = '<li class="empty">还没有标记去过的地方<br><span style="font-size:0.8em">去「地点库」点一下，或开批量选择</span></li>';
    } else {
      visited.forEach(function (p) {
        var li = document.createElement("li");
        li.className = "place-item visited no-check";
        li.innerHTML =
          "<div><div class=\"name\">" + escapeHtml(p.name) + "</div>" +
          '<div class="sub">' + SCOPE_LABEL[placeEffectiveScope(p)] + " · " + escapeHtml(p.region || "") + "</div></div>" +
          '<button type="button" class="btn btn-ghost btn-sm">取消</button>';
        li.querySelector("button").addEventListener("click", function () {
          setVisited(p.id, false);
          renderFootprint();
          updatePoolHint();
        });
        vList.appendChild(li);
      });
    }

    var tList = $("#trip-list");
    tList.innerHTML = "";
    if (!state.user.trips.length) {
      tList.innerHTML = '<li class="empty">抽中后点「就去这儿」会出现在这里</li>';
    } else {
      state.user.trips.forEach(function (t, i) {
        var li = document.createElement("li");
        li.className = "trip-item";
        var d = new Date(t.at);
        var when = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
        li.innerHTML =
          "<div><strong>" + escapeHtml(t.name) + "</strong>" +
          '<div class="when">' + when + " · " + (t.tripDays ? t.tripDays + "天" : (t.tripDays ? (t.tripDays + "天") : (DURATION_LABEL[t.duration] || ""))) + "</div></div>" +
          '<div style="display:flex;gap:0.2rem">' +
            '<button type="button" class="btn btn-ghost btn-sm btn-share">分享</button>' +
            '<button type="button" class="btn btn-ghost btn-sm btn-rm">移除</button>' +
          "</div>";
        li.querySelector(".btn-share").addEventListener("click", function () {
          copyText(buildShareText(t));
        });
        li.querySelector(".btn-rm").addEventListener("click", function () {
          state.user.trips.splice(i, 1);
          saveUser();
          renderFootprint();
        });
        tList.appendChild(li);
      });
    }
  }

  function addCustomPlace() {
    var name = $("#custom-name").value.trim();
    if (!name) { toast("请填写地点名称"); return; }
    var scope = $("#custom-scope").value;
    var region = $("#custom-region").value.trim() || "自定义";
    var tags = $("#custom-tags").value.split(/[,，、\s]+/).filter(Boolean).slice(0, 6);
    var vibe = $("#custom-vibe").value.trim() || "你亲手加进来的地方，值得一去。";
    var intro = ($("#custom-intro") && $("#custom-intro").value.trim()) || "";
    var food = ($("#custom-food") && $("#custom-food").value || "").split(/[,，、]+/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 6);
    var sights = ($("#custom-sights") && $("#custom-sights").value || "").split(/[,，、]+/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 6);
    var route = ($("#custom-route") && $("#custom-route").value.trim()) || "";
    var budget = $$("#custom-budget input:checked").map(function (i) { return i.value; });
    var duration = $$("#custom-duration input:checked").map(function (i) { return i.value; });
    var purpose = $$("#custom-purpose input:checked").map(function (i) { return i.value; });
    if (!budget.length) { toast("请至少选一个预算档"); return; }
    if (!duration.length) { toast("请至少选一个出行时长"); return; }
    if (!purpose.length) purpose = ["relax"];

    var base = currentBase();
    var cityName = region;
    var provinceName = base.province;
    if (scope === "city") { cityName = base.name; provinceName = base.province; }
    else if (scope === "province") { provinceName = base.province; cityName = region || base.name; }
    else if (scope === "nearby") { provinceName = region || (base.neighbors[0] || "周边"); cityName = region || provinceName; }
    else { provinceName = region || "国内"; cityName = region || name; }

    state.user.custom.push({
      id: "custom-" + Date.now().toString(36),
      name: name,
      scope: scope,
      city: cityName,
      province: provinceName,
      region: region,
      tags: tags.length ? tags : ["自定义"],
      purpose: purpose,
      budget: budget,
      duration: duration,
      months: [],
      vibe: vibe,
      intro: intro,
      food: food,
      sights: sights,
      culture: [],
      route: route,
      tips: [],
      weight: 1.4,
      custom: true,
    });
    saveUser();
    $("#custom-name").value = "";
    $("#custom-region").value = "";
    $("#custom-tags").value = "";
    $("#custom-vibe").value = "";
    if ($("#custom-intro")) $("#custom-intro").value = "";
    if ($("#custom-food")) $("#custom-food").value = "";
    if ($("#custom-sights")) $("#custom-sights").value = "";
    if ($("#custom-route")) $("#custom-route").value = "";
    toast("已添加「" + name + "」");
    switchTab("places");
  }

  function exportJson() {
    var payload = { version: 2, exportedAt: new Date().toISOString(), user: state.user };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "travel-roulette-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("已导出备份");
  }

  function importJson(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var user = data.user || data;
        if (!user || typeof user !== "object") throw new Error("格式不对");
        state.user = Object.assign(defaultUser(), {
          overrides: user.overrides || {},
          custom: user.custom || [],
          trips: user.trips || [],
          history: user.history || [],
          theme: user.theme === "dark" ? "dark" : "light",
          soundMuted: user.soundMuted === true,
          homeCity: user.homeCity || state.user.homeCity,
          baseId: user.baseId || state.user.baseId || "sz",
          useGpsOrigin: user.useGpsOrigin === true,
          gps: user.gps || state.user.gps || null,
        });
        renderBaseChips();
        updateBaseHint();
        saveUser();
        applyTheme(state.user.theme);
        updatePoolHint();
        renderPlaces();
        renderFootprint();
        renderHistory();
        toast("导入成功");
      } catch (e) {
        toast("导入失败：文件格式无效");
      }
    };
    reader.readAsText(file);
  }

  function resetAll() {
    if (!confirm("确定清空所有本地数据（已去、权重、历史、自定义、行程）？内置地点不会丢。")) return;
    var theme = state.user.theme;
    state.user = defaultUser();
    state.user.theme = theme;
    saveUser();
    updatePoolHint();
    renderPlaces();
    renderFootprint();
    renderHistory();
    resetDrawView(true);
    toast("已重置");
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "light" ? "#f7f3eb" : "#0c1117";
    var btn = $("#btn-theme");
    if (btn) btn.textContent = theme === "light" ? "☀" : "☾";
  }

  function toggleTheme() {
    state.user.theme = state.user.theme === "light" ? "dark" : "light";
    state.user.themeChosen = true;
    saveUser();
    applyTheme(state.user.theme);
    toast(state.user.theme === "light" ? "已切换亮色" : "已切换暗色");
  }

  function relaxFilters() {
    state.budget = "mid";
    state.duration = "weekend";
    state.tripDays = 7;
    state.purposes = [];
    state.month = "0";
    state.maxDistanceKm = 0;
    state.excludeVisited = false;
    $("#exclude-visited").checked = false;
    state.activePreset = "";
    $$(".preset-chip").forEach(function (c) { c.classList.remove("active"); });
    applyFiltersToUI();
    toast("已放宽：适中 · 周末 · 含已去 · 不限季节/行车距离");
  }

  var baseUi = { locating: false, located: false, popoverOpen: false };

  function setBasePopover(open) {
    var pop = $("#base-popover");
    var btn = $("#base-summary");
    if (!pop || !btn) return;
    baseUi.popoverOpen = !!open;
    pop.classList.toggle("hidden", !open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function updateBaseSummary(status) {
    // status: locating | ok | manual | fail
    var b = currentBase();
    var o = currentOrigin();
    var textEl = $("#base-summary-text");
    var iconEl = $("#base-status-icon");
    var summary = $("#base-summary");
    var hint = $("#base-hint");
    if (summary) summary.classList.toggle("locating", status === "locating");

    var text = "";
    if (status === "locating") {
      text = "正在定位出行基地…";
      if (iconEl) iconEl.textContent = "📍";
    } else if (status === "ok") {
      text = "基地：" + b.name + (o.isGps ? " · 以定位为起点" : " · 点击可切换");
      if (iconEl) iconEl.textContent = "📍";
      baseUi.located = true;
    } else if (status === "fail") {
      text = "选择出行基地（定位未开）";
      if (iconEl) iconEl.textContent = "🏙️";
    } else {
      text = "基地：" + b.name + " · 点击可切换";
      if (iconEl) iconEl.textContent = "📍";
    }
    if (textEl) textEl.textContent = text;

    if (hint) {
      hint.textContent = "省内按「" + b.province + "」· 隔壁：" +
        (b.neighbors || []).slice(0, 4).join("/") + "等" +
        (o.isGps ? " · 距离/导航用当前定位" : "");
    }

    var chips = document.querySelectorAll(".preset-chip");
    chips.forEach(function (c) {
      var key = c.dataset.preset;
      if (key === "weekend-budget") c.textContent = "🎒 " + b.name + "市内周末穷游";
      if (key === "province-short") c.textContent = "🚗 " + b.province + "省内短途";
    });
  }

  // 兼容旧调用名
  function updateBaseHint() {
    updateBaseSummary(baseUi.located ? "ok" : (baseUi.locating ? "locating" : "manual"));
  }

  function renderBaseChips() {
    var box = $("#base-chips");
    if (!box) return;
    box.innerHTML = "";
    getBases().forEach(function (b) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "base-chip" + (state.user.baseId === b.id ? " active" : "");
      btn.dataset.baseId = b.id;
      btn.textContent = b.name;
      btn.addEventListener("click", function () {
        state.user.baseId = b.id;
        state.user.homeCity = b.name;
        saveUser();
        renderBaseChips();
        updateBaseSummary("ok");
        updatePoolHint();
        if ($("#place-list")) renderPlaces();
        setBasePopover(false);
        toast("已切换基地：" + b.name);
      });
      box.appendChild(btn);
    });
  }

  function requestGeolocation(opts) {
    opts = opts || {};
    var silent = !!opts.silent;
    var openOnFail = opts.openOnFail !== false;

    function fail(msg) {
      baseUi.locating = false;
      baseUi.located = false;
      updateBaseSummary("fail");
      renderBaseChips();
      if (openOnFail) setBasePopover(true);
      if (!silent) toast(msg || "定位失败，请手动选择城市");
      updatePoolHint();
    }

    if (!navigator.geolocation) {
      fail("浏览器不支持定位，请手动选择城市");
      return;
    }

    baseUi.locating = true;
    updateBaseSummary("locating");
    setBasePopover(false);

    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      state.user.gps = { lat: lat, lng: lng, at: new Date().toISOString() };
      var near = nearestBaseId(lat, lng);
      state.user.baseId = near.id;
      var b = currentBase();
      state.user.homeCity = b.name;
      // 自动定位成功时默认用定位作导航起点更贴车机场景
      if (opts.autoEnableGpsOrigin) state.user.useGpsOrigin = true;
      saveUser();
      baseUi.locating = false;
      baseUi.located = true;
      renderBaseChips();
      updateBaseSummary("ok");
      updatePoolHint();
      var gpsCb = $("#use-gps-origin");
      if (gpsCb) gpsCb.checked = !!state.user.useGpsOrigin;
      if (!silent) toast("已定位到「" + b.name + "」附近（约" + Math.round(near.km) + "km）");
    }, function () {
      fail("定位未授权或失败，请手动选择城市");
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 120000 });
  }

  function init() {
    if (!state.user.baseId) state.user.baseId = "sz";
    applyTheme(state.user.theme || "light");
    renderBaseChips();
    updateBaseSummary("locating");

    var gpsCb = $("#use-gps-origin");
    if (gpsCb) {
      gpsCb.checked = !!state.user.useGpsOrigin;
      gpsCb.addEventListener("change", function () {
        if (this.checked && !(state.user.gps && state.user.gps.lat)) {
          this.checked = false;
          toast("请先定位成功后再开启");
          requestGeolocation({ openOnFail: true });
          return;
        }
        state.user.useGpsOrigin = this.checked;
        saveUser();
        updateBaseSummary(baseUi.located ? "ok" : "manual");
        updatePoolHint();
        toast(this.checked ? "已用当前定位作距离/导航起点" : "已改回基地城市中心为起点");
      });
    }
    if ($("#btn-geo")) {
      $("#btn-geo").addEventListener("click", function () {
        requestGeolocation({ silent: false, openOnFail: true, autoEnableGpsOrigin: true });
      });
    }

    var summaryBtn = $("#base-summary");
    if (summaryBtn) {
      summaryBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (baseUi.locating) return;
        setBasePopover(!baseUi.popoverOpen);
      });
    }
    document.addEventListener("click", function (e) {
      var root = $("#header-base");
      if (!root || !baseUi.popoverOpen) return;
      if (!root.contains(e.target)) setBasePopover(false);
    });

    // 进入页面优先自动定位
    requestGeolocation({ silent: true, openOnFail: true, autoEnableGpsOrigin: true });

    bindSeg("#seg-scope", "scope");
    bindSeg("#seg-budget", "budget");
    bindSeg("#seg-month", "month");

    (function bindPurpose() {
      var box = $("#purpose-filter");
      if (!box) return;
      box.addEventListener("click", function (e) {
        var btn = e.target.closest(".purpose-chip");
        if (!btn) return;
        togglePurpose(btn.dataset.purpose);
      });
      syncPurposeUI();
    })();

    (function bindDuration() {
      var box = $("#seg-duration");
      if (box) {
        box.addEventListener("click", function (e) {
          var btn = e.target.closest(".seg-btn");
          if (!btn) return;
          setDurationMode(btn.dataset.value, 0, false);
        });
      }
      var quick = $("#seg-duration-quick");
      if (quick) {
        quick.addEventListener("click", function (e) {
          var btn = e.target.closest(".seg-btn");
          if (!btn) return;
          setDurationMode("custom", btn.dataset.days, false);
          toast("已按 " + btn.dataset.days + " 天长假筛选");
        });
      }
      var input = $("#duration-days-input");
      var applyBtn = $("#btn-duration-apply");
      function applyDays() {
        var raw = input && input.value.trim();
        if (!raw) { toast("请输入长假天数"); return; }
        setDurationMode("custom", raw, false);
        toast("已按 " + state.tripDays + " 天筛选（估算匹配规则见说明）");
      }
      if (applyBtn) applyBtn.addEventListener("click", applyDays);
      if (input) {
        input.addEventListener("keydown", function (e) {
          if (e.key === "Enter") { e.preventDefault(); applyDays(); }
        });
      }
      syncDurationUI();
    })();

    (function bindDistance() {
      var box = $("#seg-distance");
      if (box) {
        box.addEventListener("click", function (e) {
          var btn = e.target.closest(".seg-btn");
          if (!btn) return;
          setMaxDriveKm(btn.dataset.value, false);
        });
      }
      var applyBtn = $("#btn-distance-apply");
      var input = $("#distance-input");
      function applyCustom() {
        var raw = input && input.value.trim();
        if (!raw) {
          setMaxDriveKm(0, false);
          toast("已设为不限行车距离");
          return;
        }
        var n = parseInt(raw, 10);
        if (!n || n < 1) {
          toast("请输入有效的公里数");
          return;
        }
        setMaxDriveKm(n, false);
        toast("已筛选估算行车 ≤" + n + "km");
      }
      if (applyBtn) applyBtn.addEventListener("click", applyCustom);
      if (input) {
        input.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            applyCustom();
          }
        });
      }
      syncDistanceUI();
    })();

    $("#exclude-visited").checked = state.excludeVisited;
    $("#exclude-visited").addEventListener("change", function () {
      state.excludeVisited = this.checked;
      updatePoolHint();
    });

    $$(".tab").forEach(function (t) {
      t.addEventListener("click", function () { switchTab(t.dataset.tab); });
    });

    $$(".preset-chip").forEach(function (chip) {
      chip.addEventListener("click", function () { applyPreset(chip.dataset.preset); });
    });

    $("#btn-draw").addEventListener("click", doDraw);
    $("#btn-again").addEventListener("click", function () {
      resetDrawView(true);
      doDraw();
    });
    $("#btn-confirm").addEventListener("click", confirmTrip);
    $("#btn-copy-share").addEventListener("click", function () {
      if (!state.lastResult) return;
      copyText(buildShareText(state.lastResult));
    });
    $("#btn-mark-visited").addEventListener("click", function () {
      if (!state.lastResult) return;
      setVisited(state.lastResult.id, true);
      state.lastResult.visited = true;
      toast("已标记「" + state.lastResult.name + "」为去过");
      updatePoolHint();
    });
    $("#btn-boost").addEventListener("click", function () {
      if (!state.lastResult) return;
      var cur = mergePlace(allPlaces().find(function (p) { return p.id === state.lastResult.id; }) || state.lastResult);
      var stars = Math.min(5, weightToStars(cur.weight) + 1);
      setWeight(state.lastResult.id, starsToWeight(stars));
      toast("好感 → " + stars + " 星，下次更容易抽中");
      updatePoolHint();
    });

    $("#btn-relax").addEventListener("click", relaxFilters);
    $("#btn-goto-places").addEventListener("click", function () { switchTab("places"); });
    $("#btn-clear-history").addEventListener("click", function () {
      if (!(state.user.history || []).length) return;
      if (!confirm("清空抽中历史？")) return;
      state.user.history = [];
      saveUser();
      renderHistory();
      toast("历史已清空");
    });

    $("#place-search").addEventListener("input", renderPlaces);
    $("#place-filter-scope").addEventListener("change", renderPlaces);
    $("#place-filter-visit").addEventListener("change", renderPlaces);
    $("#tag-chips").addEventListener("click", function (e) {
      var chip = e.target.closest(".tag-chip");
      if (!chip) return;
      state.tagFilter = chip.dataset.tag || "";
      renderPlaces();
    });

    $("#batch-mode").addEventListener("change", function () {
      state.batchMode = this.checked;
      if (!state.batchMode) state.batchIds = {};
      renderPlaces();
    });
    $("#btn-batch-visit").addEventListener("click", function () { batchSetVisited(true); });
    $("#btn-batch-unvisit").addEventListener("click", function () { batchSetVisited(false); });

    $("#btn-add-custom").addEventListener("click", addCustomPlace);
    $("#btn-export").addEventListener("click", exportJson);
    $("#btn-import").addEventListener("click", function () { $("#import-file").click(); });
    $("#import-file").addEventListener("change", function () {
      if (this.files && this.files[0]) importJson(this.files[0]);
      this.value = "";
    });
    $("#btn-reset").addEventListener("click", resetAll);
    $("#btn-theme").addEventListener("click", toggleTheme);
    if ($("#btn-sound")) {
      syncSoundBtn();
      $("#btn-sound").addEventListener("click", toggleSound);
    }

    buildWheelLabels(getPool().slice(0, 8));
    updatePoolHint();
    renderHistory();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
