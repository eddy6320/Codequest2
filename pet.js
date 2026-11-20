/* CodeQuest · mascotas kawaii. Solo arte y catálogos (SVG); la lógica de cuidado está en app.js.
   Para añadir una especie: agrega una entrada a SPECIES y su dibujo a BODY. */
(window.CQ = window.CQ || { content: {}, roadmap: [] });
CQ.pet = (() => {
  const D = '#3b2b3f', PINK = '#ffc2d1';
  // [color principal, sombra]
  const COLORS = [['#ffb7d5', '#f58bb8'], ['#a8e6cf', '#6fcf9f'], ['#a5d8ff', '#6bb6f0'], ['#d7b8ff', '#b085f0'],
    ['#ffe08a', '#f5b94a'], ['#ffc4a3', '#f59a6b'], ['#8b5cf6', '#6d3fd8'], ['#ffffff', '#d9d9e8'], ['#ffa94d', '#f58a1f']];
  const COLOR_NAMES = ['Rosa', 'Menta', 'Cielo', 'Lila', 'Mantequilla', 'Durazno', 'Violeta Bit', 'Blanco', 'Naranja'];
  const SPECIES = [
    { id: 'gato', name: 'Michi', desc: 'Gatito curioso', col: 5, fx: '🐟' },
    { id: 'conejo', name: 'Bunny', desc: 'Conejito dulce', col: 0, fx: '🥕' },
    { id: 'dragon', name: 'Drako', desc: 'Dragoncito valiente', col: 1, fx: '🔥' },
    { id: 'pollito', name: 'Pío', desc: 'Pollito alegre', col: 4, fx: '🌻' },
    { id: 'panda', name: 'Mochi', desc: 'Pandita goloso', col: 7, fx: '🎋' },
    { id: 'zorro', name: 'Foxy', desc: 'Zorrito astuto', col: 8, fx: '🍁' },
    { id: 'bit', name: 'Bit', desc: 'Robot amigo', col: 6, fx: '⚡' }
  ];
  const STAGES = ['Cría', 'Joven', 'Adulta', 'Legendaria'];
  const SCALE = [0.72, 0.85, 0.94, 1];

  const bow = (x, y, c) => `<path d="M${x} ${y} l-11 -7 v14z M${x} ${y} l11 -7 v14z" fill="${c}"/><circle cx="${x}" cy="${y}" r="3.2" fill="#ff5c8a"/>`;
  // slot: head | face | neck. cost en monedas, lv = nivel mínimo
  const ITEMS = [
    { id: 'lazo', name: 'Lazo', slot: 'head', cost: 20, lv: 1, ic: '🎀', svg: () => bow(68, 31, '#ff8fab') },
    { id: 'fiesta', name: 'Gorro de fiesta', slot: 'head', cost: 30, lv: 2, ic: '🎉', svg: () => '<path d="M50 3 L37 31 H63z" fill="#ff7eb6"/><circle cx="46" cy="22" r="2.5" fill="#fff"/><circle cx="53" cy="15" r="2" fill="#ffd54f"/><circle cx="50" cy="3" r="4.5" fill="#ffd54f"/>' },
    { id: 'flor', name: 'Flor', slot: 'head', cost: 40, lv: 3, ic: '🌸', svg: () => '<g transform="translate(34 32)"><circle cx="0" cy="-5" r="4.5" fill="#ff8fab"/><circle cx="5" cy="-1" r="4.5" fill="#ff8fab"/><circle cx="3" cy="5" r="4.5" fill="#ff8fab"/><circle cx="-3" cy="5" r="4.5" fill="#ff8fab"/><circle cx="-5" cy="-1" r="4.5" fill="#ff8fab"/><circle r="3.5" fill="#ffd54f"/></g>' },
    { id: 'mago', name: 'Sombrero de mago', slot: 'head', cost: 80, lv: 5, ic: '🧙', svg: () => '<path d="M50 1 L33 31 H67z" fill="#7c5cd6"/><ellipse cx="50" cy="31" rx="21" ry="5" fill="#6747c4"/><path d="M50 12 l2 5 5 .5 -4 3.5 1.2 5 -4.2 -2.8 -4.2 2.8 1.2 -5 -4 -3.5 5 -.5z" fill="#ffd54f"/>' },
    { id: 'corona', name: 'Corona', slot: 'head', cost: 150, lv: 8, ic: '👑', svg: () => '<path d="M35 31 L37 13 L44 23 L50 9 L56 23 L63 13 L65 31z" fill="#ffd54f" stroke="#f5a623" stroke-width="2.5" stroke-linejoin="round"/><circle cx="50" cy="26" r="2.4" fill="#ff5c8a"/>' },
    { id: 'gafas', name: 'Gafas redondas', slot: 'face', cost: 40, lv: 2, ic: '👓', svg: y => `<g fill="rgba(255,255,255,.28)" stroke="${D}" stroke-width="2.4"><circle cx="36" cy="${y}" r="9"/><circle cx="64" cy="${y}" r="9"/></g><path d="M45 ${y} h10" stroke="${D}" stroke-width="2.4"/>` },
    { id: 'sol', name: 'Gafas de sol', slot: 'face', cost: 60, lv: 4, ic: '😎', svg: y => `<g fill="#2a2340"><rect x="25" y="${y - 7}" width="22" height="14" rx="6"/><rect x="53" y="${y - 7}" width="22" height="14" rx="6"/></g><path d="M47 ${y - 2} h6" stroke="#2a2340" stroke-width="2.4"/><path d="M29 ${y - 3} l6 -2 M57 ${y - 3} l6 -2" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>` },
    { id: 'estrella', name: 'Estrellita', slot: 'head', cost: 25, lv: 1, ic: '⭐', svg: () => '<path d="M68 24 l3 6.5 7 .8 -5.2 4.8 1.5 7 -6.3 -3.6 -6.3 3.6 1.5 -7 -5.2 -4.8 7 -.8z" fill="#ffd54f" stroke="#f5a623" stroke-width="1.5" stroke-linejoin="round"/>' },
    { id: 'audifonos', name: 'Audífonos', slot: 'head', cost: 90, lv: 6, ic: '🎧', svg: () => '<path d="M24 44 q26 -30 52 0" stroke="#4d4d5c" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="18" y="40" width="10" height="17" rx="5" fill="#ff5c8a"/><rect x="72" y="40" width="10" height="17" rx="5" fill="#ff5c8a"/>' },
    { id: 'gorra', name: 'Gorra', slot: 'head', cost: 45, lv: 2, ic: '🧢', svg: () => '<path d="M30 32 q20 -22 40 0z" fill="#4d7cff"/><path d="M62 31 q14 0 18 5 h-20z" fill="#2f5de0"/><circle cx="50" cy="16" r="2.4" fill="#2f5de0"/>' },
    { id: 'gorro', name: 'Gorro de lana', slot: 'head', cost: 55, lv: 3, ic: '🧶', svg: () => '<path d="M32 33 q2 -26 18 -26 q16 0 18 26z" fill="#ff7a59"/><rect x="30" y="29" width="40" height="7" rx="3.5" fill="#ffd0c2"/><circle cx="50" cy="6" r="5" fill="#ffd0c2"/>' },
    { id: 'orejitas', name: 'Diadema de orejitas', slot: 'head', cost: 65, lv: 4, ic: '🐰', svg: () => '<path d="M28 34 q22 -14 44 0" stroke="#ff8fab" stroke-width="4" fill="none"/><path d="M30 32 L27 12 L41 25z M70 32 L73 12 L59 25z" fill="#ff8fab"/>' },
    { id: 'bigote', name: 'Bigote', slot: 'face', cost: 35, lv: 3, ic: '🥸', svg: y => `<path d="M50 ${y + 9} q-6 -6 -15 -1 q5 6 15 1 q10 5 15 -1 q-9 -5 -15 1z" fill="#3b2b3f"/>` },
    { id: 'pecas', name: 'Pecas', slot: 'face', cost: 25, lv: 2, ic: '✨', svg: y => `<g fill="#c97a4a" opacity=".75"><circle cx="26" cy="${y + 8}" r="1.4"/><circle cx="31" cy="${y + 11}" r="1.4"/><circle cx="74" cy="${y + 8}" r="1.4"/><circle cx="69" cy="${y + 11}" r="1.4"/></g>` },
    { id: 'collar', name: 'Collar de perlas', slot: 'neck', cost: 60, lv: 4, ic: '📿', svg: () => '<g fill="#fff" stroke="#e3cdf5" stroke-width="1"><circle cx="30" cy="83" r="2.7"/><circle cx="37" cy="87.5" r="2.7"/><circle cx="45" cy="90" r="2.7"/><circle cx="55" cy="90" r="2.7"/><circle cx="63" cy="87.5" r="2.7"/><circle cx="70" cy="83" r="2.7"/></g>' },
    { id: 'medalla', name: 'Medalla de oro', slot: 'neck', cost: 90, lv: 6, ic: '🏅', svg: () => '<path d="M42 82 L50 94 L58 82" stroke="#e04a4a" stroke-width="3" fill="none"/><circle cx="50" cy="96" r="5" fill="#ffd54f" stroke="#f5a623" stroke-width="1.5"/>' },
    { id: 'camiseta', name: 'Camiseta a rayas', slot: 'body', cost: 50, lv: 2, ic: '👕', svg: (y, c) => `<g clip-path="url(#${c})"><rect x="8" y="68" width="84" height="34" fill="#4db6ff"/><path d="M8 74h84M8 82h84M8 90h84" stroke="#fff" stroke-width="3"/></g>` },
    { id: 'hoodie', name: 'Sudadera', slot: 'body', cost: 80, lv: 4, ic: '🧥', svg: (y, c) => `<g clip-path="url(#${c})"><rect x="8" y="66" width="84" height="36" fill="#8b5cf6"/><path d="M38 66 v10 M62 66 v10" stroke="#fff" stroke-width="2"/><rect x="33" y="82" width="34" height="11" rx="4" fill="#7547e0"/></g>` },
    { id: 'vestido', name: 'Vestido', slot: 'body', cost: 85, lv: 5, ic: '👗', svg: (y, c) => `<g clip-path="url(#${c})"><path d="M18 68 h64 l10 34 h-84z" fill="#ff8fab"/><g fill="#fff" opacity=".85"><circle cx="34" cy="80" r="2"/><circle cx="50" cy="87" r="2"/><circle cx="66" cy="80" r="2"/></g></g>` },
    { id: 'overol', name: 'Overol', slot: 'body', cost: 95, lv: 6, ic: '👖', svg: (y, c) => `<g clip-path="url(#${c})"><rect x="10" y="74" width="80" height="28" fill="#4a6fa5"/><path d="M34 74 v-9 M66 74 v-9" stroke="#4a6fa5" stroke-width="5"/><circle cx="34" cy="76" r="2" fill="#ffd54f"/><circle cx="66" cy="76" r="2" fill="#ffd54f"/><rect x="40" y="82" width="20" height="10" rx="3" fill="#3b5887"/></g>` },
    { id: 'capa', name: 'Capa de héroe', slot: 'back', cost: 70, lv: 6, ic: '🦸', svg: () => '<path d="M26 40 q-12 34 -7 58 h62 q5 -24 -7 -58z" fill="#e04a4a"/><path d="M26 40 q-12 34 -7 58 h8 q-4 -26 4 -58z" fill="#b83232" opacity=".5"/>' },
    { id: 'alas', name: 'Alas de ángel', slot: 'back', cost: 120, lv: 7, ic: '🪽', svg: () => '<path d="M20 50 q-26 -8 -15 22 q9 7 17 -4z M80 50 q26 -8 15 22 q-9 7 -17 -4z" fill="#fff" stroke="#e3cdf5" stroke-width="2"/>' },
    { id: 'mariposa', name: 'Alas de mariposa', slot: 'back', cost: 140, lv: 9, ic: '🦋', svg: () => '<path d="M22 48 q-26 -18 -17 10 q5 12 17 6z M78 48 q26 -18 17 10 q-5 12 -17 6z" fill="#c4a8ff"/><path d="M24 62 q-18 4 -10 18 q8 6 15 -4z M76 62 q18 4 10 18 q-8 6 -15 -4z" fill="#ff9ad5"/>' },
    { id: 'pajarita', name: 'Pajarita', slot: 'neck', cost: 30, lv: 1, ic: '🎩', svg: () => '<path d="M50 87 l-12 -6 v12z M50 87 l12 -6 v12z" fill="#ff6b6b"/><circle cx="50" cy="87" r="3.4" fill="#e04a4a"/>' },
    { id: 'bufanda', name: 'Bufanda', slot: 'neck', cost: 50, lv: 3, ic: '🧣', svg: () => '<path d="M27 82 q23 12 46 0 v8 q-23 12 -46 0z" fill="#4db6ff"/><path d="M62 88 v10 h9 v-11z" fill="#2f9be8"/><path d="M33 85 v4 M44 89 v4 M56 89 v4 M67 85 v4" stroke="#fff" stroke-width="2" opacity=".6"/>' }
  ];

  // ── 75 prendas generadas (forma × color) → 100 en total: 20 por segmento ──
  const K = { r: '#ef4444', o: '#fb923c', y: '#facc15', g: '#4ade80', t: '#2dd4bf', b: '#3b82f6', p: '#a855f7', k: '#ec4899', w: '#f8fafc', d: '#334155', s: '#cbd5e1' };
  const cnt = {}, SL_IC = { head: '🎩', face: '😎', neck: '🧣', body: '👕', back: '🪄' };
  const add = (slot, rows) => rows.forEach(([id, name, svg]) => { const k = cnt[slot] = (cnt[slot] || 0) + 1; ITEMS.push({ id, name, slot, cost: 20 + k * 6, lv: 1 + Math.floor(k * 9 / 17), ic: SL_IC[slot], svg }); });
  const clip = (c, b) => `<g clip-path="url(#${c})">${b}</g>`;
  const hrt = (x, y, z, f, o = 1) => `<path transform="translate(${x} ${y}) scale(${z})" d="M0 3 C-6 -3 -10 4 0 10 C10 4 6 -3 0 3z" fill="${f}" opacity="${o}"/>`;
  const str = (x, y, z, f, o = 1) => `<path transform="translate(${x} ${y}) scale(${z})" d="M0 -6 l1.8 4 4.4 .5 -3.3 3 1 4.4 -3.9 -2.3 -3.9 2.3 1 -4.4 -3.3 -3 4.4 -.5z" fill="${f}" opacity="${o}"/>`;
  const cap = c => () => `<path d="M30 32 q20 -22 40 0z" fill="${c}"/><path d="M62 31 q14 0 18 5 h-20z" fill="${c}" opacity=".8"/><circle cx="50" cy="16" r="2.4" fill="${c}"/>`;
  const beanie = c => () => `<path d="M32 33 q2 -26 18 -26 q16 0 18 26z" fill="${c}"/><rect x="30" y="29" width="40" height="7" rx="3.5" fill="#fff" opacity=".6"/><circle cx="50" cy="6" r="5" fill="#fff" opacity=".7"/>`;
  const topHat = c => () => `<rect x="36" y="8" width="28" height="22" rx="3" fill="${c}"/><rect x="28" y="28" width="44" height="6" rx="3" fill="${c}"/><rect x="36" y="22" width="28" height="4" fill="#fff" opacity=".5"/>`;
  const beret = c => () => `<ellipse cx="46" cy="26" rx="22" ry="9" fill="${c}"/><circle cx="46" cy="16" r="2.5" fill="${c}"/>`;
  const helmet = c => () => `<path d="M28 36 q0 -26 22 -26 q22 0 22 26z" fill="${c}"/><rect x="26" y="33" width="48" height="5" rx="2" fill="#fff" opacity=".5"/>`;
  const crownC = c => () => `<path d="M35 31 L37 13 L44 23 L50 9 L56 23 L63 13 L65 31z" fill="${c}" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linejoin="round"/>`;
  add('head', [['gorra-roja', 'Gorra roja', cap(K.r)], ['gorra-verde', 'Gorra verde', cap(K.g)], ['gorro-azul', 'Gorro azul', beanie(K.b)], ['gorro-morado', 'Gorro morado', beanie(K.p)], ['sombrero-copa', 'Sombrero de copa', topHat(K.d)], ['boina-rosa', 'Boina rosa', beret(K.k)], ['casco-amarillo', 'Casco amarillo', helmet(K.y)], ['lazo-azul', 'Lazo azul', () => bow(68, 31, K.b)], ['lazo-amarillo', 'Lazo amarillo', () => bow(68, 31, K.y)], ['corona-plata', 'Corona de plata', crownC(K.s)]]);
  const glR = c => y => `<g fill="rgba(255,255,255,.25)" stroke="${c}" stroke-width="2.6"><circle cx="36" cy="${y}" r="9"/><circle cx="64" cy="${y}" r="9"/></g><path d="M45 ${y} h10" stroke="${c}" stroke-width="2.6"/>`;
  const glS = c => y => `<g fill="rgba(255,255,255,.25)" stroke="${c}" stroke-width="2.6"><rect x="26" y="${y - 7}" width="20" height="14" rx="4"/><rect x="54" y="${y - 7}" width="20" height="14" rx="4"/></g><path d="M46 ${y} h8" stroke="${c}" stroke-width="2.6"/>`;
  add('face', [['gafas-rojas', 'Gafas rojas', glR(K.r)], ['gafas-doradas', 'Gafas doradas', glR(K.y)], ['gafas-verdes', 'Gafas verdes', glR(K.g)], ['gafas-negras', 'Gafas cuadradas', glS(K.d)], ['gafas-moradas', 'Gafas moradas', glS(K.p)],
    ['gafas-corazon', 'Gafas de corazón', y => hrt(36, y - 5.6, 1.7, K.k, .65) + hrt(64, y - 5.6, 1.7, K.k, .65)], ['gafas-estrella', 'Gafas de estrella', y => str(36, y, 2.3, K.y, .75) + str(64, y, 2.3, K.y, .75)],
    ['nariz-payaso', 'Nariz de payaso', y => `<circle cx="50" cy="${y + 8}" r="4.5" fill="${K.r}"/><circle cx="48.5" cy="${y + 6.5}" r="1.3" fill="#fff" opacity=".7"/>`], ['mejillas-rosas', 'Mejillas rosas', y => `<g fill="${K.k}" opacity=".7"><circle cx="24" cy="${y + 9}" r="5.5"/><circle cx="76" cy="${y + 9}" r="5.5"/></g>`],
    ['mejillas-azules', 'Mejillas frías', y => `<g fill="${K.b}" opacity=".55"><circle cx="24" cy="${y + 9}" r="5.5"/><circle cx="76" cy="${y + 9}" r="5.5"/></g>`], ['curita', 'Curita', y => `<rect x="58" y="${y + 3}" width="16" height="6" rx="3" fill="#ffd9b0" stroke="#e8b98a" transform="rotate(-20 66 ${y + 6})"/>`],
    ['monoculo', 'Monóculo', y => `<circle cx="64" cy="${y}" r="10" fill="rgba(255,255,255,.25)" stroke="${K.y}" stroke-width="2.6"/><path d="M72 ${y + 7} q8 10 4 22" stroke="${K.y}" stroke-width="1.8" fill="none"/>`],
    ['bigotes-gato', 'Bigotes de gato', y => `<path d="M14 ${y + 4} h12 M15 ${y + 10} l11 -2 M86 ${y + 4} h-12 M85 ${y + 10} l-11 -2" stroke="${K.d}" stroke-width="1.8" stroke-linecap="round"/>`], ['corazon-mejilla', 'Corazón en la mejilla', y => hrt(24, y + 5, .9, K.r)], ['estrella-mejilla', 'Estrella en la mejilla', y => str(24, y + 10, 1.1, K.y)],
    ['gafas-buceo', 'Gafas de buceo', y => glR('#06b6d4')(y) + `<path d="M18 ${y} h-4 M82 ${y} h4" stroke="#06b6d4" stroke-width="3"/>`]]);
  const bowT = c => () => `<path d="M50 87 l-12 -6 v12z M50 87 l12 -6 v12z" fill="${c}"/><circle cx="50" cy="87" r="3.4" fill="#000" opacity=".25"/>`;
  const scarf = c => () => `<path d="M27 82 q23 12 46 0 v8 q-23 12 -46 0z" fill="${c}"/><path d="M62 88 v10 h9 v-11z" fill="${c}"/><path d="M62 88 v10 h9 v-11z" fill="#000" opacity=".15"/>`;
  const tie = c => () => `<path d="M44 81 h12 v3 h-12z" fill="${c}"/><path d="M46 84 h8 l3 14 l-7 5 l-7 -5z" fill="${c}"/>`;
  const band = c => () => `<path d="M26 82 q24 14 48 0 l-24 20z" fill="${c}"/><g fill="#fff" opacity=".85"><circle cx="40" cy="89" r="1.6"/><circle cx="50" cy="94" r="1.6"/><circle cx="60" cy="89" r="1.6"/></g>`;
  const pearl = c => () => `<g fill="${c}" stroke="#fff" stroke-opacity=".6"><circle cx="30" cy="83" r="2.7"/><circle cx="37" cy="87.5" r="2.7"/><circle cx="45" cy="90" r="2.7"/><circle cx="55" cy="90" r="2.7"/><circle cx="63" cy="87.5" r="2.7"/><circle cx="70" cy="83" r="2.7"/></g>`;
  add('neck', [['bufanda-roja', 'Bufanda roja', scarf(K.r)], ['bufanda-verde', 'Bufanda verde', scarf(K.g)], ['bufanda-amarilla', 'Bufanda amarilla', scarf(K.y)], ['bufanda-morada', 'Bufanda morada', scarf(K.p)], ['pajarita-azul', 'Pajarita azul', bowT(K.b)], ['pajarita-verde', 'Pajarita verde', bowT(K.g)], ['pajarita-amarilla', 'Pajarita amarilla', bowT(K.y)], ['pajarita-morada', 'Pajarita morada', bowT(K.p)],
    ['corbata-roja', 'Corbata roja', tie(K.r)], ['corbata-azul', 'Corbata azul', tie(K.b)], ['corbata-negra', 'Corbata negra', tie(K.d)], ['bandana-roja', 'Bandana roja', band(K.r)], ['bandana-azul', 'Bandana azul', band(K.b)], ['perlas-rosas', 'Perlas rosas', pearl(K.k)], ['perlas-doradas', 'Perlas doradas', pearl(K.y)],
    ['cascabel', 'Collar con cascabel', () => '<path d="M28 83 q22 12 44 0" stroke="#ef4444" stroke-width="3" fill="none"/><circle cx="50" cy="93" r="5" fill="#ffd54f" stroke="#f5a623" stroke-width="1.5"/><path d="M47 95 h6" stroke="#f5a623"/>']]);
  const tee = c => (y, cl) => clip(cl, `<rect x="8" y="68" width="84" height="34" fill="${c}"/>`);
  const stripe = c => (y, cl) => clip(cl, `<rect x="8" y="68" width="84" height="34" fill="${c}"/><path d="M8 74h84M8 82h84M8 90h84" stroke="#fff" stroke-width="3"/>`);
  const hood = c => (y, cl) => clip(cl, `<rect x="8" y="66" width="84" height="36" fill="${c}"/><path d="M38 66 v10 M62 66 v10" stroke="#fff" stroke-width="2"/><rect x="33" y="82" width="34" height="11" rx="4" fill="#000" opacity=".15"/>`);
  const dress = c => (y, cl) => clip(cl, `<path d="M18 68 h64 l10 34 h-84z" fill="${c}"/><g fill="#fff" opacity=".85"><circle cx="34" cy="80" r="2"/><circle cx="50" cy="87" r="2"/><circle cx="66" cy="80" r="2"/></g>`);
  const overall = c => (y, cl) => clip(cl, `<rect x="10" y="74" width="80" height="28" fill="${c}"/><path d="M34 74 v-9 M66 74 v-9" stroke="${c}" stroke-width="5"/><circle cx="34" cy="76" r="2" fill="#ffd54f"/><circle cx="66" cy="76" r="2" fill="#ffd54f"/><rect x="40" y="82" width="20" height="10" rx="3" fill="#000" opacity=".15"/>`);
  const vest = c => (y, cl) => clip(cl, `<path d="M26 66 L50 80 L74 66 L82 102 H18z" fill="${c}"/><path d="M50 80 v22" stroke="#fff" stroke-width="2" opacity=".7"/>`);
  add('body', [['camiseta-roja', 'Camiseta roja', tee(K.r)], ['camiseta-verde', 'Camiseta verde', tee(K.g)], ['camiseta-amarilla', 'Camiseta amarilla', tee(K.y)], ['camiseta-morada', 'Camiseta morada', tee(K.p)], ['rayas-rojas', 'Rayas rojas', stripe(K.r)], ['rayas-verdes', 'Rayas verdes', stripe(K.g)], ['rayas-moradas', 'Rayas moradas', stripe(K.p)],
    ['sudadera-roja', 'Sudadera roja', hood(K.r)], ['sudadera-verde', 'Sudadera verde', hood(K.g)], ['sudadera-negra', 'Sudadera negra', hood(K.d)], ['vestido-azul', 'Vestido azul', dress(K.b)], ['vestido-amarillo', 'Vestido amarillo', dress(K.y)], ['vestido-morado', 'Vestido morado', dress(K.p)], ['overol-rojo', 'Overol rojo', overall(K.r)], ['overol-verde', 'Overol verde', overall(K.g)], ['chaleco-naranja', 'Chaleco naranja', vest(K.o)]]);
  const cape = c => () => `<path d="M26 40 q-12 34 -7 58 h62 q5 -24 -7 -58z" fill="${c}"/><path d="M26 40 q-12 34 -7 58 h8 q-4 -26 4 -58z" fill="#000" opacity=".15"/>`;
  const aura = c => () => `<circle cx="50" cy="58" r="47" fill="${c}" opacity=".28"/><circle cx="50" cy="58" r="38" fill="${c}" opacity=".22"/>`;
  add('back', [['capa-azul', 'Capa azul', cape(K.b)], ['capa-verde', 'Capa verde', cape(K.g)], ['capa-morada', 'Capa morada', cape(K.p)], ['capa-dorada', 'Capa dorada', cape(K.y)],
    ['alas-murcielago', 'Alas de murciélago', () => '<path d="M20 50 q-24 -14 -16 12 l7 -4 5 6 5 -6 5 4z M80 50 q24 -14 16 12 l-7 -4 -5 6 -5 -6 -5 4z" fill="#475569"/>'], ['alas-hada', 'Alas de hada', () => '<path d="M20 52 q-22 -18 -12 6 q6 8 14 2z M80 52 q22 -18 12 6 q-6 8 -14 2z" fill="#a5f3fc" opacity=".8" stroke="#67e8f9"/>'], ['alas-dragon', 'Alas de dragón', () => '<path d="M20 48 q-26 -16 -18 14 l8 -3 4 7 5 -7 6 2z M80 48 q26 -16 18 14 l-8 -3 -4 7 -5 -7 -6 2z" fill="#dc2626"/>'],
    ['aura-fuego', 'Aura de fuego', aura(K.r)], ['aura-hielo', 'Aura de hielo', aura(K.b)], ['aura-dorada', 'Aura dorada', aura(K.y)], ['aura-bosque', 'Aura del bosque', aura(K.g)], ['aura-mistica', 'Aura mística', aura(K.p)], ['aura-rosa', 'Aura rosa', aura(K.k)],
    ['luna', 'Luna creciente', () => '<path d="M82 14 a15 15 0 1 0 8 28 a12 12 0 1 1 -8 -28z" fill="#fde68a"/>'], ['sol-radiante', 'Sol radiante', () => '<g stroke="#fbbf24" stroke-width="3" stroke-linecap="round"><path d="M50 4v8M50 104v-8M0 54h8M92 54h8M14 18l6 6M86 90l-6 -6M86 18l-6 6M14 90l6 -6"/></g><circle cx="50" cy="54" r="40" fill="#fde68a" opacity=".5"/>'],
    ['nube', 'Nube', () => '<g fill="#e0f2fe"><ellipse cx="28" cy="40" rx="16" ry="9"/><ellipse cx="72" cy="40" rx="16" ry="9"/><ellipse cx="50" cy="32" rx="18" ry="11"/></g>'],
    ['arcoiris', 'Arcoíris', () => ['#ef4444', '#fb923c', '#facc15', '#4ade80', '#3b82f6'].map((c, i) => `<path d="M${6 + i * 4} 62 a${44 - i * 4} ${44 - i * 4} 0 0 1 ${88 - i * 8} 0" stroke="${c}" stroke-width="4" fill="none"/>`).join('')]]);
  /* ── Diseño de personaje: cabeza grande, cuerpo pequeño, brazos, patas, orejas y cola ──
     Lienzo 100×100. Cabeza: elipse (50,42) 34×27 · Cuerpo: elipse (50,80) 18×13.5 · Pies a y≈92.
     Las prendas se dibujan en un espacio "antiguo" y se reubican con transformaciones (HEADT/NECKT/BODYT…). */
  const DEFS = '<defs><radialGradient id="pgl" cx=".32" cy=".27" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient><radialGradient id="pgs" cx=".5" cy=".45" r=".62"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></radialGradient>'
    + '<clipPath id="pbc"><ellipse transform="translate(50 85) scale(2.174 1.389) translate(-50 -80)" cx="50" cy="80" rx="19" ry="14.5"/></clipPath></defs>';
  const HEADT = 'translate(50 15) scale(.92) translate(-50 -28)', NECKT = 'translate(50 69) scale(.72) translate(-50 -86)', BODYT = 'translate(50 80) scale(.46 .72) translate(-50 -85)';
  const backT = id => /^capa/.test(id) ? 'translate(50 96) scale(.8 .72) translate(-50 -96)' : /^(alas|mariposa)/.test(id) ? 'translate(50 70) scale(.8) translate(-50 -60)' : id === 'nube' ? 'translate(0 -14)' : 'translate(0 -8)';
  const preview = it => art({ sp: 'gato', col: 5, eq: { [it.slot]: it.id } }, 58, 'happy', 2, { head: '10 0 80 80', face: '14 14 72 72', neck: '22 40 56 56', body: '20 52 60 60', back: '0 0 100 100' }[it.slot]);

  const sparkle = (x, y, k = 1) => `<path class="tw" d="M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6z" fill="#ffd54f" transform="translate(${x} ${y}) scale(${k})"/>`;
  const mixc = (a, b, k) => { const n = x => x.length === 4 ? '#' + [...x.slice(1)].map(c => c + c).join('') : x, h = x => [1, 3, 5].map(i => parseInt(n(x).slice(i, i + 2), 16)), A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const IR = { gato: '#fbbf24', conejo: '#f472b6', dragon: '#34d399', pollito: '#38bdf8', zorro: '#facc15', panda: '#7dd3fc' };
  const eyeP = (x, y, sp) => `<ellipse cx="${x}" cy="${y}" rx="7.8" ry="8.9" fill="#2b1b2e"/><ellipse cx="${x}" cy="${y + 4}" rx="5.4" ry="3.3" fill="${IR[sp]}" opacity=".6"/><circle cx="${x - 2.7}" cy="${y - 3.2}" r="3.5" fill="#fff"/><circle cx="${x + 3}" cy="${y + 2.6}" r="1.7" fill="#fff"/>`;
  const crestOf = P => `<path d="M50 17 q-7 -4 -4 -10 q5 -3 7 2 q4 -3 5 2 q1 5 -8 6z" fill="${mixc(P.c, '#fff', .3)}" stroke="${P.dk}" stroke-width=".5" stroke-opacity=".5" stroke-linejoin="round"/>`;
  function face(mood, o) {
    const y = o.y;
    const eyes = mood === 'sleep'
      ? `<path d="M29 ${y + 1} q7 7 14 0 M57 ${y + 1} q7 7 14 0" stroke="${o.e}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
      : mood === 'love'
      ? [36, 64].map(x => `<path transform="translate(${x} ${y - 6}) scale(1.25)" d="M0 3 C-6 -3 -10 4 0 10 C10 4 6 -3 0 3z" fill="#ff4d7e"/><circle cx="${x - 3}" cy="${y - 2}" r="1.8" fill="#fff" opacity=".85"/>`).join('')
      : mood === 'dead'
      ? `<path d="M30 ${y - 4} l12 10 M42 ${y - 4} l-12 10 M58 ${y - 4} l12 10 M70 ${y - 4} l-12 10" stroke="${o.e}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
      : mood === 'cheer'
      ? `<path d="M30 ${y + 2} q6 -9 12 0 M58 ${y + 2} q6 -9 12 0" stroke="${o.e}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
      : [36, 64].map(x => (o.sp ? eyeP(x, y, o.sp) : `<circle cx="${x}" cy="${y}" r="6.4" fill="${o.e}"/><circle cx="${x - 2.1}" cy="${y - 2.2}" r="2.4" fill="${o.h}"/><circle cx="${x + 2}" cy="${y + 2}" r="1.2" fill="${o.h}"/>`)).join('')
        + (mood === 'sad' ? '<path d="M71 ' + (y + 7) + ' q4 7 0 10 q-4 -3 0 -10z" fill="#6bc4ff"/>' : '');
    const my = o.my, L = o.l;
    const mouth = { sleep: `<ellipse cx="50" cy="${my + 2}" rx="2.2" ry="2.8" fill="#8b2d4a" opacity=".8"/>`, eat: `<ellipse cx="50" cy="${my + 4}" rx="7" ry="8" fill="#8b2d4a"/><ellipse cx="50" cy="${my + 9}" rx="4" ry="2.6" fill="#ff8fab"/>`, dead: `<path d="M45 ${my + 2} q2.5 -3 5 0 q2.5 3 5 0" fill="none" stroke="${L}" stroke-width="2.4" stroke-linecap="round"/>`, happy: `<path d="M45.4 ${my} q2.300 3.800 4.600 0 q2.300 3.800 4.600 0" fill="none" stroke="${L}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
      cheer: `<path d="M45 ${my - 1} q5 9 10 0z" fill="#ff6f91" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>`,
      sad: `<path d="M46 ${my + 3} q4 -5 8 0" fill="none" stroke="${L}" stroke-width="2.6" stroke-linecap="round"/>`,
      think: `<path d="M45 ${my + 1} h10" stroke="${L}" stroke-width="2.6" stroke-linecap="round"/>` }[mood === 'love' ? 'cheer' : mood] || '';
    const blush = `<ellipse cx="${o.bx}" cy="${y + 9}" rx="7.2" ry="4.4" fill="#ff7fa6" opacity=".72"/><ellipse cx="${100 - o.bx}" cy="${y + 9}" rx="7.2" ry="4.4" fill="#ff7fa6" opacity=".72"/>`;
    const glow = o.glow ? [36, 64].map(x => `<circle cx="${x}" cy="${y}" r="12" fill="${IR[o.sp]}" opacity=".3"/>`).join('') : '';
    return `${glow}<g class="eyes">${eyes}</g>${o.nomouth ? '' : mouth}${blush}`;
  }
  // brazos: cuelgan a los lados, se levantan al celebrar
  const arms = (mood, fill, tip) => {
    const a = mood === 'cheer' ? 128 : mood === 'sad' ? 5 : mood === 'dead' ? 2 : 16;
    const one = (x, k) => `<g transform="translate(${x} 73) rotate(${k * a})"><ellipse cx="0" cy="7.5" rx="5.6" ry="9.5" fill="${fill}"/><ellipse cx="-1.6" cy="4" rx="1.8" ry="3.4" fill="#fff" opacity=".35"/>${tip ? `<ellipse cx="0" cy="14.5" rx="4.5" ry="3.3" fill="${tip}"/>` : ''}</g>`;
    return one(32, 1) + one(68, -1);
  };
  const tailStroke = (d, P, w = 7.5, col) => `<path d="${d}" stroke="${P.dk}" stroke-width="${w + 2.6}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${col || P.c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;

  /* Cada especie devuelve: behind (cola, orejas, alas: detrás), head (marcas sobre la cabeza), front (nariz, bigotes…),
     limb/tip/foot (colores de brazos, punta y pies), pad (almohadillas), belly, nomouth. */
  const BODY = {
    gato: P => ({
      behind: tailStroke('M63 88 C84 94 96 74 85 56', P, 8) + `<circle cx="85" cy="57" r="5" fill="${mixc(P.c, '#fff', .55)}"/>` + `<path d="M82 84 q5 -2 7 -8 M89 70 q-4 0 -7 -3" stroke="${P.dk}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`
        + `<path d="M18 38 Q10 14 20 10 Q35 9 44 22z M82 38 Q90 14 80 10 Q65 9 56 22z" fill="${P.g}" stroke="${P.c}" stroke-width="3" stroke-linejoin="round"/><path d="M22 31 Q18 18 22 16 Q31 16 37 24z M78 31 Q82 18 78 16 Q69 16 63 24z" fill="${PINK}"/>`
        + `<ellipse cx="17" cy="53" rx="8" ry="5.5" fill="${P.g}"/><ellipse cx="83" cy="53" rx="8" ry="5.5" fill="${P.g}"/>`,
      head: `<ellipse cx="50" cy="55" rx="13.5" ry="9" fill="#fff" opacity=".5"/>`,
      front: `<path d="M47 51 h6 l-3 3.4z" fill="#ff8fab"/><path d="M17 52 h11 M18 58 l10 -2 M83 52 h-11 M82 58 l-10 -2" stroke="${D}" stroke-width="1.5" stroke-linecap="round" opacity=".3"/>`,
      tip: mixc(P.c, '#fff', .45), pad: PINK }),
    conejo: P => ({
      behind: `<circle cx="69" cy="88" r="7.5" fill="#fff" stroke="#e8e8f4" stroke-width="1.2"/><circle cx="67" cy="86" r="2.6" fill="#fff"/>`
        + (a => `<g transform="rotate(${-a} 38 26)"><ellipse cx="36" cy="14" rx="8.6" ry="14.5" fill="${P.g}"/><ellipse cx="36" cy="15" rx="4.4" ry="9.5" fill="${PINK}"/></g><g transform="rotate(${a} 62 26)"><ellipse cx="64" cy="14" rx="8.6" ry="14.5" fill="${P.g}"/><ellipse cx="64" cy="15" rx="4.4" ry="9.5" fill="${PINK}"/></g>`)(P.mood === 'sad' ? 34 : P.mood === 'dead' ? 42 : P.mood === 'cheer' ? 6 : 14),
      head: '<ellipse cx="50" cy="55" rx="13" ry="8.8" fill="#fff" opacity=".72"/>',
      front: '<path d="M47 50.5 q3 -2 6 0 q-1 3.5 -3 4 q-2 -.5 -3 -4z" fill="#ff8fab"/>' + (P.mood === 'eat' ? '' : '<rect x="47.4" y="58.4" width="2.6" height="4.2" rx="1" fill="#fff" stroke="#d9d9e8" stroke-width=".6"/><rect x="50" y="58.4" width="2.6" height="4.2" rx="1" fill="#fff" stroke="#d9d9e8" stroke-width=".6"/>'),
      tip: '#fff', pad: PINK }),
    dragon: P => ({
      behind: tailStroke('M63 88 C86 94 98 82 91 68', P, 8) + `<circle cx="91" cy="62" r="5.5" fill="#ffe08a" stroke="${P.dk}" stroke-width="1"/><path d="M80 90 l2 -5 l2 5z M88 84 l3 -4 l1 5z" fill="#ffd54f" opacity=".9"/>`
        + `<path d="M32 70 Q8 56 6 74 Q12 72 15 78 Q19 74 25 80z M68 70 Q92 56 94 74 Q88 72 85 78 Q81 74 75 80z" fill="${P.s}" stroke="${P.dk}" stroke-width="1" stroke-linejoin="round" opacity=".95"/>`
        + `<ellipse cx="12" cy="46" rx="9" ry="6.5" fill="${P.s}" transform="rotate(-18 12 46)"/><ellipse cx="88" cy="46" rx="9" ry="6.5" fill="${P.s}" transform="rotate(18 88 46)"/>`
        + `<path d="M29 25 Q22 9 31 8 Q40 9 43 19z M71 25 Q78 9 69 8 Q60 9 57 19z" fill="#ffe08a" stroke="#f5b94a" stroke-width="2" stroke-linejoin="round"/>`,
      head: crestOf(P) + '<ellipse cx="50" cy="55" rx="13.5" ry="9" fill="#fff2b3" opacity=".8"/>',
      front: `<circle cx="45.6" cy="51.5" r="1.5" fill="${D}" opacity=".55"/><circle cx="54.4" cy="51.5" r="1.5" fill="${D}" opacity=".55"/>` + (P.mood === 'happy' || P.mood === 'think' ? '<path d="M53.5 58 l1.8 3.4 1.8 -3.4z" fill="#fff"/>' : ''),
      belly: '#fff2b3', beta: `<path d="M41 74 h18 M42 79 h16 M43 84 h14" stroke="#e8c96b" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>`, tip: '#fff2b3' }),
    pollito: P => ({
      behind: `<path d="M64 86 q14 -9 21 -2 q-7 0 -9 4 q6 0 9 6 q-14 2 -21 -8z" fill="${P.s}"/>`,
      head: `<path d="M50 18 q-5 -13 -14 -12 M50 18 v-14 M50 18 q5 -13 14 -12" stroke="${P.s}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      front: P.mood === 'eat'
        ? '<path d="M43 50 q7 -4.5 14 0 q-7 3.5 -14 0z" fill="#ffa43c"/><path d="M44 55 q6 8 12 0 q-6 -2 -12 0z" fill="#f08a1a"/><path d="M44.5 52.5 q5.5 3 11 0 q-5.500 3.800 -11 0z" fill="#8b2d4a"/>'
        : '<path d="M42.500 51 q7.500 -5 15 0 q-7.500 10.500 -15 0z" fill="#ffa43c"/><path d="M46 50.500 q4 -2.200 8 0" stroke="#fff" stroke-opacity=".6" stroke-width="1.400" fill="none" stroke-linecap="round"/>',
      limb: P.s, foot: '#ffa43c', nomouth: 1 }),
    panda: P => ({
      behind: `<circle cx="23" cy="21" r="10.5" fill="${D}"/><circle cx="77" cy="21" r="10.5" fill="${D}"/><circle cx="24" cy="20" r="5" fill="#6b5470"/><circle cx="76" cy="20" r="5" fill="#6b5470"/><circle cx="68" cy="88" r="6" fill="${P.g}"/>`,
      head: `<ellipse cx="35" cy="48" rx="10.5" ry="12.5" fill="${D}" transform="rotate(-18 35 48)"/><ellipse cx="65" cy="48" rx="10.5" ry="12.5" fill="${D}" transform="rotate(18 65 48)"/>`,
      front: `<ellipse cx="50" cy="51.500" rx="4.200" ry="3" fill="${D}"/><ellipse cx="48.800" cy="50.500" rx="1.400" ry=".8" fill="#fff" opacity=".6"/>`,
      limb: D, foot: D }),
    zorro: P => ({
      behind: `<path d="M63 90 C88 98 100 76 90 50 C80 60 74 68 62 80z" fill="${P.g}" stroke="${P.c}" stroke-width="1.5" stroke-linejoin="round"/><path d="M90 50 C97 56 99 64 96 70 C90 67 85 63 82 61 C86 58 88 54 90 50z" fill="#fff"/>`
        + `<path d="M18 38 Q12 12 22 8 Q36 8 44 21z M82 38 Q88 12 78 8 Q64 8 56 21z" fill="${P.g}" stroke="${P.c}" stroke-width="3" stroke-linejoin="round"/><path d="M23 31 Q20 17 24 15 Q32 16 37 23z M77 31 Q80 17 76 15 Q68 16 63 23z" fill="${D}" opacity=".8"/>`
        + `<ellipse cx="16" cy="53" rx="9" ry="6" fill="#fff"/><ellipse cx="84" cy="53" rx="9" ry="6" fill="#fff"/>`,
      head: crestOf(P) + '<path d="M16 52 Q28 48 42 53 Q50 57 58 53 Q72 48 84 52 Q74 69 50 69 Q26 69 16 52z" fill="#fff" opacity=".92"/>',
      front: `<ellipse cx="50" cy="51.500" rx="3.400" ry="2.500" fill="${D}"/><ellipse cx="49" cy="50.700" rx="1.100" ry=".7" fill="#fff" opacity=".6"/>`,
      tip: D, foot: D })
  };

  /* p = { sp, col, eq:{head,face,neck,body,back} } · mood: happy|cheer|sad|think|eat|dead · stage 0..3 · vb: viewBox opcional (recorte) */
  function art(p, size = 96, mood = 'happy', stage = 1, vb) {
    p = p || { sp: 'bit', col: 6 };
    const [c, s] = COLORS[p.col] || COLORS[6], eq = p.eq || {}, bitMode = p.sp === 'bit', ey = bitMode ? 43 : 47;
    const item = sl => eq[sl] && ITEMS.find(i => i.id === eq[sl]);
    const wear = (sl, T) => { const it = item(sl); return it ? `<g transform="${T}">${it.svg(ey, 'pbc')}</g>` : ''; };
    const bk = item('back'), wearBack = bk ? `<g transform="${backT(bk.id)}">${bk.svg(ey, 'pbc')}</g>` : '';
    let g, extra = '';
    const dk = mixc(s, '#000', .12), bodyShade = '<ellipse cx="50" cy="71.500" rx="15" ry="3" fill="#000" opacity=".07"/>';
    const headFx = '<ellipse cx="50" cy="42" rx="34" ry="27" fill="url(#pgs)"/><ellipse cx="50" cy="42" rx="34" ry="27" fill="url(#pgl)"/><path d="M50 69 Q16 62 16 46 Q20 62 50 66 Q80 62 84 46 Q84 62 50 69z" fill="#000" opacity=".05"/><path d="M20 38 q3 -17 23 -20" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none" stroke-linecap="round"/>';
    if (bitMode) {
      g = `${wearBack}<g class="ant"><line x1="50" y1="16" x2="50" y2="7" stroke="${s}" stroke-width="4.500" stroke-linecap="round"/><circle cx="50" cy="6" r="5.500" fill="#ffd54f"/><circle cx="48.500" cy="4.500" r="1.800" fill="#fff" opacity=".8"/></g>
        <rect x="8" y="35" width="10" height="19" rx="5" fill="${s}"/><rect x="82" y="35" width="10" height="19" rx="5" fill="${s}"/>
        <ellipse cx="39" cy="92" rx="10" ry="5.500" fill="${s}"/><ellipse cx="61" cy="92" rx="10" ry="5.500" fill="${s}"/>
        <rect x="32" y="66" width="36" height="28" rx="13" fill="${c}"/><rect x="32" y="80" width="36" height="14" rx="9" fill="${s}" opacity=".4"/>${wear('body', BODYT)}
        <rect x="32" y="66" width="36" height="28" rx="13" fill="url(#pgs)"/><rect x="32" y="66" width="36" height="28" rx="13" fill="url(#pgl)"/>
        <rect x="42" y="74" width="16" height="11" rx="4" fill="#2a2340"/><circle cx="47" cy="79.500" r="2.200" fill="#7cffb2"/><rect x="52" y="78" width="4" height="3" rx="1.200" fill="#ff8fab"/>${bodyShade}
        ${arms(mood, s, c)}
        <rect x="16" y="15" width="68" height="54" rx="23" fill="${c}"/><rect x="16" y="15" width="68" height="54" rx="23" fill="url(#pgs)"/><rect x="16" y="15" width="68" height="54" rx="23" fill="url(#pgl)"/><path d="M22 36 q3 -14 18 -16" stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none" stroke-linecap="round"/>
        <rect x="24" y="24" width="52" height="38" rx="15" fill="#2a2340"/><path d="M29 33 q3 -6 12 -7" stroke="#fff" stroke-opacity=".18" stroke-width="3" fill="none" stroke-linecap="round"/>${face(mood, { y: ey, my: 54, l: '#7cffb2', e: '#7cffb2', h: '#fff', bx: 30 })}`;
    } else {
      const gid = 'pb' + p.col, ir = IR[p.sp], P = { c, s, dk, g: `url(#${gid})`, mood };
      extra = `<radialGradient id="${gid}" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="${mixc(c, '#fff', .5)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${mixc(s, '#000', .12)}"/></radialGradient>` + (ir ? `<radialGradient id="ir${p.sp}" cx=".5" cy=".35" r=".85"><stop offset="0" stop-color="${mixc(ir, '#fff', .55)}"/><stop offset=".6" stop-color="${ir}"/><stop offset="1" stop-color="${mixc(ir, '#000', .4)}"/></radialGradient>` : '');
      const B = (BODY[p.sp] || BODY.gato)(P), foot = B.foot || P.g, belly = B.belly || '#fff', pad = B.pad ? [39, 61].map(x => `<ellipse cx="${x}" cy="93.500" rx="4.200" ry="2.600" fill="${B.pad}"/>`).join('') : '';
      g = `${wearBack}${B.behind || ''}<ellipse cx="39" cy="91.500" rx="10" ry="5.800" fill="${foot}"/><ellipse cx="61" cy="91.500" rx="10" ry="5.800" fill="${foot}"/>${pad}
        <ellipse cx="50" cy="80" rx="18" ry="13.500" fill="${P.g}" stroke="${c}" stroke-width="1.500"/><ellipse cx="50" cy="82" rx="11.500" ry="9" fill="${belly}" opacity=".6"/>${B.beta || ''}${wear('body', BODYT)}
        <ellipse cx="50" cy="80" rx="18" ry="13.500" fill="url(#pgs)"/><ellipse cx="50" cy="80" rx="18" ry="13.500" fill="url(#pgl)"/>${bodyShade}
        ${arms(mood, B.limb || P.g, B.tip)}
        <ellipse cx="50" cy="42" rx="34" ry="27" fill="${P.g}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>${headFx}${B.head || ''}
        ${face(mood, { y: ey, my: 57.5, l: D, e: D, h: '#fff', bx: 25, nomouth: B.nomouth, sp: IR[p.sp] ? p.sp : '', glow: false })}<g transform="translate(0 1.800)">${B.front || ''}</g>`;
    }
    /* Evolución visible: cada etapa agrega algo propio (se oculta si el jugador ya usa una prenda en ese lugar) */
    const wg = (pri, sec) => `<path d="M30 64 q-${pri} -${pri * .75} -${pri * .55} ${pri * .3} q${pri * .25} ${pri * .6} ${pri * .85} ${pri * .3}z M70 64 q${pri} -${pri * .75} ${pri * .55} ${pri * .3} q-${pri * .25} ${pri * .6} -${pri * .85} ${pri * .3}z" fill="${sec}" stroke="#e3cdf5" stroke-width="1.6" stroke-linejoin="round"/>`;
    let wings = '';
    if (!eq.back && stage === 2) wings = `<g class="evw">${wg(20, '#fff')}</g>`;
    if (!eq.back && stage >= 3) wings = `<g class="evw">${wg(30, '#ffd6ec')}${wg(22, '#fff')}</g>`;
    if (wings) g = wings + g;
    const shell = (!eq.head && stage === 0) ? '<path d="M29 25 L35 19 L41 26 L47 19 L53 26 L59 19 L65 26 L71 25 Q50 -3 29 25z" fill="#fff8e7" stroke="#e8d9b5" stroke-width="1.4" stroke-linejoin="round"/><path d="M38 14 q6 -4 12 -4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>' : '';
    const bandana = (!eq.neck && stage >= 1) ? `<path d="M31 67 Q50 76 69 67 L50 87z" fill="${stage >= 3 ? '#ffd54f' : '#ff8fab'}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/><circle cx="43" cy="74" r="1.3" fill="#fff"/><circle cx="57" cy="74" r="1.3" fill="#fff"/><circle cx="50" cy="80" r="1.3" fill="#fff"/>` : '';
    const crownS3 = (!eq.head && stage >= 3 && mood !== 'dead') ? '<path d="M38 20 L40 9 L45 15 L50 6 L55 15 L60 9 L62 20z" fill="#ffd54f" stroke="#f5a623" stroke-width="1.6" stroke-linejoin="round"/><circle cx="50" cy="15" r="2" fill="#ff5c8a"/>' : '';
    const worn = bandana + shell + crownS3 + wear('neck', NECKT) + wear('face', 'translate(0 0)') + wear('head', HEADT), k = SCALE[stage] || 1;
    const halo = (stage === 2 && mood !== 'dead') ? '<ellipse cx="50" cy="5" rx="14" ry="3.6" fill="none" stroke="#ffe27a" stroke-width="2.6" opacity=".9"/>' : mood === 'dead' ? '<ellipse cx="50" cy="5" rx="15" ry="4.500" fill="none" stroke="#ffd54f" stroke-width="3"/>' : '';
    const aura = stage >= 3 ? '<circle cx="50" cy="54" r="49" fill="#ffe27a" opacity=".28"/>' : '';
    const sp = (stage >= 1 ? sparkle(90, 14, .9) : '') + (stage >= 2 ? sparkle(8, 34, .8) : '') + (stage >= 3 ? sparkle(88, 66, .7) + sparkle(12, 10, .6) : '');
    return `<svg class="bit m-${mood}" width="${size}" height="${size}" viewBox="${vb || '0 0 100 100'}" aria-hidden="true">${DEFS.replace('</defs>', extra + '</defs>')}${aura}${halo}<ellipse cx="50" cy="97" rx="30" ry="3.500" fill="#000" opacity=".12"/><g transform="translate(50 96) scale(${k}) translate(-50 -96)">${g}${worn}</g>${sp}</svg>`;
  }

  return { COLORS, COLOR_NAMES, SPECIES, STAGES, ITEMS, art, preview };
})();
