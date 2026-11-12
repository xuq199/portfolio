/* ============================================================
   站点配置 —— 所有内容都在这里改，不用碰 HTML / 引擎代码
   ============================================================ */
window.SITE = {
  /* ---------- 基础信息 ---------- */
  identity: {
    /* 左上角 = 名字缩写（原站 AW） */
    monogram: '许',
    /* 页脚大字签名（原站 AW） */
    signature: '许秋泉',
    /* 浏览器标签标题 */
    title: '许秋泉 — 数字媒体设计',
    /* 语言标记 */
    lang: 'zh-CN'
  },

  /* ---------- 首屏 Hero ---------- */
  hero: {
    /* 大标题：像原站一样逐词遮罩上浮 */
    lines: [
      { text: 'Coding', italic: false },
      { text: 'globally', italic: true },
      { text: 'from', italic: false },
      { text: 'Sichuan.', italic: true }
    ],
    /* 副标题 */
    subtitle: '数字媒体设计 · 界面与交互 · Available for work →',
    /* 右上角胶囊按钮 */
    cta: { label: 'Contact me', href: '#contact' },
    /* 滚动提示 */
    scrollCue: 'Scroll to explore'
  },

  /* ---------- 简介 About ---------- */
  about: {
    label: '(About)',
    /* 逐行揭示的正文，每行独立触发 */
    lines: [
      '许秋泉，数字媒体专业，就读于南充电影工业职业学院。',
      '主修方向与界面设计、交互课程相关，关注界面视觉与动效表达。',
      '与设计师、课程伙伴协作，把想法做成可点击、可交互的界面原型。',
      '从排版与配色入手，逐步深入到交互动效与前端实现，正在积累作品与实战经验。',
      '目前正在寻找实习与合作机会，欢迎聊聊你的项目。'
    ],
    /* 经历时间线（原站 is-computer 区块） */
    timeline: {
      title: 'Background',
      items: [
        { year: '2023', text: 'Dreamweaver 入门，做出第一张静态网页' },
        { year: '2024', text: '接触 Flash / ActionScript 与时间轴动画思路' },
        { year: '2025', text: '从零写后端，理解数据如何流到界面上' },
        { year: '2026', text: '转向创意开发：CMS 建站、动效实现、交互原型' }
      ]
    }
  },

  /* ---------- 作品 Works ---------- */
  works: {
    label: '(Selected works)',
    title: 'Works',
    /* 占位示例项目 —— 换成你自己的：删掉或复制一个对象即可 */
    items: [
      {
        id: '01',
        title: 'Cinema UI Kit',
        category: '界面设计 / 组件库',
        year: '2026',
        href: '#',
        gradient: ['#0b2b52', '#00e0ff'],
        cover: ''           /* 可填图片地址，如 'assets/img/work-01.jpg'，留空则用渐变 */
      },
      {
        id: '02',
        title: 'Motion Landing',
        category: '动效网页 / 前端',
        year: '2026',
        href: '#',
        gradient: ['#102a6b', '#38f9d7'],
        cover: ''
      },
      {
        id: '03',
        title: '交互原型实验',
        category: '交互设计 / 原型',
        year: '2025',
        href: '#',
        gradient: ['#0a1f44', '#5b8cff'],
        cover: ''
      },
      {
        id: '04',
        title: 'Brand Microsite',
        category: '视觉 / 落地页',
        year: '2025',
        href: '#',
        gradient: ['#0d3b66', '#00b4d8'],
        cover: ''
      },
      {
        id: '05',
        title: 'Data Poster',
        category: '信息可视化',
        year: '2025',
        href: '#',
        gradient: ['#091936', '#48cae4'],
        cover: ''
      },
      {
        id: '06',
        title: 'Scroll Narrative',
        category: '滚动叙事 / 动效',
        year: '2024',
        href: '#',
        gradient: ['#13293d', '#00f0b5'],
        cover: ''
      }
    ]
  },

  /* ---------- 能力 Services ---------- */
  services: {
    label: '(What I do)',
    title: 'Services',
    items: [
      { no: '01', title: '界面设计', desc: '界面视觉、组件规范、响应式排版与设计交付。' },
      { no: '02', title: '交互原型', desc: '把流程与状态做成可点击原型，提前验证体验。' },
      { no: '03', title: '动效实现', desc: '滚动叙事、微交互与页面转场，用代码实现动画。' },
      { no: '04', title: '前端开发', desc: '语义化 HTML、现代 CSS 与原生 JS，模块化易维护。' }
    ]
  },

  /* ---------- 荣誉 Awards ---------- */
  awards: {
    label: '(Recognition)',
    title: 'Awards & 经历',
    note: '占位示例，替换为你的真实获奖与经历',
    items: [
      { no: '01', title: '校园数字媒体作品展 · 优秀奖', year: '2026', org: '南充电影工业职业学院' },
      { no: '02', title: '界面设计课程 · 课程最佳作品', year: '2025', org: '界面设计与交互课程' },
      { no: '03', title: '短视频包装设计 · 入围', year: '2025', org: '校级数字创意赛' }
    ]
  },

  /* ---------- 联系 Contact ---------- */
  contact: {
    label: '(Contact)',
    big: "Let's work\ntogether.",
    email: 'xuqiuyuan@example.com',
    emailLabel: 'xuqiuyuan@example.com',
    socials: [
      { name: '微信', handle: 'xuqiuyuan', href: '#' },
      { name: 'GitHub', handle: '@xuqiuyuan', href: '#' },
      { name: '小红书', handle: '@许秋泉', href: '#' }
    ],
    location: '南充 · 四川 · 中国',
    localTime: true
  },

  /* ---------- 模块装载顺序（对应 modules/*.html，想调顺序就改这里） ---------- */
  modules: [
    'a-hero',
    'b-about',
    'c-works',
    'd-services',
    'e-awards',
    'f-contact'
  ],

  /* ---------- 自定义光标 ---------- */
  cursor: {
    enabled: true,
    label: 'View',
    hoverLabel: 'Open'
  },

  /* ---------- 加载动画 ---------- */
  preloader: {
    enabled: true,
    text: '许秋泉',
    counter: true
  },

  /* ---------- 主题（配色） ---------- */
  theme: {
    /* 深蓝 + 青色 */
    bg: '#050b1c',
    bgSoft: '#0a1533',
    text: '#eaf1ff',
    muted: '#8ea6cf',
    accent: '#00e0ff',
    accentSoft: '#5b8cff',
    line: 'rgba(140,170,220,0.18)'
  }
};
