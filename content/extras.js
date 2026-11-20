/* CodeQuest · contenido extra v1.9
   1) Lecciones nuevas de Python (se insertan ANTES del "Reto" de cada unidad; el progreso se guarda por id, así que no se pierde nada).
   2) "Repaso mixto" automático en cada unidad de todos los lenguajes (copias de ejercicios de la propia unidad, para repasar sin repetir el mismo orden).
   Para añadir más: llama a ins('python', 'u7', { id: 'l2b', title, intro, ex: [...] }). */
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const J = (...l) => l.join('\n');
function ins(lang, uid, lesson) {
  const u = (CQ.content[lang] || { units: [] }).units.find(x => x.id === uid); if (!u) return;
  u.lessons.splice(u.lessons.length - 1, 0, lesson);
}
ins('python', 'u1', { id: 'l2b', title: 'Entrada con input()', intro: J(
  'Los programas útiles hablan con el usuario. `input()` pausa el programa, muestra un mensaje y **siempre devuelve texto** (`str`), aunque el usuario escriba un número.', '',
  '```', 'nombre = input("¿Cómo te llamas? ")', 'edad = int(input("Edad: "))', 'print("Hola", nombre, edad + 1)', '```', '',
  'Para usar el dato como número hay que convertirlo con `int()` o `float()`. Buena práctica: valida la entrada antes de convertirla (lo verás en excepciones).'), ex: [
  mc('¿Qué tipo devuelve siempre input()?', ['int', 'str', 'float', 'bool'], 1, 'input() devuelve texto, aunque escribas 5.'),
  fill('Convierte el texto a entero', 'n = ___(input())', 'int', 'int() convierte el texto a número entero.'),
  out('¿Qué imprime?', 'x = "3"\nprint(x * 2)', '33', 'Multiplicar un texto lo repite: "3" * 2 es "33".'),
  out('¿Qué imprime?', 'print("a", "b", sep="-")', 'a-b', 'sep define lo que se pone entre los valores.'),
  tf('print() termina cada llamada con un salto de línea por defecto.', true, 'Se controla con el parámetro end.'),
  order('Ordena para leer un nombre y saludar', ['nombre = input("Nombre: ")', 'print("Hola", nombre)'], 'Primero se lee el dato y luego se usa.'),
  pair('Conversiones', [['int("5")', '5 (entero)'], ['str(5)', '"5" (texto)'], ['float("2.5")', '2.5 (decimal)']], 'Cada función convierte al tipo de su nombre.')] });
ins('python', 'u2', { id: 'l2b', title: 'Operadores y precedencia', intro: J(
  'Además de `+ - * /` Python tiene: `//` (división entera), `%` (resto) y `**` (potencia).', '',
  '```', 'print(7 // 2)   # 3', 'print(7 % 2)    # 1', 'print(2 ** 3)   # 8', 'print(10 / 4)   # 2.5 (siempre decimal)', '```', '',
  'La **precedencia** manda: primero `**`, luego `* / // %`, luego `+ -`. Usa paréntesis para dejar clara tu intención; el código legible es código profesional.'), ex: [
  out('¿Qué imprime?', 'print(7 // 2)', '3', '// descarta la parte decimal.'),
  out('¿Qué imprime?', 'print(7 % 2)', '1', '% devuelve el resto de la división.'),
  out('¿Qué imprime?', 'print(2 + 3 * 4)', '14', 'La multiplicación se resuelve antes que la suma.'),
  out('¿Qué imprime?', 'print((2 + 3) * 4)', '20', 'Los paréntesis cambian el orden.'),
  tf('El operador / siempre devuelve un número decimal.', true, '10 / 5 da 2.0.'),
  fill('Calcula 2 elevado a 5', 'print(2 ___ 5)', '**', '** es la potencia: 2 ** 5 = 32.'),
  pair('Operadores', [['//', 'División entera'], ['%', 'Resto'], ['**', 'Potencia']], 'Tres operadores muy usados.')] });
