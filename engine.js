/* ============================================================
   engine.js —— 交互引擎（一般不需要改这里）
   负责：模块加载 / 动态背景 / 自定义光标 / 预加载 /
         滚动揭示 / 磁性按钮 / 本地时间 / 菜单
   ============================================================ */
(function () {
  'use strict';

  const CFG = window.SITE || {};
  const TH = CFG.theme || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* 把配置里的颜色写进 CSS 变量 —— 改配色只改 site.config.js */
  function applyTheme() {
    const r = document.documentElement.style;
    r.setProperty('--bg', TH.bg || '#050b1c');
    r.setProperty('--bg-soft', TH.bgSoft || '#0a1533');
    r.setProperty('--text', TH.text || '#eaf1ff');
    r.setProperty('--muted', TH.muted || '#8ea6cf');
    r.setProperty('--accent', TH.accent || '#00e0ff');
    r.setProperty('--accent-soft', TH.accentSoft || '#5b8cff');
    r.setProperty('--line', TH.line || 'rgba(140,170,220,0.18)');
  }

  /* ---------- 模块加载器：modules/ 下每个 html 自动注入并渲染 ---------- */
  async function loadModules() {
    const list = CFG.modules || [];
    const host = document.getElementById('app');
    for (const name of list) {
      try {
        const res = await fetch(`modules/${name}.html`, { cache: 'no-cache' });
        if (!res.ok) throw new Error(res.status);
        let html = await res.text();
        /* 用 site.config.js 的数据填充 {{ }} 占位符 */
        if (window.renderModule) html = window.renderModule(html, CFG);
        const frag = document.createRange().createContextualFragment(html);
        host.appendChild(frag);
      } catch (e) {
        console.warn('[engine] 模块加载失败:', name, e);
      }
    }
    document.dispatchEvent(new CustomEvent('modules:ready'));
  }

  /* ---------- 动态渐变背景（canvas 流体光斑，替代重型 WebGL 库） ---------- */
  function initBackdrop() {
    const cv = document.getElementById('bg-canvas');
    if (!cv || reduceMotion) return;
    const ctx = cv.getContext('2d', { alpha: false });
    let w, h, dpr, t = 0, raf;

    const hex = (c) => {
      const s = String(c).replace('#', '');
      return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    };
    const A = hex(TH.accent || '#00e0ff');
    const B = hex(TH.accentSoft || '#5b8cff');
    const BG = hex(TH.bg || '#050b1c');

    const blobs = [
      { x: 0.24, y: 0.28, r: 0.44, c: A, sp: 0.00021, ph: 0 },
      { x: 0.76, y: 0.24, r: 0.38, c: B, sp: 0.00017, ph: 2.1 },
      { x: 0.56, y: 0.78, r: 0.50, c: A, sp: 0.00013, ph: 4.2 },
      { x: 0.14, y: 0.82, r: 0.32, c: B, sp: 0.00025, ph: 5.5 }
    ];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = cv.width = Math.max(1, Math.floor(innerWidth * dpr));
      h = cv.height = Math.max(1, Math.floor(innerHeight * dpr));
      cv.style.width = innerWidth + 'px';
      cv.style.height = innerHeight + 'px';
    }

    function frame() {
      t++;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgb(${BG[0]},${BG[1]},${BG[2]})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const b of blobs) {
        const px = (b.x + Math.sin(t * b.sp * 6.28 + b.ph) * 0.12) * w;
        const py = (b.y + Math.cos(t * b.sp * 4.9 + b.ph) * 0.10) * h;
        const rad = b.r * Math.min(w, h) * (1 + Math.sin(t * b.sp * 3.1 + b.ph) * 0.12);
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0.30)`);
        g.addColorStop(0.55, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0.09)`);
        g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { cancelAnimationFrame(raf); frame(); }
    });
  }

  /* ---------- 自定义光标 ---------- */
  function initCursor() {
    const cfg = CFG.cursor || {};
    if (!cfg.enabled || isTouch) return;
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const label = document.getElementById('cursor-label');
    if (!dot || !ring) return;

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, visible = false;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      if (!visible) { visible = true; dot.style.opacity = ring.style.opacity = '1'; }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = ring.style.opacity = '0';
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();

    const sel = 'a, button, [data-cursor], .work-row__link, .magnetic';
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest(sel);
      if (!el) return;
      ring.classList.add('is-hover');
      if (label) {
        label.textContent = el.dataset.cursor || cfg.hoverLabel || 'Open';
        label.style.opacity = '1';
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (!e.target.closest(sel)) return;
      ring.classList.remove('is-hover');
      if (label) label.style.opacity = '0';
    });

    window.addEventListener('mousedown', () => ring.classList.add('is-down'));
    window.addEventListener('mouseup', () => ring.classList.remove('is-down'));
  }

  /* ---------- 预加载器 ---------- */
  function initPreloader() {
    const cfg = CFG.preloader || {};
    const el = document.getElementById('preloader');
    if (!el || !cfg.enabled) { if (el) el.remove(); return; }

    const num = el.querySelector('.preloader__num');
    const bar = el.querySelector('.preloader__bar span');
    const dur = 1200;
    const t0 = performance.now();
    document.body.classList.add('is-loading');

    function finish() {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      el.classList.add('is-done');
      document.body.classList.remove('is-loading');
      setTimeout(() => { if (el.parentNode) el.remove(); }, 900);
      document.dispatchEvent(new CustomEvent('site:reveal'));
    }

    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      if (num) num.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      if (bar) bar.style.transform = `scaleX(${eased})`;
      if (p < 1) requestAnimationFrame(tick);
      else finish();
    }(performance.now()));

    /* 兜底：动画卡住也能进场 */
    setTimeout(finish, 3600);
  }

  /* ---------- 滚动揭示 ---------- */
  function initReveal() {
    const bind = () => {
      const items = document.querySelectorAll('[data-reveal]:not(.is-in)');
      if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('is-in'));
        return;
      }
      items.forEach((el) => {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(en => {
            if (!en.isIntersecting) return;
            const delay = parseFloat(el.dataset.revealDelay || '0');
            setTimeout(() => el.classList.add('is-in'), delay);
            io.unobserve(el);
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        io.observe(el);
      });
    };
    bind();
    document.addEventListener('modules:ready', bind);

    /* 预加载结束后首屏标题逐词上浮 */
    document.addEventListener('site:reveal', () => {
      document.querySelectorAll('.hero__line-inner').forEach((el, i) => {
        setTimeout(() => el.classList.add('is-in'), i * 95);
      });
      document.querySelectorAll('[data-reveal-after-load]').forEach((el, i) => {
        setTimeout(() => el.classList.add('is-in'), i * 80);
      });
    });
  }

  /* ---------- 磁性按钮 ---------- */
  function initMagnetic() {
    if (isTouch) return;
    const bind = () => {
      document.querySelectorAll('.magnetic').forEach((el) => {
        if (el.dataset.mag) return;
        el.dataset.mag = '1';
        const strength = parseFloat(el.dataset.magStrength || '0.32');
        el.addEventListener('mousemove', (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * strength;
          const y = (e.clientY - r.top - r.height / 2) * strength;
          el.style.transform = `translate(${x}px, ${y}px)`;
          const inner = el.querySelector('.magnetic__in');
          if (inner) inner.style.transform = `translate(${(x * 0.35).toFixed(1)}px, ${(y * 0.35).toFixed(1)}px)`;
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = '';
          const inner = el.querySelector('.magnetic__in');
          if (inner) inner.style.transform = '';
        });
      });
    };
    bind();
    document.addEventListener('modules:ready', bind);
  }

  /* ---------- Hero 鼠标视差 ---------- */
  function initParallax() {
    if (isTouch || reduceMotion) return;
    const hero = document.querySelector('.hero__inner');
    if (!hero) return;
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / innerWidth - 0.5);
      const y = (e.clientY / innerHeight - 0.5);
      hero.style.setProperty('--px', (x * 16).toFixed(2) + 'px');
      hero.style.setProperty('--py', (y * 12).toFixed(2) + 'px');
    }, { passive: true });
  }

  /* ---------- 滚动进度条 + 顶栏状态 ---------- */
  function initProgress() {
    const bar = document.getElementById('scroll-progress');
    const header = document.getElementById('header');
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      const p = h > 0 ? scrollY / h : 0;
      if (bar) bar.style.transform = `scaleX(${p})`;
      if (header) header.classList.toggle('is-stuck', scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 移动端菜单 ---------- */
  function initMenu() {
    const btn = document.getElementById('menu-btn');
    const panel = document.getElementById('menu');
    if (!btn || !panel) return;
    const toggle = (open) => {
      const next = (open === undefined) ? !panel.classList.contains('is-open') : open;
      panel.classList.toggle('is-open', next);
      btn.classList.toggle('is-open', next);
      btn.setAttribute('aria-expanded', String(next));
      document.body.classList.toggle('no-scroll', next);
    };
    btn.addEventListener('click', () => toggle());
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
  }

  /* ---------- 锚点平滑滚动 ---------- */
  function initAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') { e.preventDefault(); return; }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ---------- 本地时间 ---------- */
  function initClock() {
    if (!CFG.contact || !CFG.contact.localTime) return;
    const bind = () => {
      document.querySelectorAll('[data-clock]').forEach((el) => {
        const tick = () => {
          const d = new Date();
          const p = (n) => String(n).padStart(2, '0');
          el.textContent = `当地时间 ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
        };
        tick();
        setInterval(tick, 1000);
      });
    };
    bind();
    document.addEventListener('modules:ready', bind);
  }

  /* ---------- 作品行：hover 缩略图跟随光标 + 高光 ---------- */
  function initCardGlow() {
    if (isTouch) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null, active = null;

    function loop() {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      if (active) active.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) translate(-50%, -50%)`;
      raf = active ? requestAnimationFrame(loop) : null;
    }

    const bind = () => {
      document.querySelectorAll('.work-row__link').forEach((row) => {
        if (row.dataset.glow) return;
        row.dataset.glow = '1';
        const thumb = row.querySelector('.work-row__thumb');
        row.addEventListener('mousemove', (e) => {
          tx = e.clientX; ty = e.clientY;
          if (thumb) {
            const r = row.getBoundingClientRect();
            thumb.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
            thumb.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
          }
        });
        row.addEventListener('mouseenter', () => {
          if (!thumb) return;
          active = thumb; cx = tx; cy = ty;
          thumb.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
          if (!raf) loop();
        });
        row.addEventListener('mouseleave', () => {
          if (active === thumb) active = null;
        });
      });
    };
    bind();
    document.addEventListener('modules:ready', bind);
  }

  /* ---------- 页脚大字：鼠标视差横移 ---------- */
  function initFooterParallax() {
    if (isTouch || reduceMotion) return;
    const el = document.querySelector('.footer__big');
    if (!el) return;
    let target = 0, cur = 0, raf = null;
    window.addEventListener('mousemove', (e) => {
      target = (e.clientX / innerWidth - 0.5) * -60;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    function loop() {
      cur += (target - cur) * 0.08;
      el.style.transform = `translateX(${cur.toFixed(2)}px)`;
      raf = Math.abs(target - cur) > 0.4 ? requestAnimationFrame(loop) : null;
    }
  }

  /* ---------- 免责声明弹层（Demo 提示） ---------- */
  function initNotice() {
    const btn = document.getElementById('notice-btn');
    const box = document.getElementById('notice');
    if (!btn || !box) return;
    const close = () => {
      box.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    };
    btn.addEventListener('click', () => {
      const open = !box.classList.contains('is-open');
      box.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    box.querySelector('.notice__close').addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ---------- 页脚年份 ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- 启动 ---------- */
  applyTheme();
  initBackdrop();
  initPreloader();
  initReveal();
  initCursor();
  initMagnetic();
  initParallax();
  initProgress();
  initMenu();
  initAnchors();
  initClock();
  initCardGlow();
  initFooterParallax();
  initNotice();
  initYear();
  loadModules();
})();
