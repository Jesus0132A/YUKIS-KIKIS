/* Yukis Kikis · Panel de administración (Etapa 1)
   Firebase: Auth (correo/contraseña) + Firestore. La página pública lee `config/site` y escribe `orders/*`. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, collection, query, orderBy, limit, onSnapshot, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBGKEdHsQ3fJJf_cyt5Nb1aOlniVm_VNGk',
  authDomain: 'yukis-kikis.firebaseapp.com',
  databaseURL: 'https://yukis-kikis-default-rtdb.firebaseio.com',
  projectId: 'yukis-kikis',
  storageBucket: 'yukis-kikis.firebasestorage.app',
  messagingSenderId: '794082140087',
  appId: '1:794082140087:web:87f0b492a699f10b685232'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const TZ = 'America/Monterrey';
const SITE_URL = '../index.html';
const PUESTOS = Array.isArray(window.YK_PUESTOS) ? window.YK_PUESTOS : [];
const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const STATUSES = [['nuevo', 'Nuevo'], ['preparando', 'Preparando'], ['listo', 'Listo'], ['entregado', 'Entregado']];
const STATUS_LABEL = { nuevo: 'Nuevo', preparando: 'Preparando', listo: 'Listo', entregado: 'Entregado', cancelado: 'Cancelado' };
const PAY_LABEL = { cash: 'Efectivo', card: 'Tarjeta', transfer: 'Transferencia', '': 'Sin definir' };

const PRICE_GROUPS = [
  { title: 'Crepa y waffle', rows: [
    ['crepa_base', 'Crepa dulce', 'Incluye 2 toppings', 80], ['waffle_base', 'Waffle', 'Incluye 2 toppings', 80],
    ['extra_topping', 'Topping extra', 'Crepa dulce, waffle y fresas', 10]] },
  { title: 'Crepa salada', rows: [
    ['salada_base', 'Jamón + Philadelphia', '', 80], ['salada_manchego', 'Con queso manchego', '', 90], ['salada_extra', 'Extra (peperoni, piña, champiñones)', 'Cada uno', 15]] },
  { title: 'Fresas con crema', rows: [
    ['fresas_chica', 'Chica', '', 80], ['fresas_grande', 'Grande', '', 100], ['fresas_jumbo', 'Jumbo', '', 130]] },
  { title: 'Yuki', rows: [
    ['yuki_chica', 'Chica', 'Hasta 2 sabores', 40], ['yuki_mediana', 'Mediana', 'Hasta 3 sabores', 50], ['yuki_grande', 'Grande', 'Hasta 4 sabores', 90],
    ['diablito_extra', 'Sabor extra con Diablito', 'Cada uno', 10]] }
];
const DEFAULTS = {};
PRICE_GROUPS.forEach((g) => g.rows.forEach((r) => { DEFAULTS[r[0]] = r[3]; }));

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(Number(n) || 0);
const store = { get: (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* ignore */ } } };

function todayStr() {
  try { return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  catch (_) { return new Date().toISOString().slice(0, 10); }
}
function todayDay() {
  try {
    const w = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(new Date());
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(w);
  } catch (_) { return new Date().getDay(); }
}
function fmtDate(ms) {
  try { return new Intl.DateTimeFormat('es-MX', { timeZone: TZ, day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(ms)); }
  catch (_) { return ''; }
}

/* ---------- Estado ---------- */
const S = {
  user: null, tab: 'orders', filter: 'active', orders: [], ordersReady: false, config: {}, configReady: false,
  unsubs: [], sound: store.get('yk_sound') !== '0', draft: null, priceDraft: null, noticeDraft: null, online: true
};
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}
function beep() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    [880, 1175].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.16);
      o.start(ctx.currentTime + i * 0.18); o.stop(ctx.currentTime + i * 0.18 + 0.17);
    });
  } catch (_) { /* ignore */ }
}
const errText = (e) => (e && /permission|insufficient/i.test(e.code + ' ' + e.message)
  ? 'Sin permiso: revisa las reglas de Firestore y que entraste con el correo autorizado.' : 'No se pudo guardar. Revisa tu conexión e intenta otra vez.');

