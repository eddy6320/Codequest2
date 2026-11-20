# CodeQuest · Guía para escribir contenido

Cada lenguaje es UN archivo `content/<id>.js` que se registra así:

```js
(window.CQ = window.CQ || { content: {}, roadmap: [] });
const { mc, tf, fill, order, out, pair, run } = CQ.h;   // (en validate.js y en el navegador existe CQ.h)

CQ.content.python = {
  id: 'python', name: 'Python', emoji: '🐍', color: '#3776ab',
  tagline: 'De cero a experto',
  runner: 'python',            // 'python' | 'js' | null  (null = no se ejecuta código: SQL, HTML, etc.)
  units: [
    { id: 'u1', title: 'Primeros pasos', desc: 'Tu primer programa', lessons: [
      { id: 'l1', title: 'Hola, mundo', intro: '...', ex: [ /* 5-7 ejercicios */ ] },
    ]},
  ],
};
```

IDs (`u1`, `l1`...) son estables: NUNCA los renombres una vez publicados (el progreso de la gente depende de ellos).
Orden de unidades = orden de dificultad (de cero a experto).

## `intro` (mini‑lección que se lee antes de los ejercicios)
Español, ≤ 110 palabras, directo. Formato permitido: párrafos separados por línea en blanco, `**negrita**`, `` `código` `` en línea
y bloques de código con triple tilde invertida. Explica SOLO lo que los ejercicios de la lección necesitan.

## Ejercicios (helpers)
| helper | uso | notas |
|---|---|---|
| `mc(q, opciones, indiceCorrecto, explicacion, code?)` | opción múltiple | 3-4 opciones; varía la posición de la correcta |
| `tf(q, true/false, explicacion, code?)` | verdadero/falso | |
| `fill(q, codeConBlancos, respuesta|[respuestas], explicacion)` | completar | `___` marca UN hueco; da variantes válidas (comillas simples/dobles) |
| `order(q, fichasEnOrdenCorrecto, explicacion)` | ordenar fichas | 3-10 fichas, sin espacios en los bordes; la app las mezcla |
| `out(q, code, salida|[salidas], explicacion)` | "¿qué imprime?" | **se ejecuta en el validador**: la salida debe ser exacta |
| `pair(q, [[izq,der],...], explicacion)` | emparejar | 3-5 pares, sin repetidos |
| `run(q, starter, [[expr, jsonEsperado],...], explicacion, solucion)` | escribe código | solo si `runner` es python/js; `solucion` se ejecuta en el validador |

* `q` = enunciado corto (≤ 120 caracteres). Toda pregunta lleva `explicacion` (1-2 frases: por qué es así).
* En `run`, `expr` es una expresión evaluada tras el código del usuario y `jsonEsperado` su resultado en JSON
  (`'5'`, `'"hola"'`, `'[1,2]'`, `'true'`). Ej.: `run('Escribe suma(a, b)', 'def suma(a, b):\n    ', [['suma(2,3)','5'],['suma(-1,1)','0']], 'Usa return.', 'def suma(a, b):\n    return a + b')`
* Mezcla tipos: en cada lección ≥ 3 tipos distintos; la última lección de cada unidad ("Reto") debe incluir al menos un `run` si el lenguaje lo permite.
* Dificultad progresiva dentro de la unidad y entre unidades. Sin trampas ni preguntas ambiguas. Una sola respuesta correcta.
* Todo en español (identificadores de código pueden ir en inglés o español neutro).

## Validar
`node validate.js content/python.js` — revisa estructura y EJECUTA tu código (`out` y `run.sol`) con python3/node.
Debe terminar con 0 errores.

## Ampliar un lenguaje que ya existe: `content/<id>.plus.js`
Para añadir unidades a un curso publicado NO edites su archivo base; crea `content/<id>.plus.js` que las agrega al final:

```js
(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
  const { mc, tf, fill, order, out, pair, run } = CQ.h;
  CQ.content.python.units.push(
    { id: 'u9', title: '...', desc: '...', lessons: [ { id: 'l1', title: '...', intro: '...', ex: [ /* ... */ ] }, /* l2, l3 */ ] },
    /* u10, u11 ... */
  );
})();
```
Los ids de unidad continúan la numeración del archivo base (u9, u10...). Envuelve SIEMPRE el archivo en una función (IIFE) para no chocar con otros `const`.
`node validate.js content/<id>.plus.js` carga solo automáticamente el archivo base.
