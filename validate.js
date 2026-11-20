#!/usr/bin/env node
/* Validador de contenido. Uso: node validate.js [archivo.js ...]  (sin args: todos los de content/)
   - Revisa la estructura de cada ejercicio.
   - EJECUTA el código: verifica `out` y `run.sol` en python (python3) y javascript (node). */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { spawnSync } = require('child_process');
const dir = path.join(__dirname, 'content');
let files = process.argv.slice(2);
if (!files.length) files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'helpers.js').map(f => path.join(dir, f));
{ // las ampliaciones <id>.plus.js y <id>.plus2.js se cargan siempre después de su archivo base <id>.js
  files = files.map(f => path.resolve(f));
  const extra = [];
  for (const f of files) { const m = f.match(/^(.*)\.plus2?\.js$/); if (m) for (const dep of [m[1] + '.js', m[1] + '.plus.js']) if (!files.includes(dep) && !extra.includes(dep) && fs.existsSync(dep) && dep !== f) extra.push(dep); }
  const rank = f => /\.plus2\.js$/.test(f) ? 2 : /\.plus\.js$/.test(f) ? 1 : 0;
  files = [...new Set([...extra, ...files])].sort((a, b) => rank(a) - rank(b));
}

const ctx = { console }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'helpers.js'), 'utf8'), ctx);
let errors = 0, warns = 0, nEx = 0, nLes = 0, checked = 0; const unchecked = {};
const err = (w, m) => { errors++; console.log('✗ ' + w + ': ' + m); };
const warn = (w, m) => { warns++; console.log('! ' + w + ': ' + m); };
const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.trim()).join('\n').trim();