ins('python', 'u3', { id: 'l2b', title: 'Operadores lógicos', intro: J(
  '`and`, `or` y `not` combinan condiciones. `and` exige que **ambas** sean verdaderas; `or`, que **al menos una** lo sea.', '',
  '```', 'edad = 20', 'if edad >= 18 and edad < 65:', '    print("Adulto activo")', '```', '',
  'Valores "falsos" (falsy): `0`, `""`, `[]`, `{}`, `None` y `False`. Todo lo demás es verdadero (truthy). Python evalúa con **cortocircuito**: en `a or b`, si `a` ya es verdadero ni mira `b`.'), ex: [
  out('¿Qué imprime?', 'print(True and False)', 'False', 'and necesita que ambos sean True.'),
  out('¿Qué imprime?', 'print(5 > 3 or 1 > 2)', 'True', 'Con que una sea verdadera, or da True.'),
  out('¿Qué imprime?', 'print(not False)', 'True', 'not invierte el valor.'),
  mc('¿Cuál de estos valores es falsy?', ['"0"', '[]', '"False"', '[0]'], 1, 'La lista vacía es falsa; los textos no vacíos y las listas con elementos son verdaderos.'),
  fill('Que imprima solo si x está entre 5 y 10', 'x = 7\nif x > 5 ___ x < 10:\n    print("rango")', 'and', 'Ambas condiciones deben cumplirse.'),
  order('Ordena el condicional', ['if x > 0:', 'print("positivo")', 'else:', 'print("no positivo")'], 'if, su bloque, else y su bloque.')] });
ins('python', 'u4', { id: 'l2b', title: 'Bucles anidados y enumerate', intro: J(
  'Un bucle dentro de otro repite el bloque interno completo por cada vuelta del externo. Es la base para tablas y matrices.', '',
  '```', 'for fila in range(2):', '    for col in range(3):', '        print(fila, col)', '```', '',
  'Cuando necesitas **el índice y el valor**, usa `enumerate()` en lugar de `range(len(...))`: es más claro y es el estilo pythónico.', '',
  '```', 'for i, letra in enumerate("abc"):', '    print(i, letra)', '```'), ex: [
  out('¿Qué imprime?', 'for i in range(2):\n    for j in range(2):\n        print(i, j)', '0 0\n0 1\n1 0\n1 1', 'Por cada i, j recorre sus dos valores.'),
  out('¿Qué imprime?', 'for i, c in enumerate("ab"):\n    print(i, c)', '0 a\n1 b', 'enumerate entrega pares (índice, valor).'),
  mc('¿Qué entrega enumerate() en cada vuelta?', ['Solo el valor', 'Índice y valor', 'Solo el índice', 'El valor invertido'], 1, 'Devuelve tuplas (índice, valor).'),
  fill('Cuenta regresiva 3, 2, 1', 'for i in range(3, ___, -1):\n    print(i)', '0', 'range se detiene antes del final: 0 no se incluye.'),
  out('¿Qué imprime?', 'print(list(range(2, 10, 3)))', '[2, 5, 8]', 'Empieza en 2, avanza de 3 en 3 y termina antes de 10.'),
  tf('range(5) incluye el número 5.', false, 'Va de 0 a 4.')] });
ins('python', 'u5', { id: 'l2b', title: 'Retornos múltiples y docstrings', intro: J(
  'Una función puede devolver varios valores separados por coma; en realidad devuelve una **tupla** que puedes desempaquetar.', '',
  '```', 'def minmax(lista):', '    """Devuelve el mínimo y el máximo."""', '    return min(lista), max(lista)', '', 'a, b = minmax([3, 1, 4])', '```', '',
  'El texto entre triple comilla justo bajo `def` es el **docstring**: documenta qué hace la función. Si una función no tiene `return`, devuelve `None`.'), ex: [
  out('¿Qué imprime?', 'def f():\n    return 1, 2\n\na, b = f()\nprint(a + b)', '3', 'Se desempaqueta la tupla (1, 2).'),
  mc('¿Qué devuelve una función sin return?', ['0', 'None', 'Un texto vacío', 'Un error'], 1, 'Sin return se devuelve None.'),
  out('¿Qué imprime?', 'def f(x):\n    x = x + 1\n    return x\n\nn = 5\nf(n)\nprint(n)', '5', 'f no reasigna n: el entero original no cambia.'),
  tf('Un docstring documenta lo que hace una función.', true, 'Se escribe entre triple comilla bajo la línea def.'),
  order('Ordena la función', ['def cuadrado(n):', 'return n * n'], 'Definición y luego el retorno.'),
  pair('Piezas de una función', [['def', 'Define la función'], ['return', 'Devuelve un valor'], ['None', 'Valor si no hay return']], 'Elementos básicos.')] });