/* ---------- Sesión ---------- */
const loginEl = $('#login'), appEl = $('#app');
$('#l-email').value = store.get('yk_email') || '';
$('#login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('#l-error'); err.hidden = true;
  const btn = $('#l-btn'); btn.disabled = true; btn.textContent = 'Entrando…';
  try {
    const email = $('#l-email').value.trim();
    await signInWithEmailAndPassword(auth, email, $('#l-pass').value);
    store.set('yk_email', email);
  } catch (ex) {
    const c = String(ex && ex.code || '');
    err.textContent = /invalid-credential|wrong-password|user-not-found|invalid-email/.test(c) ? 'Correo o contraseña incorrectos.'
      : /too-many/.test(c) ? 'Demasiados intentos. Espera unos minutos.'
      : /network/.test(c) ? 'Sin conexión. Intenta de nuevo.' : 'No se pudo entrar. Intenta de nuevo.';
    err.hidden = false;
  } finally { btn.disabled = false; btn.textContent = 'Entrar'; }
});

onAuthStateChanged(auth, (user) => {
  S.user = user;
  S.unsubs.forEach((u) => { try { u(); } catch (_) { /* ignore */ } });
  S.unsubs = []; S.orders = []; S.ordersReady = false; S.configReady = false;
  loginEl.hidden = !!user; appEl.hidden = !user;
  if (!user) return;
  subscribe();
  render();
});

function subscribe() {
  const onErr = (e) => { S.online = false; setConn(); toast(errText(e)); };
  S.unsubs.push(onSnapshot(doc(db, 'config', 'site'), (snap) => {
    const first = !S.configReady; S.config = (snap.exists() ? snap.data() : {}) || {}; S.configReady = true; S.online = true; setConn();
    if (first || S.tab === 'stalls') render();
  }, onErr));
  S.unsubs.push(onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(300)), (snap) => {
    const prev = new Set(S.orders.map((o) => o.code));
    const list = [];
    snap.forEach((d) => list.push({ ...d.data(), code: d.id }));
    if (S.ordersReady) {
      const fresh = list.filter((o) => !prev.has(o.code) && o.status === 'nuevo');
      if (fresh.length) {
        if (S.sound) beep();
        try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (_) { /* ignore */ }
        toast(`🔔 Pedido nuevo ${fresh[0].code}${fresh[0].name ? ' · ' + fresh[0].name : ''}`);
      }
    }
    S.orders = list; S.ordersReady = true; S.online = true; setConn();
    updateBadge();
    if (S.tab === 'orders' && $('#sheet').hidden) render();   // no pisa la hoja abierta ni lo que escribes en otras pestañas
  }, onErr));
}
function setConn() { const c = $('#conn'); c.classList.toggle('off', !S.online || !navigator.onLine); }
window.addEventListener('online', () => { setConn(); }); window.addEventListener('offline', setConn);
function updateBadge() {
  const n = S.orders.filter((o) => o.status === 'nuevo').length;
  const b = $('#badge'); b.hidden = !n; b.textContent = n;
  document.title = n ? `(${n}) Yukis Kikis · Panel` : 'Yukis Kikis · Panel';
}

/* ---------- Tabs ---------- */
$('#tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tab]'); if (!b) return;
  S.tab = b.dataset.tab;
  [...$('#tabs').children].forEach((x) => x.classList.toggle('on', x === b));
  S.priceDraft = null; S.noticeDraft = null;
  render(); window.scrollTo(0, 0);
});

function render() {
  if (!S.user) return;
  const titles = { orders: 'Pedidos', stalls: 'Puestos de hoy', prices: 'Precios', more: 'Más' };
  $('#top-title').textContent = titles[S.tab];
  const v = $('#view');
  v.innerHTML = ({ orders: viewOrders, stalls: viewStalls, prices: viewPrices, more: viewMore })[S.tab]();
  updateBadge();
}

