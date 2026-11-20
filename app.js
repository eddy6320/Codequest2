/* CodeQuest · motor de la app. Sin dependencias. Contenido en /content, formato en CONTENT_SPEC.md */
(() => {
'use strict';
const CQ = window.CQ;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pad = n => String(n).padStart(2, '0');
const dayStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayAdd = n => { const d = new Date(); d.setDate(d.getDate() + n); return dayStr(d); };
const PAL = ['#8b5cf6', '#ff6fae', '#ce82ff', '#ff9600', '#ff4b4b', '#00cd9c', '#e5a800', '#2b70c9'];
const TITLES = ['Novato', 'Aprendiz', 'Programador', 'Desarrollador', 'Ingeniero', 'Arquitecto', 'Maestro', 'Leyenda'];
const MAXH = 5, REGEN = 15 * 60e3, VERSION = '2.3.0';

/* ---------- estado ---------- */
const KEY = 'codequest.v1';
const DEF = { lang: null, xp: 0, streak: 0, best: 0, last: null, hearts: MAXH, heartsAt: 0, done: {}, srs: {}, hist: {}, goal: 30,
  sound: true, theme: 'auto', ach: {}, perfect: 0, practices: 0, answered: 0, right: 0, seen: false, offered: {}, coins: 0, pet: null, places: null, q: null, freeze: 0, boostTo: 0, lg: null, mq: null, shieldTo: 0, c14: 0 };
let S;
try { S = { ...DEF, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { S = { ...DEF }; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } };

function refreshHearts() {
  if (S.hearts >= MAXH) { S.hearts = MAXH; S.heartsAt = 0; return; }
  const now = Date.now(); if (!S.heartsAt) S.heartsAt = now;
  const g = Math.floor((now - S.heartsAt) / REGEN);
  if (g > 0) { S.hearts = Math.min(MAXH, S.hearts + g); S.heartsAt = S.hearts >= MAXH ? 0 : S.heartsAt + g * REGEN; }
}
function loseHeart() { refreshHearts(); if (S.hearts >= MAXH) S.heartsAt = Date.now(); S.hearts = Math.max(0, S.hearts - 1); save(); }
function gainHeart() { refreshHearts(); S.hearts = Math.min(MAXH, S.hearts + 1); if (S.hearts >= MAXH) S.heartsAt = 0; save(); }
const nextHeartIn = () => S.hearts >= MAXH ? 0 : Math.max(0, REGEN - (Date.now() - S.heartsAt));
const fmtMs = ms => `${Math.floor(ms / 60000)}:${pad(Math.floor(ms / 1000) % 60)}`;
const streakNow = () => (S.last === dayStr() || S.last === dayAdd(-1) || (S.last === dayAdd(-2) && S.freeze > 0) || S.shieldTo > Date.now()) ? S.streak : 0;
function bumpStreak() { const t = dayStr(); if (S.last === t) return; if (S.last && S.last !== dayAdd(-1) && S.shieldTo > Date.now()) S.streak++; else if (S.last === dayAdd(-2) && S.freeze > 0) { S.freeze--; S.streak++; } else S.streak = S.last === dayAdd(-1) ? S.streak + 1 : 1; S.last = t; S.best = Math.max(S.best, S.streak); }
function addXP(n) { if (S.boostTo > Date.now()) n *= 2; S.xp += n; S.coins = (S.coins || 0) + n; qadd('xp', n); const t = dayStr(); S.hist[t] = (S.hist[t] || 0) + n; }
const level = () => Math.floor(Math.sqrt(S.xp / 40)) + 1;
const levelXp = n => 40 * (n - 1) * (n - 1);

/* ---------- currículo ---------- */
const ORDER = ['python', 'javascript', 'typescript', 'html', 'sql', 'java', 'csharp', 'kotlin', 'c', 'cpp', 'go', 'rust', 'php', 'bash', 'pseint'];
const LANGS = [...ORDER.filter(id => CQ.content[id]), ...Object.keys(CQ.content).filter(id => !ORDER.includes(id))];
const FLAT = {}, EX = {};
function flat(lang) {
  if (FLAT[lang]) return FLAT[lang];
  const a = [];
  CQ.content[lang].units.forEach((u, ui) => u.lessons.forEach((l, li) => a.push({ u, l, ui, li, key: `${lang}.${u.id}.${l.id}`, idx: a.length, lang })));
  return (FLAT[lang] = a);
}
LANGS.forEach(lang => flat(lang).forEach(f => f.l.ex.forEach((x, i) => { x._id = `${f.key}.${i}`; EX[x._id] = { ex: x, lang, f }; })));
const isDone = key => !!S.done[key];
const langProgress = lang => { const fl = flat(lang); return { d: fl.filter(f => isDone(f.key)).length, n: fl.length }; };
const totalDone = () => Object.keys(S.done).length;

/* ---------- formato de texto / código ---------- */
const KW = new Set(`def class return if elif else for while in not and or import from as try except finally with lambda pass break continue None True False is yield raise global nonlocal assert del
function const let var new this await async typeof null undefined true false of switch case default do void static public private protected final abstract interface extends implements super
int long float double char boolean byte short String struct sizeof enum typedef unsigned signed include define namespace using
SELECT FROM WHERE GROUP BY ORDER HAVING JOIN INNER LEFT RIGHT OUTER ON AS AND OR NOT NULL INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE PRIMARY KEY LIMIT OFFSET DISTINCT COUNT SUM AVG MIN MAX LIKE IN IS ASC DESC UNIQUE DEFAULT ALTER DROP INDEX FOREIGN REFERENCES BETWEEN UNION CASE WHEN THEN END`.split(/\s+/));
const COM = { python: /#[^\n]*/.source, sql: /--[^\n]*|\/\*[\s\S]*?\*\//.source, html: /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//.source, c: /\/\/[^\n]*|\/\*[\s\S]*?\*\//.source };
const REST = tag => '|(' + /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/.source + ')|(' + /\b\d+(?:\.\d+)?\b/.source + ')|(' +
  (tag ? /<\/?[A-Za-z][\w-]*/.source : '(?!)') + ')|(' + /\b[A-Za-z_]\w*\b/.source + ')';
const HLRE = {};
function hl(code, lang) {
  const key = COM[lang] ? lang : 'c';
  const re = HLRE[key] || (HLRE[key] = new RegExp('(' + COM[key] + ')' + REST(key === 'html'), 'g'));
  re.lastIndex = 0;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const t = m[0];
    const c = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'n' : m[4] ? 'k' : (KW.has(t) || (lang === 'sql' && KW.has(t.toUpperCase()))) ? 'k' : null;
    out += c ? `<span class="h-${c}">${esc(t)}</span>` : esc(t);
    last = re.lastIndex;
  }
  return out + esc(code.slice(last));
}
const codeBlock = (code, lang) => `<pre class="code">${hl(String(code).replace(/\n$/, ''), lang)}</pre>`;
const inl = s => esc(s).replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
function md(src, lang) {
  return String(src).split(/```[\w+-]*\n?/).map((part, i) => {
    if (i % 2) return codeBlock(part, lang);
    return part.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => {
      const lines = p.split('\n');
      if (lines.every(l => /^\s*[-*•]\s+/.test(l))) return `<ul>${lines.map(l => `<li>${inl(l.replace(/^\s*[-*•]\s+/, ''))}</li>`).join('')}</ul>`;
      return `<p>${lines.map(inl).join('<br>')}</p>`;
    }).join('');
  }).join('');
}

/* ---------- mascota, sonido, confeti ---------- */
/* La mascota del usuario (o Bit verde por defecto). Etapas por nivel: 0 Cría · 1 Joven · 2 Adulta · 3 Legendaria */
const stageOf = lv => Math.min(3, Math.floor((lv - 1) / 3));
const petStage = () => stageOf(level());
function petTick() {
  const P = S.pet; if (!P) return;
  const now = Date.now(); if (P.dead) { P.ts = now; return; }
  const h = Math.max(0, (now - (P.ts || now)) / 36e5), c = v => Math.max(0, Math.min(100, v)), h0 = P.hun;
  P.hun = c(P.hun - h * 5); P.cln = c(P.cln - h * 3); P.fun = c(P.fun - h * 4); P.ts = now;
  if (P.hun > 0) P.sv = 0; else if (!P.sv) P.sv = now - Math.max(0, (h * 5 - h0) / 5) * 36e5;
  if (P.sv && now - P.sv > 24 * 36e5) { P.dead = true; P.deadAt = now; P.sv = 0; }   // 24 h con hambre al máximo = se desmaya
}
const petNeeds = () => S.pet && (S.pet.dead || (petTick(), Math.min(S.pet.hun, S.pet.cln, S.pet.fun) < 25));
function petMood() { if (!S.pet) return 'happy'; petTick(); if (S.pet.dead) return 'dead'; return Math.min(S.pet.hun, S.pet.cln, S.pet.fun) < 25 ? 'sad' : 'happy'; }
function bit(size = 96, mood = 'happy') { return CQ.pet.art(S.pet, size, mood === 'happy' ? petMood() : mood, petStage()); }
let ac;
function beep(freqs, dur = 0.11) {
  if (typeof gpetReact === 'function') gpetReact(freqs);
  if (!S.sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * dur;
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + 0.03);
    });
  } catch (e) { /* sin audio */ }
}
const SND = { ok: [660, 880], bad: [233, 175], win: [523, 659, 784, 1047, 1319], tick: [1200], level: [392, 523, 659, 784, 1047, 1319] };
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'); c.id = 'confetti'; document.body.appendChild(c);
  const w = (c.width = innerWidth), h = (c.height = innerHeight), g = c.getContext('2d');
  const cols = PAL, P = Array.from({ length: 130 }, () => ({ x: Math.random() * w, y: -20 - Math.random() * h * .5, vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 4,
    s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[Math.floor(Math.random() * cols.length)] }));
  const t0 = performance.now();
  (function tick(t) {
    g.clearRect(0, 0, w, h);
    P.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += .04; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); g.restore(); });
    if (t - t0 < 2600) requestAnimationFrame(tick); else c.remove();
  })(t0);
}

/* ---------- efectos ---------- */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const buzz = p => { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* sin vibración */ } };
function countUp(el, to, ms = 900, fmt = v => v) {
  if (!el) return;
  if (RM) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  (function f(t) { const k = Math.min(1, (t - t0) / ms); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(f); })(t0);
}
function floatText(txt, el) {
  const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
  const d = document.createElement('div'); d.className = 'floatx'; d.textContent = txt;
  d.style.left = (r.left + r.width / 2) + 'px'; d.style.top = (r.top - 6) + 'px';
  document.body.appendChild(d); setTimeout(() => d.remove(), 1000);
}
function burst(el, color) {
  if (RM || !el) return;
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2, d = document.createElement('i'); d.className = 'spark';
    d.style.cssText = `left:${cx}px;top:${cy}px;--dx:${Math.cos(a) * (46 + Math.random() * 24)}px;--dy:${Math.sin(a) * (46 + Math.random() * 24)}px;background:${color}`;
    document.body.appendChild(d); setTimeout(() => d.remove(), 750);
  }
}
const last7 = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return [dayStr(d), ['D', 'L', 'M', 'X', 'J', 'V', 'S'][d.getDay()]]; });
function splash() {
  if (RM) return;
  const sp = document.createElement('div'); sp.id = 'splash';
  sp.innerHTML = `${bit(120, 'cheer')}<div class="logo"><span>Code</span>Quest</div>`;
  document.body.appendChild(sp);
  setTimeout(() => sp.classList.add('out'), 1000); setTimeout(() => sp.remove(), 1500);
}

/* ---------- utilidades UI ---------- */
function toast(msg, ms = 2600) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), ms); }
function sheet(html) {
  const b = document.createElement('div'); b.className = 'sheet-bg'; b.innerHTML = `<div class="sheet">${html}</div>`;
  document.body.appendChild(b);
  const close = () => b.remove();
  b.onclick = e => { if (e.target === b) close(); };
  return { el: b.firstElementChild, close };
}
function overlay(id) {
  let el = $('#' + id);
  if (!el) { el = document.createElement('div'); el.id = id; document.body.appendChild(el); }
  el.className = 'overlay'; return el;
}
const killOverlay = id => { const el = $('#' + id); if (el) el.remove(); };

/* ---------- repaso espaciado ---------- */
const BOX_DAYS = [0, 1, 3, 7, 14, 30];
function updSRS(id, ok) {
  const e = S.srs[id] || { b: 0, d: 0 };
  e.b = ok ? Math.min(5, e.b + 1) : 0;
  e.d = Date.now() + BOX_DAYS[e.b] * 864e5;
  S.srs[id] = e;
}
function pickReviews(lang, exceptKey, n) {
  const now = Date.now();
  const c = Object.keys(S.srs).filter(id => EX[id] && EX[id].lang === lang && EX[id].f.key !== exceptKey && S.srs[id].d <= now && EX[id].ex.k !== 'run');
  return shuffle(c).slice(0, n).map(id => EX[id].ex);
}

/* ---------- ejecución de código (JS y Python) ---------- */
const workerFrom = fn => new Worker(URL.createObjectURL(new Blob([`(${fn.toString()})()`], { type: 'text/javascript' })));
const jsWorkerFn = () => {
  onmessage = e => {
    const { code, tests } = e.data, out = [];
    for (const [ex, xp] of tests) {
      try { const f = new Function(code + '\n;return JSON.stringify(' + ex + ');'); out.push({ e: ex, x: xp, g: String(f()) }); }
      catch (err) { out.push({ e: ex, x: xp, err: String(err) }); }
    }
    postMessage({ res: out });
  };
};
const pyWorkerFn = () => {
  let py = null;
  onmessage = async e => {
    const d = e.data;
    if (d.init) {
      try {
        importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
        py = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' });
        await py.runPythonAsync(d.init); postMessage({ ready: true });
      } catch (err) { postMessage({ fatal: String((err && err.message) || err) }); }
      return;
    }
    try { py.globals.set('__in__', d.input); postMessage({ out: await py.runPythonAsync('__run_tests(__in__)') }); }
    catch (err) { postMessage({ error: String((err && err.message) || err) }); }
  };
};
const PY_HARNESS = `import json, sys, io
def __run_tests(s):
    d = json.loads(s)
    g = {'__name__': '__main__'}
    old = sys.stdout
    sys.stdout = io.StringIO()
    try:
        try:
            exec(d['code'], g)
        except BaseException as ex:
            return json.dumps({'error': type(ex).__name__ + ': ' + str(ex)})
        res = []
        for e, x in d['tests']:
            try:
                res.append({'e': e, 'x': x, 'g': json.dumps(eval(e, g))})
            except BaseException as ex:
                res.append({'e': e, 'x': x, 'err': type(ex).__name__ + ': ' + str(ex)})
        return json.dumps({'res': res})
    finally:
        sys.stdout = old
`;
function runJS(code, tests) {
  return new Promise(resolve => {
    let w; try { w = workerFrom(jsWorkerFn); } catch (err) { return resolve({ error: 'No se pudo iniciar el motor: ' + err.message }); }
    const t = setTimeout(() => { w.terminate(); resolve({ error: 'Tu código tardó demasiado (¿bucle infinito?).' }); }, 3000);
    w.onmessage = e => { clearTimeout(t); w.terminate(); resolve(e.data); };
    w.onerror = e => { clearTimeout(t); w.terminate(); resolve({ error: String(e.message || 'Error') }); };
    w.postMessage({ code, tests });
  });
}
let pyW = null, pyP = null;
function getPy() {
  if (pyP) return pyP;
  pyP = new Promise((resolve, reject) => {
    let w, ready = false;
    const fail = m => { try { w && w.terminate(); } catch (e) { /* ya cerrado */ } pyW = null; pyP = null; reject(new Error(m)); };
    try { w = workerFrom(pyWorkerFn); } catch (e) { return fail(e.message); }
    pyW = w;
    const to = setTimeout(() => { if (!ready) fail('timeout'); }, 60000);
    w.onmessage = e => { if (e.data.ready) { ready = true; clearTimeout(to); resolve(w); } else if (e.data.fatal) { clearTimeout(to); fail(e.data.fatal); } };
    w.onerror = () => { clearTimeout(to); fail('worker'); };
    w.postMessage({ init: PY_HARNESS });
  });
  return pyP;
}
async function runPy(code, tests) {
  let w; try { w = await getPy(); } catch (e) { return { noengine: true }; }
  return new Promise(resolve => {
    const t = setTimeout(() => { w.terminate(); pyW = null; pyP = null; resolve({ error: 'Tu código tardó demasiado (¿bucle infinito?).' }); }, 8000);
    w.onmessage = e => { clearTimeout(t); if (e.data.out) resolve(JSON.parse(e.data.out)); else resolve({ error: e.data.error || 'Error' }); };
    w.onerror = () => { clearTimeout(t); resolve({ error: 'Error del motor de Python.' }); };
    w.postMessage({ input: JSON.stringify({ code, tests }) });
  });
}
function runCode(lang, code, tests) {
  const k = CQ.content[lang].runner;
  if (k === 'js') return runJS(code, tests);
  if (k === 'python') return runPy(code, tests);
  return Promise.resolve({ noengine: true });
}
const sameJSON = (g, x) => { try { return JSON.stringify(JSON.parse(g)) === JSON.stringify(JSON.parse(x)); } catch (e) { return g === x; } };

/* ---------- normalización de respuestas ---------- */
const normFill = (s, ci) => { s = String(s).replace(/\s+/g, ' ').trim().replace(/\s*([^\w\s])\s*/g, '$1'); return ci ? s.toLowerCase() : s; };
const normOut = s => String(s).replace(/\r/g, '').split('\n').map(l => l.replace(/\s+/g, ' ').trim()).join('\n').trim();

/* ---------- vistas principales ---------- */
let view = 'path';
let lastTop = null;
function openStreak() {
  const d = new Date(), y = d.getFullYear(), mo = d.getMonth(), first = new Date(y, mo, 1).getDay(), n = new Date(y, mo + 1, 0).getDate(), st = streakNow();
  let cells = '<i></i>'.repeat(first);
  for (let i = 1; i <= n; i++) cells += `<b class="cd${(S.hist[dayStr(new Date(y, mo, i))] || 0) > 0 ? ' on' : ''}${i === d.getDate() ? ' td' : ''}">${i}</b>`;
  const MS = [1, 7, 14, 30, 50, 100], sh = (S.shieldTo || 0) > Date.now();
  const personal = `<h3>🔥 Racha de ${st} día(s)</h3><p class="muted" style="text-transform:capitalize">${d.toLocaleDateString('es', { month: 'long', year: 'numeric' })}</p><div class="cal">${['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(x => `<small>${x}</small>`).join('')}${cells}</div>
  <div class="h-title" style="font-size:1rem">Meta de racha</div><div class="ms">${MS.map(x => `<span class="${st >= x ? 'on' : ''}">${x}</span>`).join('<em></em>')}</div>
  <div class="h-title" style="font-size:1rem">Protección de racha</div><div class="row"><span>❄️ Congeladores: <b>${S.freeze || 0}</b>/2 ${sh ? '· 🛡️ escudo activo' : ''}</span><button class="btn" id="bf">Comprar · 60 🪙</button></div>
  <div class="h-title" style="font-size:1rem">Cofre de racha</div><div class="row"><span>🎁 Alcanza 14 días y gana 100 🪙</span><button class="btn" id="bc" ${st >= 14 && !S.c14 ? '' : 'disabled'}>${S.c14 ? '✓' : st >= 14 ? 'Abrir' : st + '/14'}</button></div>`;
  const friends = `<div class="center" style="padding:14px 0">${bit(110, 'cheer')}<h3>¡Empieza una <span style="color:var(--blue)">racha entre amigos</span> y progresa cada día en compañía!</h3><button class="btn blue big" id="af">➕ Agrega amigos</button><small class="muted">Disponible cuando activemos las cuentas.</small></div>`;
  const s = sheet(`<div class="tabs2"><button class="on" data-t="p">PERSONAL</button><button data-t="f">AMIGOS</button></div><div id="tp">${personal}</div>`);
  const bind = () => {
    const bf = $('#bf', s.el); if (bf) bf.onclick = () => { s.close(); shopBuy('freeze'); };
    const bc = $('#bc', s.el); if (bc) bc.onclick = () => { S.c14 = 1; S.coins += 100; save(); s.close(); toast('🎁 ¡Cofre de racha! +100 🪙'); };
    const af = $('#af', s.el); if (af) af.onclick = () => toast('👥 Los amigos llegan con las cuentas');
  };
  $$('[data-t]', s.el).forEach(b => b.onclick = () => { $$('[data-t]', s.el).forEach(x => x.classList.toggle('on', x === b)); $('#tp', s.el).innerHTML = b.dataset.t === 'p' ? personal : friends; bind(); });
  bind();
}
function renderTop() {
  refreshHearts();
  const L = S.lang && CQ.content[S.lang], st = { s: streakNow(), h: S.hearts, x: S.xp };
  const pop = k => lastTop && lastTop[k] !== st[k] ? ' pop' : '';
  $('#top').innerHTML = `<button class="chip lang" id="tl">${L ? L.emoji : '🌐'}<span>${L ? esc(L.name) : 'Elegir'}</span><i>▾</i></button><span class="sp"></span>
    <span class="chip${pop('s')}" title="Racha"><i class="em${st.s ? ' fl' : ''}">🔥</i><b>${st.s}</b></span><button class="chip${pop('h')}${st.h <= 1 ? ' low' : ''}" id="th" title="Vidas"><i class="em">❤️</i><b>${st.h}</b></button><span class="chip${pop('x')}" title="XP"><i class="em">⚡</i><b>${st.x}</b></span>`;
  lastTop = st;
  document.documentElement.style.setProperty('--topH', $('#top').offsetHeight + 'px');
  $('#tl').onclick = () => openPicker();
  $('#top').insertAdjacentHTML('afterbegin', `<button class="chip avatar" id="tav" aria-label="Perfil">${bit(28)}</button>`); $('#tav').onclick = () => { view = 'profile'; render(); };
  const sc = $('#top [title="Racha"]'); if (sc) { sc.style.cursor = 'pointer'; sc.onclick = openStreak; }
  $('#th').onclick = () => {
    refreshHearts();
    const s = sheet(`<h3>❤️ Vidas: ${S.hearts}/${MAXH}</h3><p>Pierdes una vida al fallar en una lección. Recuperas una cada 15 minutos${S.hearts < MAXH ? ` (la próxima en ${fmtMs(nextHeartIn())})` : ''}, o al terminar una sesión de práctica.</p><button class="btn blue big" id="sp">Practicar</button>`);
    $('#sp', s.el).onclick = () => { s.close(); startPractice(); };
  };
}
const isOn = id => view === id || (id === 'more' && ['practice', 'profile', 'shop'].includes(view));
function renderNav() {
  const tabs = [['path', '🏠', 'Aprender'], ['quests', '🎁', 'Misiones'], ['league', '🏆', 'Liga'], ['pet', '🐾', 'Mascota'], ['more', '⋯', 'Más']];
  $('#nav').innerHTML = tabs.map(([id, ic, tx]) => `<button data-v="${id}" class="${isOn(id) ? 'on' : ''}" aria-current="${isOn(id) ? 'page' : 'false'}"><span>${ic}${id === 'pet' && petNeeds() ? '<u class="dot"></u>' : ''}</span>${tx}</button>`).join('');
  $$('#nav button').forEach(b => b.onclick = () => { view = b.dataset.v; render(); scrollTo(0, 0); });
}
function render() {
  renderTop(); renderNav();
  const m = $('#main');
  m.classList.remove('vin'); void m.offsetWidth; m.classList.add('vin');
  if (!S.lang || !CQ.content[S.lang]) { m.innerHTML = ''; return; }
  if (view === 'path') viewPath(m); else if (view === 'practice') viewPractice(m); else if (view === 'pet') viewPet(m); else if (view === 'league') viewLeague(m); else if (view === 'quests') viewQuests(m); else if (view === 'more') viewMore(m); else if (view === 'shop') viewShop(m); else viewProfile(m);
}

const ROW = 150, OFFS = [0, 9, 15, 9, 0, -9, -15, -9];
const NK = { star: '★', gym: '💪', chest: '🎁', trophy: '🏆' };
function kindOf(f, lang) { const u = f.ui !== undefined && CQ.content[lang].units[f.ui]; if (!u) return 'star'; return f.li === u.lessons.length - 1 ? 'trophy' : f.idx % 4 === 3 ? 'chest' : f.idx % 4 === 2 ? 'gym' : 'star'; }
/* ---------- misiones, tienda y menú "Más" (como las pantallas de referencia, con identidad propia) ---------- */
const MQ = [[10, 20], [20, 40], [30, 100]];
function mqget() { const k = dayStr().slice(0, 7); if (!S.mq || S.mq.m !== k) S.mq = { m: k, p: 0, c: 0 }; return S.mq; }
function viewQuests(m) {
  const q = qget(), mq = mqget(), d = new Date(), left = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate(), nx = MQ[mq.c];
  m.innerHTML = `<div class="mq"><div class="mq-h"><div><h3 style="margin:0;text-transform:capitalize">Desafío de ${d.toLocaleDateString('es', { month: 'long' })}</h3><small>⏱ ${left} DÍAS · 1 punto por lección o minijuego</small></div>${bit(64, 'cheer')}</div>
    <div class="mq-card"><div class="row"><b>Gana 30 puntos de desafío</b><em style="color:#c026d3;font-style:normal;font-weight:800">${mq.p}/30</em></div><div class="bar"><i style="width:${Math.min(100, mq.p / 30 * 100)}%;background:#c026d3"></i></div>
    <small class="muted">Cofres en 10 · 20 · 30 puntos</small>${nx && mq.p >= nx[0] ? `<button class="btn primary big" id="mqc" style="margin-top:8px">🎁 Abrir cofre · +${nx[1]} 🪙</button>` : ''}</div></div>
  <div class="kick">DESAFÍO ENTRE AMIGOS</div><div class="sec"><div class="row"><b>Sigue a tu primer amigo</b><span>🎁 0/1</span></div><button class="btn big" id="ff" style="width:100%;margin-top:8px">👥 Encuentra a tus amigos</button></div>
  <div class="kick">DESAFÍOS DEL DÍA</div><div class="sec">${QUESTS.map(([k, n, t, ic], i) => { const v = Math.min(n, q.p[k] || 0), ok = v >= n, c = q.c[i]; return `<div class="mrow" style="padding:7px 0"><span style="font-size:1.3rem">${ic}</span><span style="flex:1">${t}</span><div class="bar" style="flex:none;width:60px"><i style="width:${v / n * 100}%"></i></div><button class="pill ${ok && !c ? 'on' : ''}" data-q="${i}" ${!ok || c ? 'disabled' : ''}>${c ? '✓' : ok ? '🎁 +15' : v + '/' + n}</button></div>`; }).join('')}<small class="muted">Cumple las 4 y abre un cofre sorpresa 🎁</small></div>`;
  $$('[data-q]', m).forEach(b => b.onclick = () => qclaim(+b.dataset.q));
  $('#ff').onclick = () => toast('👥 Los amigos llegan con las cuentas');
  const c = $('#mqc'); if (c) c.onclick = () => { S.coins += nx[1]; mq.c++; save(); confetti(); beep(SND.win); toast(`🎁 +${nx[1]} 🪙`); render(); };
}
function viewShop(m) {
  const sh = (S.shieldTo || 0) > Date.now() ? Math.ceil((S.shieldTo - Date.now()) / 864e5) + ' día(s)' : 'sin usar', bo = S.boostTo > Date.now() ? Math.ceil((S.boostTo - Date.now()) / 6e4) + ' min' : 'sin usar';
  m.innerHTML = `<div class="row"><div class="h-title" style="margin:0">Tienda</div><b>🪙 ${S.coins}</b></div>
  <div class="plus" style="margin-top:12px"><b style="font-size:1.1rem">✨ CodeQuest Plus</b><p style="margin:6px 0">Energía ilimitada, sin anuncios y práctica personalizada.</p><button class="btn" id="pl">Avísame cuando llegue</button></div>
  <div class="h-title" style="margin-top:18px">Mis artículos</div><div class="items" style="grid-template-columns:repeat(3,1fr)"><div class="itm"><span>❄️</span><b>Congelador</b><small>x${S.freeze || 0}</small></div><div class="itm"><span>⚡</span><b>XP doble</b><small>${bo}</small></div><div class="itm"><span>🛡️</span><b>Escudo</b><small>${sh}</small></div></div>
  <div class="h-title" style="margin-top:18px">Comprar</div><div class="items" style="grid-template-columns:1fr">${SHOP.map(([id, ic, nm, c, ds]) => `<button class="itm" data-sh="${id}" style="flex-direction:row;gap:12px;text-align:left;padding:12px"><span>${ic}</span><span class="it-t" style="flex:1"><b>${nm}</b><br><small>${ds}</small></span><b>🪙 ${c}</b></button>`).join('')}</div>`;
  $$('[data-sh]', m).forEach(b => b.onclick = () => shopBuy(b.dataset.sh));
  $('#pl').onclick = () => toast('💜 ¡Te avisaremos! Plus llega con las cuentas');
}
function viewMore(m) {
  const go = v => () => { view = v; render(); scrollTo(0, 0); }, row = (id, ic, t, d, fn) => `<button class="mrowm" id="${id}"><span style="font-size:1.6rem">${ic}</span><span style="flex:1">${t}<br><small class="muted">${d}</small></span><i>›</i></button>`;
  m.innerHTML = `<div class="h-title">Más</div>${row('m1', '🛒', 'Tienda', 'Congeladores, escudos y XP doble')}${row('m2', '💪', 'Práctica', 'Repasa lo que ya aprendiste')}${row('m3', '👤', 'Perfil y ajustes', 'Logros, meta diaria y progreso')}${row('m4', '🔊', 'Sonidos', 'Próximamente: pronunciación y listening')}${row('m5', '🗣️', 'Entrenador de conversación', 'Próximamente: práctica con IA')}`;
  $('#m1').onclick = go('shop'); $('#m2').onclick = go('practice'); $('#m3').onclick = go('profile');
  $('#m4').onclick = () => toast('🔊 Llega pronto'); $('#m5').onclick = () => toast('🗣️ Llega con las cuentas y la IA');
}
const NK_ = 0;
function viewPath(m) {
  const L = CQ.content[S.lang], fl = flat(S.lang);
  const cur = fl.findIndex(f => !isDone(f.key));
  let html = '';
  if (!fl.some(f => isDone(f.key))) html += `<div class="card place"><div><b>¿Ya sabes programar?</b><p>Haz una prueba rápida y salta lo que ya dominas.</p></div><button class="btn blue" id="plc">Prueba de nivel</button></div>`;
  L.units.forEach((u, ui) => {
    const col = PAL[ui % PAL.length], ls = fl.filter(f => f.ui === ui), nd = ls.filter(f => isDone(f.key)).length;
    const H = ls.length * ROW, pos = ls.map((f, k) => ({ x: 50 + OFFS[f.idx % 8], y: k * ROW + 55 }));
    let trail = '';
    for (let k = 1; k < ls.length; k++) { const a = pos[k - 1], b = pos[k]; trail += `<path class="${isDone(ls[k - 1].key) ? 'on' : ''}" d="M${a.x} ${a.y} C${a.x} ${a.y + 62} ${b.x} ${b.y - 62} ${b.x} ${b.y}"/>`; }
    html += `<section class="unit" style="--c:${col}"><div class="ubanner"><div><small>UNIDAD ${ui + 1}</small><h3>${esc(u.title)}</h3><p>${esc(u.desc)}</p></div><div class="ucount">${nd}/${ls.length}</div></div><div class="nodes" style="height:${H}px"><svg class="trail" viewBox="0 0 100 ${H}" preserveAspectRatio="none">${trail}</svg>`;
    ls.forEach((f, k) => {
      const st = isDone(f.key) ? 'done' : f.idx === cur ? 'cur' : 'lock';
      const kd = kindOf(f, S.lang), icon = st === 'lock' ? '🔒' : st === 'done' ? (kd === 'chest' || kd === 'trophy' ? NK[kd] : '✓') : NK[kd];
      const s = (S.done[f.key] || {}).s || 0;
      const fx = fresh && fresh.done === f.key ? ' just' : fresh && fresh.next === f.key ? ' unlock' : '';
      html += `<div class="nwrap" style="left:${pos[k].x}%;top:${k * ROW + 20}px"><button class="node k-${kd} ${st}${fx}" style="--d:${Math.min(k, 6) * 70}ms" data-i="${f.idx}" aria-label="${esc(f.l.title)}">${icon}</button>${st === 'cur' ? '<span class="start">EMPEZAR +20 XP</span><span class="pcomp">' + bit(62) + '</span>' : ''}${st === 'done' ? `<span class="stars">${'★'.repeat(s)}${'☆'.repeat(3 - s)}</span>` : ''}<div class="nlabel">${esc(f.l.title)}</div></div>`;
    });
    html += '</div></section>';
  });
  html += `<div class="card center" style="margin-top:12px">${bit(64, cur === -1 ? 'cheer' : 'happy')}<b>${cur === -1 ? '¡Completaste este curso!' : 'Más contenido en camino'}</b><p class="muted">${cur === -1 ? 'Repasa en Práctica o elige otro lenguaje.' : 'Cada unidad te acerca a nivel experto.'}</p></div>`;
  m.innerHTML = html;
  $$('.node', m).forEach(b => b.onclick = () => openLessonSheet(+b.dataset.i));
  const p = $('#plc'); if (p) p.onclick = () => startPlacement();
  const jn = $('.node.just', m), target = jn || $('.node.cur', m);
  if (target && (fresh || !m.dataset.scrolled)) {
    const smooth = !!fresh; m.dataset.scrolled = 1;
    setTimeout(() => target.scrollIntoView({ block: 'center', behavior: smooth && !RM ? 'smooth' : 'auto' }), 80);
  }
  if (jn) setTimeout(() => { burst(jn, '#ffc800'); beep([784, 988], .1); }, 700);
}
function openLessonSheet(idx) {
  const fl = flat(S.lang), f = fl[idx], st = isDone(f.key) ? 'done' : (idx === 0 || isDone(fl[idx - 1].key)) ? 'open' : 'lock';
  const s = sheet(`<h3>${esc(f.l.title)}</h3><p>Unidad ${f.ui + 1} · Lección ${f.li + 1} · ${f.l.ex.length} ejercicios</p>${st === 'lock'
    ? '<p>🔒 Completa la lección anterior para desbloquearla.</p><button class="btn big" disabled>Bloqueada</button>'
    : `<button class="btn primary big" id="go">${st === 'done' ? 'Repasar' : 'Empezar'} · +${st === 'done' ? 10 : 20} XP</button><button class="linkbtn" id="gd">📖 Leer la guía</button>`}`);
  const g = $('#go', s.el); if (g) g.onclick = () => { s.close(); startLesson(S.lang, idx); };
  const d = $('#gd', s.el); if (d) d.onclick = () => { s.close(); const t = sheet(`<h3>📖 ${esc(f.l.title)}</h3><div class="intro">${md(f.l.intro, S.lang)}</div><button class="btn blue big" id="ok">Listo</button>`); $('#ok', t.el).onclick = t.close; };
}

function viewPractice(m) {
  const lang = S.lang, fl = flat(lang), now = Date.now();
  const ids = Object.keys(S.srs).filter(id => EX[id] && EX[id].lang === lang && EX[id].ex.k !== 'run');
  const due = ids.filter(id => S.srs[id].d <= now).length;
  const mastered = ids.filter(id => S.srs[id].b >= 3).length;
  let html = `<div class="h-title">💪 Práctica inteligente</div><div class="card hero">${bit(70)}<div><b>Repasa lo que ya viste</b><p class="muted">Las preguntas que fallas vuelven pronto; las que dominas, cada vez más espaciadas. Así se queda para siempre.</p></div></div>
  <div class="grid2"><div class="stat"><span>⏰</span><div><b>${due}</b><small>por repasar</small></div></div><div class="stat"><span>🧠</span><div><b>${mastered}/${ids.length}</b><small>dominadas</small></div></div></div>
  <button class="btn primary big" id="sp" style="margin-top:14px" ${ids.length ? '' : 'disabled'}>${ids.length ? 'Empezar práctica · +1 ❤️' : 'Completa una lección primero'}</button>
  <div class="sec"><h3>Dominio por unidad</h3><div class="mastery">`;
  CQ.content[lang].units.forEach((u, ui) => {
    const all = fl.filter(f => f.ui === ui).flatMap(f => f.l.ex).filter(x => x.k !== 'run');
    const ok = all.filter(x => S.srs[x._id] && S.srs[x._id].b >= 3).length;
    const p = all.length ? Math.round(ok / all.length * 100) : 0;
    html += `<div class="mrow"><span style="width:7.5em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ui + 1}. ${esc(u.title)}</span><div class="bar"><i style="width:${p}%;background:${PAL[ui % PAL.length]}"></i></div><em>${p}%</em></div>`;
  });
  m.innerHTML = html + '</div></div>';
  $('#sp').onclick = startPractice;
}

const ACH = [
  ['first', '🌱', 'Primer paso', 'Completa tu primera lección', () => totalDone() >= 1],
  ['l10', '📚', 'Constante', 'Completa 10 lecciones', () => totalDone() >= 10],
  ['l30', '🎓', 'Estudiante', 'Completa 30 lecciones', () => totalDone() >= 30],
  ['s3', '🔥', 'En racha', 'Racha de 3 días', () => S.best >= 3],
  ['s7', '🔥', 'Semana perfecta', 'Racha de 7 días', () => S.best >= 7],
  ['s30', '🌋', 'Imparable', 'Racha de 30 días', () => S.best >= 30],
  ['x100', '⚡', 'Chispa', '100 XP', () => S.xp >= 100],
  ['x1000', '💥', 'Energía', '1 000 XP', () => S.xp >= 1000],
  ['perf', '💯', 'Impecable', 'Una lección sin errores', () => S.perfect >= 1],
  ['unit', '🏆', 'Unidad completa', 'Termina una unidad', () => LANGS.some(l => CQ.content[l].units.some(u => u.lessons.every(x => isDone(`${l}.${u.id}.${x.id}`))))],
  ['poly', '🌍', 'Políglota', 'Avanza en 2 lenguajes', () => LANGS.filter(l => langProgress(l).d > 0).length >= 2],
  ['prac', '🧠', 'Memoria de elefante', '3 sesiones de práctica', () => S.practices >= 3],
];
function checkAch() {
  ACH.forEach(([id, ic, nm, ds, f]) => {
    if (S.ach[id] || !f()) return;
    S.ach[id] = Date.now();
    if (fresh && fresh.celebs) fresh.celebs.push({ confetti: 1, snd: SND.level, cta: 'Genial', html: `<div class="rays"></div><div class="trophy" style="font-size:5rem">${ic}</div><h1 class="pop-in">¡Logro desbloqueado!</h1><b>${nm}</b><p class="muted">${ds}</p>` });
    else setTimeout(() => toast(`${ic} Logro: ${nm}`), 600);
  });
  save();
}

/* ---------- mascota: adopción, cuidado y personalización ---------- */
let adoptSel = null, adoptName = null;
function viewAdopt(m) {
  const P = S.pet, SP = CQ.pet.SPECIES;
  adoptSel = adoptSel || (P ? P.sp : 'gato');
  const left = P && P.chg ? P.chg + 7 * 864e5 - Date.now() : 0, lock = left > 0;
  if (adoptName === null) adoptName = P ? P.name : SP.find(s => s.id === adoptSel).name;
  m.innerHTML = `<div class="h-title">🐾 ${P ? 'Cambiar de mascota' : 'Elige a tu compañero'}</div><p class="muted">Crecerá y evolucionará contigo cada vez que subas de nivel. Cuídala: si pasa un día entero con hambre se desmaya 💫 (¡pero la reviven una lección o monedas!). Puedes cambiar de especie <b>una vez por semana</b>; tu nivel y tus accesorios se quedan contigo.</p>${lock ? `<p><b>🔒 Podrás cambiar de especie en ${Math.ceil(left / 864e5)} día(s).</b> Mientras tanto puedes cambiarle el nombre.</p>` : ''}
  <div class="spgrid">${SP.map(s => `<button class="spc ${adoptSel === s.id ? 'on' : ''}${lock && P.sp !== s.id ? ' dis' : ''}" data-s="${s.id}">${CQ.pet.art({ sp: s.id, col: s.col, eq: {} }, 84, adoptSel === s.id ? 'cheer' : 'happy', 1)}<b>${s.name}</b><small>${s.desc}</small></button>`).join('')}</div>
  <div class="row"><span>Nombre</span><input id="pn" class="pname" maxlength="12" value="${esc(adoptName)}"></div>
  <button class="btn primary big" id="ado" style="margin-top:14px">${P ? 'Listo' : '¡Adoptar! (+30 🪙) · elige con cariño, solo podrás cambiar 1 vez por semana'}</button>${P ? '<button class="btn big" id="cx" style="margin-top:8px">Cancelar</button>' : ''}`;
  $$('[data-s]', m).forEach(b => b.onclick = () => {
    if (lock && P.sp !== b.dataset.s) return toast(`🔒 Podrás cambiar en ${Math.ceil(left / 864e5)} día(s)`);
    const old = SP.find(s => s.id === adoptSel), typed = $('#pn').value;
    adoptName = (!typed.trim() || typed === old.name) ? SP.find(s => s.id === b.dataset.s).name : typed;
    adoptSel = b.dataset.s; render();
  });
  $('#ado').onclick = () => {
    const sp = SP.find(s => s.id === adoptSel), name = ($('#pn').value.trim() || sp.name).slice(0, 12);
    if (P) { if (sp.id !== P.sp) P.chg = Date.now(); P.sp = sp.id; P.name = name; }
    else { S.pet = { sp: sp.id, name, col: sp.col, own: [], eq: { head: '', face: '', neck: '' }, hun: 80, cln: 80, fun: 80, ts: Date.now(), chg: Date.now() }; S.coins += 30; confetti(); beep(SND.win); }
    adoptSel = adoptName = null; save(); render(); toast(`¡${name} está feliz de conocerte! 💖`);
  };
  const cx = $('#cx'); if (cx) cx.onclick = () => { adoptSel = adoptName = null; render(); };
}
const PET_ACT = { eat: ['hun', 25, 5, '🍎', '¡Ñam!'], wash: ['cln', 30, 5, '🫧', '¡Limpio!'], play: ['fun', 25, 0, '🎾', '¡Qué divertido!'] };
function petAct(k) {
  petTick(); const P = S.pet, [st, gain, cost, ic, say] = PET_ACT[k];
  if (P.dead) return toast(`💫 Primero revive a ${P.name}`);
  if (P[st] >= 95) return toast(`${P.name} no necesita eso ahora 😊`);
  if (S.coins < cost) return toast('Te faltan monedas 🪙. ¡Completa lecciones para ganar más!');
  S.coins -= cost; P[st] = Math.min(100, P[st] + gain); if (k === 'play') qadd('play', 1); save(); render();
  const box = $('#pst'); if (!box) return;
  box.innerHTML = bit(170, 'cheer'); petAnim(k); floatText(ic + ' ' + say, box); burst(box, '#ff8fab'); beep(SND.ok); buzz(15);
  setTimeout(() => { const b = $('#pst'); if (b) b.innerHTML = bit(170); }, 1800);
}
function petItem(id) {
  const P = S.pet, it = CQ.pet.ITEMS.find(i => i.id === id);
  if (P.own.includes(id)) { P.eq[it.slot] = P.eq[it.slot] === id ? '' : id; save(); return render(); }
  if (level() < it.lv) return toast(`🔒 Se desbloquea en el nivel ${it.lv}`);
  if (S.coins < it.cost) return toast(`Te faltan ${it.cost - S.coins} 🪙`);
  S.coins -= it.cost; P.own.push(id); P.eq[it.slot] = id; save(); render(); beep(SND.win); burst($('#pst'), '#ffd54f');
}
/* ---------- misiones diarias y minijuego ---------- */
const QUESTS = [['lessons', 1, 'Completa 1 lección', '📗'], ['xp', 40, 'Gana 40 XP', '⚡'], ['right', 10, 'Acierta 10 preguntas', '🎯'], ['play', 1, 'Juega con tu mascota', '🎾']];
function qget() { if (!S.q || S.q.d !== dayStr()) S.q = { d: dayStr(), p: {}, c: {} }; return S.q; }
function qadd(k, n) {
  const q = qget(); q.p[k] = (q.p[k] || 0) + n; if (k === 'lessons' || k === 'play') mqget().p += n;
  if (k === 'lessons' && S.pet && S.pet.dead) { Object.assign(S.pet, { dead: false, hun: 40, cln: 40, fun: 40, ts: Date.now(), sv: 0 }); setTimeout(() => toast(`✨ ¡${S.pet.name} revivió gracias a tu lección!`), 1800); }
}
function qclaim(i) {
  const q = qget(), [k, n] = QUESTS[i]; if (q.c[i] || (q.p[k] || 0) < n) return;
  q.c[i] = 1; S.coins += 15; let msg = '+15 🪙 ¡Misión cumplida!';
  if (QUESTS.every((_, j) => q.c[j])) { const r = 30 + Math.floor(Math.random() * 51), fr = Math.random() < .25 && (S.freeze || 0) < 2; S.coins += r; if (fr) S.freeze = (S.freeze || 0) + 1; msg = `🎁 ¡Cofre abierto! +${r} 🪙${fr ? ' y ❄️ congelar racha' : ''}`; confetti(); }
  save(); toast(msg); beep(SND.win); render();
}
function gameDone(id, coins, label) {
  const q = qget(); q.p['g_' + id] = (q.p['g_' + id] || 0) + 1; qadd('play', 1);
  coins = Math.max(0, Math.min(coins, 120 - (q.p.gc || 0))); q.p.gc = (q.p.gc || 0) + coins;
  S.coins += coins; S.pet.fun = Math.min(100, S.pet.fun + 20); save(); render(); resultSheet(label, coins);
}
function gsheet(html) { const s = sheet(`<div class="gpet" id="gpet">${bit(60)}</div>${html}`); s.el.classList.add('gsheet'); s.el.parentElement.classList.add('gm-bg'); return s; }
function gpetReact(f) {
  const ok = f === SND.ok, bad = f === SND.bad; if (!ok && !bad) return; const e = $('#gpet'); if (!e) return;
  e.innerHTML = bit(60, ok ? 'cheer' : 'sad'); e.classList.remove('hop'); void e.offsetWidth; e.classList.add('hop'); clearTimeout(e._t); e._t = setTimeout(() => { const x = $('#gpet'); if (x) x.innerHTML = bit(60); }, 900);
}
const GAMES = [['shot', '🫧', 'Bubble Shot', 1], ['order', '🧩', 'Ordena el código', 1], ['hang', '🔡', 'Ahorcado', 1], ['run', '🏃', 'Corredor', 1], ['car', '🏎️', 'Conducir', 1], ['plat', '🍄', 'Plataformas', 1], ['con', '🔗', 'Conectar', 1], ['ws', '🔤', 'Sopa de letras', 1], ['slide', '🖼️', 'Puzzle de mascota'], ['mem', '🧠', 'Memoria'], ['simon', '🎵', 'Simón dice']];
function miniGame() {
  const q = qget(), n = id => 3 - (q.p['g_' + id] || 0), E = gEmoji();
  const go = { catch: catchGame, mem: memGame, simon: simonGame, run: () => laneGame('run'), car: () => laneGame('car'), plat: platGame, shot: bubbleShot, order: orderGame, hang: hangGame, slide: slideGame, con: connectGame, ws: wordGame };
  const s = gsheet(`<h3>🎮 Minijuegos</h3><p class="muted">Los marcados con ${E} usan <b>solo lo que ya desbloqueaste</b>. 3 partidas por juego al día (hasta 120 🪙 diarias).</p><div class="gm">${GAMES.map(([id, ic, nm, ed]) => { const rd = gReady(id); return `<button class="btn gbtn ${rd ? '' : 'glock'}" data-g="${id}" ${n(id) <= 0 ? 'disabled' : ''}><span class="gic">${rd ? ic : '🔒'}</span><span class="gnm">${nm}${ed ? ' ' + E : ''}</span><small>${rd ? n(id) + '/3' : 'avanza más'}</small></button>`; }).join('')}</div>`);
  $$('[data-g]', s.el).forEach(b => b.onclick = () => { if (!gReady(b.dataset.g)) return needMore(); s.close(); go[b.dataset.g](); });
}
/* ---------- minijuegos con el contenido del curso actual ---------- */
/* Lo desbloqueado = lecciones ya completadas + la lección abierta actual (igual que el camino). Ningún juego usa contenido posterior. */
function unlockedFlat() { const fl = flat(S.lang), cur = fl.findIndex(f => !isDone(f.key)); return fl.filter(f => isDone(f.key) || f.idx === cur); }
function qaPool() {
  const o = []; unlockedFlat().forEach(f => f.l.ex.forEach(x => { if (x.k === 'mc' && !x.code && x.o.length >= 3 && x.o[0] !== 'Verdadero' && x.q.length <= 110 && x.o.every(t => t.length <= 34)) o.push({ q: x.q, a: x.o[x.a], w: x.o.filter((_, i) => i !== x.a), e: x.e }); }));
  return shuffle(o);
}
function pairPool() {
  const o = [], seen = new Set(); unlockedFlat().forEach(f => f.l.ex.forEach(x => { if (x.k === 'pair') x.pairs.forEach(p => { if (p[0].length <= 24 && p[1].length <= 24 && !seen.has(p[0])) { seen.add(p[0]); o.push(p); } }); }));
  return shuffle(o);
}
function wordPool() {
  const o = new Set(); unlockedFlat().forEach(f => f.l.ex.forEach(x => { if (x.k === 'fill') x.a.forEach(a => /^[A-Za-z]{3,8}$/.test(a) && o.add(a.toUpperCase())); }));
  if (o.size < 3) unlockedFlat().forEach(f => f.l.ex.forEach(x => { if (x.k === 'pair') x.pairs.forEach(p => /^[A-Za-z]{3,8}$/.test(p[0]) && o.add(p[0].toUpperCase())); }));
  return shuffle([...o]);
}
const orderPool = () => shuffle(unlockedFlat().flatMap(f => f.l.ex.filter(x => x.k === 'order' && x.t.length <= 6)));
const hangPool = () => shuffle(unlockedFlat().flatMap(f => f.l.ex.filter(x => x.k === 'fill' && /^[A-Za-z]{3,8}$/.test(x.a[0])).map(x => ({ q: x.q, w: x.a[0].toUpperCase() }))));
/* ¿hay suficiente contenido desbloqueado para este juego? */
const gReady = id => ({ shot: () => qaPool().length >= 3, run: () => qaPool().length >= 5, car: () => qaPool().length >= 5, plat: () => qaPool().length >= 5, con: () => pairPool().length >= 5, ws: () => wordPool().length >= 3, order: () => orderPool().length >= 3, hang: () => hangPool().length >= 1 }[id] || (() => true))();
const gEmoji = () => (CQ.content[S.lang] || {}).emoji || '📚';
const needMore = () => toast('🔒 Avanza unas lecciones más: este juego usa solo lo que ya desbloqueaste');
function laneGame(skin) {
  const Q = qaPool(); if (Q.length < 5) return needMore();
  let lane = 1, lives = 3, score = 0, qi = 0, y = 0, cur, last = 0, wait = false; const car = skin === 'car', H = 330;
  const s = gsheet(`<h3>${car ? '🏎️ Conducir' : '🏃 Corredor'} ${gEmoji()}</h3><div class="gq" id="gq"></div><div class="lane ${skin}" id="ln"><div class="pl" id="pl">${car ? '🏎️' : bit(52)}</div></div><div class="row"><b id="lh"></b><b id="ls">0</b></div><small class="muted">Toca la izquierda o la derecha (o usa las flechas) para cambiar de carril y pasar por la respuesta correcta.</small>`);
  const A = $('#ln', s.el), pl = $('#pl', s.el), gq = $('#gq', s.el);
  const hud = () => { $('#lh', s.el).textContent = '❤️'.repeat(lives); $('#ls', s.el).textContent = score; pl.style.left = lane * 33.3 + '%'; };
  const key = e => { if (e.key === 'ArrowLeft') lane = Math.max(0, lane - 1); if (e.key === 'ArrowRight') lane = Math.min(2, lane + 1); hud(); };
  addEventListener('keydown', key);
  A.onpointerdown = e => { lane = Math.max(0, Math.min(2, lane + (e.offsetX < A.clientWidth / 2 ? -1 : 1))); hud(); };
  const finish = () => { removeEventListener('keydown', key); s.close(); gameDone(skin, Math.min(25, score * 3), `¡${score} correctas!`); };
  const next = () => {
    if (lives <= 0 || qi >= 10) return finish();
    const x = Q[qi++ % Q.length], opts = shuffle([x.a, ...shuffle(x.w).slice(0, 2)]); y = -60; wait = false; gq.textContent = x.q;
    $$('.gate', A).forEach(g => g.remove());
    cur = { x, opts, g: opts.map((o, i) => { const g = document.createElement('div'); g.className = 'gate'; g.style.left = i * 33.3 + '%'; g.textContent = o; A.appendChild(g); return g; }) };
  };
  const step = t => {
    if (!s.el.isConnected) return removeEventListener('keydown', key);
    const dt = Math.min(.05, (t - last) / 1000 || 0); last = t;
    if (cur && !wait) {
      y += (55 + qi * 4) * dt; const kz = .7 + .3 * Math.max(0, Math.min(1, (y + 60) / (H - 20))); cur.g.forEach(g => g.style.transform = `translateY(${y}px) scale(${kz})`);
      if (y > H - 80) {
        wait = true; const ok = cur.opts[lane] === cur.x.a; if (ok) { score++; beep(SND.ok); } else { lives--; beep(SND.bad); buzz(60); } floatText(ok ? '+1 ✨' : '💥', A); A.classList.remove('shk2'); void A.offsetWidth; if (!ok) A.classList.add('shk2');
        gq.innerHTML = ok ? '✅ ¡Correcto!' : `❌ Era: <b>${esc(cur.x.a)}</b> · ${inl(cur.x.e || '')}`; hud(); setTimeout(next, ok ? 1000 : 3500);
      }
    }
    requestAnimationFrame(step);
  };
  hud(); next(); requestAnimationFrame(step);
}
function platGame() {
  const Q = qaPool(); if (Q.length < 5) return needMore();
  let py = 0, vy = 0, bx = 330, lives = 3, score = 0, qi = 0, cur, last = 0, wait = false;
  const s = gsheet(`<h3>🍄 Plataformas ${gEmoji()}</h3><div class="gq" id="gq"></div><div class="plat" id="pt"><div class="gnd"></div><div class="ply" id="py">${bit(50)}</div></div><div class="row"><b id="lh"></b><b id="ls">0</b></div><small class="muted">Toca para saltar: elige el bloque del suelo (no saltes) o el del aire (salta).</small>`);
  const A = $('#pt', s.el), P = $('#py', s.el), gq = $('#gq', s.el);
  const jump = () => { if (py <= 0) vy = 520; }, key = e => { if (e.key === ' ' || e.key === 'ArrowUp') jump(); };
  addEventListener('keydown', key); A.onpointerdown = jump;
  const hud = () => { $('#lh', s.el).textContent = '❤️'.repeat(lives); $('#ls', s.el).textContent = score; };
  const finish = () => { removeEventListener('keydown', key); s.close(); gameDone('plat', Math.min(25, score * 3), `¡${score} correctas!`); };
  const next = () => {
    if (lives <= 0 || qi >= 8) return finish();
    const x = Q[qi++ % Q.length], opts = shuffle([x.a, x.w[0]]); bx = 330; wait = false; gq.textContent = x.q; $$('.blk', A).forEach(b => b.remove());
    cur = { x, opts, b: opts.map((o, i) => { const b = document.createElement('div'); b.className = 'blk'; b.style.bottom = i ? '130px' : '46px'; b.textContent = o; A.appendChild(b); return b; }) };
  };
  const step = t => {
    if (!s.el.isConnected) return removeEventListener('keydown', key);
    const dt = Math.min(.05, (t - last) / 1000 || 0); last = t;
    vy -= 1300 * dt; py = Math.max(0, py + vy * dt); if (!py) vy = 0; P.style.bottom = 46 + py + 'px';
    if (cur && !wait) {
      bx -= (65 + qi * 3) * dt; cur.b.forEach(b => b.style.left = bx + 'px');
      if (bx <= 70) {
        wait = true; const ok = cur.opts[py > 25 ? 1 : 0] === cur.x.a; if (ok) { score++; beep(SND.ok); } else { lives--; beep(SND.bad); buzz(60); } floatText(ok ? '+1 ✨' : '💥', A); A.classList.remove('shk2'); void A.offsetWidth; if (!ok) A.classList.add('shk2');
        gq.innerHTML = ok ? '✅ ¡Correcto!' : `❌ Era: <b>${esc(cur.x.a)}</b> · ${inl(cur.x.e || '')}`; hud(); setTimeout(next, ok ? 1000 : 3500);
      }
    }
    requestAnimationFrame(step);
  };
  hud(); next(); requestAnimationFrame(step);
}
function bubGame() {
  const Q = qaPool(); if (Q.length < 5) return needMore();
  let score = 0, qi = 0, t = 40, x;
  const s = gsheet(`<h3>🫧 Burbujas ${gEmoji()}</h3><div class="gq" id="gq"></div><div class="bubs" id="bb"></div><div class="row"><b id="mt">40 s</b><b id="ms">0</b></div>`);
  const A = $('#bb', s.el), gq = $('#gq', s.el), ms = $('#ms', s.el);
  const next = () => {
    x = Q[qi++ % Q.length]; gq.textContent = x.q; A.innerHTML = '';
    shuffle([x.a, ...x.w.slice(0, 3)]).forEach((o, i) => {
      const b = document.createElement('button'); b.className = 'bubl'; b.textContent = o; b.style.left = 2 + i * 24 + Math.random() * 3 + '%'; b.style.animationDuration = 10 + Math.random() * 4 + 's'; b.style.animationDelay = -Math.random() * 5 + 's';
      b.onclick = () => { if (o === x.a) { score++; beep(SND.ok); buzz(10); ms.textContent = score; next(); } else { score = Math.max(0, score - 1); ms.textContent = score; beep(SND.bad); buzz(40); b.remove(); } };
      A.appendChild(b);
    });
  };
  next();
  const tm = setInterval(() => {
    if (!s.el.isConnected) return clearInterval(tm);
    $('#mt', s.el).textContent = --t + ' s'; if (t > 0) return;
    clearInterval(tm); s.close(); gameDone('bub', Math.min(25, score * 3), `¡${score} burbujas!`);
  }, 1000);
}
function connectGame() {
  const P = pairPool(); if (P.length < 5) return needMore();
  const ps = P.slice(0, 5), mk = k => shuffle(ps.map((p, i) => ({ t: p[k], i })));
  let sel = null, found = 0, miss = 0;
  const col = (side, a) => `<div style="display:grid;gap:8px">${a.map(o => `<button data-s="${side}" data-i="${o.i}">${esc(o.t)}</button>`).join('')}</div>`;
  const s = gsheet(`<h3>🔗 Conectar ${gEmoji()}</h3><p class="muted">Une cada concepto con su pareja.</p><div class="cn">${col('l', mk(0))}${col('r', mk(1))}</div>`);
  $$('.cn button', s.el).forEach(b => b.onclick = () => {
    if (b.classList.contains('ok')) return;
    if (!sel || sel.dataset.s === b.dataset.s) { if (sel) sel.classList.remove('sel'); sel = b; b.classList.add('sel'); return; }
    const a = sel; sel = null; a.classList.remove('sel');
    if (a.dataset.i === b.dataset.i) { a.classList.add('ok'); b.classList.add('ok'); beep(SND.ok); if (++found === 5) setTimeout(() => { s.close(); gameDone('con', Math.max(6, 25 - miss * 4), '¡Todo conectado!'); }, 500); }
    else { miss++; beep(SND.bad); [a, b].forEach(e => { e.classList.add('bad'); setTimeout(() => e.classList.remove('bad'), 350); }); }
  });
}
function wordGame() {
  if (wordPool().length < 3) return needMore();
  const N = 9, g = Array.from({ length: N }, () => Array(N).fill('')), placed = [], dirs = [[0, 1], [1, 0], [1, 1]];
  wordPool().slice(0, 5).forEach(w => {
    for (let n = 0; n < 80; n++) {
      const [dr, dc] = dirs[Math.floor(Math.random() * 3)], r = Math.floor(Math.random() * N), c = Math.floor(Math.random() * N);
      if (r + dr * (w.length - 1) >= N || c + dc * (w.length - 1) >= N) continue;
      if ([...w].some((ch, k) => g[r + dr * k][c + dc * k] && g[r + dr * k][c + dc * k] !== ch)) continue;
      [...w].forEach((ch, k) => g[r + dr * k][c + dc * k] = ch); placed.push(w); break;
    }
  });
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; g.forEach(r => r.forEach((_, c) => r[c] ||= L[Math.floor(Math.random() * 26)]));
  let a = null, found = 0;
  const s = gsheet(`<h3>🔤 Sopa de letras ${gEmoji()}</h3><p class="muted">Toca la primera y la última letra de cada palabra del curso.</p><div class="wl">${placed.map(w => `<span data-w="${w}">${w}</span>`).join('')}</div><div class="ws">${g.map((r, i) => r.map((ch, j) => `<button data-r="${i}" data-c="${j}">${ch}</button>`).join('')).join('')}</div>`);
  const cell = (r, c) => $(`[data-r="${r}"][data-c="${c}"]`, s.el);
  $$('.ws button', s.el).forEach(b => b.onclick = () => {
    const r = +b.dataset.r, c = +b.dataset.c; if (!a) { a = [r, c]; b.classList.add('sel'); return; }
    const dr = r - a[0], dc = c - a[1], len = Math.max(Math.abs(dr), Math.abs(dc)) + 1, cells = [];
    $$('.sel', s.el).forEach(e => e.classList.remove('sel'));
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) for (let k = 0; k < len; k++) cells.push(cell(a[0] + Math.sign(dr) * k, a[1] + Math.sign(dc) * k));
    const w = cells.map(e => e.textContent).join(''), hit = placed.find(p => p === w || p === [...w].reverse().join(''));
    a = null; if (!hit || $(`[data-w="${hit}"]`, s.el).classList.contains('fd')) { beep(SND.bad); return; }
    cells.forEach(e => e.classList.add('fd')); $(`[data-w="${hit}"]`, s.el).classList.add('fd'); beep(SND.ok); buzz(15);
    if (++found === placed.length) setTimeout(() => { s.close(); gameDone('ws', 25, '¡Sopa completada!'); }, 600);
  });
}
function bubbleShot() {
  const Q = qaPool(); if (Q.length < 3) return needMore();
  const W = 320, H = 440, R = 16, RW = 28, DPR = Math.min(2, window.devicePixelRatio || 1), SX = W / 2, SY = 408;
  // [base, luz, sombra]
  const COLS = [['#ff6b9d', '#ffd0e2', '#b8245f'], ['#8b5cf6', '#e0d2ff', '#44199e'], ['#4cc9f0', '#d2f6ff', '#1779a3'], ['#ffd54f', '#fff6c9', '#b98a08'], ['#5eead4', '#dcfff9', '#0f917d']];
  let off = 0, shots = 0, popped = 0, ball = null, aim = null, bomb = false, over = false, last = 0, asking = false, nextC = 0, qi = 0, recoil = 0, T = 0;
  const parts = [], fall = [], rings = [], txt = [], trail = [], stars = Array.from({ length: 28 }, () => ({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() }));
  const grid = Array.from({ length: 14 }, () => Array(10).fill(null));
  const ro = r => (r + off) & 1, nc = r => 10 - ro(r), cx = (r, c) => R + c * 2 * R + ro(r) * R, cy = r => R + r * RW, rnd = () => Math.floor(Math.random() * COLS.length);
  for (let r = 0; r < 5; r++) for (let c = 0; c < nc(r); c++) grid[r][c] = rnd();
  const nb = (r, c) => { const o = ro(r); return [[r, c - 1], [r, c + 1], [r - 1, c - 1 + o], [r - 1, c + o], [r + 1, c - 1 + o], [r + 1, c + o]].filter(([a, b]) => a >= 0 && a < 14 && b >= 0 && b < nc(a)); };
  const s = gsheet(`<h3>🫧 Bubble Shot ${gEmoji()}</h3><div class="gstat"><span>🫧 <b id="bp">0</b></span><span id="bn">Pregunta en 3 tiros</span><span id="bm">💣 —</span></div><div class="gq bq" id="bq">Apunta y suelta para disparar. Cada 3 tiros responde bien y ganas una 💣.</div><div class="bframe" id="bf"><canvas id="bc" class="bsc"></canvas></div>`);
  const A = $('#bc', s.el), g = A.getContext('2d'), bq = $('#bq', s.el), bf = $('#bf', s.el);
  A.width = W * DPR; A.height = H * DPR; g.setTransform(DPR, 0, 0, DPR, 0, 0);
  const hud = () => { $('#bp', s.el).textContent = popped; $('#bn', s.el).textContent = asking ? '¡Responde para seguir!' : Q.length >= 3 ? `Pregunta en ${3 - shots % 3} tiro${3 - shots % 3 === 1 ? '' : 's'}` : ''; $('#bm', s.el).textContent = bomb ? '💣 ¡lista!' : '💣 —'; $('#bm', s.el).classList.toggle('hot', bomb); };
  const bub = (x, y, ci, bm, sc = 1, al = 1) => {
    g.save(); g.globalAlpha = al; g.translate(x, y); g.scale(sc, sc);
    const [b, l, d] = bm ? ['#5a4878', '#b7a5dd', '#1c1230'] : COLS[ci], gr = g.createRadialGradient(-5, -6, 1.5, 0, 0, R);
    gr.addColorStop(0, l); gr.addColorStop(.42, b); gr.addColorStop(1, d);
    g.beginPath(); g.arc(0, 0, R - 1, 0, 7); g.fillStyle = gr; g.fill();
    g.strokeStyle = 'rgba(255,255,255,.38)'; g.lineWidth = 1.3; g.beginPath(); g.arc(0, 0, R - 2.4, .12 * Math.PI, .88 * Math.PI); g.stroke();
    g.beginPath(); g.ellipse(-5, -6.2, 4.6, 3, -.6, 0, 7); g.fillStyle = 'rgba(255,255,255,.8)'; g.fill();
    g.beginPath(); g.arc(5.5, 6, 1.7, 0, 7); g.fillStyle = 'rgba(255,255,255,.45)'; g.fill();
    if (bm) { g.font = '17px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('💣', 0, 1); }
    g.restore();
  };
  const spawn = (x, y, ci, n = 7) => { for (let k = 0; k < n; k++) { const a = Math.random() * 6.283, v = 70 + Math.random() * 150; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 50, t: 0, life: .5 + Math.random() * .3, ci, r: 2 + Math.random() * 2.6 }); } rings.push({ x, y, t: 0, ci, r: 30 }); };
  const rm = (r, c, drop) => { const v = grid[r][c]; if (v === null) return 0; const x = cx(r, c), y = cy(r); grid[r][c] = null; if (drop) fall.push({ x, y, vx: (Math.random() - .5) * 70, vy: -80, ci: v, t: 0 }); else spawn(x, y, v); return 1; };
  const prep = () => { const pr = [...new Set(grid.flat().filter(v => v !== null))]; nextC = pr.length ? pr[Math.floor(Math.random() * pr.length)] : 0; hud(); };
  const finish = win => { over = true; s.close(); gameDone('shot', Math.min(25, Math.floor(popped * .8) + (win ? 8 : 0)), win ? '¡Tablero limpio!' : `¡${popped} burbujas!`); };
  const cull = () => {
    const seen = new Set(), st = []; for (let c = 0; c < nc(0); c++) if (grid[0][c] !== null) { st.push([0, c]); seen.add(c); }
    while (st.length) { const [r, c] = st.pop(); nb(r, c).forEach(([a, b]) => { const k = a * 10 + b; if (grid[a][b] !== null && !seen.has(k)) { seen.add(k); st.push([a, b]); } }); }
    let n = 0; grid.forEach((row, r) => row.forEach((v, c) => { if (v !== null && !seen.has(r * 10 + c)) n += rm(r, c, true); })); return n;
  };
  const ask = () => {
    asking = true; bf.classList.add('dim'); const x = Q[qi++ % Q.length], opts = shuffle([x.a, ...shuffle(x.w).slice(0, 2)]);
    bq.innerHTML = `${esc(x.q)}<div class="bopts">${opts.map(o => `<button>${esc(o)}</button>`).join('')}</div>`; hud();
    $$('.bopts button', bq).forEach(b => b.onclick = () => { const ok = b.textContent === x.a; bomb = ok; asking = false; bf.classList.remove('dim'); bq.innerHTML = ok ? '💣 ¡Respuesta correcta! Tu próximo tiro es una bomba.' : `❌ Era: <b>${esc(x.a)}</b>${x.e ? ' · ' + inl(x.e) : ''}`; ok ? beep(SND.win) : beep(SND.bad); gpetReact(ok ? SND.ok : SND.bad); prep(); });
  };
  const land = () => {
    let best = null, bd = 1e9;
    for (let r = 0; r < 14; r++) for (let c = 0; c < nc(r); c++) if (grid[r][c] === null) { const d = (cx(r, c) - ball.x) ** 2 + (cy(r) - ball.y) ** 2; if (d < bd) { bd = d; best = [r, c]; } }
    const [r, c] = best; grid[r][c] = ball.col; let n = 0; const px = cx(r, c), py = cy(r);
    if (ball.bomb) { grid.forEach((row, a) => row.forEach((v, b) => { if (v !== null && Math.hypot(cx(a, b) - px, cy(a) - py) < 75) n += rm(a, b, false); })); rings.push({ x: px, y: py, t: 0, ci: 3, r: 90, big: 1 }); }
    else { const col = ball.col, seen = new Set([r * 10 + c]), st = [[r, c]]; while (st.length) { const [a, b] = st.pop(); nb(a, b).forEach(([x, y]) => { const k = x * 10 + y; if (grid[x][y] === col && !seen.has(k)) { seen.add(k); st.push([x, y]); } }); } if (seen.size >= 3) seen.forEach(k => { n += rm(Math.floor(k / 10), k % 10, false); }); else rings.push({ x: px, y: py, t: 0, ci: col, r: 20 }); }
    if (n) { const f = cull(); txt.push({ x: px, y: py, t: 0, s: '+' + (n + f), big: n + f >= 6 }); n += f; beep(SND.ok); buzz(15); }
    popped += n; ball = null; shots++; hud();
    if (grid.every(row => row.every(v => v === null))) return finish(true);
    if (shots % 5 === 0) { grid.pop(); off ^= 1; grid.unshift(Array.from({ length: 10 }, (_, c) => c < nc(0) ? rnd() : null)); }
    if (grid[11].some(v => v !== null)) return finish(false);
    if (shots % 3 === 0) ask(); else prep();
  };
  const fire = () => { if (ball || asking || over || !aim) return; const dx = aim[0] - SX, dy = aim[1] - SY, L = Math.hypot(dx, dy) || 1; if (dy > -20) return; ball = { x: SX, y: SY, vx: dx / L * 560, vy: dy / L * 560, col: nextC, bomb }; bomb = false; recoil = 1; trail.length = 0; hud(); };
  A.onpointerdown = A.onpointermove = e => { const b = A.getBoundingClientRect(); aim = [(e.clientX - b.left) * W / b.width, (e.clientY - b.top) * H / b.height]; }; A.onpointerup = fire;
  const guide = () => {
    let x = SX, y = SY; const dx = aim[0] - SX, dy = aim[1] - SY, L = Math.hypot(dx, dy) || 1; let vx = dx / L, vy = dy / L, d = 0;
    for (let i = 0; i < 90 && y > R && d < 330; i++) { x += vx * 4; y += vy * 4; d += 4; if (x < R || x > W - R) { vx *= -1; x = Math.max(R, Math.min(W - R, x)); } if (i % 5 === 0 && d > 30) { g.beginPath(); g.arc(x, y, 2.6 - d / 260, 0, 7); g.fillStyle = `rgba(255,255,255,${.75 - d / 480})`; g.fill(); } }
  };
  const cannon = () => {
    let ang = -Math.PI / 2; if (aim) ang = Math.max(-Math.PI + .25, Math.min(-.25, Math.atan2(aim[1] - SY, aim[0] - SX)));
    g.save(); g.translate(SX, SY + 12); g.beginPath(); g.ellipse(0, 12, 46, 14, 0, 0, 7); g.fillStyle = 'rgba(0,0,0,.28)'; g.fill();
    const base = g.createLinearGradient(0, -6, 0, 22); base.addColorStop(0, '#9b7cf0'); base.addColorStop(1, '#4a2d99'); g.fillStyle = base; g.beginPath(); g.ellipse(0, 6, 40, 15, 0, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.beginPath(); g.ellipse(0, 4, 38, 12, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
    g.rotate(ang + Math.PI / 2); const len = 30 - recoil * 7, bar = g.createLinearGradient(-9, 0, 9, 0); bar.addColorStop(0, '#6d3fd8'); bar.addColorStop(.45, '#c4a8ff'); bar.addColorStop(1, '#5a2fc0');
    g.fillStyle = bar; g.beginPath(); g.roundRect ? g.roundRect(-9, -len - 4, 18, len + 8, 8) : g.rect(-9, -len - 4, 18, len + 8); g.fill(); g.restore();
  };
  const step = t => {
    if (!s.el.isConnected || over) return; const dt = Math.min(.04, (t - last) / 1000 || 0); last = t; T += dt; recoil = Math.max(0, recoil - dt * 5);
    if (ball) {
      ball.x += ball.vx * dt; ball.y += ball.vy * dt; trail.push({ x: ball.x, y: ball.y, t: 0 });
      if (ball.x < R || ball.x > W - R) { ball.vx *= -1; ball.x = Math.max(R, Math.min(W - R, ball.x)); }
      if (ball.y <= R || grid.some((row, r) => row.some((v, c) => v !== null && Math.hypot(cx(r, c) - ball.x, cy(r) - ball.y) < 2 * R - 4))) land();
    }
    g.clearRect(0, 0, W, H);
    stars.forEach(o => { o.y += o.z * 6 * dt; if (o.y > H) { o.y = 0; o.x = Math.random() * W; } g.fillStyle = `rgba(255,255,255,${.25 + .35 * Math.abs(Math.sin(T * o.z * 2 + o.x))})`; g.fillRect(o.x, o.y, o.z * 1.8, o.z * 1.8); });
    grid.forEach((row, r) => row.forEach((v, c) => v !== null && bub(cx(r, c), cy(r) + Math.sin(T * 1.6 + c * .7 + r) * .8, v)));
    const dl = 11 * RW + R + 14; g.setLineDash([6, 6]); g.strokeStyle = 'rgba(255,120,150,.45)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, dl); g.lineTo(W, dl); g.stroke(); g.setLineDash([]);
    fall.forEach(f => { f.t += dt; f.vy += 900 * dt; f.x += f.vx * dt; f.y += f.vy * dt; bub(f.x, f.y, f.ci, false, 1 - f.t * .5, Math.max(0, 1 - f.t * 1.1)); }); for (let i = fall.length; i--;) if (fall[i].y > H + 30 || fall[i].t > 1) fall.splice(i, 1);
    parts.forEach(p => { p.t += dt; p.vy += 520 * dt; p.x += p.vx * dt; p.y += p.vy * dt; const a = Math.max(0, 1 - p.t / p.life); g.globalAlpha = a; g.fillStyle = COLS[p.ci][1]; g.beginPath(); g.arc(p.x, p.y, p.r * a + .4, 0, 7); g.fill(); g.globalAlpha = 1; }); for (let i = parts.length; i--;) if (parts[i].t > parts[i].life) parts.splice(i, 1);
    rings.forEach(o => { o.t += dt; const k = Math.min(1, o.t / (o.big ? .45 : .3)); g.globalAlpha = (1 - k) * .8; g.strokeStyle = COLS[o.ci][1]; g.lineWidth = o.big ? 5 : 3; g.beginPath(); g.arc(o.x, o.y, 8 + (o.r - 8) * k, 0, 7); g.stroke(); g.globalAlpha = 1; }); for (let i = rings.length; i--;) if (rings[i].t > .5) rings.splice(i, 1);
    txt.forEach(o => { o.t += dt; g.globalAlpha = Math.max(0, 1 - o.t / .9); g.font = `800 ${o.big ? 22 : 17}px system-ui,sans-serif`; g.textAlign = 'center'; g.fillStyle = '#fff'; g.strokeStyle = 'rgba(80,30,160,.85)'; g.lineWidth = 4; g.strokeText(o.s, o.x, o.y - o.t * 46); g.fillText(o.s, o.x, o.y - o.t * 46); g.globalAlpha = 1; }); for (let i = txt.length; i--;) if (txt[i].t > .9) txt.splice(i, 1);
    if (aim && !ball && !asking) guide();
    trail.forEach(o => { o.t += dt; const a = Math.max(0, .5 - o.t * 2); if (a > 0) { g.globalAlpha = a; g.fillStyle = ball && ball.bomb ? '#ffb454' : COLS[ball ? ball.col : nextC][1]; g.beginPath(); g.arc(o.x, o.y, R * (.7 - o.t), 0, 7); g.fill(); g.globalAlpha = 1; } }); while (trail.length && trail[0].t > .25) trail.shift();
    cannon();
    if (ball) bub(ball.x, ball.y, ball.col, ball.bomb); else if (!over) bub(SX, SY, nextC, bomb, 1 + Math.sin(T * 5) * (bomb ? .06 : .02));
    requestAnimationFrame(step);
  };
  prep(); requestAnimationFrame(step);
}
function orderGame() {
  const P = orderPool().slice(0, 5); if (P.length < 3) return needMore();
  let i = 0, score = 0, ans = [], bank = [], busy = false;
  const s = gsheet(`<h3>🧩 Ordena el código ${gEmoji()}</h3><div class="gq" id="oq"></div><div class="ordans" id="oa"></div><div class="ordbank" id="ob"></div><button class="btn primary big" id="oc">Comprobar</button>`);
  const paint = () => {
    $('#oa', s.el).innerHTML = ans.map(b => `<button class="chip2" data-r="${b.n}">${esc(b.t)}</button>`).join('') || '<small class="muted">Toca las piezas en orden…</small>';
    $('#ob', s.el).innerHTML = bank.filter(b => !ans.includes(b)).map(b => `<button class="chip2" data-a="${b.n}">${esc(b.t)}</button>`).join('');
    $$('[data-a]', s.el).forEach(e => e.onclick = () => { if (busy) return; ans.push(bank.find(b => b.n === +e.dataset.a)); beep([640]); paint(); });
    $$('[data-r]', s.el).forEach(e => e.onclick = () => { if (busy) return; ans = ans.filter(b => b.n !== +e.dataset.r); paint(); });
  };
  const load = () => { if (i >= P.length) { s.close(); return gameDone('order', Math.min(25, score * 5), `¡${score}/${P.length} ordenados!`); } ans = []; busy = false; bank = shuffle(P[i].t.map((t, n) => ({ t, n }))); $('#oq', s.el).textContent = P[i].q; paint(); };
  $('#oc', s.el).onclick = () => {
    if (busy) return; const x = P[i], ok = ans.length === x.t.length && ans.every((b, k) => b.t === x.t[k]); busy = true; if (ok) score++;
    ok ? beep(SND.ok) : beep(SND.bad); $('#oq', s.el).innerHTML = ok ? '✅ ¡Perfecto!' : `❌ Era: <code>${esc(x.t.join(' '))}</code>`; i++; setTimeout(load, ok ? 1000 : 3500);
  };
  load();
}
function slideGame() {
  const svg = CQ.pet.art(S.pet, 300, 'cheer', petStage()).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '), url = "url('data:image/svg+xml;utf8," + encodeURIComponent(svg).replace(/'/g, '%27') + "')";
  const t = [1, 2, 3, 4, 5, 6, 7, 8, 0]; let moves = 0;
  const adj = z => [z - 3, z + 3, z % 3 ? z - 1 : -1, z % 3 < 2 ? z + 1 : -1].filter(j => j >= 0 && j < 9);
  for (let n = 0, z = 8; n < 80; n++) { const a = adj(z), j = a[Math.floor(Math.random() * a.length)]; [t[z], t[j]] = [t[j], t[z]]; z = j; }
  const s = gsheet(`<h3>🖼️ Puzzle de ${esc(S.pet.name)}</h3><p class="muted">Desliza las piezas para armar a tu mascota.</p><div class="sl" id="sl"></div><b id="sm">Movimientos: 0</b>`);
  const paint = () => {
    $('#sl', s.el).innerHTML = t.map((v, i) => v ? `<button data-i="${i}" style="background-image:${url};background-size:300% 300%;background-position:${((v - 1) % 3) * 50}% ${Math.floor((v - 1) / 3) * 50}%"></button>` : '<i></i>').join('');
    $$('#sl button', s.el).forEach(b => b.onclick = () => {
      const i = +b.dataset.i, z = t.indexOf(0); if (!adj(z).includes(i)) return; [t[z], t[i]] = [t[i], t[z]]; moves++; $('#sm', s.el).textContent = 'Movimientos: ' + moves; beep([600]); paint();
      if (t.every((v, k) => v === (k + 1) % 9)) setTimeout(() => { s.close(); gameDone('slide', Math.max(8, 25 - Math.floor(moves / 4)), '¡Puzzle resuelto!'); }, 500);
    });
  };
  paint();
}
function hangGame() {
  const P = hangPool(); if (!P.length) return needMore();
  const x = P[0], got = new Set(); let err = 0;
  const s = gsheet(`<h3>🔡 Ahorcado ${gEmoji()}</h3><div class="gq">${esc(x.q)}</div><div class="hw" id="hw"></div><div id="he" style="text-align:center"></div><div class="kb">${[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(l => `<button data-k="${l}">${l}</button>`).join('')}</div>`);
  const paint = () => { $('#hw', s.el).textContent = [...x.w].map(l => got.has(l) ? l : '_').join(' '); $('#he', s.el).textContent = '❤️'.repeat(Math.max(0, 6 - err)) + '🖤'.repeat(Math.min(6, err)); };
  paint();
  $$('[data-k]', s.el).forEach(b => b.onclick = () => {
    b.disabled = true; const l = b.dataset.k; if (x.w.includes(l)) { got.add(l); beep(SND.ok); } else { err++; beep(SND.bad); buzz(40); }
    if (err > 6) return; paint(); const win = [...x.w].every(c => got.has(c));
    if (win || err >= 6) setTimeout(() => { s.close(); gameDone('hang', win ? Math.max(8, 25 - err * 3) : 3, win ? '¡Palabra descubierta!' : `Era ${x.w}`); }, 600);
  });
}
function catchGame() {
  const fx = CQ.pet.SPECIES.find(s => s.id === S.pet.sp).fx; let score = 0, t = 15;
  const s = gsheet(`<h3>🎯 Atrapa ${fx}</h3><p class="muted">Toca los ${fx} antes de que desaparezcan. Cada uno = 1 🪙 (máx. 30).</p><div class="mg" id="mg"></div><div class="row"><b id="mt">15 s</b><b id="ms">0</b></div>`);
  const area = $('#mg', s.el), mt = $('#mt', s.el), ms = $('#ms', s.el);
  const sp = setInterval(() => {
    const e = document.createElement('button'); e.className = 'mgt'; e.textContent = fx; e.style.left = Math.random() * 80 + '%'; e.style.top = Math.random() * 80 + '%';
    e.onclick = () => { score++; ms.textContent = score; e.remove(); buzz(10); beep([900]); }; area.appendChild(e); setTimeout(() => e.remove(), 1000);
  }, 550);
  const tm = setInterval(() => {
    if (!s.el.isConnected) { clearInterval(sp); clearInterval(tm); return; }
    mt.textContent = --t + ' s'; if (t > 0) return;
    clearInterval(sp); clearInterval(tm); s.close(); gameDone('catch', Math.min(30, score), `¡Atrapaste ${score}!`);
  }, 1000);
}
function memGame() {
  const fx = CQ.pet.SPECIES.find(s => s.id === S.pet.sp).fx;
  const deck = shuffle(['🐍', '☕', '💎', '🧩', '⚡', fx].flatMap(e => [e, e])); let open = [], moves = 0, found = 0, busy = false;
  const s = gsheet(`<h3>🧠 Memoria</h3><p class="muted">Encuentra las parejas con pocos movimientos.</p><div class="mem">${deck.map((e, i) => `<button class="mc" data-i="${i}">❔</button>`).join('')}</div><b id="mm">Movimientos: 0</b>`);
  $$('.mc', s.el).forEach(b => b.onclick = () => {
    if (busy || b.classList.contains('up')) return;
    b.textContent = deck[+b.dataset.i]; b.classList.add('up'); open.push(b); beep([700]);
    if (open.length < 2) return;
    moves++; $('#mm', s.el).textContent = 'Movimientos: ' + moves;
    const [x, y] = open; open = [];
    if (x.textContent === y.textContent) { if (++found === 6) setTimeout(() => { s.close(); gameDone('mem', Math.max(8, Math.min(30, 40 - moves * 2)), '¡Memoria completada!'); }, 500); return; }
    busy = true; setTimeout(() => { [x, y].forEach(c => { c.textContent = '❔'; c.classList.remove('up'); }); busy = false; }, 700);
  });
}
function simonGame() {
  const C = ['#ff8fab', '#8b5cf6', '#4cc9f0', '#ffd54f'], T = [330, 392, 523, 659]; let seq = [], pos = 0, ok = false, dead = false;
  const s = gsheet(`<h3>🎵 Simón dice</h3><p class="muted" id="sm">Mira la secuencia…</p><div class="simon">${C.map((c, i) => `<button class="spd" data-p="${i}" style="background:${c}"></button>`).join('')}</div><b id="sr">Ronda 1</b>`);
  const pads = $$('.spd', s.el), flash = i => { pads[i].classList.add('lit'); beep([T[i]], .25); setTimeout(() => pads[i].classList.remove('lit'), 300); };
  const round = () => {
    ok = false; pos = 0; seq.push(Math.floor(Math.random() * 4)); $('#sr', s.el).textContent = 'Ronda ' + seq.length; $('#sm', s.el).textContent = 'Mira la secuencia…';
    seq.forEach((p, k) => setTimeout(() => s.el.isConnected && flash(p), 700 + k * 600));
    setTimeout(() => { ok = true; if (s.el.isConnected) $('#sm', s.el).textContent = '¡Tu turno!'; }, 700 + seq.length * 600);
  };
  const end = () => { dead = true; s.close(); gameDone('simon', Math.min(30, (seq.length - 1) * 4), `¡Llegaste a la ronda ${seq.length}!`); };
  pads.forEach((b, k) => b.onclick = () => { if (!ok || dead) return; flash(k); if (seq[pos] !== k) return end(); if (++pos === seq.length) { ok = false; setTimeout(round, 800); } });
  round();
}
const PLACES = [['home', '🏠', 'Habitación', 0, 0, []], ['nature', '🌳', 'Naturaleza', 120, 0, [['🌳', 5, 30, 44], ['🌲', 82, 34, 40], ['🌸', 20, 80, 22], ['🦋', 70, 15, 20], ['🍄', 88, 82, 20]]], ['house', '🏡', 'Casa', 200, 0, [['🪟', 8, 14, 34], ['🛋️', 4, 66, 38], ['🖼️', 84, 14, 30], ['🪴', 88, 64, 34]]], ['pool', '🏊', 'Piscina', 250, 0, [['🌴', 6, 28, 40], ['☀️', 84, 6, 34], ['🛟', 80, 74, 30]]], ['beach', '🏖️', 'Playa', 300, 0, [['🐚', 8, 80, 22], ['⛱️', 82, 52, 40], ['🌴', 4, 28, 40]]], ['garden', '🌷', 'Jardín', 100, 0, [['🌷', 6, 70, 30], ['🌻', 84, 66, 34], ['🐝', 70, 14, 20], ['🌼', 20, 82, 24]]], ['forest', '🌲', 'Bosque', 150, 0, [['🌲', 4, 26, 46], ['🌲', 84, 30, 50], ['🦉', 76, 10, 24], ['🍂', 14, 84, 20]]], ['mountain', '⛰️', 'Montaña', 220, 0, [['⛰️', 6, 24, 50], ['🏔️', 76, 28, 46], ['☁️', 40, 6, 30], ['🦅', 86, 8, 22]]], ['snow', '⛄', 'Nieve', 220, 0, [['⛄', 8, 62, 38], ['❄️', 80, 12, 24], ['🌨️', 22, 8, 28], ['🎿', 86, 70, 26]]], ['farm', '🚜', 'Granja', 260, 0, [['🐄', 6, 66, 32], ['🌾', 84, 70, 30], ['🏚️', 76, 24, 40], ['🐔', 22, 80, 22]]], ['camp', '⛺', 'Campamento', 280, 0, [['⛺', 8, 56, 42], ['🔥', 80, 70, 30], ['🌙', 78, 8, 28], ['⭐', 20, 10, 18]]], ['city', '🌆', 'Ciudad', 350, 0, [['🏢', 6, 22, 44], ['🏬', 80, 26, 46], ['🚕', 70, 78, 26], ['🌇', 40, 6, 28]]], ['castle', '🏰', 'Castillo', 0, 4, [['🏰', 74, 20, 52], ['👑', 10, 14, 26], ['🐉', 12, 70, 30], ['🛡️', 86, 76, 24]]], ['sea', '🐠', 'Fondo del mar', 400, 0, [['🐠', 8, 30, 30], ['🐙', 78, 62, 34], ['🪸', 10, 78, 30], ['🫧', 80, 18, 24]]], ['candy', '🍭', 'Dulcilandia', 0, 8, [['🍭', 8, 24, 36], ['🧁', 80, 66, 34], ['🍩', 84, 16, 30], ['🍬', 16, 80, 24]]], ['space', '🚀', 'Espacio', 0, 6, [['⭐', 10, 12, 20], ['🪐', 80, 18, 34], ['🌙', 14, 60, 28], ['✨', 86, 72, 20]]]];
const pl = () => (S.places = S.places || { own: ['home'], cur: 'home' });
function placeAct(id) {
  const p = PLACES.find(x => x[0] === id), o = pl();
  if (!o.own.includes(id)) {
    if (p[4] && level() < p[4]) return toast(`🔒 Se desbloquea en el nivel ${p[4]}`);
    if (p[3] && S.coins < p[3]) return toast(`Te faltan ${p[3] - S.coins} 🪙`);
    S.coins -= p[3]; o.own.push(id); beep(SND.win);
  }
  o.cur = id; save(); render(); toast(`${p[1]} ¡${p[2]} lista!`);
}
const SHOP = [['freeze', '❄️', 'Congelar racha', 60, 'Salva tu racha si faltas 1 día'], ['boost', '⚡', 'XP doble 15 min', 40, 'Duplica XP y monedas'], ['shield', '🛡️', 'Escudo de racha 7 días', 300, 'Tu racha no se rompe durante 7 días']];
function shopBuy(id) {
  const it = SHOP.find(x => x[0] === id);
  if (id === 'freeze' && (S.freeze || 0) >= 2) return toast('Ya tienes 2 congeladores ❄️');
  if (S.coins < it[3]) return toast(`Te faltan ${it[3] - S.coins} 🪙`);
  S.coins -= it[3]; if (id === 'freeze') S.freeze = (S.freeze || 0) + 1; else if (id === 'shield') S.shieldTo = Math.max(Date.now(), S.shieldTo || 0) + 7 * 864e5; else S.boostTo = Math.max(Date.now(), S.boostTo || 0) + 15 * 60e3;
  save(); beep(SND.win); render(); toast(`${it[1]} ¡${it[2]} listo!`);
}
/* ---------- acciones interactivas de la mascota ---------- */
const SLOTS = [['all', 'Todo'], ['head', 'Cabeza'], ['face', 'Cara'], ['neck', 'Cuello'], ['body', 'Cuerpo'], ['back', 'Espalda']];
let petTab = 'all';
const closeTray = () => { const t = $('#ptray'); if (t) t.remove(); };
/* ---------- cuidados de la mascota (v2.6): comer, bañar, pelota, fiesta, mimar, cepillar, dormir y foto ---------- */
let careTk = 0;
const careOk = (tk, box) => tk === careTk && box && box.isConnected;
const room = () => $('.pet-room');
/* partícula animada dentro del cuarto, relativa a la mascota (o a coordenadas ax/ay del cuarto) */
function fxp(txt, o = {}) {
  const rm = room(), st = $('#pst'); if (!rm || !st || RM) return;
  const a = rm.getBoundingClientRect(), b = st.getBoundingClientRect(), e = document.createElement('span');
  const x = o.ax !== undefined ? o.ax : b.left - a.left + b.width / 2 + (o.x || 0), y = o.ay !== undefined ? o.ay : b.top - a.top + b.height * (o.y === undefined ? .55 : o.y);
  e.className = 'fxp ' + (o.c || ''); e.textContent = txt;
  e.style.cssText = `left:${x}px;top:${y}px;--dx:${o.dx === undefined ? Math.random() * 120 - 60 : o.dx}px;--dy:${o.dy === undefined ? -40 - Math.random() * 90 : o.dy}px;--r:${o.r === undefined ? Math.random() * 360 - 180 : o.r}deg;--d:${o.t || 900}ms;font-size:${o.s || 20}px`;
  rm.appendChild(e); setTimeout(() => e.remove(), (o.t || 900) + 100); return e;
}
const stageGeo = () => { const rm = room(), st = $('#pst'), a = rm.getBoundingClientRect(), b = st.getBoundingClientRect(); return { cx: b.left - a.left + b.width / 2, top: b.top - a.top, bottom: b.bottom - a.top, w: a.width, h: a.height }; };
const careTray = html => $('.pet-room').insertAdjacentHTML('afterend', `<div class="ptray" id="ptray">${html}</div>`);
const careBar = v => { const b = $('#bb2'); if (b) b.style.width = Math.min(100, v) + '%'; };
function careFinish(k, msg, gain, ic) {
  render(); const b = $('#pst'); if (!b) return;
  b.innerHTML = bit(170, 'cheer'); petAnim(k); floatText(msg, b); if (gain) setTimeout(() => floatText(`+${gain} ${ic}`, b), 420);
  burst(b, '#ff8fab'); beep(SND.win); buzz(15);
  for (let i = 0; i < 8; i++) setTimeout(() => fxp(['💖', '✨', '⭐', '💕'][i % 4], { dy: -70 - Math.random() * 70, s: 22 }), i * 90);
  setTimeout(() => { const x = $('#pst'); if (x) x.innerHTML = bit(170); }, 2000);
}
const FOODS = [['🍎', 3, 'hun', 18], ['🍌', 3, 'hun', 16], ['🥕', 2, 'hun', 14], ['🍓', 3, 'hun', 15], ['🍉', 3, 'hun', 17], ['🥛', 2, 'hun', 10], ['🍕', 6, 'hun', 30], ['🍔', 7, 'hun', 34], ['🍣', 8, 'hun', 32], ['🍦', 4, 'fun', 18], ['🍩', 4, 'fun', 20], ['🍪', 3, 'fun', 15], ['🧁', 5, 'fun', 24], ['🧃', 2, 'fun', 12]];
function petMode(k) {
  if (S.pet.dead) return toast(`💫 Primero revive a ${S.pet.name}`); petTick(); careTk++;
  if ($('#ptray') || $('.pet-room.sleeping')) render();
  ({ eat: foodMode, wash: bathMode, ball: ballMode, play: danceMode, love: loveMode, brush: brushMode, sleep: sleepMode, photo: photoMode })[k]();
}

/* ---- comer: arrastra, la comida vuela a la boca, mastica con migajas y eructito ---- */
function foodMode() {
  const tk = careTk, box = $('#pst'), P = S.pet;
  careTray(`<small>Arrastra la comida hasta la boca de ${esc(P.name)} 🍽️</small><div class="mrow" style="padding:4px 0"><span>🍽️</span><div class="bar"><i id="bb2" class="smooth" style="width:${P.hun}%;background:#ff9600"></i></div></div><div class="fd">${FOODS.map((f, i) => `<button data-f="${i}">${f[0]}<small>${f[1]} 🪙</small></button>`).join('')}</div>`);
  $$('#ptray [data-f]').forEach(b => b.onpointerdown = e => {
    const f = FOODS[+b.dataset.f]; if (S.coins < f[1]) return toast('Te faltan monedas 🪙 ¡Completa lecciones!');
    e.preventDefault(); const g = document.createElement('div'); g.className = 'drag'; g.textContent = f[0]; document.body.appendChild(g);
    const mv = ev => { g.style.left = ev.clientX + 'px'; g.style.top = ev.clientY + 'px'; const r = box.getBoundingClientRect(), n = Math.hypot(ev.clientX - (r.left + r.width / 2), ev.clientY - (r.top + r.height * .55)) < 110; if (n !== g._n) { g._n = n; box.innerHTML = bit(170, n ? 'eat' : 'happy'); if (n) { beep([700], .04); fxp('✨', { y: .45, s: 16, dy: -30 }); } } return n; };
    mv(e);
    const up = ev => {
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up); const n = mv(ev), from = { x: ev.clientX, y: ev.clientY }; g.remove();
      if (!n) { box.innerHTML = bit(170); return; }
      if (P[f[2]] >= 98 && P.hun >= 98) { box.innerHTML = bit(170); return toast(`${P.name} no tiene más ganas de comer 😊`); }
      S.coins -= f[1]; const before = P[f[2]]; P[f[2]] = Math.min(100, P[f[2]] + f[3]); if (f[2] === 'fun') P.hun = Math.min(100, P.hun + 8); save(); const gain = Math.round(P[f[2]] - before);
      // la comida vuela hacia la boca
      const r = box.getBoundingClientRect(), fl = document.createElement('div'); fl.className = 'drag fly'; fl.textContent = f[0]; fl.style.left = from.x + 'px'; fl.style.top = from.y + 'px'; document.body.appendChild(fl);
      requestAnimationFrame(() => requestAnimationFrame(() => { fl.style.left = r.left + r.width / 2 + 'px'; fl.style.top = r.top + r.height * .58 + 'px'; fl.style.transform = 'translate(-50%,-50%) scale(.25) rotate(200deg)'; fl.style.opacity = '.3'; }));
      beep([500, 380], .05);
      setTimeout(() => {
        fl.remove(); let c = 0; const coinsEl = $('.coins b'); if (coinsEl) coinsEl.textContent = S.coins; careBar(P.hun);
        const iv = setInterval(() => {
          if (!careOk(tk, box)) return clearInterval(iv); c++; box.innerHTML = bit(170, c % 2 ? 'happy' : 'eat'); const el = $('.bit', box); if (el) el.classList.add('a-chew');
          for (let i = 0; i < 3; i++) fxp(f[0], { s: 11, y: .62, dx: Math.random() * 90 - 45, dy: 24 + Math.random() * 40, t: 700 }); beep([240 + c * 28], .05); buzz(8);
          if (c >= 6) { clearInterval(iv); box.innerHTML = bit(170, 'cheer'); const e2 = $('.bit', box); if (e2) e2.classList.add('a-belly'); fxp('💨', { y: .7, dx: 50, dy: -20, s: 18 }); floatText(`${f[0]} ¡Ñam!  +${gain} 🍽️`, box); burst(box, '#ffb454'); beep(SND.ok); for (let i = 0; i < 4; i++) setTimeout(() => fxp('💖', { dy: -80 }), i * 110); setTimeout(() => { if (careOk(tk, box)) { render(); foodMode(); } }, 1500); }
        }, 230);
      }, 340);
    };
    addEventListener('pointermove', mv); addEventListener('pointerup', up);
  });
}

/* ---- bañar: bañera, jabón, espuma, pato, regadera y sacudida final con arcoíris ---- */
function bathMode() {
  const tk = careTk, box = $('#pst'), P = S.pet; if (S.coins < 5) return toast('Te faltan monedas 🪙 ¡Completa lecciones!'); if (P.cln >= 95) return toast(`${P.name} ya está limpia ✨`);
  box._lock = true; box.style.transform = ''; box.style.touchAction = 'none';
  const g = stageGeo(), rm = room();
  rm.insertAdjacentHTML('beforeend', `<div class="tub" style="left:${g.cx - 100}px;top:${g.bottom - 62}px"><div class="water"></div><span class="duck">🦆</span></div>`);
  careTray(`<b id="bt">🧼 Frota a ${esc(P.name)} con el jabón</b><div class="bar"><i id="bb2" style="width:0%"></i></div>`);
  let phase = 0, foam = [], last = 0; const need = 26, bt = $('#bt');
  const soap = document.createElement('div'); soap.className = 'tool'; soap.textContent = '🧼'; box.appendChild(soap);
  const bub = setInterval(() => { if (!careOk(tk, box)) return clearInterval(bub); fxp('🫧', { x: Math.random() * 100 - 50, y: .8, dy: -110 - Math.random() * 50, dx: Math.random() * 40 - 20, s: 14 + Math.random() * 14, t: 1500 }); }, 380);
  const mv = e => {
    if (!(e.buttons || e.pressure)) return; const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) return;
    const tl = $('.tool', box); if (tl) { tl.style.left = x - 20 + 'px'; tl.style.top = y - 34 + 'px'; }
    if (phase === 0) {
      if (Date.now() - last < 55) return; last = Date.now(); const f = document.createElement('i'), z = 22 + Math.random() * 28; f.className = 'foam'; f.style.cssText = `left:${x - z / 2}px;top:${y - z / 2}px;width:${z}px;height:${z}px`; box.appendChild(f); foam.push(f);
      const el = $('.bit', box); if (el && foam.length % 4 === 0) { el.classList.remove('a-wiggle'); void el.offsetWidth; el.classList.add('a-wiggle'); }
      careBar(foam.length / need * 100); beep([600 + foam.length * 14], .04); if (foam.length % 3 === 0) fxp('🫧', { ax: e.clientX - rm.getBoundingClientRect().left, ay: e.clientY - rm.getBoundingClientRect().top, dy: -50, s: 16 });
      if (foam.length >= need) { phase = 1; bt.textContent = '🚿 ¡Ahora enjuágala con la regadera!'; if (tl) tl.remove(); box.insertAdjacentHTML('beforeend', '<div class="shower">🚿</div>'); beep(SND.ok); }
    } else {
      const sh = $('.shower', box); if (sh) { sh.style.left = x - 24 + 'px'; sh.style.top = y - 56 + 'px'; }
      if (Date.now() - last > 90) { last = Date.now(); fxp('💧', { ax: e.clientX - rm.getBoundingClientRect().left, ay: e.clientY - rm.getBoundingClientRect().top, dx: Math.random() * 30 - 15, dy: 50, s: 14, t: 500 }); }
      foam = foam.filter(f => { const fr = f.getBoundingClientRect(); if (Math.hypot(e.clientX - (fr.left + fr.width / 2), e.clientY - (fr.top + fr.height / 2)) < 48) { f.classList.add('pop'); setTimeout(() => f.remove(), 250); return false; } return true; });
      careBar(foam.length / need * 100); beep([900], .03);
      if (!foam.length) {
        box.removeEventListener('pointermove', mv); box.removeEventListener('pointerdown', mv); clearInterval(bub); S.coins -= 5; const b0 = P.cln; P.cln = Math.min(100, P.cln + 50); save(); const gain = Math.round(P.cln - b0);
        box.innerHTML = bit(170, 'cheer'); const el = $('.bit', box); if (el) el.classList.add('a-shake'); beep([880, 1100, 1320], .08);
        for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; fxp(i % 3 ? '💧' : '✨', { y: .45, dx: Math.cos(a) * (70 + Math.random() * 40), dy: Math.sin(a) * (50 + Math.random() * 30), s: 16 + Math.random() * 8, t: 900 }); }
        fxp('🌈', { y: .1, dx: 0, dy: -10, s: 64, r: 0, t: 1700 });
        setTimeout(() => { if (careOk(tk, box)) careFinish('wash', '✨ ¡Limpiecita!', gain, '🛁'); }, 1300);
      }
    }
  };
  box.addEventListener('pointermove', mv); box.addEventListener('pointerdown', mv);
}

/* ---- pelota: la mascota persigue la pelota y la cabecea ---- */
function ballMode() {
  const tk = careTk, P = S.pet, box = $('#pst'); if (P.fun >= 95) return toast(`${P.name} ya está feliz 😊`);
  box._lock = true; const rm = room(), g = stageGeo(), W = g.w, floorY = g.bottom - 14, headY = g.top + 58, base = g.cx;
  careTray(`<b id="bt">⚽ Toca donde quieras para lanzar la pelota · ${esc(P.name)} la cabeceará</b><div class="bar"><i id="bb2" style="width:0%"></i></div>`);
  const field = document.createElement('div'); field.className = 'field'; field.innerHTML = '<div class="ballsh"></div><div class="ball3d">⚽</div>'; rm.appendChild(field);
  const ball = $('.ball3d', field), sh = $('.ballsh', field);
  let bx = W * .2, by = headY - 60, vx = 90, vy = 0, px = 0, hits = 0, cool = 0, last = performance.now(), T0 = last, el = $('.bit', box);
  const end = () => { field.remove(); box.style.transform = ''; P.fun = Math.min(100, P.fun + 30); qadd('play', 1); save(); careFinish('play', hits >= 10 ? '⚽ ¡Golazo!' : '⚽ ¡Buen juego!', 30, '💖'); };
  field.onpointerdown = e => { const r = rm.getBoundingClientRect(), tx = e.clientX - r.left, ty = e.clientY - r.top; vx = (tx - bx) * 2.1; vy = -Math.min(540, 360 + Math.max(0, (by - ty)) * .5); beep([520], .05); fxp('💥', { ax: bx, ay: by, dy: -20, dx: 0, s: 22, t: 400 }); };
  const step = t => {
    if (!careOk(tk, box)) return field.remove(); const dt = Math.min(.04, (t - last) / 1000); last = t; cool -= dt;
    vy += 1150 * dt; bx += vx * dt; by += vy * dt;
    if (by > floorY) { by = floorY; if (vy > 160) beep([260], .03); vy *= -.6; vx *= .88; if (Math.abs(vy) < 70) vy = 0; }
    if (by < 20) { by = 20; vy = Math.abs(vy) * .5; }
    if (bx < 16) { bx = 16; vx = Math.abs(vx) * .9; } if (bx > W - 16) { bx = W - 16; vx = -Math.abs(vx) * .9; }
    const tgt = Math.max(-(W / 2 - 70), Math.min(W / 2 - 70, bx - base)); px += (tgt - px) * Math.min(1, dt * 3.4);
    box.style.transform = `translateX(${px}px) rotate(${Math.max(-10, Math.min(10, (bx - base - px) / 14))}deg)`;
    if (cool <= 0 && Math.hypot(bx - (base + px), by - headY) < 52 && vy > -80) {
      vy = -400 - Math.random() * 60; vx = (Math.random() - .5) * 240 + (bx - base - px) * 3; hits++; cool = .4; careBar(hits / 10 * 100); beep([660 + hits * 30, 880], .06); buzz(12);
      box.innerHTML = bit(170, 'cheer'); el = $('.bit', box); if (el) el.classList.add('a-bonk'); fxp(['💖', '⭐', '✨'][hits % 3], { y: .15, dy: -50, s: 22 }); fxp('💥', { ax: bx, ay: by, dx: 0, dy: -20, s: 24, t: 400 }); setTimeout(() => { if (careOk(tk, box)) { box.innerHTML = bit(170); } }, 380);
    }
    ball.style.transform = `translate(${bx - 17}px,${by - 17}px) rotate(${bx * 2.4}deg)`; sh.style.cssText = `left:${bx - 16}px;top:${floorY + 14}px;transform:scale(${Math.max(.35, 1 - (floorY - by) / 260)});opacity:${Math.max(.15, .4 - (floorY - by) / 600)}`;
    if (hits >= 10 || (t - T0) / 1000 > 40) return end();
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---- fiesta: bola disco, ecualizador, luces y pasos de baile distintos ---- */
function danceMode() {
  const tk = careTk, P = S.pet, box = $('#pst'); if (P.fun >= 95) return toast(`${P.name} ya está feliz 😊`);
  box._lock = true; box.classList.add('disco'); const rm = room(); rm.classList.add('party');
  rm.insertAdjacentHTML('beforeend', `<div class="dball"><i></i>🪩</div><div class="eq">${Array.from({ length: 11 }, (_, i) => `<b style="animation-delay:${-(i * 83) % 700}ms;--h:${30 + (i * 37) % 60}%"></b>`).join('')}</div><div class="beatflash"></div>`);
  careTray(`<b id="bt">🎶 ¡Fiesta! Toca a ${esc(P.name)} para más corazones</b><div class="bar"><i id="bb2" style="width:0%"></i></div>`);
  const notes = [523, 659, 784, 659, 880, 784, 988, 1047], MOVES = ['a-dance', 'a-spin', 'a-hop', 'a-wiggle'], TOTAL = 16; let i = 0;
  box.onclick = () => { for (let k = 0; k < 3; k++) fxp('💖', { dy: -80 - Math.random() * 50, s: 22 }); beep([1000], .04); };
  const t = setInterval(() => {
    if (!careOk(tk, box)) { clearInterval(t); return; }
    const el = $('.bit', box); if (el) { MOVES.forEach(m => el.classList.remove(m)); el.classList.add(MOVES[Math.floor(i / 2) % 4]); }
    beep([notes[i % 8]], .2); if (i % 2 === 0) beep([110], .1);
    const bf = $('.beatflash', rm); if (bf) { bf.classList.remove('on'); void bf.offsetWidth; bf.classList.add('on'); }
    fxp(['🎵', '🎶', '✨', '💖'][i % 4], { x: (i % 2 ? 1 : -1) * 40, dy: -90, s: 24 }); if (i % 4 === 0) fxp('🎉', { dy: 40, dx: Math.random() * 160 - 80, y: -.2, s: 22, t: 1200 });
    careBar(++i / TOTAL * 100);
    if (i >= TOTAL) { clearInterval(t); P.fun = Math.min(100, P.fun + 30); qadd('play', 1); save(); careFinish('play', '💃 ¡Qué fiesta!', 30, '💖'); }
  }, 420);
}

/* ---- mimar: acaricia con el dedo, ojitos de corazón y ronroneo ---- */
function loveMode() {
  const tk = careTk, P = S.pet, box = $('#pst'); if (P.fun >= 95) return toast(`${P.name} ya está feliz 😊`);
  box._lock = true; box.style.touchAction = 'none'; careTray(`<b id="bt">💖 Acaricia a ${esc(P.name)} deslizando el dedo sobre ella</b><div class="bar"><i id="bb2" style="width:0%"></i></div>`);
  let dist = 0, lx = null, ly = null, loved = false, lastS = 0; const rm = room(), hand = document.createElement('div'); hand.className = 'tool hand'; hand.textContent = '🤚'; box.appendChild(hand);
  const mv = e => {
    const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; hand.style.left = x - 20 + 'px'; hand.style.top = y - 20 + 'px';
    if (!(e.buttons || e.pressure) || x < 0 || y < 0 || x > r.width || y > r.height) { lx = null; return; }
    if (lx !== null) dist += Math.hypot(x - lx, y - ly); lx = x; ly = y;
    box.style.transform = `perspective(520px) rotateY(${(x / r.width - .5) * 34}deg) rotateX(${-(y / r.height - .5) * 26}deg)`;
    if (!loved) { loved = true; box.innerHTML = bit(170, 'love'); box.appendChild(hand); }
    if (Date.now() - lastS > 140) { lastS = Date.now(); const a = rm.getBoundingClientRect(); fxp(['💖', '💕', '💗'][Math.floor(Math.random() * 3)], { ax: e.clientX - a.left, ay: e.clientY - a.top, dx: Math.random() * 40 - 20, dy: -60 - Math.random() * 40, s: 20 }); beep([220 + Math.random() * 40], .09); buzz(6); }
    careBar(dist / 900 * 100);
    if (dist >= 900) { box.removeEventListener('pointermove', mv); box.removeEventListener('pointerdown', mv); box.style.transform = ''; P.fun = Math.min(100, P.fun + 25); qadd('play', 1); save(); careFinish('tap', '💖 ¡Qué ricura!', 25, '💖'); }
  };
  box.addEventListener('pointermove', mv); box.addEventListener('pointerdown', mv); box.addEventListener('pointerup', () => { lx = null; });
}

/* ---- cepillar: quita los nudos del pelo con el cepillo ---- */
function brushMode() {
  const tk = careTk, P = S.pet, box = $('#pst'); if (P.cln >= 95 && P.fun >= 95) return toast(`${P.name} ya está peinada ✨`);
  box._lock = true; box.style.touchAction = 'none'; box.style.transform = ''; const N = 8; let left = N, lastS = 0;
  careTray(`<b id="bt">🪮 Pasa el cepillo y quita los nudos (${N})</b><div class="bar"><i id="bb2" style="width:0%"></i></div>`);
  const knots = Array.from({ length: N }, (_, i) => { const k = document.createElement('i'); k.className = 'knot'; k.textContent = '🌀'; k.style.cssText = `left:${22 + Math.random() * 56}%;top:${24 + Math.random() * 56}%;animation-delay:${i * 70}ms`; box.appendChild(k); return k; });
  const brush = document.createElement('div'); brush.className = 'tool brush'; brush.textContent = '🪮'; box.appendChild(brush);
  const mv = e => {
    const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; brush.style.left = x - 22 + 'px'; brush.style.top = y - 22 + 'px';
    if (!(e.buttons || e.pressure) || x < 0 || y < 0 || x > r.width || y > r.height) return;
    if (Date.now() - lastS > 70) { lastS = Date.now(); const a = room().getBoundingClientRect(); fxp('✨', { ax: e.clientX - a.left, ay: e.clientY - a.top, dx: Math.random() * 30 - 15, dy: -28, s: 12, t: 600 }); beep([1400 + Math.random() * 400], .02); }
    knots.forEach(k => { if (k._d) return; const kr = k.getBoundingClientRect(); if (Math.hypot(e.clientX - (kr.left + kr.width / 2), e.clientY - (kr.top + kr.height / 2)) < 34) { k._d = 1; k.classList.add('pop'); setTimeout(() => k.remove(), 280); left--; beep([900 + left * 60, 1200], .06); buzz(10); fxp('⭐', { ax: e.clientX - room().getBoundingClientRect().left, ay: e.clientY - room().getBoundingClientRect().top, dy: -50, s: 18 }); $('#bt').textContent = left ? `🪮 Pasa el cepillo y quita los nudos (${left})` : '✨ ¡Pelito sedoso!'; careBar((N - left) / N * 100); } });
    if (!left) { box.removeEventListener('pointermove', mv); box.removeEventListener('pointerdown', mv); const b0 = P.cln; P.cln = Math.min(100, P.cln + 20); P.fun = Math.min(100, P.fun + 8); save(); box.innerHTML = bit(170, 'cheer'); const el = $('.bit', box); if (el) el.classList.add('a-shine'); for (let i = 0; i < 10; i++) setTimeout(() => fxp('✨', { dy: -60 - Math.random() * 60, s: 20 }), i * 70); setTimeout(() => { if (careOk(tk, box)) careFinish('tap', '🪮 ¡Peinadita!', Math.round(P.cln - b0), '🛁'); }, 900); }
  };
  box.addEventListener('pointermove', mv); box.addEventListener('pointerdown', mv);
}

/* ---- dormir: se hace de noche, luna, estrellas y Zzz ---- */
function sleepMode() {
  const tk = careTk, P = S.pet, box = $('#pst'), left = (P.slp || 0) + 2 * 36e5 - Date.now();
  if (left > 0) return toast(`😴 ${P.name} aún no tiene sueño · vuelve en ${Math.ceil(left / 6e4)} min`);
  box._lock = true; box.style.transform = ''; const rm = room(); rm.classList.add('sleeping');
  rm.insertAdjacentHTML('beforeend', `<div class="night"><span class="moon">🌙</span>${Array.from({ length: 14 }, (_, i) => `<i style="left:${(i * 37 + 9) % 94}%;top:${(i * 23 + 6) % 55}%;animation-delay:${-i * 230}ms"></i>`).join('')}</div>`);
  box.innerHTML = bit(170, 'sleep'); careTray(`<b id="bt">😴 Shhh… ${esc(P.name)} está durmiendo</b><div class="bar"><i id="bb2" style="width:0%"></i></div>`);
  let n = 0; const TOTAL = 14, woke = () => { clearInterval(t); toast(`${P.name} se despertó 🥱`); render(); };
  box.onclick = woke;
  const t = setInterval(() => {
    if (!careOk(tk, box)) return clearInterval(t); n++; careBar(n / TOTAL * 100);
    fxp('Z', { x: 36, y: .3, dx: 30, dy: -70, s: 16 + (n % 3) * 7, c: 'zz', t: 1500 }); if (n % 4 === 0) beep([262, 220], .18);
    if (n >= TOTAL) {
      clearInterval(t); P.slp = Date.now(); const f0 = P.fun; P.fun = Math.min(100, P.fun + 25); P.hun = Math.min(100, P.hun + 6); save();
      const nt = $('.night', rm); if (nt) nt.classList.add('dawn'); box.innerHTML = bit(170, 'cheer'); const el = $('.bit', box); if (el) el.classList.add('a-stretch'); fxp('☀️', { y: .05, dx: 0, dy: 10, s: 56, r: 0, t: 1500 }); beep([392, 523, 659], .12);
      setTimeout(() => { if (careOk(tk, box)) careFinish('tap', '😊 ¡Buenos días!', Math.round(P.fun - f0), '💖'); }, 1400);
    }
  }, 500);
}

/* ---- foto: cuenta regresiva, flash y foto instantánea ---- */
function photoMode() {
  const tk = careTk, P = S.pet, box = $('#pst'), rm = room(); box._lock = true; box.style.transform = '';
  rm.insertAdjacentHTML('beforeend', '<div class="viewf"><i></i><i></i><i></i><i></i></div><div class="count" id="cnt">3</div>'); box.innerHTML = bit(170, 'cheer'); const el = $('.bit', box); if (el) el.classList.add('a-pose');
  let n = 3; const t = setInterval(() => {
    if (!careOk(tk, box)) return clearInterval(t); n--; const c = $('#cnt'); beep([n ? 700 : 1200], .1);
    if (n > 0) { c.textContent = n; c.classList.remove('pulse'); void c.offsetWidth; c.classList.add('pulse'); return; }
    clearInterval(t); c.remove(); rm.insertAdjacentHTML('beforeend', '<div class="flash"></div>'); beep([1800, 1200], .06); buzz(30);
    setTimeout(() => {
      if (!careOk(tk, box)) return; const gain = P.fun < 95 ? 6 : 0; if (gain) { P.fun = Math.min(100, P.fun + gain); save(); } render();
      const pl0 = pl().cur, s2 = sheet(`<div class="polaroid"><div class="ph place-${pl0}"><span class="st s1">⭐</span><span class="st s2">💖</span><span class="st s3">✨</span>${bit(150, 'cheer')}</div><b>${esc(P.name)}</b><small>Nivel ${level()} · ${CQ.pet.STAGES[petStage()]} · ${new Date().toLocaleDateString('es')}</small></div><button class="btn primary big" id="pok">¡Qué linda foto! 📸</button>`);
      confetti(); beep(SND.win); $('#pok', s2.el).onclick = s2.close;
    }, 450);
  }, 800);
}
function resultSheet(label, coins) {
  const st = coins >= 20 ? 3 : coins >= 10 ? 2 : 1, s = sheet(`<div class="gres">${bit(120, coins > 0 ? 'cheer' : 'sad')}<h3>${esc(label)}</h3><div class="gstars">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</div><div class="gcoins">+<b id="gcn">0</b> 🪙</div><button class="btn primary big" id="gok">¡Genial!</button></div>`);
  let n = 0; const iv = setInterval(() => { if (!s.el.isConnected) return clearInterval(iv); n = Math.min(coins, n + Math.max(1, Math.ceil(coins / 20))); $('#gcn', s.el).textContent = n; beep([500 + n * 20], .03); if (n >= coins) clearInterval(iv); }, 45);
  if (coins > 0) confetti(); $('#gok', s.el).onclick = () => s.close();
}
function petAnim(k) {
  const box = $('#pst'), el = box && $('.bit', box); if (!el) return;
  const E = { eat: ['🍎', '🍓', '🍪'], wash: ['🫧', '🫧', '💦'], play: ['🎾', '⭐', '🎵'], tap: ['💖', '💕', '✨'] }[k];
  el.classList.add('a-' + k); setTimeout(() => el.classList.remove('a-' + k), 1500);
  for (let i = 0; i < (k === 'tap' ? 3 : 6); i++) {
    const p = document.createElement('span'); p.className = 'ptc' + (k === 'eat' ? ' fall' : ''); p.textContent = E[i % E.length];
    p.style.setProperty('--x', (Math.random() * 120 - 60) + 'px'); p.style.animationDelay = i * 130 + 'ms'; box.appendChild(p); setTimeout(() => p.remove(), 2400);
  }
}
function petRevive(paid) {
  const P = S.pet; if (paid) { if (S.coins < 150) return toast(`Te faltan ${150 - S.coins} 🪙`); S.coins -= 150; }
  Object.assign(P, { dead: false, hun: 40, cln: 40, fun: 40, ts: Date.now(), sv: 0 }); save(); confetti(); beep(SND.win); toast(`✨ ¡${P.name} revivió!`); render();
}
function viewDead(m) {
  const P = S.pet;
  m.innerHTML = `<div class="pet-room dead"><div class="pet-stage" id="pst">${bit(170)}</div><div class="pet-name">${esc(P.name)}</div><small class="muted">Se desmayó por falta de cuidados 💫</small></div>
  <div class="sec"><h3>Revivir a ${esc(P.name)}</h3><p class="muted">No pierde su nivel ni sus accesorios. Elige cómo traerla de vuelta:</p>
  <button class="btn primary big" id="rl">📗 Completar 1 lección (gratis)</button><button class="btn big" id="rc" style="margin-top:8px">🪙 Revivir ahora · 150</button></div>`;
  $('#rl').onclick = () => { view = 'path'; render(); };
  $('#rc').onclick = () => petRevive(true);
}
function viewPet(m) {
  if (!S.pet || adoptSel) return viewAdopt(m);
  petTick(); save(); if (S.pet.dead) return viewDead(m);
  const P = S.pet, st = petStage(), sp = CQ.pet.SPECIES.find(x => x.id === P.sp), lv = level();
  const bar = (ic, nm, v, c) => `<div class="mrow" style="padding:5px 0"><span style="font-size:1.3rem">${ic}</span><span style="width:6.2em">${nm}</span><div class="bar"><i style="width:${v}%;background:${c}"></i></div><em>${Math.round(v)}%</em></div>`;
  const q = qget(), fx = sp.fx;
  const quests = `<div class="sec"><h3>Misiones de hoy</h3>${QUESTS.map(([k, n, t, ic], i) => { const v = Math.min(n, q.p[k] || 0), ok = v >= n, c = q.c[i]; return `<div class="mrow" style="padding:5px 0"><span style="font-size:1.3rem">${ic}</span><span style="flex:1">${t}</span><div class="bar" style="flex:none;width:60px"><i style="width:${v / n * 100}%"></i></div><button class="pill ${ok && !c ? 'on' : ''}" data-q="${i}" ${!ok || c ? 'disabled' : ''}>${c ? '✓' : ok ? '+15 🪙' : v + '/' + n}</button></div>`; }).join('')}<small class="muted">Cumple las 4 y abre un cofre sorpresa 🎁</small></div>`;
  const nextEv = st < 3 ? `Evoluciona en el nivel ${st * 3 + 4}` : '¡Forma máxima!';
  m.innerHTML = `<div class="pet-room place-${pl().cur}"><div class="scn">${PLACES.find(x => x[0] === pl().cur)[5].map(d => `<span style="left:${d[1]}%;top:${d[2]}%;font-size:${d[3]}px">${d[0]}</span>`).join('')}</div><div class="coins" title="Monedas">🪙 <b>${S.coins}</b></div><div class="pet-stage" id="pst">${bit(170)}</div>
    <div class="pet-name">${esc(P.name)}</div><small class="muted">${sp.name} · ${CQ.pet.STAGES[st]} · Nivel ${lv} · ${nextEv}</small></div>
  <div class="pacts"><button class="btn pact" data-a="eat"><span>🍎</span>Comer<small>desde 2 🪙</small></button><button class="btn pact" data-a="wash"><span>🫧</span>Bañar<small>5 🪙</small></button><button class="btn pact" data-a="ball"><span>⚽</span>Pelota<small>gratis</small></button><button class="btn pact" data-a="play"><span>🪩</span>Fiesta<small>gratis</small></button><button class="btn pact" data-a="love"><span>💖</span>Mimar<small>gratis</small></button><button class="btn pact" data-a="brush"><span>🪮</span>Cepillar<small>gratis</small></button><button class="btn pact" data-a="sleep"><span>😴</span>Dormir<small>gratis</small></button><button class="btn pact" data-a="photo"><span>📸</span>Foto<small>gratis</small></button></div>
  <button class="btn big" id="mgb" style="width:100%;margin-top:10px">🎮 Minijuegos</button>
  <div class="sec">${bar('🍽️', 'Hambre', P.hun, '#ff9600')}${bar('🛁', 'Limpieza', P.cln, '#4cc9f0')}${bar('💖', 'Cariño', P.fun, '#ff5c8a')}
  <p class="muted" style="font-size:.8rem;margin-top:4px">Ganas 1 🪙 por cada XP. Si la descuidas solo se pone triste, ¡nunca le pasa nada malo!</p></div>
  <div class="sec"><h3>Tienda</h3><div class="items" style="grid-template-columns:1fr 1fr">${SHOP.slice(0, 2).map(([id, ic, nm, c, ds]) => `<button class="itm" data-sh="${id}"><span>${ic}</span><b>${nm}</b><small>${ds}</small><small>🪙 ${c}${id === 'freeze' ? ' · tienes ' + (S.freeze || 0) : S.boostTo > Date.now() ? ' · activo ' + Math.ceil((S.boostTo - Date.now()) / 6e4) + ' min' : ''}</small></button>`).join('')}</div></div>
  <div class="sec"><h3>Lugares</h3><div class="items" style="grid-template-columns:repeat(3,1fr)">${PLACES.map(([id, ic, nm, c, lv]) => { const own = pl().own.includes(id); return `<button class="itm ${pl().cur === id ? 'on' : ''}" data-pl="${id}"><span>${ic}</span><b>${nm}</b><small>${pl().cur === id ? '✓ Aquí' : own ? 'Ir' : lv ? '🔒 Nivel ' + lv : '🪙 ' + c}</small></button>`; }).join('')}</div></div>
  <div class="sec"><h3>Color</h3><div class="swatches">${CQ.pet.COLORS.map((c, i) => `<button class="sw ${P.col === i ? 'on' : ''}" data-c="${i}" title="${CQ.pet.COLOR_NAMES[i]}" style="background:${c[0]}"></button>`).join('')}</div></div>
  <div class="sec"><h3>Ropa y accesorios · ${Object.values(P.eq).filter(Boolean).length}/5 puestos</h3><div class="eqrow">${SLOTS.slice(1).map(([id, nm]) => { const it = CQ.pet.ITEMS.find(i => i.id === P.eq[id]); return `<div class="eqs">${it ? CQ.pet.preview(it) : '<i>＋</i>'}<small>${nm}</small></div>`; }).join('')}</div><button class="btn primary big" id="wrb" style="margin-top:10px">👗 Abrir vestidor · ${CQ.pet.ITEMS.length} prendas</button></div>
  <div class="sec"><button class="btn big" id="chg">🔄 Cambiar de mascota</button></div>`;
  $$('[data-q]', m).forEach(b => b.onclick = () => qclaim(+b.dataset.q));
  $('#mgb').onclick = miniGame;
  $$('[data-sh]', m).forEach(b => b.onclick = () => shopBuy(b.dataset.sh));
  $('#pst').onclick = () => { petAnim('tap'); beep([880]); buzz(10); };
  $$('[data-a]', m).forEach(b => b.onclick = () => petMode(b.dataset.a));
  $('#wrb').onclick = wardrobe;
  $$('[data-pl]', m).forEach(b => b.onclick = () => placeAct(b.dataset.pl));
  $$('[data-c]', m).forEach(b => b.onclick = () => { P.col = +b.dataset.c; save(); render(); });
  $$('[data-i]', m).forEach(b => b.onclick = () => petItem(b.dataset.i));
  $('#chg').onclick = () => { adoptSel = P.sp; adoptSel = P.sp; adoptName = P.name; render(); };
  const pb = $('#pst'); pb.onpointermove = e => { if (pb._lock) return; const r = pb.getBoundingClientRect(); pb.style.transform = `perspective(520px) rotateY(${((e.clientX - r.left) / r.width - .5) * 30}deg) rotateX(${-((e.clientY - r.top) / r.height - .5) * 24}deg)`; }; pb.onpointerleave = () => { pb.style.transform = ''; };
}
/* ---------- liga semanal (rivales simulados hasta tener servidor) ---------- */
const TIERS = [['Bronce', '#cd7f32'], ['Plata', '#9aa6b8'], ['Oro', '#f5b301'], ['Zafiro', '#3b82f6'], ['Rubí', '#e11d48'], ['Amatista', '#8b5cf6'], ['Diamante', '#22d3ee']];
const BOTN = ['Luna', 'Kai', 'Mía', 'Teo', 'Nora', 'Leo', 'Zoe', 'Dani', 'Ari', 'Sol', 'Iris', 'Max', 'Lía', 'Noa', 'Bruno', 'Vera', 'Hugo', 'Alma', 'Gael', 'Emi', 'Rocío', 'Tomi', 'Ona', 'Fede', 'Juli', 'Sami', 'Cleo', 'Nico', 'Pau', 'Lola'];
const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967295; };
const weekStart = (d = new Date()) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return dayStr(x); };
function weekXp(ws) { let t = 0; const d = new Date(ws + 'T00:00:00'); for (let i = 0; i < 7; i++) { t += S.hist[dayStr(d)] || 0; d.setDate(d.getDate() + 1); } return t; }
function leagueRows(ws, tier, frac) {
  const bots = [...BOTN].sort((a, b) => hash(ws + a) - hash(ws + b)).slice(0, 19).map((n, i) => ({ n, xp: Math.floor((60 + hash(ws + tier + n) * 520) * (1 + tier * .35) * frac) }));
  return [...bots, { n: 'Tú', xp: weekXp(ws), me: true }].sort((a, b) => b.xp - a.xp || (a.me ? 1 : -1));
}
function leagueSync() {
  const ws = weekStart(), L = S.lg || (S.lg = { w: ws, t: 0 });
  if (L.w !== ws) {
    const rows = leagueRows(L.w, L.t, 1), rank = rows.findIndex(r => r.me) + 1, xp = weekXp(L.w); let nt = L.t, res = 'stay';
    if (xp > 0) { if (rank <= 5 && L.t < TIERS.length - 1) { nt++; res = 'up'; S.coins += 50; } else if (rank > 15 && L.t > 0) { nt--; res = 'down'; } }
    S.lg = { w: ws, t: nt, last: { rank, res, from: L.t } }; save();
  }
  return S.lg;
}
function viewLeague(m) {
  const L = leagueSync(), ws = L.w, frac = Math.max(.04, Math.min(1, (Date.now() - new Date(ws + 'T00:00:00')) / (7 * 864e5)));
  const rows = leagueRows(ws, L.t, frac), me = rows.findIndex(r => r.me) + 1, [tn, tc] = TIERS[L.t], days = Math.max(1, Math.ceil((1 - frac) * 7)), la = L.last;
  const ban = la ? `<div class="lg-ban">${la.res === 'up' ? `🎉 ¡Subiste a la liga ${TIERS[L.t][0]}! Terminaste #${la.rank} · +50 🪙` : la.res === 'down' ? `Bajaste a ${TIERS[L.t][0]}. Terminaste #${la.rank}. ¡Esta semana la recuperas!` : `Terminaste #${la.rank} la semana pasada. ¡Sigue así!`}</div>` : '';
  m.innerHTML = `<div class="lg-hd" style="--tc:${tc}"><div class="lg-badge">🏆</div><div><div class="h-title" style="margin:0">Liga ${tn}</div><small class="muted">Termina en ${days} día(s) · Vas #${me} · los 5 primeros suben</small></div></div>${ban}
  <div class="lg-list">${rows.map((r, i) => `<div class="lg-row ${r.me ? 'me' : ''} ${i < 5 ? 'up' : i >= 15 ? 'dn' : ''}"><b class="lg-pos">${i + 1}</b>${r.me ? bit(34) : `<i class="lg-av" style="background:hsl(${Math.floor(hash(r.n) * 360)} 75% 80%)">${r.n[0]}</i>`}<span class="lg-n">${r.me ? (S.pet ? esc(S.pet.name) + ' · tú' : 'Tú') : r.n}</span><em>${r.xp} XP</em></div>`).join('')}</div>
  <p class="muted" style="font-size:.78rem;margin-top:10px">Rivales simulados: cuando activemos las cuentas competirás con personas reales. Gana XP en lecciones y prácticas para subir.</p>`;
  if (la) { delete L.last; save(); }
}
addEventListener('offline', () => toast('Sin conexión · tu progreso se guarda en este dispositivo'));
addEventListener('online', () => toast('¡De vuelta en línea! ✨'));
function wardrobe() {
  let tab = 'head'; const P = S.pet;
  const s = gsheet(`<h3>👗 Vestidor</h3><div class="wr-pet" id="wp"></div><div class="tabs3" id="wt"></div><div class="wr-grid" id="wg"></div>`);
  const paint = () => {
    const lv = level(), n = Object.values(P.eq).filter(Boolean).length;
    { const gp = $('#gpet', s.el); if (gp) gp.remove(); }
    $('#wp', s.el).innerHTML = `<div class="wr-stage">${bit(150)}</div><b>${n}/5 prendas puestas</b>`;
    $('#wt', s.el).innerHTML = SLOTS.slice(1).map(([id, nm]) => `<button class="${tab === id ? 'on' : ''}" data-t="${id}">${nm} ${CQ.pet.ITEMS.filter(i => i.slot === id).length}</button>`).join('');
    $('#wg', s.el).innerHTML = CQ.pet.ITEMS.filter(i => i.slot === tab).sort((a, b) => a.lv - b.lv || a.cost - b.cost).map(it => {
      const own = P.own.includes(it.id), on = P.eq[it.slot] === it.id, lock = !own && lv < it.lv;
      return `<button class="itm ${on ? 'on' : ''} ${lock ? 'lock' : ''}" data-i="${it.id}"><span class="pv">${CQ.pet.preview(it)}</span><b>${it.name}</b><small>${on ? 'Puesto ✓' : own ? 'Poner' : lock ? '🔒 Nivel ' + it.lv : '🪙 ' + it.cost}</small></button>`;
    }).join('');
    $$('[data-t]', s.el).forEach(b => b.onclick = () => { tab = b.dataset.t; paint(); });
    $$('[data-i]', s.el).forEach(b => b.onclick = () => { petItem(b.dataset.i); paint(); });
  };
  paint();
}
function viewProfile(m) {
  const lv = level(), a = levelXp(lv), b = levelXp(lv + 1), p = Math.round((S.xp - a) / (b - a) * 100);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return [dayStr(d), ['D', 'L', 'M', 'X', 'J', 'V', 'S'][d.getDay()]]; });
  const mx = Math.max(S.goal, ...days.map(([d]) => S.hist[d] || 0));
  const today = S.hist[dayStr()] || 0;
  m.innerHTML = `<div class="hero">${bit(84)}<div style="flex:1"><div class="h-title" style="margin:0">Nivel ${lv} · ${TITLES[Math.min(TITLES.length - 1, Math.floor((lv - 1) / 2))]}</div><div class="bar" style="margin:6px 0"><i style="width:${p}%"></i></div><small class="muted">${S.xp - a} / ${b - a} XP para el nivel ${lv + 1}</small></div></div>
  <div class="grid2"><div class="stat"><span>🔥</span><div><b>${streakNow()}</b><small>racha (mejor ${S.best})</small></div></div><div class="stat"><span>⚡</span><div><b>${S.xp}</b><small>XP total</small></div></div>
  <div class="stat"><span>📗</span><div><b>${totalDone()}</b><small>lecciones</small></div></div><div class="stat"><span>🎯</span><div><b>${S.answered ? Math.round(S.right / S.answered * 100) : 0}%</b><small>precisión</small></div></div></div>
  <div class="sec"><h3>Meta diaria · ${today}/${S.goal} XP</h3><div class="bar"><i style="width:${Math.min(100, today / S.goal * 100)}%;background:var(--blue)"></i></div>
  <div class="goals">${[10, 20, 30, 50, 100].map(g => `<button class="pill ${S.goal === g ? 'on' : ''}" data-g="${g}">${g} XP</button>`).join('')}</div>
  <div class="week">${days.map(([d, l], i) => `<div class="${i === 6 ? 't' : ''}"><i style="height:${Math.max(4, (S.hist[d] || 0) / mx * 70)}px"></i>${l}</div>`).join('')}</div></div>
  <div class="sec"><h3>Mis cursos</h3>${LANGS.map(l => { const { d, n } = langProgress(l), L = CQ.content[l]; return `<div class="mrow" style="padding:6px 0"><span style="font-size:1.4rem">${L.emoji}</span><span style="width:6.5em">${esc(L.name)}</span><div class="bar"><i style="width:${d / n * 100}%;background:${L.color}"></i></div><em>${d}/${n}</em></div>`; }).join('')}</div>
  <div class="sec"><h3>Logros · ${Object.keys(S.ach).length}/${ACH.length}</h3><div class="ach">${ACH.map(([id, ic, nm, ds]) => `<div class="${S.ach[id] ? '' : 'off'}"><span>${ic}</span><b>${nm}</b>${ds}</div>`).join('')}</div></div>
  <div class="sec"><h3>Ajustes</h3>
  <div class="row"><span>Sonidos</span><button class="pill ${S.sound ? 'on' : ''}" id="snd">${S.sound ? 'Activados' : 'Apagados'}</button></div>
  <div class="row"><span>Tema</span><select id="thm"><option value="auto">Automático</option><option value="light">Claro</option><option value="dark">Oscuro</option></select></div>
  <div class="row"><span>Copia de seguridad</span><span><button class="linkbtn" id="exp">Exportar</button><button class="linkbtn" id="imp">Importar</button></span></div>
  <div class="row"><span>Borrar todo mi progreso</span><button class="linkbtn" style="color:var(--red)" id="rst">Borrar</button></div>
  <p class="muted" style="margin-top:10px;font-size:.8rem">CodeQuest v${VERSION} · Tu progreso se guarda en este dispositivo.</p></div>`;
  $$('[data-g]', m).forEach(b => b.onclick = () => { S.goal = +b.dataset.g; save(); render(); });
  $('#snd').onclick = () => { S.sound = !S.sound; save(); render(); };
  const t = $('#thm'); t.value = S.theme; t.onchange = () => { S.theme = t.value; save(); applyTheme(); };
  $('#exp').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = 'codequest-progreso.json'; a.click(); };
  $('#imp').onclick = () => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = 'application/json';
    i.onchange = () => i.files[0].text().then(tx => { try { const o = JSON.parse(tx); if (typeof o !== 'object' || !o.done) throw 0; S = { ...DEF, ...o }; save(); applyTheme(); render(); toast('Progreso importado ✅'); } catch (e) { toast('Archivo no válido'); } });
    i.click();
  };
  $('#rst').onclick = () => {
    const s = sheet('<h3>¿Borrar todo?</h3><p>Se perderán tu XP, racha y progreso. No se puede deshacer.</p><button class="btn danger big" id="y">Sí, borrar</button><button class="btn big" id="n">Cancelar</button>');
    $('#n', s.el).onclick = s.close; $('#y', s.el).onclick = () => { S = { ...DEF, seen: true }; save(); s.close(); openPicker(true); };
  };
}
function applyTheme() { if (S.theme === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = S.theme; }

/* ---------- bienvenida y selector de curso ---------- */
function openWelcome() {
  const el = overlay('welcome');
  el.innerHTML = `<div class="ls-body center welcome" style="justify-content:center"><div class="hero-bit">${bit(150, 'cheer')}</div><h1 class="logo rise-in" style="--d:200ms"><span>Code</span>Quest</h1><p class="muted rise-in" style="max-width:320px;--d:350ms">Aprende a programar jugando. Lecciones cortas, quizzes y repaso inteligente: de cero a experto.</p>
  <div class="card rise-in" style="text-align:left;margin-top:8px;width:100%;max-width:340px;--d:500ms">🧩 14 lenguajes y cientos de lecciones<br>🔥 Rachas, XP, niveles y logros<br>🧠 Repaso espaciado que sí se queda<br>📱 Funciona en el móvil y sin conexión</div></div>
  <div class="ls-foot"><button class="btn primary big" id="go">Comenzar</button></div>`;
  $('#go').onclick = () => { S.seen = true; save(); openGoal(); };
}
function openGoal() {
  const el = overlay('welcome');
  const opts = [[10, '🌱', 'Casual', '10 XP al día · ~3 min'], [20, '📘', 'Regular', '20 XP al día · ~6 min'], [30, '🔥', 'Serio', '30 XP al día · ~10 min'], [50, '🚀', 'Intenso', '50 XP al día · ~15 min']];
  el.innerHTML = `<div class="ls-body"><div class="intro-hd" style="margin-top:20px">${bit(64, 'think')}<h2 style="font-size:1.4rem">¿Cuál es tu meta diaria?</h2></div><p class="muted" style="margin:6px 0 16px">Puedes cambiarla cuando quieras en tu perfil.</p>
  ${opts.map(([g, e, t, d], i) => `<button class="lang-card" style="--i:${i}" data-g="${g}"><span class="em" style="--c:var(--soft)">${e}</span><span style="flex:1"><b>${t}</b><small>${d}</small></span></button>`).join('')}</div>`;
  $$('[data-g]', el).forEach(b => b.onclick = () => { S.goal = +b.dataset.g; save(); killOverlay('welcome'); openPicker(true); });
}
function openPicker(first) {
  const el = overlay('picker');
  const soon = CQ.roadmap.filter(r => !CQ.content[r.id]);
  el.innerHTML = `<div class="ls-top">${first || !S.lang ? '' : '<button class="x" id="pb">✕</button>'}<h2 style="font-size:1.3rem;flex:1">¿Qué quieres aprender?</h2></div><div class="ls-body">
  ${LANGS.map((id, ix) => { const L = CQ.content[id], { d, n } = langProgress(id); return `<button class="lang-card ${id === S.lang ? 'cur' : ''}" style="--i:${ix}" data-l="${id}"><span class="em" style="--c:${L.color}">${L.emoji}</span><span style="flex:1"><b>${esc(L.name)}</b><small>${L.units.length} unidades · ${n} lecciones</small><div class="bar"><i style="width:${d / n * 100}%;background:${L.color}"></i></div></span></button>`; }).join('')}
  <div class="h-title" style="margin-top:20px">Próximamente</div>
  ${soon.map(r => `<button class="lang-card soon" data-s="${r.id}"><span class="em" style="--c:${r.color}">${r.emoji}</span><span style="flex:1"><b>${esc(r.name)}</b><small>${r.units.length} unidades planeadas</small></span></button>`).join('')}</div>`;
  const pb = $('#pb', el); if (pb) pb.onclick = () => killOverlay('picker');
  $$('[data-l]', el).forEach(b => b.onclick = () => chooseLang(b.dataset.l));
  $$('[data-s]', el).forEach(b => b.onclick = () => {
    const r = soon.find(x => x.id === b.dataset.s);
    const s = sheet(`<h3>${r.emoji} ${esc(r.name)} · próximamente</h3><p>Ruta planeada:</p><div class="intro"><ul>${r.units.map(u => `<li>${esc(u)}</li>`).join('')}</ul></div><button class="btn blue big" id="ok">Entendido</button>`);
    $('#ok', s.el).onclick = s.close;
  });
}
function chooseLang(id) {
  S.lang = id; save(); killOverlay('picker'); view = 'path'; $('#main').dataset.scrolled = ''; render();
  if (!langProgress(id).d && !S.offered[id]) {
    S.offered[id] = 1; save();
    const s = sheet(`<h3>${CQ.content[id].emoji} ${esc(CQ.content[id].name)}</h3><p>¿Cómo quieres empezar?</p><button class="btn primary big" id="a">Desde cero</button><button class="btn blue big" id="b">Ya sé algo · prueba de nivel</button>`);
    $('#a', s.el).onclick = s.close; $('#b', s.el).onclick = () => { s.close(); startPlacement(); };
  }
}

/* ---------- sesiones: lección, práctica, prueba de nivel ---------- */
let ses = null, cur = null;
function startLesson(lang, idx) {
  refreshHearts(); if (S.hearts <= 0) return noHearts();
  const f = flat(lang)[idx], q = f.l.ex.map(x => ({ x }));
  pickReviews(lang, f.key, 2).forEach((x, i) => q.splice(Math.min(q.length, 3 + i * 2), 0, { x, rev: true }));
  ses = { mode: 'lesson', lang, f, queue: q, i: 0, mistakes: 0, right: 0, start: Date.now(), phase: f.l.intro ? 'intro' : 'q', xp: 0 };
  renderLesson();
}
function startPractice() {
  const lang = S.lang, now = Date.now();
  const ids = Object.keys(S.srs).filter(id => EX[id] && EX[id].lang === lang && EX[id].ex.k !== 'run');
  if (!ids.length) return toast('Completa una lección para desbloquear la práctica');
  const due = ids.filter(id => S.srs[id].d <= now).sort((a, b) => S.srs[a].b - S.srs[b].b);
  let pick = due.slice(0, 10);
  if (pick.length < 10) pick = pick.concat(shuffle(ids.filter(id => !pick.includes(id))).slice(0, 10 - pick.length));
  ses = { mode: 'practice', lang, f: null, queue: shuffle(pick).map(id => ({ x: EX[id].ex })), i: 0, mistakes: 0, right: 0, start: Date.now(), phase: 'q', xp: 0 };
  renderLesson();
}
function placementQs(lang, ui) {
  const pool = flat(lang).filter(f => f.ui === ui).flatMap(f => f.l.ex).filter(x => x.k !== 'run');
  return shuffle(pool).slice(0, 3).map(x => ({ x }));
}
function startPlacement() {
  const lang = S.lang, max = Math.min(5, CQ.content[lang].units.length);
  ses = { mode: 'placement', lang, f: null, queue: placementQs(lang, 0), i: 0, mistakes: 0, right: 0, start: Date.now(), phase: 'q', xp: 0, stage: 0, stageRight: 0, passed: 0, max };
  renderLesson();
}
function renderLesson() {
  const el = overlay('lesson');
  let pct = ses.i / ses.queue.length * 100;
  if (ses.mode === 'placement') pct = (ses.stage + (ses.i % 3) / 3) / ses.max * 100;
  const from = ses.pct == null ? 0 : ses.pct; ses.pct = pct;
  el.innerHTML = `<div class="ls-top"><button class="x" aria-label="Salir">✕</button><div class="bar prog"><i id="pbar" style="width:${from}%"></i></div>${(ses.combo || 0) >= 3 ? `<div class="combo">🔥${ses.combo}</div>` : ''}${ses.mode === 'lesson' ? `<div class="hrt">❤️ ${S.hearts}</div>` : ''}</div><div class="ls-body" id="lsb"></div><div class="ls-foot" id="lsf"></div>`;
  $('.x', el).onclick = confirmExit;
  requestAnimationFrame(() => requestAnimationFrame(() => { const b = $('#pbar'); if (b) b.style.width = pct + '%'; }));
  if (ses.phase === 'intro') renderIntro(); else renderQuestion();
}
function renderIntro() {
  $('#lsb').innerHTML = `<div class="intro"><div class="intro-hd">${bit(56)}<span class="tag">Aprende</span></div><h2>${esc(ses.f.l.title)}</h2>${md(ses.f.l.intro, ses.lang)}</div>`;
  $('#lsf').innerHTML = '<button class="btn primary big" id="ig">Entendido</button>';
  $('#ig').onclick = () => { ses.phase = 'q'; renderLesson(); };
}
function confirmExit() {
  const s = sheet(`<h3>¿Seguro que quieres salir?</h3><p>${ses.mode === 'placement' ? 'Perderás el avance de la prueba.' : 'Perderás el progreso de esta lección.'}</p><button class="btn primary big" id="k">Seguir aprendiendo</button><button class="linkbtn" id="q" style="color:var(--red)">Salir</button>`);
  $('#k', s.el).onclick = s.close; $('#q', s.el).onclick = () => { s.close(); closeLesson(); };
}
function closeLesson() {
  const f = fresh; killOverlay('lesson'); ses = null; cur = null;
  if (f && f.celebs && f.celebs.length) {
    const c = f.celebs; f.celebs = []; fresh = null; render();
    showCelebs(c, () => { fresh = f; render(); fresh = null; });
  } else { render(); fresh = null; }
}

/* --- ejercicios --- */
const R = {};
function renderQuestion() {
  const it = ses.queue[ses.i], x = it.x, info = EX[x._id], lang = info ? info.lang : ses.lang;
  $('#lsb').innerHTML = `${it.rev ? '<span class="tag">🔁 Repaso</span>' : ''}${it.retry ? '<span class="tag">↻ Otra vez</span>' : ''}<h2 class="q">${inl(x.q)}</h2><div id="ex"></div>`;
  $('#lsb').scrollTop = 0;
  $('#lsf').className = 'ls-foot';
  $('#lsf').innerHTML = '<button class="btn primary big" id="chk" disabled>Comprobar</button>';
  $('#chk').onclick = onCheck;
  cur = { x, it, lang, locked: false, attempts: 0, update() { const b = $('#chk'); if (b) b.disabled = cur.locked || cur.get() == null; } };
  R[x.k](cur, $('#ex'));
  cur.update();
}
async function onCheck() {
  if (!cur || cur.locked) return;
  const btn = $('#chk'); btn.disabled = true;
  const res = await cur.check();
  if (res.retry) { btn.disabled = false; return; }
  cur.locked = true; if (cur.lock) cur.lock(res.ok);
  feedback(res);
}
const PRAISE = ['¡Correcto!', '¡Genial!', '¡Bien hecho!', '¡Excelente!', '¡Así se hace!'];
function feedback(res) {
  const { x, it } = cur, ok = res.ok, foot = $('#lsf');
  if (res.skip) {
    foot.className = 'ls-foot';
    foot.innerHTML = '<div class="fb-t">Ejercicio omitido</div><div class="fb-e">No cuenta en tu contra. Vuelve a intentarlo con conexión.</div><button class="btn blue big" id="nxt">Continuar</button>';
    ses.queue.splice(ses.i, 1); ses.i--; $('#nxt').onclick = next; return;
  }
  if (!it.retry) { updSRS(x._id, ok); S.answered++; if (ok) { S.right++; qadd('right', 1); } }
  if (ok) { ses.right++; ses.combo = (ses.combo || 0) + 1; addXP(2); ses.xp += 2; }
  else {
    ses.combo = 0; ses.mistakes++;
    if (ses.mode === 'lesson') loseHeart();
    if (ses.mode !== 'placement' && !it.retry) ses.queue.push({ x, retry: true });
  }
  if (ses.mode === 'placement' && ok) ses.stageRight++;
  const cb = Math.min(ses.combo, 8);
  beep(ok ? [660 + cb * 35, 880 + cb * 45] : SND.bad); buzz(ok ? 15 : [70, 40, 70]);
  save(); renderTop();
  foot.className = 'ls-foot rise ' + (ok ? 'fbok' : 'fbbad');
  foot.innerHTML = `<div class="fb-row">${bit(54, ok ? 'cheer' : 'sad')}<div class="fb-main"><div class="fb-t">${ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : 'Respuesta correcta'}${ok && ses.combo >= 3 ? ` <span class="combo-b">🔥 ×${ses.combo}</span>` : ''}</div>${!ok && res.show ? `<div class="fb-a">${res.show}</div>` : ''}<div class="fb-e">${inl(x.e || '')}</div></div></div><button class="btn big ${ok ? 'primary' : 'danger'}" id="nxt">Continuar</button>`;
  $('#nxt').onclick = next;
  if (ok) { floatText('+2 XP', foot); burst($('.fb-row .bit', foot), '#8b5cf6');
    if (ses.combo >= 3 && S.pet) floatText(CQ.pet.SPECIES.find(s => s.id === S.pet.sp).fx.repeat(Math.min(4, ses.combo - 2)), $('.fb-row .bit', foot)); }
  else { const b = $('#lsb'); b.classList.remove('shake2'); void b.offsetWidth; b.classList.add('shake2'); }
  const hb = $('.hrt'); if (hb) { hb.textContent = '❤️ ' + S.hearts; if (!ok) hb.classList.add('pop'); }
  const tp = $('.ls-top'); let cm = $('.combo', tp);
  if (ses.combo >= 3) {
    if (!cm) { cm = document.createElement('div'); cm.className = 'combo'; tp.insertBefore(cm, $('.hrt', tp)); }
    cm.textContent = '🔥' + ses.combo; cm.classList.remove('pop'); void cm.offsetWidth; cm.classList.add('pop');
  } else if (cm) cm.remove();
}
function next() {
  if (ses.mode === 'lesson' && S.hearts <= 0) return noHearts(true);
  ses.i++;
  if (ses.mode === 'placement') {
    if (ses.i % 3 === 0) {
      if (ses.stageRight >= 2) { ses.passed++; flat(ses.lang).filter(f => f.ui === ses.stage && !isDone(f.key)).forEach(f => { S.done[f.key] = { n: 1, s: 2, p: 1 }; }); addXP(15); save(); }
      if (ses.stageRight < 2 || ++ses.stage >= ses.max) return finishPlacement();
      ses.stageRight = 0; ses.queue.push(...placementQs(ses.lang, ses.stage));
    }
    return renderLesson();
  }
  if (ses.i >= ses.queue.length) return ses.mode === 'practice' ? finishPractice() : finishLesson();
  renderLesson();
}
function noHearts(fromLesson) {
  killOverlay('lesson'); ses = null; cur = null;
  const el = overlay('lesson');
  el.innerHTML = `<div class="ls-body center" style="justify-content:center">${bit(110, 'sad')}<h1>¡Te quedaste sin vidas!</h1><p class="muted">Practica para ganar una vida o espera ${fmtMs(nextHeartIn())} para la próxima.</p></div>
  <div class="ls-foot"><button class="btn primary big" id="p" style="margin-bottom:8px">Practicar · +1 ❤️</button><button class="btn big" id="x">Salir</button></div>`;
  $('#p').onclick = () => { killOverlay('lesson'); startPractice(); };
  $('#x').onclick = closeLesson; render();
}

/* --- finales --- */
let fresh = null;
function ring(pct, color, size = 64) {
  const r = 34, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 80 80" width="${size}" height="${size}"><circle cx="40" cy="40" r="${r}" fill="none" stroke="var(--line)" stroke-width="9"/><circle class="rg" cx="40" cy="40" r="${r}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-to="${c * (1 - pct / 100)}" transform="rotate(-90 40 40)"/><text x="40" y="46" text-anchor="middle" font-size="19" font-weight="800" fill="currentColor">${pct}%</text></svg>`;
}
function resultScreen(o) {
  const secs = Math.round((Date.now() - ses.start) / 1000), total = ses.right + ses.mistakes;
  const acc = total ? Math.round(ses.right / total * 100) : 100, el = overlay('lesson');
  const today = S.hist[dayStr()] || 0, goalNow = Math.min(100, today / S.goal * 100), goalFrom = Math.min(100, (o.goalBefore || 0) / S.goal * 100);
  el.innerHTML = `<div class="ls-body center res"><div class="res-bit">${bit(124, 'cheer')}</div><h1 class="pop-in">${o.title}</h1>
  ${o.stars ? `<div class="bigstars">${[0, 1, 2].map(i => `<span class="star ${i < o.stars ? 'on' : ''}" style="--d:${450 + i * 380}ms">★</span>`).join('')}</div>` : ''}
  <p class="muted">${o.sub || ''}</p>
  <div class="stats3"><div style="--d:250ms"><small>XP</small><b id="cx" style="color:var(--orange)">+0</b></div><div style="--d:400ms"><small>PRECISIÓN</small>${ring(acc, 'var(--green)', 52)}</div><div style="--d:550ms"><small>TIEMPO</small><b style="color:var(--blue)">${Math.floor(secs / 60)}:${pad(secs % 60)}</b></div></div>
  <div class="goalbox" style="--d:700ms"><b>Meta diaria · ${Math.min(today, S.goal)}/${S.goal} XP ${today >= S.goal ? '🎉' : ''}</b><div class="bar prog"><i id="gb" style="width:${goalFrom}%;background:var(--blue)"></i></div></div></div>
  <div class="ls-foot"><button class="btn primary big" id="done">Continuar</button></div>`;
  $('#done').onclick = closeLesson;
  countUp($('#cx', el), o.xp, 1000, v => '+' + v);
  setTimeout(() => { const g = $('#gb'); if (g) g.style.width = goalNow + '%'; $$('.rg', el).forEach(r => { r.style.strokeDashoffset = r.dataset.to; }); }, 80);
  if (o.stars) for (let i = 0; i < o.stars; i++) setTimeout(() => { beep([523 + i * 131], .16); buzz(12); }, 520 + i * 380);
  setTimeout(() => beep(SND.win, .13), 250); confetti();
}
function celebList(o) {
  const list = [];
  if (o.unit) list.push({ confetti: 1, snd: SND.level, cta: 'Genial', html: `<div class="rays"></div><div class="trophy">🏆</div><h1 class="pop-in">¡Unidad ${o.unit.ui + 1} completada!</h1><p class="muted">${esc(o.unit.u.title)}</p>` });
  if (level() > o.lv) list.push({ confetti: 1, snd: SND.level, cta: 'Seguir', html: `<div class="rays"></div><div class="res-bit">${bit(120, 'cheer')}</div><div class="bignum" style="color:var(--blue)">${level()}</div><h1 class="pop-in">¡Subiste de nivel!</h1><p class="muted">${TITLES[Math.min(TITLES.length - 1, Math.floor((level() - 1) / 2))]}</p>` });
  if (S.pet && petStage() > stageOf(o.lv)) list.push({ confetti: 1, snd: SND.level, cta: '¡Genial!', html: `<div class="rays"></div><h1 class="pop-in">¡${esc(S.pet.name)} está evolucionando!</h1><div class="evo"><div class="old">${CQ.pet.art(S.pet, 110, 'happy', stageOf(o.lv))}</div><div class="arrow">➜</div><div class="new">${CQ.pet.art(S.pet, 150, 'cheer', petStage())}</div></div><p><b>${CQ.pet.STAGES[stageOf(o.lv)]} → ${CQ.pet.STAGES[petStage()]} ✨</b></p><p class="muted">¡Mira cómo cambió!</p>` });
  if (o.first && streakNow() > 0) list.push({ snd: [523, 659, 784], cta: 'Continuar', after: el => countUp($('#sn', el), streakNow(), 900),
    html: `<div class="flame">🔥</div><div class="bignum" id="sn">0</div><h1>${streakNow() === 1 ? 'día de racha' : 'días de racha'}</h1><div class="weekrow">${last7().map(([d, l], i) => `<div class="wd ${S.hist[d] > 0 ? 'on' : ''}" style="--d:${300 + i * 90}ms"><i>${S.hist[d] > 0 ? '✓' : ''}</i>${l}</div>`).join('')}</div><p class="muted">Practica cada día para mantener la llama encendida.</p>` });
  return list;
}
function showCelebs(list, done) {
  const c = list.shift();
  if (!c) { if (done) done(); return; }
  const el = overlay('celeb');
  el.innerHTML = `<div class="ls-body center celeb">${c.html}</div><div class="ls-foot"><button class="btn primary big" id="cn">${c.cta || 'Continuar'}</button></div>`;
  if (c.after) c.after(el);
  beep(c.snd || SND.win, .12); if (c.confetti) confetti();
  $('#cn').onclick = () => { killOverlay('celeb'); showCelebs(list, done); };
}
function finishLesson() {
  const f = ses.f, lang = ses.lang;
  const unitBefore = f.u.lessons.every(l => isDone(`${lang}.${f.u.id}.${l.id}`));
  const lv = level(), first = S.last !== dayStr(), goalBefore = S.hist[dayStr()] || 0;
  const stars = ses.mistakes === 0 ? 3 : ses.mistakes <= 2 ? 2 : 1, prev = S.done[f.key];
  S.done[f.key] = { n: (prev ? prev.n : 0) + 1, s: Math.max(prev ? prev.s : 0, stars) };
  { const kd = kindOf(f, ses.lang), rw = kd === 'trophy' ? 40 : kd === 'chest' ? 25 : 0; if (!prev && rw) { S.coins += rw; if (kd === 'trophy') setTimeout(confetti, 600); setTimeout(() => toast(`${kd === 'chest' ? '🎁 ¡Cofre abierto!' : '🏆 ¡Unidad completada!'} +${rw} 🪙`), 1200); } }
  const bonus = ses.mistakes === 0 ? 15 : 10; addXP(bonus); ses.xp += bonus;
  if (!ses.mistakes) S.perfect++;
  qadd('lessons', 1);
  bumpStreak(); save();
  const unitNow = !unitBefore && f.u.lessons.every(l => isDone(`${lang}.${f.u.id}.${l.id}`));
  const nxt = flat(lang)[f.idx + 1];
  fresh = { done: f.key, next: nxt ? nxt.key : null, celebs: celebList({ unit: unitNow ? f : null, lv, first }) };
  resultScreen({ title: '¡Lección completada!', sub: esc(f.l.title), stars, xp: ses.xp, goalBefore });
  checkAch(); renderTop();
}
function finishPractice() {
  const lv = level(), first = S.last !== dayStr(), goalBefore = S.hist[dayStr()] || 0;
  S.practices++; gainHeart(); addXP(5); ses.xp += 5; bumpStreak(); save();
  fresh = { celebs: celebList({ lv, first }) };
  resultScreen({ title: '¡Práctica terminada!', sub: 'Ganaste una vida ❤️', xp: ses.xp, goalBefore });
  checkAch(); renderTop();
}
function finishPlacement() {
  const n = ses.passed, ui = Math.min(n, CQ.content[ses.lang].units.length - 1);
  const lv = level(), first = S.last !== dayStr(), goalBefore = Math.max(0, (S.hist[dayStr()] || 0) - n * 15);
  bumpStreak(); save();
  fresh = { celebs: celebList({ lv: lv, first }) };
  resultScreen({ title: n ? '¡Buen nivel!' : 'Empecemos desde el principio', sub: n ? `Saltaste ${n} unidad${n > 1 ? 'es' : ''}. Empiezas en la unidad ${ui + 1}: ${esc(CQ.content[ses.lang].units[ui].title)}.` : 'No pasa nada: así construyes bases sólidas.', xp: ses.xp + n * 15, goalBefore });
  checkAch(); renderTop();
}

/* --- renderizadores de ejercicios --- */
R.mc = (c, el) => {
  const x = c.x, tf = x.o.length === 2 && x.o[0] === 'Verdadero';
  const order = tf ? x.o.map((_, i) => i) : shuffle(x.o.map((_, i) => i)); let sel = null;
  el.innerHTML = (x.code ? codeBlock(x.code, c.lang) : '') + `<div class="opts">${order.map((oi, n) => `<button class="opt" data-n="${n}" style="--i:${n}"><span class="k">${n + 1}</span><span>${inl(x.o[oi])}</span></button>`).join('')}</div>`;
  const bs = $$('.opt', el);
  bs.forEach((b, n) => b.onclick = () => { if (c.locked) return; sel = n; beep(SND.tick, .04); bs.forEach(o => o.classList.remove('sel')); b.classList.add('sel'); c.update(); });
  c.get = () => sel;
  c.check = async () => ({ ok: order[sel] === x.a, show: inl(x.o[x.a]) });
  c.lock = () => { bs.forEach((b, n) => { b.disabled = true; if (order[n] === x.a) b.classList.add('right'); else if (n === sel) b.classList.add('wrong'); b.classList.remove('sel'); }); };
};
R.fill = (c, el) => {
  const x = c.x, i = x.code.indexOf('___'), ci = c.lang === 'sql' || c.lang === 'html', w = Math.max(...x.a.map(a => a.length)) + 2;
  el.innerHTML = `<pre class="code">${hl(x.code.slice(0, i), c.lang)}<input class="blank" style="width:${w}ch" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false">${hl(x.code.slice(i + 3), c.lang)}</pre>`;
  const inp = $('input', el); inp.oninput = c.update; setTimeout(() => inp.focus(), 60);
  c.get = () => inp.value.trim() || null;
  c.check = async () => ({ ok: x.a.some(a => normFill(a, ci) === normFill(inp.value, ci)), show: `<code>${esc(x.a[0])}</code>` });
  c.lock = ok => { inp.disabled = true; inp.classList.add(ok ? 'right' : 'wrong'); };
};
R.out = (c, el) => {
  const x = c.x, rows = Math.min(5, Math.max(1, x.a[0].split('\n').length));
  el.innerHTML = codeBlock(x.code, c.lang) + `<textarea class="ans" rows="${rows}" placeholder="Escribe lo que imprime…" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>`;
  const ta = $('textarea', el); ta.oninput = c.update;
  ta.onkeydown = e => { if (e.key === 'Enter' && rows === 1) { e.preventDefault(); const b = $('#chk'); if (b && !b.disabled) b.click(); } };
  c.get = () => ta.value.trim() || null;
  c.check = async () => ({ ok: x.a.some(a => normOut(a) === normOut(ta.value)), show: `<code>${esc(x.a[0]).replace(/\n/g, '<br>')}</code>` });
  c.lock = ok => { ta.readOnly = true; ta.classList.add(ok ? 'right' : 'wrong'); };
};
R.order = (c, el) => {
  const toks = c.x.t; let bank = shuffle(toks.map((_, i) => i)), ans = [];
  if (toks.length > 1 && bank.every((v, i) => toks[v] === toks[i])) bank.reverse();
  const draw = () => {
    el.innerHTML = `<div class="answer">${ans.map(i => `<button class="chipt" data-a="${i}">${esc(toks[i])}</button>`).join('')}</div><div class="bank">${bank.map(i => `<button class="chipt" data-b="${i}">${esc(toks[i])}</button>`).join('')}</div>`;
    if (!c.locked) {
      $$('[data-a]', el).forEach(b => b.onclick = () => { const i = +b.dataset.a; ans = ans.filter(v => v !== i); bank.push(i); draw(); });
      $$('[data-b]', el).forEach(b => b.onclick = () => { const i = +b.dataset.b; bank = bank.filter(v => v !== i); ans.push(i); draw(); });
    }
    c.update();
  };
  c.get = () => ans.length === toks.length ? ans : null;
  c.check = async () => ({ ok: ans.every((v, k) => toks[v] === toks[k]), show: `<code>${esc(toks.join(' '))}</code>` });
  c.lock = () => { draw(); };
  draw();
};
R.pair = (c, el) => {
  const P = c.x.pairs; let L = shuffle(P.map((_, i) => i)), Rr = shuffle(P.map((_, i) => i)), sl = null, sr = null, done = new Set(), wrong = 0;
  const draw = () => {
    el.innerHTML = `<div class="pairs"><div style="display:flex;flex-direction:column;gap:10px">${L.map(i => `<button data-l="${i}" class="${done.has(i) ? 'done' : ''} ${sl === i ? 'sel' : ''}">${inl(P[i][0])}</button>`).join('')}</div><div style="display:flex;flex-direction:column;gap:10px">${Rr.map(i => `<button data-r="${i}" class="${done.has(i) ? 'done' : ''} ${sr === i ? 'sel' : ''}">${inl(P[i][1])}</button>`).join('')}</div></div>`;
    $$('[data-l]', el).forEach(b => b.onclick = () => { sl = +b.dataset.l; tryMatch(); });
    $$('[data-r]', el).forEach(b => b.onclick = () => { sr = +b.dataset.r; tryMatch(); });
  };
  const tryMatch = () => {
    if (sl !== null && sr !== null) {
      if (sl === sr) { done.add(sl); beep([784], .08); } else {
        wrong++; beep([200], .1); const a = sl, b = sr; sl = sr = null; draw();
        $$(`[data-l="${a}"],[data-r="${b}"]`, el).forEach(e => e.classList.add('shake')); return;
      }
      sl = sr = null;
    }
    draw(); c.update();
    if (done.size === P.length) setTimeout(() => { if (!c.locked) onCheck(); }, 350);
  };
  c.get = () => done.size === P.length ? true : null;
  c.check = async () => ({ ok: wrong <= 2, show: '' });
  draw();
};
R.run = (c, el) => {
  const x = c.x, lang = c.lang, ta0 = x.starter, indent = lang === 'python' ? '    ' : '  ';
  const keys = lang === 'python' ? ['⇥', '(', ')', '[', ']', '{', '}', '"', "'", ':', '=', '_', ',', '.'] : ['⇥', '(', ')', '[', ']', '{', '}', '"', "'", '`', ';', '=', '>', ',', '.'];
  el.innerHTML = `<textarea class="editor" autocapitalize="off" autocorrect="off" spellcheck="false">${esc(ta0)}</textarea><div class="keys">${keys.map(k => `<button type="button">${esc(k)}</button>`).join('')}</div><div class="results" id="res"></div><button class="linkbtn" id="gu" hidden>Ver solución</button>`;
  const ta = $('textarea', el), resEl = $('#res', el), gu = $('#gu', el); let giveUp = false;
  const ins = t => { const s = ta.selectionStart, e = ta.selectionEnd; ta.setRangeText(t, s, e, 'end'); ta.focus(); c.update(); };
  $$('.keys button', el).forEach(b => b.onclick = () => ins(b.textContent === '⇥' ? indent : b.textContent));
  ta.oninput = c.update;
  ta.onkeydown = e => { if (e.key === 'Tab') { e.preventDefault(); ins(indent); } };
  gu.onclick = () => { giveUp = true; onCheck(); };
  c.get = () => ta.value.trim() !== ta0.trim() ? ta.value : null;
  c.check = async () => {
    if (giveUp) return { ok: false, show: codeBlock(x.sol, lang) };
    c.attempts++;
    resEl.innerHTML = `<div class="runmsg">${CQ.content[lang].runner === 'python' && !pyP ? 'Cargando Python (solo la primera vez, ~10 MB)…' : 'Ejecutando…'}</div>`;
    const r = await runCode(lang, ta.value, x.tests);
    if (r.noengine) {
      resEl.innerHTML = '<pre class="err">No se pudo cargar el motor de ejecución (¿sin conexión?).</pre><button class="linkbtn" id="sk">Omitir este ejercicio</button>';
      $('#sk', el).onclick = () => { c.locked = true; feedback({ skip: true }); };
      return { retry: true };
    }
    if (r.error) { resEl.innerHTML = `<pre class="err">${esc(r.error)}</pre>`; }
    else {
      const rows = r.res.map(t => ({ ...t, pass: !t.err && sameJSON(t.g, t.x) }));
      resEl.innerHTML = rows.map(t => `<div class="t ${t.pass ? 'ok' : 'no'}"><span>${t.pass ? '✓' : '✗'}</span><span>${esc(t.e)} ${t.pass ? '→ ' + esc(t.g) : t.err ? '→ ' + esc(t.err) : '→ ' + esc(t.g) + ' (esperado ' + esc(t.x) + ')'}</span></div>`).join('');
      if (rows.every(t => t.pass)) return { ok: true };
    }
    if (c.attempts >= 3) return { ok: false, show: codeBlock(x.sol, lang) };
    gu.hidden = false; resEl.insertAdjacentHTML('beforeend', `<div class="runmsg">Inténtalo de nuevo (${c.attempts}/3).</div>`);
    return { retry: true };
  };
  c.lock = () => { ta.readOnly = true; gu.hidden = true; };
};

/* ---------- teclado global ---------- */
document.addEventListener('keydown', e => {
  if (!ses || !$('#lesson')) return;
  if (e.key === 'Enter' && !e.shiftKey) {
    const t = e.target; if (t.tagName === 'TEXTAREA' && (t.classList.contains('editor') || t.rows > 1)) return;
    if (t.tagName === 'BUTTON' && !t.classList.contains('opt')) return;
    const b = $('#nxt') || ($('#chk') && !$('#chk').disabled ? $('#chk') : null) || $('#ig');
    if (b) { e.preventDefault(); b.click(); }
  } else if (/^[1-4]$/.test(e.key) && cur && cur.x && cur.x.k === 'mc' && !cur.locked && !/INPUT|TEXTAREA/.test(e.target.tagName)) {
    const o = $$('.opt')[+e.key - 1]; if (o) o.click();
  }
});

/* ---------- arranque ---------- */
function boot() {
  applyTheme(); splash();
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest && e.target.closest('.btn:not(:disabled)'); if (!b || RM) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement('span');
    s.className = 'ripple'; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s); setTimeout(() => s.remove(), 550);
  });
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) { navigator.serviceWorker.register('sw.js').catch(() => { /* sin SW */ }); navigator.serviceWorker.addEventListener('controllerchange', () => { if (!sessionStorage.cqr) { sessionStorage.cqr = 1; location.reload(); } }); }
  if (!S.lang || !CQ.content[S.lang]) { render(); if (!S.seen) openWelcome(); else openPicker(true); }
  else render();
  setInterval(() => { if (!$('#lesson') && S.hearts < MAXH) renderTop(); }, 30000);
  window.CodeQuest = { get S() { return S; }, CQ, EX, flat, startLesson, startPractice, startPlacement, render, renderLesson, get ses() { return ses; }, get cur() { return cur; } };
}
boot();
})();