ins('python', 'u6', { id: 'l2b', title: 'Métodos de listas y orden', intro: J(
  'Las listas cambian: `append(x)` agrega uno al final, `extend(otra)` agrega todos los elementos, `pop(i)` quita y devuelve, `insert(i, x)` inserta.', '',
  '```', 'a = [3, 1, 2]', 'a.sort()            # modifica a → [1, 2, 3]', 'b = sorted(a, reverse=True)  # lista nueva', '```', '',
  '`lista.sort()` modifica la original y devuelve `None`; `sorted(lista)` crea una lista nueva. Elegir bien evita errores sutiles.'), ex: [
  out('¿Qué imprime?', 'a = [3, 1, 2]\na.sort()\nprint(a)', '[1, 2, 3]', 'sort ordena la lista en el lugar.'),
  out('¿Qué imprime?', 'a = [1, 2]\na.append([3])\nprint(len(a))', '3', 'append agrega UN elemento (la lista [3]).'),
  out('¿Qué imprime?', 'a = [1, 2]\na.extend([3, 4])\nprint(a)', '[1, 2, 3, 4]', 'extend agrega cada elemento por separado.'),
  mc('¿Qué diferencia hay entre sorted() y .sort()?', ['Ninguna', 'sorted devuelve una lista nueva; sort modifica la original', 'sort devuelve una lista nueva', 'sorted modifica la original'], 1, 'sort cambia la lista y devuelve None.'),
  fill('Quita y guarda el primer elemento', 'x = a.___(0)', 'pop', 'pop(i) elimina y devuelve el elemento.'),
  pair('Métodos', [['append', 'Agrega un elemento'], ['extend', 'Agrega varios'], ['pop', 'Quita y devuelve']], 'Los tres más usados.')] });

ins('python', 'u7', { id: 'l2b', title: 'Formato de texto', intro: J(
  'Los f-strings aceptan **especificadores de formato** después de `:`. Son clave para mostrar números, dinero y porcentajes de forma profesional.', '',
  '```', 'x = 3.14159', 'print(f"{x:.2f}")      # 3.14', 'print(f"{1234567:,}")   # 1,234,567', 'print(f"{5:03d}")       # 005', 'print(f"{0.256:.1%}")   # 25.6%', '```'), ex: [
  out('¿Qué imprime?', 'x = 3.14159\nprint(f"{x:.2f}")', '3.14', '.2f muestra 2 decimales.'),
  out('¿Qué imprime?', 'print(f"{1234567:,}")', '1,234,567', 'La coma agrega separador de miles.'),
  out('¿Qué imprime?', 'print(f"{5:03d}")', '005', '03d rellena con ceros hasta 3 dígitos.'),
  out('¿Qué imprime?', 'print(f"{0.256:.1%}")', '25.6%', '% multiplica por 100 y agrega el símbolo.'),
  fill('Redondea a 2 decimales', 'x = 2.5\nprint(f"{x:___}")', '.2f', 'Imprime 2.50.'),
  tf('Un f-string puede contener expresiones como {2 + 3}.', true, 'Dentro de las llaves va cualquier expresión.')] });