/* ---------- Pedidos ---------- */
const isActive = (o) => o.status === 'nuevo' || o.status === 'preparando' || o.status === 'listo';
function viewOrders() {
  const t = todayStr();
  const today = S.orders.filter((o) => o.date === t && o.status !== 'cancelado');
  const sales = today.reduce((a, o) => a + (Number(o.total) || 0), 0);
  const f = S.filter;
  const list = S.orders.filter((o) => f === 'all' ? true : f === 'active' ? isActive(o) : f === 'done' ? o.status === 'entregado' : o.status === 'cancelado');
  const chip = (id, label) => `<button class="chip ${f === id ? 'on' : ''}" data-filter="${id}">${label}</button>`;
  return `<div class="stats"><div class="stat"><b>${today.length}</b><small>Pedidos hoy</small></div><div class="stat"><b>${money(sales)}</b><small>Ventas hoy</small></div></div>
    <div class="chips">${chip('active', 'Activos')}${chip('all', 'Todos')}${chip('done', 'Entregados')}${chip('cancel', 'Cancelados')}</div>
    ${!S.ordersReady ? '<p class="empty">Cargando…</p>' : list.length ? list.map(orderCard).join('') : '<p class="empty">No hay pedidos aquí todavía. 🧇</p>'}`;
}
function orderCard(o) {
  const items = (o.items || []).map((i) => `${i.qty}× ${i.name}`).join(', ');
  const where = o.mode === 'delivery' ? '🛵 Domicilio' : `🛍️ ${o.place || 'Recoger'}`;
  return `<button class="order s-${esc(o.status)}" data-order="${esc(o.code)}">
    <div class="row"><span class="code">#${esc(o.code)} ${o.name ? '· ' + esc(o.name) : ''}</span><span class="total">${money(o.total)}</span></div>
    <div class="sum">${esc(items)}</div>
    <div class="row"><span class="muted">${esc(where)} · ${esc(PAY_LABEL[o.pay] || '')} · ${fmtDate(o.createdAt)}</span></div>
    <div><span class="tag ${esc(o.status)}">${esc(STATUS_LABEL[o.status] || o.status)}</span> ${o.paid ? '<span class="tag paid">Pagado</span>' : ''}${o.adminNotes ? ' <span class="tag">📝 nota</span>' : ''}</div>
  </button>`;
}

