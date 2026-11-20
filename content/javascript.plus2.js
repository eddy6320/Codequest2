(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair, run } = CQ.h;
const J = (...l) => l.join('\n');

CQ.content.javascript.units.push(
  // ───────────── UNIDAD 14 ─────────────
  { id: 'u14', title: 'Regex, fechas y formato', desc: 'Busca patrones y maneja fechas y números', lessons: [
    { id: 'l1', title: 'Expresiones regulares', intro: J(
'Una **expresión regular** describe un patrón de texto: `/\\d+/` = uno o más dígitos.',
'',
'```',
'/\\d+/.test("abc123")          // true',
'"a1b22".match(/\\d+/g)         // ["1", "22"]',
'"2024-05".replace(/(\\d+)-(\\d+)/, "$2/$1")',
'```',
'',
'* Clases: `\\d` dígito, `\\w` letra/dígito/_, `\\s` espacio, `.` cualquier carácter.',
'* Banderas: `g` todas las coincidencias, `i` ignora mayúsculas.',
'* Los paréntesis **capturan** grupos; `(?<nombre>...)` les pone nombre y se leen en `m.groups.nombre`.'),
      ex: [
        out('¿Qué imprime?', 'console.log(/\\d+/.test("abc123"));', 'true', 'Hay al menos un dígito en el texto, así que test devuelve true.'),
        out('¿Qué imprime?', 'console.log("a1b22c333".match(/\\d+/g));', "[ '1', '22', '333' ]", 'Con la bandera g, match devuelve todas las coincidencias en un arreglo.'),
        out('¿Qué imprime?', 'console.log("2024-05-17".replace(/(\\d+)-(\\d+)-(\\d+)/, "$3/$2/$1"));', '17/05/2024', '$1, $2 y $3 son los grupos capturados; aquí se reordenan.'),
        mc('¿Qué hace la bandera g en una regex?', ['Busca todas las coincidencias', 'Ignora mayúsculas', 'Busca solo al inicio', 'Permite varias líneas'], 0, 'g es "global": no se detiene en la primera coincidencia.'),
        out('¿Qué imprime?', J('const m = "2024-05".match(/(?<anio>\\d{4})-(?<mes>\\d{2})/);', 'console.log(m.groups.mes);'), '05', 'El grupo con nombre "mes" captura los dos dígitos después del guion.'),
        fill('Comprueba que el texto sea exactamente 3 dígitos', 'console.log(/^\\d{3}$/.___("123"));', 'test', 'RegExp.prototype.test devuelve true/false; ^ y $ exigen que sea todo el texto.'),
        pair('Empareja el símbolo con su significado', [['\\d', 'un dígito'], ['\\w', 'letra, dígito o _'], ['\\s', 'un espacio en blanco'], ['^', 'inicio del texto']], 'Son las piezas básicas con las que se arman los patrones.'),
      ] },
    { id: 'l2', title: 'Fechas, números e Intl', intro: J(
'`Date` representa un instante. Cuidado: los **meses empiezan en 0** (enero = 0).',
'',
'```',
'new Date("2024-03-01T00:00:00Z").toISOString()',
'const d = new Date(Date.UTC(2024, 1, 28));',
'd.setUTCDate(d.getUTCDate() + 2);',
'```',
'',
'Para números: `n.toFixed(2)` redondea a texto con 2 decimales; `Number("12px")` da `NaN` pero `parseInt("12px")` da `12`. Para formato según idioma usa `Intl.NumberFormat("en-US").format(n)` o `toLocaleString`.'),
      ex: [
        out('¿Qué imprime?', 'console.log(new Date(2024, 0, 31).getMonth());', '0', 'Los meses van de 0 (enero) a 11 (diciembre).'),
        out('¿Qué imprime?', 'console.log(new Date("2024-03-01T00:00:00Z").toISOString());', '2024-03-01T00:00:00.000Z', 'toISOString siempre da UTC con milisegundos y una Z al final.'),
        out('¿Qué imprime?', J('const d = new Date(Date.UTC(2024, 1, 28));', 'd.setUTCDate(d.getUTCDate() + 2);', 'console.log(d.toISOString().slice(0, 10));'), '2024-03-01', '2024 es bisiesto: 28 de febrero + 2 días = 1 de marzo.'),
        out('¿Qué imprime?', 'console.log((0.1 + 0.2).toFixed(2));', '0.30', 'toFixed(2) redondea a dos decimales y devuelve un texto.'),
        out('¿Qué imprime?', 'console.log(Number("12px"), parseInt("12px"));', 'NaN 12', 'Number exige que todo el texto sea numérico; parseInt lee hasta donde puede.'),
        out('¿Qué imprime?', 'console.log(new Intl.NumberFormat("en-US").format(1234567.891));', '1,234,567.891', 'Intl.NumberFormat agrupa los miles según el idioma indicado.'),
        mc('¿Qué formato de fecha es el más seguro para guardar e intercambiar datos?', ['ISO 8601 (2024-05-17)', '17/05/24', 'Mayo 17', '5-17'], 0, 'ISO 8601 no es ambiguo y se ordena alfabéticamente igual que cronológicamente.'),
      ] },
    { id: 'l3', title: 'Reto: limpiar y calcular', intro: J(
'Junta las piezas: usa regex para extraer datos de un texto y `Date` para calcular diferencias.',
'',
'Restar dos fechas da **milisegundos**:',
'',
'```',
'const ms = new Date("2024-03-01") - new Date("2024-01-01");',
'Math.round(ms / 86400000)   // días',
'```',
'',
'Y recuerda: `texto.match(/\\d+/g)` devuelve `null` si no hay coincidencias, así que usa `|| []`.'),
      ex: [
        run('Escribe diasEntre(a, b): días entre dos fechas ISO "AAAA-MM-DD"', 'function diasEntre(a, b) {\n  ', [['diasEntre("2024-01-01", "2024-03-01")', '60'], ['diasEntre("2024-05-01", "2024-05-01")', '0']], 'Resta las fechas (ms) y divide entre 86 400 000 ms por día.', 'function diasEntre(a, b) {\n  return Math.round((new Date(b) - new Date(a)) / 86400000);\n}'),
        run('Escribe extraeNumeros(texto): arreglo con los números enteros del texto', 'function extraeNumeros(texto) {\n  ', [['extraeNumeros("a1b22")', '[1,22]'], ['extraeNumeros("sin numeros")', '[]']], 'match con /\\d+/g (o [] si es null) y map(Number).', 'function extraeNumeros(texto) {\n  return (texto.match(/\\d+/g) || []).map(Number);\n}'),
        out('¿Qué imprime?', 'console.log("sin numeros".match(/\\d+/g));', 'null', 'Cuando nada coincide, match devuelve null (no un arreglo vacío).'),
        tf('Restar dos objetos Date devuelve la diferencia en milisegundos.', true, 'Al restar, cada Date se convierte en su número de milisegundos desde 1970.'),
        fill('Reemplaza todos los espacios', 'console.log("a b c".replace(/ /___, "-"));', 'g', 'Sin la bandera g, replace solo cambia la primera coincidencia.'),
        out('¿Qué imprime?', 'console.log("Hola Mundo".replace(/o/gi, "0"));', 'H0la Mund0', 'Con g e i se reemplazan todas las o, sin importar mayúsculas.'),
      ] },
  ]},

  // ───────────── UNIDAD 15 ─────────────
  { id: 'u15', title: 'Node.js práctico', desc: 'JavaScript fuera del navegador', lessons: [
    { id: 'l1', title: 'Módulos, process y eventos', intro: J(
'**Node.js** ejecuta JavaScript fuera del navegador. Tiene dos sistemas de módulos:',
'',
'* CommonJS: `const fs = require("fs")` y `module.exports = ...`.',
'* ES Modules: `import fs from "fs"` (con `"type": "module"` en package.json).',
'',
'El objeto global `process` da información: `process.argv` (argumentos: `[ruta de node, ruta del script, ...tus argumentos]`), `process.env` (variables de entorno) y `process.exit(código)`.',
'',
'`EventEmitter` (módulo `events`) permite `on` para escuchar y `emit` para avisar.'),
      ex: [
        out('¿Qué imprime?', 'const path = require("path");\nconsole.log(path.basename("/a/b/c.txt"));', 'c.txt', 'basename devuelve la última parte de la ruta.'),
        out('¿Qué imprime?', 'console.log(typeof require, typeof module);', 'function object', 'En CommonJS, require es una función y module un objeto.'),
        mc('¿Cuál es la sintaxis de módulos ES?', ['import fs from "fs"', 'const fs = require("fs")', 'using fs', '#include fs'], 0, 'import/export son los módulos estándar de ECMAScript; require es CommonJS.'),
        out('¿Qué imprime?', J('const EventEmitter = require("events");', 'const e = new EventEmitter();', 'e.on("hola", n => console.log("hola " + n));', 'e.emit("hola", "Ana");'), 'hola Ana', 'emit dispara el evento y pasa los argumentos al listener registrado con on.'),
        tf('process.argv[0] es la ruta de tu script.', false, 'argv[0] es el ejecutable de node y argv[1] es tu script; tus argumentos empiezan en argv[2].'),
        out('¿Qué imprime?', 'console.log(Array.isArray(process.argv));', 'true', 'process.argv es un arreglo de textos con los argumentos del proceso.'),
        fill('Exporta la función suma', 'function suma(a, b) { return a + b; }\nmodule.___ = suma;', 'exports', 'module.exports define lo que devuelve require() al importar el archivo.'),
      ] },
    { id: 'l2', title: 'fs y path', intro: J(
'`fs` lee y escribe archivos; `path` arma rutas que funcionan en cualquier sistema.',
'',
'```',
'const fs = require("fs");',
'fs.writeFileSync("a.txt", "hola");',
'fs.readFileSync("a.txt", "utf8");   // "hola"',
'fs.existsSync("a.txt");',
'path.join("a", "b", "..", "c");     // "a/c"',
'path.extname("foto.png");           // ".png"',
'```',
'',
'Las versiones `Sync` **bloquean** el programa. En servidores usa `fs/promises` con `await`. Sin indicar codificación, `readFileSync` devuelve un `Buffer`.'),
      ex: [
        out('¿Qué imprime?', 'const fs = require("fs");\nfs.writeFileSync("a.txt", "hola");\nconsole.log(fs.readFileSync("a.txt", "utf8"));', 'hola', 'Se escribe el archivo y se lee de vuelta como texto UTF-8.'),
        out('¿Qué imprime?', 'const path = require("path");\nconsole.log(path.join("a", "b", "..", "c"));', 'a/c', 'join normaliza la ruta: ".." sube un nivel y elimina "b".'),
        out('¿Qué imprime?', 'const path = require("path");\nconsole.log(path.extname("foto.final.png"));', '.png', 'extname devuelve solo la última extensión.'),
        mc('¿Qué ventaja tiene fs.promises frente a readFileSync?', ['No bloquea el event loop', 'Es más corto', 'Funciona en el navegador', 'Siempre lee más rápido'], 0, 'Mientras se lee el archivo, Node puede atender otras tareas.'),
        out('¿Qué imprime?', J('const fs = require("fs/promises");', '(async () => {', '  await fs.writeFile("b.txt", "x");', '  console.log((await fs.readFile("b.txt", "utf8")).length);', '})();'), '1', 'Se espera la escritura, se lee el texto "x" y su longitud es 1.'),
        fill('Comprueba (de forma síncrona) si existe el archivo', 'const fs = require("fs");\nconsole.log(fs.___("no_existe.txt"));', 'existsSync', 'existsSync devuelve true o false sin lanzar errores.'),
        tf('readFileSync sin indicar codificación devuelve un Buffer.', true, 'Con "utf8" obtienes un string; sin ella, bytes crudos en un Buffer.'),
      ] },
    { id: 'l3', title: 'Reto: scripts de línea de comandos', intro: J(
'Un script de Node suele leer `process.argv`, procesar datos y terminar con un **código de salida**: `0` = éxito, otro número = error (`process.exit(1)`).',
'',
'También conviene recordar el orden de la cola de tareas: primero el código síncrono, luego `process.nextTick`, luego las promesas (microtareas) y después los temporizadores.'),
      ex: [
        run('Escribe parseArgs(argv): convierte ["--n","5","--v"] en {n:"5", v:true}', 'function parseArgs(argv) {\n  ', [['parseArgs(["--n","5","--v"])', '{"n":"5","v":true}'], ['parseArgs([])', '{}']], 'Recorre el arreglo: si un --clave va seguido de un valor, úsalo; si no, es true.', 'function parseArgs(argv) {\n  const o = {};\n  for (let i = 0; i < argv.length; i++) {\n    if (argv[i].startsWith("--")) {\n      const k = argv[i].slice(2);\n      const next = argv[i + 1];\n      if (next !== undefined && !next.startsWith("--")) { o[k] = next; i++; } else o[k] = true;\n    }\n  }\n  return o;\n}'),
        out('¿Qué imprime?', J('const fs = require("fs");', 'fs.writeFileSync("c.json", JSON.stringify({ a: 1 }));', 'console.log(JSON.parse(fs.readFileSync("c.json", "utf8")).a + 1);'), '2', 'Se guarda el objeto como JSON, se lee, se parsea y se suma 1.'),
        mc('¿Qué indica process.exit(1)?', ['Que el programa terminó con error', 'Que terminó con éxito', 'Que se reinicia', 'Que espera una entrada'], 0, 'Por convención 0 es éxito y cualquier otro valor es fallo; los scripts y CI lo usan.'),
        out('¿En qué orden se imprime?', J('Promise.resolve().then(() => console.log("promesa"));', 'process.nextTick(() => console.log("tick"));', 'console.log("sync");'), 'sync\ntick\npromesa', 'Primero lo síncrono, luego nextTick y después las microtareas de promesas.'),
        tf('process.env permite leer variables de entorno como process.env.HOME.', true, 'Es un objeto con las variables de entorno del proceso (valores siempre texto).'),
        run('Escribe aTexto(obj): devuelve el objeto como JSON con sangría de 2 espacios', 'function aTexto(obj) {\n  ', [['aTexto({a:1})', '"{\\n  \\"a\\": 1\\n}"']], 'JSON.stringify(valor, null, 2) formatea con sangría.', 'function aTexto(obj) {\n  return JSON.stringify(obj, null, 2);\n}'),
      ] },
  ]}
);
})();