ins('python', 'u8', { id: 'l2b', title: 'Búsqueda binaria', intro: J(
  'La **búsqueda binaria** encuentra un valor en una lista **ordenada** descartando la mitad en cada paso: complejidad O(log n), mucho más rápida que recorrer todo (O(n)).', '',
  '```', 'def buscar(lista, x):', '    lo, hi = 0, len(lista) - 1', '    while lo <= hi:', '        mid = (lo + hi) // 2', '        if lista[mid] == x:', '            return mid', '        if lista[mid] < x:', '            lo = mid + 1', '        else:', '            hi = mid - 1', '    return -1', '```'), ex: [
  mc('¿Qué requisito necesita la búsqueda binaria?', ['Lista desordenada', 'Lista ordenada', 'Solo números pares', 'Solo textos'], 1, 'Sin orden no se puede descartar la mitad.'),
  mc('¿Cuál es su complejidad?', ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], 1, 'Divide el problema a la mitad en cada paso.'),
  out('¿Qué imprime?', 'lista = [1, 3, 5, 7, 9]\nlo, hi = 0, 4\nmid = (lo + hi) // 2\nprint(lista[mid])', '5', 'mid = 2 y lista[2] vale 5.'),
  fill('Calcula el punto medio', 'mid = (lo + hi) ___ 2', '//', 'La división entera da un índice válido.'),
  tf('La búsqueda binaria funciona igual de bien en listas sin ordenar.', false, 'Necesita la lista ordenada.')] });
ins('python', 'u9', { id: 'l2b', title: 'Fechas y aleatorios', intro: J(
  '`datetime.date` representa fechas y `timedelta` sirve para sumar o restar días. `random` genera números y elecciones al azar.', '',
  '```', 'from datetime import date, timedelta', 'hoy = date(2024, 1, 1)', 'print(hoy + timedelta(days=31))  # 2024-02-01', '', 'import random', 'print(random.randint(1, 6))      # 1 a 6 incluidos', '```'), ex: [
  out('¿Qué imprime?', 'from datetime import date\nprint(date(2024, 3, 15).year)', '2024', 'El atributo year devuelve el año.'),
  out('¿Qué imprime?', 'from datetime import date, timedelta\nprint(date(2024, 1, 1) + timedelta(days=31))', '2024-02-01', 'Enero tiene 31 días.'),
  mc('¿Qué valores puede devolver random.randint(1, 6)?', ['1 a 5', '1 a 6 incluidos', '0 a 6', 'Solo 6'], 1, 'randint incluye ambos extremos.'),
  fill('Importa el módulo para números aleatorios', 'import ___\nprint(random.choice([7]))', 'random', 'El módulo se llama random.'),
  out('¿Qué imprime?', 'import random\nprint(random.randint(5, 5))', '5', 'Con un solo valor posible, siempre es 5.'),
  tf('random.choice elige un elemento de una secuencia.', true, 'Por ejemplo, de una lista.')] });

// ── Repaso mixto automático (todas las unidades de todos los lenguajes) ──
Object.keys(CQ.content).forEach(lang => (CQ.content[lang].units || []).forEach(u => {
  if (u.lessons.length < 2 || u.lessons.some(l => l.id === 'rev')) return;
  const pool = u.lessons.flatMap(l => l.ex).filter(x => x.k !== 'run');
  if (pool.length < 8) return;
  const step = pool.length / 8, ex = Array.from({ length: 8 }, (_, i) => ({ ...pool[Math.floor(i * step)] }));
  const rp = pool.slice().reverse(), ex2 = Array.from({ length: 8 }, (_, i) => ({ ...rp[Math.floor(i * step)] }));
  if (pool.length >= 14) u.lessons.splice(u.lessons.length - 1, 0, { id: 'chl', title: 'Desafío extra', intro: 'Más práctica con otros ejemplos de la unidad. Intenta resolver cada uno **antes** de ver las opciones: recordar con esfuerzo fija mucho mejor lo aprendido.', ex: ex2 });
  u.lessons.splice(u.lessons.length - 1, 0, { id: 'rev', title: 'Repaso mixto', intro: 'Una mezcla de lo más importante de esta unidad. Repasar espaciado es lo que convierte lo que *entiendes* en lo que *recuerdas*.\n\nSi fallas alguno, léelo con calma: el error es parte del aprendizaje.', ex });
}));
})();