/* Hoja de detalle */
function openOrder(code) {
  const o = S.orders.find((x) => x.code === code); if (!o) return;
  S.draft = JSON.parse(JSON.stringify(o));
  S.draft.items = S.draft.items || [];
  drawSheet(); $('#sheet').hidden = false;
}
function closeSheet() { $('#sheet').hidden = true; S.draft = null; render(); }
function calc(d) {
  const sub = d.items.reduce((a, i) => a + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);
  return { sub, total: sub + (Number(d.extraCharge) || 0) };
}
function drawSheet() {
  const d = S.draft; const c = calc(d);
  const cancelled = d.status === 'cancelado';
  $('.sheet-card').innerHTML = `
    <div class="sheet-head"><h2>Pedido #${esc(d.code)}</h2><button class="x" data-close aria-label="Cerrar">✕</button></div>
    <div class="muted">${fmtDate(d.createdAt)} · ${d.source === 'local' ? 'Venta en local' : 'Pedido web'}</div>
    ${cancelled ? `<div class="card"><span class="tag cancelado">Cancelado</span>${d.cancelReason ? `<p class="muted">Motivo: ${esc(d.cancelReason)}</p>` : ''}<button class="btn small" data-act="reopen">Reabrir pedido</button></div>`
      : `<div class="steps">${STATUSES.map(([id, l]) => `<button class="${d.status === id ? 'on' : ''}" data-status="${id}">${l}</button>`).join('')}</div>`}
    <div class="card">
      <h2>Cliente y entrega</h2>
      <label class="field">Nombre<input data-f="name" value="${esc(d.name)}" maxlength="60" /></label>
      <div class="grid2">
        <label class="field">Entrega<select data-f="mode"><option value="pickup" ${d.mode !== 'delivery' ? 'selected' : ''}>Recoger</option><option value="delivery" ${d.mode === 'delivery' ? 'selected' : ''}>Domicilio</option></select></label>
        <label class="field">Pago<select data-f="pay">${['cash', 'card', 'transfer', ''].map((p) => `<option value="${p}" ${d.pay === p ? 'selected' : ''}>${PAY_LABEL[p]}</option>`).join('')}</select></label>
      </div>
      ${d.mode === 'delivery'
        ? `<label class="field">Dirección<textarea data-f="address" maxlength="300">${esc(d.address)}</textarea></label>`
        : `<label class="field">Lugar de recolección<input data-f="place" value="${esc(d.place)}" maxlength="120" /></label>`}
      <label class="check"><input type="checkbox" data-f="paid" ${d.paid ? 'checked' : ''} /> Ya está pagado</label>
    </div>
    <div class="card">
      <h2>Productos</h2>
      ${d.items.map((i, n) => `<div class="item"><div><b>${esc(i.name)}</b> <span class="muted">${money(i.price)} c/u</span></div>
        <div class="qty"><button data-qty="-1" data-i="${n}" aria-label="Menos">−</button><b>${esc(i.qty)}</b><button data-qty="1" data-i="${n}" aria-label="Más">+</button><button data-rm="${n}" aria-label="Quitar" title="Quitar">🗑</button></div>
        ${(i.lines || []).map((l) => `<small>${esc(l)}</small>`).join('')}</div>`).join('') || '<p class="muted">Sin productos.</p>'}
      <div class="add-row"><input id="add-name" placeholder="Agregar producto" maxlength="80" /><div class="money"><input id="add-price" type="number" inputmode="decimal" min="0" placeholder="0" /></div><button class="btn small" data-act="add">Agregar</button></div>
    </div>
    <div class="card totals">
      <div class="row"><span>Subtotal</span><span>${money(c.sub)}</span></div>
      <div class="row"><span>Envío / ajuste</span><div class="money" style="width:120px"><input data-f="extraCharge" type="number" inputmode="decimal" value="${esc(d.extraCharge || '')}" placeholder="0" /></div></div>
      <div class="row"><b>Total</b><b>${money(c.total)}</b></div>
    </div>
    <label class="field">Notas internas<textarea data-f="adminNotes" maxlength="500" placeholder="Solo tú las ves">${esc(d.adminNotes)}</textarea></label>
    ${d.notes ? `<div class="card"><h2>Notas del cliente</h2><p>${esc(d.notes)}</p></div>` : ''}
    <button class="btn primary" data-act="save">Guardar cambios</button>
    ${cancelled ? '' : '<button class="btn danger" data-act="cancel">Cancelar pedido</button>'}`;
}
function readSheetFields() {
  const d = S.draft;
  document.querySelectorAll('.sheet-card [data-f]').forEach((el) => {
    const k = el.dataset.f;
    d[k] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? (el.value === '' ? 0 : Number(el.value)) : el.value;
  });
}
async function saveDraft(extra = {}) {
  readSheetFields();
  const d = S.draft; const c = calc(d);
  const patch = {
    name: d.name.trim(), mode: d.mode, pay: d.pay || '', paid: !!d.paid, adminNotes: (d.adminNotes || '').trim(),
    address: d.mode === 'delivery' ? (d.address || '').trim() : '', place: d.mode === 'delivery' ? '' : (d.place || '').trim(),
    items: d.items.filter((i) => Number(i.qty) > 0), extraCharge: Number(d.extraCharge) || 0,
    subtotal: c.sub, total: c.total, status: d.status, updatedAt: Date.now(), ...extra
  };
  patch.subtotal = patch.items.reduce((a, i) => a + i.price * i.qty, 0);
  patch.total = patch.subtotal + patch.extraCharge;
  try { await updateDoc(doc(db, 'orders', d.code), patch); return true; }
  catch (e) { toast(errText(e)); return false; }
}

