(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair, run } = CQ.h;

CQ.content.python = {
  id: 'python', name: 'Python', emoji: '🐍', color: '#3776ab',
  tagline: 'De cero a experto',
  runner: 'python',
  units: [
    // ───────────── UNIDAD 1 ─────────────
    { id: 'u1', title: 'Primeros pasos', desc: 'Tu primer programa en Python', lessons: [
      { id: 'l1', title: 'Hola, mundo', intro:
'Un programa es una lista de instrucciones. La función `print()` muestra texto en pantalla.\n\nEl texto va entre comillas, simples o dobles:\n\n```\nprint("Hola, mundo")\nprint(\'Adiós\')\n```\n\nCada `print` escribe en una línea nueva. También puedes imprimir números sin comillas: `print(42)`.',
        ex: [
          mc('¿Qué función muestra texto en pantalla?', ['show()', 'print()', 'write()', 'echo()'], 1, 'En Python se usa print().'),
          fill('Completa para imprimir Hola', 'print(___)', ['"Hola"', "'Hola'"], 'El texto debe ir entre comillas.'),
          out('¿Qué imprime?', 'print("Hola")\nprint("Mundo")', 'Hola\nMundo', 'Cada print termina con un salto de línea.'),
          tf('Los números a imprimir deben ir entre comillas.', false, 'print(42) funciona sin comillas; las comillas crean texto.'),
          order('Ordena para imprimir Hola', ['print', '(', '"Hola"', ')'], 'Nombre de la función, paréntesis y el texto dentro.'),
          out('¿Qué imprime?', 'print(2 + 3)', '5', 'Sin comillas, Python calcula la suma.'),
        ] },
      { id: 'l2', title: 'Comentarios y errores', intro:
'Un comentario empieza con `#` y Python lo ignora. Sirve para explicar el código:\n\n```\n# Esto es un comentario\nprint("Hola")  # también aquí\n```\n\nSi escribes algo mal, Python muestra un **error**. Un `SyntaxError` indica que la sintaxis es incorrecta (por ejemplo, faltan comillas o un paréntesis). Lee el mensaje: dice la línea del problema.',
        ex: [
          mc('¿Qué símbolo inicia un comentario?', ['//', '#', '--', '/*'], 1, 'En Python los comentarios empiezan con #.'),
          out('¿Qué imprime?', '# print("A")\nprint("B")', 'B', 'La primera línea es un comentario y se ignora.'),
          tf('Python ejecuta el texto de los comentarios.', false, 'Los comentarios son solo para personas.'),
          mc('¿Qué error da print("Hola?', ['SyntaxError', 'NameError', 'Ninguno', 'ZeroDivisionError'], 0, 'Falta cerrar comillas y paréntesis: es un error de sintaxis.', 'print("Hola'),
          fill('Convierte la línea en comentario', '___ print("oculto")', '#', 'Con # delante, la línea no se ejecuta.'),
          pair('Empareja cada código con su resultado', [['print(1)', '1'], ['print("1")', '1 (texto)'], ['# print(1)', 'No imprime nada']], 'Los comentarios no se ejecutan; texto y número se ven igual.'),
        ] },
      { id: 'l3', title: 'Reto: primeros pasos', intro:
'Hora de combinar lo aprendido. Recuerda:\n\n* `print()` muestra valores.\n* `#` crea comentarios.\n* El texto va entre comillas.\n\nEn los ejercicios de escribir código, tu programa se prueba automáticamente. Ahora puedes guardar un texto en un nombre: `mensaje = "Hola"` (lo verás a fondo en la próxima unidad).',
        ex: [
          out('¿Qué imprime?', 'print("Py")\nprint("thon")', 'Py\nthon', 'Dos print, dos líneas.'),
          out('¿Qué imprime?', 'print(10 - 4)  # resta', '6', 'El comentario se ignora; 10 - 4 = 6.'),
          mc('¿Cuál línea es válida en Python?', ['print "Hola"', 'print("Hola")', 'Print("Hola")', 'print(Hola)'], 1, 'print debe ir en minúsculas con paréntesis y texto entre comillas.'),
          order('Ordena el programa', ['# saludo', 'print("Hola")', 'print("Adiós")'], 'El comentario va primero y luego los print en orden.'),
          fill('Completa para imprimir 7', 'print(3 ___ 4)', '+', '3 + 4 = 7.'),
          run('Crea la variable saludo con el texto Hola, mundo', 'saludo = ', [['saludo', '"Hola, mundo"']], 'Asigna el texto con = y comillas.', 'saludo = "Hola, mundo"'),
        ] },
    ]},

    // ───────────── UNIDAD 2 ─────────────
    { id: 'u2', title: 'Variables y tipos', desc: 'Guarda y combina datos', lessons: [
      { id: 'l1', title: 'Variables', intro:
'Una **variable** es un nombre que guarda un valor. Se crea con `=`:\n\n```\nedad = 15\nnombre = "Ana"\nedad = edad + 1\n```\n\nLa última línea toma el valor actual, le suma 1 y lo guarda otra vez. Los nombres no llevan espacios ni empiezan con número, y Python distingue mayúsculas de minúsculas.',
        ex: [
          mc('¿Qué operador asigna un valor?', ['==', '=', ':=:', '->'], 1, 'El signo = guarda el valor en la variable.'),
          out('¿Qué imprime?', 'x = 5\nx = x + 2\nprint(x)', '7', 'x pasa de 5 a 7.'),
          tf('mi variable es un nombre válido en Python.', false, 'Los nombres no pueden tener espacios; usa mi_variable.'),
          fill('Completa para guardar 10 en puntos', '___ = 10', 'puntos', 'El nombre va a la izquierda del =.'),
          out('¿Qué imprime?', 'a = 3\nb = a\na = 9\nprint(b)', '3', 'b guardó una copia del valor 3; cambiar a no afecta a b.'),
          mc('¿Cuál NO es un nombre válido?', ['total', '_x', '2cosas', 'nombre1'], 2, 'No puede empezar con un número.'),
        ] },
      { id: 'l2', title: 'Tipos de datos', intro:
'Los valores tienen **tipo**:\n\n* `int`: enteros, `7`\n* `float`: decimales, `3.14`\n* `str`: texto, `"hola"`\n* `bool`: `True` o `False`\n\n`type(x)` muestra el tipo. `input()` pide texto al usuario y siempre devuelve `str`; para operar hay que convertir: `int("5")` da `5`. Operadores: `+ - * /` (la división da float), `//` división entera, `%` resto, `**` potencia.',
        ex: [
          mc('¿De qué tipo es 3.0?', ['int', 'float', 'str', 'bool'], 1, 'Tiene punto decimal, así que es float.'),
          out('¿Qué imprime?', 'print(7 // 2)', '3', '// es división entera.'),
          out('¿Qué imprime?', 'print(7 % 3)', '1', '7 entre 3 da 2 y sobra 1.'),
          out('¿Qué imprime?', 'print(type("5"))', "<class 'str'>", 'Entre comillas es texto.'),
          tf('input() devuelve siempre un texto (str).', true, 'Hay que convertirlo con int() o float() para calcular.'),
          fill('Convierte el texto "8" a entero', 'n = ___("8")', 'int', 'int() convierte texto numérico a entero.'),
          pair('Empareja valor y tipo', [['42', 'int'], ['"42"', 'str'], ['4.2', 'float'], ['True', 'bool']], 'Cada literal tiene su tipo propio.'),
        ] },
      { id: 'l3', title: 'Reto: f-strings y más', intro:
'Una **f-string** inserta variables en texto:\n\n```\nnombre = "Ana"\nprint(f"Hola, {nombre}")\n```\n\nLo que va entre `{}` se evalúa: `f"{2 + 3}"` da `5`. También puedes unir textos con `+` y repetirlos con `*`: `"ab" * 2` es `"abab"`.\n\nEn `run`, define las variables o funciones que se piden; luego se evalúan expresiones.',
        ex: [
          out('¿Qué imprime?', 'n = "Luz"\nprint(f"Hola, {n}")', 'Hola, Luz', 'Las llaves se sustituyen por el valor de n.'),
          out('¿Qué imprime?', 'print("ab" * 3)', 'ababab', 'Multiplicar texto lo repite.'),
          out('¿Qué imprime?', 'a = 4\nprint(f"{a} x 2 = {a * 2}")', '4 x 2 = 8', 'Dentro de las llaves se pueden hacer cálculos.'),
          mc('¿Qué da "5" + "5"?', ['10', '"55"', 'Error', '"10"'], 1, '+ con textos los concatena.'),
          order('Ordena la f-string', ['print', '(', 'f"Edad: {edad}"', ')'], 'La f lleva el prefijo antes de las comillas.'),
          run('Define precio = 20 y total con 3 unidades (total = precio * 3)', 'precio = 20\ntotal = ', [['total', '60']], 'Multiplica precio por 3.', 'precio = 20\ntotal = precio * 3'),
          run('Crea frase con f-string usando nombre', 'nombre = "Sol"\nfrase = ', [['frase', '"Hola, Sol"']], 'Usa f"Hola, {nombre}".', 'nombre = "Sol"\nfrase = f"Hola, {nombre}"'),
        ] },
    ]},

    // ───────────── UNIDAD 3 ─────────────
    { id: 'u3', title: 'Decisiones', desc: 'Haz que tu programa elija', lessons: [
      { id: 'l1', title: 'Comparaciones', intro:
'Las comparaciones dan un `bool` (`True` o `False`):\n\n```\n5 > 3    # True\n5 == 5   # True\n5 != 5   # False\n2 <= 1   # False\n```\n\nOjo: `=` asigna y `==` compara. Los demás operadores son `<`, `>`, `<=`, `>=` y `!=`.',
        ex: [
          mc('¿Qué operador comprueba igualdad?', ['=', '==', '=>', '!'], 1, '== compara; = asigna.'),
          out('¿Qué imprime?', 'print(4 > 9)', 'False', '4 no es mayor que 9.'),
          out('¿Qué imprime?', 'print(3 != 4)', 'True', '3 es distinto de 4.'),
          tf('"a" == "A" es True.', false, 'Python distingue mayúsculas y minúsculas.'),
          fill('Completa para que sea True', 'print(10 ___ 10)', ['>=', '<=', '=='], '10 es igual a 10, también >= y <=.'),
          out('¿Qué imprime?', 'x = 8\nprint(x == 8)', 'True', 'x vale 8.'),
        ] },
      { id: 'l2', title: 'if, elif y else', intro:
'`if` ejecuta un bloque solo si la condición es verdadera. El bloque va **indentado** (4 espacios) y la línea termina en `:`.\n\n```\nnota = 7\nif nota >= 9:\n    print("A")\nelif nota >= 6:\n    print("B")\nelse:\n    print("C")\n```\n\nSe evalúan en orden y solo corre la primera rama verdadera.',
        ex: [
          out('¿Qué imprime?', 'x = 5\nif x > 3:\n    print("grande")\nelse:\n    print("pequeño")', 'grande', '5 > 3 es True.'),
          out('¿Qué imprime?', 'n = 7\nif n >= 9:\n    print("A")\nelif n >= 6:\n    print("B")\nelse:\n    print("C")', 'B', 'La primera condición falla y la segunda se cumple.'),
          fill('Completa la línea del if', 'if edad >= 18___\n    print("adulto")', ':', 'Toda línea if termina en dos puntos.'),
          mc('¿Qué marca el bloque del if?', ['Llaves { }', 'begin/end', 'La indentación', 'Paréntesis'], 2, 'Python usa indentación.'),
          order('Ordena el if', ['if x > 0:', 'print("positivo")', 'else:', 'print("no positivo")'], 'if, su bloque, else y su bloque.'),
          out('¿Qué imprime?', 'x = 10\nif x > 5:\n    print("a")\nif x > 8:\n    print("b")', 'a\nb', 'Son dos if independientes y ambos se cumplen.'),
        ] },
      { id: 'l3', title: 'Reto: lógica', intro:
'Combina condiciones con operadores lógicos:\n\n* `and`: ambas deben ser verdaderas\n* `or`: basta con una\n* `not`: invierte el valor\n\n```\nedad = 20\nprint(edad > 12 and edad < 18)  # False\nprint(not False)  # True\n```',
        ex: [
          out('¿Qué imprime?', 'print(True and False)', 'False', 'and exige que ambos sean True.'),
          out('¿Qué imprime?', 'print(False or True)', 'True', 'or acepta que uno sea True.'),
          out('¿Qué imprime?', 'print(not (3 > 5))', 'True', '3 > 5 es False y not lo invierte.'),
          mc('¿Cuándo es True: a or b?', ['Solo si ambos son True', 'Si al menos uno es True', 'Solo si ambos son False', 'Nunca'], 1, 'or necesita solo una condición verdadera.'),
          pair('Empareja la expresión con su valor', [['True and True', 'True'], ['True and False', 'False (and)'], ['False or True', 'True (or)'], ['not True', 'False (not)']], 'Aplica la tabla de verdad.'),
          run('Escribe tipo(n): "par" si n es par, "impar" si no', 'def tipo(n):\n    ', [['tipo(4)', '"par"'], ['tipo(7)', '"impar"'], ['tipo(0)', '"par"']], 'Usa n % 2 == 0.', 'def tipo(n):\n    if n % 2 == 0:\n        return "par"\n    return "impar"'),
        ] },
    ]},

    // ───────────── UNIDAD 4 ─────────────
    { id: 'u4', title: 'Bucles', desc: 'Repite sin copiar y pegar', lessons: [
      { id: 'l1', title: 'for y range', intro:
'`for` recorre una secuencia. `range(n)` produce `0, 1, ..., n-1`:\n\n```\nfor i in range(3):\n    print(i)\n```\n\nimprime 0, 1 y 2. También `range(a, b)` empieza en `a` y termina antes de `b`, y `range(a, b, paso)` salta de a `paso`. Puedes recorrer texto: `for c in "hola"`.',
        ex: [
          out('¿Qué imprime?', 'for i in range(3):\n    print(i)', '0\n1\n2', 'range(3) genera 0, 1 y 2.'),
          out('¿Qué imprime?', 'for i in range(2, 5):\n    print(i)', '2\n3\n4', 'El final (5) no se incluye.'),
          mc('¿Cuántas veces se repite for i in range(4)?', ['3', '4', '5', 'Infinitas'], 1, 'Genera 0, 1, 2 y 3.'),
          fill('Completa el bucle', 'for i in ___(3):\n    print("hola")', 'range', 'range genera la secuencia de números.'),
          out('¿Qué imprime?', 'for i in range(0, 10, 3):\n    print(i)', '0\n3\n6\n9', 'Salta de 3 en 3.'),
          out('¿Qué imprime?', 'for c in "abc":\n    print(c)', 'a\nb\nc', 'for recorre cada carácter.'),
        ] },
      { id: 'l2', title: 'while, break y continue', intro:
'`while` repite mientras la condición sea verdadera:\n\n```\nn = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\n```\n\nSi la condición nunca se vuelve falsa, el bucle es infinito. `break` sale del bucle y `continue` salta a la siguiente vuelta.',
        ex: [
          out('¿Qué imprime?', 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1', '3\n2\n1', 'Se cuenta hacia atrás hasta 0.'),
          mc('¿Qué hace break?', ['Salta una vuelta', 'Sale del bucle', 'Reinicia el programa', 'Imprime'], 1, 'break termina el bucle de inmediato.'),
          out('¿Qué imprime?', 'for i in range(5):\n    if i == 2:\n        break\n    print(i)', '0\n1', 'Al llegar a 2 se sale del bucle.'),
          out('¿Qué imprime?', 'for i in range(4):\n    if i == 1:\n        continue\n    print(i)', '0\n2\n3', 'continue omite solo la vuelta con i = 1.'),
          tf('while True: sin break es un bucle infinito.', true, 'La condición nunca deja de ser verdadera.'),
          order('Ordena el bucle', ['n = 0', 'while n < 2:', 'print(n)', 'n = n + 1'], 'Inicializa, condición, cuerpo y actualización.'),
        ] },
      { id: 'l3', title: 'Reto: bucles', intro:
'Los bucles son ideales para acumular resultados:\n\n```\ntotal = 0\nfor i in range(1, 4):\n    total = total + i\n```\n\nAl final `total` vale `6`. Esta idea (acumulador) se usa para sumar, contar o construir texto.',
        ex: [
          out('¿Qué imprime?', 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)', '10', '1 + 2 + 3 + 4 = 10.'),
          out('¿Qué imprime?', 's = ""\nfor c in "abc":\n    s = c + s\nprint(s)', 'cba', 'Cada letra se antepone, invirtiendo el texto.'),
          fill('Completa para contar pares', 'cuenta = 0\nfor i in range(10):\n    if i % 2 == 0:\n        cuenta ___ 1\nprint(cuenta)', '+=', 'Hay 5 pares entre 0 y 9; += suma 1.'),
          pair('Empareja el bucle con cuántas vueltas da', [['range(5)', '5'], ['range(2, 6)', '4'], ['range(0, 10, 5)', '2']], 'Cuenta los valores generados.'),
          run('Escribe suma_hasta(n): suma de 1 a n', 'def suma_hasta(n):\n    ', [['suma_hasta(4)', '10'], ['suma_hasta(1)', '1'], ['suma_hasta(10)', '55']], 'Acumula con un for y range(1, n + 1).', 'def suma_hasta(n):\n    t = 0\n    for i in range(1, n + 1):\n        t += i\n    return t'),
        ] },
    ]},

    // ───────────── UNIDAD 5 ─────────────
    { id: 'u5', title: 'Funciones', desc: 'Reutiliza tu código', lessons: [
      { id: 'l1', title: 'def y return', intro:
'Una **función** agrupa código reutilizable:\n\n```\ndef doble(x):\n    return x * 2\n\nprint(doble(4))\n```\n\n`def` la define, `x` es el **parámetro** y `return` devuelve el resultado. Llamar `doble(4)` pasa el **argumento** 4. Una función sin `return` devuelve `None`.',
        ex: [
          mc('¿Qué palabra define una función?', ['func', 'def', 'function', 'fn'], 1, 'En Python se usa def.'),
          out('¿Qué imprime?', 'def doble(x):\n    return x * 2\nprint(doble(4))', '8', 'doble(4) devuelve 8.'),
          fill('Completa para devolver la suma', 'def suma(a, b):\n    ___ a + b', 'return', 'return devuelve el valor al que llamó.'),
          out('¿Qué imprime?', 'def f():\n    print("hola")\nx = f()\nprint(x)', 'hola\nNone', 'f imprime pero no devuelve nada, así que x es None.'),
          tf('Una función solo se ejecuta cuando se la llama.', true, 'Definirla no ejecuta su cuerpo.'),
          order('Ordena la función', ['def cuadrado(n):', 'return n * n', 'print(cuadrado(3))'], 'Primero se define y luego se llama.'),
        ] },
      { id: 'l2', title: 'Alcance y valores por defecto', intro:
'Las variables creadas dentro de una función son **locales**: no existen fuera de ella.\n\n```\ndef f():\n    x = 1\n```\n\nUsar `x` fuera da `NameError`. Un parámetro puede tener **valor por defecto**:\n\n```\ndef saluda(nombre="amigo"):\n    return "Hola, " + nombre\n```\n\n`saluda()` usa `"amigo"`; `saluda("Ana")` lo reemplaza.',
        ex: [
          out('¿Qué imprime?', 'def saluda(n="amigo"):\n    return "Hola, " + n\nprint(saluda())', 'Hola, amigo', 'Sin argumento se usa el valor por defecto.'),
          out('¿Qué imprime?', 'def saluda(n="amigo"):\n    return "Hola, " + n\nprint(saluda("Ana"))', 'Hola, Ana', 'El argumento reemplaza el valor por defecto.'),
          mc('¿Qué pasa al usar una variable local fuera de su función?', ['Vale 0', 'NameError', 'Vale None', 'Nada'], 1, 'Fuera de la función ese nombre no existe.'),
          out('¿Qué imprime?', 'x = 10\ndef f():\n    x = 5\n    return x\nf()\nprint(x)', '10', 'La x de la función es otra variable local.'),
          fill('Da a potencia el valor por defecto 2', 'def pot(base, exp___):\n    return base ** exp', '=2', 'Se escribe exp=2.'),
          pair('Empareja el concepto con su definición', [['Parámetro', 'Nombre en la definición'], ['Argumento', 'Valor que se pasa al llamar'], ['return', 'Devuelve un resultado']], 'Parámetro y argumento no son lo mismo.'),
        ] },
      { id: 'l3', title: 'Reto: funciones', intro:
'Las funciones pueden llamar a otras y usar varios parámetros:\n\n```\ndef area(b, h):\n    return b * h / 2\n```\n\nPiensa en entradas (parámetros) y salida (`return`). Prueba casos distintos antes de dar por buena tu función.',
        ex: [
          out('¿Qué imprime?', 'def a(x, y):\n    return x - y\nprint(a(y=1, x=5))', '4', 'Los argumentos con nombre pueden ir en cualquier orden.'),
          out('¿Qué imprime?', 'def doble(x):\n    return x * 2\ndef cuadruple(x):\n    return doble(doble(x))\nprint(cuadruple(3))', '12', 'doble(3)=6 y doble(6)=12.'),
          mc('¿Qué devuelve una función sin return?', ['0', 'None', 'Cadena vacía', 'Error'], 1, 'Devuelve None.'),
          run('Escribe maximo(a, b) sin usar max', 'def maximo(a, b):\n    ', [['maximo(3,7)', '7'], ['maximo(9,2)', '9'], ['maximo(4,4)', '4']], 'Compara con if.', 'def maximo(a, b):\n    if a > b:\n        return a\n    return b'),
          run('Escribe saluda(nombre, signo="!") que devuelva Hola, nombre y el signo', 'def saluda(nombre, signo="!"):\n    ', [['saluda("Ana")', '"Hola, Ana!"'], ['saluda("Ana", "?")', '"Hola, Ana?"']], 'Concatena con f-string.', 'def saluda(nombre, signo="!"):\n    return f"Hola, {nombre}{signo}"'),
        ] },
    ]},

    // ───────────── UNIDAD 6 ─────────────
    { id: 'u6', title: 'Colecciones', desc: 'Listas, tuplas, diccionarios y conjuntos', lessons: [
      { id: 'l1', title: 'Listas y tuplas', intro:
'Una **lista** guarda varios valores ordenados y se puede modificar:\n\n```\nl = [10, 20, 30]\nl.append(40)\nprint(l[0], l[-1], len(l))\n```\n\nLos índices empiezan en 0 y `-1` es el último. Una **tupla** `(1, 2)` es como una lista pero inmutable. Métodos útiles: `append`, `pop`, `sort`, y `x in l` comprueba pertenencia.',
        ex: [
          out('¿Qué imprime?', 'l = [10, 20, 30]\nprint(l[1])', '20', 'El índice 1 es el segundo elemento.'),
          out('¿Qué imprime?', 'l = [1, 2]\nl.append(3)\nprint(len(l))', '3', 'append agrega un elemento.'),
          out('¿Qué imprime?', 'l = [5, 6, 7]\nprint(l[-1])', '7', '-1 es el último elemento.'),
          tf('Una tupla se puede modificar después de crearla.', false, 'Las tuplas son inmutables.'),
          fill('Agrega 9 al final de nums', 'nums = [1]\nnums.___(9)', 'append', 'append añade al final.'),
          mc('¿Qué devuelve 3 in [1, 2, 3]?', ['True', 'False', '2', 'Error'], 0, 'in comprueba si el elemento está en la lista.'),
        ] },
      { id: 'l2', title: 'Diccionarios y conjuntos', intro:
'Un **diccionario** guarda pares clave: valor:\n\n```\nd = {"a": 1, "b": 2}\nd["c"] = 3\nprint(d["a"])\n```\n\nSe recorre con `for k, v in d.items()`. Un **conjunto** `{1, 2, 3}` no tiene orden ni repetidos: `set([1, 1, 2])` es `{1, 2}`. Los conjuntos sirven para quitar duplicados y comprobar pertenencia rápido.',
        ex: [
          out('¿Qué imprime?', 'd = {"a": 1, "b": 2}\nprint(d["b"])', '2', 'Se accede por clave.'),
          out('¿Qué imprime?', 'd = {"x": 1}\nd["y"] = 5\nprint(len(d))', '2', 'Se añadió una clave nueva.'),
          out('¿Qué imprime?', 'print(len(set([1, 1, 2, 2, 3])))', '3', 'El conjunto elimina repetidos: {1, 2, 3}.'),
          mc('¿Qué se usa para acceder a un valor del diccionario?', ['Su índice numérico', 'Su clave', 'Su posición final', 'Su tipo'], 1, 'Se usa d[clave].'),
          out('¿Qué imprime?', 'd = {"a": 1, "b": 2}\nfor k, v in d.items():\n    print(k, v)', 'a 1\nb 2', 'items() entrega pares clave y valor.'),
          pair('Empareja cada colección con su rasgo', [['Lista', 'Ordenada y mutable'], ['Tupla', 'Ordenada e inmutable'], ['Diccionario', 'Pares clave-valor'], ['Conjunto', 'Sin repetidos']], 'Cada colección tiene un uso distinto.'),
        ] },
      { id: 'l3', title: 'Reto: comprensiones', intro:
'Una **comprensión de listas** crea una lista en una línea:\n\n```\ncuadrados = [x * x for x in range(4)]\npares = [x for x in range(6) if x % 2 == 0]\n```\n\nLa primera da `[0, 1, 4, 9]` y la segunda `[0, 2, 4]`. También existen para diccionarios y conjuntos con llaves.',
        ex: [
          out('¿Qué imprime?', 'print([x * 2 for x in range(4)])', '[0, 2, 4, 6]', 'Cada x se multiplica por 2.'),
          out('¿Qué imprime?', 'print([x for x in range(7) if x % 3 == 0])', '[0, 3, 6]', 'Solo se conservan múltiplos de 3.'),
          fill('Completa la comprensión', 'l = [n + 1 ___ n in [1, 2, 3]]', 'for', 'La estructura es [expresión for x in iterable].'),
          order('Ordena la comprensión', ['[', 'x * x', 'for x', 'in range(3)', ']'], 'Expresión, for, y la secuencia.'),
          run('Escribe pares(n): lista de los pares de 0 a n-1', 'def pares(n):\n    ', [['pares(7)', '[0, 2, 4, 6]'], ['pares(1)', '[0]'], ['pares(0)', '[]']], 'Usa range con paso 2 o una comprensión con if.', 'def pares(n):\n    return [x for x in range(n) if x % 2 == 0]'),
          run('Escribe contar(lista): diccionario con cuántas veces aparece cada elemento', 'def contar(lista):\n    ', [['contar(["a","b","a"])', '{"a": 2, "b": 1}'], ['contar([])', '{}']], 'Recorre y suma con d.get(x, 0) + 1.', 'def contar(lista):\n    d = {}\n    for x in lista:\n        d[x] = d.get(x, 0) + 1\n    return d'),
        ] },
    ]},

    // ───────────── UNIDAD 7 ─────────────
    { id: 'u7', title: 'Cadenas y errores', desc: 'Texto, excepciones y archivos', lessons: [
      { id: 'l1', title: 'Métodos de str y slicing', intro:
'Los textos tienen métodos: `"hola".upper()` da `"HOLA"`, `strip()` quita espacios, `split()` parte en lista, `replace(a, b)` sustituye y `" ".join(lista)` une.\n\nEl **slicing** extrae partes: `s[a:b]` va de `a` hasta antes de `b`.\n\n```\ns = "python"\ns[0:2]   # "py"\ns[2:]    # "thon"\ns[::-1]  # "nohtyp"\n```\n\nLos textos son inmutables.',
        ex: [
          out('¿Qué imprime?', 'print("hola".upper())', 'HOLA', 'upper pasa todo a mayúsculas.'),
          out('¿Qué imprime?', 'print("python"[0:3])', 'pyt', 'Desde el índice 0 hasta antes del 3.'),
          out('¿Qué imprime?', 'print("abc"[::-1])', 'cba', 'El paso -1 invierte el texto.'),
          out('¿Qué imprime?', 'print("a,b,c".split(","))', "['a', 'b', 'c']", 'split devuelve una lista de partes.'),
          fill('Une las palabras con espacios', 'print(" ".___(["a", "b"]))', 'join', 'join une una lista usando el separador.'),
          tf('Se puede cambiar un carácter con s[0] = "X".', false, 'Los str son inmutables; hay que crear uno nuevo.'),
        ] },
      { id: 'l2', title: 'try/except y with', intro:
'Para manejar errores sin que el programa se detenga:\n\n```\ntry:\n    n = int("abc")\nexcept ValueError:\n    print("no es número")\n```\n\nSi falla el bloque `try`, se ejecuta el `except` que coincida. `finally` corre siempre. Con archivos se usa `with`, que los cierra solo:\n\n```\nwith open("a.txt") as f:\n    datos = f.read()\n```',
        ex: [
          out('¿Qué imprime?', 'try:\n    print(1 / 0)\nexcept ZeroDivisionError:\n    print("error")', 'error', 'Dividir entre cero lanza ZeroDivisionError.'),
          out('¿Qué imprime?', 'try:\n    n = int("abc")\nexcept ValueError:\n    n = 0\nprint(n)', '0', 'int("abc") falla y se asigna 0.'),
          out('¿Qué imprime?', 'try:\n    print("a")\nfinally:\n    print("b")', 'a\nb', 'finally se ejecuta siempre.'),
          mc('¿Qué ventaja tiene with open(...)?', ['Es más rápido', 'Cierra el archivo automáticamente', 'Evita errores de sintaxis', 'Convierte a texto'], 1, 'Al salir del bloque, el archivo se cierra.'),
          fill('Captura el error de valor', 'try:\n    int("x")\n___ ValueError:\n    pass', 'except', 'La palabra clave para capturar es except.'),
          order('Ordena el manejo de errores', ['try:', 'x = 1 / 0', 'except ZeroDivisionError:', 'x = 0'], 'try primero y luego su except.'),
        ] },
      { id: 'l3', title: 'Reto: texto y errores', intro:
'Combina métodos de texto con manejo de errores. Ideas útiles:\n\n* `s.lower()` normaliza mayúsculas.\n* `s.count("a")` cuenta apariciones.\n* `s.isdigit()` indica si todo son dígitos.\n* Un `try/except` dentro de una función puede devolver un valor seguro si algo falla.',
        ex: [
          out('¿Qué imprime?', 'print("banana".count("a"))', '3', 'La letra a aparece 3 veces.'),
          out('¿Qué imprime?', 'print("  hola  ".strip() + "!")', 'hola!', 'strip quita espacios de los bordes.'),
          out('¿Qué imprime?', 'print("a-b-c".replace("-", "+"))', 'a+b+c', 'replace sustituye todas las coincidencias.'),
          pair('Empareja método y efecto', [['upper()', 'Mayúsculas'], ['strip()', 'Quita espacios de los bordes'], ['split()', 'Divide en lista'], ['len()', 'Cuenta caracteres']], 'Cada método transforma o describe el texto.'),
          run('Escribe es_palindromo(s): True si s se lee igual al revés', 'def es_palindromo(s):\n    ', [['es_palindromo("oso")', 'true'], ['es_palindromo("casa")', 'false'], ['es_palindromo("")', 'true']], 'Compara s con s[::-1].', 'def es_palindromo(s):\n    return s == s[::-1]'),
          run('Escribe a_entero(s): int(s) o -1 si no se puede convertir', 'def a_entero(s):\n    ', [['a_entero("42")', '42'], ['a_entero("hola")', '-1']], 'Usa try/except ValueError.', 'def a_entero(s):\n    try:\n        return int(s)\n    except ValueError:\n        return -1'),
        ] },
    ]},

    // ───────────── UNIDAD 8 ─────────────
    { id: 'u8', title: 'Clases y algoritmos', desc: 'Objetos, recursión y búsqueda', lessons: [
      { id: 'l1', title: 'Clases y herencia', intro:
'Una **clase** es un molde para crear objetos:\n\n```\nclass Perro:\n    def __init__(self, nombre):\n        self.nombre = nombre\n    def hablar(self):\n        return self.nombre + " guau"\n```\n\n`__init__` inicializa el objeto y `self` es el objeto mismo. `Perro("Rex")` crea una instancia. La **herencia** reutiliza una clase: `class Cachorro(Perro):` obtiene sus métodos y puede redefinirlos.',
        ex: [
          mc('¿Qué método inicializa un objeto?', ['__start__', '__init__', 'init', 'new'], 1, '__init__ se ejecuta al crear la instancia.'),
          out('¿Qué imprime?', 'class P:\n    def __init__(self, n):\n        self.n = n\np = P("Ana")\nprint(p.n)', 'Ana', 'self.n guarda el atributo en el objeto.'),
          out('¿Qué imprime?', 'class A:\n    def hola(self):\n        return "A"\nclass B(A):\n    pass\nprint(B().hola())', 'A', 'B hereda hola de A.'),
          out('¿Qué imprime?', 'class A:\n    def hola(self):\n        return "A"\nclass B(A):\n    def hola(self):\n        return "B"\nprint(B().hola())', 'B', 'B redefine el método de A.'),
          fill('Completa el parámetro que representa al objeto', 'class C:\n    def f(___):\n        return 1', 'self', 'El primer parámetro de un método es self.'),
          tf('Una clase y un objeto son lo mismo.', false, 'La clase es el molde; el objeto es una instancia creada con él.'),
        ] },
      { id: 'l2', title: 'Recursión y búsqueda', intro:
'Una función **recursiva** se llama a sí misma. Necesita un **caso base** que detenga la cadena:\n\n```\ndef fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\n```\n\n**Búsqueda lineal**: revisa elemento por elemento. **Búsqueda binaria**: en una lista ORDENADA compara con el medio y descarta la mitad cada vez; es mucho más rápida.',
        ex: [
          out('¿Qué imprime?', 'def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\nprint(fact(4))', '24', '4 * 3 * 2 * 1 = 24.'),
          mc('¿Para qué sirve el caso base?', ['Para acelerar', 'Para detener la recursión', 'Para ordenar', 'Para imprimir'], 1, 'Sin caso base la recursión nunca termina.'),
          out('¿Qué imprime?', 'def cuenta(n):\n    if n == 0:\n        return 0\n    return 1 + cuenta(n - 1)\nprint(cuenta(5))', '5', 'Suma 1 por cada llamada hasta llegar a 0.'),
          tf('La búsqueda binaria requiere una lista ordenada.', true, 'Si no está ordenada, descartar la mitad no es válido.'),
          order('Ordena la recursión de suma', ['def suma(n):', 'if n == 0:', 'return 0', 'return n + suma(n - 1)'], 'Caso base y luego llamada recursiva.'),
          mc('En una lista ordenada de 1000 elementos, ¿qué búsqueda hace menos pasos?', ['Lineal', 'Binaria', 'Ambas igual', 'Ninguna'], 1, 'La binaria necesita unos 10 pasos; la lineal hasta 1000.'),
        ] },
      { id: 'l3', title: 'Reto: algoritmos', intro:
'**Ordenamiento simple**: la *burbuja* compara vecinos y los intercambia si están desordenados. Es sencilla pero lenta.\n\n**Complejidad intuitiva**: cuánto crece el trabajo con el tamaño `n`.\n\n* Recorrer una vez: crece como `n` (lineal)\n* Doble bucle anidado: crece como `n²` (cuadrática)\n* Búsqueda binaria: crece como `log n`\n\nIntercambio en Python: `a, b = b, a`.',
        ex: [
          out('¿Qué imprime?', 'a, b = 1, 2\na, b = b, a\nprint(a, b)', '2 1', 'Se intercambian los valores.'),
          mc('¿Qué complejidad tiene un doble bucle for sobre n elementos?', ['Lineal', 'Cuadrática', 'Logarítmica', 'Constante'], 1, 'n vueltas por cada n vueltas son n² pasos.'),
          pair('Empareja algoritmo y complejidad', [['Recorrer una lista', 'n'], ['Doble bucle anidado', 'n²'], ['Búsqueda binaria', 'log n'], ['Leer l[0]', 'Constante']], 'Piensa cuánto crece el trabajo al aumentar n.'),
          out('¿Qué imprime?', 'l = [3, 1, 2]\nl.sort()\nprint(l)', '[1, 2, 3]', 'sort ordena la lista in situ.'),
          run('Escribe buscar(lista, x): índice de x o -1 si no está', 'def buscar(lista, x):\n    ', [['buscar([4,7,9], 7)', '1'], ['buscar([4,7,9], 5)', '-1'], ['buscar([], 1)', '-1']], 'Recorre con range(len(lista)).', 'def buscar(lista, x):\n    for i in range(len(lista)):\n        if lista[i] == x:\n            return i\n    return -1'),
          run('Escribe burbuja(l): devuelve la lista ordenada de menor a mayor con el método burbuja', 'def burbuja(l):\n    l = list(l)\n    ', [['burbuja([3,1,2])', '[1, 2, 3]'], ['burbuja([5,4,3,2,1])', '[1, 2, 3, 4, 5]'], ['burbuja([])', '[]']], 'Dos bucles anidados e intercambio de vecinos.', 'def burbuja(l):\n    l = list(l)\n    n = len(l)\n    for i in range(n):\n        for j in range(n - 1 - i):\n            if l[j] > l[j + 1]:\n                l[j], l[j + 1] = l[j + 1], l[j]\n    return l'),
        ] },
    ]},
  ],
};

})();