function runPy(code) {
  const r = spawnSync('python3', ['-I', '-c', code], { encoding: 'utf8', timeout: 8000, cwd: fs.mkdtempSync(path.join(require('os').tmpdir(), 'cqp-')) });
  return { out: r.stdout, err: r.stderr, ok: r.status === 0 };
}
function runJs(code) {
  const r = spawnSync('node', ['-e', code], { encoding: 'utf8', timeout: 8000, cwd: fs.mkdtempSync(path.join(require('os').tmpdir(), 'cqj-')) });
  return { out: r.stdout, err: r.stderr, ok: r.status === 0 };
}
const os = require('os');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'cqv-'));
const sh = (cmd, args, opt = {}) => { const r = spawnSync(cmd, args, { encoding: 'utf8', timeout: 20000, ...opt }); return { out: r.stdout || '', err: r.stderr || '', ok: r.status === 0 }; };
/* Ejecutores extra: C, C++, Java, Bash, TypeScript (el código del ejercicio es un fragmento; se envuelve en main) */
function runC(code, cpp) {
  const d = tmp(), f = path.join(d, cpp ? 'a.cpp' : 'a.c');
  const hasMain = /\bmain\s*\(/.test(code);
  const head = cpp ? '#include <bits/stdc++.h>\nusing namespace std;\n' : '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <math.h>\n#include <stdbool.h>\n#include <ctype.h>\n#include <stdint.h>\n';
  const top = []; const body = [];
  if (hasMain) top.push(code); else { // las líneas #include y las definiciones de función/struct/typedef/using van arriba; el resto dentro de main
    let depth = 0, inTop = false, buf = [];
    code.split('\n').forEach(l => {
      if (!depth && /^\s*(#\s*include|using\s|typedef\b|struct\s+\w+\s*\{|enum\s|(static\s+)?(unsigned\s+|const\s+)?(int|void|double|float|char\s*\*?|long|bool|string|auto)\s+\*?\w+\s*\([^;]*\)\s*\{?\s*$)/.test(l) && !/^\s*(int|double|float|char|long|bool|string|auto)\s+\w+\s*=/.test(l)) inTop = true;
      (inTop ? top : body).push(l);
      depth += (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length;
      if (inTop && depth === 0 && /[};]\s*$|^\s*#/.test(l)) inTop = false;
    });
  }
  fs.writeFileSync(f, head + top.join('\n') + (hasMain ? '' : '\nint main(void) {\n' + body.join('\n') + '\nreturn 0;\n}\n'));
  const c = sh(cpp ? 'g++' : 'gcc', ['-w', '-o', path.join(d, 'a.out'), f, ...(cpp ? ['-std=c++20', '-pthread'] : ['-lm'])]);
  if (!c.ok) return { out: '', err: c.err, ok: false };
  return sh(path.join(d, 'a.out'), []);
}
function runJava(code) {
  const d = tmp(), f = path.join(d, 'Main.java'), hasMain = /\bmain\s*\(/.test(code);
  const imports = 'import java.util.*;\nimport java.util.function.*;\nimport java.util.stream.*;\nimport java.util.concurrent.*;\nimport java.util.concurrent.atomic.*;\nimport java.time.*;\nimport java.time.format.*;\nimport java.time.temporal.*;\nimport java.io.*;\nimport java.nio.file.*;\nimport java.math.*;\nimport java.util.regex.*;\n';
  let src;
  if (hasMain) src = imports + code;
  else { const lines = code.split('\n'), top = [], body = []; let depth = 0, inTop = false;
    lines.forEach(l => { if (!depth && /^\s*(import\s|(public\s+|abstract\s+|final\s+|sealed\s+|non-sealed\s+|static\s+)*(class|interface|enum|record)\s)/.test(l)) inTop = true; (inTop ? top : body).push(l); depth += (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length; if (inTop && depth === 0 && /\}\s*$|;\s*$/.test(l)) inTop = false; });
    src = imports + top.filter(l => /^\s*import/.test(l)).join('\n') + '\npublic class Main {\n public static void main(String[] args) throws Exception {\n' + body.join('\n') + '\n }\n}\n' + top.filter(l => !/^\s*import/.test(l)).join('\n').replace(/^(\s*)public\s+(class|interface|enum|record)/gm, '$1$2') + '\n'; }
  fs.writeFileSync(f, src);
  const c = sh('java', ['-m', 'jdk.compiler/com.sun.tools.javac.Main', '-nowarn', '-d', d, f], { cwd: d });
  if (!c.ok) return { out: '', err: c.out + c.err, ok: false };
  return sh('java', ['-cp', d, 'Main'], { cwd: d });
}
function runBash(code) { const d = tmp(); const r = sh('bash', ['-c', code], { cwd: d, env: { ...process.env, HOME: d, PS1: '' } }); /* un script puede terminar con código != 0 a propósito (set -e, exit 3...): solo es error si bash no entiende el código */ if (!r.ok && !/syntax error|command not found|unbound variable|bad substitution/.test(r.err) && r.out.trim()) r.ok = true; return r; }
function runTs(code) {
  const d = tmp(), f = path.join(d, 'a.ts'); fs.writeFileSync(f, code + '\nexport {};\n');
  const c = sh('tsc', ['--outDir', d, '--strict', '--target', 'es2022', '--module', 'commonjs', '--lib', 'es2022,dom', '--skipLibCheck', f]);
  if (!c.ok) return { out: '', err: c.out + c.err, ok: false };
  return sh('node', [path.join(d, 'a.js')], { cwd: d });
}

const SQLPY = `
import sqlite3, sys, json
src = sys.stdin.read()
con = sqlite3.connect(':memory:', isolation_level=None); cur = con.cursor()
import re
tab = None
def cv(x):
    x = x.strip()
    if x.upper() == 'NULL': return None
    if re.fullmatch(r'-?\\d+', x): return int(x)
    if re.fullmatch(r'-?\\d+\\.\\d+', x): return float(x)
    return x
for line in src.split('\\n'):
    m = re.match(r'^--\\s*(\\w+)\\s*$', line)
    if m: tab = {'n': m.group(1), 'h': None}; continue
    if line.startswith('--') and '|' in line and tab:
        cells = [c for c in line[2:].split('|')]
        if tab['h'] is None:
            tab['h'] = [c.strip() for c in cells]; cur.execute('CREATE TABLE ' + tab['n'] + ' (' + ','.join(tab['h']) + ')')
        else:
            cur.execute('INSERT INTO ' + tab['n'] + ' VALUES (' + ','.join('?' * len(tab['h'])) + ')', [cv(c) for c in cells])
    elif not line.startswith('--'): tab = None
stmts = []; buf = ''
for line in src.split('\\n'):
    if line.lstrip().startswith('--'): continue
    buf += line + '\\n'
    if sqlite3.complete_statement(buf): stmts.append(buf.strip()); buf = ''
if buf.strip(): stmts.append(buf.strip())
rows = []
for st in stmts:
    cur.execute(st)
    if st.lstrip().upper().startswith(('SELECT','WITH')): rows = cur.fetchall()
print(json.dumps(rows))
`;
function sqlCandidates(code) {
  const r = sh('python3', ['-I', '-c', SQLPY], { input: code });
  if (!r.ok) return { ok: false, err: r.err.split('\n').slice(-2)[0] };
  const rows = JSON.parse(r.out), f = v => v === null ? 'NULL' : (typeof v === 'number' && Number.isInteger(v)) ? String(v) : String(v);
  const c = [String(rows.length)];
  if (rows.length) { c.push(rows[0].map(f).join(' ')); c.push(rows[0].map(f).join('|')); c.push(rows[0].map(f).join(', ')); c.push(f(rows[0][0])); c.push(rows.map(x => x.map(f).join(' ')).join('\n')); c.push(rows.map(x => x.map(f).join(', ')).join(', ')); c.push(rows.map(x => x.map(f).join(' ')).join(', ')); c.push(rows.map(x => x.map(f).join(' ')).join(' ')); c.push(f(rows[rows.length - 1][0])); }
  return { ok: true, c, rows };
}
const exec = (runner, code, lang) => runner === 'python' ? runPy(code) : runner === 'js' ? runJs(code)
  : lang === 'c' ? runC(code, false) : lang === 'cpp' ? runC(code, true) : lang === 'java' ? runJava(code) : lang === 'bash' ? runBash(code) : lang === 'typescript' ? runTs(code) : null;

for (const f of files) {
  try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f }); } catch (e) { err(f, 'no carga: ' + e.message); }
}
for (const [id, L] of Object.entries(ctx.CQ.content)) {
  for (const key of ['id', 'name', 'emoji', 'color', 'tagline', 'units']) if (!L[key]) err(id, 'falta ' + key);
  const uids = new Set();
  (L.units || []).forEach((u, ui) => {
    if (!u.id || uids.has(u.id)) err(id, 'unidad id repetido/ausente ' + u.id); uids.add(u.id);
    if (!u.title || !u.desc) err(id + '.' + u.id, 'falta title/desc');
    const lids = new Set();
    (u.lessons || []).forEach(l => {
      nLes++;
      const W = `${id}.${u.id}.${l.id}`;
      if (!l.id || lids.has(l.id)) err(W, 'lección id repetido'); lids.add(l.id);
      if (!l.title || !l.intro) err(W, 'falta title/intro');
      if (!l.ex || l.ex.length < 5 || l.ex.length > 8) warn(W, 'se esperan 5-8 ejercicios, hay ' + (l.ex || []).length);
      (l.ex || []).forEach((x, i) => {
        nEx++;
        const w = `${W}#${i + 1}(${x.k})`;
        if (!x.q || !x.e) err(w, 'falta q o e (explicación)');
        switch (x.k) {
          case 'mc':
            if (!Array.isArray(x.o) || x.o.length < 2 || x.o.length > 4) err(w, 'o debe tener 2-4 opciones');
            else if (!Number.isInteger(x.a) || x.a < 0 || x.a >= x.o.length) err(w, 'a fuera de rango');
            else if (new Set(x.o).size !== x.o.length) err(w, 'opciones repetidas');
            break;
          case 'fill':
            if (!x.code || !x.code.includes('___')) err(w, 'code debe contener ___');
            if (!x.a.length || x.a.some(a => typeof a !== 'string' || !a.length)) err(w, 'a inválido');
            break;
          case 'order':
            if (!Array.isArray(x.t) || x.t.length < 3 || x.t.length > 10) err(w, 't debe tener 3-10 fichas');
            else if (x.t.some(t => /^\s|\s$/.test(t) || !t.length)) err(w, 'fichas con espacios al borde o vacías');
            break;
          case 'out': {
            if (!x.code || !x.a.length) { err(w, 'falta code o a'); break; }
            if (id === 'sql') { const q = sqlCandidates(x.code); checked++; if (!q.ok) err(w, 'el SQL falla: ' + q.err); else if (!x.a.some(a => q.c.map(norm).includes(norm(a)))) err(w, `resultado real ${JSON.stringify(q.rows)} no coincide con a=${JSON.stringify(x.a)}`); break; }
            const r = exec(L.runner, x.code, id);
            if (r) { checked++; if (!r.ok) err(w, 'el código falla: ' + r.err.split('\n').slice(-2)[0]); else if (!x.a.map(norm).includes(norm(r.out))) err(w, `salida real ${JSON.stringify(norm(r.out))} no coincide con a=${JSON.stringify(x.a)}`); }
            else if (L.runner !== null && L.runner !== undefined) warn(w, 'runner desconocido'); else unchecked[id] = (unchecked[id] || 0) + 1;
            break;
          }
          case 'pair':
            if (!Array.isArray(x.pairs) || x.pairs.length < 3 || x.pairs.length > 5) err(w, 'pairs debe tener 3-5 pares');
            else if (new Set(x.pairs.map(p => p[0])).size !== x.pairs.length || new Set(x.pairs.map(p => p[1])).size !== x.pairs.length) err(w, 'pares con lados repetidos');
            break;
          case 'run': {
            if (L.runner !== 'python' && L.runner !== 'js') { err(w, 'run solo en python/js'); break; }
            if (!x.starter || !x.sol || !Array.isArray(x.tests) || !x.tests.length) { err(w, 'run necesita starter, sol y tests'); break; }
            const t = x.tests.map(([e, r]) => L.runner === 'python'
              ? `print(json.dumps(${e}))` : `console.log(JSON.stringify(${e}))`);
            const code = L.runner === 'python' ? 'import json\n' + x.sol + '\n' + t.join('\n') : x.sol + '\n' + t.join('\n');
            const r = exec(L.runner, code); checked++;
            if (!r.ok) { err(w, 'la solución falla: ' + r.err.split('\n').slice(-2)[0]); break; }
            const got = r.out.trim().split('\n');
            x.tests.forEach(([e, exp], j) => { if (got[j] !== exp) err(w, `test ${e}: obtuve ${got[j]} esperaba ${exp}`); });
            break;
          }
          default: err(w, 'tipo desconocido ' + x.k);
        }
      });
    });
  });
}
console.log(`\n${Object.keys(ctx.CQ.content).length} lenguajes, ${nLes} lecciones, ${nEx} ejercicios, ${checked} ejecutados · ${errors} errores · ${warns} avisos`);
if (Object.keys(unchecked).length) console.log('Sin ejecutar (no hay compilador aquí): ' + Object.entries(unchecked).map(([k, v]) => k + ' ' + v).join(', '));
process.exit(errors ? 1 : 0);
