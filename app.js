/* =========================================================================
   YUKIS KIKIS · app.js
    1) Configuración editable        7) Carrito (editable)
    2) Catálogo y precios            8) Personalizador "Arma tu Antojo"
    3) Utilidades                    9) Enviar pedido: pregunta previa + aviso final
    4) Navegación y UI              10) Horario y estado en vivo
    5) Fotos con respaldos          11) Hero: video aleatorio controlado por scroll
    6) Menú y platillos listos      12) Soporte 3D futuro (Three.js + Draco)
   ========================================================================= */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     1 · CONFIGURACIÓN (edita aquí tus datos)
     ------------------------------------------------------------------------ */
  const CONFIG = {
    brand: 'Yukis Kikis',
    whatsapp: '528112345678',            // ← pon aquí tu número real: 52 + 10 dígitos, sin +, espacios ni guiones
    timezone: 'America/Monterrey',
    openMinutes: 15 * 60,                // 3:00 PM
    closeMinutes: 22 * 60 + 30,          // 10:30 PM
    closedDay: 1,                        // 0 = Domingo … 1 = Lunes (día de descanso)
    delivery: {                          // costo de envío en MXN
      pickup: { label: 'Pick-up', fee: 0 },
      z1: { label: 'Zona 1', fee: 25 },
      z2: { label: 'Zona 2', fee: 35 }
    },
    social: {                            // ← reemplaza por tus enlaces reales
      instagram: 'https://www.instagram.com/yukiskikis',
      facebook: 'https://www.facebook.com/yukiskikis',
      tiktok: 'https://www.tiktok.com/@yukiskikis'
    },
    heroVideos: [                        // se alternan entre visitas; usa ?video=yuki o ?video=crepa para forzar uno
      { key: 'crepa', src: './video_crepa_2.mp4', poster: './crepa_2.png' },
      { key: 'yuki', src: './video_yuki.mp4', poster: '' }
    ],
    video: {
      scrub: 0.5,                        // suavizado de GSAP ScrollTrigger (0.5 – 1)
      smoothing: 0.18,                   // suavizado de respaldo si GSAP no cargó
      loadTimeout: 9000,                 // ms de espera por video antes de probar el siguiente
      maxRetries: 3                      // reintentos automáticos si el video se pierde
    }
  };

  /* Soporte 3D para el futuro: pon enabled en true cuando tengas tu .glb (con o sin compresión Draco). */
  const FUTURE_3D = {
    enabled: false,
    modelPath: './crepa.glb',
    dracoPath: 'https://www.gstatic.com/draco/versioned/decoders/1.4.1/',
    targetSize: 2.2,
    keyLight: 0xFFC700,
    rimLight: 0xFF65A3
  };

  /* ------------------------------------------------------------------------
     2 · CATÁLOGO Y PRECIOS (todo en MXN, edítalo aquí)
     ------------------------------------------------------------------------ */
  const EXTRA = 10;                      // cada ingrediente extra

  /* Untables y toppings cuentan igual: todos son "toppings" / ingredientes */
  const INGREDIENTS = [
    { id: 'nutella', label: 'Nutella', icon: '🍫' },
    { id: 'cajeta', label: 'Cajeta', icon: '🍯' },
    { id: 'lechera', label: 'Lechera', icon: '🥛' },
    { id: 'queso', label: 'Queso Crema', icon: '🧀' },
    { id: 'fresas', label: 'Fresas', icon: '🍓' },
    { id: 'kiwi', label: 'Kiwi', icon: '🥝' },
    { id: 'mango', label: 'Mango', icon: '🥭' },
    { id: 'platano', label: 'Plátano', icon: '🍌' },
    { id: 'nuez', label: 'Nuez', icon: '🥜' },
    { id: 'nieve', label: 'Bola de Nieve', icon: '🍨' }
  ];

  /* Sabores del Yuki (un sabor por cucharón servido) */
  const FLAVORS = [
    { id: 'limon', label: 'Limón', icon: '🍋' },
    { id: 'fresa', label: 'Fresa', icon: '🍓' },
    { id: 'mango', label: 'Mango', icon: '🥭' },
    { id: 'pina', label: 'Piña', icon: '🍍' },
    { id: 'uva', label: 'Uva', icon: '🍇' },
    { id: 'tamarindo', label: 'Tamarindo', icon: '🌶️' },
    { id: 'sandia', label: 'Sandía', icon: '🍉' },
    { id: 'coco', label: 'Coco', icon: '🥥' },
    { id: 'kiwi', label: 'Kiwi', icon: '🥝' },
    { id: 'cereza', label: 'Cereza', icon: '🍒' }
  ];

  /* Tipos de antojo.
     · kind 'ing'     → precio base incluye N ingredientes; cada extra suma EXTRA (waffle y crepa).
     · kind 'sized'   → igual, pero el tamaño define base e ingredientes incluidos (fresas con crema).
     · kind 'flavors' → el tamaño define el precio y cuántos sabores caben (yuki). */
  const TYPES = {
    waffle: { label: 'Waffle Belga', icon: '🧇', kind: 'ing', base: 80, included: 2, steps: ['type', 'ing', 'review'] },
    crepa: { label: 'Crepa Francesa', icon: '🥞', kind: 'ing', base: 80, included: 2, steps: ['type', 'ing', 'review'] },
    fresas: {
      label: 'Fresas con Crema', icon: '🍓', kind: 'sized', steps: ['type', 'size', 'ing', 'review'],
      sizes: [
        { id: 'chica', label: 'Chica', base: 80, included: 1 },
        { id: 'grande', label: 'Grande', base: 100, included: 2 }
      ]
    },
    yuki: {
      label: 'Yuki', icon: '🍧', kind: 'flavors', steps: ['type', 'size', 'flavors', 'review'],
      sizes: [
        { id: 'chico', label: 'Chico', price: 40, max: 2 },
        { id: 'mediano', label: 'Mediano', price: 50, max: 3 },
        { id: 'grande', label: 'Grande', price: 90, max: 4 }
      ]
    }
  };
  const STEP_LABELS = { type: 'Antojo', size: 'Tamaño', ing: 'Toppings', flavors: 'Sabores', review: 'Pedir' };

  /* Fotos: se prueba cada archivo en orden y se usa el primero que exista.
     crop = recorte con CSS (x e y = punto de enfoque en %, z = zoom) para usar solo el platillo del póster. */
  const POSTER = {
    waffle: ['./POSTER WAFFLE_upscayl_4x_upscayl-standard-4x_2.jpg', './poster-waffle.jpg'],
    fresas: ['./POSTER FRESAS_upscayl_4x_upscayl-standard-4x_2.jpg', './poster-fresas.jpg'],
    mango: ['./MANGO_upscayl_4x_upscayl-standard-4x_2.jpg', './poster-mango.jpg']
  };
  const CROP = { x: 50, y: 55, z: 1.7 };

  /* Tarjetas del MENÚ (foto recortada + ingredientes) */
  const MENU = [
    {
      type: 'crepa', badge: 'Crepa Gourmet', emoji: '🥞',
      desc: 'Crepa francesa suave y delgada, hecha al momento y rellena de lo que más se te antoje.',
      photos: [{ src: './crepa.png' }],
      quick: { type: 'crepa', ingredients: ['nutella', 'fresas'] }
    },
    {
      type: 'waffle', badge: 'Waffle Belga', emoji: '🧇',
      desc: 'Dorado y crujiente por fuera, esponjoso por dentro. Pídelo con tus toppings favoritos.',
      photos: [...POSTER.waffle.map((src) => ({ src, crop: CROP })), { src: './wafle.png' }],
      quick: { type: 'waffle', ingredients: ['nutella', 'fresas'] }
    },
    {
      type: 'fresas', badge: 'Fresas con Crema', emoji: '🍓',
      desc: 'Fresas frescas del día con crema cremosita. Chicas o grandes, con los toppings que quieras.',
      photos: [...POSTER.fresas.map((src) => ({ src, crop: CROP })), { src: './fresas con crema.png', fit: 'contain' }],
      quick: { type: 'fresas', size: 'chica', ingredients: ['lechera'] }
    },
    {
      type: 'yuki', badge: 'Yuki', emoji: '🍧',
      desc: 'Nieve ultra fina en vaso. Elige tamaño y sabores: un sabor por cucharón servido.',
      photos: [{ src: './yuki limon.png', fit: 'contain' }],
      quick: { type: 'yuki', size: 'chico', flavors: ['limon'] }
    }
  ];

  /* Platillos YA HECHOS (se muestran con el póster completo, sin recortar, como anuncios).
     Ajusta nombre y contenido para que coincidan con lo que dice cada póster. */
  const PROMOS = [
    { id: 'promo-waffle', name: 'Waffle Belga Especial', emoji: '🧇', photos: POSTER.waffle.map((src) => ({ src })),
      spec: { type: 'waffle', ingredients: ['nutella', 'fresas', 'kiwi'] } },
    { id: 'promo-fresas', name: 'Fresas con Crema Especial', emoji: '🍓', photos: POSTER.fresas.map((src) => ({ src })),
      spec: { type: 'fresas', size: 'grande', ingredients: ['lechera', 'nuez'] } },
    { id: 'promo-mango', name: 'Yuki de Mango', emoji: '🥭', photos: POSTER.mango.map((src) => ({ src })),
      spec: { type: 'yuki', size: 'mediano', flavors: ['mango', 'limon'] } }
  ];

  /* ------------------------------------------------------------------------
     3 · UTILIDADES
     ------------------------------------------------------------------------ */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const waUrl = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  const byId = (list, id) => list.find((o) => o.id === id);
  const labels = (list, ids) => ids.map((id) => byId(list, id).label);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* sin almacenamiento */ } }
  };

  document.documentElement.classList.add('js');
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2800);
  }

  function wireLinks() {
    $$('[data-wa]').forEach((a) => { a.href = waUrl(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
    $$('[data-social]').forEach((a) => { a.href = CONFIG.social[a.dataset.social] || '#'; });
  }

  const scrollToEl = (sel) => {
    const el = $(sel);
    if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  /* ---- Precios ---- */
  const normalizeSpec = (spec) => {
    const t = TYPES[spec.type];
    const out = { type: spec.type, size: null, ingredients: [], flavors: [] };
    if (t.sizes) out.size = byId(t.sizes, spec.size) ? spec.size : t.sizes[0].id;
    if (t.kind === 'ing' || t.kind === 'sized') out.ingredients = INGREDIENTS.map((i) => i.id).filter((id) => (spec.ingredients || []).includes(id));
    if (t.kind === 'flavors') {
      const max = byId(t.sizes, out.size).max;
      out.flavors = FLAVORS.map((f) => f.id).filter((id) => (spec.flavors || []).includes(id)).slice(0, max);
    }
    return out;
  };

  /* Devuelve precio, cuántos incluye, extras y mensajes para mostrar */
  function pricing(rawSpec) {
    const spec = normalizeSpec(rawSpec);
    const t = TYPES[spec.type];
    if (t.kind === 'flavors') {
      const sz = byId(t.sizes, spec.size);
      const n = spec.flavors.length;
      return { price: sz.price, count: n, max: sz.max, extras: 0, valid: n >= 1 && n <= sz.max,
        hint: `Yuki ${sz.label} · ${n} de ${sz.max} sabores (un sabor por cucharón)`, unit: 'sabores' };
    }
    const sz = t.sizes ? byId(t.sizes, spec.size) : t;
    const n = spec.ingredients.length;
    const extras = Math.max(0, n - sz.included);
    const hint = extras
      ? `${n} toppings · incluye ${sz.included} + ${extras} extra${extras > 1 ? 's' : ''} (${money(extras * EXTRA)})`
      : `${n} de ${sz.included} toppings incluidos · cada extra +${money(EXTRA)}`;
    return { price: sz.base + extras * EXTRA, count: n, max: Infinity, included: sz.included, extras, valid: n >= 1, hint, unit: 'toppings' };
  }

  const specName = (spec) => {
    const t = TYPES[spec.type];
    const sz = t.sizes ? byId(t.sizes, spec.size) : null;
    return sz ? `${t.label} ${sz.label}` : t.label;
  };
  const specLines = (spec) => {
    const t = TYPES[spec.type];
    return t.kind === 'flavors'
      ? [`Sabores: ${labels(FLAVORS, spec.flavors).join(', ')}`]
      : [`Toppings: ${labels(INGREDIENTS, spec.ingredients).join(', ')}`];
  };
  const specId = (spec) => `${spec.type}|${spec.size || ''}|${spec.ingredients.join(',')}|${spec.flavors.join(',')}`;

  function defaultSpec(type) {
    const t = TYPES[type];
    if (t.kind === 'flavors') return { type, size: t.sizes[0].id, ingredients: [], flavors: ['limon'] };
    if (t.kind === 'sized') return { type, size: t.sizes[0].id, ingredients: ['lechera'], flavors: [] };
    return { type, size: null, ingredients: ['nutella', 'fresas'], flavors: [] };
  }
  const minPrice = (type) => {
    const t = TYPES[type];
    return t.sizes ? Math.min(...t.sizes.map((s) => s.base || s.price)) : t.base;
  };
  function ruleText(type) {
    const t = TYPES[type];
    if (t.kind === 'flavors') return `${t.sizes.map((s) => `${s.label} ${money(s.price)}`).join(' · ')} · un sabor por cucharón`;
    if (t.kind === 'sized') return `${t.sizes.map((s) => `${s.label} ${money(s.base)} (${s.included} topping${s.included > 1 ? 's' : ''})`).join(' · ')} · extra +${money(EXTRA)}`;
    return `Hasta ${t.included} toppings ${money(t.base)} · 3 toppings ${money(t.base + EXTRA)} · cada extra +${money(EXTRA)}`;
  }

  /* ------------------------------------------------------------------------
     4 · NAVEGACIÓN Y UI
     ------------------------------------------------------------------------ */
  const nav = $('#nav');
  const navLinks = $('#nav-links');
  const burger = $('#burger');

  function setMenu(open) {
    navLinks.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.nav')) setMenu(false); });

  /* Scroll ligero: se guardan las posiciones de las secciones y solo se escribe lo que cambia */
  const progressBar = $('#scroll-progress');
  const spyIds = ['inicio', 'menu', 'personaliza', 'marca', 'horario', 'ubicacion'];
  const spyLinks = $$('[data-spy]');
  let spyTops = [];
  let docMax = 1;
  let lastSpy = '';
  let lastScrolled = null;
  function measure() {
    spyTops = spyIds.map((id) => { const el = document.getElementById(id); return { id, top: el ? el.getBoundingClientRect().top + window.scrollY : Infinity }; });
    docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }
  function onScroll() {
    const y = window.scrollY;
    const scrolled = y > 40;
    if (scrolled !== lastScrolled) { nav.classList.toggle('is-scrolled', scrolled); lastScrolled = scrolled; }
    progressBar.style.transform = `scaleX(${clamp(y / docMax, 0, 1)})`;
    const probe = y + window.innerHeight * 0.4;
    let current = 'inicio';
    for (const s of spyTops) if (s.top <= probe) current = s.id;
    if (current !== lastSpy) { lastSpy = current; spyLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.spy === current)); }
  }
  let scrollTick = false;
  window.addEventListener('scroll', () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => { onScroll(); scrollTick = false; });
  }, { passive: true });
  window.addEventListener('resize', () => { measure(); onScroll(); });
  window.addEventListener('load', () => { measure(); onScroll(); });

  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  $('#year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------------
     5 · FOTOS CON RESPALDOS
     Cada foto prueba sus archivos en orden. Si ninguno existe, muestra un cuadro con emoji
     (nunca una imagen rota).
     ------------------------------------------------------------------------ */
  function photoHTML(cands, emoji, alt, cls = '') {
    return `<div class="photo ${cls}" data-cands="${esc(JSON.stringify(cands))}" data-emoji="${emoji}">
      <img alt="${esc(alt)}" decoding="async" />
    </div>`;
  }
  function wirePhotos(root) {
    $$('.photo[data-cands]', root).forEach((frame) => {
      const img = $('img', frame);
      const cands = JSON.parse(frame.dataset.cands);
      let i = 0;
      const next = () => {
        if (i >= cands.length) { frame.classList.add('is-broken'); img.removeAttribute('src'); return; }
        const c = cands[i++];
        frame.classList.toggle('is-crop', Boolean(c.crop));
        frame.classList.toggle('is-contain', c.fit === 'contain');
        if (c.crop) { frame.style.setProperty('--fx', `${c.crop.x}%`); frame.style.setProperty('--fy', `${c.crop.y}%`); frame.style.setProperty('--z', c.crop.z); }
        img.src = encodeURI(c.src);
      };
      img.addEventListener('load', () => frame.classList.add('is-loaded'));
      img.addEventListener('error', next);
      next();
    });
  }

  /* ------------------------------------------------------------------------
     6 · MENÚ Y PLATILLOS LISTOS
     ------------------------------------------------------------------------ */
  function renderMenu() {
    $('#menu-grid').innerHTML = MENU.map((m) => {
      const t = TYPES[m.type];
      const chips = (t.kind === 'flavors' ? FLAVORS : INGREDIENTS).map((o) => `<li>${o.icon} ${esc(o.label)}</li>`).join('');
      const quick = pricing(m.quick);
      return `<article class="card">
        <div class="card-media">
          <span class="badge">${esc(m.badge)}</span>
          ${photoHTML(m.photos, m.emoji, `${t.label} de Yukis Kikis`)}
        </div>
        <div class="card-body">
          <h3>${esc(t.label)}</h3>
          <p>${esc(m.desc)}</p>
          <p class="chips-title">${t.kind === 'flavors' ? 'Sabores' : 'Toppings'}</p>
          <ul class="chips">${chips}</ul>
          <p class="rule">${esc(ruleText(m.type))}</p>
          <div class="card-foot">
            <span class="price"><small>Desde</small> ${money(minPrice(m.type))}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn btn-red" data-quick="${m.type}" aria-label="Agregar ${esc(specName(m.quick))} al carrito (${money(quick.price)})">
              <i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Agregar ${money(quick.price)}
            </button>
            <button type="button" class="btn btn-yellow" data-build="${m.type}">Armar el mío</button>
          </div>
        </div>
      </article>`;
    }).join('');
    wirePhotos($('#menu-grid'));
  }

  function renderPromos() {
    $('#promo-grid').innerHTML = PROMOS.map((p) => {
      const spec = normalizeSpec(p.spec);
      const pr = pricing(spec);
      return `<article class="promo">
        <div class="promo-media">
          ${photoHTML(p.photos, p.emoji, `Póster de ${p.name}`, 'is-poster')}
        </div>
        <div class="promo-body">
          <h3>${esc(p.name)}</h3>
          <p>${esc(specName(spec))} · ${esc(specLines(spec)[0])}</p>
          <div class="promo-foot">
            <span class="price">${money(pr.price)}<small>MXN</small></span>
            <div class="promo-actions">
              <button type="button" class="btn btn-red" data-promo="${p.id}"><i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Agregar</button>
              <button type="button" class="btn btn-ghost-dark" data-promo-edit="${p.id}">Editar</button>
            </div>
          </div>
        </div>
      </article>`;
    }).join('');
    wirePhotos($('#promo-grid'));
  }
  renderMenu();
  renderPromos();

  if (hasGsap && !reducedMotion) {
    gsap.from('#menu-grid .card', { y: 46, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '#menu-grid', start: 'top 85%', once: true } });
  }

  /* ------------------------------------------------------------------------
     7 · CARRITO (editable)
     ------------------------------------------------------------------------ */
  let cart = [];                                   // [{ id, name, lines[], price, qty, spec }]
  let deliveryKey = 'pickup';
  const CART_KEY = 'yukiskikis_cart_v3';
  const NOTES_KEY = 'yukiskikis_notes_v3';

  const cartModal = $('#cart-modal');
  const cartOverlay = $('#cart-overlay');
  const cartList = $('#cart-list');
  const cartEmpty = $('#cart-empty');
  const cartFoot = $('#cart-foot');
  const cartCount = $('#cart-count');
  const cartNotes = $('#cart-notes');
  const cartOpenBtn = $('#cart-open');
  let lastFocus = null;

  function makeItem(rawSpec, qty = 1) {
    const spec = normalizeSpec(rawSpec);
    return { id: specId(spec), name: specName(spec), lines: specLines(spec), price: pricing(spec).price, qty, spec };
  }
  function loadCart() {
    try {
      const saved = JSON.parse(store.get(CART_KEY) || '[]');
      if (Array.isArray(saved)) {
        cart = saved.filter((i) => i && i.spec && TYPES[i.spec.type] && Number.isInteger(i.qty) && i.qty > 0).map((i) => makeItem(i.spec, i.qty));
      }
    } catch (_) { cart = []; }
    cartNotes.value = store.get(NOTES_KEY) || '';
  }
  const saveCart = () => store.set(CART_KEY, JSON.stringify(cart.map((i) => ({ spec: i.spec, qty: i.qty }))));

  const cartUnits = () => cart.reduce((n, i) => n + i.qty, 0);
  const cartSubtotal = () => cart.reduce((n, i) => n + i.price * i.qty, 0);
  const cartFee = () => CONFIG.delivery[deliveryKey].fee;

  function orderMessage() {
    const d = CONFIG.delivery[deliveryKey];
    const lines = cart.map((i) => {
      const unit = i.qty > 1 ? ` (${money(i.price)} c/u)` : '';
      return `• ${i.qty} x ${i.name} — ${money(i.price * i.qty)}${unit}\n${i.lines.map((l) => `   ${l}`).join('\n')}`;
    });
    const notes = cartNotes.value.trim();
    return `¡Hola ${CONFIG.brand}! 🧇 Quiero hacer este pedido:\n\n${lines.join('\n')}\n\n` +
      `Subtotal: ${money(cartSubtotal())}\n` +
      `Entrega: ${d.label}${d.fee ? ` (${money(d.fee)})` : ' (gratis)'}\n` +
      `*Total: ${money(cartSubtotal() + d.fee)}*` +
      (notes ? `\n\nNotas: ${notes}` : '') +
      `\n\n¿Me confirman tiempo de entrega? ¡Gracias!`;
  }

  function renderCart() {
    const units = cartUnits();
    cartCount.textContent = String(units);
    cartCount.classList.toggle('is-empty', units === 0);
    cartOpenBtn.setAttribute('aria-label', units ? `Abrir carrito, ${units} artículos` : 'Abrir carrito');

    cartList.innerHTML = cart.map((i) => `
      <li class="cart-item" data-id="${esc(i.id)}">
        <div>
          <h3>${esc(i.name)}</h3>
          ${i.lines.map((l) => `<small>${esc(l)}</small>`).join('')}
          ${i.qty > 1 ? `<small class="unit">${money(i.price)} c/u</small>` : ''}
        </div>
        <span class="line-price">${money(i.price * i.qty)}</span>
        <div class="qty" role="group" aria-label="Cantidad de ${esc(i.name)}">
          <button type="button" data-qty="-1" data-id="${esc(i.id)}" aria-label="Quitar una unidad">−</button>
          <output>${i.qty}</output>
          <button type="button" data-qty="1" data-id="${esc(i.id)}" aria-label="Agregar una unidad">+</button>
        </div>
        <div class="cart-item-actions">
          <button type="button" class="cart-link" data-edit="${esc(i.id)}">✏️ Editar</button>
          <button type="button" class="cart-link cart-remove" data-remove="${esc(i.id)}">Quitar</button>
        </div>
      </li>`).join('');

    const empty = cart.length === 0;
    cartEmpty.hidden = !empty;
    cartFoot.classList.toggle('is-empty', empty);
    $('#cart-clear').hidden = empty;
    $('#cart-subtotal').textContent = money(cartSubtotal());
    $('#cart-fee').textContent = cartFee() ? money(cartFee()) : 'Gratis';
    $('#cart-total').textContent = money(cartSubtotal() + cartFee());
    $('#cart-wa').disabled = empty;
  }

  function addToCart(spec, qty = 1, silent = false) {
    const item = makeItem(spec, qty);
    const found = cart.find((i) => i.id === item.id);
    if (found) found.qty += qty; else cart.push(item);
    saveCart();
    renderCart();
    cartOpenBtn.classList.remove('is-bump');
    void cartOpenBtn.offsetWidth;                  // reinicia la animación
    cartOpenBtn.classList.add('is-bump');
    if (!silent) toast(`🛒 ${item.name} agregado · ${money(item.price)} (${cartUnits()} en tu pedido)`);
  }

  /* Reemplaza un artículo por su versión editada, conservando la cantidad */
  function replaceItem(oldId, spec) {
    const idx = cart.findIndex((i) => i.id === oldId);
    const qty = idx >= 0 ? cart[idx].qty : 1;
    if (idx >= 0) cart.splice(idx, 1);
    const item = makeItem(spec, qty);
    const found = cart.find((i) => i.id === item.id);
    if (found) found.qty += qty; else cart.splice(idx >= 0 ? idx : cart.length, 0, item);
    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
  }

  function openCart() {
    lastFocus = document.activeElement;
    cartModal.classList.add('is-open');
    cartOverlay.classList.add('is-open');
    cartModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-open');
    const first = $('.cart-close', cartModal);
    if (first) first.focus({ preventScroll: true });
  }
  function closeCart() {
    cartModal.classList.remove('is-open');
    cartOverlay.classList.remove('is-open');
    cartModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-open');
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  cartModal.addEventListener('change', (e) => {
    if (e.target.name === 'delivery') { deliveryKey = e.target.value; renderCart(); }
  });
  cartNotes.addEventListener('input', () => store.set(NOTES_KEY, cartNotes.value));

  /* ------------------------------------------------------------------------
     8 · PERSONALIZADOR "ARMA TU ANTOJO KIKIS"
     ------------------------------------------------------------------------ */
  const B = { type: 'waffle', size: null, ingredients: [], flavors: [], step: 0, editing: null };
  const bDots = $('#b-dots');
  const bPanel = $('#b-panel');
  const bPrev = $('#step-prev');
  const bNext = $('#step-next');
  const bAdd = $('#builder-add');
  const bReview = $('#builder-review');

  const bSpec = () => normalizeSpec({ type: B.type, size: B.size, ingredients: B.ingredients, flavors: B.flavors });
  const bSteps = () => TYPES[B.type].steps;

  function setBuilderSpec(spec) {
    const s = normalizeSpec(spec);
    B.type = s.type; B.size = s.size; B.ingredients = s.ingredients.slice(); B.flavors = s.flavors.slice();
  }

  function optCard(type, name, id, checked, icon, title, sub) {
    return `<label class="opt">
      <input type="${type}" name="${name}" value="${id}"${checked ? ' checked' : ''} />
      <span class="opt-card"><span class="ico" aria-hidden="true">${icon}</span><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>
    </label>`;
  }

  function renderDots() {
    const steps = bSteps();
    bDots.innerHTML = steps.map((id, i) => `
      <li><button type="button" class="${i === B.step ? 'is-current' : i < B.step ? 'is-done' : ''}" data-goto="${i}" ${i > B.step + 1 ? 'tabindex="-1"' : ''} aria-label="Paso ${i + 1}: ${STEP_LABELS[id]}">
        <b>${i + 1}</b><span>${STEP_LABELS[id]}</span>
      </button></li>`).join('');
  }

  function renderPanel() {
    const id = bSteps()[B.step];
    const t = TYPES[B.type];
    let html = '';
    if (id === 'type') {
      html = `<fieldset class="b-step"><legend>¿Qué se te antoja?</legend><div class="opts opts-4">` +
        Object.entries(TYPES).map(([k, v]) => optCard('radio', 'type', k, B.type === k, v.icon, v.label, `Desde ${money(minPrice(k))}`)).join('') +
        `</div></fieldset>`;
    } else if (id === 'size') {
      html = `<fieldset class="b-step"><legend>Elige el tamaño</legend><div class="opts opts-${t.sizes.length === 2 ? '2' : '3'}">` +
        t.sizes.map((s) => optCard('radio', 'size', s.id, B.size === s.id, s.id === t.sizes[0].id ? '🥤' : '🧋',
          `${s.label} · ${money(s.base || s.price)}`,
          t.kind === 'flavors' ? `Hasta ${s.max} sabor${s.max > 1 ? 'es' : ''}` : `Incluye ${s.included} topping${s.included > 1 ? 's' : ''}`)).join('') +
        `</div></fieldset>`;
    } else if (id === 'ing') {
      html = `<fieldset class="b-step"><legend>Escoge tus toppings <small>(untables y toppings cuentan igual)</small></legend>` +
        `<p class="b-counter" id="b-counter"></p><div class="opts opts-5">` +
        INGREDIENTS.map((o) => optCard('checkbox', 'ing', o.id, B.ingredients.includes(o.id), o.icon, o.label, '')).join('') +
        `</div></fieldset>`;
    } else if (id === 'flavors') {
      html = `<fieldset class="b-step"><legend>Elige tus sabores <small>(un sabor por cucharón)</small></legend>` +
        `<p class="b-counter" id="b-counter"></p><div class="opts opts-5">` +
        FLAVORS.map((o) => optCard('checkbox', 'flavor', o.id, B.flavors.includes(o.id), o.icon, o.label, '')).join('') +
        `</div></fieldset>`;
    } else {
      const spec = bSpec();
      const pr = pricing(spec);
      html = `<fieldset class="b-step"><legend>Revisa tu antojo</legend>
        <div class="b-summary"><h3>${esc(specName(spec))}</h3>${specLines(spec).map((l) => `<p>${esc(l)}</p>`).join('')}
        <p class="b-summary-price">${money(pr.price)}</p></div>
        <p class="b-tip">Puedes agregarlo a tu pedido, seguir pidiendo otras cosas y editarlo después desde el carrito.</p></fieldset>`;
    }
    bPanel.innerHTML = html;
    refreshBuilder();
  }

  /* Actualiza precio, contador y botones sin volver a dibujar el panel */
  function refreshBuilder() {
    const spec = bSpec();
    const pr = pricing(spec);
    const id = bSteps()[B.step];
    const last = B.step === bSteps().length - 1;
    $('#b-price').textContent = money(pr.price);
    $('#b-price-hint').textContent = pr.hint;
    $('#b-price-label').textContent = specName(spec);

    const counter = $('#b-counter');
    if (counter) {
      counter.textContent = id === 'flavors'
        ? `${pr.count} de ${pr.max} sabores`
        : `${pr.count} topping${pr.count === 1 ? '' : 's'} · ${pr.extras ? `${pr.extras} extra${pr.extras > 1 ? 's' : ''} (+${money(pr.extras * EXTRA)})` : `incluye ${pr.included}`}`;
    }
    const needs = (id === 'ing' || id === 'flavors') && !pr.valid;
    bPrev.hidden = B.step === 0;
    bNext.hidden = last;
    bNext.disabled = needs;
    bAdd.hidden = !last;
    bReview.hidden = !last;
    $('span', bAdd).textContent = B.editing ? 'Guardar cambios' : 'Agregar y seguir pidiendo';
    $('span', bReview).textContent = B.editing ? 'Guardar y revisar pedido' : 'Agregar y revisar pedido';
    $('#b-editing').hidden = !B.editing;
  }

  function goStep(n, byUser) {
    const steps = bSteps();
    B.step = clamp(n, 0, steps.length - 1);
    renderDots();
    renderPanel();
    if (byUser) {
      const top = $('#builder').getBoundingClientRect().top;
      if (top < 90) window.scrollBy({ top: top - 96, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }

  /* Abre el personalizador (desde el menú, un platillo listo o al editar un artículo del carrito) */
  function openBuilder(spec, opts = {}) {
    setBuilderSpec(spec);
    B.editing = opts.editing || null;
    goStep(opts.step ?? 1, false);
    scrollToEl('#personaliza');
  }
  function resetBuilder() {
    setBuilderSpec(defaultSpec('waffle'));
    B.editing = null;
    goStep(0, false);
  }

  $('#builder').addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'type') {
      setBuilderSpec(defaultSpec(t.value));
      renderDots();
    } else if (t.name === 'size') {
      B.size = t.value;
      if (TYPES[B.type].kind === 'flavors') B.flavors = B.flavors.slice(0, byId(TYPES[B.type].sizes, B.size).max);
    } else if (t.name === 'ing') {
      B.ingredients = $$('input[name="ing"]:checked', bPanel).map((i) => i.value);
    } else if (t.name === 'flavor') {
      const max = byId(TYPES[B.type].sizes, B.size).max;
      const picked = $$('input[name="flavor"]:checked', bPanel).map((i) => i.value);
      if (picked.length > max) {
        t.checked = false;
        toast(`Tu Yuki ${byId(TYPES[B.type].sizes, B.size).label} lleva hasta ${max} sabores. ¡Elige un tamaño más grande para más!`);
        return;
      }
      B.flavors = picked;
    }
    refreshBuilder();
  });
  bDots.addEventListener('click', (e) => {
    const b = e.target.closest('[data-goto]');
    if (!b) return;
    const to = Number(b.dataset.goto);
    const id = bSteps()[B.step];
    if (to > B.step && (id === 'ing' || id === 'flavors') && !pricing(bSpec()).valid) { toast('Elige al menos uno para continuar'); return; }
    goStep(to, true);
  });
  bPrev.addEventListener('click', () => goStep(B.step - 1, true));
  bNext.addEventListener('click', () => goStep(B.step + 1, true));

  function commitBuilder(thenReview) {
    const spec = bSpec();
    if (!pricing(spec).valid) { toast('Elige al menos un topping o sabor'); return; }
    const wasEditing = Boolean(B.editing);
    if (wasEditing) replaceItem(B.editing, spec); else addToCart(spec, 1, true);
    resetBuilder();
    if (thenReview) {
      openCart();
    } else {
      toast(wasEditing ? '✅ Cambios guardados en tu pedido' : '🛒 Agregado a tu pedido. ¡Sigue eligiendo!');
      scrollToEl('#menu');
    }
  }
  bAdd.addEventListener('click', () => commitBuilder(false));
  bReview.addEventListener('click', () => commitBuilder(true));

  /* ------------------------------------------------------------------------
     9 · ENVIAR PEDIDO: pregunta previa + aviso final
     ------------------------------------------------------------------------ */
  const askModal = $('#ask-modal');
  const orderModal = $('#order-modal');
  let orderTimer = 0;
  let modalReturnFocus = null;

  function showModal(el, focusSel) {
    modalReturnFocus = document.activeElement;
    el.hidden = false;
    document.body.classList.add('modal-open');
    $(focusSel, el).focus({ preventScroll: true });
  }
  function hideModal(el) {
    el.hidden = true;
    if (askModal.hidden && orderModal.hidden) document.body.classList.remove('modal-open');
    if (modalReturnFocus && modalReturnFocus.focus && document.contains(modalReturnFocus)) modalReturnFocus.focus({ preventScroll: true });
  }

  /* 1) Antes de mandar: ¿quiere añadir otra cosa? */
  function askBeforeSend() {
    if (!cart.length) { toast('Agrega algo a tu pedido primero 🧇'); return; }
    $('#ask-summary').textContent = `${cartUnits()} artículo${cartUnits() === 1 ? '' : 's'} · Total ${money(cartSubtotal() + cartFee())}`;
    showModal(askModal, '#ask-send');
  }

  /* 2) Abre WhatsApp en una pestaña nueva y luego muestra el aviso final */
  function sendOrder() {
    const a = document.createElement('a');
    a.href = waUrl(orderMessage());
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    clearTimeout(orderTimer);
    orderTimer = setTimeout(() => showModal(orderModal, '#order-more'), 600);
  }

  /* Un solo listener delegado para todos los botones de la página */
  document.addEventListener('click', (e) => {
    const q = e.target.closest('[data-quick]');
    if (q) { addToCart(MENU.find((m) => m.type === q.dataset.quick).quick); return; }
    const build = e.target.closest('[data-build]');
    if (build) { openBuilder(defaultSpec(build.dataset.build)); return; }
    const promo = e.target.closest('[data-promo]');
    if (promo) { addToCart(PROMOS.find((p) => p.id === promo.dataset.promo).spec); return; }
    const pEdit = e.target.closest('[data-promo-edit]');
    if (pEdit) { openBuilder(PROMOS.find((p) => p.id === pEdit.dataset.promoEdit).spec); toast('Personalízalo y agrégalo a tu pedido'); return; }

    const qty = e.target.closest('[data-qty]');
    if (qty) { changeQty(qty.dataset.id, Number(qty.dataset.qty)); return; }
    const rm = e.target.closest('[data-remove]');
    if (rm) { cart = cart.filter((i) => i.id !== rm.dataset.remove); saveCart(); renderCart(); return; }
    const ed = e.target.closest('[data-edit]');
    if (ed) {
      const item = cart.find((i) => i.id === ed.dataset.edit);
      if (item) { closeCart(); openBuilder(item.spec, { editing: item.id, step: 1 }); toast('✏️ Edita tu artículo y guarda los cambios'); }
      return;
    }
    if (e.target.closest('[data-cart-open]')) { openCart(); return; }
    if (e.target.closest('[data-cart-close]')) { closeCart(); return; }
    if (e.target.closest('#cart-clear')) { cart = []; saveCart(); renderCart(); toast('Pedido vacío'); return; }
    if (e.target.closest('#cart-more')) { closeCart(); scrollToEl('#menu'); toast('Elige lo que quieras agregar 🧇'); return; }
    if (e.target.closest('#cart-wa')) { askBeforeSend(); return; }

    if (e.target.closest('[data-ask-close]') || e.target.closest('#ask-back')) { hideModal(askModal); return; }
    if (e.target.closest('#ask-more')) { hideModal(askModal); closeCart(); scrollToEl('#menu'); toast('Elige lo que quieras agregar 🧇'); return; }
    if (e.target.closest('#ask-send')) { hideModal(askModal); sendOrder(); return; }

    if (e.target.closest('[data-order-close]') || e.target.closest('#order-more')) { hideModal(orderModal); closeCart(); return; }
    if (e.target.closest('#order-reset')) {
      hideModal(orderModal);
      cart = [];
      deliveryKey = 'pickup';
      $('input[name="delivery"][value="pickup"]').checked = true;
      cartNotes.value = '';
      store.set(NOTES_KEY, '');
      saveCart();
      renderCart();
      resetBuilder();
      closeCart();
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });   // de regreso a #inicio
      toast('¡Gracias! Te esperamos con más antojos 🧇');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!askModal.hidden) hideModal(askModal);
    else if (!orderModal.hidden) hideModal(orderModal);
    else if (cartModal.classList.contains('is-open')) closeCart();
  });

  loadCart();
  renderCart();
  resetBuilder();

  /* ------------------------------------------------------------------------
     10 · HORARIO Y ESTADO EN VIVO (zona horaria de Monterrey)
     ------------------------------------------------------------------------ */
  const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const fmtTime = (min) => {
    const h = Math.floor(min / 60), m = min % 60, h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  function monterreyNow() {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: CONFIG.timezone, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      return { day: WEEKDAY_INDEX[get('weekday')], minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')) };
    } catch (_) {
      const d = new Date();
      return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function nextOpening(now) {
    for (let off = 0; off <= 7; off++) {
      const day = (now.day + off) % 7;
      if (day === CONFIG.closedDay) continue;
      if (off === 0 && now.minutes >= CONFIG.openMinutes) continue;
      const when = off === 0 ? 'hoy' : off === 1 ? 'mañana' : `el ${DAY_NAMES[day]}`;
      return `${when} a las ${fmtTime(CONFIG.openMinutes)}`;
    }
    return `a las ${fmtTime(CONFIG.openMinutes)}`;
  }

  function updateLiveStatus() {
    const now = monterreyNow();
    const isOpen = now.day !== CONFIG.closedDay && now.minutes >= CONFIG.openMinutes && now.minutes < CONFIG.closeMinutes;
    const state = isOpen ? 'open' : 'closed';
    $('#live-pill').dataset.state = state;
    $('#footer-live').dataset.state = state;
    if (isOpen) {
      const left = CONFIG.closeMinutes - now.minutes;
      $('#live-text').textContent = '¡Abierto ahora!';
      $('#live-sub').textContent = left <= 30 ? `Cerramos pronto, a las ${fmtTime(CONFIG.closeMinutes)}. ¡Haz tu pedido ya!` : `Recibimos pedidos hasta las ${fmtTime(CONFIG.closeMinutes)} · Hora de Monterrey`;
      $('#footer-live-text').textContent = 'Abiertos y recibiendo órdenes';
    } else {
      const nxt = nextOpening(now);
      $('#live-text').textContent = 'Cerrado por ahora';
      $('#live-sub').textContent = `Abrimos ${nxt} · Hora de Monterrey`;
      $('#footer-live-text').textContent = `Cerrados · abrimos ${nxt}`;
    }
    $$('#hours-list li').forEach((li) => li.classList.toggle('is-today', Number(li.dataset.day) === now.day));
  }
  updateLiveStatus();
  setInterval(updateLiveStatus, 60000);

  /* ------------------------------------------------------------------------
     11 · HERO: VIDEO ALEATORIO A PANTALLA COMPLETA CONTROLADO POR SCROLL
     · Se alternan video_crepa_2.mp4 y video_yuki.mp4 (si uno falla, se prueba el otro).
     · El video se descarga completo a memoria (blob): así siempre se puede "saltar" a cualquier
       cuadro y el scroll va fluido, aunque el servidor no soporte rangos de bytes.
     · Si el video se pierde, se reintenta solo (sin tener que recargar la página).
     Consejo de exportación (ffmpeg) para el scrub más fluido, cada cuadro es clave:
       ffmpeg -i entrada.mp4 -an -vf "scale=960:-2,fps=30" -c:v libx264 -crf 28 \
              -g 1 -keyint_min 1 -pix_fmt yuv420p -movflags +faststart video_crepa_2.mp4
     ------------------------------------------------------------------------ */
  const hero = $('#inicio');
  const heroStage = $('#hero-sticky');
  const video = $('#scroll-video');
  const videoFallback = $('#video-fallback');
  const videoLoading = $('#video-loading');
  const beats = $$('.beat');
  const scrollHint = $('#scroll-hint');
  const meterFill = $('#hero-meter-fill');

  const heroState = {
    progress: 0, target: 0, current: 0, duration: 0, ready: false, failed: false, visible: true,
    beat: -1, raf: 0, gsapDriven: false, order: [], index: 0, token: 0, retries: 0, objectUrl: null
  };

  function applyHeroProgress(p) {
    heroState.progress = clamp(p, 0, 1);
    heroState.target = heroState.progress * heroState.duration;
    const idx = Math.min(beats.length - 1, Math.floor(heroState.progress * beats.length));
    if (idx !== heroState.beat) {
      heroState.beat = idx;
      beats.forEach((b, i) => b.classList.toggle('is-on', i === idx));
    }
    meterFill.style.transform = `scaleX(${heroState.progress})`;
    scrollHint.style.opacity = String(clamp(1 - heroState.progress * 6, 0, 1));
    if (heroState.failed || FUTURE_3D.enabled) {
      videoFallback.style.transform = `scale(${1 + heroState.progress * 0.18})`;
    }
  }

  /* Bucle de un solo fotograma por vez: no se pide otro "seek" hasta terminar el anterior */
  function tick() {
    heroState.raf = 0;
    if (!heroState.visible) return;
    if (heroState.ready && !heroState.failed) {
      const k = (heroState.gsapDriven || reducedMotion) ? 1 : CONFIG.video.smoothing;
      heroState.current += (heroState.target - heroState.current) * k;
      if (Math.abs(heroState.target - heroState.current) < 0.002) heroState.current = heroState.target;
      const t = clamp(heroState.current, 0, Math.max(0, heroState.duration - 0.05));
      if (!video.seeking && Math.abs(video.currentTime - t) > 1 / 45) {
        try { video.currentTime = t; } catch (_) { /* aún no se puede buscar */ }
      }
    }
    heroState.raf = requestAnimationFrame(tick);
  }
  const startTick = () => { if (!heroState.raf) heroState.raf = requestAnimationFrame(tick); };

  function useFallback(reason) {
    heroState.failed = true;
    heroState.ready = false;
    heroStage.classList.add('is-fallback');
    videoLoading.classList.add('is-done');
    if (reason) console.info('[Yukis Kikis] Video no disponible, se usa la foto de respaldo →', reason);
    applyHeroProgress(heroState.progress);
  }

  /* Orden de videos: forzado con ?video=, o el que NO se vio la última vez (así aparecen los dos) */
  function chooseVideoOrder() {
    const list = CONFIG.heroVideos;
    const forced = new URLSearchParams(window.location.search).get('video');
    let first = list.find((v) => v.key === forced);
    if (!first) {
      const last = store.get('yk_last_video');
      const pool = list.filter((v) => v.key !== last);
      const from = pool.length ? pool : list;
      first = from[Math.floor(Math.random() * from.length)];
    }
    return [first, ...list.filter((v) => v !== first)];
  }

  async function startHeroVideo(i) {
    const v = heroState.order[i];
    if (!v) { useFallback('ningún video disponible'); return; }
    heroState.index = i;
    heroState.ready = false;
    heroState.failed = false;
    heroState.duration = 0;
    heroStage.classList.remove('is-fallback');
    videoLoading.classList.remove('is-done');
    const token = ++heroState.token;
    const stale = () => token !== heroState.token;
    const fail = (why) => { if (stale()) return; cleanup(); console.info(`[Yukis Kikis] ${v.src}: ${why}`); startHeroVideo(i + 1); };

    if (v.poster) { video.poster = v.poster; videoFallback.src = v.poster; }
    else if (!videoFallback.getAttribute('src')) { videoFallback.src = (CONFIG.heroVideos.find((x) => x.poster) || {}).poster || ''; }

    let src = v.src;
    try {                                          // descarga completa a memoria (con file:// no se puede y se usa la ruta directa)
      const res = await fetch(v.src, { cache: 'force-cache' });
      if (stale()) return;
      if (!res.ok) { fail(`HTTP ${res.status}`); return; }
      const blob = await res.blob();
      if (stale()) return;
      if (heroState.objectUrl) URL.revokeObjectURL(heroState.objectUrl);
      heroState.objectUrl = URL.createObjectURL(new Blob([blob], { type: 'video/mp4' }));
      src = heroState.objectUrl;
    } catch (_) { /* se usa la ruta directa */ }
    if (stale()) return;

    const onReady = () => {
      if (stale() || !isFinite(video.duration) || video.duration <= 0) return;
      cleanup();
      heroState.duration = video.duration;
      heroState.ready = true;
      heroState.retries = 0;
      videoLoading.classList.add('is-done');
      store.set('yk_last_video', v.key);
      heroStage.dataset.video = v.key;
      video.pause();
      heroState.target = heroState.progress * heroState.duration;
      heroState.current = heroState.target;
      try { video.currentTime = heroState.target; } catch (_) { /* aún no se puede buscar */ }
      if (hasGsap) ScrollTrigger.refresh();
    };
    const onError = () => fail('error de reproducción');
    const timer = setTimeout(() => fail('tiempo de espera agotado'), CONFIG.video.loadTimeout);
    function cleanup() {
      clearTimeout(timer);
      ['loadedmetadata', 'loadeddata', 'canplay'].forEach((ev) => video.removeEventListener(ev, onReady));
      video.removeEventListener('error', onError);
    }
    ['loadedmetadata', 'loadeddata', 'canplay'].forEach((ev) => video.addEventListener(ev, onReady));
    video.addEventListener('error', onError);
    video.src = src;
    video.load();
    if (video.readyState >= 1) onReady();

    // Los navegadores móviles solo permiten buscar cuadros tras "reproducir" una vez
    const pr = video.play();
    if (pr && pr.then) pr.then(() => video.pause()).catch(() => {});
  }

  /* Si el video se pierde (error tardío, pestaña dormida, regreso con "atrás"), se reintenta solo */
  function recoverVideo(reason) {
    if (FUTURE_3D.enabled) return;
    if (heroState.ready && !video.error) { try { video.currentTime = heroState.current; } catch (_) { /* nada */ } return; }
    if (heroState.retries >= CONFIG.video.maxRetries) return;
    heroState.retries += 1;
    console.info(`[Yukis Kikis] Reintentando video (${reason}) #${heroState.retries}`);
    startHeroVideo(0);
  }
  video.addEventListener('error', () => { if (heroState.ready) { heroState.ready = false; recoverVideo('error tardío'); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) recoverVideo('pestaña activa'); });
  window.addEventListener('pageshow', (e) => { if (e.persisted) recoverVideo('pageshow'); });
  window.addEventListener('online', () => recoverVideo('conexión'));

  function heroScrollProgress() {
    const total = hero.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-hero.getBoundingClientRect().top / total, 0, 1) : 0;
  }

  function initHeroScroll() {
    if (hasGsap) {
      heroState.gsapDriven = true;
      const proxy = { p: 0 };
      gsap.to(proxy, {                             // el scroll mueve el progreso 0 → 1 (con suavizado "scrub")
        p: 1, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: CONFIG.video.scrub },
        onUpdate: () => applyHeroProgress(proxy.p)
      });
      if (!reducedMotion) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.hero-kicker', { y: 20, opacity: 0, duration: 0.6 })
          .from('.hero-beats', { y: 34, opacity: 0, duration: 0.8 }, '-=0.35')
          .from('.hero-actions', { y: 24, opacity: 0, duration: 0.6 }, '-=0.5')
          .from('.scroll-hint', { y: 16, opacity: 0, duration: 0.5 }, '-=0.2');
      }
    } else {
      window.addEventListener('scroll', () => applyHeroProgress(heroScrollProgress()), { passive: true });
      window.addEventListener('resize', () => applyHeroProgress(heroScrollProgress()));
      applyHeroProgress(heroScrollProgress());
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { heroState.visible = en.isIntersecting; if (heroState.visible) startTick(); }, { threshold: 0 }).observe(hero);
    }
    startTick();
  }

  initHeroScroll();
  if (FUTURE_3D.enabled) {
    videoLoading.classList.add('is-done');
  } else {
    heroState.order = chooseVideoOrder();
    startHeroVideo(0);
  }

  /* ------------------------------------------------------------------------
     12 · SOPORTE 3D FUTURO (Three.js r128 + GLTFLoader + DRACOLoader)
     Actívalo con FUTURE_3D.enabled = true y coloca tu archivo .glb en la carpeta.
     ------------------------------------------------------------------------ */
  function initFuture3D() {
    if (!FUTURE_3D.enabled) return;
    if (!window.THREE || !THREE.GLTFLoader || !THREE.DRACOLoader) {
      console.warn('[Yukis Kikis] Three.js, GLTFLoader o DRACOLoader no cargaron; se mantiene el video.');
      FUTURE_3D.enabled = false;
      heroState.order = chooseVideoOrder();
      startHeroVideo(0);
      return;
    }
    const canvas = $('#webgl-3d');
    canvas.hidden = false;
    heroStage.insertBefore(canvas, $('.hero-scrim'));
    heroStage.classList.add('is-fallback');

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.8, 5);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xffe3ee, 1.1));
    const key = new THREE.DirectionalLight(FUTURE_3D.keyLight, 1.6); key.position.set(3, 4, 3); scene.add(key);
    const rim = new THREE.PointLight(FUTURE_3D.rimLight, 1.4, 20); rim.position.set(-3, 1.5, -2); scene.add(rim);

    const draco = new THREE.DRACOLoader();            // decodificadores oficiales de Google (wasm con respaldo JS)
    draco.setDecoderPath(FUTURE_3D.dracoPath);
    const loader = new THREE.GLTFLoader();
    loader.setDRACOLoader(draco);

    const pivot = new THREE.Group();
    scene.add(pivot);
    loader.load(FUTURE_3D.modelPath, (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = FUTURE_3D.targetSize / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      pivot.add(model);
      heroStage.classList.remove('is-fallback');
      videoFallback.style.display = 'none';
      video.style.display = 'none';
    }, undefined, (err) => {
      console.warn('[Yukis Kikis] No se pudo cargar el modelo 3D; se muestra la foto.', err);
      canvas.hidden = true;
    });

    function resize() {
      const w = heroStage.clientWidth, h = heroStage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let spin = 0;
    (function loop() {
      requestAnimationFrame(loop);
      const p = heroScrollProgress();
      if (p >= 1 || (p <= 0 && window.scrollY > window.innerHeight)) return;   // fuera del hero no se dibuja
      spin += (p * Math.PI * 2 + 0.4 - spin) * 0.08;
      pivot.rotation.y = spin;
      pivot.rotation.x = Math.sin(p * Math.PI) * 0.25;
      camera.position.z = 5 - p * 1.2;
      renderer.render(scene, camera);
    })();
  }
  initFuture3D();

  /* ------------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------------ */
  wireLinks();
  measure();
  onScroll();
  if (hasGsap) window.addEventListener('load', () => ScrollTrigger.refresh());
})();
