/* ==========================================================================
   YUKIS KIKIS · app.js (versión definitiva)
   · Hero cinematográfico: Three.js r128 + GSAP ScrollTrigger (lienzo fijo)
   · Estudio 3D: Three.js + OrbitControls (arrastre 360°, zoom)
   · Interfaz comercial: galería, menú con filtros, personalizador, WhatsApp
   ========================================================================== */
(() => {
  'use strict';
  document.documentElement.classList.add('js');

  /* ------------------------------------------------------------------------
     CONFIGURACIÓN (edita aquí)
     ------------------------------------------------------------------------ */
  const CONFIG = {
    whatsapp: '528112345678',                 // número real con lada de país, sin + ni espacios
    whatsappDisplay: '+52 (81) 1234-5678',
    brand: 'Yukis Kikis',
    modelPath: './crepa.glb',
    logoPath: './logo.png',
    modelTimeoutMs: 12000,                    // pasado este tiempo se muestra la crepa de respaldo
    minLoaderMs: 1400,                        // tiempo mínimo del preloader
    timezone: 'America/Monterrey',
    openDays: [2, 3, 4, 5, 6, 0],             // martes a domingo (0 = domingo)
    openMinutes: 15 * 60,                     // 3:00 PM
    closeMinutes: 22 * 60 + 30                // 10:30 PM
  };

  /* Productos que existen en 3D (escena cinematográfica + estudio) */
  const PRODUCTS = {
    crepa: {
      name: 'Crepa Gourmet', icon: '🥞', short: 'Nutella, fresas y menta',
      title: 'Crepa París Nutella & Fresas', price: 85, priceLabel: 'Desde $85', accent: '#FF2A6D', img: './crepa.png',
      desc: 'Crepa delgadita y dorada a la mantequilla, abundante Nutella original, fresas de huerto y azúcar glass.'
    },
    waffle: {
      name: 'Waffle Belga', icon: '🧇', short: 'Belga con frutos rojos',
      title: 'Waffle Belga Supremo con Miel & Frutos', price: 95, priceLabel: 'Desde $95', accent: '#FFB300', img: './wafle.png',
      desc: 'Masa belga aireada con relieve profundo, glaseado brillante en cada celda, fresas y arándanos frescos.'
    },
    fresas: {
      name: 'Fresas con Crema', icon: '🍓', short: 'Crema tres leches artesanal',
      title: "Fresas con Crema 'Yukis Kikis'", price: 85, priceLabel: '$85', accent: '#FF2A6D', img: './fresas con crema.png',
      desc: 'Vaso transparente con abundantes capas de crema artesanal tres leches, fresas cosechadas del día y cucharita.'
    },
    yuki: {
      name: 'Yuki Limón', icon: '🍧', short: 'Nieve con limón y rodajas',
      title: 'Yuki Limón & Kiwi Especial', price: 45, priceLabel: '$45', accent: '#00E676', img: './yuki limon.png',
      desc: 'Nieve ultra-fina con jugo natural de limones de Colima, rodajas de kiwi fresco y hielo brillante. Con el sello Yukis Kikis.'
    }
  };

  /* Menú completo. Para usar una foto real en cualquier producto basta con poner su ruta en "image". */
  const MENU_ITEMS = [
    { id: 'yuki-limon', category: 'yukis', product: 'yuki', title: 'Yuki Limón & Kiwi Especial', badge: 'Fresco & Cítrico', accent: '#00E676', ink: '#03210f', emoji: '🍧', price: 45, image: './yuki limon.png',
      description: 'Nieve ultra-fina con jugo natural de limones de Colima, rodajas de kiwi fresco y toque efervescente.' },
    { id: 'yuki-chamoyada', category: 'yukis', product: 'yuki', title: 'Yuki Chamoyada Mango-Tamarindo', badge: 'Picosito & Dulce', accent: '#FFB300', ink: '#2a1c00', emoji: '🥭', price: 55, image: null,
      description: 'Hielo fino con pulpa natural de mango maduro, tamarindo agridulce, chamoy casero y banderilla.' },
    { id: 'yuki-fresa', category: 'yukis', product: 'yuki', title: 'Yuki Fresa Silvestre', badge: 'Favorito', accent: '#FF2A6D', ink: '#ffffff', emoji: '🍓', price: 45, image: null,
      description: 'Jarabe artesanal de fresas maduras con trozos de fruta macerada y fresa entera de corona.' },

    { id: 'crepa-paris', category: 'crepas', product: 'crepa', title: 'Crepa París Nutella & Fresas', badge: 'Foto real · 3D', accent: '#FF2A6D', ink: '#ffffff', emoji: '🥞', price: 85, image: './crepa.png',
      description: 'Crepa delgadita y dorada a la mantequilla, abundante Nutella original, fresas de huerto y azúcar glass.' },
    { id: 'crepa-cajeta', category: 'crepas', product: 'crepa', title: 'Crepa Celaya con Nuez Tostada', badge: 'Tradicional', accent: '#FFB300', ink: '#2a1c00', emoji: '🥞', price: 90, image: null,
      description: 'Cajeta quemada auténtica de leche de cabra, nuez pecana finamente picada y bola de helado.' },
    { id: 'crepa-frutos', category: 'crepas', product: 'crepa', title: 'Crepa Cheesecake & Zarzamora', badge: 'Gourmet', accent: '#A855F7', ink: '#ffffff', emoji: '🫐', price: 95, image: null,
      description: 'Rellena de suave crema cheesecake casera con salsa de zarzamoras y galleta Graham crujiente.' },

    { id: 'waffle-frutos', category: 'wafles', product: 'waffle', title: 'Waffle Belga Supremo con Miel & Frutos', badge: 'Foto real · 3D', accent: '#FF2A6D', ink: '#ffffff', emoji: '🧇', price: 95, image: './wafle.png',
      description: 'Masa belga aireada con relieve profundo, glaseado brillante en cada celda, fresas y arándanos.' },
    { id: 'waffle-kinder', category: 'wafles', product: 'waffle', title: 'Waffle Kinder Bueno & Avellanas', badge: 'Extremo', accent: '#FFB300', ink: '#2a1c00', emoji: '🍫', price: 110, image: null,
      description: 'Bañado en salsa de avellana tibia, barra crujiente Kinder Bueno, rebanadas de plátano y nuez tostada.' },
    { id: 'waffle-caramelo', category: 'wafles', product: 'waffle', title: 'Waffle Caramelo Salado & Nuez', badge: 'Dulce & Salado', accent: '#E08A00', ink: '#ffffff', emoji: '🍯', price: 90, image: null,
      description: 'Caramelo de mantequilla salada, plátano caramelizado a la plancha y bola de nieve cremosa.' },

    { id: 'fresas-kikis', category: 'fresas', product: 'fresas', title: "Fresas con Crema 'Yukis Kikis'", badge: 'Foto real · 3D', accent: '#FF2A6D', ink: '#ffffff', emoji: '🍓', price: 85, image: './fresas con crema.png',
      description: 'Vaso transparente con abundantes capas de crema artesanal tres leches, fresas cosechadas del día y cucharita.' },
    { id: 'fresas-royal', category: 'fresas', product: 'fresas', title: 'Fresas Royal Nutella & Oreo', badge: 'Irresistible', accent: '#D946EF', ink: '#ffffff', emoji: '🍪', price: 100, image: null,
      description: 'Vaso rebosante de fresas naturales, crema dulce, abundante Nutella y crujientes galletas Oreo.' },

    { id: 'malteada-kikis', category: 'bebidas', product: 'yuki', title: 'Malteada Espesa de Fresa & Vainilla', badge: '100% Nieve', accent: '#FF6FA5', ink: '#2b0a17', emoji: '🥤', price: 65, image: null,
      description: 'Elaborada con nieve artesanal, fresas naturales batidas al momento, crema chantilly y cereza.' }
  ];

  const CATEGORY_LABELS = { all: 'todo el menú', yukis: 'Yukis & Nieve', crepas: 'Crepas Gourmet', wafles: 'Wafles Belgas', fresas: 'Fresas con Crema', bebidas: 'Bebidas & Malteadas' };

  /* ------------------------------------------------------------------------
     UTILIDADES
     ------------------------------------------------------------------------ */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function toast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('is-show'), 2800);
  }

  function waUrl(text) { return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`; }
  function openWhatsApp(text) { window.open(waUrl(text), '_blank', 'noopener'); }
  function orderItem(title, price) {
    toast(`🍓 Abriendo WhatsApp con ${title}`);
    openWhatsApp(`¡Hola ${CONFIG.brand}! ✨ Quiero ordenar:\n\n*1x ${title}*\n- Precio: *$${price} MXN*\n\n¿Cuál es el tiempo de entrega a domicilio o para pasar a recoger?`);
  }

  /* ------------------------------------------------------------------------
     NAVEGACIÓN, AÑO, REVEAL, CLICKS DELEGADOS
     ------------------------------------------------------------------------ */
  const navEl = $('#nav');
  const burger = $('#nav-burger');
  const navLinks = $('#nav-links');

  function setNav(open) {
    navLinks.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    burger.innerHTML = `<i class="fa-solid ${open ? 'fa-xmark' : 'fa-bars'}"></i>`;
    navEl.classList.toggle('is-open', open);
  }
  burger.addEventListener('click', () => setNav(!navLinks.classList.contains('is-open')));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  const onScrollNav = () => navEl.classList.toggle('is-solid', window.scrollY > 40);
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* Enlace activo según la sección visible */
  if ('IntersectionObserver' in window) {
    const linkFor = { hero: 'hero', detalle: 'hero', selector: 'hero', 'estudio-3d': 'estudio-3d', galeria: 'galeria', beneficios: 'galeria', menu: 'menu', 'arma-antojo': 'arma-antojo', historia: 'historia', contacto: 'contacto' };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const target = linkFor[en.target.id];
        $$('a', navLinks).forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${target}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(linkFor).forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  $('#year').textContent = new Date().getFullYear();
  $('#wa-display').textContent = CONFIG.whatsappDisplay;

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* Clicks delegados: "Ver en 3D", pedir un producto, WhatsApp genérico */
  document.addEventListener('click', (e) => {
    const view = e.target.closest('[data-view3d]');
    if (view) { e.preventDefault(); view3D(view.dataset.view3d); return; }
    const order = e.target.closest('[data-order]');
    if (order) { orderItem(order.dataset.order, order.dataset.price); return; }
    const wa = e.target.closest('[data-wa]');
    if (wa) { e.preventDefault(); toast('💬 Abriendo WhatsApp…'); openWhatsApp(`¡Hola ${CONFIG.brand}! 🍓 ${wa.dataset.wa}`); }
  });

  /* ------------------------------------------------------------------------
     ESTADO EN VIVO (Monterrey)
     ------------------------------------------------------------------------ */
  function updateLiveStatus() {
    const box = $('#live-status'), text = $('#live-status-text');
    if (!box) return;
    let parts;
    try {
      parts = new Intl.DateTimeFormat('en-US', { timeZone: CONFIG.timezone, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    } catch (err) { return; }
    const get = (t) => parts.find((p) => p.type === t).value;
    const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    const minutes = (Number(get('hour')) % 24) * 60 + Number(get('minute'));
    const isOpenDay = CONFIG.openDays.includes(dayIdx);

    if (isOpenDay && minutes >= CONFIG.openMinutes && minutes < CONFIG.closeMinutes) {
      box.dataset.state = 'open';
      text.textContent = 'Abiertos y recibiendo órdenes';
      return;
    }
    box.dataset.state = 'closed';
    if (isOpenDay && minutes < CONFIG.openMinutes) { text.textContent = 'Cerrado ahora · Abrimos hoy a las 3:00 PM'; return; }
    const names = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    for (let i = 1; i <= 7; i++) {
      const d = (dayIdx + i) % 7;
      if (CONFIG.openDays.includes(d)) {
        text.textContent = `Cerrado ahora · Abrimos ${i === 1 ? 'mañana' : 'el ' + names[d]} a las 3:00 PM`;
        return;
      }
    }
  }
  updateLiveStatus();
  setInterval(updateLiveStatus, 60000);

  /* ------------------------------------------------------------------------
     MENÚ COMPLETO CON FILTROS
     ------------------------------------------------------------------------ */
  const menuGrid = $('#menu-grid');
  const menuCount = $('#menu-count');

  function renderMenu(category = 'all') {
    const list = category === 'all' ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === category);
    menuGrid.innerHTML = list.map((it, idx) => `
      <article class="card mcard" style="--accent:${it.accent};animation-delay:${idx * 60}ms">
        <div class="mcard-media">
          ${it.image
            ? `<img src="${esc(it.image)}" alt="${esc(it.title)}" loading="lazy" decoding="async" />`
            : `<div class="mcard-ph" aria-hidden="true"><span>${it.emoji}</span></div>`}
          <span class="badge" style="background:${it.accent};color:${it.ink}">${esc(it.badge)}</span>
          <button class="mcard-3d" type="button" data-view3d="${it.product}" title="Ver este producto en el estudio 3D"><i class="fa-solid fa-cube"></i><span>Ver 3D</span></button>
          <span class="price-float" style="color:${it.accent === '#00E676' ? '#00E676' : '#FF2A6D'}">$${it.price} <small>MXN</small></span>
        </div>
        <div class="mcard-body">
          <h3>${esc(it.title)}</h3>
          <p>${esc(it.description)}</p>
          <button class="btn btn-green btn-sm" type="button" data-order="${esc(it.title)}" data-price="${it.price}">
            <i class="fa-brands fa-whatsapp"></i><span>Pedir antojo</span>
          </button>
        </div>
      </article>`).join('');
    menuCount.textContent = `Mostrando ${list.length} ${list.length === 1 ? 'producto' : 'productos'} · ${CATEGORY_LABELS[category]}`;
  }

  $('#menu-filters').addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    $$('.pill', e.currentTarget).forEach((p) => p.classList.toggle('is-active', p === pill));
    renderMenu(pill.dataset.category);
  });
  renderMenu('all');

  /* ------------------------------------------------------------------------
     PERSONALIZADOR "ARMA TU ANTOJO KIKIS" · paso a paso
     ------------------------------------------------------------------------ */
  const BUILDER = {
    bases: [
      { id: 'waffle', label: 'Waffle Belga', msg: 'Waffle Belga Crujiente', icon: '🧇', note: 'Dorado, grueso y con relieve profundo' },
      { id: 'crepa', label: 'Crepa Francesa', msg: 'Crepa Francesa Suave', icon: '🥞', note: 'Delgada, ligera y con mantequilla' }
    ],
    sauces: [
      { id: 'nutella', label: 'Nutella', msg: 'Nutella de Avellana', icon: '🍫', note: 'Crema de avellana' },
      { id: 'cajeta', label: 'Cajeta', msg: 'Cajeta Quemada Celaya', icon: '🍯', note: 'Cajeta quemada' },
      { id: 'lechera', label: 'Lechera', msg: 'Leche Condensada', icon: '🥛', note: 'Leche condensada' },
      { id: 'queso', label: 'Queso Crema', msg: 'Queso Crema Suave', icon: '🧀', note: 'Suave y cremoso' }
    ],
    toppings: [
      { id: 'fresas', label: 'Fresas', msg: 'Fresas Naturales', icon: '🍓' },
      { id: 'kiwi', label: 'Kiwi', msg: 'Kiwi Fresco en Rodajas', icon: '🥝' },
      { id: 'mango', label: 'Mango', msg: 'Mango Dulce Manila', icon: '🥭' },
      { id: 'platano', label: 'Plátano', msg: 'Plátano en Rodajas', icon: '🍌' },
      { id: 'nuez', label: 'Nuez', msg: 'Nuez Pecana Tostada', icon: '🥜' },
      { id: 'nieve', label: 'Bola de Nieve', msg: 'Bola de Nieve Artesanal', icon: '🍨' }
    ]
  };
  const bState = { step: 1, base: 'waffle', sauce: 'nutella', toppings: ['fresas', 'kiwi', 'mango'] };
  const bForm = $('#builder-form');
  const bWa = $('#builder-wa');
  const bNotes = $('#builder-notes');
  const bStepEls = $$('.b-step', bForm);
  const bDots = $$('[data-step-dot]');
  const bPrev = $('#step-prev');
  const bNext = $('#step-next');

  function optHTML(type, name, o, checked, extra) {
    return `<label class="opt ${extra || ''}">
      <input type="${type}" name="${name}" value="${o.id}"${checked ? ' checked' : ''} />
      <span class="opt-card"><span class="ico" aria-hidden="true">${o.icon}</span><b>${esc(o.label)}</b>${o.note ? `<small>${esc(o.note)}</small>` : ''}</span>
    </label>`;
  }
  $('#opts-base').innerHTML = BUILDER.bases.map((o) => optHTML('radio', 'base', o, o.id === bState.base)).join('');
  $('#opts-sauce').innerHTML = BUILDER.sauces.map((o) => optHTML('radio', 'sauce', o, o.id === bState.sauce)).join('');
  $('#opts-topping').innerHTML = BUILDER.toppings.map((o) => optHTML('checkbox', 'topping', o, bState.toppings.includes(o.id), 'opt-topping')).join('');

  const findIn = (list, id) => list.find((o) => o.id === id);

  function builderMessage() {
    const base = findIn(BUILDER.bases, bState.base);
    const sauce = findIn(BUILDER.sauces, bState.sauce);
    const tops = bState.toppings.map((id) => findIn(BUILDER.toppings, id).msg);
    const notes = bNotes.value.trim();
    return `¡Hola ${CONFIG.brand}! 🧇 Armé mi postre personalizado:\n\n*Antojo Personalizado:*\n- Base: *${base.msg}*\n- Untable: *${sauce.msg}*\n- Toppings & Frutas: *${tops.length ? tops.join(', ') : 'Tradicional sin toppings extra'}*` +
      (notes ? `\n- Notas: *${notes}*` : '') +
      `\n\n¿Me confirman el costo total para ordenarlo? ¡Gracias!`;
  }

  function refreshBuilder() {
    const base = findIn(BUILDER.bases, bState.base);
    const sauce = findIn(BUILDER.sauces, bState.sauce);
    const tops = bState.toppings.map((id) => findIn(BUILDER.toppings, id).label);
    $('#builder-summary').textContent = `${base.label} con ${sauce.label}` + (tops.length ? ` y ${tops.join(', ')}.` : ', sin toppings extra.');
    bWa.href = waUrl(builderMessage());
  }

  function goStep(n, userAction) {
    bState.step = clamp(n, 1, 4);
    bStepEls.forEach((el) => el.classList.toggle('is-active', Number(el.dataset.step) === bState.step));
    bDots.forEach((d) => {
      const i = Number(d.dataset.stepDot);
      d.classList.toggle('is-current', i === bState.step);
      d.classList.toggle('is-done', i < bState.step);
    });
    bPrev.hidden = bState.step === 1;
    bNext.hidden = bState.step === 4;
    bWa.hidden = bState.step !== 4;
    refreshBuilder();
    if (userAction) {                                  // mantiene el panel a la vista al cambiar de paso
      const top = $('#builder').getBoundingClientRect().top;
      if (top < 80) window.scrollBy({ top: top - 96, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }

  bForm.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'base') bState.base = t.value;
    if (t.name === 'sauce') bState.sauce = t.value;
    if (t.name === 'topping') bState.toppings = $$('input[name="topping"]:checked', bForm).map((i) => i.value);
    refreshBuilder();
  });
  bNotes.addEventListener('input', refreshBuilder);
  bForm.addEventListener('submit', (e) => e.preventDefault());
  bPrev.addEventListener('click', () => goStep(bState.step - 1, true));
  bNext.addEventListener('click', () => goStep(bState.step + 1, true));
  bWa.addEventListener('click', () => toast('🧇 ¡Tu antojo personalizado está listo!'));
  goStep(1, false);

  /* ------------------------------------------------------------------------
     PRODUCTO ACTIVO · compartido por la escena cinematográfica y el estudio 3D
     ------------------------------------------------------------------------ */
  let currentProduct = 'crepa';
  const sceneApis = [];                       // cada escena 3D registra { show(key) }

  const pickCardsEl = $('#pick-cards');
  pickCardsEl.innerHTML = Object.entries(PRODUCTS).map(([key, p]) => `
    <li class="pick-item">
      <button class="pick-card${key === currentProduct ? ' is-active' : ''}" type="button" data-product="${key}" style="--accent:${p.accent}" aria-pressed="${key === currentProduct}">
        <span class="pick-ico" aria-hidden="true">${p.icon}</span>
        <span class="pick-body"><span class="pick-name">${esc(p.name)}</span><span class="pick-sub">${esc(p.short)}</span></span>
        <span class="pick-price">${esc(p.priceLabel.replace('Desde ', ''))}</span>
      </button>
    </li>`).join('');

  const pickCards = $$('.pick-card', pickCardsEl);
  const studioTabs = $$('#studio-tabs .tab');

  function updateProductUI(key, animate) {
    const p = PRODUCTS[key];
    pickCards.forEach((c) => {
      const on = c.dataset.product === key;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    studioTabs.forEach((t) => {
      const on = t.dataset.product === key;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    $('#pick-desc').textContent = p.desc;
    $('#pick-order-text').textContent = `Pedir ${p.name}`;
    $('#studio-title').textContent = p.title;
    $('#studio-price').textContent = `$${p.price} MXN`;
    $('#studio-desc').textContent = p.desc;
    $('#studio-order-text').textContent = `Pedir ${p.name} por WhatsApp`;
    if (animate && typeof gsap !== 'undefined') gsap.fromTo('#pick-detail', { scale: 0.97 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
  }

  function setProduct(key) {
    if (!PRODUCTS[key]) return;
    const changed = key !== currentProduct;
    currentProduct = key;
    updateProductUI(key, changed);
    sceneApis.forEach((s) => s.show(key));
  }

  /* "Ver y Rotar en 3D": cambia el producto y lleva al visor 360° */
  function view3D(key) {
    setProduct(key);
    const section = $('#estudio-3d');
    if (section) section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    toast(`🎮 Mostrando ${PRODUCTS[key].name} en 3D`);
  }

  pickCards.forEach((card) => {
    card.addEventListener('click', () => setProduct(card.dataset.product));

    if (typeof gsap !== 'undefined' && !isTouch) {   // inclinación 3D al pasar el cursor
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotationY: px * 14, rotationX: -py * 14, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('pointerleave', () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' }));
    }
  });
  if (typeof gsap !== 'undefined' && !reducedMotion) {
    pickCards.forEach((card, i) => gsap.to(card, { y: -6, duration: 2 + i * 0.25, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 }));
  }

  studioTabs.forEach((t) => t.addEventListener('click', () => setProduct(t.dataset.product)));
  $('#pick-order').addEventListener('click', () => { const p = PRODUCTS[currentProduct]; orderItem(p.title, p.price); });
  $('#studio-order').addEventListener('click', () => { const p = PRODUCTS[currentProduct]; orderItem(p.title, p.price); });
  updateProductUI(currentProduct, false);


  /* ==========================================================================
     KIT 3D COMPARTIDO · texturas procedurales y modelos de los postres
     Cada llamada a buildXxx() devuelve una instancia nueva (una por escena)
     ========================================================================== */
  function createKit() {
    /* ------------------------------------------------------------------------
       TEXTURAS PROCEDURALES
       ------------------------------------------------------------------------ */
    function canvasTex(w, h, draw, opts = {}) {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      draw(c.getContext('2d'), w, h);
      const t = new THREE.CanvasTexture(c);
      if (opts.srgb) t.encoding = THREE.sRGBEncoding;
      if (opts.repeat) {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(opts.repeat[0], opts.repeat[1]);
      }
      t.anisotropy = 4;
      return t;
    }
    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }
    function radialTex(hex) {
      return canvasTex(256, 256, (c, w, h) => {
        const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        g.addColorStop(0, hex + 'cc');
        g.addColorStop(0.45, hex + '33');
        g.addColorStop(1, hex + '00');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
      });
    }

    const iceBump = canvasTex(256, 256, (c, w, h) => {
      const id = c.createImageData(w, h);
      for (let i = 0; i < id.data.length; i += 4) {
        const v = 80 + Math.random() * 175;
        id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
      }
      c.putImageData(id, 0, 0);
    }, { repeat: [4, 4] });

    let _berryTex = null;
    function berryTexture() {
      if (_berryTex) return _berryTex;
      _berryTex = canvasTex(256, 256, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#a30a22'); g.addColorStop(0.5, '#e0132f'); g.addColorStop(1, '#ff3b4f');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
        for (let r = 0; r < 12; r++) {
          for (let k = 0; k < 16; k++) {
            const x = (k + (r % 2) * 0.5) * (w / 16), y = (r + 0.7) * (h / 12);
            c.fillStyle = 'rgba(255,226,120,0.95)';
            c.beginPath(); c.ellipse(x, y, 2.2, 3.4, 0, 0, Math.PI * 2); c.fill();
          }
        }
      }, { srgb: true });
      return _berryTex;
    }

    const dotTex = canvasTex(64, 64, (c, w, h) => {
      const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
    });

    /* ------------------------------------------------------------------------
       HELPERS DE MODELADO
       ------------------------------------------------------------------------ */
    function shadowize(obj, cast = true, receive = false) {
      obj.traverse((o) => { if (o.isMesh) { o.castShadow = cast; o.receiveShadow = receive; } });
      return obj;
    }

    function createStrawberry() {
      const g = new THREE.Group();
      const prof = [[0, -0.42], [0.12, -0.38], [0.26, -0.26], [0.34, -0.08], [0.36, 0.08], [0.31, 0.24], [0.18, 0.33], [0, 0.35]]
        .map((p) => new THREE.Vector2(p[0], p[1]));
      const body = new THREE.Mesh(
        new THREE.LatheGeometry(prof, 24),
        new THREE.MeshStandardMaterial({ map: berryTexture(), roughness: 0.32, metalness: 0.05 })
      );
      g.add(body);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x3fae2a, roughness: 0.5 });
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.26, 6), leafMat);
        leaf.position.set(Math.cos(a) * 0.16, 0.36, Math.sin(a) * 0.16);
        leaf.rotation.z = -Math.cos(a) * 1.1;
        leaf.rotation.x = Math.sin(a) * 1.1;
        g.add(leaf);
      }
      return shadowize(g);
    }

    function createLemonWheel(r = 0.55, t = 0.09) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, t, 40), new THREE.MeshStandardMaterial({ color: 0xf3dc2a, roughness: 0.4 })));
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.86, r * 0.86, t + 0.006, 40), new THREE.MeshStandardMaterial({ color: 0xe6f06a, roughness: 0.3, emissive: 0x405000, emissiveIntensity: 0.25 })));
      const spokeMat = new THREE.MeshStandardMaterial({ color: 0xfffbe0, roughness: 0.4 });
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const s = new THREE.Mesh(new THREE.BoxGeometry(0.022, t + 0.012, r * 0.8), spokeMat);
        s.position.set(Math.sin(a) * r * 0.4, 0, Math.cos(a) * r * 0.4);
        s.rotation.y = a;
        g.add(s);
      }
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.07, r * 0.07, t + 0.014, 12), spokeMat));
      return shadowize(g);
    }

    function addPowder(group, y, spread, n = 40) {
      const geo = new THREE.BufferGeometry();
      const arr = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * spread;
        arr[i * 3] = Math.cos(a) * r; arr[i * 3 + 1] = y + Math.random() * 0.04; arr[i * 3 + 2] = Math.sin(a) * r;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      group.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, map: dotTex, transparent: true, opacity: 0.85, depthWrite: false })));
    }

    /* Logo oficial en el vaso (se carga de assets/images/logo.png) */
    const logoTex = new THREE.TextureLoader().load(CONFIG.logoPath, undefined, undefined, () => console.warn('[Yukis Kikis] No se encontró', CONFIG.logoPath));
    logoTex.encoding = THREE.sRGBEncoding;
    logoTex.anisotropy = 8;

    function createLogoBadge(radius) {
      const b = new THREE.Group();
      const back = new THREE.Mesh(new THREE.CircleGeometry(radius, 48), new THREE.MeshBasicMaterial({ color: 0x0f0f12 }));
      const rim = new THREE.Mesh(new THREE.RingGeometry(radius * 0.97, radius * 1.04, 48), new THREE.MeshBasicMaterial({ color: 0xff2a6d }));
      rim.position.z = 0.002;
      const img = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.96, 48), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false }));
      img.position.z = 0.004;
      b.add(back, rim, img);
      return b;
    }

    /* PRODUCTO 1 · CREPA (respaldo procedural y normalización del GLB) */

    function buildCrepaFallback() {
      const g = new THREE.Group();

      // Plato cerámico elegante
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(2.55, 2.0, 0.16, 64),
        new THREE.MeshPhysicalMaterial({ color: 0xfafafa, roughness: 0.14, clearcoat: 0.9, clearcoatRoughness: 0.08 })
      );
      plate.position.y = 0.08; plate.castShadow = plate.receiveShadow = true;
      g.add(plate);
      const plateRim = new THREE.Mesh(new THREE.TorusGeometry(2.54, 0.022, 12, 80), new THREE.MeshStandardMaterial({ color: 0xff2a6d, roughness: 0.3, emissive: 0xff2a6d, emissiveIntensity: 0.4 }));
      plateRim.rotation.x = Math.PI / 2; plateRim.position.y = 0.16;
      g.add(plateRim);

      // Textura de masa (encaje dorado)
      const crepeTex = canvasTex(512, 512, (c, w, h) => {
        const bg = c.createLinearGradient(0, 0, w, h);
        bg.addColorStop(0, '#f1c880'); bg.addColorStop(1, '#e0a65a');
        c.fillStyle = bg; c.fillRect(0, 0, w, h);
        for (let i = 0; i < 260; i++) {
          const x = Math.random() * w, y = Math.random() * h, r = 6 + Math.random() * 26;
          const rg = c.createRadialGradient(x, y, 0, x, y, r);
          rg.addColorStop(0, `rgba(176,104,28,${0.12 + Math.random() * 0.25})`);
          rg.addColorStop(1, 'rgba(176,104,28,0)');
          c.fillStyle = rg; c.fillRect(x - r, y - r, r * 2, r * 2);
        }
        for (let i = 0; i < 90; i++) {
          c.strokeStyle = 'rgba(255,236,190,0.35)'; c.lineWidth = 1.5;
          c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 5 + Math.random() * 14, 0, Math.PI * 2); c.stroke();
        }
      }, { srgb: true, repeat: [0.45, 0.45] });
      const crepeMat = new THREE.MeshStandardMaterial({ map: crepeTex, bumpMap: crepeTex, bumpScale: 0.6, roughness: 0.55 });

      // Capa base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 0.07, 48), crepeMat);
      base.position.y = 0.2; base.castShadow = base.receiveShadow = true;
      g.add(base);

      // Dos crepas dobladas en abanico
      function fan(len, spread) {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.lineTo(len, -spread);
        s.quadraticCurveTo(len + 0.35, 0, len, spread);
        s.closePath();
        const geo = new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.07, bevelThickness: 0.05 });
        geo.translate(-len * 0.45, 0, 0);
        return geo;
      }
      [[2.0, 1.1, 0.55, [-0.15, 0.24, 0.25]], [1.85, 0.98, -0.5, [0.2, 0.34, -0.15]]].forEach(([len, spr, rot, pos]) => {
        const holder = new THREE.Group();
        const m = new THREE.Mesh(fan(len, spr), crepeMat);
        m.rotation.x = -Math.PI / 2; m.castShadow = m.receiveShadow = true;
        holder.add(m); holder.rotation.y = rot; holder.position.set(pos[0], pos[1], pos[2]);
        g.add(holder);
      });

      // Chocolate
      const choc = new THREE.MeshPhysicalMaterial({ color: 0x23110b, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.04 });
      [[[-0.9, 0.62, -0.6], [-0.3, 0.64, -0.1], [0.4, 0.64, 0.2], [1.1, 0.6, 0.7]],
       [[-0.7, 0.62, -0.9], [-0.05, 0.64, -0.35], [0.7, 0.64, -0.05], [1.4, 0.6, 0.4]],
       [[-1.0, 0.6, -0.2], [-0.4, 0.62, 0.3], [0.2, 0.62, 0.65], [0.9, 0.6, 1.0]]].forEach((pts, i) => {
        const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
        const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.05 + i * 0.004, 10, false), choc);
        tube.castShadow = true; g.add(tube);
      });

      // Crema batida (espiral apilada)
      const cream = new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.5 });
      [[0.62, 0.62], [0.47, 0.84], [0.32, 1.0]].forEach(([r, y]) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), cream);
        m.scale.set(1, 0.55, 1); m.position.set(0.1, y, -0.15); m.castShadow = true; g.add(m);
      });

      // Fresas + menta
      const top = createStrawberry(); top.scale.setScalar(0.85); top.position.set(0.1, 1.28, -0.15); top.rotation.z = 0.15; g.add(top);
      [[-0.55, 0.62, 0.42, 0.4], [0.75, 0.62, 0.45, -0.4], [1.05, 0.62, -0.4, 1.1], [-1.15, 0.5, -0.35, 0.8], [0.3, 0.6, 0.95, 2]].forEach(([x, y, z, ry], i) => {
        const s = createStrawberry(); s.scale.setScalar(0.75 + (i % 2) * 0.1);
        s.position.set(x, y, z); s.rotation.set(0.5, ry, 0.9 + i * 0.2); g.add(s);
      });
      const mint = new THREE.MeshStandardMaterial({ color: 0x4cc938, roughness: 0.4, side: THREE.DoubleSide });
      [[-0.12, 1.5, -0.1, -0.5], [0.3, 1.52, -0.2, 0.6]].forEach(([x, y, z, rz]) => {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), mint);
        leaf.scale.set(1, 0.09, 0.6); leaf.position.set(x, y, z); leaf.rotation.set(0.2, rz * 1.5, rz); leaf.castShadow = true; g.add(leaf);
      });

      addPowder(g, 0.62, 1.8, 60);
      return g;
    }

    function normalizeGLB(root) {
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.z) || 1;
      root.scale.multiplyScalar(4.6 / maxDim);
      box.setFromObject(root);
      const c = box.getCenter(new THREE.Vector3());
      root.position.x -= c.x; root.position.z -= c.z; root.position.y -= box.min.y;
      root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material && o.material.map) o.material.map.anisotropy = 8; } });
      const wrap = new THREE.Group(); wrap.add(root);
      return wrap;
    }


    /* ------------------------------------------------------------------------
       PRODUCTO 2 · YUKI LIMÓN (vaso + hielo brillante + logo)
       ------------------------------------------------------------------------ */
    function buildYuki() {
      const g = new THREE.Group();
      const H = 2.6, RT = 1.2, RB = 0.85;

      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(RT, RB, H, 56, 1, true),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.DoubleSide, depthWrite: false })
      );
      cup.position.y = H / 2; cup.renderOrder = 3; g.add(cup);

      const cupBase = new THREE.Mesh(new THREE.CircleGeometry(RB, 40), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.1 }));
      cupBase.rotation.x = -Math.PI / 2; cupBase.position.y = 0.02; g.add(cupBase);

      const lip = new THREE.Mesh(new THREE.TorusGeometry(RT + 0.015, 0.045, 14, 64), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, transparent: true, opacity: 0.8 }));
      lip.rotation.x = Math.PI / 2; lip.position.y = H; g.add(lip);

      // Hielo verde: relleno
      const iceMat = new THREE.MeshStandardMaterial({ color: 0x3be82a, emissive: 0x0a5a06, emissiveIntensity: 0.55, bumpMap: iceBump, bumpScale: 0.9, roughness: 0.4 });
      const inner = new THREE.Mesh(new THREE.CylinderGeometry(RT - 0.04, RB - 0.04, H - 0.1, 44), iceMat);
      inner.position.y = H / 2 + 0.02; g.add(inner);

      // Domo de nieve
      const domeGeo = new THREE.SphereGeometry(RT + 0.12, 56, 36, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const dp = domeGeo.attributes.position;
      for (let i = 0; i < dp.count; i++) {
        const x = dp.getX(i), y = dp.getY(i), z = dp.getZ(i);
        const n = (Math.sin(x * 9) * Math.cos(z * 9) + Math.sin(y * 11) * 0.5) * 0.045;
        dp.setXYZ(i, x * (1 + n), y * (1 + n * 0.8), z * (1 + n));
      }
      domeGeo.computeVertexNormals();
      const dome = new THREE.Mesh(domeGeo, new THREE.MeshPhysicalMaterial({ color: 0x4af035, emissive: 0x0e6a08, emissiveIntensity: 0.5, bumpMap: iceBump, bumpScale: 1.1, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2 }));
      dome.scale.y = 0.85; dome.position.y = H - 0.05; dome.castShadow = true; g.add(dome);

      // Cristales de hielo brillantes
      const shardMat = new THREE.MeshPhysicalMaterial({ color: 0xc9ffbf, emissive: 0x7dff6a, emissiveIntensity: 0.35, transparent: true, opacity: 0.85, roughness: 0.08, clearcoat: 1 });
      const shardGeo = new THREE.IcosahedronGeometry(0.1, 0);
      for (let i = 0; i < 34; i++) {
        const phi = Math.random() * 1.15, th = Math.random() * Math.PI * 2, R = RT + 0.14;
        const s = new THREE.Mesh(shardGeo, shardMat);
        s.position.set(Math.sin(phi) * Math.cos(th) * R, H - 0.05 + Math.cos(phi) * R * 0.85, Math.sin(phi) * Math.sin(th) * R);
        s.scale.set(0.6 + Math.random() * 0.9, 0.6 + Math.random() * 0.9, 0.6 + Math.random() * 0.9);
        s.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        g.add(s);
      }
      // Hielo que se derrama por el borde
      const spillGeo = new THREE.DodecahedronGeometry(0.1, 1);
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2, r = RT + 0.05 + (i % 3) * 0.04;
        const s = new THREE.Mesh(spillGeo, iceMat);
        s.position.set(Math.cos(a) * r, H - 0.04 + (i % 2) * 0.06, Math.sin(a) * r);
        s.scale.set(0.9 + (i % 3) * 0.3, 0.7 + (i % 2) * 0.3, 0.9);
        g.add(s);
      }

      // Popote rosa neón
      const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.6, 20), new THREE.MeshStandardMaterial({ color: 0xff2a6d, roughness: 0.25, emissive: 0xff2a6d, emissiveIntensity: 0.25 }));
      straw.position.set(0.2, 2.25, -0.1); straw.rotation.z = -0.2; straw.castShadow = true; g.add(straw);

      // Rodajas de limón
      const rimLemon = createLemonWheel(0.55); rimLemon.position.set(-0.85, H + 0.42, 0.35); rimLemon.rotation.set(1.15, 0.2, -0.5); g.add(rimLemon);
      const baseLemon = createLemonWheel(0.6); baseLemon.position.set(1.55, 0.07, 1.05); baseLemon.rotation.set(0, 0.4, 0.04); g.add(baseLemon);
      const leanLemon = createLemonWheel(0.52); leanLemon.position.set(-1.45, 0.42, 0.95); leanLemon.rotation.set(1.05, -0.6, 0.2); g.add(leanLemon);

      // Nieve en la base
      const snow = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 0.12, 40), iceMat);
      snow.position.set(0, 0.06, 0.1); snow.receiveShadow = true; g.add(snow);

      // Logo oficial Yukis Kikis
      const badge = createLogoBadge(0.52);
      const r = RB + (RT - RB) * (1.3 / H) + 0.012;
      badge.position.set(0, 1.3, r); badge.rotation.x = -Math.atan((RT - RB) / H);
      g.add(badge);

      return g;
    }

    /* ------------------------------------------------------------------------
       PRODUCTO 3 · WAFFLE BELGA
       ------------------------------------------------------------------------ */
    function buildWaffle() {
      const g = new THREE.Group();

      const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.05, 0.16, 64), new THREE.MeshPhysicalMaterial({ color: 0xfafafa, roughness: 0.14, clearcoat: 0.9 }));
      plate.position.y = 0.08; plate.castShadow = plate.receiveShadow = true; g.add(plate);
      const pr = new THREE.Mesh(new THREE.TorusGeometry(2.54, 0.022, 12, 80), new THREE.MeshStandardMaterial({ color: 0xffb300, roughness: 0.3, emissive: 0xffb300, emissiveIntensity: 0.35 }));
      pr.rotation.x = Math.PI / 2; pr.position.y = 0.16; g.add(pr);

      const N = 8;
      const topTex = canvasTex(512, 512, (c, w, h) => {
        c.fillStyle = '#efbf64'; c.fillRect(0, 0, w, h);
        const cell = w / N, pad = cell * 0.14;
        for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
          const x = i * cell + pad, y = j * cell + pad, s = cell - pad * 2;
          const gr = c.createLinearGradient(x, y, x + s, y + s);
          gr.addColorStop(0, '#8a4f12'); gr.addColorStop(1, '#c98a36');
          c.fillStyle = gr; roundRect(c, x, y, s, s, cell * 0.1); c.fill();
        }
        for (let k = 0; k < 1400; k++) { c.fillStyle = `rgba(120,60,10,${Math.random() * 0.08})`; c.fillRect(Math.random() * w, Math.random() * h, 3, 3); }
      }, { srgb: true });
      const topBump = canvasTex(512, 512, (c, w, h) => {
        c.fillStyle = '#fff'; c.fillRect(0, 0, w, h);
        const cell = w / N, pad = cell * 0.14;
        c.fillStyle = '#000';
        for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { roundRect(c, i * cell + pad, j * cell + pad, cell - pad * 2, cell - pad * 2, cell * 0.1); c.fill(); }
      });

      const sideMat = new THREE.MeshStandardMaterial({ color: 0xdca24a, roughness: 0.6 });
      const topMat = new THREE.MeshStandardMaterial({ map: topTex, bumpMap: topBump, bumpScale: 3.2, roughness: 0.5 });
      const waffle = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.0, 0.42, 72), [sideMat, topMat, sideMat]);
      waffle.position.y = 0.37; waffle.castShadow = waffle.receiveShadow = true; g.add(waffle);

      // Sirope dorado
      const honey = new THREE.MeshPhysicalMaterial({ color: 0xe48a0c, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.85 });
      [[-1.1, -0.9], [1.0, -1.0], [-1.3, 0.7], [1.2, 0.9], [0, 1.4], [-0.1, -1.45]].forEach(([x, z]) => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.025, 20), honey); p.position.set(x, 0.59, z); g.add(p);
      });
      const hCurve = new THREE.CatmullRomCurve3([[-1.3, 0.62, -0.2], [-0.5, 0.78, 0.3], [0.4, 0.8, -0.1], [1.3, 0.62, 0.35]].map((p) => new THREE.Vector3(...p)));
      g.add(new THREE.Mesh(new THREE.TubeGeometry(hCurve, 40, 0.035, 8, false), honey));

      // Mantequilla
      const butter = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.14, 0.4), new THREE.MeshStandardMaterial({ color: 0xffe98a, roughness: 0.35 }));
      butter.position.set(-0.25, 0.65, -0.2); butter.rotation.y = 0.5; butter.castShadow = true; g.add(butter);

      // Fresas y arándanos
      [[0.3, 0.8, 0.1, 1.2], [-0.55, 0.78, 0.45, 0.4], [0.7, 0.75, -0.55, 2.1], [-0.9, 0.7, -0.5, 0.9]].forEach(([x, y, z, ry], i) => {
        const s = createStrawberry(); s.scale.setScalar(0.85); s.position.set(x, y, z); s.rotation.set(0.2, ry, 1.2 + i * 0.15); g.add(s);
      });
      const blue = new THREE.MeshPhysicalMaterial({ color: 0x23245c, roughness: 0.28, clearcoat: 0.8 });
      [[0.1, 0.7, 0.6], [-0.2, 0.84, 0.0], [0.95, 0.66, 0.15], [-1.0, 0.64, 0.2], [0.5, 0.66, -1.0], [1.35, 0.6, -0.3], [-0.5, 0.64, -1.0], [0.4, 0.8, -0.2]].forEach(([x, y, z]) => {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 16), blue); b.position.set(x, y, z); b.castShadow = true; g.add(b);
      });
      addPowder(g, 0.6, 1.6, 50);
      return g;
    }

    /* ------------------------------------------------------------------------
       PRODUCTO 4 · FRESAS CON CREMA
       ------------------------------------------------------------------------ */
    function buildFresas() {
      const g = new THREE.Group();
      const H = 2.6, RT = 1.2, RB = 0.85;

      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(RT, RB, H, 48, 1, true),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, roughness: 0.04, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false })
      );
      cup.position.y = H / 2; cup.renderOrder = 3; g.add(cup);
      const lip = new THREE.Mesh(new THREE.TorusGeometry(RT + 0.015, 0.045, 14, 56), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, transparent: true, opacity: 0.8 }));
      lip.rotation.x = Math.PI / 2; lip.position.y = H; g.add(lip);

      // Capas de crema con fresa
      const creamTex = canvasTex(512, 512, (c, w, h) => {
        c.fillStyle = '#fff4e4'; c.fillRect(0, 0, w, h);
        for (let i = 0; i < 70; i++) {
          const x = Math.random() * w, y = Math.random() * h * 0.92 + 8;
          const rx = 14 + Math.random() * 40, ry = 4 + Math.random() * 12, rot = Math.random() * Math.PI;
          c.save(); c.translate(x, y); c.rotate(rot);
          c.fillStyle = 'rgba(120,10,30,0.55)'; c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); c.fill();
          c.fillStyle = 'rgba(214,32,64,0.85)'; c.beginPath(); c.ellipse(0, -1, rx * 0.8, ry * 0.7, 0, 0, Math.PI * 2); c.fill();
          c.restore();
        }
        for (let i = 0; i < 24; i++) { c.fillStyle = 'rgba(190,120,80,0.16)'; c.fillRect(0, Math.random() * h, w, 2 + Math.random() * 4); }
      }, { srgb: true });
      const core = new THREE.Mesh(new THREE.CylinderGeometry(RT - 0.04, RB - 0.04, H - 0.1, 48), new THREE.MeshStandardMaterial({ map: creamTex, roughness: 0.5 }));
      core.position.y = H / 2 + 0.02; g.add(core);

      // Fresas apiladas arriba
      const berries = new THREE.Group();
      for (let k = 0; k < 9; k++) {
        const s = createStrawberry(); s.scale.setScalar(0.62);
        const a = (k / 9) * Math.PI * 2, r = 0.25 + (k % 3) * 0.32;
        s.position.set(Math.cos(a) * r, H + 0.12 + (k % 2) * 0.12, Math.sin(a) * r);
        s.rotation.set(0.4 * Math.cos(a), a, 0.8 + (k % 3) * 0.3);
        berries.add(s);
      }
      const crown = createStrawberry(); crown.scale.setScalar(0.9); crown.position.set(0.05, H + 0.4, 0); crown.rotation.z = 0.2; berries.add(crown);
      g.add(berries);

      // Palita de madera
      const stick = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.3, 0.03), new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.7 }));
      stick.position.set(-0.8, H + 0.35, 0.25); stick.rotation.set(0.15, 0.4, 0.28); stick.castShadow = true; g.add(stick);

      // Logo
      const badge = createLogoBadge(0.46);
      const r = RB + (RT - RB) * (1.3 / H) + 0.012;
      badge.position.set(0, 1.3, r); badge.rotation.x = -Math.atan((RT - RB) / H);
      g.add(badge);
      return g;
    }

    return { canvasTex, radialTex, dotTex, shadowize, buildCrepaFallback, buildYuki, buildWaffle, buildFresas, normalizeGLB };
  }

  /* ------------------------------------------------------------------------
     MODELO GLB COMPARTIDO · se descarga una sola vez y cada escena usa su clon
     ------------------------------------------------------------------------ */
  const model = { status: 'loading', src: null };      // status: 'loading' | 'ready' | 'failed'
  const modelSubs = { done: [], progress: [] };

  function settleModel(status) {
    if (model.status !== 'loading') return;
    model.status = status;
    modelSubs.done.splice(0).forEach((fn) => fn(model));
  }
  function whenModel(fn) { if (model.status === 'loading') modelSubs.done.push(fn); else fn(model); }
  function onModelProgress(fn) { modelSubs.progress.push(fn); }

  function loadCrepaModel() {
    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader !== 'function') { settleModel('failed'); return; }
    
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    
    const loader = new THREE.GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(
        CONFIG.modelPath,
        (gltf) => { model.src = gltf.scene; settleModel('ready'); },
        (xhr) => { modelSubs.progress.forEach((fn) => fn(xhr)); },
        (err) => {
            console.warn(`[Yukis Kikis] No se pudo cargar ${CONFIG.modelPath}. Se muestra la crepa de respaldo.`, err && err.message ? err.message : '');
            settleModel('failed');
        }
    );
}


  /* ==========================================================================
     ESCENA CINEMATOGRÁFICA (hero + detalle + selector) · lienzo fijo #webgl
     La cámara entra al local y recorre el producto con GSAP ScrollTrigger
     ========================================================================== */
  function initCinematic(kit) {
    if (!kit || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return null;

    const canvas = $('#webgl');
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
      console.warn('[Yukis Kikis] WebGL no disponible para la escena principal:', err.message);
      return null;
    }
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const vw = () => canvas.clientWidth || window.innerWidth;
    const vh = () => canvas.clientHeight || window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2));
    renderer.setSize(vw(), vh(), false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f0f12, 16, 34);
    const camera = new THREE.PerspectiveCamera(40, vw() / vh(), 0.1, 80);

    /* Estado animable (GSAP escribe aquí; el loop lo aplica) */
    const cam = { px: 0, py: 2.4, pz: 8.4, tx: 0, ty: 1.0, tz: 0 };
    const stageState = { x: 0, y: 0, s: 1 };
    const state = { spin: 0 };
    const intro = { dz: 10, rot: -1.2, fov: 58 };
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    let renderOn = true;

    /* --- Luces de estudio --- */
    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a1020, 0.6));

    const keyLight = new THREE.SpotLight(0xfff1e0, 1.7, 40, 0.55, 0.85, 1);
    keyLight.position.set(3.5, 7.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(isTouch ? 512 : 1024, isTouch ? 512 : 1024);
    keyLight.shadow.bias = -0.0006;
    keyLight.target.position.set(0, 0.5, 0);
    scene.add(keyLight, keyLight.target);

    const rimPink = new THREE.PointLight(0xff2a6d, 2.0, 18);
    rimPink.position.set(-4, 3, -3.5);
    const rimGreen = new THREE.PointLight(0x00e676, 1.5, 18);
    rimGreen.position.set(4, 2.5, -3.5);
    const accentLight = new THREE.PointLight(0xff2a6d, 1.1, 11);
    accentLight.position.set(0, 2.5, 3.6);
    scene.add(rimPink, rimGreen, accentLight);

    /* --- Escenario: pedestal neón --- */
    const stage = new THREE.Group();
    scene.add(stage);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(2.9, 3.1, 0.18, 72),
      new THREE.MeshStandardMaterial({ color: 0x151518, roughness: 0.35, metalness: 0.7 })
    );
    pedestal.position.y = -0.1;
    pedestal.receiveShadow = true;
    stage.add(pedestal);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.93, 0.026, 12, 120), new THREE.MeshBasicMaterial({ color: 0xff2a6d }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.005;
    stage.add(ring);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ map: kit.radialTex('#ff2a6d'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8 })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.21;
    stage.add(glow);

    /* --- Partículas ambientales (polvo de neón) --- */
    const PCOUNT = isTouch ? 70 : 130;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PCOUNT * 3);
    const pCol = new Float32Array(PCOUNT * 3);
    const pSpeed = new Float32Array(PCOUNT);
    const palette = [new THREE.Color('#ff2a6d'), new THREE.Color('#00e676'), new THREE.Color('#ffb300')];
    for (let i = 0; i < PCOUNT; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 16;
      pPos[i * 3 + 1] = Math.random() * 7 - 0.5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
      const c = palette[i % 3];
      pCol[i * 3] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b;
      pSpeed[i] = 0.003 + Math.random() * 0.006;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.14, map: kit.dotTex, vertexColors: true, transparent: true, opacity: 0.75,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));

    /* --- Productos --- */
    const crepaGroup = new THREE.Group();
    let crepaVisual = null;

    function setCrepaVisual(obj, pop) {
      if (crepaVisual) crepaGroup.remove(crepaVisual);
      crepaVisual = obj;
      kit.shadowize(obj, true, true);
      crepaGroup.add(obj);
      if (pop) gsap.fromTo(obj.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, duration: 1, ease: 'back.out(1.6)' });
    }
    function showFallback() { if (!crepaVisual) setCrepaVisual(kit.buildCrepaFallback(), false); }

    const groups = { crepa: crepaGroup, yuki: kit.buildYuki(), waffle: kit.buildWaffle(), fresas: kit.buildFresas() };
    const baseScale = { crepa: 1, yuki: 0.85, waffle: 1, fresas: 0.85 };
    let active = currentProduct;
    Object.entries(groups).forEach(([k, grp]) => {
      kit.shadowize(grp, true, true);
      grp.userData.base = baseScale[k];
      grp.visible = k === active;
      grp.scale.setScalar(k === active ? baseScale[k] : 0.0001);
      stage.add(grp);
    });
    const accentColor = new THREE.Color(PRODUCTS[active].accent);

    /* Cambio de producto con transición elástica */
    function show(key) {
      if (!groups[key] || key === active) return;
      active = key;
      Object.entries(groups).forEach(([k, grp]) => {
        gsap.killTweensOf(grp.scale);
        const t = grp.userData.base;
        if (k === key) {
          grp.visible = true;
          gsap.fromTo(grp.scale, { x: 0.0001, y: 0.0001, z: 0.0001 }, { x: t, y: t, z: t, duration: 0.95, delay: 0.12, ease: 'back.out(1.6)' });
        } else if (grp.visible) {
          gsap.to(grp.scale, { x: 0.0001, y: 0.0001, z: 0.0001, duration: 0.35, ease: 'power2.in', onComplete: () => { if (active !== k) grp.visible = false; } });
        }
      });
      const c = new THREE.Color(PRODUCTS[key].accent);
      gsap.to(accentColor, { r: c.r, g: c.g, b: c.b, duration: 0.8, ease: 'power2.out' });
    }

    /* --- Preloader + carga del modelo --- */
    const loaderEl = $('#loader');
    const barEl = $('#loader-bar');
    const pctEl = $('#loader-pct');
    const loadState = { p: 0 };
    const loadStart = performance.now();
    let started = false;

    function showProgress(p) {
      gsap.to(loadState, {
        p, duration: 0.5, ease: 'power1.out',
        onUpdate: () => { const v = Math.round(loadState.p); barEl.style.width = v + '%'; pctEl.textContent = v + '%'; }
      });
    }
    function finishLoading() {
      if (started) return;
      started = true;
      showProgress(100);
      const wait = Math.max(0, CONFIG.minLoaderMs - (performance.now() - loadStart));
      setTimeout(startExperience, wait + 350);
    }

    onModelProgress((xhr) => {
      if (xhr.lengthComputable && xhr.total) showProgress(Math.min(92, (xhr.loaded / xhr.total) * 92));
      else showProgress(60);
    });
    whenModel((m) => {
      if (m.status === 'ready') setCrepaVisual(kit.normalizeGLB(m.src.clone(true)), started);   // si ya arrancó con el respaldo, hace "pop"
      else showFallback();
      finishLoading();
    });
    setTimeout(() => { if (!crepaVisual) { showFallback(); finishLoading(); } }, CONFIG.modelTimeoutMs);

    /* --- Intro: la cámara "entra al local" --- */
    $$('[data-split]').forEach((el) => {
      const txt = el.textContent.trim();
      el.setAttribute('aria-label', txt);
      el.textContent = '';
      Array.from(txt).forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'char'; s.setAttribute('aria-hidden', 'true');
        s.textContent = ch === ' ' ? ' ' : ch;
        el.appendChild(s);
      });
    });
    gsap.set('.hero-line .char', { yPercent: 115 });
    gsap.set('[data-hero="fade"]', { opacity: 0, y: 24 });
    gsap.set('.nav', { opacity: 0, y: -20 });

    function startExperience() {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
      gsap.to(loaderEl, { opacity: 0, duration: 0.8, ease: 'power2.inOut', onComplete: () => loaderEl.remove() });

      const k = window.innerWidth < 768 ? 1.5 : 1;
      if (reducedMotion) {
        Object.assign(intro, { dz: 0, rot: 0, fov: 40 });
        gsap.set('.hero-line .char', { yPercent: 0 });
        gsap.set('[data-hero="fade"], .nav', { opacity: 1, y: 0 });
      } else {
        intro.dz = 10 * k;
        gsap.to(intro, { dz: 0, rot: 0, duration: 3.4, ease: 'power3.out' });
        gsap.to(intro, { fov: 40, duration: 3.4, ease: 'power2.out' });
        gsap.to('.hero-line .char', { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.07, delay: 0.5 });
        gsap.to('[data-hero="fade"]', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.15, delay: 1.3 });
        gsap.to('.nav', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.6 });
      }
      ScrollTrigger.refresh();
    }

    /* --- Scrollytelling (GSAP ScrollTrigger) · responsive con matchMedia --- */
    const mm = gsap.matchMedia();
    mm.add({ isMobile: '(max-width: 767px)', isDesktop: '(min-width: 768px)' }, (ctx) => {
      const m = ctx.conditions.isMobile;
      const kz = m ? 1.45 : 1;       // más lejos en pantallas angostas
      const kc = m ? 1.35 : 1;

      Object.assign(cam, { px: 0, py: 2.4, pz: 8.4 * kz, tx: 0, ty: 1.0, tz: 0 });
      Object.assign(stageState, { x: 0, y: 0, s: 1 });
      state.spin = 0;

      /* Línea de tiempo maestra de cámara (hero → detalle → selector) */
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '#story', start: 'top top', endTrigger: '#selector', end: 'top top', scrub: 1.1 }
      });
      tl.to({}, { duration: 1.5 }) // el hero respira
        .to(cam, { px: 2.2 * kc, py: 1.3, pz: 3.7 * kc, tx: 0.1, ty: 0.5, tz: 0, duration: 1.4, ease: 'power1.inOut' })
        .to(state, { spin: 1.4, duration: 1.4 }, '<')
        .to(cam, { px: -2.4 * kc, py: 0.95, pz: 3.3 * kc, tx: -0.2, ty: 0.4, tz: 0, duration: 1.4, ease: 'power1.inOut' })
        .to(state, { spin: 2.7, duration: 1.4 }, '<')
        .to({}, { duration: 0.5 })
        .to(cam, { px: 0, py: 1.9, pz: (m ? 12.2 : 9.6), tx: 0, ty: 1.1, tz: 0, duration: 1.9, ease: 'power2.inOut' })
        .to(stageState, { x: m ? 0 : -2.7, y: m ? 1.5 : 0, s: m ? 0.85 : 1, duration: 1.9, ease: 'power2.inOut' }, '<')
        .to(state, { spin: 3.6, duration: 1.9 }, '<');

      /* El hero se desvanece al entrar */
      gsap.to('.hero-top', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '70% top', scrub: true } });
      gsap.to('.hero-bottom', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: '15% top', end: '65% top', scrub: true } });

      /* Paneles de detalle: fade + blur desde el costado */
      const fromA = { opacity: 0, x: m ? 0 : -90, y: m ? 60 : 0, filter: 'blur(14px)' };
      const fromB = { opacity: 0, x: m ? 0 : 90, y: m ? 60 : 0, filter: 'blur(14px)' };
      const showP = { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', ease: 'power2.out' };
      gsap.set('.panel-a', fromA);
      gsap.set('.panel-b', fromB);
      const dt = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '#detalle', start: 'top 55%', end: 'bottom 55%', scrub: 0.8 }
      });
      dt.to('.panel-a', { ...showP, duration: 1 })
        .to('.panel-a', { duration: 1.6 })
        .to('.panel-a', { ...fromA, ease: 'power2.in', duration: 0.9 })
        .to('.panel-b', { ...showP, duration: 1 }, '>-0.1')
        .to('.panel-b', { duration: 1.3 })
        .to('.panel-b', { opacity: 0, y: m ? -40 : 0, x: m ? 0 : 90, filter: 'blur(14px)', ease: 'power2.in', duration: 0.9 });

      /* Selector: título y tarjetas entran */
      gsap.set('.pick-head', { opacity: 0, y: 40 });
      gsap.set('.pick-item', { opacity: 0, x: m ? 60 : 80, y: 0 });
      gsap.set('.pick-detail', { opacity: 0, y: 40 });
      const mt = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: '#selector', start: 'top 80%', end: 'top 15%', scrub: 0.7 }
      });
      mt.to('.pick-head', { opacity: 1, y: 0, duration: 1 })
        .to('.pick-item', { opacity: 1, x: 0, duration: 1, stagger: 0.18 }, '<0.2')
        .to('.pick-detail', { opacity: 1, y: 0, duration: 1 }, '>-0.6');
    });

    /* Barra de progreso de scroll */
    const progressEl = $('#scroll-progress');
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { progressEl.style.transform = `scaleX(${self.progress})`; }
    });

    /* El lienzo fijo deja de renderizar cuando el estudio 3D (sección sólida) lo cubre */
    let coverY = Infinity;
    const measureCover = () => { const el = $('#estudio-3d'); coverY = el ? el.getBoundingClientRect().top + window.scrollY - 4 : Infinity; };
    ScrollTrigger.addEventListener('refresh', measureCover);
    window.addEventListener('load', measureCover);
    measureCover();

    /* Parallax suave con el puntero */
    if (!isTouch) {
      window.addEventListener('pointermove', (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    /* Resize */
    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        camera.aspect = vw() / vh();
        camera.updateProjectionMatrix();
        renderer.setSize(vw(), vh(), false);
      }, 80);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    /* --- Loop de render (60 FPS) --- */
    const clock = new THREE.Clock();
    const groupList = Object.values(groups);

    function tick() {
      requestAnimationFrame(tick);
      renderOn = window.scrollY < coverY;
      if (!renderOn || document.hidden) return;
      const t = clock.getElapsedTime();

      mouse.sx += (mouse.x - mouse.sx) * 0.05;
      mouse.sy += (mouse.y - mouse.sy) * 0.05;

      camera.position.set(cam.px + mouse.sx * 0.35, cam.py - mouse.sy * 0.18, cam.pz + intro.dz);
      camera.lookAt(cam.tx, cam.ty, cam.tz);
      if (Math.abs(camera.fov - intro.fov) > 0.01) { camera.fov = intro.fov; camera.updateProjectionMatrix(); }

      stage.position.set(stageState.x, stageState.y + Math.sin(t * 1.1) * 0.05, 0);
      stage.scale.setScalar(stageState.s);

      const spin = state.spin + intro.rot + t * 0.16;
      for (let i = 0; i < groupList.length; i++) groupList[i].rotation.y = spin;

      rimPink.position.x = -4 + Math.sin(t * 0.5) * 0.9;
      rimGreen.position.x = 4 + Math.cos(t * 0.45) * 0.9;
      accentLight.color.copy(accentColor);
      ring.material.color.copy(accentColor);
      glow.material.color.copy(accentColor);

      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < PCOUNT; i++) {
        arr[i * 3 + 1] += pSpeed[i];
        arr[i * 3] += Math.sin(t * 0.6 + i) * 0.0015;
        if (arr[i * 3 + 1] > 6.5) arr[i * 3 + 1] = -0.5;
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);

    return { show };
  }


  /* ==========================================================================
     ESTUDIO 3D INTERACTIVO · visor con OrbitControls (arrastre 360°, zoom)
     ========================================================================== */
  function initStudio(kit) {
    const host = $('#studio-viewer');
    const loadingEl = $('#studio-loading');
    const loadingText = $('#studio-loading-text');
    const progressEl = $('#studio-progress');
    const fallbackImg = $('#studio-fallback');
    const hint = $('#studio-hint');
    const lockBtn = $('#btn-lock');
    const toolBtns = $$('.tool');

    function loadingDone() { loadingEl.classList.add('is-done'); }

    /* Sin WebGL / librerías: se muestra la foto real del producto */
    function staticMode(reason) {
      console.warn('[Yukis Kikis] Visor 3D desactivado:', reason);
      loadingDone();
      hint.hidden = true;
      toolBtns.forEach((b) => { b.disabled = true; b.style.opacity = 0.4; });
      fallbackImg.hidden = false;
      fallbackImg.alt = 'Foto del producto';
      const setImg = (key) => { fallbackImg.src = PRODUCTS[key].img; };
      setImg(currentProduct);
      return { show: setImg };
    }

    if (!kit || typeof THREE.OrbitControls !== 'function') {
      return staticMode('No se cargaron Three.js / OrbitControls desde el CDN.');
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
      return staticMode('WebGL no disponible: ' + err.message);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Visor 3D interactivo de los postres de Yukis Kikis');
    host.insertBefore(canvas, host.firstChild);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f0f12, 18, 40);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    const target = new THREE.Vector3(0, 1.1, 0);

    /* --- Iluminación de estudio: ambiental, direccional con sombras suaves, relleno y neón --- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const keyLight = new THREE.DirectionalLight(0xfff1e0, 1.5);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = true;
    const sm = isTouch ? 1024 : 2048;
    keyLight.shadow.mapSize.set(sm, sm);
    keyLight.shadow.camera.left = -5; keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5; keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.camera.near = 1; keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffe2c4, 0.9, 20);
    fillLight.position.set(-4, 3.5, 4.5);
    const rimPink = new THREE.PointLight(0xff2a6d, 2.2, 18);
    rimPink.position.set(-4.5, 3, -3.5);
    const rimGreen = new THREE.PointLight(0x00e676, 1.7, 18);
    rimGreen.position.set(4.5, 2.5, -3.5);
    scene.add(fillLight, rimPink, rimGreen);

    /* --- Plataforma con aro de neón --- */
    const stage = new THREE.Group();
    scene.add(stage);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(3.3, 3.5, 0.18, 80),
      new THREE.MeshStandardMaterial({ color: 0x17171d, roughness: 0.35, metalness: 0.7 })
    );
    platform.position.y = -0.1;
    platform.receiveShadow = true;
    stage.add(platform);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff2a6d });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.32, 0.025, 12, 140), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.005;
    stage.add(ring);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(11, 11),
      new THREE.MeshBasicMaterial({ map: kit.radialTex('#ff2a6d'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.75 })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.21;
    stage.add(glow);

    /* --- Productos --- */
    const pivot = new THREE.Group();       // rota levemente con el scroll
    stage.add(pivot);

    const crepaGroup = new THREE.Group();
    let crepaVisual = null;
    function setCrepaVisual(obj) {
      if (crepaVisual) crepaGroup.remove(crepaVisual);
      crepaVisual = obj;
      kit.shadowize(obj, true, true);
      crepaGroup.add(obj);
    }
    function showFallback() {
      if (crepaVisual) return;
      setCrepaVisual(kit.buildCrepaFallback());
      loadingDone();
    }

    const groups = { crepa: crepaGroup, waffle: kit.buildWaffle(), fresas: kit.buildFresas(), yuki: kit.buildYuki() };
    const baseScale = { crepa: 1, waffle: 1, fresas: 0.85, yuki: 0.85 };
    Object.entries(groups).forEach(([k, g]) => {
      kit.shadowize(g, true, true);
      g.userData.cur = 0;
      g.userData.target = k === currentProduct ? baseScale[k] : 0;
      g.visible = k === currentProduct;
      g.scale.setScalar(0.0001);
      pivot.add(g);
    });
    const accentTarget = new THREE.Color(PRODUCTS[currentProduct].accent);

    /* --- Controles de cámara: arrastre 360°, zoom y auto-rotación --- */
    const controls = new THREE.OrbitControls(camera, canvas);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 4.5;
    controls.maxDistance = 16;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI * 0.5 - 0.03;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.8;
    controls.enableZoom = false;           // la rueda solo hace zoom tras hacer clic, para no atrapar el scroll de la página

    let autoRotatePref = !reducedMotion;
    let userMoved = false;
    let idleTimer = 0;
    controls.autoRotate = autoRotatePref;
    controls.autoRotateSpeed = 1.3;

    canvas.addEventListener('pointerdown', () => { controls.enableZoom = true; });
    canvas.addEventListener('pointerleave', () => { controls.enableZoom = false; });

    controls.addEventListener('start', () => {
      userMoved = true;
      controls.autoRotate = false;
      clearTimeout(idleTimer);
      hint.classList.add('is-faded');
    });
    controls.addEventListener('end', () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { controls.autoRotate = autoRotatePref; }, 2500);
    });

    function frameCamera() {
      const aspect = camera.aspect;
      const dist = aspect < 0.85 ? 13.5 : aspect < 1.3 ? 11 : 9.6;
      const dir = new THREE.Vector3(0, 0.32, 1).normalize();
      camera.position.copy(target).addScaledVector(dir, dist);
      controls.update();
    }

    function zoomBy(factor) {
      userMoved = true;
      hint.classList.add('is-faded');
      const off = camera.position.clone().sub(controls.target);
      off.setLength(clamp(off.length() * factor, controls.minDistance, controls.maxDistance));
      camera.position.copy(controls.target).add(off);
    }

    function resize() {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!userMoved) frameCamera();
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
    else window.addEventListener('resize', resize);
    resize();
    frameCamera();

    /* Botones de la barra de herramientas */
    $('#btn-zoom-in').addEventListener('click', () => zoomBy(0.8));
    $('#btn-zoom-out').addEventListener('click', () => zoomBy(1.25));
    const rotateBtn = $('#btn-rotate');
    rotateBtn.classList.toggle('is-on', autoRotatePref);
    rotateBtn.setAttribute('aria-pressed', String(autoRotatePref));
    rotateBtn.addEventListener('click', () => {
      autoRotatePref = !autoRotatePref;
      controls.autoRotate = autoRotatePref;
      rotateBtn.classList.toggle('is-on', autoRotatePref);
      rotateBtn.setAttribute('aria-pressed', String(autoRotatePref));
    });
    $('#btn-reset').addEventListener('click', () => { userMoved = false; controls.target.copy(target); frameCamera(); });

    /* En pantallas táctiles el giro se activa a demanda para no bloquear el scroll de la página */
    if (isTouch) {
      controls.enabled = false;
      host.classList.add('is-locked');
      lockBtn.hidden = false;
      hint.querySelector('span').textContent = 'Activa el giro para rotar el producto';
      lockBtn.addEventListener('click', () => {
        controls.enabled = !controls.enabled;
        controls.enableZoom = controls.enabled;
        host.classList.toggle('is-locked', !controls.enabled);
        lockBtn.classList.toggle('is-active', controls.enabled);
        lockBtn.querySelector('span').textContent = controls.enabled ? 'Soltar para hacer scroll' : 'Activar giro 360°';
      });
    }

    /* --- Modelo GLB compartido: se clona para este visor --- */
    function setProgress(p) { progressEl.style.width = `${Math.round(p)}%`; }
    onModelProgress((xhr) => {
      if (xhr.lengthComputable && xhr.total) {
        const pct = (xhr.loaded / xhr.total) * 100;
        setProgress(pct);
        loadingText.textContent = `Cargando modelo 3D… ${Math.round(pct)}%`;
      } else {
        loadingText.textContent = `Cargando modelo 3D… ${(xhr.loaded / 1048576).toFixed(1)} MB`;
      }
    });
    whenModel((m) => {
      if (m.status === 'ready') {
        setCrepaVisual(kit.normalizeGLB(m.src.clone(true)));
        groups.crepa.userData.cur = 0;        // vuelve a "aparecer" si llegó tarde
        setProgress(100);
        loadingDone();
      } else {
        showFallback();
        toast('Modelo crepa.glb no encontrado: mostrando versión de respaldo');
      }
    });
    setTimeout(() => { if (!crepaVisual) { loadingText.textContent = 'Mostrando versión rápida…'; showFallback(); } }, CONFIG.modelTimeoutMs);

    /* --- Bucle de animación: solo corre mientras el visor es visible --- */
    const clock = new THREE.Clock();
    const smooth = { p: 0.5 };
    let running = false, raf = 0, visible = !('IntersectionObserver' in window);   // sin IntersectionObserver siempre renderiza

    function tick() {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      /* Scroll → el producto rota levemente según la posición del visor en pantalla */
      const r = host.getBoundingClientRect();
      const vhh = window.innerHeight;
      const p = clamp((vhh - r.top) / (vhh + r.height), 0, 1);
      smooth.p += (p - smooth.p) * Math.min(1, dt * 6);
      pivot.rotation.y = (smooth.p - 0.5) * 1.8;
      pivot.rotation.x = (0.5 - smooth.p) * 0.1;
      pivot.position.y = Math.sin(t * 1.1) * 0.05;

      /* Transición de productos */
      Object.values(groups).forEach((g) => {
        g.userData.cur += (g.userData.target - g.userData.cur) * Math.min(1, dt * 7);
        g.scale.setScalar(Math.max(g.userData.cur, 0.0001));
        g.visible = g.userData.cur > 0.01;
      });

      /* Luces neón y color de acento */
      rimPink.position.x = -4.5 + Math.sin(t * 0.5) * 0.9;
      rimGreen.position.x = 4.5 + Math.cos(t * 0.45) * 0.9;
      ringMat.color.lerp(accentTarget, Math.min(1, dt * 4));
      glow.material.color.copy(ringMat.color);

      controls.update();
      renderer.render(scene, camera);
    }
    function start() { if (running || !visible || document.hidden) return; running = true; clock.getDelta(); raf = requestAnimationFrame(tick); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        visible ? start() : stop();
      }, { rootMargin: '120px 0px' }).observe(host);
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); });
    canvas.addEventListener('webglcontextrestored', start);
    start();

    return {
      show(key) {
        if (!groups[key]) return;
        Object.entries(groups).forEach(([k, g]) => { g.userData.target = k === key ? baseScale[k] : 0; });
        accentTarget.set(PRODUCTS[key].accent);
        start();
      }
    };
  }


  /* ==========================================================================
     ARRANQUE
     ========================================================================== */
  const kit = typeof THREE !== 'undefined' ? createKit() : null;

  const cinematic = initCinematic(kit);
  if (cinematic) {
    sceneApis.push(cinematic);
  } else {
    /* Sin WebGL o sin GSAP: la página sigue siendo totalmente usable */
    document.documentElement.classList.add('no-webgl');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    const l = $('#loader'); if (l) l.remove();
  }

  const studio = initStudio(kit);
  sceneApis.push(studio);

  loadCrepaModel();
})();