/* ---------- Puestos ---------- */
const LOCAL = { id: 'local', market: 'Nuestro local', name: 'Av. de los Astros 1305', where: 'Horario normal: martes a domingo', opens: '18:00', closes: '22:30', day: -1 };
function stallLive(s) {
  const ov = (S.config.puestos || {})[s.id];
  const live = ov && ov.date === todayStr() ? ov : null;
  let mode = 'auto';
  if (live && live.forceOpen) mode = 'open'; else if (live && live.available === false) mode = 'closed';
  else if (!live && s.available === false) mode = 'closed';
  return { mode, note: live ? (live.note || '') : '' };
}
function viewStalls() {
  const d = todayDay();
  const today = [LOCAL, ...PUESTOS.filter((s) => s.day === d)];
  const others = PUESTOS.filter((s) => s.day !== d);
  const lbl = { open: '🟢 Abierto (antes de hora)', closed: '⛔ Cerrado hoy', auto: '⏱ Según horario' };
  const card = (s) => {
    const st = stallLive(s);
    return `<div class="card stall" data-stall="${esc(s.id)}">
      <div><h3>${esc(s.market)}${s.id === 'local' ? '' : ' · ' + esc(s.name)}</h3><p class="muted">${esc(s.where || '')} · ${esc(s.opens)}–${esc(s.closes)}</p>
      <p><span class="tag ${st.mode === 'open' ? 'entregado' : st.mode === 'closed' ? 'nuevo' : ''}">${lbl[st.mode]}</span></p></div>
      <div class="switch3"><button class="open ${st.mode === 'open' ? 'on' : ''}" data-mode="open">🟢 Abrir ya</button><button class="closed ${st.mode === 'closed' ? 'on' : ''}" data-mode="closed">⛔ Cerrado hoy</button><button class="auto ${st.mode === 'auto' ? 'on' : ''}" data-mode="auto">⏱ Horario</button></div>
      <input class="note" data-note placeholder="Mensaje opcional (ej. Cerramos por lluvia 🌧️)" value="${esc(st.note)}" maxlength="140" />
      <button class="btn small" data-savenote>Guardar mensaje</button>
    </div>`;
  };
  return `<p class="muted">Sin tocar nada, cada lugar abre y cierra según su horario. Usa <b>Abrir ya</b> si llegas antes, o <b>Cerrado hoy</b> si no abres. Se reinicia solo mañana. (${DAY_PLAIN[d]})</p>
    ${PUESTOS.length ? '' : '<p class="error">No se pudo cargar la lista de puestos (puestos.js). Revisa que esté subido en la carpeta principal.</p>'}
    <div class="row"><button class="btn small" data-allstalls="open">Abrir todos</button><button class="btn small danger" data-allstalls="closed">Cerrar todos</button></div>
    ${today.map(card).join('')}
    ${others.length ? `<div class="card"><h2>Otros días</h2>${others.map((s) => `<p class="muted">${esc(DAY_NAMES[s.day])}: ${esc(s.market)} · ${esc(s.name)} (${esc(s.opens)}–${esc(s.closes)})</p>`).join('')}</div>` : ''}`;
}
const DAY_PLAIN = ['hoy domingo', 'hoy lunes', 'hoy martes', 'hoy miércoles', 'hoy jueves', 'hoy viernes', 'hoy sábado'];
const modeData = (mode, note) => ({ available: mode !== 'closed', forceOpen: mode === 'open', date: todayStr(), note: note || '' });
async function setStall(id, mode, note) {
  try {
    await setDoc(doc(db, 'config', 'site'), { puestos: { [id]: modeData(mode, note) } }, { merge: true });
    toast(mode === 'open' ? 'Abierto ✅' : mode === 'closed' ? 'Cerrado por hoy' : 'Vuelve al horario normal');
  } catch (e) { toast(errText(e)); }
}

