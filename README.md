# 许秋泉 · 个人作品集站点

静态站点，零框架、零构建步骤。版式与交互参照 AW (wodniack.dev) 的创意开发作品集范式：大字号衬线标题、逐词遮罩上浮、hover 缩略图跟随光标、自定义光标、动态渐变背景、磁性按钮、滚动进度与描边巨型签名。

## 结构
```
index.html              入口：页头 / 预加载器 / 光标 / 背景画布 / Demo 提示
css/main.css            全局样式 + 配色变量 + 光标 / 预加载 / 页头 / 页脚
css/sections.css        各区块样式（按区块分组，注释标明对应模块）
js/site.config.js       ★ 所有文案、作品、奖项、社交、配色都在这里
js/template.js          极简模板渲染（{{ }} 占位符）
js/engine.js            交互引擎（一般不用改）
modules/a-hero.html     首屏
modules/b-about.html    简介 + 经历时间线
modules/c-works.html    作品列表
modules/d-services.html 能力
modules/e-awards.html   荣誉
modules/f-contact.html  联系 + 页脚
assets/                 放你自己的图片
部署教程.md             上线到 GitHub Pages 的步骤
```

## 改内容
只动 `js/site.config.js`，见《部署教程.md》第三节。

## 本地预览
```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```
（不要双击 index.html，file:// 下 fetch 会被浏览器拦截）

## 说明
作品 / 奖项 / 社交链接为占位示例，请替换为真实内容后再对外发布。
原站设计语言受其作者 Antoine Wodniack 版权保护，本站点为学习参考实现，请勿直接用于商业仿冒。
