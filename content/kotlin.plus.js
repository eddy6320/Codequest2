(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.kotlin.units.push(
  // ───────────── UNIDAD 6 ─────────────
  { id: 'u6', title: 'Scope functions y colecciones avanzadas', desc: 'let, apply, secuencias y más', lessons: [
    { id: 'l1', title: 'let, apply, also, run y with', intro: L(
'Las **scope functions** ejecutan un bloque sobre un objeto. Se distinguen por cómo lo nombran dentro (`it` o `this`) y qué devuelven:',
'',
'* `let` → `it`, devuelve el **resultado de la lambda** (ideal con `?.let { }` para nulos).',
'* `run` → `this`, devuelve el **resultado de la lambda**.',
'* `apply` → `this`, devuelve **el propio objeto** (para configurarlo).',
'* `also` → `it`, devuelve **el propio objeto** (para efectos secundarios).',
'* `with(obj) { }` recibe el objeto como **argumento**.'),
      ex: [
        out('¿Qué imprime?', L('val n: Int? = 5', 'println(n?.let { it * 2 })'), '10', 'let se ejecuta porque n no es nulo y devuelve el resultado de la lambda.'),
        out('¿Qué imprime?', L('val s = StringBuilder().apply {', '    append("a")', '    append("b")', '}', 'println(s)'), 'ab', 'apply configura el StringBuilder y lo devuelve.'),
        out('¿Qué imprime?', L('val x = 3.also { println("antes") }', 'println(x)'), 'antes\n3', 'also ejecuta el bloque (imprime "antes") y devuelve el mismo 3.'),
        mc('¿Qué devuelve apply?', ['El propio objeto', 'El resultado de la lambda', 'Unit siempre', 'null'], 0, 'let y run devuelven el resultado de la lambda; apply y also devuelven el objeto.'),
        pair('Empareja cada función con su comportamiento', [['let', 'it · devuelve la lambda'], ['apply', 'this · devuelve el objeto'], ['also', 'it · devuelve el objeto'], ['run', 'this · devuelve la lambda']], 'Elige según uses it o this y según lo que necesites devolver.'),
        tf('with(obj) { } recibe el objeto como argumento en lugar de ser una función de extensión.', true, 'Se escribe with(obj) { ... }, no obj.with { ... }.'),
        out('¿Qué imprime?', L('val r = "kotlin".run { length }', 'println(r)'), '6', 'Dentro de run, this es el String y length vale 6.'),
      ] },
    { id: 'l2', title: 'Secuencias y operaciones de colección', intro: L(
'Operaciones útiles sobre colecciones:',
'',
'* `partition { }` separa en dos listas (cumplen / no cumplen).',
'* `groupBy { }` agrupa en un mapa · `zip` empareja dos listas · `fold(inicial) { acc, x -> }` acumula.',
'* `windowed(n)` da ventanas deslizantes.',
'',
'Una **secuencia** (`sequenceOf`, `asSequence()`) es **perezosa**: procesa elemento por elemento y solo hace el trabajo necesario; una lista procesa cada operación completa antes de pasar a la siguiente.'),
      ex: [
        out('¿Qué imprime?', 'println(listOf(1, 2, 3, 4).partition { it % 2 == 0 })', '([2, 4], [1, 3])', 'partition devuelve un par: primero los que cumplen, luego los demás.'),
        out('¿Qué imprime?', 'println(listOf("a", "bb", "cc").groupBy { it.length })', '{1=[a], 2=[bb, cc]}', 'La clave es la longitud y el valor la lista de textos con esa longitud.'),
        out('¿Qué imprime?', 'println(listOf(1, 2, 3).zip(listOf("a", "b", "c")))', '[(1, a), (2, b), (3, c)]', 'zip crea pares con los elementos de igual posición.'),
        out('¿Qué imprime?', 'println(listOf(1, 2, 3, 4).fold(0) { acc, x -> acc + x })', '10', 'fold parte de 0 y va sumando cada elemento.'),
        out('¿Qué imprime?', L('val r = sequenceOf(1, 2, 3, 4)', '    .map { println("m$it"); it * 2 }', '    .first()', 'println(r)'), 'm1\n2', 'La secuencia es perezosa: para obtener el primero solo transforma el 1.'),
        mc('¿Cuál es la diferencia clave entre una lista y una secuencia?', ['La secuencia procesa de forma perezosa, elemento por elemento', 'La secuencia es inmutable', 'La lista es más lenta siempre', 'No hay diferencias'], 0, 'Con muchas operaciones o datos grandes, la secuencia evita crear listas intermedias.'),
        out('¿Qué imprime?', 'println((1..10).windowed(3).first())', '[1, 2, 3]', 'windowed(3) genera ventanas de 3 elementos; la primera es [1, 2, 3].'),
      ] },
    { id: 'l3', title: 'Reto: desestructuración, when y lazy', intro: L(
'* **Desestructuración**: `val (a, b) = Pair(1, "x")`.',
'* `when` sin argumento evalúa condiciones en orden, como un `if / else if`.',
'* `by lazy { }` calcula el valor **la primera vez** que se usa y lo recuerda.',
'* `lateinit var` declara una variable no nula que se inicializará después.',
'* `joinToString` une elementos y `sortedDescending()` ordena de mayor a menor.'),
      ex: [
        out('¿Qué imprime?', L('val (a, b) = Pair(1, "x")', 'println("$a$b")'), '1x', 'La desestructuración reparte los componentes del par en a y b.'),
        out('¿Qué imprime?', L('val x = 7', 'println(when {', '    x < 5 -> "bajo"', '    x < 10 -> "medio"', '    else -> "alto"', '})'), 'medio', 'La primera condición verdadera es x < 10.'),
        out('¿Qué imprime?', L('val v by lazy { println("calc"); 42 }', 'println(v)', 'println(v)'), 'calc\n42\n42', 'El bloque se ejecuta solo en el primer acceso; el segundo reutiliza el valor.'),
        mc('¿Para qué sirve lateinit var?', ['Declarar una variable no nula que se inicializa más tarde', 'Hacerla constante', 'Permitir null', 'Compartirla entre hilos'], 0, 'Evita tener que usar tipos nulos cuando sabes que la asignarás antes de usarla.'),
        tf('by lazy vuelve a calcular el valor en cada acceso.', false, 'Calcula una sola vez y guarda el resultado.'),
        out('¿Qué imprime?', 'println(listOf(3, 1, 2).sortedDescending())', '[3, 2, 1]', 'sortedDescending devuelve una lista nueva de mayor a menor.'),
        out('¿Qué imprime?', 'println("a-b-c".split("-").joinToString("+"))', 'a+b+c', 'split separa por guion y joinToString vuelve a unir con +.'),
      ] },
  ]}
);
})();