/* ---------- Precios ---------- */
function currentPrices() { return { ...DEFAULTS, ...(S.config.prices || {}) }; }
function viewPrices() {
  const p = S.priceDraft || currentPrices();
  return `<p class="muted">Los cambios se ven en la página en menos de un minuto.</p>
    ${PRICE_GROUPS.map((g) => `<div class="card"><h2>${esc(g.title)}</h2><div class="prices">${g.rows.map(([k, l, sub]) => `
      <div class="price-row"><label for="p-${k}">${esc(l)}${sub ? `<small>${esc(sub)}</small>` : ''}</label><div class="money"><input id="p-${k}" data-price="${k}" type="number" inputmode="decimal" min="0" max="9999" value="${esc(p[k])}" /></div></div>`).join('')}</div></div>`).join('')}
    <div class="savebar"><button class="btn primary" data-act="save-prices">Guardar precios</button><button class="btn small" data-act="reset-prices">Restaurar precios originales</button></div>`;
}
function readPrices() {
  const out = {};
  document.querySelectorAll('[data-price]').forEach((el) => { out[el.dataset.price] = el.value === '' ? DEFAULTS[el.dataset.price] : Number(el.value); });
  return out;
}

/* ---------- Más ---------- */
function viewMore() {
  const n = S.noticeDraft || S.config.notice || { active: false, text: '' };
  return `<div class="card"><h2>📣 Aviso en la página</h2>
      <p class="muted">Aparece como barra amarilla arriba del sitio (ej. “Hoy cerramos temprano”).</p>
      <textarea id="n-text" maxlength="240" placeholder="Escribe el aviso…">${esc(n.text)}</textarea>
      <label class="check"><input id="n-active" type="checkbox" ${n.active ? 'checked' : ''} /> Mostrar aviso</label>
      <button class="btn primary" data-act="save-notice">Guardar aviso</button></div>
    <div class="card"><h2>🔔 Alertas</h2><label class="check"><input id="snd" type="checkbox" ${S.sound ? 'checked' : ''} /> Sonido al llegar un pedido nuevo</label></div>
    <div class="card"><h2>📊 Estadísticas y venta rápida</h2><p class="muted">Próximamente (Etapa 2): crepas vendidas, ventas, combinaciones más pedidas, ventas por puesto y método de pago.</p></div>
    <div class="card"><h2>Cuenta</h2><p class="muted">${esc(S.user && S.user.email)}</p>
      <a class="btn" style="text-align:center;text-decoration:none" href="${SITE_URL}" target="_blank" rel="noopener">Ver la página</a>
      <button class="btn danger" data-act="logout">Cerrar sesión</button></div>`;
}

