/* SafarCare website — motion and interaction. */
(function () {
  'use strict';
  const I18N = window.SC_I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGsap && !reduce;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!motion) document.body.classList.add('no-motion');

  /* ================= language ================= */
  const nodes = $$('[data-i18n]');
  const en = {};
  nodes.forEach((n) => { en[n.dataset.i18n] = n.textContent; });
  const phNodes = $$('[data-i18n-ph]');
  const enPh = {};
  phNodes.forEach((n) => { enPh[n.dataset.i18nPh] = n.placeholder; });
  let lang = 'en';
  const tr = (k) => (lang !== 'en' && I18N.page[lang][k]) || en[k] || '';
  const ui = (k, a = {}) => { let v = I18N.ui[lang][k] || I18N.ui.en[k]; Object.entries(a).forEach(([x, y]) => { v = v.split('{' + x + '}').join(y); }); return v; };

  function splitTitle() {
    const h = $('[data-split]');
    const text = tr(h.dataset.i18n);
    h.setAttribute('aria-label', text);
    // Arabic letters join, so animate whole words there; letters elsewhere.
    h.innerHTML = text.split(' ').map((w) => `<span class="w" aria-hidden="true">${lang === 'ar' ? `<span class="c">${w}</span>` : [...w].map((c) => `<span class="c">${c}</span>`).join('')}</span>`).join(' ');
  }

  function setLang(next, save) {
    lang = I18N.page[next] || next === 'en' ? next : 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    nodes.forEach((n) => { if (!n.hasAttribute('data-split')) n.textContent = tr(n.dataset.i18n); });
    phNodes.forEach((n) => { n.placeholder = (lang !== 'en' && I18N.page[lang][n.dataset.i18nPh]) || enPh[n.dataset.i18nPh]; });
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    splitTitle();
    buildStages();
    renderPlain();
    showField(currentField, true);
    if (lastParsed) renderResult(lastParsed, true);
    if (save) { try { localStorage.setItem('safarcare-lang', lang); } catch (e) { /* storage off */ } }
    if (hasGsap) requestAnimationFrame(() => ScrollTrigger.refresh());
  }
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang, true)));

  /* ================= header ================= */
  const header = $('.site-header');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('solid', y > 30);
    header.classList.toggle('hide', y > 500 && y > lastY + 4);
    if (y < lastY - 4) header.classList.remove('hide');
    lastY = y;
  }, { passive: true });

  /* ================= globe ================= */
  const canvas = $('.globe');
  const ctx = canvas.getContext('2d');
  const D2R = Math.PI / 180;
  const HOME = [9.52, 44.09]; // Hargeisa
  const PLACES = [[25.25, 55.36], [8.98, 38.8], [-1.32, 36.93], [21.68, 39.15], [41.27, 28.75], [51.47, -0.45], [44.88, -93.2], [25.27, 51.6], [2.01, 45.3], [30.12, 31.4], [43.68, -79.6], [-26.13, 28.24], [3.13, 101.55], [59.65, 17.92]];
  const pts = [];
  const N = 1300;
  for (let i = 0; i < N; i++) { // Fibonacci sphere
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  const ll = ([lat, lon]) => [Math.cos(lat * D2R) * Math.cos(lon * D2R), Math.sin(lat * D2R), Math.cos(lat * D2R) * Math.sin(lon * D2R)];
  const routes = PLACES.map((p, i) => ({ a: ll(HOME), b: ll(p), t: (i * 0.37) % 1.5 - 0.2, speed: 0.2 + (i % 4) * 0.03 }));
  function slerp(a, b, t) {
    const d = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const s = Math.sin(d) || 1, k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s;
    const lift = 1 + Math.sin(Math.PI * t) * Math.min(0.32, d * 0.18);
    return [(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift];
  }
  let W = 0, H = 0, R = 0, CX = 0, CY = 0, dpr = 1, rot = 0.81, tilt = 0.18, clock = 0, mx = 0, my = 0, globeOn = true;
  function sizeGlobe() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mobile = W < 760;
    R = mobile ? W * 0.58 : Math.min(W * 0.25, H * 0.38);
    CX = mobile ? W * 0.62 : (document.documentElement.dir === 'rtl' ? W * 0.25 : W * 0.75);
    CY = mobile ? H * 0.94 : H * 0.5;
  }
  function project(p) {
    const ry = rot + mx * 0.25, rx = tilt + my * 0.12;
    let x = p[0] * Math.cos(ry) - p[2] * Math.sin(ry);
    let z = p[0] * Math.sin(ry) + p[2] * Math.cos(ry);
    let y = p[1] * Math.cos(rx) - z * Math.sin(rx);
    z = p[1] * Math.sin(rx) + z * Math.cos(rx);
    return [CX + x * R, CY - y * R, z];
  }
  function drawGlobe(dt) {
    ctx.clearRect(0, 0, W, H);
    // atmosphere
    const g = ctx.createRadialGradient(CX, CY, R * 0.85, CX, CY, R * 1.25);
    g.addColorStop(0, 'rgba(46,196,182,0.10)'); g.addColorStop(1, 'rgba(46,196,182,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(CX, CY, R * 1.25, 0, Math.PI * 2); ctx.fill();
    // body and rim
    const body = ctx.createRadialGradient(CX - R * 0.35, CY - R * 0.4, R * 0.1, CX, CY, R);
    body.addColorStop(0, 'rgba(22,53,99,0.55)'); body.addColorStop(1, 'rgba(5,14,31,0.2)');
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(155,239,230,0.22)'; ctx.lineWidth = 1.2; ctx.stroke();
    // dots
    for (const p of pts) {
      const [x, y, z] = project(p);
      if (z < 0) continue;
      const s = 0.9 + z * 1.3;
      ctx.fillStyle = `rgba(155,190,220,${0.08 + z * 0.62})`;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    // routes
    for (const r of routes) {
      r.t += dt * r.speed;
      if (r.t > 1.6) r.t = -Math.random() * 0.25;
      if (r.t <= 0) continue;
      const head = Math.min(r.t, 1), tail = Math.max(0, r.t - 0.6);
      ctx.beginPath();
      let started = false;
      for (let s = tail; s <= head; s += 0.02) {
        const [x, y, z] = project(slerp(r.a, r.b, s));
        if (z < 0) { started = false; continue; }
        if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
      }
      const fade = r.t > 1 ? Math.max(0, 1 - (r.t - 1) / 0.6) : 1;
      ctx.strokeStyle = `rgba(46,196,182,${0.75 * fade})`; ctx.lineWidth = 1.4; ctx.stroke();
      if (r.t < 1) {
        const [x, y, z] = project(slerp(r.a, r.b, head));
        if (z > 0) {
          ctx.fillStyle = '#9BEFE6'; ctx.shadowColor = '#2EC4B6'; ctx.shadowBlur = 14;
          ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        }
      } else {
        const [x, y, z] = project(r.b);
        if (z > 0) { ctx.strokeStyle = `rgba(155,239,230,${fade})`; ctx.beginPath(); ctx.arc(x, y, 3 + (1 - fade) * 10, 0, Math.PI * 2); ctx.stroke(); }
      }
    }
    // home beacon
    const [hx, hy, hz] = project(ll(HOME));
    if (hz > 0) {
      const pulse = (performance.now() / 1400) % 1;
      ctx.strokeStyle = `rgba(46,196,182,${1 - pulse})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(hx, hy, 4 + pulse * 22, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#2EC4B6'; ctx.beginPath(); ctx.arc(hx, hy, 4, 0, Math.PI * 2); ctx.fill();
    }
  }
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (globeOn && !document.hidden) { clock += dt; rot = 0.81 + Math.sin(clock * 0.12) * 0.55; drawGlobe(dt); }
    if (motion) requestAnimationFrame(loop);
  }
  sizeGlobe();
  window.addEventListener('resize', () => { sizeGlobe(); if (!motion) { routes.forEach((r) => { r.t = 0.8; }); drawGlobe(0); } });
  if (motion) {
    new IntersectionObserver(([e]) => { globeOn = e.isIntersecting; }).observe(canvas);
    window.addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
    requestAnimationFrame(loop);
  } else {
    routes.forEach((r, i) => { r.t = 0.7 + (i % 3) * 0.1; });
    drawGlobe(0);
  }

  /* ================= ticker ================= */
  const CODES = [['HGA', 'Hargeisa'], ['ADD', 'Addis Ababa'], ['DXB', 'Dubai'], ['JED', 'Jeddah'], ['IST', 'Istanbul'], ['NBO', 'Nairobi'], ['DOH', 'Doha'], ['MGQ', 'Mogadishu'], ['CAI', 'Cairo'], ['LHR', 'London'], ['MSP', 'Minneapolis'], ['YYZ', 'Toronto'], ['ARN', 'Stockholm'], ['KUL', 'Kuala Lumpur']];
  const track = $('.ticker-track');
  const chunk = CODES.map(([c, n]) => `<span><b>${c}</b> ${n.toUpperCase()}</span>`).join('');
  track.innerHTML = chunk + chunk;
  if (motion) gsap.to(track, { xPercent: -50, duration: 48, ease: 'none', repeat: -1 });

  /* ================= departures board ================= */
  const W_TIME = 5, W_DEST = 12, W_FLT = 7, W_STAT = 13;
  const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:- ';
  const rowsEl = $('.board-rows');
  const board = I18N.board.slice();
  const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
  const flaps = (n) => `<span class="flaps">${'<span class="flap"> </span>'.repeat(n)}</span>`;
  rowsEl.innerHTML = board.map(() => `<div class="board-row" role="row"><span role="cell">${flaps(W_TIME)}</span><span role="cell">${flaps(W_DEST)}</span><span role="cell">${flaps(W_FLT)}</span><span role="cell" class="st">${flaps(W_STAT)}</span><span class="board-plain" role="cell"></span></div>`).join('');
  const rowEls = $$('.board-row', rowsEl);
  function setFlaps(cell, text, animate) {
    const fs = $$('.flap', cell);
    fs.forEach((f, i) => {
      const target = text[i] || ' ';
      if (!animate) { f.textContent = target; return; }
      let steps = 3 + Math.floor(Math.random() * 6);
      const delay = i * 28;
      const tick = () => {
        if (steps-- <= 0) { f.textContent = target; f.classList.remove('flip'); return; }
        f.textContent = CH[Math.floor(Math.random() * CH.length)];
        f.classList.remove('flip'); void f.offsetWidth; f.classList.add('flip');
        setTimeout(tick, 70);
      };
      setTimeout(tick, delay);
    });
  }
  function renderBoard(animate) {
    rowEls.forEach((row, i) => {
      const d = board[i];
      const cells = row.children;
      setFlaps(cells[0], pad(d.time, W_TIME), animate);
      setFlaps(cells[1], pad(d.dest, W_DEST), animate);
      setFlaps(cells[2], pad(d.flt, W_FLT), animate);
      cells[3].className = 'st ' + (d.kind === 'check' ? 'status-check' : 'status-ok');
      setFlaps(cells[3], pad(d.status, W_STAT), animate);
    });
    renderPlain();
  }
  function renderPlain() {
    rowEls.forEach((row, i) => { row.lastElementChild.textContent = board[i].plain[lang] || board[i].plain.en; });
  }
  renderBoard(false);
  if (motion) {
    let boardTimer = null;
    ScrollTrigger.create({
      trigger: '.board', start: 'top 85%', end: 'bottom top',
      onEnter: () => { renderBoard(true); boardTimer = boardTimer || setInterval(() => { board.push(board.shift()); renderBoard(true); }, 4200); },
      onEnterBack: () => { boardTimer = boardTimer || setInterval(() => { board.push(board.shift()); renderBoard(true); }, 4200); },
      onLeave: () => { clearInterval(boardTimer); boardTimer = null; },
      onLeaveBack: () => { clearInterval(boardTimer); boardTimer = null; },
    });
  }

  /* ================= ticket decode ================= */
  const ORDER = ['from', 'via', 'to', 'name', 'pnr', 'flt', 'date', 'status', 'bag', 'cabin'];
  let currentField = 'from';
  function showField(key, quiet) {
    currentField = key;
    const btn = $(`[data-field="${key}"]`);
    $$('.code').forEach((b) => { b.classList.toggle('on', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
    const [title, body] = I18N.decode[lang][key];
    const box = $('.callout');
    const t = btn.textContent.trim();
    $('#callout-code').textContent = t === '—' ? 'CABIN' : t;
    $('#callout-title').textContent = title;
    $('#callout-body').textContent = body;
    box.classList.toggle('is-missing', btn.classList.contains('missing'));
    if (motion && !quiet) gsap.fromTo(box.children, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out', overwrite: true });
  }
  $$('.code').forEach((b) => b.addEventListener('click', () => showField(b.dataset.field)));

  /* ================= airport journey ================= */
  const ICONS = [
    '<path d="M3 10h18v4H3zM6 14v6M18 14v6M8 6h8v4H8z"/>',
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 16h6"/>',
    '<path d="M4 4h16v6H4zM12 10v10M8 20h8"/>',
    '<path d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 1 2 2h14a2 2 0 0 1 2-2v-4a2 2 0 0 1 0-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>',
    '<path d="M4 17c4-8 12-8 16 0M4 17h4M16 17h4"/><circle cx="12" cy="9" r="2"/>',
    '<circle cx="9" cy="8" r="4"/><path d="M3 21c0-4 3-6 6-6s6 2 6 6M16 11l2 2 4-4"/>',
    '<rect x="6" y="6" width="12" height="15" rx="2"/><path d="M9 6V3h6v3M10 11v5M14 11v5"/>',
  ];
  const stagesEl = $('.stages');
  function buildStages() {
    stagesEl.innerHTML = I18N.stages[lang].map(([t, b], i) => `<li class="stage${i === 5 ? ' transit' : ''}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[i]}</svg></span><h3>${t}</h3><p>${b}</p></li>`).join('');
  }

  /* ================= ticket reader ================= */
  const out = $('#result');
  const errEl = $('#tool-error');
  let lastParsed = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const two = (n) => String(n).padStart(2, '0');
  const MONTHS = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], so: ['Jan', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Lul', 'Ogs', 'Seb', 'Okt', 'Nof', 'Dis'], ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] };
  const fmt = (d) => `${d.getDate()} ${MONTHS[lang][d.getMonth()]} ${d.getFullYear()}${d.getHours() || d.getMinutes() ? `, ${two(d.getHours())}:${two(d.getMinutes())}` : ''}`;
  function bagText(b) {
    if (b.status === 'conflict') return [ui('notFound'), ui('unclear'), true];
    if (b.status !== 'found') return [ui('notFound'), ui('couldNot'), true];
    if (b.pieces === 0) return [ui('none'), '', false];
    if (b.pieces != null && b.kgPerPiece != null) return [ui('piecesKg', { n: b.pieces, kg: b.kgPerPiece }), ui('readAs', { raw: b.raw.join(' ') }), false];
    if (b.pieces != null) return [ui('pieces', { n: b.pieces }), ui('readAs', { raw: b.raw.join(' ') }), false];
    return [ui('total', { kg: b.totalKg }), ui('readAs', { raw: b.raw.join(' ') }), false];
  }
  function renderResult(p, quiet) {
    const item = (k, v) => `<div class="r-item${v ? '' : ' nf'}"><span>${ui(k)}</span><b>${esc(v || ui('notFound'))}</b></div>`;
    const seq = [];
    p.segments.forEach((s, i) => { if (i === 0) seq.push(s.from); seq.push(s.to); });
    const bag = (k, b) => { const [t, sub, nf] = bagText(b); return `<div class="r-bag${nf ? ' nf' : ''}"><span>${ui(k)}</span><b>${esc(t)}</b>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`; };
    out.innerHTML = `
      <div class="r-route">${seq.map((c, i) => `${i ? '<span class="sep"></span>' : ''}<span>${esc(c)}</span>`).join('')}</div>
      <div class="r-grid">${item('passenger', p.passenger)}${item('airline', p.airline)}${item('booking', p.bookingRef)}${item('cls', p.cls)}</div>
      ${p.segments.map((s) => `<div class="r-flight"><span class="t">${esc(s.flight || '')} ${esc(AIRPORTS[s.from] || s.from)} → ${esc(AIRPORTS[s.to] || s.to)}</span><span class="s">${ui('departs')}: ${s.dep ? esc(fmt(s.dep)) : ui('notFound')}</span><span class="s">${ui('arrives')}: ${s.arr ? esc(fmt(s.arr)) : ui('notFound')}</span></div>`).join('')}
      ${bag('checked', p.baggage.checked)}${bag('cabin', p.baggage.cabin)}
      <p class="r-foot">${ui('foot')}</p>`;
    out.hidden = false;
    if (motion && !quiet) {
      gsap.from(out.children, { y: 24, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' });
      gsap.from($$('.sep', out), { scaleX: 0, transformOrigin: 'left', duration: 0.6, delay: 0.2, stagger: 0.1 });
    }
  }
  function showError(key) { errEl.textContent = ui(key); errEl.hidden = false; out.hidden = true; lastParsed = null; }
  function read(text) {
    errEl.hidden = true;
    if (!text || text.replace(/\s/g, '').length < 10) return showError('errEmpty');
    let p;
    try { p = parse(text); } catch (e) { return showError('errNotTicket'); }
    if (!p.segments.length && !(p.bookingRef && p.airline)) return showError('errNotTicket');
    lastParsed = p;
    renderResult(p);
  }
  $('#read-btn').addEventListener('click', () => read($('#ticket-text').value));
  $('#sample-btn').addEventListener('click', () => {
    const d = new Date(Date.now() + 12 * 864e5);
    const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dd = `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()}`;
    $('#ticket-text').value = `Ethiopian Airlines\nELECTRONIC TICKET RECEIPT\nBooking Reference: QK7M2P\nPassenger Name: HASSAN/AMINA MS\n\nFlight  ET 908   Economy\nFrom Hargeisa (HGA) To Addis Ababa (ADD)\nDeparture ${dd} 14:30   Arrival ${dd} 16:20\nBaggage allowance: 2PC 23KG\n\nFlight  ET 614   Economy\nFrom Addis Ababa (ADD) To Dubai (DXB)\nDeparture ${dd} 22:10   Arrival 01:15\nBaggage allowance: 2PC 23KG`;
    read($('#ticket-text').value);
  });
  $('#pdf-input').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    errEl.hidden = true;
    if (!window.pdfjsLib) return showError('errPdf');
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
      const doc = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
      let text = '';
      for (let i = 1; i <= Math.min(doc.numPages, 6); i++) {
        const page = await doc.getPage(i);
        const c = await page.getTextContent();
        let lastY = null;
        c.items.forEach((it) => { const y = it.transform[5]; text += (lastY !== null && Math.abs(y - lastY) > 3 ? '\n' : ' ') + it.str; lastY = y; });
        text += '\n';
      }
      if (text.replace(/\s/g, '').length < 25) return showError('errPdfText');
      $('#ticket-text').value = text.trim();
      read(text);
    } catch (err) {
      showError('errPdf');
    }
  });

  /* ================= language morph ================= */
  const lines = $$('.morph-line');
  const tags = $$('.morph-tags span');
  tags[0].classList.add('on');

  /* ================= start ================= */
  let saved = null;
  try { saved = localStorage.getItem('safarcare-lang'); } catch (e) { /* storage off */ }
  const hashLang = location.hash.replace('#', '');
  const browser = (navigator.language || 'en').slice(0, 2);
  const startLang = ['en', 'so', 'ar'].includes(hashLang) ? hashLang : saved || (['so', 'ar'].includes(browser) ? browser : 'en');
  setLang(startLang, false);
  sizeGlobe();
  if (!motion) drawGlobe(0);

  if (!motion) {
    document.body.classList.remove('is-loading');
    $('.ring .ring-fill').style.strokeDashoffset = '0';
    $('.ring-n').textContent = '100%';
    $$('.checks li').forEach((li) => li.classList.add('done'));
    showField('bag', true);
    return;
  }

  /* ---------- opening sequence ---------- */
  const introTl = gsap.timeline({ onComplete: () => document.body.classList.remove('is-loading') });
  introTl
    .from('.intro-dot', { scale: 0, transformOrigin: 'center', duration: 0.45, ease: 'back.out(3)' })
    .fromTo('.intro-path', { strokeDashoffset: 120, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.1')
    .from('.intro-arrow', { x: -18, opacity: 0, duration: 0.4, ease: 'power3.out' }, '-=0.25')
    .to('.intro-mark', { scale: 0.6, opacity: 0, duration: 0.5, ease: 'power3.in' }, '+=0.15')
    .to('.intro', { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, '-=0.15')
    .from('.globe', { opacity: 0, scale: 1.15, duration: 1.6, ease: 'expo.out' }, '-=0.5')
    .from('.hero-kicker', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=1.3')
    .from('.hero-title .c', { yPercent: 110, rotate: 6, duration: 0.9, stagger: 0.022, ease: 'expo.out' }, '-=1.2')
    .from('.hero-lede', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
    .from('.hero-actions .btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.6')
    .from('.ticker', { opacity: 0, duration: 1 }, '-=0.4')
    .fromTo('.site-header', { yPercent: -100 }, { yPercent: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform' }, '-=1.2');

  // Hero recedes as you scroll away.
  gsap.to('.hero-inner', { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.globe', { scale: 1.12, yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Section headings reveal with a line mask, once.
  $$('h2').forEach((h) => {
    if (h.closest('.finale')) return;
    gsap.from(h, { clipPath: 'inset(0 0 100% 0)', y: 40, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });

  const mm = gsap.matchMedia();

  /* ---------- decode: pinned scan on wide screens ---------- */
  mm.add('(min-width: 900px)', () => {
    gsap.set('.pass-beam', { opacity: 1, top: '-26%' });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.decode', start: 'top top', end: '+=2600', pin: '.decode-pin', scrub: 0.6,
        onUpdate: (st) => {
          const idx = Math.min(ORDER.length - 1, Math.floor(st.progress * ORDER.length));
          if (ORDER[idx] !== currentField) showField(ORDER[idx]);
        },
      },
    });
    tl.fromTo('.pass', { rotateX: 22, rotateY: -14, y: 60 }, { rotateX: 0, rotateY: 0, y: 0, duration: 0.15, ease: 'power2.out' })
      .fromTo('.arc', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.12, stagger: 0.04 }, 0.02)
      .to('.pass-beam', { top: '100%', duration: 0.85, ease: 'none' }, 0.1)
      .to('.decode-progress i', { scaleX: 1, duration: 1, ease: 'none' }, 0);
    return () => gsap.set('.pass-beam', { clearProps: 'all' });
  });
  mm.add('(max-width: 899px)', () => {
    let i = 0, timer = null;
    const st = ScrollTrigger.create({
      trigger: '.pass', start: 'top 80%', end: 'bottom 20%',
      onToggle: (s) => {
        clearInterval(timer);
        if (s.isActive) timer = setInterval(() => { i = (i + 1) % ORDER.length; showField(ORDER[i]); }, 2400);
      },
    });
    return () => { clearInterval(timer); st.kill(); };
  });

  /* ---------- baggage: bags drop onto the scale ---------- */
  const kg = $('.kg');
  const weight = { v: 0 };
  gsap.timeline({ scrollTrigger: { trigger: '.baggage', start: 'top 70%', end: 'center 45%', scrub: 1 } })
    .from('.s1', { y: -520, rotate: -12, opacity: 0, ease: 'bounce.out', duration: 1 })
    .to(weight, { v: 23, duration: 0.4, onUpdate: () => { kg.textContent = Math.round(weight.v); } }, 0.7)
    .to('.scale', { scaleY: 0.92, transformOrigin: 'bottom', duration: 0.15, yoyo: true, repeat: 1 }, 0.75)
    .from('.s2', { y: -520, rotate: 10, opacity: 0, ease: 'bounce.out', duration: 1 }, 1.0)
    .to(weight, { v: 46, duration: 0.4, onUpdate: () => { kg.textContent = Math.round(weight.v); } }, 1.7)
    .to('.scale', { scaleY: 0.9, transformOrigin: 'bottom', duration: 0.15, yoyo: true, repeat: 1 }, 1.75);
  gsap.from('.codes div', { y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.codes', start: 'top 85%' } });

  /* ---------- journey: horizontal flight ---------- */
  mm.add('(min-width: 900px)', () => {
    const rail = $('.stages');
    const line = $('.journey-line path');
    const plane = $('.journey-plane');
    const dist = () => rail.scrollWidth - innerWidth + Math.max(40, (innerWidth - 1200) / 2);
    const drawLine = () => {
      const w = rail.scrollWidth + 400;
      let d = 'M0 20';
      for (let x = 0; x <= w; x += 40) d += ` L${x} ${20 + Math.sin(x / 140) * 10}`;
      line.setAttribute('d', d);
      line.parentNode.setAttribute('viewBox', `0 0 ${w} 40`);
      line.parentNode.style.width = w + 'px';
    };
    drawLine();
    const stages = $$('.stage');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.journey', start: 'top top', end: () => '+=' + dist(), pin: '.journey-pin', scrub: 0.8, invalidateOnRefresh: true,
        onUpdate: (st) => {
          const cx = innerWidth * 0.5;
          stages.forEach((s) => { const r = s.getBoundingClientRect(); s.classList.toggle('active', r.left < cx && r.right > cx - 40); });
          gsap.set(plane, { y: Math.sin(st.progress * 14) * 8, rotate: Math.cos(st.progress * 14) * 8 });
        },
      },
    });
    tl.to(rail, { x: () => -dist(), ease: 'none' }, 0)
      .to('.journey-line', { x: () => -dist(), ease: 'none' }, 0)
      .fromTo(plane, { x: () => innerWidth * 0.08 }, { x: () => innerWidth * 0.82, ease: 'none' }, 0);
    gsap.from('.stage', { y: 80, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.journey', start: 'top 60%' } });
  });
  mm.add('(max-width: 899px)', () => {
    gsap.utils.toArray('.stage').forEach((s) => gsap.from(s, { x: 60, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 88%' } }));
  });

  /* ---------- prepare: the checklist fills as you scroll ---------- */
  const checks = $$('.checks li');
  const ringN = $('.ring-n');
  ScrollTrigger.create({
    trigger: '.checklist', start: 'top 75%', end: 'bottom 45%', scrub: true,
    onUpdate: (st) => {
      const n = Math.round(st.progress * checks.length);
      checks.forEach((li, i) => li.classList.toggle('done', i < n));
      const pct = Math.round(st.progress * 100);
      ringN.textContent = pct + '%';
      $('.ring-fill').style.strokeDashoffset = String(100 - pct);
    },
  });
  gsap.from('.checklist', { rotateX: 18, y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', transformPerspective: 900, scrollTrigger: { trigger: '.checklist', start: 'top 85%' } });

  /* ---------- languages: one sentence, three languages ---------- */
  let li = 0, langTimer = null;
  gsap.set(lines.slice(1), { opacity: 0 });
  const nextLine = () => {
    const cur = lines[li]; li = (li + 1) % lines.length; const nxt = lines[li];
    gsap.to(cur, { opacity: 0, y: -26, filter: 'blur(14px)', duration: 0.7, ease: 'power2.in' });
    gsap.fromTo(nxt, { opacity: 0, y: 26, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, delay: 0.55, ease: 'expo.out' });
    tags.forEach((t, i) => t.classList.toggle('on', i === li));
  };
  ScrollTrigger.create({ trigger: '.langs', start: 'top 80%', end: 'bottom 20%', onToggle: (s) => { clearInterval(langTimer); if (s.isActive) langTimer = setInterval(nextLine, 3200); } });

  /* ---------- promises draw in ---------- */
  gsap.from('.promises li', { clipPath: 'inset(0 100% 0 0)', duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.promises', start: 'top 80%' } });

  /* ---------- finale: lift-off ---------- */
  const fin = $('.finale');
  const jet = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  jet.setAttribute('viewBox', '0 0 64 64'); jet.setAttribute('class', 'jet'); jet.setAttribute('aria-hidden', 'true');
  jet.innerHTML = '<path d="M32 4c2 0 3 3 3 7v13l22 13v5l-22-6v12l7 5v4l-10-3-10 3v-4l7-5V36L7 42v-5l22-13V11c0-4 1-7 3-7z" fill="#F2F6FA"/>';
  Object.assign(jet.style, { position: 'absolute', left: '50%', bottom: '6%', width: '76px', marginLeft: '-38px', filter: 'drop-shadow(0 0 18px rgba(46,196,182,.7))' });
  fin.appendChild(jet);
  gsap.timeline({ scrollTrigger: { trigger: fin, start: 'top 75%', end: 'bottom bottom', scrub: 1 } })
    .from('.finale h2', { letterSpacing: '0.35em', opacity: 0, ease: 'power2.out', duration: 1 }, 0)
    .fromTo(jet, { y: 0, scale: 1 }, { y: () => -innerHeight * 0.75, scale: 0.35, ease: 'power2.in', duration: 1.4 }, 0.1)
    .from('.finale p, .finale .btn', { y: 30, opacity: 0, stagger: 0.1, duration: 0.6 }, 0.5);

  /* ---------- magnetic buttons (fine pointers only) ---------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    $$('.magnetic').forEach((b) => {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3.out' });
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4); });
      b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
