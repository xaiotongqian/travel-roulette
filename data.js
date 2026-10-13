/**
 * 内置地点库 — 默认以「深圳」为市内，广东为省内，隔壁省含桂湘赣闽等。
 *
 * 字段：id/name/scope/region/tags/budget/duration/months/vibe/weight
 *   lat, lng       大致坐标
 *   distanceKm     直线距离（备用参考）
 *   driveKm        相对深圳的估算行车距离（km，按常见高速路径粗估，非实时路况）
 *   intro/food/sights/culture/route/tips  详情
 *   mapQuery       可选地图搜索词
 *
 * scope: city 市内 | province 省内 | nearby 隔壁省 | national 国内
 */
window.TRAVEL_DATA = {
  homeCity: "深圳",
  homeProvince: "广东",
  homeCenter: { lat: 22.5431, lng: 114.0579, label: "深圳市民中心附近" },
  places: [
  {
    "id": "sz-bay",
    "name": "深圳湾公园",
    "scope": "city",
    "region": "深圳南山",
    "tags": [
      "海边",
      "骑行",
      "日落"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day",
      "weekend"
    ],
    "months": [],
    "vibe": "傍晚骑行看日落，城市人的轻松半日。",
    "weight": 1.2,
    "lat": 22.517,
    "lng": 113.98,
    "intro": "滨海休闲带，骑行绿道与草坪开阔，适合日落散步，无需门票。",
    "food": [
      "海岸城餐饮",
      "益田假日里简餐",
      "自带露营简餐"
    ],
    "sights": [
      "深圳湾大桥观景",
      "日出/日落草坪",
      "人才公园可顺路"
    ],
    "culture": [
      "科技之城的海风出口，市民周末放风首选。"
    ],
    "route": "地铁2/11号线后海或科苑站步行/骑行入园。傍晚去最舒服，环湾骑行1–2小时。",
    "tips": [
      "周末车多；日落前到占位；防晒防风。"
    ],
    "distanceKm": 8.5,
    "driveKm": 18
  },
  {
    "id": "sz-oct",
    "name": "华侨城·世界之窗",
    "scope": "city",
    "region": "深圳南山",
    "tags": [
      "乐园",
      "夜景",
      "亲子"
    ],
    "budget": [
      "mid",
      "luxury"
    ],
    "duration": [
      "day",
      "weekend"
    ],
    "months": [],
    "vibe": "微缩世界夜景，适合一天玩个够。",
    "weight": 1,
    "lat": 22.54,
    "lng": 113.97,
    "intro": "华侨城经典园区，白天看微缩景观，晚上灯光表演，可与欢乐谷搭配。",
    "food": [
      "园区内简餐",
      "华侨城商圈餐饮",
      "附近沃尔玛/益田美食"
    ],
    "sights": [
      "世界之窗夜场",
      "瑞士冰雪世界外观",
      "华侨城创意文化园区"
    ],
    "culture": [
      "九十年代特区开放象征之一，怀旧与亲子并存。"
    ],
    "route": "地铁1/2号线世界之窗站。建议下午进、留夜场；或只逛创意园省门票。",
    "tips": [
      "夜场更出片；暑期人多早买票。"
    ],
    "distanceKm": 9.0,
    "driveKm": 20
  },
  {
    "id": "sz-dameisha",
    "name": "大梅沙海滨",
    "scope": "city",
    "region": "深圳盐田",
    "tags": [
      "海滩",
      "休闲",
      "周末"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day",
      "weekend"
    ],
    "months": [
      5,
      6,
      7,
      8,
      9,
      10
    ],
    "vibe": "市区最近的海，周末泡一天。",
    "weight": 1.1,
    "lat": 22.595,
    "lng": 114.31,
    "intro": "深圳东部知名海滩，交通相对方便，玩水、骑行、夜宿都可。",
    "food": [
      "海边排档海鲜",
      "大梅沙奥特莱斯餐饮",
      "盐田宵夜"
    ],
    "sights": [
      "大梅沙沙滩",
      "海滨栈道",
      "小梅沙可顺路"
    ],
    "culture": [
      "特区人亲海记忆地，夏日氛围浓。"
    ],
    "route": "地铁8号线大梅沙站直达。上午到占位置，下午玩水，傍晚返程或住一晚。",
    "tips": [
      "水质看通报；贵重物品看管；节假日极挤。"
    ],
    "distanceKm": 26.5,
    "driveKm": 45
  },
  {
    "id": "sz-dapeng",
    "name": "大鹏所城·较场尾",
    "scope": "city",
    "region": "深圳大鹏",
    "tags": [
      "古城",
      "海边",
      "民宿"
    ],
    "budget": [
      "mid",
      "luxury"
    ],
    "duration": [
      "day",
      "weekend"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10,
      11
    ],
    "vibe": "古城加海风，适合住一晚放空。",
    "weight": 1.2,
    "lat": 22.595,
    "lng": 114.47,
    "intro": "明城墙与渔村改造民宿区，比大梅沙更慢，适合周末短途度假。",
    "food": [
      "较场尾海鲜",
      "客家菜",
      "民宿早餐"
    ],
    "sights": [
      "大鹏所城",
      "较场尾沙滩",
      "杨梅坑可延伸"
    ],
    "culture": [
      "海防所城历史与当代滨海休闲叠合。"
    ],
    "route": "公交或自驾到大鹏；建议住较场尾一晚，白天所城+海边。",
    "tips": [
      "周末民宿贵，提前订；夏天热，春秋更宜。"
    ],
    "distanceKm": 42.7,
    "driveKm": 85
  },
  {
    "id": "sz-nantou",
    "name": "南头古城",
    "scope": "city",
    "region": "深圳南山",
    "tags": [
      "古城",
      "市井",
      "咖啡"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day"
    ],
    "months": [],
    "vibe": "老深圳肌理，咖啡与市井并存。",
    "weight": 1,
    "lat": 22.55,
    "lng": 113.92,
    "intro": "深港历史原点之一，改造后有展览、小店与城墙遗迹，适合半日闲逛。",
    "food": [
      "古城内咖啡轻食",
      "周边粤菜茶档",
      "中山公园旁简餐"
    ],
    "sights": [
      "南头城门",
      "博物馆展览",
      "巷弄文创店"
    ],
    "culture": [
      "从宝安古城到特区的时间层，理解深圳不止科技。"
    ],
    "route": "地铁1/12号线桃园或宝安中心转乘。半日足够，可接海岸城。",
    "tips": [
      "工作日更安静；展览看公告。"
    ],
    "distanceKm": 14.2,
    "driveKm": 25
  },
  {
    "id": "sz-lotus",
    "name": "莲花山公园",
    "scope": "city",
    "region": "深圳福田",
    "tags": [
      "公园",
      "登高",
      "地标"
    ],
    "budget": [
      "budget"
    ],
    "duration": [
      "day"
    ],
    "months": [],
    "vibe": "登顶看市民中心，特区打卡轻松版。",
    "weight": 0.9,
    "lat": 22.55,
    "lng": 114.055,
    "intro": "市中心免费公园，登顶可见邓小平像与市民中心轴线，适合清晨或傍晚。",
    "food": [
      "周边购物公园/中心书城餐饮",
      "福田区简餐"
    ],
    "sights": [
      "山顶邓小平像",
      "花海季节景",
      "俯瞰市民中心"
    ],
    "culture": [
      "特区精神地标，市民晨练日常地。"
    ],
    "route": "地铁3/4号线少年宫或莲花村站。登顶往返约1小时，轻松。",
    "tips": [
      "夏天防晒；周末人多，清晨更舒服。"
    ],
    "distanceKm": 0.8,
    "driveKm": 8
  },
  {
    "id": "sz-dongmen",
    "name": "东门老街",
    "scope": "city",
    "region": "深圳罗湖",
    "tags": [
      "逛街",
      "小吃",
      "市井"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day"
    ],
    "months": [],
    "vibe": "老罗湖烟火气，吃逛一条龙。",
    "weight": 0.9,
    "lat": 22.545,
    "lng": 114.12,
    "intro": "深圳传统商业步行区，小吃与服饰集中，体验早期特区市井味道。",
    "food": [
      "牛肚王、肠粉",
      "潮汕小吃",
      "罗湖书城一带餐饮"
    ],
    "sights": [
      "东门步行街",
      "茂业/太阳广场",
      "地王观光可顺路"
    ],
    "culture": [
      "「一夜城」的消费记忆，热闹胜过精致。"
    ],
    "route": "地铁1/3号线老街或大剧院站。午饭到下午逛街即可。",
    "tips": [
      "人多防扒；口味选评价高的店。"
    ],
    "distanceKm": 6.4,
    "driveKm": 15
  },
  {
    "id": "sz-xichong",
    "name": "西涌海滩",
    "scope": "city",
    "region": "深圳大鹏",
    "tags": [
      "海滩",
      "露营",
      "清静"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day",
      "weekend"
    ],
    "months": [
      4,
      5,
      9,
      10,
      11
    ],
    "vibe": "东部最清静的沙滩之一，适合发呆。",
    "weight": 1.1,
    "lat": 22.48,
    "lng": 114.53,
    "intro": "大鹏半岛南端沙滩，相对安静，适合徒步、看星与慢假期。",
    "food": [
      "沙滩简餐店",
      "自备食物",
      "回较场尾吃海鲜"
    ],
    "sights": [
      "西涌沙滩",
      "峡谷漂流（季节）",
      "星空（少光污染）"
    ],
    "culture": [
      "深圳「郊野海边」代表，周末逃离市区的去处。"
    ],
    "route": "自驾或公交到西涌，路程较长。建议一日或过夜露营（遵守规定）。",
    "tips": [
      "公共交通耗时；台风季勿前往。"
    ],
    "distanceKm": 49.0,
    "driveKm": 95
  },
  {
    "id": "sz-gankeng",
    "name": "甘坑客家小镇",
    "scope": "city",
    "region": "深圳龙岗",
    "tags": [
      "客家",
      "古镇",
      "拍照"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day"
    ],
    "months": [],
    "vibe": "客家风情半日游，拍照友好。",
    "weight": 0.9,
    "lat": 22.66,
    "lng": 114.18,
    "intro": "客家文化主题小镇，建筑与小吃适合轻松打卡，亲子友好。",
    "food": [
      "客家酿豆腐",
      "艾粄、米酒",
      "小镇内小吃街"
    ],
    "sights": [
      "客家围屋风情街",
      "非遗小店",
      "夜景灯饰（若开放）"
    ],
    "culture": [
      "客家移民文化在特区的旅游化呈现。"
    ],
    "route": "地铁3号线大芬或公交直达。半日逛完，可接大芬油画村。",
    "tips": [
      "偏商业；周一部分店休息。"
    ],
    "distanceKm": 18.1,
    "driveKm": 40
  },
  {
    "id": "sz-zhongying",
    "name": "中英街",
    "scope": "city",
    "region": "深圳盐田",
    "tags": [
      "边境",
      "历史",
      "购物"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day"
    ],
    "months": [],
    "vibe": "一街两制，深圳独特体验。",
    "weight": 1,
    "lat": 22.55,
    "lng": 114.23,
    "intro": "沙头角边境特色街，需边防证或预约政策以官方为准，历史感强。",
    "food": [
      "街内零食特产",
      "盐田海鲜",
      "沙头角本地餐饮"
    ],
    "sights": [
      "中英街历史博物馆",
      "界碑",
      "购物街"
    ],
    "culture": [
      "深港边界生活标本，改革开放叙事的现场。"
    ],
    "route": "提前查预约/证件要求；地铁8号线转接驳。预留过关时间。",
    "tips": [
      "政策常变，出发前务必查官方；勿违规带物品。"
    ],
    "distanceKm": 17.7,
    "driveKm": 35
  },
  {
    "id": "sz-talent",
    "name": "人才公园·春茧",
    "scope": "city",
    "region": "深圳南山",
    "tags": [
      "建筑",
      "海边",
      "现代"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day"
    ],
    "months": [],
    "vibe": "现代建筑＋海风，很深圳。",
    "weight": 1,
    "lat": 22.51,
    "lng": 113.945,
    "intro": "春茧体育中心与人才公园相连，建筑摄影与滨海步道兼得。",
    "food": [
      "后海商圈",
      "科兴科学园餐饮",
      "海岸城"
    ],
    "sights": [
      "春茧外观",
      "人才公园海心桥",
      "深圳湾夜景"
    ],
    "culture": [
      "科技与体育场馆塑造的当代城市景观。"
    ],
    "route": "地铁2/11号线后海。公园免费，傍晚灯光好看。",
    "tips": [
      "赛事期间交通管制；骑行友好。"
    ],
    "distanceKm": 12.2,
    "driveKm": 22
  },
  {
    "id": "sz-fairy",
    "name": "仙湖植物园",
    "scope": "city",
    "region": "深圳罗湖",
    "tags": [
      "植物",
      "登山",
      "周末"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day",
      "weekend"
    ],
    "months": [
      3,
      4,
      5,
      10,
      11
    ],
    "vibe": "市区里的山林与寺庙，呼吸新鲜空气。",
    "weight": 1,
    "lat": 22.58,
    "lng": 114.17,
    "intro": "弘法寺与植物园一体，登山步道完善，适合半日亲近自然。",
    "food": [
      "园内素斋/简餐",
      "梧桐山脚下餐饮"
    ],
    "sights": [
      "弘法寺",
      "化石森林",
      "山顶景观"
    ],
    "culture": [
      "城市山林中的佛教与科普空间。"
    ],
    "route": "地铁2号线仙湖路+公交或打车。爬山轻量路线约半天。",
    "tips": [
      "门票；穿运动鞋；节假日人多。"
    ],
    "distanceKm": 12.2,
    "driveKm": 30
  },
  {
    "id": "gd-gz-pearl",
    "name": "广州·珠江夜游",
    "scope": "province",
    "region": "广州",
    "tags": [
      "夜景",
      "美食",
      "花城"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      10,
      11,
      12,
      1,
      2,
      3
    ],
    "vibe": "早茶开场，夜游收尾，吃货友好。",
    "weight": 1.2,
    "lat": 23.11,
    "lng": 113.32,
    "intro": "广州经典组合：早茶＋老城＋珠江夜景，距离深圳高铁约1小时。",
    "food": [
      "早茶虾饺凤爪",
      "肠粉煲仔饭",
      "糖水甜品"
    ],
    "sights": [
      "珠江夜游",
      "广州塔外观",
      "永庆坊/沙面"
    ],
    "culture": [
      "粤式生活节奏：饮茶、倾偈、慢慢逛。"
    ],
    "route": "深城际/高铁到广州南或直达。上午早茶，晚上码头夜游。",
    "tips": [
      "早茶周末排队；船票选开敞甲板。"
    ],
    "distanceKm": 98.5,
    "driveKm": 140
  },
  {
    "id": "gd-zh-lovers",
    "name": "珠海·情侣路长隆",
    "scope": "province",
    "region": "珠海",
    "tags": [
      "海边",
      "乐园",
      "周末"
    ],
    "budget": [
      "mid",
      "luxury"
    ],
    "duration": [
      "weekend"
    ],
    "months": [],
    "vibe": "近在咫尺的海与乐园，深圳人周末热门。",
    "weight": 1.2,
    "lat": 22.27,
    "lng": 113.58,
    "intro": "情侣路看海＋长隆海洋王国，适合亲子或轻松周末。",
    "food": [
      "海鲜排档",
      "长隆园区餐",
      "拱北口岸小吃"
    ],
    "sights": [
      "情侣路渔女",
      "长隆海洋王国",
      "横琴可延伸"
    ],
    "culture": [
      "滨海度假与口岸城市气质。"
    ],
    "route": "城际或自驾约1–1.5小时。一天海＋乐园二选一更从容。",
    "tips": [
      "长隆票提前订；海边风大加外套。"
    ],
    "distanceKm": 57.8,
    "driveKm": 90
  },
  {
    "id": "gd-hz-shuangyue",
    "name": "惠州·双月湾",
    "scope": "province",
    "region": "惠州",
    "tags": [
      "海边",
      "民宿",
      "度假"
    ],
    "budget": [
      "mid",
      "luxury"
    ],
    "duration": [
      "weekend"
    ],
    "months": [
      4,
      5,
      9,
      10,
      11
    ],
    "vibe": "东部海岸线，民宿度假刚刚好。",
    "weight": 1.1,
    "lat": 22.6,
    "lng": 114.88,
    "intro": "惠东滨海，沙滩与民宿成熟，深圳自驾约2小时的短途度假地。",
    "food": [
      "海鲜大排档",
      "惠州梅菜扣肉可回城吃",
      "民宿餐"
    ],
    "sights": [
      "双月湾沙滩",
      "东飞寺",
      "海龟保护区（视开放）"
    ],
    "culture": [
      "珠三角「微度假」海岸代表。"
    ],
    "route": "自驾为主；住一晚看日出更值。",
    "tips": [
      "旺季房价高；注意海况与防晒。"
    ],
    "distanceKm": 84.6,
    "driveKm": 160
  },
  {
    "id": "gd-st-nanao",
    "name": "汕头·南澳岛",
    "scope": "province",
    "region": "汕头",
    "tags": [
      "海岛",
      "骑行",
      "海鲜"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      4,
      5,
      9,
      10
    ],
    "vibe": "潮汕海岛，骑行吃海鲜。",
    "weight": 1,
    "lat": 23.43,
    "lng": 117.02,
    "intro": "跨海大桥连通的海岛，骑行环岛与海鲜是核心体验。",
    "food": [
      "生腌、牛肉火锅",
      "岛上海鲜",
      "潮汕卤味"
    ],
    "sights": [
      "青澳湾",
      "风向标",
      "金银岛沙滩"
    ],
    "culture": [
      "潮汕海洋与侨乡文化的延伸。"
    ],
    "route": "高铁汕头/潮汕站＋巴士或自驾上岛。两日骑行更舒服。",
    "tips": [
      "风大；生腌注意卫生与新鲜度。"
    ],
    "distanceKm": 318.8,
    "driveKm": 380
  },
  {
    "id": "gd-sg-danxia",
    "name": "韶关·丹霞山",
    "scope": "province",
    "region": "韶关",
    "tags": [
      "丹霞",
      "山水",
      "徒步"
    ],
    "budget": [
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      3,
      4,
      5,
      10,
      11
    ],
    "vibe": "世界级丹霞，广东山水天花板。",
    "weight": 1.2,
    "lat": 25.03,
    "lng": 113.75,
    "intro": "丹霞地貌代表，阳元石等景点知名，适合周末徒步摄影。",
    "food": [
      "韶关土特产",
      "农家菜",
      "温泉配套餐"
    ],
    "sights": [
      "长老峰",
      "阳元石",
      "锦江游船"
    ],
    "culture": [
      "世界自然遗产，岭南地质奇观。"
    ],
    "route": "高铁韶关站转景区巴士。建议两日，住山下或景区内。",
    "tips": [
      "台阶多；夏天炎热，春秋最佳。"
    ],
    "distanceKm": 278.3,
    "driveKm": 360
  },
  {
    "id": "gd-qy-lianzhou",
    "name": "清远·连州东陂",
    "scope": "province",
    "region": "清远",
    "tags": [
      "喀斯特",
      "古村",
      "短途"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [
      3,
      4,
      5,
      10,
      11
    ],
    "vibe": "小桂林气质，广东人周末后花园。",
    "weight": 1,
    "lat": 24.78,
    "lng": 112.38,
    "intro": "喀斯特与古村落，比桂林近，适合不想出省的山水游。",
    "food": [
      "清远鸡",
      "连州菜心",
      "农家菜"
    ],
    "sights": [
      "地下河（视选线）",
      "东陂古镇",
      "湟川三峡可选"
    ],
    "culture": [
      "北江山水与乡土聚落。"
    ],
    "route": "高铁/大巴到清远或连州再包车。两日游更合适。",
    "tips": [
      "部分项目季节性；雨天洞内防滑。"
    ],
    "distanceKm": 301.8,
    "driveKm": 320
  },
  {
    "id": "gd-fs-lingnan",
    "name": "佛山·岭南天地",
    "scope": "province",
    "region": "佛山",
    "tags": [
      "岭南",
      "功夫",
      "美食"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "day",
      "weekend"
    ],
    "months": [],
    "vibe": "粤剧功夫与双皮奶，岭南味很浓。",
    "weight": 1,
    "lat": 23.03,
    "lng": 113.11,
    "intro": "祖庙与岭南天地，传统建筑改造商区，美食与功夫文化好逛。",
    "food": [
      "双皮奶、大良蹦砂",
      "顺德菜可延伸",
      "扎蹄、煎堆"
    ],
    "sights": [
      "祖庙",
      "岭南天地",
      "梁园可选"
    ],
    "culture": [
      "广府民系与南派武术发源地气息。"
    ],
    "route": "深圳高铁到佛山或经广州。一日祖庙＋天地足够。",
    "tips": [
      "顺德可另排一天吃吃吃。"
    ],
    "distanceKm": 111.2,
    "driveKm": 150
  },
  {
    "id": "gd-jm-kaiping",
    "name": "江门·开平碉楼",
    "scope": "province",
    "region": "江门",
    "tags": [
      "碉楼",
      "世界遗产",
      "田园"
    ],
    "budget": [
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [
      3,
      4,
      5,
      10,
      11
    ],
    "vibe": "田野中的碉楼群，出片又独特。",
    "weight": 1.1,
    "lat": 22.37,
    "lng": 112.57,
    "intro": "侨乡世界遗产，自力村、马降龙等碉楼群适合摄影与慢走。",
    "food": [
      "江门江门菜",
      "陈皮鸭",
      "乡村农家乐"
    ],
    "sights": [
      "自力村碉楼",
      "马降龙",
      "立园"
    ],
    "culture": [
      "海外华侨与乡土防卫建筑的奇观。"
    ],
    "route": "高铁到开平/江门转巴士。一日两村或两日深度。",
    "tips": [
      "田野晒；门票联票划算。"
    ],
    "distanceKm": 154.1,
    "driveKm": 200
  },
  {
    "id": "gd-yj-zhapo",
    "name": "阳江·闸坡海陵岛",
    "scope": "province",
    "region": "阳江",
    "tags": [
      "海滩",
      "度假",
      "海鲜"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      5,
      6,
      7,
      8,
      9
    ],
    "vibe": "广东经典海岛，玩水吃海鲜。",
    "weight": 1,
    "lat": 21.58,
    "lng": 111.85,
    "intro": "海陵岛闸坡，沙滩成熟、配套全，夏日度假热门。",
    "food": [
      "海鲜大排档",
      "马鲛鱼",
      "阳江豆豉相关菜"
    ],
    "sights": [
      "大角湾",
      "十里银滩",
      "红树林可选"
    ],
    "culture": [
      "南海渔村走向大众度假岸线。"
    ],
    "route": "高铁阳江站转巴士或自驾。住一到两晚。",
    "tips": [
      "台风季关注预警；议价海鲜。"
    ],
    "distanceKm": 251.5,
    "driveKm": 280
  },
  {
    "id": "gd-cz-old",
    "name": "潮州古城",
    "scope": "province",
    "region": "潮州",
    "tags": [
      "古城",
      "潮菜",
      "慢游"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [],
    "vibe": "潮菜圣地，古城慢慢逛。",
    "weight": 1.1,
    "lat": 23.66,
    "lng": 116.62,
    "intro": "广济桥与古城墙，潮州菜必吃，节奏比汕头更古雅。",
    "food": [
      "潮州牛肉火锅",
      "卤水拼盘",
      "春饼、鸭母捻"
    ],
    "sights": [
      "广济桥",
      "开元寺",
      "牌坊街"
    ],
    "culture": [
      "潮汕文化核心城市之一，精细与宗族传统并存。"
    ],
    "route": "高铁潮汕/潮州站。一日古城＋大吃，两日更从容。",
    "tips": [
      "牛肉火锅午晚都要排队；桥夜景美。"
    ],
    "distanceKm": 290.0,
    "driveKm": 360
  },
  {
    "id": "gd-mz-hakka",
    "name": "梅州·客天下",
    "scope": "province",
    "region": "梅州",
    "tags": [
      "客家",
      "围屋",
      "山地"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      3,
      4,
      5,
      10,
      11
    ],
    "vibe": "世界客都，围屋与山城。",
    "weight": 0.9,
    "lat": 24.29,
    "lng": 116.12,
    "intro": "客家文化集中体验，可搭配围屋村落与山区温泉。",
    "food": [
      "盐焗鸡、酿豆腐",
      "梅菜扣肉",
      "粄类点心"
    ],
    "sights": [
      "客天下园区",
      "围龙屋（另选村落）",
      "阴那山可选"
    ],
    "culture": [
      "客家民系聚居中心，山歌与围屋是符号。"
    ],
    "route": "高铁梅州西。建议两日，一园区一村落。",
    "tips": [
      "山区温差；选正规围屋参观。"
    ],
    "distanceKm": 286.4,
    "driveKm": 380
  },
  {
    "id": "gd-hy-wanlv",
    "name": "河源·万绿湖",
    "scope": "province",
    "region": "河源",
    "tags": [
      "湖景",
      "生态",
      "短途"
    ],
    "budget": [
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10,
      11
    ],
    "vibe": "一汪绿水，珠三角的生态周末。",
    "weight": 1,
    "lat": 23.74,
    "lng": 114.68,
    "intro": "大型水库湖景，游船与周边温泉常见组合。",
    "food": [
      "河鲜、「全鱼宴」",
      "客家菜"
    ],
    "sights": [
      "万绿湖游船",
      "镜花岭",
      "温泉酒店区"
    ],
    "culture": [
      "东江水源地旅游，主打清凉生态。"
    ],
    "route": "自驾或大巴约2.5–3小时。一日游船或两日温泉。",
    "tips": [
      "游船看天气；防晒。"
    ],
    "distanceKm": 147.5,
    "driveKm": 200
  },
  {
    "id": "gd-zq-dinghu",
    "name": "肇庆·鼎湖山七星岩",
    "scope": "province",
    "region": "肇庆",
    "tags": [
      "山水",
      "轻徒步",
      "经典"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [
      3,
      4,
      5,
      10,
      11
    ],
    "vibe": "岭南名山＋星岩，老牌但好看。",
    "weight": 1,
    "lat": 23.08,
    "lng": 112.47,
    "intro": "七星岩湖光山色，鼎湖山负氧离子高，适合轻松徒步。",
    "food": [
      "肇庆裹蒸粽",
      "文昌鲤相关菜",
      "鼎湖山简餐"
    ],
    "sights": [
      "七星岩",
      "鼎湖山飞水潭",
      "牌坊广场"
    ],
    "culture": [
      "历代文人足迹的岭南风景区。"
    ],
    "route": "高铁肇庆站。一天两景区偏赶，可二选一深玩。",
    "tips": [
      "山路湿滑带防滑鞋。"
    ],
    "distanceKm": 173.4,
    "driveKm": 220
  },
  {
    "id": "nb-gl-yangshuo",
    "name": "桂林·阳朔漓江",
    "scope": "nearby",
    "region": "广西",
    "tags": [
      "山水",
      "竹筏",
      "喀斯特"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      4,
      5,
      9,
      10
    ],
    "vibe": "隔壁省的经典山水，竹筏漂一程。",
    "weight": 1.2,
    "lat": 24.78,
    "lng": 110.5,
    "intro": "深圳飞/高铁可达的广西名片，漓江竹筏与西街夜景。",
    "food": [
      "啤酒鱼",
      "桂林米粉",
      "荔浦芋"
    ],
    "sights": [
      "漓江竹筏",
      "二十元背景山",
      "西街"
    ],
    "culture": [
      "中国山水画现实版。"
    ],
    "route": "飞桂林或高铁，转阳朔。两日漓江＋西街。",
    "tips": [
      "竹筏正规码头；雨季看航线。"
    ],
    "distanceKm": 439.5,
    "driveKm": 520
  },
  {
    "id": "nb-bh-yintan",
    "name": "北海·银滩",
    "scope": "nearby",
    "region": "广西",
    "tags": [
      "海滩",
      "涠洲",
      "海鲜"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      4,
      5,
      9,
      10,
      11
    ],
    "vibe": "细沙滩＋海鲜，可延伸涠洲岛。",
    "weight": 1.1,
    "lat": 21.42,
    "lng": 109.13,
    "intro": "广西滨海城市，银滩散步，条件允许可加涠洲岛火山海岸。",
    "food": [
      "海鲜生腌（慎选）",
      "虾饼",
      "粉利"
    ],
    "sights": [
      "银滩",
      "老街骑楼",
      "涠洲岛（另日）"
    ],
    "culture": [
      "南海渔港与侨乡骑楼风貌。"
    ],
    "route": "飞北海。银滩半日，涠洲需船班另计。",
    "tips": [
      "生腌卫生；船票旺季紧张。"
    ],
    "distanceKm": 523.2,
    "driveKm": 650
  },
  {
    "id": "nb-nn-qingxiu",
    "name": "南宁·青秀山",
    "scope": "nearby",
    "region": "广西",
    "tags": [
      "园林",
      "都市",
      "短访"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [],
    "vibe": "绿城园林，转机停留也好逛。",
    "weight": 0.8,
    "lat": 22.8,
    "lng": 108.39,
    "intro": "南宁城市绿肺，亚热带植物丰富，适合半日。",
    "food": [
      "老友粉",
      "酸嘢",
      "芒果（季节）"
    ],
    "sights": [
      "青秀山园林",
      "龙象塔",
      "邕江夜景可加"
    ],
    "culture": [
      "壮乡省会的休闲节奏。"
    ],
    "route": "飞南宁。半日青秀山，晚上吃老友粉。",
    "tips": [
      "夏天湿热；防蚊。"
    ],
    "distanceKm": 582.2,
    "driveKm": 780
  },
  {
    "id": "nb-cs-yuelu",
    "name": "长沙·岳麓山橘子洲",
    "scope": "nearby",
    "region": "湖南",
    "tags": [
      "山城",
      "美食",
      "夜生活"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10
    ],
    "vibe": "吃吃吃＋看湘江，隔壁省快乐局。",
    "weight": 1.1,
    "lat": 28.18,
    "lng": 112.94,
    "intro": "岳麓山、橘子洲与湘菜夜宵，高铁可达的热闹周末。",
    "food": [
      "臭豆腐、茶颜（看队）",
      "剁椒鱼头",
      "糖油粑粑"
    ],
    "sights": [
      "岳麓山",
      "橘子洲头",
      "五一广场夜色"
    ],
    "culture": [
      "湖湘文脉与当代网红餐饮并存。"
    ],
    "route": "高铁长沙南。一日山洲，一夜夜宵。",
    "tips": [
      "热门店排队久；爬山穿运动鞋。"
    ],
    "distanceKm": 636.8,
    "driveKm": 780
  },
  {
    "id": "nb-zj-zhangjiajie",
    "name": "张家界·武陵源",
    "scope": "nearby",
    "region": "湖南",
    "tags": [
      "石英砂岩",
      "奇峰",
      "徒步"
    ],
    "budget": [
      "mid",
      "luxury"
    ],
    "duration": [
      "long"
    ],
    "months": [
      4,
      5,
      9,
      10
    ],
    "vibe": "阿凡达取景地气质，值得专程。",
    "weight": 1.2,
    "lat": 29.13,
    "lng": 110.48,
    "intro": "石英砂岩峰林，景区大，建议至少两日，量力乘坐索道。",
    "food": [
      "三下锅",
      "土家菜",
      "酸萝卜"
    ],
    "sights": [
      "袁家界",
      "天子山",
      "十里画廊"
    ],
    "culture": [
      "世界自然遗产，湘西山地民族风情。"
    ],
    "route": "飞张家界。两日核心区，别贪多。",
    "tips": [
      "门票交通卡；防滑；淡季体验更好。"
    ],
    "distanceKm": 815.1,
    "driveKm": 980
  },
  {
    "id": "nb-fh-phoenix",
    "name": "湘西·凤凰古城",
    "scope": "nearby",
    "region": "湖南",
    "tags": [
      "古城",
      "夜景",
      "沱江"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10
    ],
    "vibe": "沱江夜色，灯火古城。",
    "weight": 1,
    "lat": 27.95,
    "lng": 109.6,
    "intro": "湘西古城镇，夜景与苗侗风情是卖点，商业化明显但氛围仍在。",
    "food": [
      "酸汤鱼",
      "血粑鸭",
      "姜糖"
    ],
    "sights": [
      "沱江两岸",
      "凤凰古城夜景",
      "沈从文故居"
    ],
    "culture": [
      "边城文学意象与民族旅游目的地。"
    ],
    "route": "经怀化/铜仁转车。住古城一晚看夜景。",
    "tips": [
      "维护费政策常变；雨天石板滑。"
    ],
    "distanceKm": 749.8,
    "driveKm": 900
  },
  {
    "id": "nb-xm-gulang",
    "name": "厦门·鼓浪屿",
    "scope": "nearby",
    "region": "福建",
    "tags": [
      "海岛",
      "文艺",
      "步行"
    ],
    "budget": [
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      3,
      4,
      5,
      10,
      11
    ],
    "vibe": "隔壁省小岛慢行，听海与钢琴。",
    "weight": 1.1,
    "lat": 24.45,
    "lng": 118.07,
    "intro": "无机动车小岛，万国建筑，深圳飞厦门很方便。",
    "food": [
      "海鲜粥沙茶面",
      "叶氏麻糍",
      "花生汤"
    ],
    "sights": [
      "日光岩",
      "皓月园",
      "别墅巷弄"
    ],
    "culture": [
      "侨乡与音乐气质的海岛。"
    ],
    "route": "飞厦门＋轮渡（预约）。一日步行足够。",
    "tips": [
      "船票预约；少带大行李。"
    ],
    "distanceKm": 460.8,
    "driveKm": 580
  },
  {
    "id": "nb-wy-wuyi",
    "name": "武夷山",
    "scope": "nearby",
    "region": "福建",
    "tags": [
      "山水",
      "岩茶",
      "竹筏"
    ],
    "budget": [
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      4,
      5,
      9,
      10
    ],
    "vibe": "九曲溪＋岩茶，福建必体验。",
    "weight": 1.1,
    "lat": 27.72,
    "lng": 117.98,
    "intro": "丹霞与茶文化，九曲溪竹筏是灵魂项目。",
    "food": [
      "笋宴熏味",
      "岩茶茶点",
      "河鲜"
    ],
    "sights": [
      "九曲溪",
      "天游峰",
      "大红袍景区"
    ],
    "culture": [
      "乌龙岩茶原产地。"
    ],
    "route": "飞/高铁武夷山。竹筏票早订。",
    "tips": [
      "雨天石路滑；防晒。"
    ],
    "distanceKm": 697.9,
    "driveKm": 750
  },
  {
    "id": "nb-nc-tengwang",
    "name": "南昌·滕王阁",
    "scope": "nearby",
    "region": "江西",
    "tags": [
      "名楼",
      "都市",
      "短途"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [],
    "vibe": "落霞与孤鹜的名楼打卡。",
    "weight": 0.9,
    "lat": 28.68,
    "lng": 115.88,
    "intro": "江南名楼，可配合秋水广场与赣江夜景，高铁可达。",
    "food": [
      "瓦罐汤、拌粉",
      "藜蒿炒腊肉",
      "白糖糕"
    ],
    "sights": [
      "滕王阁",
      "秋水广场",
      "绳金塔可选"
    ],
    "culture": [
      "王勃序文加持的江南文化地标。"
    ],
    "route": "高铁南昌西。半日滕王阁，晚上赣江边。",
    "tips": [
      "门票预约；登阁楼梯多。"
    ],
    "distanceKm": 706.4,
    "driveKm": 820
  },
  {
    "id": "nb-wyuan",
    "name": "上饶·婺源",
    "scope": "nearby",
    "region": "江西",
    "tags": [
      "徽派",
      "油菜花",
      "村落"
    ],
    "budget": [
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      3,
      4
    ],
    "vibe": "春日花海与徽派民居（季节限定更美）。",
    "weight": 1.1,
    "lat": 29.25,
    "lng": 117.85,
    "intro": "徽派村落与油菜花海著名，三月前后最盛，也可赏秋。",
    "food": [
      "糊粉、粉蒸肉",
      "清明果",
      "茶点"
    ],
    "sights": [
      "篁岭",
      "江岭",
      "李坑/晓起选一"
    ],
    "culture": [
      "赣皖徽派乡土聚落。"
    ],
    "route": "高铁婺源或上饶转。两日两村足够。",
    "tips": [
      "花季人山人海；错峰早出。"
    ],
    "distanceKm": 836.5,
    "driveKm": 780
  },
  {
    "id": "nb-jdz",
    "name": "景德镇·陶阳里",
    "scope": "nearby",
    "region": "江西",
    "tags": [
      "陶瓷",
      "手作",
      "文创"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [],
    "vibe": " 陶瓷宇宙，手作体验有趣。",
    "weight": 1,
    "lat": 29.27,
    "lng": 117.18,
    "intro": "瓷都核心体验：窑址、手作拉坯与文创街区。",
    "food": [
      "饺子粑、冷粉",
      "瓷都特色菜"
    ],
    "sights": [
      "陶阳里",
      "御窑博物馆",
      "雕塑瓷厂"
    ],
    "culture": [
      "千年窑火与手工艺城市。"
    ],
    "route": "高铁景德镇北。一日博物馆＋手作。",
    "tips": [
      "手作预约；瓷器托运注意包装。"
    ],
    "distanceKm": 810.4,
    "driveKm": 800
  },
  {
    "id": "nb-longhu",
    "name": "鹰潭·龙虎山",
    "scope": "nearby",
    "region": "江西",
    "tags": [
      "丹霞",
      "道教",
      "竹筏"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10,
      11
    ],
    "vibe": "丹霞＋竹筏，道教名山轻松版。",
    "weight": 1,
    "lat": 28.1,
    "lng": 117.02,
    "intro": "丹霞地貌与道教名山，泸溪河竹筏舒适，适合周末。",
    "food": [
      "米粉、寒浸稻草鸭",
      "农家菜"
    ],
    "sights": [
      "泸溪河竹筏",
      "正一观",
      "悬棺讲解点"
    ],
    "culture": [
      "道教正一派祖庭气质。"
    ],
    "route": "高铁鹰潭转景区。一日竹筏＋骑行。",
    "tips": [
      "竹筏观光车联票划算。"
    ],
    "distanceKm": 685.8,
    "driveKm": 750
  },
  {
    "id": "nb-gz-ganzhou",
    "name": "赣州·客家围屋",
    "scope": "nearby",
    "region": "江西",
    "tags": [
      "客家",
      "古城",
      "短途"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [],
    "vibe": "近邻江西的客家古城，高铁可达。",
    "weight": 1,
    "lat": 25.83,
    "lng": 114.93,
    "intro": "赣南客家文化集中地，古城与围屋适合周末短途。",
    "food": [
      "鱼饼、烫皮",
      "小炒、酿豆腐"
    ],
    "sights": [
      "赣州古城墙",
      "郁孤台",
      "围屋村落（另选）"
    ],
    "culture": [
      "客家摇篮之一，与梅州呼应。"
    ],
    "route": "高铁赣州。一日古城，两日加围屋。",
    "tips": [
      "夏天热；围屋选点提前查。"
    ],
    "distanceKm": 376.0,
    "driveKm": 420
  },
  {
    "id": "nb-hn-chenzhou",
    "name": "郴州·东江湖",
    "scope": "nearby",
    "region": "湖南",
    "tags": [
      "湖景",
      "丹霞",
      "周末"
    ],
    "budget": [
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      4,
      5,
      9,
      10
    ],
    "vibe": "隔壁湖南的湖光山色，距离友好。",
    "weight": 1,
    "lat": 25.87,
    "lng": 113.27,
    "intro": "东江湖与穿岩溶洞等，深圳出发高铁友好的湖南短途。",
    "food": [
      "郴州特色菜",
      "湖鲜"
    ],
    "sights": [
      "东江湖",
      "飞天山丹霞",
      "高椅岭可选"
    ],
    "culture": [
      "湘南山水，小众但好看。"
    ],
    "route": "高铁郴州西转景区。两日湖＋丹霞。",
    "tips": [
      "游船看天气。"
    ],
    "distanceKm": 378.5,
    "driveKm": 430
  },
  {
    "id": "nb-fj-zhangzhou",
    "name": "漳州·东山岛",
    "scope": "nearby",
    "region": "福建",
    "tags": [
      "海岛",
      "拍照",
      "风车"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10,
      11
    ],
    "vibe": "福建近邻海岛，风车与金銮湾。",
    "weight": 1.1,
    "lat": 23.7,
    "lng": 117.43,
    "intro": "东山岛沙滩与澳角村出片，比厦门更松一点。",
    "food": [
      "海鲜",
      "鱼丸"
    ],
    "sights": [
      "金銮湾",
      "澳角村",
      "风车阵"
    ],
    "culture": [
      "闽南渔村海岸线。"
    ],
    "route": "高铁云霄/诏安转车或自驾。两日合适。",
    "tips": [
      "风大；防晒。"
    ],
    "distanceKm": 368.0,
    "driveKm": 420
  },
  {
    "id": "nb-gx-huangyao",
    "name": "贺州·黄姚古镇",
    "scope": "nearby",
    "region": "广西",
    "tags": [
      "古镇",
      "小众",
      "山水"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend"
    ],
    "months": [
      3,
      4,
      5,
      10,
      11
    ],
    "vibe": "广西小众古镇，桥亭与豆制品很香。",
    "weight": 1,
    "lat": 24.42,
    "lng": 111.59,
    "intro": "小而完整的古镇，商业化相对可控，适合慢逛。",
    "food": [
      "黄姚豆制品",
      "酿皮英"
    ],
    "sights": [
      "古石板街",
      "带龙桥",
      "兴宁庙"
    ],
    "culture": [
      "岭南古镇生活肌理。"
    ],
    "route": "经贺州转车。住一晚更有味道。",
    "tips": [
      "雨天石板滑。"
    ],
    "distanceKm": 326.9,
    "driveKm": 400
  },
  {
    "id": "nat-bj",
    "name": "北京·故宫",
    "scope": "national",
    "region": "北京",
    "tags": [
      "历史",
      "地标",
      "必去"
    ],
    "budget": [
      "mid",
      "luxury"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10
    ],
    "vibe": "紫禁城红墙，一生要走一次。",
    "weight": 1.2,
    "lat": 39.92,
    "lng": 116.39,
    "intro": "明清皇宫，建议半天并取舍路线，务必预约。",
    "food": [
      "出宫到王府井/景山用餐",
      "烤鸭另排"
    ],
    "sights": [
      "太和殿",
      "乾清宫",
      "珍宝馆"
    ],
    "culture": [
      "中轴与皇权礼仪的空间叙事。"
    ],
    "route": "地铁天安门东/西，南进北出。",
    "tips": [
      "查闭馆日；舒适鞋。"
    ],
    "distanceKm": 1944.7,
    "driveKm": 2200
  },
  {
    "id": "nat-cd",
    "name": "成都·熊猫与火锅",
    "scope": "national",
    "region": "成都",
    "tags": [
      "熊猫",
      "火锅",
      "慢生活"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [],
    "vibe": "看滚滚，再涮一顿火锅。",
    "weight": 1.2,
    "lat": 30.67,
    "lng": 104.06,
    "intro": "熊猫基地＋宽窄/火锅，休闲城市必体验。",
    "food": [
      "火锅串串",
      "担担面",
      "盖碗茶"
    ],
    "sights": [
      "熊猫基地",
      "宽窄巷子",
      "锦里"
    ],
    "culture": [
      "巴适节奏是最大特产。"
    ],
    "route": "飞成都。上午熊猫下午茶馆晚上火锅。",
    "tips": [
      "熊猫早去；火锅出街区找本地店。"
    ],
    "distanceKm": 1342.1,
    "driveKm": 1800
  },
  {
    "id": "nat-xa",
    "name": "西安·兵马俑",
    "scope": "national",
    "region": "西安",
    "tags": [
      "历史",
      "奇迹",
      "古都"
    ],
    "budget": [
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10
    ],
    "vibe": "地下军团，震撼一次就够。",
    "weight": 1.1,
    "lat": 34.38,
    "lng": 109.27,
    "intro": "秦陵兵马俑，建议讲解，回城吃泡馍肉夹馍。",
    "food": [
      "肉夹馍泡馍",
      "回民街/永兴坊"
    ],
    "sights": [
      "一号坑",
      "铜车马",
      "大雁塔夜景可加"
    ],
    "culture": [
      "秦帝国军事档案现场。"
    ],
    "route": "飞西安＋临潼专线。",
    "tips": [
      "预约门票；一号坑别只拍照。"
    ],
    "distanceKm": 1396.4,
    "driveKm": 1700
  },
  {
    "id": "nat-lj",
    "name": "丽江古城",
    "scope": "national",
    "region": "云南",
    "tags": [
      "古城",
      "高原",
      "浪漫"
    ],
    "budget": [
      "mid",
      "luxury"
    ],
    "duration": [
      "long"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10
    ],
    "vibe": "月光石板路，适合发呆。",
    "weight": 1,
    "lat": 26.87,
    "lng": 100.23,
    "intro": "纳西古城，注意海拔适应，适合慢走。",
    "food": [
      "纳西烤鱼",
      "鸡豆凉粉",
      "鲜花饼"
    ],
    "sights": [
      "四方街",
      "木府",
      "狮子山夜景"
    ],
    "culture": [
      "茶马古道与纳西文化。"
    ],
    "route": "飞丽江，缓行。",
    "tips": [
      "防高反；维护费政策查官方。"
    ],
    "distanceKm": 1476.3,
    "driveKm": 2100
  },
  {
    "id": "nat-sanya",
    "name": "三亚·亚龙湾",
    "scope": "national",
    "region": "海南",
    "tags": [
      "海滩",
      "度假",
      "阳光"
    ],
    "budget": [
      "mid",
      "luxury"
    ],
    "duration": [
      "long"
    ],
    "months": [
      11,
      12,
      1,
      2,
      3
    ],
    "vibe": "冬天的海，晒到不想走。",
    "weight": 1.1,
    "lat": 18.23,
    "lng": 109.64,
    "intro": "细沙滩与酒店集群，避寒度假首选。",
    "food": [
      "海鲜加工",
      "清补凉",
      "椰子鸡"
    ],
    "sights": [
      "亚龙湾海滩",
      "日落",
      "热带天堂可选"
    ],
    "culture": [
      "热带滨海度假。"
    ],
    "route": "飞三亚住湾区。",
    "tips": [
      "防晒；海鲜问价。"
    ],
    "distanceKm": 664.8,
    "driveKm": 800
  },
  {
    "id": "nat-cq",
    "name": "重庆·洪崖洞",
    "scope": "national",
    "region": "重庆",
    "tags": [
      "夜景",
      "火锅",
      "赛博"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [],
    "vibe": "8D 夜景，火锅配啤酒。",
    "weight": 1.2,
    "lat": 29.56,
    "lng": 106.58,
    "intro": "洪崖洞夜景＋解放碑＋李子坝，火锅收尾。",
    "food": [
      "火锅",
      "小面酸辣粉",
      "烤鱼"
    ],
    "sights": [
      "洪崖洞",
      "李子坝轻轨",
      "解放碑"
    ],
    "culture": [
      "山地立体城市的赛博气质。"
    ],
    "route": "飞重庆，黄昏取景晚上火锅。",
    "tips": [
      "夜景在江对岸拍；火锅选口碑店。"
    ],
    "distanceKm": 1079.6,
    "driveKm": 1500
  },
  {
    "id": "nat-hz",
    "name": "杭州·西湖",
    "scope": "national",
    "region": "杭州",
    "tags": [
      "湖景",
      "经典",
      "骑行"
    ],
    "budget": [
      "budget",
      "mid",
      "luxury"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [
      3,
      4,
      5,
      9,
      10
    ],
    "vibe": "欲把西湖比西子，经典免门票。",
    "weight": 1.1,
    "lat": 30.25,
    "lng": 120.15,
    "intro": "环湖骑行最舒服，春秋尤佳。",
    "food": [
      "杭帮菜",
      "定胜糕葱包桧",
      "龙井虾仁"
    ],
    "sights": [
      "断桥",
      "苏堤",
      "雷峰塔远眺"
    ],
    "culture": [
      "诗词与市民共享一湖。"
    ],
    "route": "飞/高铁杭州。断桥白堤苏堤一日。",
    "tips": [
      "环湖免费；错峰。"
    ],
    "distanceKm": 1049.5,
    "driveKm": 1400
  },
  {
    "id": "nat-sh",
    "name": "上海·外滩",
    "scope": "national",
    "region": "上海",
    "tags": [
      "夜景",
      "都市",
      "经典"
    ],
    "budget": [
      "budget",
      "mid"
    ],
    "duration": [
      "weekend",
      "long"
    ],
    "months": [],
    "vibe": "江风霓虹，魔都名片。",
    "weight": 0.9,
    "lat": 31.24,
    "lng": 121.49,
    "intro": "外滩万国建筑与对岸天际线，夜景最佳。",
    "food": [
      "本帮菜",
      "生煎小笼",
      "外滩商圈餐饮"
    ],
    "sights": [
      "外滩夜景",
      "外白渡桥",
      "陆家嘴对望"
    ],
    "culture": [
      "近代开埠与金融城市象征。"
    ],
    "route": "飞上海。傍晚到外滩亮灯。",
    "tips": [
      "周末人多；风大。"
    ],
    "distanceKm": 1215.1,
    "driveKm": 1500
  },
  {
    "id": "nat-jiuzhai",
    "name": "九寨沟",
    "scope": "national",
    "region": "四川",
    "tags": [
      "彩湖",
      "秋色"
    ],
    "budget": [
      "mid",
      "luxury"
    ],
    "duration": [
      "long"
    ],
    "months": [
      9,
      10
    ],
    "vibe": "五彩池秋天像开了滤镜。",
    "weight": 1,
    "lat": 33.26,
    "lng": 103.92,
    "intro": "九寨沟彩池叠瀑，秋季最盛，需提前预约。",
    "food": [
      "藏餐",
      "沟外酸菜鱼"
    ],
    "sights": [
      "五花海",
      "五彩池",
      "诺日朗"
    ],
    "culture": [
      "藏羌地区自然圣景。"
    ],
    "route": "飞九寨黄龙或陆路。一日核心沟。",
    "tips": [
      "预约；高原缓行。"
    ],
    "distanceKm": 1551.3,
    "driveKm": 2000
  }
]
};
