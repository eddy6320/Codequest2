(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair, run } = CQ.h;

const T = '```';

CQ.content.javascript = {
  id: 'javascript', name: 'JavaScript', emoji: '🟨', color: '#d4a900',
  tagline: 'El lenguaje de la web, de cero a avanzado',
  runner: 'js',
  units: [
    // ───────────── UNIDAD 1 ─────────────
    { id: 'u1', title: 'Primeros pasos', desc: 'console.log, comentarios y punto y coma', lessons: [
      { id: 'l1', title: 'Hola, consola', intro:
        'JavaScript es el lenguaje que da vida a las páginas web. Para mostrar algo en la **consola** usamos `console.log`.\n\n' +
        T + '\nconsole.log("Hola, mundo");\nconsole.log(2 + 3);\n' + T + '\n\nEl texto va entre comillas (simples o dobles). Los números y las operaciones van sin comillas.',
        ex: [
          mc('¿Qué instrucción muestra un mensaje en la consola de JavaScript?', ['print("hola")', 'console.log("hola")', 'echo "hola"'], 1, 'En JavaScript se usa console.log(...).'),
          out('¿Qué imprime este código?', 'console.log("Hola");', 'Hola', 'Muestra el texto sin las comillas.'),
          fill('Completa para imprimir el texto Hola.', 'console.log(___);', ['"Hola"', "'Hola'"], 'El texto debe ir entre comillas.'),
          tf('Un texto en JavaScript debe ir entre comillas.', true, 'Sin comillas, JavaScript pensaría que es el nombre de una variable.'),
          order('Ordena las fichas para imprimir "Hola".', ['console', '.', 'log', '(', '"Hola"', ')', ';'], 'Objeto console, punto, método log y el argumento entre paréntesis.'),
          out('¿Qué imprime?', 'console.log(2 + 3);', '5', 'Sin comillas, JavaScript calcula la suma.'),
        ] },
      { id: 'l2', title: 'Comentarios y punto y coma', intro:
        'Los **comentarios** son notas que JavaScript ignora.\n\n' +
        T + '\n// comentario de una línea\n/* comentario\n   de varias líneas */\nconsole.log("a"); // se ejecuta\n' + T + '\n\nEl punto y coma `;` marca el final de una instrucción. Es casi opcional, pero conviene usarlo.',
        ex: [
          mc('¿Cómo se escribe un comentario de una línea?', ['# comentario', '// comentario', '-- comentario'], 1, 'Los comentarios de línea empiezan con //.'),
          out('¿Qué imprime?', '// console.log("uno");\nconsole.log("dos");', 'dos', 'La primera línea es un comentario y no se ejecuta.'),
          fill('Completa el comentario de varias líneas.', '/* Esto es\n   un comentario ___', '*/', 'Un comentario /* ... */ se cierra con */.'),
          tf('Los comentarios cambian lo que hace el programa.', false, 'JavaScript los ignora por completo.'),
          out('¿Qué imprime?', 'console.log("a");\nconsole.log("b");', 'a\nb', 'Cada console.log escribe en una línea nueva.'),
          pair('Empareja cada símbolo con su función.', [['//', 'Comentario de una línea'], ['/* */', 'Comentario de varias líneas'], [';', 'Fin de instrucción'], ['console.log', 'Muestra en consola']], 'Son los elementos básicos de cualquier programa.'),
        ] },
      { id: 'l3', title: 'Reto: tu primer programa', intro:
        'Hora de combinar lo aprendido: `console.log`, comentarios y `;`.\n\nEn el último ejercicio guardarás un texto en una variable con `const nombre = valor;`. Verás las variables a fondo en la próxima unidad.',
        ex: [
          out('¿Qué imprime?', 'console.log("Hola"); // saludo\nconsole.log(10 - 4);', 'Hola\n6', 'El comentario final se ignora; 10 - 4 es 6.'),
          order('Ordena para imprimir la suma de 1 y 2.', ['console', '.', 'log', '(', '1 + 2', ')', ';'], 'La expresión 1 + 2 se evalúa y se imprime 3.'),
          mc('¿Qué línea tiene un error?', ['console.log("ok");', 'console.log("ok);', '// console.log("ok");'], 1, 'Falta cerrar las comillas del texto.'),
          fill('Completa para que se imprima 12.', 'console.log(3 ___ 4);', '*', 'El operador de multiplicación es *.'),
          out('¿Qué imprime?', 'console.log("2" + "3");', '23', 'Con textos, + los une (concatena) en lugar de sumar.'),
          run('Guarda el texto "Hola, JS" en la constante mensaje.', 'const mensaje = ;', [['mensaje', '"Hola, JS"']], 'Asigna el texto entre comillas después del =.', 'const mensaje = "Hola, JS";'),
        ] },
    ]},
    // ───────────── UNIDAD 2 ─────────────
    { id: 'u2', title: 'Variables y tipos', desc: 'let, const, tipos de datos y template literals', lessons: [
      { id: 'l1', title: 'let y const', intro:
        'Una **variable** guarda un valor con nombre.\n\n' +
        T + '\nlet edad = 20;\nedad = 21;       // let permite cambiar\nconst pi = 3.14; // const NO permite cambiar\n' + T + '\n\nUsa `const` por defecto y `let` solo cuando el valor deba cambiar. Reasignar una `const` da error.',
        ex: [
          mc('¿Qué palabra declara una variable que puede cambiar?', ['const', 'let', 'fixed'], 1, 'let permite reasignar el valor.'),
          out('¿Qué imprime?', 'let x = 5;\nx = 8;\nconsole.log(x);', '8', 'x se reasigna a 8 antes de imprimir.'),
          tf('Se puede reasignar una variable declarada con const.', false, 'Intentarlo lanza un TypeError.'),
          fill('Declara una constante llamada pi.', '___ pi = 3.14;', 'const', 'Para valores fijos usa const.'),
          order('Ordena para declarar edad con valor 20.', ['let', 'edad', '=', '20', ';'], 'Palabra clave, nombre, =, valor y punto y coma.'),
          out('¿Qué imprime?', 'let a = 2;\nlet b = a + 3;\na = 10;\nconsole.log(b);', '5', 'b se calculó cuando a valía 2; cambiar a después no afecta a b.'),
        ] },
      { id: 'l2', title: 'Tipos de datos', intro:
        'Los valores tienen **tipo**:\n\n- `number`: `42`, `3.5`\n- `string`: `"hola"`\n- `boolean`: `true` / `false`\n\n' +
        'El operador `typeof` te dice el tipo. Ojo: `+` suma números pero une textos.\n\n' +
        T + '\nconsole.log(typeof 42);   // number\nconsole.log("5" + 3);     // 53\n' + T,
        ex: [
          out('¿Qué imprime?', 'console.log(typeof 42);', 'number', 'Los números enteros y decimales son de tipo number.'),
          out('¿Qué imprime?', 'console.log(typeof "42");', 'string', 'Entre comillas es un string, aunque parezca número.'),
          mc('¿De qué tipo es true?', ['string', 'number', 'boolean'], 2, 'true y false son booleanos.'),
          out('¿Qué imprime?', 'console.log("5" + 3);', '53', 'Si uno de los operandos es texto, + concatena.'),
          out('¿Qué imprime?', 'console.log(5 + 3);', '8', 'Dos números se suman.'),
          pair('Empareja cada valor con su tipo.', [['42', 'number'], ['"hola"', 'string'], ['false', 'boolean'], ['undefined', 'undefined']], 'typeof devuelve estos nombres en minúsculas.'),
        ] },
      { id: 'l3', title: 'Reto: template literals', intro:
        'Los **template literals** usan comillas invertidas y permiten insertar valores con `${ }`.\n\n' +
        T + '\nconst nombre = "Ana";\nconsole.log(`Hola, ${nombre}!`);\nconsole.log(`2 + 3 = ${2 + 3}`);\n' + T + '\n\nSon más cómodos que concatenar con `+`.',
        ex: [
          out('¿Qué imprime?', 'const n = "Luis";\nconsole.log(`Hola, ${n}`);', 'Hola, Luis', '${n} se sustituye por el valor de n.'),
          out('¿Qué imprime?', 'console.log(`${2 * 4} manzanas`);', '8 manzanas', 'Dentro de ${} puede ir cualquier expresión.'),
          mc('¿Qué comillas se usan en un template literal?', ['"comillas dobles"', "'comillas simples'", '`comillas invertidas`'], 2, 'Solo las comillas invertidas admiten ${}.'),
          fill('Inserta la variable nombre en el texto.', 'console.log(`Hola ___`);', '${nombre}', 'La sintaxis de interpolación es ${variable}.'),
          order('Ordena para imprimir "Edad: 30".', ['const edad = 30;', 'console.log(', '`Edad: ${edad}`', ');'], 'Primero se declara la variable y luego se usa en el template.'),
          run('Crea saludo con el texto "Hola, Ana!" usando nombre.', 'const nombre = "Ana";\nconst saludo = ;', [['saludo', '"Hola, Ana!"']], 'Usa comillas invertidas y ${nombre}.', 'const nombre = "Ana";\nconst saludo = `Hola, ${nombre}!`;'),
        ] },
    ]},
    // ───────────── UNIDAD 3 ─────────────
    { id: 'u3', title: 'Decisiones', desc: 'Comparaciones, if/else, ternario y operadores lógicos', lessons: [
      { id: 'l1', title: '=== frente a ==', intro:
        'Para comparar hay dos formas:\n\n- `===` igualdad **estricta**: compara valor y tipo.\n- `==` igualdad **laxa**: convierte tipos antes de comparar.\n\n' +
        T + '\nconsole.log(5 === "5"); // false\nconsole.log(5 == "5");  // true\n' + T + '\n\nRegla de oro: usa siempre `===` y `!==`.',
        ex: [
          out('¿Qué imprime?', 'console.log(5 === "5");', 'false', 'Un number y un string son de tipos distintos.'),
          out('¿Qué imprime?', 'console.log(5 == "5");', 'true', '== convierte "5" a número antes de comparar.'),
          mc('¿Qué operador se recomienda para comparar?', ['==', '===', '='], 1, '=== evita conversiones sorprendentes.'),
          tf('El operador = sirve para comparar dos valores.', false, '= asigna; para comparar se usa === .'),
          fill('Completa para comprobar que a es distinto de b (estricto).', 'console.log(a ___ b);', '!==', '!== es la desigualdad estricta.'),
          out('¿Qué imprime?', 'console.log(10 > 3);', 'true', 'Los operadores > < >= <= devuelven booleanos.'),
        ] },
      { id: 'l2', title: 'if, else y ternario', intro:
        '`if` ejecuta código solo si la condición es verdadera.\n\n' +
        T + '\nif (nota >= 5) {\n  console.log("Aprobado");\n} else {\n  console.log("Suspenso");\n}\n\nconst msg = nota >= 5 ? "Aprobado" : "Suspenso";\n' + T + '\n\nEl **ternario** `cond ? a : b` es un if en una sola expresión.',
        ex: [
          out('¿Qué imprime?', 'const n = 7;\nif (n > 5) {\n  console.log("grande");\n} else {\n  console.log("pequeño");\n}', 'grande', 'La condición 7 > 5 es verdadera.'),
          out('¿Qué imprime?', 'const edad = 15;\nconsole.log(edad >= 18 ? "adulto" : "menor");', 'menor', '15 >= 18 es falso, así que se elige el valor tras los dos puntos.'),
          fill('Completa el operador ternario.', 'const r = 4 > 2 ? "si" ___ "no";', ':', 'La sintaxis es condicion ? valorSiTrue : valorSiFalse.'),
          order('Ordena el if/else.', ['if (x > 0) {', 'console.log("positivo");', '} else {', 'console.log("no positivo");', '}'], 'Primero el if, luego su bloque, después el else.'),
          mc('¿Cuándo se ejecuta el bloque else?', ['Siempre', 'Cuando la condición del if es falsa', 'Cuando hay un error'], 1, 'else es la alternativa si el if no se cumple.'),
          out('¿Qué imprime?', 'let x = 3;\nif (x > 5) {\n  console.log("A");\n} else if (x > 2) {\n  console.log("B");\n} else {\n  console.log("C");\n}', 'B', 'x > 5 es falso, pero x > 2 es verdadero, así que se imprime B.'),
        ] },
      { id: 'l3', title: 'Reto: && || ??', intro:
        'Operadores lógicos:\n\n- `&&` (y): verdadero si ambos lo son.\n- `||` (o): verdadero si alguno lo es.\n- `!` (no): invierte.\n- `??` devuelve el de la derecha solo si el izquierdo es `null` o `undefined`.\n\n' +
        T + '\nconsole.log(0 || 5);  // 5\nconsole.log(0 ?? 5);  // 0\n' + T + '\n\n`||` trata `0` y `""` como falsos; `??` no.',
        ex: [
          out('¿Qué imprime?', 'console.log(true && false);', 'false', '&& exige que ambos sean verdaderos.'),
          out('¿Qué imprime?', 'console.log(false || true);', 'true', '|| basta con que uno sea verdadero.'),
          out('¿Qué imprime?', 'console.log(null ?? "defecto");', 'defecto', '?? usa el valor de la derecha si el izquierdo es null o undefined.'),
          out('¿Qué imprime?', 'console.log(0 ?? 5);', '0', '0 no es null ni undefined, así que ?? lo conserva.'),
          pair('Empareja cada operador con su significado.', [['&&', 'Y lógico'], ['||', 'O lógico'], ['!', 'Negación'], ['??', 'Valor por defecto si null/undefined']], 'Son la base de las condiciones compuestas.'),
          run('Guarda en categoria "adulto" si edad >= 18 y "menor" si no.', 'const edad = 20;\nconst categoria = ;', [['categoria', '"adulto"']], 'Usa el ternario: edad >= 18 ? "adulto" : "menor".', 'const edad = 20;\nconst categoria = edad >= 18 ? "adulto" : "menor";'),
        ] },
    ]},
    // ───────────── UNIDAD 4 ─────────────
    { id: 'u4', title: 'Bucles', desc: 'for, while y for...of', lessons: [
      { id: 'l1', title: 'El bucle for', intro:
        'Un `for` repite código. Tiene tres partes: inicio, condición y paso.\n\n' +
        T + '\nfor (let i = 0; i < 3; i++) {\n  console.log(i);\n}\n' + T + '\n\nImprime 0, 1 y 2. `i++` suma 1 a `i` en cada vuelta. El bucle termina cuando la condición es falsa.',
        ex: [
          out('¿Qué imprime?', 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}', '0\n1\n2', 'i vale 0, 1 y 2; con 3 la condición falla.'),
          out('¿Qué imprime?', 'let suma = 0;\nfor (let i = 1; i <= 4; i++) {\n  suma += i;\n}\nconsole.log(suma);', '10', '1 + 2 + 3 + 4 = 10.'),
          mc('¿Qué hace i++?', ['Resta 1 a i', 'Suma 1 a i', 'Multiplica i por 2'], 1, 'i++ incrementa i en una unidad.'),
          fill('Completa la condición para repetir 5 veces (i de 0 a 4).', 'for (let i = 0; ___; i++) {}', 'i < 5', 'Mientras i sea menor que 5 se repite.'),
          order('Ordena las partes del for.', ['for', '(', 'let i = 0;', 'i < 3;', 'i++', ')', '{ }'], 'Inicio, condición y paso, separados por ;.'),
          tf('Un for siempre se ejecuta al menos una vez.', false, 'Si la condición es falsa desde el principio, no entra nunca.'),
        ] },
      { id: 'l2', title: 'while y break', intro:
        '`while` repite mientras la condición sea verdadera. Úsalo cuando no sabes cuántas vueltas habrá.\n\n' +
        T + '\nlet n = 1;\nwhile (n < 100) {\n  n *= 2;\n}\nconsole.log(n); // 128\n' + T + '\n\n`break` sale del bucle y `continue` salta a la siguiente vuelta. Cuidado con los bucles infinitos.',
        ex: [
          out('¿Qué imprime?', 'let n = 1;\nwhile (n < 100) {\n  n *= 2;\n}\nconsole.log(n);', '128', 'n vale 1, 2, 4, 8, 16, 32, 64 y 128; con 128 se detiene.'),
          out('¿Qué imprime?', 'let c = 3;\nwhile (c > 0) {\n  console.log(c);\n  c--;\n}', '3\n2\n1', 'Cuenta atrás hasta que c deja de ser mayor que 0.'),
          out('¿Qué imprime?', 'for (let i = 0; i < 10; i++) {\n  if (i === 2) break;\n  console.log(i);\n}', '0\n1', 'break termina el bucle al llegar i a 2.'),
          out('¿Qué imprime?', 'for (let i = 0; i < 4; i++) {\n  if (i === 1) continue;\n  console.log(i);\n}', '0\n2\n3', 'continue se salta solo la vuelta en que i vale 1.'),
          fill('Completa para salir del bucle.', 'while (true) {\n  ___;\n}', 'break', 'break interrumpe el bucle.'),
          mc('¿Qué problema tiene este código?', ['Imprime números negativos', 'Es un bucle infinito', 'No compila'], 1, 'n nunca cambia, así que n < 5 siempre es verdadero.', 'let n = 0;\nwhile (n < 5) {\n  console.log(n);\n}'),
        ] },
      { id: 'l3', title: 'Reto: for...of', intro:
        '`for...of` recorre los elementos de un array directamente.\n\n' +
        T + '\nconst frutas = ["pera", "uva"];\nfor (const f of frutas) {\n  console.log(f);\n}\n' + T + '\n\nSin índices ni condiciones: más claro y menos propenso a errores. Un array se escribe con corchetes `[ ]`.',
        ex: [
          out('¿Qué imprime?', 'for (const c of ["a", "b", "c"]) {\n  console.log(c);\n}', 'a\nb\nc', 'c toma cada elemento del array en orden.'),
          out('¿Qué imprime?', 'let total = 0;\nfor (const n of [5, 10, 15]) {\n  total += n;\n}\nconsole.log(total);', '30', '5 + 10 + 15 = 30.'),
          fill('Completa el for...of.', 'for (const x ___ [1, 2, 3]) {}', 'of', 'La palabra clave es of.'),
          order('Ordena para recorrer nums e imprimir cada n.', ['for (const n of nums) {', 'console.log(n);', '}'], 'Cabecera, cuerpo y cierre de llave.'),
          mc('¿Cuándo es mejor for...of que for clásico?', ['Cuando necesitas todos los elementos sin usar el índice', 'Nunca', 'Solo con números'], 0, 'for...of simplifica recorrer elementos uno a uno.'),
          run('Suma los números de nums en la variable suma con un bucle.', 'const nums = [1, 2, 3, 4];\nlet suma = 0;\n', [['suma', '10']], 'Recorre nums con for...of y acumula en suma.', 'const nums = [1, 2, 3, 4];\nlet suma = 0;\nfor (const n of nums) {\n  suma += n;\n}'),
        ] },
    ]},
    // ───────────── UNIDAD 5 ─────────────
    { id: 'u5', title: 'Funciones', desc: 'Declaraciones, flechas, parámetros, return y closures', lessons: [
      { id: 'l1', title: 'Declarar y llamar funciones', intro:
        'Una **función** agrupa código reutilizable.\n\n' +
        T + '\nfunction saludar(nombre) {\n  return "Hola, " + nombre;\n}\nconsole.log(saludar("Ana"));\n' + T + '\n\n`nombre` es un **parámetro**; `"Ana"` es el **argumento**. `return` devuelve un resultado y termina la función. Sin `return`, devuelve `undefined`.',
        ex: [
          mc('¿Qué palabra declara una función clásica?', ['func', 'function', 'def'], 1, 'Se escribe function nombre(parámetros) { ... }.'),
          out('¿Qué imprime?', 'function doble(n) {\n  return n * 2;\n}\nconsole.log(doble(4));', '8', 'doble(4) devuelve 4 * 2.'),
          out('¿Qué imprime?', 'function f() {\n  const x = 1;\n}\nconsole.log(f());', 'undefined', 'Sin return, la función devuelve undefined.'),
          fill('Completa para que la función devuelva a + b.', 'function suma(a, b) {\n  ___ a + b;\n}', 'return', 'return devuelve el valor al que llamó.'),
          tf('Una función se ejecuta en el momento de declararla.', false, 'Solo se ejecuta cuando la llamas: suma(1, 2).'),
          order('Ordena la declaración de la función cuadrado.', ['function cuadrado(n) {', 'return n * n;', '}'], 'Cabecera, return y cierre.'),
        ] },
      { id: 'l2', title: 'Funciones flecha y parámetros', intro:
        'Las **funciones flecha** son una forma corta de escribir funciones.\n\n' +
        T + '\nconst doble = (n) => n * 2;\nconst suma = (a, b) => {\n  return a + b;\n};\nfunction saludar(nombre = "amigo") {\n  return "Hola, " + nombre;\n}\n' + T + '\n\nSi el cuerpo es una sola expresión, el `return` es implícito. Un parámetro puede tener **valor por defecto**.',
        ex: [
          out('¿Qué imprime?', 'const triple = (n) => n * 3;\nconsole.log(triple(5));', '15', 'La flecha devuelve n * 3 sin necesidad de return.'),
          out('¿Qué imprime?', 'function saludar(n = "amigo") {\n  return "Hola, " + n;\n}\nconsole.log(saludar());', 'Hola, amigo', 'Sin argumento se usa el valor por defecto.'),
          fill('Completa la función flecha.', 'const suma = (a, b) ___ a + b;', '=>', 'La flecha se escribe =>.'),
          mc('¿Cuál es equivalente a function(n) { return n + 1; }?', ['(n) => n + 1', '(n) -> n + 1', 'n => { n + 1 }'], 0, 'La última opción no devuelve nada porque las llaves exigen return.'),
          order('Ordena la función flecha cuadrado.', ['const cuadrado', '=', '(n)', '=>', 'n * n', ';'], 'Nombre, asignación, parámetros, flecha y cuerpo.'),
          out('¿Qué imprime?', 'const resta = (a, b) => a - b;\nconsole.log(resta(10, 3));', '7', '10 - 3 = 7.'),
        ] },
      { id: 'l3', title: 'Reto: closures', intro:
        'Una función recuerda las variables del lugar donde nació. Eso es un **closure**.\n\n' +
        T + '\nfunction contador() {\n  let c = 0;\n  return () => ++c;\n}\nconst a = contador();\na();\nconsole.log(a()); // 2\n' + T + '\n\nCada llamada a `contador()` crea su propio `c` privado.',
        ex: [
          out('¿Qué imprime?', 'function contador() {\n  let c = 0;\n  return () => ++c;\n}\nconst a = contador();\na();\nconsole.log(a());', '2', 'c vive dentro del closure y se mantiene entre llamadas.'),
          out('¿Qué imprime?', 'function sumador(x) {\n  return (y) => x + y;\n}\nconst suma5 = sumador(5);\nconsole.log(suma5(3));', '8', 'La función interna recuerda x = 5.'),
          out('¿Qué imprime?', 'function c() {\n  let n = 0;\n  return () => ++n;\n}\nconst a = c();\nconst b = c();\na();\na();\nconsole.log(b());', '1', 'a y b tienen cada uno su propio n.'),
          mc('¿Qué es un closure?', ['Una función que recuerda las variables de su entorno', 'Un bucle que se cierra', 'Un error de sintaxis'], 0, 'La función conserva acceso a su ámbito de origen.'),
          tf('Una variable declarada dentro de una función es visible desde fuera.', false, 'Es local a la función; solo los closures pueden conservarla.'),
          run('Escribe la función cuadrado(n) que devuelva n al cuadrado.', 'function cuadrado(n) {\n  \n}', [['cuadrado(3)', '9'], ['cuadrado(-4)', '16'], ['cuadrado(0)', '0']], 'Devuelve n * n con return.', 'function cuadrado(n) {\n  return n * n;\n}'),
        ] },
    ]},
    // ───────────── UNIDAD 6 ─────────────
    { id: 'u6', title: 'Arrays y objetos', desc: 'map, filter, reduce, destructuring, spread y métodos', lessons: [
      { id: 'l1', title: 'Arrays y métodos funcionales', intro:
        'Un **array** guarda una lista: `[10, 20, 30]`. Se accede por índice desde 0 y `length` da su tamaño.\n\n' +
        T + '\nconst n = [1, 2, 3, 4];\nn.map(x => x * 2);          // [2,4,6,8]\nn.filter(x => x % 2 === 0); // [2,4]\nn.reduce((acc, x) => acc + x, 0); // 10\n' + T + '\n\n`map` transforma, `filter` selecciona y `reduce` acumula. Ninguno modifica el original.',
        ex: [
          out('¿Qué imprime?', 'const a = [10, 20, 30];\nconsole.log(a[1]);', '20', 'Los índices empiezan en 0, así que a[1] es el segundo.'),
          out('¿Qué imprime?', 'console.log([1, 2, 3].map(x => x * 2).join(","));', '2,4,6', 'map duplica cada elemento y join los une con comas.'),
          out('¿Qué imprime?', 'console.log([1, 2, 3, 4, 5].filter(x => x > 2).length);', '3', 'Quedan 3, 4 y 5.'),
          out('¿Qué imprime?', 'console.log([1, 2, 3, 4].reduce((acc, x) => acc + x, 0));', '10', 'acc empieza en 0 y va sumando cada elemento.'),
          pair('Empareja cada método con lo que hace.', [['map', 'Transforma cada elemento'], ['filter', 'Se queda con los que cumplen'], ['reduce', 'Acumula en un solo valor'], ['push', 'Añade al final']], 'Son los métodos de array más usados.'),
          fill('Completa para quedarte con los números pares.', 'const pares = [1, 2, 3, 4].___(n => n % 2 === 0);', 'filter', 'filter conserva los elementos cuya función devuelve true.'),
        ] },
      { id: 'l2', title: 'Objetos, destructuring y spread', intro:
        'Un **objeto** agrupa pares clave: valor.\n\n' +
        T + '\nconst p = { nombre: "Ana", edad: 30 };\nconsole.log(p.nombre);\nconst { nombre, edad } = p;   // destructuring\nconst q = { ...p, edad: 31 }; // spread: copia y cambia\nconst [a, b] = [1, 2];\nObject.keys(p); // ["nombre","edad"]\n' + T,
        ex: [
          out('¿Qué imprime?', 'const p = { nombre: "Ana", edad: 30 };\nconsole.log(p.edad);', '30', 'Se accede a una propiedad con punto.'),
          out('¿Qué imprime?', 'const { x, y } = { x: 1, y: 2 };\nconsole.log(x + y);', '3', 'El destructuring crea las variables x e y.'),
          out('¿Qué imprime?', 'const a = [1, 2];\nconst b = [...a, 3];\nconsole.log(b.length);', '3', 'El spread copia 1 y 2 y luego se añade 3.'),
          out('¿Qué imprime?', 'const p = { a: 1, b: 2 };\nconsole.log(Object.keys(p).join("-"));', 'a-b', 'Object.keys devuelve las claves como array.'),
          fill('Extrae la propiedad nombre con destructuring.', 'const { ___ } = { nombre: "Ana" };', 'nombre', 'El nombre entre llaves debe coincidir con la clave.'),
          mc('¿Qué hace { ...obj, edad: 5 }?', ['Modifica obj directamente', 'Crea un objeto nuevo copiando obj y fijando edad en 5', 'Borra obj'], 1, 'El spread copia las propiedades y las siguientes sobrescriben.'),
        ] },
      { id: 'l3', title: 'Reto: transformando datos', intro:
        'Combina `filter`, `map` y `reduce` para procesar datos con poco código.\n\n' +
        T + '\nconst precios = [10, 20, 30];\nconst total = precios\n  .filter(p => p > 10)\n  .reduce((a, p) => a + p, 0); // 50\n' + T + '\n\nTambién puedes encadenar métodos sobre arrays de objetos usando `p => p.propiedad`.',
        ex: [
          out('¿Qué imprime?', 'const users = [{ n: "A", e: 20 }, { n: "B", e: 15 }];\nconsole.log(users.map(u => u.n).join(""));', 'AB', 'map extrae el nombre de cada objeto.'),
          out('¿Qué imprime?', 'const r = [1, 2, 3, 4].filter(n => n % 2 === 1).map(n => n * 10);\nconsole.log(r.join(","));', '10,30', 'Los impares son 1 y 3, que se multiplican por 10.'),
          mc('¿Qué devuelve [3, 1, 2].map(n => n + 1)?', ['[4, 2, 3]', '[3, 1, 2]', '6'], 0, 'map devuelve un array nuevo con cada elemento transformado.'),
          order('Ordena para sumar los elementos de nums.', ['nums', '.reduce(', '(acc, n) => acc + n', ',', '0', ')'], 'reduce recibe la función acumuladora y el valor inicial.'),
          tf('map modifica el array original.', false, 'map devuelve un array nuevo y deja el original intacto.'),
          run('Escribe sumaPares(arr): suma solo los números pares de arr.', 'function sumaPares(arr) {\n  \n}', [['sumaPares([1,2,3,4])', '6'], ['sumaPares([1,3,5])', '0'], ['sumaPares([])', '0']], 'Filtra los pares con n % 2 === 0 y acumula con reduce.', 'function sumaPares(arr) {\n  return arr.filter(n => n % 2 === 0).reduce((a, n) => a + n, 0);\n}'),
        ] },
    ]},
    // ───────────── UNIDAD 7 ─────────────
    { id: 'u7', title: 'Asincronía y clases', desc: 'Callbacks, Promises, async/await, class y módulos', lessons: [
      { id: 'l1', title: 'Callbacks y Promises', intro:
        'JavaScript no se queda esperando tareas lentas (red, temporizadores): usa **asincronía**.\n\n' +
        'Un **callback** es una función que se pasa para que se llame más tarde. Una **Promise** representa un valor futuro con tres estados: `pending`, `fulfilled` o `rejected`.\n\n' +
        T + '\nPromise.resolve(1).then(v => console.log(v));\nPromise.reject("fallo").catch(e => console.log(e));\n' + T + '\n\nLos `.then` se ejecutan después del código síncrono actual.',
        ex: [
          mc('¿Qué es un callback?', ['Una función que se pasa a otra para llamarla más tarde', 'Un tipo de bucle', 'Un error de red'], 0, 'Es una función entregada como argumento.'),
          mc('¿En qué estados puede estar una Promise?', ['pending, fulfilled y rejected', 'on, off y paused', 'true y false'], 0, 'Empieza pending y acaba fulfilled o rejected.'),
          fill('Completa para ejecutar algo cuando la promesa se cumpla.', 'Promise.resolve(5).___(v => console.log(v));', 'then', 'then recibe el resultado de la promesa cumplida.'),
          order('Ordena la cadena para capturar un error.', ['promesa', '.then(', 'ok', ')', '.catch(', 'err', ')'], 'then maneja el éxito y catch el error.'),
          out('¿Qué imprime?', 'console.log("A");\nPromise.resolve().then(() => console.log("B"));\nconsole.log("C");', 'A\nC\nB', 'El código síncrono (A, C) va antes que el then.'),
          pair('Empareja cada elemento con su rol.', [['then', 'Maneja el resultado correcto'], ['catch', 'Maneja el error'], ['Promise', 'Valor que llegará en el futuro'], ['callback', 'Función que se llamará después']], 'Son los bloques de la programación asíncrona.'),
        ] },
      { id: 'l2', title: 'async y await', intro:
        '`async/await` permite escribir código asíncrono con aspecto de síncrono.\n\n' +
        T + '\nasync function cargar() {\n  try {\n    const dato = await pedirDatos();\n    console.log(dato);\n  } catch (e) {\n    console.log("error");\n  }\n}\n' + T + '\n\nUna función `async` siempre devuelve una Promise. `await` pausa esa función hasta que la promesa se resuelva; solo se usa dentro de funciones `async` (o en módulos).',
        ex: [
          mc('¿Qué devuelve siempre una función async?', ['Un array', 'Una Promise', 'undefined'], 1, 'Aunque hagas return 1, recibes una Promise que se cumple con 1.'),
          fill('Completa para esperar el resultado de la promesa.', 'async function f() {\n  const v = ___ promesa;\n}', 'await', 'await espera a que la promesa se resuelva.'),
          tf('await puede usarse en cualquier función normal.', false, 'Solo dentro de funciones async (o módulos).'),
          out('¿Qué imprime?', 'async function f() {\n  return 1;\n}\nf().then(v => console.log(v));', '1', 'La promesa devuelta se cumple con 1.'),
          order('Ordena el manejo de errores con async/await.', ['try {', 'await pedir();', '} catch (e) {', 'console.log(e);', '}'], 'Errores de await se capturan con try/catch.'),
          out('¿Qué imprime?', 'async function f() {\n  console.log("dentro");\n}\nf();\nconsole.log("fuera");', 'dentro\nfuera', 'Una función async ejecuta su código síncrono hasta el primer await.'),
        ] },
      { id: 'l3', title: 'Reto: clases y módulos', intro:
        'Una **clase** es una plantilla para crear objetos.\n\n' +
        T + '\nclass Persona {\n  constructor(nombre) {\n    this.nombre = nombre;\n  }\n  saludar() {\n    return "Hola, " + this.nombre;\n  }\n}\nconst p = new Persona("Ana");\n' + T + '\n\n`constructor` inicializa; `this` es el objeto actual. `class B extends A` hereda. Los **módulos** dividen el código: `export` publica y `import` usa.',
        ex: [
          out('¿Qué imprime?', 'class Persona {\n  constructor(n) {\n    this.n = n;\n  }\n  saludar() {\n    return "Hola, " + this.n;\n  }\n}\nconsole.log(new Persona("Ana").saludar());', 'Hola, Ana', 'El constructor guarda n y saludar lo lee con this.'),
          out('¿Qué imprime?', 'class A {\n  hablar() {\n    return "A";\n  }\n}\nclass B extends A {}\nconsole.log(new B().hablar());', 'A', 'B hereda los métodos de A.'),
          fill('Crea una instancia de la clase Perro.', 'const p = ___ Perro();', 'new', 'new crea un objeto a partir de la clase.'),
          mc('¿Para qué sirve export en un módulo?', ['Para borrar código', 'Para que otros archivos puedan importar ese valor', 'Para ejecutar el archivo'], 1, 'export publica funciones, clases o valores; import los usa.'),
          pair('Empareja cada palabra clave con su función.', [['class', 'Define una plantilla de objetos'], ['constructor', 'Inicializa la instancia'], ['extends', 'Hereda de otra clase'], ['import', 'Trae algo de otro módulo']], 'Son las piezas básicas de la programación orientada a objetos y los módulos.'),
          run('Completa la clase Contador: inc() suma 1 a valor y devuelve this.', 'class Contador {\n  constructor() {\n    this.valor = 0;\n  }\n  inc() {\n    \n  }\n}', [['new Contador().inc().inc().valor', '2'], ['new Contador().valor', '0']], 'Incrementa this.valor y devuelve this para encadenar llamadas.', 'class Contador {\n  constructor() {\n    this.valor = 0;\n  }\n  inc() {\n    this.valor++;\n    return this;\n  }\n}'),
        ] },
    ]},
  ],
};

})();
