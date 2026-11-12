/* ============================================================
   template.js —— 极简模板渲染
   模块 HTML 里写 {{ 路径 }}，这里用 site.config.js 的数据替换。
   路径支持点号，例如 {{ hero.subtitle }}、{{ works.items }}
   ============================================================ */
(function () {
  'use strict';

  const get = (obj, path) => {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  };

  const truthy = (v) => !(v == null || v === false || v === '' || (Array.isArray(v) && !v.length));

  function renderHTML(html, data) {
    /* 1) 块级循环：{{#each works.items}} ... {{/each}} */
    html = html.replace(/\{\{#each\s+([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_m, path, tpl) => {
      const list = get(data, path);
      if (!Array.isArray(list)) return '';
      return list.map((item, i) => {
        const body = tpl.replace(/\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_m2, k, yes) => {
          return truthy(get(item, k)) ? yes : '';
        });
        return body.replace(/\{\{\s*([@\w.]+)\s*\}\}/g, (_m3, key) => {
          if (key === '@index') return String(i + 1);
          if (key === '@i') return String(i);
          if (key === 'this') return item == null ? '' : String(item);
          const v = get(item, key);
          return v == null ? '' : String(v);
        });
      }).join('');
    });

    /* 2) 原始输出（不转义，支持 \n）：{{{ contact.big }}} */
    html = html.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_m, path) => {
      const v = get(data, path);
      return v == null ? '' : String(v).replace(/\n/g, '<br>');
    });

    /* 3) 条件：{{#if hero.cta}} ... {{/if}} */
    html = html.replace(/\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_m, path, yes) => {
      return truthy(get(data, path)) ? yes : '';
    });

    /* 4) 简单变量：{{ hero.title }} */
    html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, path) => {
      const v = get(data, path);
      return v == null ? '' : String(v);
    });

    return html;
  }

  /* 模块 HTML 加载完成后自动渲染（引擎在 fetch 之后调用） */
  window.renderModule = renderHTML;
})();