/* ---------- Eventos ---------- */
document.addEventListener('click', async (e) => {
  const t = e.target;
  if (t.closest('[data-close]')) return closeSheet();
  const fl = t.closest('[data-filter]'); if (fl) { S.filter = fl.dataset.filter; return render(); }
  const oc = t.closest('[data-order]'); if (oc) return openOrder(oc.dataset.order);

  /* hoja */
  if (S.draft && !$('#sheet').hidden) {
    const d = S.draft;
    const st = t.closest('[data-status]');
    if (st) { readSheetFields(); d.status = st.dataset.status; if (await saveDraft()) toast('Estado: ' + STATUS_LABEL[d.status]); return drawSheet(); }
    const q = t.closest('[data-qty]');
    if (q) { readSheetFields(); const it = d.items[+q.dataset.i]; it.qty = Math.max(0, (Number(it.qty) || 0) + +q.dataset.qty); return drawSheet(); }
    const rm = t.closest('[data-rm]');
    if (rm) { readSheetFields(); d.items.splice(+rm.dataset.rm, 1); return drawSheet(); }
    const act = t.closest('[data-act]')?.dataset.act;
    if (act === 'add') {
      readSheetFields();
      const name = $('#add-name').value.trim(), price = Number($('#add-price').value) || 0;
      if (!name) return toast('Escribe el nombre del producto');
      d.items.push({ name, qty: 1, price, lines: [] }); return drawSheet();
    }
    if (act === 'save') { if (await saveDraft()) { toast('Pedido guardado ✅'); closeSheet(); } return; }
    if (act === 'cancel') {
      const reason = window.prompt('¿Por qué se cancela? (opcional)');
      if (reason === null) return;
      readSheetFields(); d.status = 'cancelado'; d.cancelReason = reason.trim();
      if (await saveDraft({ cancelReason: d.cancelReason })) { toast('Pedido cancelado'); closeSheet(); } return;
    }
    if (act === 'reopen') { d.status = 'nuevo'; if (await saveDraft({ cancelReason: '' })) { toast('Pedido reabierto'); drawSheet(); } return; }
    return;
  }

  /* puestos */
  const find = (id) => (id === 'local' ? LOCAL : PUESTOS.find((x) => x.id === id));
  const sc = t.closest('[data-stall]');
  if (sc) {
    const id = sc.dataset.stall;
    const md = t.closest('[data-mode]');
    if (md) return setStall(id, md.dataset.mode, $('[data-note]', sc).value.trim());
    if (t.closest('[data-savenote]')) return setStall(id, stallLive(find(id)).mode, $('[data-note]', sc).value.trim());
  }
  const all = t.closest('[data-allstalls]');
  if (all) {
    const d = todayDay(), mode = all.dataset.allstalls;
    try {
      const puestos = {};
      [LOCAL, ...PUESTOS.filter((s) => s.day === d)].forEach((s) => { puestos[s.id] = modeData(mode, stallLive(s).note); });
      await setDoc(doc(db, 'config', 'site'), { puestos }, { merge: true });
      toast(mode === 'open' ? 'Todos abiertos ✅' : 'Todos cerrados hoy');
    } catch (ex) { toast(errText(ex)); }
    return;
  }

  /* precios, aviso, sesión */
  const act = t.closest('[data-act]')?.dataset.act;
  if (act === 'save-prices') {
    const p = readPrices();
    if (Object.values(p).some((v) => !Number.isFinite(v) || v < 0 || v > 9999)) return toast('Revisa los precios: deben ser números válidos');
    try { await setDoc(doc(db, 'config', 'site'), { prices: p }, { merge: true }); S.priceDraft = null; toast('Precios guardados ✅'); } catch (ex) { toast(errText(ex)); }
  } else if (act === 'reset-prices') {
    if (!window.confirm('¿Restaurar todos los precios originales?')) return;
    try { await setDoc(doc(db, 'config', 'site'), { prices: { ...DEFAULTS } }, { merge: true }); S.priceDraft = null; toast('Precios restaurados'); render(); } catch (ex) { toast(errText(ex)); }
  } else if (act === 'save-notice') {
    const notice = { active: $('#n-active').checked, text: $('#n-text').value.trim() };
    try { await setDoc(doc(db, 'config', 'site'), { notice }, { merge: true }); S.noticeDraft = null; toast(notice.active && notice.text ? 'Aviso publicado ✅' : 'Aviso guardado (oculto)'); } catch (ex) { toast(errText(ex)); }
  } else if (act === 'logout') {
    await signOut(auth);
  }
});
document.addEventListener('change', (e) => {
  if (e.target.id === 'snd') { S.sound = e.target.checked; store.set('yk_sound', S.sound ? '1' : '0'); if (S.sound) beep(); }
  if (S.draft && !$('#sheet').hidden && e.target.dataset.f === 'mode') { readSheetFields(); drawSheet(); }
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
