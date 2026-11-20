(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair, run } = CQ.h;

const T = '```';

CQ.content.javascript.units.push(
  // ───────────── UNIDAD 8 ─────────────
  { id: 'u8', title: 'El DOM y los eventos', desc: 'Seleccionar, crear y modificar elementos y reaccionar al usuario', lessons: [
    { id: 'l1', title: 'Seleccionar elementos', intro:
      'El **DOM** es la representación de la página como un árbol de objetos. `document` es su punto de entrada.\n\n' +
      T + '\nconst titulo = document.querySelector("#titulo");\nconst items = document.querySelectorAll(".item");\ntitulo.textContent = "Hola";\n' + T + '\n\n`querySelector` devuelve el **primer** elemento que cumple el selector CSS (o `null`). `querySelectorAll` devuelve **todos** (una NodeList).',
      ex: [
        mc('¿Qué método devuelve solo el primer elemento que coincide con un selector CSS?', ['document.querySelectorAll()', 'document.querySelector()', 'document.getElements()'], 1, 'querySelector devuelve un único elemento; querySelectorAll devuelve todos.'),
        fill('Completa para seleccionar el elemento con id "titulo".', 'const t = document.___("#titulo");', 'querySelector', 'Los selectores CSS funcionan con querySelector: # para id, . para clase.'),
        pair('Empareja cada selector CSS con lo que selecciona.', [['#menu', 'Elemento con id "menu"'], ['.activo', 'Elementos con clase "activo"'], ['p', 'Todas las etiquetas <p>'], ['ul > li', 'Hijos directos li de un ul']], 'querySelector usa exactamente la misma sintaxis que CSS.'),
        tf('Si querySelector no encuentra nada, devuelve null.', true, 'Por eso conviene comprobar el resultado antes de usarlo.'),
        mc('¿Qué devuelve document.querySelectorAll(".item")?', ['Solo el primer elemento', 'Una colección (NodeList) con todos los que coinciden', 'Un texto con el HTML'], 1, 'Es una NodeList sobre la que puedes usar forEach o convertirla a array.'),
        order('Ordena para cambiar el texto del primer h1.', ['const t', '=', 'document.querySelector("h1")', ';', 't.textContent = "Hola";'], 'Primero se selecciona el elemento y luego se modifica su propiedad textContent.'),
        mc('¿Qué propiedad es más segura para escribir texto que viene del usuario?', ['innerHTML', 'textContent', 'outerHTML'], 1, 'textContent trata el valor como texto plano; innerHTML interpretaría etiquetas HTML.'),
      ] },
    { id: 'l2', title: 'Crear y modificar', intro:
      'Puedes crear elementos desde JavaScript y añadirlos a la página.\n\n' +
      T + '\nconst li = document.createElement("li");\nli.textContent = "Nueva tarea";\nli.classList.add("pendiente");\nlista.append(li);\n' + T + '\n\n`createElement` solo crea el elemento en memoria; no aparece hasta que lo insertas con `append`. `classList` permite `add`, `remove`, `toggle` y `contains`.',
      ex: [
        order('Ordena para crear un párrafo con texto y añadirlo al body.', ['const p = document.createElement("p");', 'p.textContent = "Hola";', 'document.body.append(p);'], 'Se crea, se configura y por último se inserta en el árbol.'),
        tf('document.createElement("div") hace que el div aparezca en la página automáticamente.', false, 'Hay que insertarlo con append, prepend, etc.'),
        fill('Alterna la clase "oscuro": si está, la quita; si no, la pone.', 'document.body.classList.___("oscuro");', 'toggle', 'toggle añade la clase si falta y la quita si existe.'),
        pair('Empareja cada método de classList con su efecto.', [['add', 'Añade una clase'], ['remove', 'Quita una clase'], ['toggle', 'Alterna la clase'], ['contains', 'Comprueba si la tiene']], 'Es más limpio que manipular el atributo class como texto.'),
        mc('¿Qué método elimina un elemento del DOM?', ['el.delete()', 'el.remove()', 'el.destroy()'], 1, 'remove() lo quita del documento.'),
        mc('Con <div data-user-id="7">, ¿cómo lees ese valor?', ['div.dataset.userId', 'div.data.user-id', 'div.attr.userId'], 0, 'Los atributos data-* se exponen en dataset y pasan a camelCase.'),
        fill('Asigna el atributo placeholder del input.', 'input.___("placeholder", "Tu nombre");', 'setAttribute', 'setAttribute(nombre, valor) escribe cualquier atributo HTML.'),
      ] },
    { id: 'l3', title: 'Reto: eventos y delegación', intro:
      'Un **evento** es algo que ocurre en la página (clic, tecla, envío de formulario).\n\n' +
      T + '\nboton.addEventListener("click", (e) => {\n  console.log("clic");\n});\n\nlista.addEventListener("click", (e) => {\n  if (e.target.matches("li")) e.target.classList.toggle("hecho");\n});\n' + T + '\n\nLa **delegación** usa un solo listener en el padre y `e.target` para saber qué hijo se pulsó. Funciona incluso con elementos creados después.',
      ex: [
        fill('Completa para reaccionar al clic.', 'boton.addEventListener("___", () => alert("Hola"));', 'click', 'addEventListener recibe el nombre del evento y la función a ejecutar.'),
        mc('¿Qué propiedad del evento indica el elemento exacto sobre el que se hizo clic?', ['e.target', 'e.type', 'e.listener'], 0, 'e.target es el elemento origen del evento, base de la delegación.'),
        tf('En la delegación de eventos se pone un listener en cada elemento hijo.', false, 'Se pone uno solo en el padre y se filtra con e.target.'),
        mc('¿Por qué la delegación funciona con elementos añadidos más tarde?', ['Porque el evento burbujea hasta el padre, que ya tiene el listener', 'Porque JavaScript recorre el DOM cada segundo', 'Porque addEventListener copia el listener a los hijos futuros'], 0, 'Los eventos burbujean hacia arriba: el padre los recibe aunque el hijo sea nuevo.'),
        fill('Evita que el formulario recargue la página al enviarse.', 'form.addEventListener("submit", (e) => { e.___(); });', 'preventDefault', 'preventDefault cancela el comportamiento por defecto del evento.'),
        pair('Empareja cada evento con cuándo se dispara.', [['click', 'Al pulsar con el ratón'], ['submit', 'Al enviar un formulario'], ['input', 'Al cambiar el valor de un campo'], ['keydown', 'Al pulsar una tecla']], 'Son los eventos más habituales en cualquier interfaz.'),
        order('Ordena un listener delegado sobre una lista.', ['lista.addEventListener("click", (e) => {', 'if (e.target.matches("li")) {', 'e.target.classList.toggle("hecho");', '}', '});'], 'El listener abre, se filtra el elemento pulsado, se actúa y se cierran los bloques.'),
      ] },
  ]},

  // ───────────── UNIDAD 9 ─────────────
  { id: 'u9', title: 'Módulos y herramientas', desc: 'import/export, npm, bundlers, linters y versiones', lessons: [
    { id: 'l1', title: 'import y export', intro:
      'Los **módulos** dividen el código en archivos reutilizables.\n\n' +
      T + '\n// math.js\nexport const PI = 3.14;\nexport default function suma(a, b) { return a + b; }\n\n// app.js\nimport suma, { PI } from "./math.js";\n' + T + '\n\nHay `export` con nombre (varios por archivo, se importan entre llaves) y un único `export default`.',
      ex: [
        mc('¿Qué palabra clave trae código de otro módulo?', ['import', 'export', 'include'], 0, 'import trae valores exportados por otro archivo.'),
        fill('Importa PI desde math.js.', '___ { PI } from "./math.js";', 'import', 'La sintaxis es import { nombre } from "ruta";'),
        tf('Un módulo puede tener muchos export con nombre pero solo un export default.', true, 'El export default es la exportación principal del archivo.'),
        order('Ordena para importar suma de "./math.js".', ['import', '{ suma }', 'from', '"./math.js"', ';'], 'Importar, lo que se trae, from y la ruta del módulo.'),
        pair('Empareja cada sintaxis con su significado.', [['export const x', 'Exportación con nombre'], ['export default', 'Exportación principal'], ['import * as m', 'Importa todo como un objeto'], ['import()', 'Carga dinámica bajo demanda']], 'Cubren casi todos los casos de módulos ES.'),
        mc('Con export default function f() {}, ¿cómo se importa?', ['import { f } from "./f.js"', 'import f from "./f.js"', 'import default f'], 1, 'El default se importa sin llaves y con el nombre que quieras.'),
      ] },
    { id: 'l2', title: 'npm y package.json', intro:
      '**npm** instala paquetes de terceros. El archivo `package.json` describe tu proyecto.\n\n' +
      T + '\n{\n  "name": "app",\n  "scripts": { "build": "vite build" },\n  "dependencies": { "lodash": "^4.17.21" },\n  "devDependencies": { "eslint": "^9.0.0" }\n}\n' + T + '\n\n`npm install` descarga todo en `node_modules`. `npm run build` ejecuta un script.',
      ex: [
        mc('¿Qué archivo describe el proyecto y sus dependencias?', ['index.html', 'package.json', 'node_modules'], 1, 'package.json guarda nombre, scripts y dependencias.'),
        fill('Instala el paquete lodash.', 'npm ___ lodash', ['install', 'i'], 'npm install (o npm i) descarga el paquete y lo añade a package.json.'),
        pair('Empareja cada comando con lo que hace.', [['npm init -y', 'Crea un package.json'], ['npm install x', 'Instala y registra x'], ['npm install -D x', 'Instala x solo para desarrollo'], ['npm run build', 'Ejecuta el script "build"']], 'Son los comandos de npm de uso diario.'),
        tf('La carpeta node_modules se suele subir al repositorio.', false, 'Se regenera con npm install; se añade a .gitignore.'),
        mc('¿Dónde se declara una herramienta que solo se usa al desarrollar, como ESLint?', ['dependencies', 'scripts', 'devDependencies'], 2, 'devDependencies no se necesita en producción.'),
        out('¿Qué imprime?', 'const pkg = { name: "app", scripts: { build: "vite build", test: "vitest" } };\nconsole.log(Object.keys(pkg.scripts).join(", "));', 'build, test', 'Object.keys lista los nombres de los scripts definidos.'),
      ] },
    { id: 'l3', title: 'Reto: versiones y herramientas', intro:
      'Las versiones siguen **semver**: `MAJOR.MINOR.PATCH`.\n\n' +
      '- PATCH: corrige errores.\n- MINOR: añade funciones compatibles.\n- MAJOR: cambios incompatibles.\n\n`^1.2.3` acepta actualizaciones MINOR y PATCH (hasta `<2.0.0`). Un **bundler** (Vite, webpack) empaqueta módulos; **ESLint** detecta errores y **Prettier** formatea.',
      ex: [
        mc('¿Qué versiones acepta "^1.2.3"?', ['Solo 1.2.3', 'Cualquier 1.x.x desde 1.2.3', 'Cualquier versión posterior, incluida 2.0.0'], 1, 'El acento circunflejo permite MINOR y PATCH pero no un nuevo MAJOR.'),
        pair('Empareja cada parte de semver con su significado.', [['MAJOR', 'Cambios incompatibles'], ['MINOR', 'Nueva función compatible'], ['PATCH', 'Corrección de errores']], 'Así sabes el riesgo de actualizar con solo mirar el número.'),
        tf('Un bundler combina muchos módulos en pocos archivos optimizados para el navegador.', true, 'Además puede minificar el código y procesar CSS o imágenes.'),
        mc('¿Qué herramienta formatea el código automáticamente (sangría, comillas)?', ['ESLint', 'Prettier', 'npm'], 1, 'Prettier da formato; ESLint busca errores y malas prácticas.'),
        out('¿Qué imprime?', 'console.log("2.10.4".split(".").map(Number));', '[ 2, 10, 4 ]', 'split divide por puntos y map(Number) convierte cada trozo a número.'),
        run('Escribe subirParche(v): recibe "1.4.2" y devuelve "1.4.3".', 'function subirParche(v) {\n  \n}', [['subirParche("1.4.2")', '"1.4.3"'], ['subirParche("2.0.9")', '"2.0.10"']], 'Divide por ".", convierte a número y suma 1 al último.', 'function subirParche(v) {\n  const [a, b, c] = v.split(".").map(Number);\n  return `${a}.${b}.${c + 1}`;\n}'),
        run('Escribe compararVersiones(a, b): 1 si a > b, -1 si a < b, 0 si son iguales.', 'function compararVersiones(a, b) {\n  \n}', [['compararVersiones("1.2.0","1.10.0")', '-1'], ['compararVersiones("2.0.0","1.9.9")', '1'], ['compararVersiones("1.0.0","1.0.0")', '0']], 'Compara parte a parte como números, no como texto: 10 es mayor que 2.', 'function compararVersiones(a, b) {\n  const x = a.split(".").map(Number);\n  const y = b.split(".").map(Number);\n  for (let i = 0; i < 3; i++) {\n    if (x[i] > y[i]) return 1;\n    if (x[i] < y[i]) return -1;\n  }\n  return 0;\n}'),
      ] },
  ]},

  // ───────────── UNIDAD 10 ─────────────
  { id: 'u10', title: 'APIs y asincronía avanzada', desc: 'fetch, JSON, async/await, Promise.all y el event loop', lessons: [
    { id: 'l1', title: 'fetch y JSON', intro:
      '`fetch` pide datos a una API y devuelve una **Promise**.\n\n' +
      T + '\nconst res = await fetch("https://api.ejemplo.com/usuarios");\nif (!res.ok) throw new Error("HTTP " + res.status);\nconst datos = await res.json();\n' + T + '\n\n`fetch` solo rechaza ante fallos de red; un 404 o 500 **no** lanza error, por eso se revisa `res.ok`. **JSON** es el formato de intercambio: `JSON.stringify` lo crea y `JSON.parse` lo lee.',
      ex: [
        mc('¿Qué devuelve fetch(url)?', ['Directamente los datos', 'Una Promise', 'Un array'], 1, 'Hay que usar await o .then para obtener la respuesta.'),
        fill('Convierte el cuerpo de la respuesta a objeto.', 'const datos = await res.___();', 'json', 'res.json() lee el cuerpo y lo parsea como JSON (también devuelve una Promise).'),
        tf('fetch rechaza la promesa cuando el servidor responde con 404.', false, 'Solo rechaza por errores de red; hay que comprobar res.ok.'),
        out('¿Qué imprime?', 'console.log(JSON.stringify({ a: 1, b: [1, 2] }));', '{"a":1,"b":[1,2]}', 'stringify genera texto JSON sin espacios.'),
        out('¿Qué imprime?', 'const o = JSON.parse(\'{"nombre":"Ana","edad":30}\');\nconsole.log(o.edad + 1);', '31', 'parse convierte el texto en objeto; edad es el número 30.'),
        order('Ordena una petición con comprobación de errores.', ['const res = await fetch(url);', 'if (!res.ok) throw new Error("HTTP");', 'const datos = await res.json();'], 'Pedir, validar el estado y solo entonces leer el cuerpo.'),
        pair('Empareja cada método HTTP con su uso típico.', [['GET', 'Leer datos'], ['POST', 'Crear un recurso'], ['PUT', 'Reemplazar un recurso'], ['DELETE', 'Borrar un recurso']], 'Las APIs REST usan los métodos HTTP como verbos.'),
      ] },
    { id: 'l2', title: 'async/await y combinadores', intro:
      '`async/await` permite escribir código asíncrono con aspecto secuencial. Los errores se capturan con `try/catch`.\n\n' +
      T + '\nconst [a, b] = await Promise.all([pedirA(), pedirB()]);\n' + T + '\n\n- `Promise.all`: espera a todas; falla si una falla.\n- `Promise.race`: la primera en terminar.\n- `Promise.allSettled`: espera a todas y da el estado de cada una.\n- `Promise.any`: la primera que se cumple.',
      ex: [
        out('¿Qué imprime?', 'async function f() {\n  try {\n    await Promise.reject(new Error("boom"));\n  } catch (e) {\n    console.log("capturado", e.message);\n  } finally {\n    console.log("fin");\n  }\n}\nf();', 'capturado boom\nfin', 'await lanza el rechazo como excepción; finally se ejecuta siempre.'),
        out('¿Qué imprime?', 'const esperar = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));\nPromise.all([esperar(20, "a"), esperar(10, "b")]).then(r => console.log(r.join("-")));', 'a-b', 'Promise.all conserva el orden del array original, no el de llegada.'),
        out('¿Qué imprime?', 'const esperar = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));\nPromise.race([esperar(30, "lenta"), esperar(10, "rapida")]).then(console.log);', 'rapida', 'race se resuelve con la primera promesa que termina.'),
        out('¿Qué imprime?', 'Promise.allSettled([Promise.resolve(1), Promise.reject("x")])\n  .then(r => console.log(r.map(o => o.status).join(",")));', 'fulfilled,rejected', 'allSettled nunca rechaza: informa del estado de cada promesa.'),
        mc('Si una de las promesas de Promise.all rechaza, ¿qué ocurre?', ['Promise.all rechaza enseguida con ese error', 'Se ignora y devuelve las demás', 'Espera a todas y devuelve un array mixto'], 0, 'Para tolerar fallos parciales se usa allSettled.'),
        pair('Empareja cada combinador con su comportamiento.', [['Promise.all', 'Espera a todas; falla si una falla'], ['Promise.race', 'La primera en terminar, bien o mal'], ['Promise.allSettled', 'Espera a todas y da su estado'], ['Promise.any', 'La primera que se cumple']], 'Elegir el combinador adecuado evita errores y esperas innecesarias.'),
        tf('Una función async siempre devuelve una Promise.', true, 'Aunque hagas return 5, el llamador recibe una Promise que se resuelve con 5.'),
      ] },
    { id: 'l3', title: 'Reto: el event loop', intro:
      'JavaScript ejecuta una cosa a la vez. El **event loop** decide el orden:\n\n' +
      '1. Primero el código síncrono.\n2. Luego las **microtareas** (`.then`, `await`, `queueMicrotask`).\n3. Después las **macrotareas** (`setTimeout`).\n\n' +
      T + '\nconsole.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");\n// A D C B\n' + T,
      ex: [
        out('¿Qué imprime?', 'console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);', '1\n4\n3\n2', 'Síncrono (1, 4), luego microtarea (3) y al final la macrotarea (2).'),
        out('¿Qué imprime?', 'async function a() {\n  console.log("a1");\n  await null;\n  console.log("a2");\n}\nconsole.log("s");\na();\nconsole.log("e");', 's\na1\ne\na2', 'Lo que va antes del await es síncrono; lo posterior se reanuda como microtarea.'),
        out('¿Qué imprime?', 'setTimeout(() => console.log("timeout"), 0);\nqueueMicrotask(() => console.log("micro"));\nconsole.log("sync");', 'sync\nmicro\ntimeout', 'Orden: síncrono, microtareas, macrotareas.'),
        mc('¿Qué se ejecuta antes cuando ambas están pendientes?', ['Una macrotarea de setTimeout(fn, 0)', 'Una microtarea de una promesa', 'Depende del navegador'], 1, 'El event loop vacía todas las microtareas antes de la siguiente macrotarea.'),
        tf('setTimeout(fn, 0) ejecuta fn de inmediato, antes de la línea siguiente.', false, 'fn se encola como macrotarea y espera a que termine el código síncrono.'),
        order('Ordena una función async que captura errores.', ['async function cargar() {', 'try {', 'await fetch(url);', '} catch (e) {', 'console.error(e);', '}', '}'], 'try envuelve el await y catch maneja el rechazo.'),
        run('Escribe parseSeguro(texto): devuelve el objeto JSON o null si el texto no es JSON válido.', 'function parseSeguro(texto) {\n  \n}', [['parseSeguro(\'{"a":1}\')', '{"a":1}'], ['parseSeguro("{mal")', 'null'], ['parseSeguro("[1,2]")', '[1,2]']], 'Envuelve JSON.parse en try/catch y devuelve null en el catch.', 'function parseSeguro(texto) {\n  try {\n    return JSON.parse(texto);\n  } catch (e) {\n    return null;\n  }\n}'),
      ] },
  ]},

  // ───────────── UNIDAD 11 ─────────────
  { id: 'u11', title: 'Funcional y estructuras', desc: 'Inmutabilidad, reduce, composición, Map/Set, generadores y recursión', lessons: [
    { id: 'l1', title: 'Inmutabilidad y reduce', intro:
      'En estilo funcional no se modifican los datos: se **crean copias**.\n\n' +
      T + '\nconst a = [1, 2];\nconst b = [...a, 3];        // a sigue siendo [1, 2]\nconst p = { n: "Ana", e: 20 };\nconst q = { ...p, e: 21 };  // copia con e cambiado\n' + T + '\n\n`reduce` pliega un array en un solo valor: `arr.reduce((acc, x) => ..., inicial)`. El acumulador puede ser un número, un objeto o un array.',
      ex: [
        out('¿Qué imprime?', 'const a = [1, 2];\nconst b = [...a, 3];\nconsole.log(a.length, b.length);', '2 3', 'El spread crea un array nuevo; a no cambia.'),
        out('¿Qué imprime?', 'const p = { n: "Ana", e: 20 };\nconst q = { ...p, e: 21 };\nconsole.log(p.e, q.e);', '20 21', 'q es una copia con e sobrescrito; p queda intacto.'),
        mc('¿Cuál de estos métodos MUTA el array original?', ['map', 'push', 'filter'], 1, 'push modifica el array; map y filter devuelven uno nuevo.'),
        out('¿Qué imprime?', 'console.log([1, 2, 3, 4].reduce((acc, n) => acc + n, 0));', '10', 'Acumula 0+1+2+3+4.'),
        out('¿Qué imprime?', 'const r = ["a", "b", "a"].reduce((acc, x) => ({ ...acc, [x]: (acc[x] ?? 0) + 1 }), {});\nconsole.log(JSON.stringify(r));', '{"a":2,"b":1}', 'Cada vuelta devuelve un objeto nuevo con el contador de esa letra incrementado.'),
        fill('Suma todos los números con reduce.', 'const total = [5, 6, 7].reduce((acc, n) => acc + n, ___);', '0', 'El valor inicial de una suma es 0.'),
        tf('Object.freeze impide cambiar las propiedades de un objeto (en modo no estricto lo ignora en silencio).', true, 'Es una forma de reforzar la inmutabilidad, aunque solo es superficial.'),
      ] },
    { id: 'l2', title: 'Composición, currying y recursión', intro:
      'Una función **pura** devuelve siempre lo mismo para los mismos argumentos y no tiene efectos secundarios.\n\n' +
      T + '\nconst suma = a => b => a + b;      // currying\nconst compose = (f, g) => x => f(g(x));\nconst fact = n => n <= 1 ? 1 : n * fact(n - 1);\n' + T + '\n\nLa **recursión** necesita un **caso base** que detenga las llamadas y un paso que se acerque a él.',
      ex: [
        out('¿Qué imprime?', 'const compose = (f, g) => x => f(g(x));\nconst inc = x => x + 1;\nconst doble = x => x * 2;\nconsole.log(compose(inc, doble)(5));', '11', 'Primero doble(5) = 10 y luego inc(10) = 11.'),
        out('¿Qué imprime?', 'const suma = a => b => a + b;\nconsole.log(suma(2)(3));', '5', 'suma(2) devuelve una función que espera b.'),
        out('¿Qué imprime?', 'const mult = a => b => a * b;\nconst triple = mult(3);\nconsole.log([1, 2, 3].map(triple).join());', '3,6,9', 'El currying permite fijar un argumento y reutilizar la función.'),
        mc('¿Cuál de estas funciones es pura?', ['const f = x => x * 2', 'const f = x => x * Math.random()', 'const f = x => { total += x; }'], 0, 'Las otras dependen de azar o modifican una variable externa.'),
        out('¿Qué imprime?', 'const f = n => n <= 1 ? 1 : n * f(n - 1);\nconsole.log(f(5));', '120', '5 · 4 · 3 · 2 · 1 = 120.'),
        fill('Completa el caso base de la suma 1+2+...+n.', 'function suma(n) {\n  if (n === ___) return 0;\n  return n + suma(n - 1);\n}', '0', 'Cuando n llega a 0 la recursión se detiene devolviendo 0.'),
        pair('Empareja cada concepto con su definición.', [['Función pura', 'Mismo resultado y sin efectos secundarios'], ['Currying', 'Convertir f(a, b) en f(a)(b)'], ['Composición', 'Encadenar funciones: f(g(x))'], ['Caso base', 'Condición que detiene la recursión']], 'Son los pilares del estilo funcional.'),
      ] },
    { id: 'l3', title: 'Reto: Map, Set y generadores', intro:
      '**Set** guarda valores únicos. **Map** guarda pares clave-valor con claves de cualquier tipo. **WeakMap** solo admite objetos como clave y no impide que se liberen de memoria.\n\n' +
      T + '\nconst unicos = [...new Set([1, 2, 2, 3])];\nfunction* contar() { yield 1; yield 2; }\n[...contar()]; // [1, 2]\n' + T + '\n\nUn **generador** (`function*`) produce valores bajo demanda con `yield`; es un **iterador**.',
      ex: [
        out('¿Qué imprime?', 'console.log([...new Set([1, 2, 2, 3, 1])].length);', '3', 'El Set elimina duplicados: quedan 1, 2 y 3.'),
        out('¿Qué imprime?', 'const m = new Map();\nm.set("a", 1);\nm.set("b", 2);\nconsole.log(m.get("b"), m.size);', '2 2', 'get devuelve el valor de la clave y size cuenta las entradas.'),
        mc('¿Qué distingue a un WeakMap de un Map?', ['Solo admite claves que son objetos y no evita su recolección', 'Es más rápido siempre', 'Solo guarda números'], 0, 'Es útil para asociar datos a objetos sin provocar fugas de memoria.'),
        out('¿Qué imprime?', 'function* gen() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\nconsole.log([...gen()].join(","));', '1,2,3', 'El spread consume el generador hasta que termina.'),
        out('¿Qué imprime?', 'const it = [10, 20][Symbol.iterator]();\nconsole.log(it.next().value, it.next().value, it.next().done);', '10 20 true', 'Tras agotar los elementos, next() devuelve done: true.'),
        pair('Empareja cada estructura con su característica.', [['Set', 'Valores únicos'], ['Map', 'Clave-valor con cualquier tipo de clave'], ['WeakMap', 'Claves objeto sin impedir su recolección'], ['function*', 'Genera valores con yield']], 'Cada una resuelve un problema distinto mejor que un array u objeto simple.'),
        run('Escribe contarPalabras(texto): cuenta cuántas veces aparece cada palabra (separadas por espacio) usando un Map.', 'function contarPalabras(texto) {\n  const m = new Map();\n  // recorre las palabras\n  return Object.fromEntries(m);\n}', [['contarPalabras("a b a")', '{"a":2,"b":1}'], ['contarPalabras("x")', '{"x":1}']], 'Por cada palabra, m.set(p, (m.get(p) ?? 0) + 1).', 'function contarPalabras(texto) {\n  const m = new Map();\n  for (const p of texto.split(" ")) m.set(p, (m.get(p) ?? 0) + 1);\n  return Object.fromEntries(m);\n}'),
      ] },
  ]},

  // ───────────── UNIDAD 12 ─────────────
  { id: 'u12', title: 'Algoritmos y complejidad', desc: 'Big-O, búsqueda, ordenamiento, pilas, colas y memoización', lessons: [
    { id: 'l1', title: 'Big-O y búsqueda', intro:
      '**Big-O** describe cómo crece el tiempo (o la memoria) al aumentar el tamaño `n` de la entrada.\n\n' +
      '- `O(1)`: constante.\n- `O(log n)`: se reduce a la mitad en cada paso.\n- `O(n)`: recorre todo una vez.\n- `O(n²)`: bucles anidados.\n\n' +
      'La **búsqueda binaria** localiza un valor en un array **ordenado** descartando la mitad en cada paso: `O(log n)`.',
      ex: [
        mc('¿Qué mide Big-O?', ['Los segundos exactos que tarda un programa', 'Cómo crece el coste según el tamaño de la entrada', 'El número de líneas de código'], 1, 'Habla de crecimiento, no de tiempos concretos.'),
        pair('Empareja cada complejidad con un ejemplo.', [['O(1)', 'Leer arr[3]'], ['O(n)', 'Recorrer un array con for'], ['O(log n)', 'Búsqueda binaria'], ['O(n²)', 'Dos bucles anidados sobre n']], 'Conocer estos casos permite estimar el coste de un algoritmo.'),
        mc('Dos bucles for anidados que recorren n elementos cada uno son...', ['O(n)', 'O(n²)', 'O(log n)'], 1, 'Se hacen n · n iteraciones.'),
        out('¿Cuántos pasos usa la búsqueda binaria?', 'function bin(arr, x) {\n  let lo = 0, hi = arr.length - 1, pasos = 0;\n  while (lo <= hi) {\n    pasos++;\n    const mid = Math.floor((lo + hi) / 2);\n    if (arr[mid] === x) return pasos;\n    if (arr[mid] < x) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}\nconsole.log(bin([1, 3, 5, 7, 9, 11, 13], 13));', '3', 'Mira las posiciones 3, 5 y 6: encuentra el 13 en el tercer paso.'),
        tf('La búsqueda binaria solo funciona si el array está ordenado.', true, 'Sin orden no se puede descartar una mitad con seguridad.'),
        fill('Calcula el índice central.', 'const mid = Math.___((lo + hi) / 2);', 'floor', 'floor redondea hacia abajo para obtener un índice entero.'),
        out('¿Qué imprime?', 'console.log([4, 5, 6].indexOf(9));', '-1', 'La búsqueda lineal (O(n)) devuelve -1 cuando no encuentra el valor.'),
      ] },
    { id: 'l2', title: 'Ordenamiento, pilas y colas', intro:
      '`sort()` sin función compara como **texto**. Para números pasa un comparador.\n\n' +
      T + '\n[10, 9, 1].sort();               // [1, 10, 9]\n[10, 9, 1].sort((a, b) => a - b); // [1, 9, 10]\n' + T + '\n\nUna **pila** es LIFO (`push`/`pop`); una **cola** es FIFO (`push`/`shift`). Ordenamientos simples como burbuja son `O(n²)`; merge sort y quicksort rondan `O(n log n)`.',
      ex: [
        out('¿Qué imprime?', 'console.log([10, 9, 1].sort().join());', '1,10,9', 'Sin comparador ordena como texto: "1" < "10" < "9".'),
        out('¿Qué imprime?', 'console.log([10, 9, 1].sort((a, b) => a - b).join());', '1,9,10', 'El comparador a - b ordena numéricamente de menor a mayor.'),
        mc('¿Qué complejidad típica tiene merge sort?', ['O(n)', 'O(n log n)', 'O(n²)'], 1, 'Divide a la mitad (log n niveles) y mezcla en O(n) cada nivel.'),
        out('¿Qué imprime?', 'const p = [];\np.push(1);\np.push(2);\np.push(3);\nconsole.log(p.pop(), p.length);', '3 2', 'En una pila sale primero el último en entrar.'),
        out('¿Qué imprime?', 'const q = [1, 2, 3];\nq.push(4);\nconsole.log(q.shift(), q.join());', '1 2,3,4', 'En una cola sale primero el primero en entrar.'),
        pair('Empareja cada estructura u operación.', [['Pila', 'LIFO: el último en entrar sale primero'], ['Cola', 'FIFO: el primero en entrar sale primero'], ['pop()', 'Saca el último elemento'], ['shift()', 'Saca el primer elemento']], 'Son estructuras básicas para recorridos, historiales y tareas pendientes.'),
        tf('Para comprobar si los paréntesis de una expresión están balanceados se usa típicamente una pila.', true, 'Se apila cada apertura y se desapila al encontrar su cierre.'),
      ] },
    { id: 'l3', title: 'Reto: memoización y dos punteros', intro:
      'La **memoización** guarda resultados ya calculados para no repetir trabajo: cambia memoria por tiempo.\n\n' +
      'La técnica de **dos punteros** usa dos índices que se mueven por el array (por ejemplo, uno desde cada extremo) para resolver problemas en `O(n)` sin bucles anidados.\n\n' +
      T + '\nlet i = 0, j = arr.length - 1;\nwhile (i < j) { /* decide a cuál mover */ }\n' + T,
      ex: [
        mc('¿Qué hace la memoización?', ['Guarda resultados ya calculados para reutilizarlos', 'Borra la memoria no usada', 'Convierte código recursivo en asíncrono'], 0, 'Si se repite la misma entrada, devuelve el valor guardado.'),
        out('¿Cuántas llamadas hace fib(10) con memo?', 'const memo = new Map();\nlet llamadas = 0;\nfunction fib(n) {\n  llamadas++;\n  if (n < 2) return n;\n  if (memo.has(n)) return memo.get(n);\n  const v = fib(n - 1) + fib(n - 2);\n  memo.set(n, v);\n  return v;\n}\nconsole.log(fib(10), llamadas);', '55 19', 'Sin memo serían 177 llamadas; con memo solo 19.'),
        tf('La memoización gasta más memoria para ahorrar tiempo de cálculo.', true, 'Es el clásico intercambio espacio-tiempo.'),
        fill('Coloca el puntero derecho en el último índice.', 'let j = arr.length - ___;', '1', 'El último elemento está en la posición length - 1.'),
        mc('¿Qué requisito suele tener el problema de dos punteros "buscar dos números que sumen un objetivo"?', ['El array debe estar ordenado', 'El array debe tener longitud par', 'Los números deben ser enteros positivos'], 0, 'Con el array ordenado, si la suma es grande se mueve el puntero derecho; si es pequeña, el izquierdo.'),
        run('Escribe tieneSuma(arr, objetivo) sobre un array ORDENADO con dos punteros: true si dos elementos suman objetivo.', 'function tieneSuma(arr, objetivo) {\n  let i = 0, j = arr.length - 1;\n  \n  return false;\n}', [['tieneSuma([1,2,4,7,11], 9)', 'true'], ['tieneSuma([1,2,3], 10)', 'false'], ['tieneSuma([], 0)', 'false']], 'Mientras i < j: si la suma es menor mueve i, si es mayor mueve j.', 'function tieneSuma(arr, objetivo) {\n  let i = 0, j = arr.length - 1;\n  while (i < j) {\n    const s = arr[i] + arr[j];\n    if (s === objetivo) return true;\n    if (s < objetivo) i++; else j--;\n  }\n  return false;\n}'),
        run('Escribe esPalindromo(s) con dos punteros desde los extremos.', 'function esPalindromo(s) {\n  \n}', [['esPalindromo("ana")', 'true'], ['esPalindromo("hola")', 'false'], ['esPalindromo("")', 'true']], 'Compara s[i] con s[j] y acércalos hasta que se crucen.', 'function esPalindromo(s) {\n  let i = 0, j = s.length - 1;\n  while (i < j) {\n    if (s[i] !== s[j]) return false;\n    i++; j--;\n  }\n  return true;\n}'),
      ] },
  ]},

  // ───────────── UNIDAD 13 ─────────────
  { id: 'u13', title: 'Calidad y arquitectura', desc: 'Pruebas, errores, patrones, TypeScript, rendimiento y seguridad', lessons: [
    { id: 'l1', title: 'Pruebas y errores', intro:
      'Una **prueba unitaria** verifica una pieza pequeña de código de forma aislada. Suele seguir el patrón AAA: **Arrange** (preparar), **Act** (actuar), **Assert** (verificar).\n\n' +
      T + '\ntest("suma", () => {\n  expect(suma(2, 3)).toBe(5);\n});\n' + T + '\n\nPara los errores usa `try/catch` y lanza siempre objetos `Error` (o subclases propias).',
      ex: [
        mc('¿Qué comprueba una prueba unitaria?', ['Toda la aplicación como un usuario real', 'Una pieza pequeña de código aislada', 'El diseño visual'], 1, 'Unitaria = una unidad (función, clase) por separado.'),
        out('¿Qué imprime?', 'try {\n  JSON.parse("{mal");\n} catch (e) {\n  console.log(e.name);\n}', 'SyntaxError', 'JSON.parse lanza un SyntaxError si el texto no es JSON válido.'),
        out('¿Qué imprime?', 'class ValidacionError extends Error {\n  constructor(m) { super(m); this.name = "ValidacionError"; }\n}\ntry {\n  throw new ValidacionError("edad inválida");\n} catch (e) {\n  console.log(`${e.name}: ${e.message}`, e instanceof Error);\n}', 'ValidacionError: edad inválida true', 'Una subclase de Error sigue siendo instancia de Error.'),
        order('Ordena las fases del patrón AAA.', ['Arrange', 'Act', 'Assert'], 'Se prepara el escenario, se ejecuta la acción y se verifica el resultado.'),
        fill('Completa la aserción.', 'expect(suma(2, 3)).___(5);', 'toBe', 'toBe compara con igualdad estricta.'),
        tf('Es buena práctica lanzar textos sueltos con throw "error".', false, 'Un Error incluye mensaje y pila de llamadas, esenciales para depurar.'),
        pair('Empareja cada tipo de prueba con su alcance.', [['Unitaria', 'Una función aislada'], ['Integración', 'Varias piezas trabajando juntas'], ['End-to-end', 'Flujo completo como un usuario'], ['TDD', 'Escribir la prueba antes del código']], 'Una buena suite combina las tres, con más pruebas unitarias.'),
      ] },
    { id: 'l2', title: 'Patrones de diseño', intro:
      'Los **patrones** son soluciones reutilizables a problemas comunes.\n\n' +
      '- **Módulo**: encapsula estado privado con una closure.\n- **Observer**: unos objetos se suscriben y otro los notifica.\n- **Factory**: una función que construye objetos.\n\n' +
      T + '\nconst contador = (() => {\n  let n = 0;\n  return { inc: () => ++n };\n})();\n' + T,
      ex: [
        out('¿Qué imprime?', 'const contador = (() => {\n  let n = 0;\n  return { inc: () => ++n, valor: () => n };\n})();\ncontador.inc();\ncontador.inc();\nconsole.log(contador.valor());', '2', 'n es privada: solo se accede mediante los métodos expuestos.'),
        out('¿Qué imprime?', 'const obs = [];\nconst suscribir = f => obs.push(f);\nconst emitir = d => obs.forEach(f => f(d));\nsuscribir(d => console.log("A", d));\nsuscribir(d => console.log("B", d));\nemitir(7);', 'A 7\nB 7', 'emitir avisa a todos los suscriptores en el orden en que se registraron.'),
        out('¿Qué imprime?', 'const crearUsuario = (n, rol = "user") => ({ n, rol, saludo: () => `Soy ${n} (${rol})` });\nconsole.log(crearUsuario("Ana").saludo());', 'Soy Ana (user)', 'La factory devuelve un objeto ya configurado, con rol por defecto.'),
        pair('Empareja cada patrón con su propósito.', [['Módulo', 'Encapsular estado privado'], ['Observer', 'Notificar a suscriptores'], ['Factory', 'Crear objetos configurados'], ['Singleton', 'Una única instancia compartida']], 'Cada patrón organiza el código para un tipo de problema.'),
        mc('¿Para qué sirve típicamente el patrón Observer?', ['Para gestionar eventos y notificaciones', 'Para ordenar arrays', 'Para validar tipos'], 0, 'addEventListener es un ejemplo de observer integrado en el navegador.'),
        fill('Convierte la función en una IIFE (se ejecuta al instante).', '(() => {\n  console.log("hola");\n})___;', '()', 'Al añadir () tras la función entre paréntesis se invoca de inmediato.'),
        tf('Una factory permite crear objetos sin que quien llama use new directamente.', true, 'Oculta los detalles de construcción detrás de una función.'),
      ] },
    { id: 'l3', title: 'Reto: TypeScript, rendimiento y XSS', intro:
      '**TypeScript** añade tipos estáticos a JavaScript y se compila a JS: `function suma(a: number, b: number): number`.\n\n' +
      'En **rendimiento**, evita trabajo repetido: `debounce` (esperar a que el usuario pare de teclear), memoización, carga perezosa.\n\n' +
      'El **XSS** ocurre cuando se inserta contenido no confiable como HTML y se ejecuta un script del atacante. Defensa: `textContent` o **escapar** los caracteres `& < > " \'`.',
      ex: [
        mc('¿Qué aporta TypeScript?', ['Tipos estáticos que se comprueban al compilar', 'Un navegador más rápido', 'Reemplaza a npm'], 0, 'Detecta errores de tipos antes de ejecutar y genera JavaScript normal.'),
        fill('Anota el tipo del segundo parámetro.', 'function suma(a: number, b: ___): number { return a + b; }', 'number', 'En TypeScript el tipo se escribe tras dos puntos.'),
        mc('¿Qué es un ataque XSS?', ['Inyectar scripts en una página mediante contenido no confiable', 'Saturar el servidor con peticiones', 'Robar la contraseña por fuerza bruta'], 0, 'El script del atacante se ejecuta con los permisos de la página.'),
        mc('Para mostrar un comentario escrito por un usuario, ¿qué es lo más seguro?', ['el.innerHTML = comentario', 'el.textContent = comentario', 'eval(comentario)'], 1, 'textContent lo inserta como texto plano, sin interpretar etiquetas.'),
        tf('Un debounce ejecuta la función solo cuando el usuario deja de disparar el evento durante un rato.', true, 'Es ideal para búsquedas mientras se escribe.'),
        pair('Empareja cada técnica con su objetivo.', [['Debounce', 'Esperar a que cesen los eventos'], ['Lazy loading', 'Cargar recursos solo cuando hacen falta'], ['Memoización', 'Cachear resultados calculados'], ['Escapar HTML', 'Neutralizar contenido no confiable']], 'Unas mejoran el rendimiento y otras la seguridad.'),
        run('Escribe escaparHTML(s): reemplaza & < > " \' por sus entidades (&amp; &lt; &gt; &quot; &#39;).', 'function escaparHTML(s) {\n  \n}', [['escaparHTML("<b>")', '"&lt;b&gt;"'], ['escaparHTML(\'a & "b"\')', '"a &amp; &quot;b&quot;"'], ['escaparHTML("<script>")', '"&lt;script&gt;"']], 'Reemplaza & primero; si no, duplicarías el & de las otras entidades.', 'function escaparHTML(s) {\n  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\'/g, "&#39;");\n}'),
      ] },
  ]},
);
})();
