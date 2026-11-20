(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair, run } = CQ.h;

CQ.content.python.units.push(
  // ───────────── UNIDAD 9 ─────────────
  { id: 'u9', title: 'Módulos y librería estándar', desc: 'Usa las herramientas que Python ya trae', lessons: [
    { id: 'l1', title: 'import y math', intro:
'Un **módulo** es un archivo con código reutilizable. Se trae con `import`:\n\n```\nimport math\nprint(math.sqrt(25))\nfrom math import pi, floor\nimport math as m\n```\n\n`import math` exige escribir `math.` delante; `from math import pi` trae el nombre directo; `as` crea un alias. `math` ofrece `sqrt`, `floor`, `ceil`, `gcd`, `pi`...',
      ex: [
        mc('¿Cómo traes solo sqrt para usarlo sin prefijo?', ['import sqrt from math', 'from math import sqrt', 'using math.sqrt', 'include math'], 1, 'La forma es from módulo import nombre.'),
        out('¿Qué imprime?', 'import math\nprint(math.sqrt(16))', '4.0', 'sqrt siempre devuelve float.'),
        fill('Completa para obtener el máximo común divisor', 'import math\nprint(math.___(12, 18))', 'gcd', 'math.gcd(12, 18) es 6.'),
        out('¿Qué imprime?', 'from math import floor, ceil\nprint(floor(2.7), ceil(2.1))', '2 3', 'floor redondea hacia abajo y ceil hacia arriba.'),
        tf('Tras "import math as m" puedes escribir m.pi.', true, 'El alias reemplaza al nombre del módulo.'),
        out('¿Qué imprime?', 'import math\nprint(round(math.pi, 2))', '3.14', 'round recorta a 2 decimales.'),
        pair('Empareja función y resultado', [['math.floor(-1.5)', '-2'], ['math.ceil(-1.5)', '-1'], ['math.gcd(9, 12)', '3'], ['math.isqrt(17)', '4']], 'floor va al entero menor, ceil al mayor; isqrt es raíz entera.'),
      ] },
    { id: 'l2', title: 'collections', intro:
'`collections` trae contenedores especializados:\n\n* `Counter`: cuenta elementos. `Counter("aab")` → `a:2, b:1`; `.most_common(n)` ordena de mayor a menor.\n* `defaultdict(tipo)`: si la clave no existe, la crea con `tipo()`.\n* `deque`: cola de dos extremos con `append`, `appendleft`, `pop`, `popleft` eficientes.\n\n```\nfrom collections import Counter\nCounter("hola").most_common(1)\n```',
      ex: [
        out('¿Qué imprime?', 'from collections import Counter\nprint(Counter("banana").most_common(1))', "[('a', 3)]", 'La letra a aparece 3 veces; most_common devuelve pares (elemento, cuenta).'),
        out('¿Qué imprime?', 'from collections import defaultdict\nd = defaultdict(list)\nd["x"].append(1)\nd["x"].append(2)\nprint(dict(d))', "{'x': [1, 2]}", 'La clave x se crea con una lista vacía automáticamente.'),
        mc('¿Qué hace defaultdict(int)["z"] con una clave inexistente?', ['Lanza KeyError', 'Devuelve 0 y crea la clave', 'Devuelve None', 'Devuelve ""'], 1, 'int() vale 0, que se guarda como valor por defecto.'),
        fill('Completa la importación', 'from collections import ___\nc = Counter([1, 1, 2])', 'Counter', 'Counter se importa desde collections.'),
        out('¿Qué imprime?', 'from collections import deque\nq = deque([1, 2, 3])\nq.appendleft(0)\nq.pop()\nprint(list(q))', '[0, 1, 2]', 'appendleft añade al inicio y pop quita el último (3).'),
        tf('deque.popleft() es más eficiente que list.pop(0) en colas grandes.', true, 'En una lista, pop(0) desplaza todos los elementos; deque no.'),
        out('¿Qué imprime?', 'from collections import Counter\na = Counter("aab")\nb = Counter("abb")\nprint(sorted((a + b).items()))', "[('a', 3), ('b', 3)]", 'Sumar Counters suma las cuentas clave a clave.'),
      ] },
    { id: 'l3', title: 'Reto: itertools y fechas', intro:
'`itertools` genera iteradores: `chain(a, b)`, `combinations(seq, k)`, `permutations(seq, k)`, `accumulate(nums)` (sumas acumuladas).\n\n`datetime.date(año, mes, día)` crea fechas deterministas; restar dos fechas da un `timedelta` con `.days`, y `date + timedelta(days=n)` avanza días. `date.fromisoformat("2024-03-01")` lee texto ISO.\n\nEvita `today()` o `now()`: cambian cada día.',
      ex: [
        out('¿Qué imprime?', 'from itertools import combinations\nprint(list(combinations("abc", 2)))', "[('a', 'b'), ('a', 'c'), ('b', 'c')]", 'Combinaciones de 2 sin repetir ni importar el orden.'),
        out('¿Qué imprime?', 'from itertools import accumulate\nprint(list(accumulate([1, 2, 3, 4])))', '[1, 3, 6, 10]', 'Cada elemento es la suma acumulada hasta ese punto.'),
        out('¿Qué imprime?', 'from itertools import permutations\nprint(len(list(permutations([1, 2, 3]))))', '6', '3! = 6 ordenaciones.'),
        out('¿Qué imprime?', 'from datetime import date, timedelta\nprint(date(2024, 1, 31) + timedelta(days=30))', '2024-03-01', '2024 es bisiesto: 31 ene + 29 días es 29 feb, +1 es 1 mar.'),
        out('¿Qué imprime?', 'from datetime import date\nprint((date(2024, 3, 1) - date(2024, 2, 1)).days)', '29', 'Febrero de 2024 tiene 29 días.'),
        mc('¿Por qué evitar date.today() en ejemplos con salida fija?', ['Es muy lento', 'Su resultado cambia cada día', 'No existe en Python 3', 'Solo funciona con hora'], 1, 'No es determinista: la salida dependería del día de ejecución.'),
        run('Escribe top_palabras(texto, n): las n palabras más frecuentes; empates por orden alfabético', 'from collections import Counter\n\ndef top_palabras(texto, n):\n    ', [['top_palabras("a b a c b a", 2)', '["a", "b"]'], ['top_palabras("z y z y x", 2)', '["y", "z"]'], ['top_palabras("", 3)', '[]']], 'Cuenta con Counter y ordena con clave (-cuenta, palabra).', 'from collections import Counter\n\ndef top_palabras(texto, n):\n    c = Counter(texto.split())\n    return sorted(c, key=lambda w: (-c[w], w))[:n]'),
        run('Escribe dias_entre(a, b) con fechas ISO "AAAA-MM-DD" (b - a en días)', 'from datetime import date\n\ndef dias_entre(a, b):\n    ', [['dias_entre("2024-02-01", "2024-03-01")', '29'], ['dias_entre("2023-12-31", "2024-01-01")', '1'], ['dias_entre("2024-05-10", "2024-05-01")', '-9']], 'Usa date.fromisoformat y resta; .days da el entero.', 'from datetime import date\n\ndef dias_entre(a, b):\n    return (date.fromisoformat(b) - date.fromisoformat(a)).days'),
      ] },
  ]},

  // ───────────── UNIDAD 10 ─────────────
  { id: 'u10', title: 'POO avanzada', desc: 'Clases con personalidad: herencia, propiedades y dataclasses', lessons: [
    { id: 'l1', title: 'super y métodos especiales', intro:
'`super()` llama al método de la clase padre; se usa sobre todo en `__init__`.\n\nLos métodos especiales personalizan objetos:\n\n* `__str__`: texto para `print`\n* `__repr__`: representación para depurar\n* `__eq__`: define `==`\n\n```\nclass P:\n    def __init__(self, x):\n        self.x = x\n    def __eq__(self, o):\n        return self.x == o.x\n```',
      ex: [
        mc('¿Para qué sirve super().__init__(...)?', ['Crear una clase nueva', 'Ejecutar el __init__ de la clase padre', 'Borrar el padre', 'Importar un módulo'], 1, 'Permite reutilizar la inicialización del padre.'),
        out('¿Qué imprime?', 'class A:\n    def __init__(self):\n        self.v = 1\nclass B(A):\n    def __init__(self):\n        super().__init__()\n        self.v += 10\nprint(B().v)', '11', 'A pone v=1 y B le suma 10.'),
        out('¿Qué imprime?', 'class P:\n    def __init__(self, n):\n        self.n = n\n    def __str__(self):\n        return f"P({self.n})"\nprint(P(3))', 'P(3)', 'print usa __str__.'),
        fill('Completa el método que define ==', 'class V:\n    def __init__(self, x):\n        self.x = x\n    def ___(self, o):\n        return self.x == o.x', '__eq__', '__eq__ se invoca con el operador ==.'),
        out('¿Qué imprime?', 'class V:\n    def __init__(self, x):\n        self.x = x\nprint(V(1) == V(1))', 'False', 'Sin __eq__, == compara identidad y son objetos distintos.'),
        tf('Si una clase define solo __repr__, print(obj) usa ese __repr__.', true, 'Sin __str__, Python recurre a __repr__.'),
        out('¿Qué imprime?', 'class P:\n    def __init__(self, n):\n        self.n = n\n    def __repr__(self):\n        return f"P<{self.n}>"\nprint([P(1), P(2)])', '[P<1>, P<2>]', 'Dentro de listas se muestra el repr de cada elemento.'),
      ] },
    { id: 'l2', title: 'property, classmethod y dataclass', intro:
'* `@property` expone un método como atributo (con validación opcional vía `@x.setter`).\n* `@classmethod` recibe la clase (`cls`): útil como constructor alternativo.\n* `@staticmethod` no recibe ni `self` ni `cls`.\n* `@dataclass` genera `__init__`, `__repr__` y `__eq__` a partir de campos anotados:\n\n```\nfrom dataclasses import dataclass\n@dataclass\nclass Punto:\n    x: int\n    y: int = 0\n```',
      ex: [
        out('¿Qué imprime?', 'class C:\n    def __init__(self, r):\n        self.r = r\n    @property\n    def area(self):\n        return 3 * self.r ** 2\nprint(C(2).area)', '12', 'La propiedad se lee sin paréntesis.'),
        out('¿Qué imprime?', 'from dataclasses import dataclass\n@dataclass\nclass P:\n    x: int\n    y: int = 0\nprint(P(3))', 'P(x=3, y=0)', 'El __repr__ generado lista campo=valor.'),
        out('¿Qué imprime?', 'from dataclasses import dataclass\n@dataclass\nclass P:\n    x: int\nprint(P(1) == P(1))', 'True', 'Las dataclasses generan __eq__ que compara campos.'),
        mc('¿Qué recibe como primer parámetro un @classmethod?', ['La instancia (self)', 'La clase (cls)', 'Nada', 'El módulo'], 1, 'Por convención se llama cls.'),
        out('¿Qué imprime?', 'class T:\n    def __init__(self, s):\n        self.s = s\n    @classmethod\n    def desde_texto(cls, t):\n        return cls(int(t))\n    @staticmethod\n    def doble(n):\n        return n * 2\nprint(T.desde_texto("7").s, T.doble(4))', '7 8', 'El classmethod construye T(7); el staticmethod es una función dentro de la clase.'),
        fill('Completa para validar al asignar', 'class E:\n    def __init__(self):\n        self._e = 0\n    @property\n    def e(self):\n        return self._e\n    @e.___\n    def e(self, v):\n        if v < 0:\n            raise ValueError\n        self._e = v', 'setter', '@e.setter define la asignación controlada.'),
        out('¿Qué imprime?', 'class C:\n    def __init__(self):\n        self._v = 5\n    @property\n    def v(self):\n        return self._v\nc = C()\ntry:\n    c.v = 9\nexcept AttributeError:\n    print("solo lectura")', 'solo lectura', 'Una propiedad sin setter no se puede asignar.'),
      ] },
    { id: 'l3', title: 'Reto: herencia múltiple y MRO', intro:
'Una clase puede heredar de varias: `class C(A, B)`. Al buscar un método, Python sigue el **MRO** (orden de resolución): primero la clase, luego los padres de izquierda a derecha, sin repetir (algoritmo C3). Consulta `C.__mro__` o `C.mro()`.\n\n`super()` sigue ese orden, no "el padre directo": así se encadenan mixins de forma cooperativa.',
      ex: [
        out('¿Qué imprime?', 'class A:\n    def hola(self):\n        return "A"\nclass B(A):\n    pass\nclass C(A):\n    def hola(self):\n        return "C"\nclass D(B, C):\n    pass\nprint(D().hola())', 'C', 'MRO de D: D, B, C, A. B no define hola, así que gana C antes que A.'),
        out('¿Qué imprime?', 'class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\nprint([k.__name__ for k in D.__mro__])', "['D', 'B', 'C', 'A', 'object']", 'El MRO lineariza sin repetir y respeta el orden de los padres.'),
        out('¿Qué imprime?', 'class A:\n    def f(self):\n        return ["A"]\nclass B(A):\n    def f(self):\n        return ["B"] + super().f()\nclass C(A):\n    def f(self):\n        return ["C"] + super().f()\nclass D(B, C):\n    def f(self):\n        return ["D"] + super().f()\nprint(D().f())', "['D', 'B', 'C', 'A']", 'super() avanza por el MRO: tras B va C, no A.'),
        mc('¿Qué algoritmo define el MRO en Python 3?', ['Búsqueda en anchura', 'Linealización C3', 'Orden alfabético', 'Orden de definición'], 1, 'C3 garantiza un orden consistente y sin duplicados.'),
        tf('class X(A, B) busca primero en B y después en A.', false, 'Busca de izquierda a derecha: primero A y luego B.'),
        run('Escribe la clase Contador con inc() (suma 1 y devuelve self) y propiedad valor', 'class Contador:\n    def __init__(self):\n        self._n = 0\n    ', [['Contador().inc().inc().valor', '2'], ['Contador().valor', '0']], 'inc devuelve self para encadenar; valor es una @property.', 'class Contador:\n    def __init__(self):\n        self._n = 0\n    def inc(self):\n        self._n += 1\n        return self\n    @property\n    def valor(self):\n        return self._n'),
        run('Escribe nombres_mro(cls): lista de nombres del MRO sin "object"', 'def nombres_mro(cls):\n    ', [['nombres_mro(bool)', '["bool", "int"]'], ['nombres_mro(int)', '["int"]']], 'Recorre cls.__mro__ y filtra object.', 'def nombres_mro(cls):\n    return [k.__name__ for k in cls.__mro__ if k is not object]'),
      ] },
  ]},

  // ───────────── UNIDAD 11 ─────────────
  { id: 'u11', title: 'Funciones avanzadas', desc: 'args, lambdas, closures, decoradores y generadores', lessons: [
    { id: 'l1', title: 'args, kwargs y lambda', intro:
'`*args` recoge argumentos posicionales extra en una tupla; `**kwargs` los nombrados en un dict.\n\n```\ndef f(*args, **kwargs):\n    return args, kwargs\nf(1, 2, a=3)  # ((1, 2), {\'a\': 3})\n```\n\nUna `lambda` es una función de una expresión: `lambda x: x * 2`. Se combina con `map`, `filter` y `sorted(key=...)`.',
      ex: [
        out('¿Qué imprime?', 'def f(*args):\n    return len(args)\nprint(f(1, 2, 3))', '3', 'args es la tupla (1, 2, 3).'),
        out('¿Qué imprime?', 'def f(**kw):\n    return sorted(kw)\nprint(f(b=1, a=2))', "['a', 'b']", 'kw es un dict; sorted ordena sus claves.'),
        out('¿Qué imprime?', 'print(list(map(lambda x: x * x, [1, 2, 3])))', '[1, 4, 9]', 'map aplica la lambda a cada elemento.'),
        out('¿Qué imprime?', 'print(list(filter(lambda x: x % 2, range(6))))', '[1, 3, 5]', 'x % 2 es verdadero (1) solo para impares.'),
        fill('Ordena las palabras por longitud', 'palabras = ["kiwi", "pera", "uva"]\nprint(sorted(palabras, ___=len))', 'key', 'El parámetro key recibe la función que da el criterio.'),
        out('¿Qué imprime?', 'def suma(a, b, c):\n    return a + b + c\nprint(suma(*[1, 2, 3]))', '6', 'El * desempaqueta la lista en argumentos posicionales.'),
        out('¿Qué imprime?', 'datos = [("ana", 3), ("luis", 1), ("eva", 3)]\nprint(sorted(datos, key=lambda t: (-t[1], t[0])))', "[('ana', 3), ('eva', 3), ('luis', 1)]", 'Primero por puntos descendente y luego por nombre.'),
      ] },
    { id: 'l2', title: 'Closures y decoradores', intro:
'Una **closure** es una función interna que recuerda variables de la externa:\n\n```\ndef multiplicador(n):\n    def f(x):\n        return x * n\n    return f\ndoble = multiplicador(2)\n```\n\nUn **decorador** es una función que recibe otra y devuelve una nueva; `@deco` sobre `def f` equivale a `f = deco(f)`. Usa `functools.wraps` para conservar el nombre. `nonlocal` permite modificar la variable externa.',
      ex: [
        out('¿Qué imprime?', 'def mult(n):\n    def f(x):\n        return x * n\n    return f\ntriple = mult(3)\nprint(triple(5))', '15', 'f recuerda n=3 aunque mult ya terminó.'),
        out('¿Qué imprime?', 'def contador():\n    c = 0\n    def inc():\n        nonlocal c\n        c += 1\n        return c\n    return inc\ni = contador()\ni()\nprint(i())', '2', 'nonlocal permite que inc modifique c entre llamadas.'),
        mc('¿A qué equivale @deco sobre def f?', ['f = deco(f)', 'deco = f(deco)', 'f = f(deco)', 'deco(f)()'], 0, 'El decorador reemplaza f por lo que devuelve deco(f).'),
        out('¿Qué imprime?', 'def doble_resultado(fn):\n    def w(*a):\n        return fn(*a) * 2\n    return w\n@doble_resultado\ndef suma(a, b):\n    return a + b\nprint(suma(2, 3))', '10', 'El wrapper duplica el resultado de suma: (2+3)*2.'),
        order('Ordena un decorador mínimo', ['def deco(fn):', 'def w(*a, **k):', 'return fn(*a, **k)', 'return w'], 'Se define la función externa, el wrapper, su retorno y se devuelve el wrapper.'),
        tf('Sin functools.wraps, la función decorada pierde su __name__ original.', true, 'Su __name__ pasa a ser el del wrapper.'),
        out('¿Qué imprime?', 'fs = [lambda: i for i in range(3)]\nprint([f() for f in fs])', '[2, 2, 2]', 'Las lambdas comparten la variable i, que al final vale 2 (late binding).'),
      ] },
    { id: 'l3', title: 'Reto: generadores', intro:
'Una función con `yield` es un **generador**: produce valores de uno en uno y pausa entre ellos, sin guardar todo en memoria.\n\n```\ndef cuenta(n):\n    for i in range(n):\n        yield i\n```\n\n`next(g)` pide el siguiente; al agotarse lanza `StopIteration`. También existen expresiones generadoras: `(x*x for x in range(5))`. `yield from` delega en otro iterable.',
      ex: [
        out('¿Qué imprime?', 'def g():\n    yield 1\n    yield 2\ng1 = g()\nprint(next(g1), next(g1))', '1 2', 'Cada next reanuda el generador en el siguiente yield.'),
        out('¿Qué imprime?', 'print(sum(x * x for x in range(4)))', '14', '0+1+4+9 = 14, sin construir lista.'),
        mc('¿Qué diferencia a un generador de una lista?', ['Es más rápido siempre', 'Produce los valores bajo demanda', 'No puede recorrerse', 'Solo guarda números'], 1, 'Calcula cada valor cuando se pide, ahorrando memoria.'),
        out('¿Qué imprime?', 'def g():\n    yield from [1, 2]\n    yield 3\nprint(list(g()))', '[1, 2, 3]', 'yield from cede uno a uno los elementos del iterable.'),
        out('¿Qué imprime?', 'g = (x for x in "ab")\nprint(list(g), list(g))', '[\'a\', \'b\'] []', 'Un generador se agota: la segunda vez ya no produce nada.'),
        run('Escribe fib(n): lista con los n primeros Fibonacci usando un generador interno', 'def fib(n):\n    ', [['fib(7)', '[0, 1, 1, 2, 3, 5, 8]'], ['fib(1)', '[0]'], ['fib(0)', '[]']], 'Crea un generador infinito y toma n valores con un bucle.', 'def fib(n):\n    def gen():\n        a, b = 0, 1\n        while True:\n            yield a\n            a, b = b, a + b\n    g = gen()\n    return [next(g) for _ in range(n)]'),
        run('Escribe componer(*fs): devuelve la función que aplica fs de izquierda a derecha', 'def componer(*fs):\n    ', [['componer(lambda x: x + 1, lambda x: x * 10)(2)', '30'], ['componer()(5)', '5'], ['componer(str, len)(12345)', '5']], 'Devuelve una función interna que recorre fs acumulando el valor.', 'def componer(*fs):\n    def f(x):\n        for fn in fs:\n            x = fn(x)\n        return x\n    return f'),
      ] },
  ]},

  // ───────────── UNIDAD 12 ─────────────
  { id: 'u12', title: 'JSON, texto y regex', desc: 'Intercambia datos y domina el texto', lessons: [
    { id: 'l1', title: 'JSON', intro:
'`json` convierte entre objetos Python y texto JSON:\n\n```\nimport json\ns = json.dumps({"a": 1, "b": [True, None]})\nd = json.loads(s)\n```\n\n`dumps` → texto; `loads` → objeto. Equivalencias: dict↔objeto, list↔array, `True/None`↔`true/null`. Opciones útiles: `indent=2`, `sort_keys=True`, `ensure_ascii=False`. Las claves JSON siempre son texto.',
      ex: [
        out('¿Qué imprime?', 'import json\nprint(json.dumps({"a": 1, "b": True}))', '{"a": 1, "b": true}', 'dumps usa comillas dobles y true en minúscula.'),
        out('¿Qué imprime?', 'import json\nd = json.loads(\'{"x": [1, 2, null]}\')\nprint(d["x"][2])', 'None', 'null se convierte en None.'),
        mc('¿Qué devuelve json.loads?', ['Un texto', 'Un objeto Python (dict, list...)', 'Un archivo', 'Siempre un dict'], 1, 'Convierte texto JSON al objeto equivalente.'),
        fill('Completa para ordenar las claves', 'import json\nprint(json.dumps({"b": 1, "a": 2}, ___=True))', 'sort_keys', 'sort_keys=True ordena alfabéticamente las claves.'),
        out('¿Qué imprime?', 'import json\nprint(json.dumps({1: "a"}))', '{"1": "a"}', 'Las claves JSON son texto: el 1 pasa a "1".'),
        tf('json.dumps puede serializar directamente un set.', false, 'Un set lanza TypeError; hay que convertirlo a lista.'),
        out('¿Qué imprime?', 'import json\nprint(json.dumps({"a": [1, 2]}, indent=2))', '{\n  "a": [\n    1,\n    2\n  ]\n}', 'indent=2 formatea con sangrado de 2 espacios.'),
      ] },
    { id: 'l2', title: 'Expresiones regulares', intro:
'El módulo `re` busca patrones. Usa cadenas crudas `r"..."` para no duplicar barras.\n\n* `re.search(p, s)`: primera coincidencia o `None`\n* `re.findall(p, s)`: lista de todas\n* `re.sub(p, nuevo, s)`: reemplaza\n\nPatrones: `\\d` dígito, `\\w` letra/dígito/_, `+` uno o más, `*` cero o más, `?` opcional, `[abc]` conjunto, `( )` grupo, `^ $` inicio y fin.',
      ex: [
        out('¿Qué imprime?', 'import re\nprint(re.findall(r"\\d+", "a1 b22 c333"))', "['1', '22', '333']", '\\d+ captura secuencias de dígitos.'),
        out('¿Qué imprime?', 'import re\nprint(re.sub(r"\\s+", " ", "a   b \\t c"))', 'a b c', '\\s+ agrupa cualquier espacio en blanco y se reemplaza por uno.'),
        out('¿Qué imprime?', 'import re\nm = re.search(r"(\\w+)@(\\w+)\\.com", "mail: ana@sol.com")\nprint(m.group(1), m.group(2))', 'ana sol', 'Los grupos entre paréntesis se leen con group(n).'),
        mc('¿Qué devuelve re.search si no hay coincidencia?', ['""', 'False', 'None', 'Un error'], 2, 'Devuelve None; hay que comprobarlo antes de usar group.'),
        fill('Completa para validar solo dígitos de principio a fin', 'import re\nprint(bool(re.search(r"___\\d+$", "123")))', '^', '^ ancla al inicio y $ al final.'),
        out('¿Qué imprime?', 'import re\nprint(re.findall(r"[aeiou]", "murcielago"))', "['u', 'i', 'e', 'a', 'o']", 'Coincide con cada vocal en orden.'),
        out('¿Qué imprime?', 'import re\nprint(re.sub(r"(\\d+)-(\\d+)", r"\\2-\\1", "10-20"))', '20-10', '\\1 y \\2 en el reemplazo refieren a los grupos capturados.'),
      ] },
    { id: 'l3', title: 'Reto: StringIO y formato', intro:
'`io.StringIO` es un "archivo" en memoria: sirve para leer líneas o capturar texto sin disco.\n\n```\nimport io\nf = io.StringIO("a\\nb\\n")\nfor linea in f: ...\n```\n\nFormato avanzado en f-strings: `{x:>8}` alinea a la derecha, `{x:<8}` a la izquierda, `{x:^8}` centra, `{x:08.2f}` rellena con ceros, `{n:,}` separa miles, `{p:.1%}` porcentaje.',
      ex: [
        out('¿Qué imprime?', 'import io\nf = io.StringIO("uno\\ndos\\n")\nprint([l.strip() for l in f])', "['uno', 'dos']", 'Iterar un StringIO da línea a línea, con salto final.'),
        out('¿Qué imprime?', 'import io\nb = io.StringIO()\nprint("hola", file=b)\nprint(repr(b.getvalue()))', "'hola\\n'", 'print puede escribir en cualquier objeto con write; getvalue devuelve el texto.'),
        out('¿Qué imprime?', 'n = 1234567\nprint(f"{n:,}")', '1,234,567', 'La coma separa miles.'),
        out('¿Qué imprime?', 'print(f"[{\'ab\':>5}][{\'ab\':<5}][{\'ab\':^5}]")', '[   ab][ab   ][ ab  ]', 'Alineación derecha, izquierda y centrada en ancho 5.'),
        out('¿Qué imprime?', 'print(f"{0.256:.1%} {3.14159:08.2f}")', '25.6% 00003.14', '.1% multiplica por 100; 08.2f rellena con ceros hasta ancho 8.'),
        mc('¿Qué hace r"\\d" distinto de "\\d"?', ['Nada, son idénticos', 'La r evita interpretar la barra como escape', 'Hace el patrón insensible a mayúsculas', 'Compila el patrón'], 1, 'Una cadena cruda conserva las barras tal cual, ideal para regex.'),
        run('Escribe extraer_emails(texto): lista de emails (formato nombre@dominio.ext) en orden', 'import re\n\ndef extraer_emails(texto):\n    ', [['extraer_emails("a: ana@x.com, b: luis.p@mail.org")', '["ana@x.com", "luis.p@mail.org"]'], ['extraer_emails("nada")', '[]']], 'Usa findall con r"[\\w.]+@\\w+\\.\\w+".', 'import re\n\ndef extraer_emails(texto):\n    return re.findall(r"[\\w.]+@\\w+\\.\\w+", texto)'),
        run('Escribe tabla(filas): texto con cada (nombre, precio) como "nombre....precio" alineado: nombre a 6 a la izquierda y precio con 2 decimales a 7 a la derecha, unidas por saltos de línea', 'def tabla(filas):\n    ', [['tabla([("pan", 1.5), ("leche", 12)])', '"pan      1.50\\nleche   12.00"'], ['tabla([])', '""']], 'Usa f"{n:<6}{p:>7.2f}" para cada fila y "\\n".join.', 'def tabla(filas):\n    return "\\n".join(f"{n:<6}{p:>7.2f}" for n, p in filas)'),
      ] },
  ]},

  // ───────────── UNIDAD 13 ─────────────
  { id: 'u13', title: 'Código de calidad', desc: 'Errores propios, tipos, pruebas y buenas prácticas', lessons: [
    { id: 'l1', title: 'Excepciones propias', intro:
'Crea tus errores heredando de `Exception`:\n\n```\nclass SaldoError(Exception):\n    pass\n\ntry:\n    raise SaldoError("insuficiente")\nexcept SaldoError as e:\n    print(e)\nelse:\n    ...\nfinally:\n    ...\n```\n\n`else` corre si no hubo error; `finally` siempre. `raise` sin argumentos relanza; `raise X from e` encadena la causa. Captura lo más específico posible.',
      ex: [
        mc('¿De qué clase debe heredar una excepción propia?', ['object', 'Exception', 'Error', 'str'], 1, 'Se hereda de Exception (o de una subclase).'),
        out('¿Qué imprime?', 'class E(Exception):\n    pass\ntry:\n    raise E("fallo")\nexcept E as e:\n    print("capturado:", e)', 'capturado: fallo', 'str(e) es el mensaje pasado a la excepción.'),
        out('¿Qué imprime?', 'def f():\n    try:\n        return "a"\n    finally:\n        print("b")\nprint(f())', 'b\na', 'finally se ejecuta antes de que f devuelva su valor.'),
        out('¿Qué imprime?', 'try:\n    x = int("7")\nexcept ValueError:\n    print("mal")\nelse:\n    print("ok", x)\nfinally:\n    print("fin")', 'ok 7\nfin', 'Sin error corre else y luego finally.'),
        tf('except Exception captura también a una excepción propia que herede de Exception.', true, 'Las subclases son capturadas por su clase padre.'),
        out('¿Qué imprime?', 'class A(Exception): pass\nclass B(A): pass\ntry:\n    raise B()\nexcept A:\n    print("A")\nexcept B:\n    print("B")', 'A', 'Se usa el primer except que coincide y B es una A.'),
        out('¿Qué imprime?', 'try:\n    try:\n        1 / 0\n    except ZeroDivisionError as e:\n        raise ValueError("calc") from e\nexcept ValueError as v:\n    print(type(v.__cause__).__name__)', 'ZeroDivisionError', 'raise ... from e guarda la causa original en __cause__.'),
      ] },
    { id: 'l2', title: 'typing, assert y pruebas', intro:
'Las **anotaciones de tipo** documentan sin imponer:\n\n```\ndef media(xs: list[float]) -> float:\n```\n\n`Optional[int]` (o `int | None`) admite `None`. Herramientas como mypy las comprueban; Python no.\n\n`assert cond, "msg"` lanza `AssertionError` si falla: sirve para invariantes y pruebas. Con `unittest` se crean clases `TestCase` con métodos `test_*` y `self.assertEqual(a, b)`; `pytest` simplifica usando `assert` a secas.',
      ex: [
        out('¿Qué imprime?', 'def f(x: int) -> int:\n    return x\nprint(f("hola"))', 'hola', 'Python no impone las anotaciones en ejecución.'),
        out('¿Qué imprime?', 'try:\n    assert 2 + 2 == 5, "mate rota"\nexcept AssertionError as e:\n    print(e)', 'mate rota', 'El mensaje del assert queda en la excepción.'),
        mc('¿Qué comprueba self.assertEqual(a, b) en unittest?', ['Que a is b', 'Que a == b', 'Que a > b', 'Que no haya error'], 1, 'Falla la prueba si a y b no son iguales.'),
        fill('Completa el tipo de retorno opcional', 'from typing import Optional\ndef buscar(d: dict, k: str) -> ___[int]:\n    return d.get(k)', 'Optional', 'Optional[int] significa int o None.'),
        order('Ordena una prueba unittest', ['import unittest', 'class T(unittest.TestCase):', 'def test_suma(self):', 'self.assertEqual(1 + 1, 2)'], 'Importar, clase, método test_ y su aserción.'),
        tf('Usar assert para validar entrada del usuario es buena práctica.', false, 'Los assert pueden desactivarse con -O; para entradas usa excepciones.'),
        out('¿Qué imprime?', 'import unittest\nclass T(unittest.TestCase):\n    def test_a(self):\n        self.assertEqual(2 * 3, 6)\n    def test_b(self):\n        self.assertTrue("x" in "abc")\nr = unittest.TestResult()\nunittest.defaultTestLoader.loadTestsFromTestCase(T).run(r)\nprint(r.testsRun, len(r.failures))', '2 1', 'Se ejecutan 2 pruebas y test_b falla.'),
      ] },
    { id: 'l3', title: 'Reto: depura y mejora', intro:
'Buenas prácticas:\n\n* **PEP 8**: `snake_case` para funciones y variables, `PascalCase` para clases, 4 espacios, líneas < 80 caracteres.\n* Evita valores por defecto mutables: `def f(x=[])` comparte la lista entre llamadas; usa `None`.\n* Una función, una responsabilidad. Nombres claros.\n* Depura con `print`, `repr`, `breakpoint()` o pruebas pequeñas que reproduzcan el fallo.',
      ex: [
        out('¿Qué imprime?', 'def add(x, lst=[]):\n    lst.append(x)\n    return lst\nadd(1)\nprint(add(2))', '[1, 2]', 'El valor por defecto se crea una sola vez y se comparte.'),
        pair('Empareja elemento y convención PEP 8', [['Función', 'calcular_total'], ['Clase', 'CuentaBancaria'], ['Constante', 'MAX_INTENTOS'], ['Módulo', 'utilidades']], 'Funciones y módulos en snake_case; clases en PascalCase; constantes en MAYÚSCULAS.'),
        mc('¿Cuál es la forma correcta de un parámetro lista opcional?', ['def f(l=[])', 'def f(l=None) y crear la lista dentro', 'def f(l=list)', 'def f(l=())'], 1, 'Con None y creación interna cada llamada tiene su propia lista.'),
        out('¿Qué imprime?', 'def f(n):\n    return n if n == 0 else n + f(n - 1)\nprint(f(4))', '10', '4+3+2+1+0.'),
        tf('Un except vacío (bare except) es recomendable para "que nada falle".', false, 'Oculta errores reales e incluso Ctrl+C; captura excepciones concretas.'),
        run('Corrige agregar(x, lst=None): devuelve una lista nueva en cada llamada sin lista dada', 'def agregar(x, lst=None):\n    ', [['agregar(1)', '[1]'], ['agregar(2, [1])', '[1, 2]']], 'Si lst es None crea una lista; añade x y devuélvela.', 'def agregar(x, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(x)\n    return lst'),
        run('Escribe dividir_seguro(a, b): a/b o None si b es 0; lanza TypeError si algún valor no es número', 'def dividir_seguro(a, b):\n    ', [['dividir_seguro(6, 3)', '2.0'], ['dividir_seguro(1, 0)', 'null'], ['dividir_seguro(7, 2)', '3.5']], 'Comprueba isinstance, luego b == 0 y devuelve None.', 'def dividir_seguro(a, b):\n    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):\n        raise TypeError("solo números")\n    if b == 0:\n        return None\n    return a / b'),
      ] },
  ]},

  // ───────────── UNIDAD 14 ─────────────
  { id: 'u14', title: 'Estructuras y algoritmos', desc: 'Pilas, árboles, grafos, ordenar, buscar y optimizar', lessons: [
    { id: 'l1', title: 'Pilas, colas y árboles', intro:
'* **Pila** (LIFO): último en entrar, primero en salir. Con una lista: `append` y `pop()`.\n* **Cola** (FIFO): primero en entrar, primero en salir. Con `deque`: `append` y `popleft()`.\n* **Árbol binario**: cada nodo tiene valor, hijo izquierdo y derecho. Recorridos recursivos: *inorden* (izq, nodo, der), *preorden* (nodo, izq, der).\n\nUn árbol representado con tuplas: `(valor, izq, der)` y `None` si no hay hijo.',
      ex: [
        mc('¿Qué estructura es LIFO?', ['Cola', 'Pila', 'Deque solo', 'Diccionario'], 1, 'En la pila sale primero lo último que entró.'),
        out('¿Qué imprime?', 's = []\ns.append(1)\ns.append(2)\ns.append(3)\nprint(s.pop(), s.pop())', '3 2', 'pop() saca siempre el último elemento.'),
        out('¿Qué imprime?', 'from collections import deque\nq = deque()\nq.append("a")\nq.append("b")\nq.append("c")\nprint(q.popleft(), len(q))', 'a 2', 'En una cola sale el primero: a.'),
        out('¿Qué imprime?', 'def ino(t):\n    if t is None:\n        return []\n    v, i, d = t\n    return ino(i) + [v] + ino(d)\nprint(ino((2, (1, None, None), (3, None, None))))', '[1, 2, 3]', 'Inorden: izquierda, nodo, derecha.'),
        fill('Completa el caso base de la altura', 'def altura(t):\n    if t is ___:\n        return 0\n    return 1 + max(altura(t[1]), altura(t[2]))', 'None', 'Un árbol vacío (None) tiene altura 0.'),
        tf('Una pila puede usarse para comprobar paréntesis balanceados.', true, 'Apilas los que abren y desapilas al cerrar.'),
        run('Escribe balanceado(s): True si "()[]{}" están bien emparejados (usa una pila)', 'def balanceado(s):\n    ', [['balanceado("([]{})")', 'true'], ['balanceado("(]")', 'false'], ['balanceado("((")', 'false'], ['balanceado("")', 'true']], 'Apila aperturas; al cerrar compara con el tope; al final la pila debe estar vacía.', 'def balanceado(s):\n    pares = {")": "(", "]": "[", "}": "{"}\n    pila = []\n    for c in s:\n        if c in "([{":\n            pila.append(c)\n        elif c in pares:\n            if not pila or pila.pop() != pares[c]:\n                return False\n    return not pila'),
      ] },
    { id: 'l2', title: 'Grafos, BFS/DFS y ordenamiento', intro:
'Un **grafo** se guarda como dict de listas de vecinos: `{"A": ["B", "C"], "B": ["D"]}`.\n\n* **BFS** (anchura): usa una cola; recorre por niveles y halla caminos mínimos en grafos sin pesos.\n* **DFS** (profundidad): usa pila o recursión; explora hasta el fondo.\n\nGuarda un conjunto `visitados` para no repetir nodos. Ordenamientos: *burbuja* e *inserción* son O(n²); *merge sort* es O(n log n).',
      ex: [
        out('¿Qué imprime?', 'from collections import deque\ng = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}\nvis, q, orden = {"A"}, deque(["A"]), []\nwhile q:\n    n = q.popleft()\n    orden.append(n)\n    for v in g[n]:\n        if v not in vis:\n            vis.add(v)\n            q.append(v)\nprint(orden)', "['A', 'B', 'C', 'D']", 'BFS visita por niveles: A, luego B y C, luego D.'),
        out('¿Qué imprime?', 'g = {"A": ["B", "C"], "B": ["D"], "C": [], "D": []}\ndef dfs(n, vis):\n    vis.append(n)\n    for v in g[n]:\n        if v not in vis:\n            dfs(v, vis)\n    return vis\nprint(dfs("A", []))', "['A', 'B', 'D', 'C']", 'DFS baja por B hasta D antes de volver a C.'),
        mc('¿Qué estructura usa BFS?', ['Pila', 'Cola', 'Heap', 'Árbol AVL'], 1, 'La cola garantiza visitar por niveles.'),
        out('¿Qué imprime?', 'def burbuja(l):\n    l = l[:]\n    for i in range(len(l)):\n        for j in range(len(l) - 1 - i):\n            if l[j] > l[j + 1]:\n                l[j], l[j + 1] = l[j + 1], l[j]\n    return l\nprint(burbuja([3, 1, 2]))', '[1, 2, 3]', 'Cada pasada hunde el mayor al final.'),
        pair('Empareja algoritmo y complejidad típica', [['Burbuja', 'O(n²)'], ['Merge sort', 'O(n log n)'], ['Búsqueda lineal', 'O(n)'], ['Acceso a lista[i]', 'O(1)']], 'Burbuja anida bucles; merge sort divide y mezcla; lineal recorre todo; el índice es directo.'),
        out('¿Qué imprime?', 'def mezclar(a, b):\n    r = []\n    while a and b:\n        r.append(a.pop(0) if a[0] <= b[0] else b.pop(0))\n    return r + a + b\nprint(mezclar([1, 4], [2, 3, 5]))', '[1, 2, 3, 4, 5]', 'Mezclar dos listas ordenadas es el paso clave de merge sort.'),
        run('Escribe camino_corto(g, a, b): nº mínimo de aristas de a a b con BFS, o -1', 'from collections import deque\n\ndef camino_corto(g, a, b):\n    ', [['camino_corto({"A":["B","C"],"B":["D"],"C":["D"],"D":[]}, "A", "D")', '2'], ['camino_corto({"A":[],"B":[]}, "A", "B")', '-1'], ['camino_corto({"A":[]}, "A", "A")', '0']], 'BFS guardando la distancia de cada nodo.', 'from collections import deque\n\ndef camino_corto(g, a, b):\n    dist = {a: 0}\n    q = deque([a])\n    while q:\n        n = q.popleft()\n        if n == b:\n            return dist[n]\n        for v in g[n]:\n            if v not in dist:\n                dist[v] = dist[n] + 1\n                q.append(v)\n    return -1'),
      ] },
    { id: 'l3', title: 'Reto: búsqueda, Big-O y memoización', intro:
'**Búsqueda binaria**: en una lista ordenada compara con el medio y descarta la mitad: O(log n).\n\n**Big-O** describe cómo crece el costo con n: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).\n\n**Memoización**: guardar resultados ya calculados. `functools.lru_cache` o un dict. Es la base de la **programación dinámica**: resolver subproblemas una sola vez.',
      ex: [
        mc('¿Qué requiere la búsqueda binaria?', ['Lista ordenada', 'Lista de strings', 'Lista sin repetidos', 'Lista de más de 100 elementos'], 0, 'Descartar mitades solo funciona si hay orden.'),
        out('¿Qué imprime?', 'import bisect\nprint(bisect.bisect_left([1, 3, 5, 7], 5), bisect.bisect_left([1, 3, 5, 7], 4))', '2 2', 'bisect_left da la posición donde iría el valor sin romper el orden.'),
        mc('Si n pasa de 1.000 a 2.000, ¿qué algoritmo crece más?', ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'], 2, 'O(n²) se multiplica por 4 al duplicar n.'),
        out('¿Qué imprime?', 'from functools import lru_cache\nllamadas = 0\n@lru_cache(maxsize=None)\ndef f(n):\n    global llamadas\n    llamadas += 1\n    return n if n < 2 else f(n - 1) + f(n - 2)\nf(20)\nprint(llamadas)', '21', 'Con caché cada n de 0 a 20 se calcula una sola vez.'),
        tf('La versión recursiva de Fibonacci sin memoización es O(2ⁿ) aproximadamente.', true, 'Recalcula los mismos subproblemas exponencialmente.'),
        run('Escribe busqueda_binaria(l, x): índice de x en la lista ordenada l, o -1', 'def busqueda_binaria(l, x):\n    ', [['busqueda_binaria([1, 3, 5, 7, 9], 7)', '3'], ['busqueda_binaria([1, 3, 5], 4)', '-1'], ['busqueda_binaria([], 1)', '-1'], ['busqueda_binaria([2], 2)', '0']], 'Mantén lo y hi y parte por el medio.', 'def busqueda_binaria(l, x):\n    lo, hi = 0, len(l) - 1\n    while lo <= hi:\n        m = (lo + hi) // 2\n        if l[m] == x:\n            return m\n        if l[m] < x:\n            lo = m + 1\n        else:\n            hi = m - 1\n    return -1'),
        run('Escribe monedas(cantidad, tipos): mínimo de monedas para sumar cantidad (programación dinámica), -1 si es imposible', 'def monedas(cantidad, tipos):\n    ', [['monedas(11, [1, 2, 5])', '3'], ['monedas(3, [2])', '-1'], ['monedas(0, [1])', '0'], ['monedas(6, [1, 3, 4])', '2']], 'dp[i] = 1 + min(dp[i - m]) para cada moneda m <= i.', 'def monedas(cantidad, tipos):\n    inf = float("inf")\n    dp = [0] + [inf] * cantidad\n    for i in range(1, cantidad + 1):\n        for m in tipos:\n            if m <= i and dp[i - m] + 1 < dp[i]:\n                dp[i] = dp[i - m] + 1\n    return -1 if dp[cantidad] == inf else dp[cantidad]'),
      ] },
  ]},

  // ───────────── UNIDAD 15 ─────────────
  { id: 'u15', title: 'Proyectos guiados', desc: 'Tres mini-proyectos completos, paso a paso', lessons: [
    { id: 'l1', title: 'Proyecto: mini-juego por turnos', intro:
'Construiremos un duelo por turnos **determinista** (sin azar) en pasos: 1) estado de un luchador con un dict, 2) función de ataque, 3) bucle de turnos, 4) ganador.\n\nModelo: `{"nombre": "Ana", "vida": 10, "ataque": 3}`. Atacar resta el ataque a la vida del rival, sin bajar de 0. Los luchadores alternan: primero el A, luego el B, hasta que alguien llegue a 0.',
      ex: [
        out('Paso 1: ¿qué imprime?', 'ana = {"nombre": "Ana", "vida": 10, "ataque": 3}\nprint(f"{ana[\'nombre\']} tiene {ana[\'vida\']} de vida")', 'Ana tiene 10 de vida', 'Se accede a los campos del dict por clave.'),
        out('Paso 2: ¿qué imprime?', 'def atacar(a, b):\n    b["vida"] = max(0, b["vida"] - a["ataque"])\na = {"ataque": 4}\nb = {"vida": 3}\natacar(a, b)\nprint(b["vida"])', '0', 'max evita vida negativa: 3 - 4 pasa a 0.'),
        mc('Paso 2: ¿por qué atacar puede modificar el dict sin devolver nada?', ['Los dict se pasan por referencia al objeto', 'Python copia el dict', 'Es un error', 'Porque es global'], 0, 'La función recibe una referencia al mismo dict y lo muta.'),
        order('Paso 3: ordena el bucle de turnos', ['while a["vida"] > 0 and b["vida"] > 0:', 'atacar(a, b)', 'if b["vida"] > 0:', 'atacar(b, a)'], 'B solo contraataca si sigue vivo.'),
        out('Paso 3: ¿qué imprime?', 'def atacar(a, b):\n    b["vida"] = max(0, b["vida"] - a["ataque"])\na = {"vida": 10, "ataque": 4}\nb = {"vida": 9, "ataque": 2}\nturnos = 0\nwhile a["vida"] > 0 and b["vida"] > 0:\n    atacar(a, b)\n    turnos += 1\n    if b["vida"] > 0:\n        atacar(b, a)\nprint(turnos, a["vida"], b["vida"])', '3 6 0', 'B cae en el turno 3 (9→5→1→0) y A recibió 2 golpes de 2.'),
        run('Paso 4: escribe duelo(a, b) que devuelva el nombre del ganador (A ataca primero)', 'def duelo(a, b):\n    ', [['duelo({"nombre":"Ana","vida":10,"ataque":4},{"nombre":"Bo","vida":9,"ataque":2})', '"Ana"'], ['duelo({"nombre":"Ana","vida":3,"ataque":1},{"nombre":"Bo","vida":10,"ataque":5})', '"Bo"']], 'Alterna golpes; devuelve el nombre del que deje a 0 al rival.', 'def duelo(a, b):\n    while True:\n        b["vida"] = max(0, b["vida"] - a["ataque"])\n        if b["vida"] == 0:\n            return a["nombre"]\n        a["vida"] = max(0, a["vida"] - b["ataque"])\n        if a["vida"] == 0:\n            return b["nombre"]'),
        run('Paso 5: escribe simular(a, b) que devuelva el registro de vidas "A:vida B:vida" tras cada turno completo', 'def simular(a, b):\n    ', [['simular({"vida":6,"ataque":3},{"vida":5,"ataque":2})', '["A:4 B:2", "A:4 B:0"]']], 'Tras cada ataque guarda f"A:{...} B:{...}"; para cuando B llegue a 0.', 'def simular(a, b):\n    reg = []\n    while a["vida"] > 0 and b["vida"] > 0:\n        b["vida"] = max(0, b["vida"] - a["ataque"])\n        if b["vida"] > 0:\n            a["vida"] = max(0, a["vida"] - b["ataque"])\n        reg.append(f"A:{a[\'vida\']} B:{b[\'vida\']}")\n    return reg'),
      ] },
    { id: 'l2', title: 'Proyecto: gestor de tareas', intro:
'Un gestor de tareas con una **clase** que guarda una lista de dicts. Pasos: 1) clase `Gestor` con `agregar`, 2) marcar como hecha, 3) filtrar y ordenar, 4) exportar a JSON.\n\nCada tarea: `{"id": 1, "titulo": "...", "hecha": False, "prioridad": 2}`. El id lo asigna el gestor de forma incremental. Reutilizamos clases, comprensiones, `sorted(key=)` y `json`.',
      ex: [
        out('Paso 1: ¿qué imprime?', 'class Gestor:\n    def __init__(self):\n        self.tareas = []\n    def agregar(self, titulo, prioridad=1):\n        t = {"id": len(self.tareas) + 1, "titulo": titulo, "hecha": False, "prioridad": prioridad}\n        self.tareas.append(t)\n        return t["id"]\ng = Gestor()\ng.agregar("a")\nprint(g.agregar("b", 3), len(g.tareas))', '2 2', 'El segundo id es 2 y hay dos tareas.'),
        out('Paso 2: ¿qué imprime?', 'tareas = [{"id": 1, "hecha": False}, {"id": 2, "hecha": False}]\ndef completar(tareas, i):\n    for t in tareas:\n        if t["id"] == i:\n            t["hecha"] = True\n            return True\n    return False\nprint(completar(tareas, 2), completar(tareas, 9), [t["hecha"] for t in tareas])', 'True False [False, True]', 'Devuelve False si el id no existe; solo la tarea 2 queda hecha.'),
        mc('Paso 3: ¿qué expresión da los títulos pendientes?', ['[t["titulo"] for t in ts if not t["hecha"]]', '[t for t in ts if t.hecha]', 'filter(ts, hecha)', '[t["hecha"] for t in ts]'], 0, 'Comprensión de lista con filtro por not hecha.'),
        out('Paso 3: ¿qué imprime?', 'ts = [{"t": "x", "p": 1}, {"t": "y", "p": 3}, {"t": "z", "p": 3}]\nprint([t["t"] for t in sorted(ts, key=lambda t: (-t["p"], t["t"]))])', "['y', 'z', 'x']", 'Mayor prioridad primero; empate por título.'),
        out('Paso 4: ¿qué imprime?', 'import json\nts = [{"id": 1, "hecha": True}]\ns = json.dumps(ts)\nprint(s)\nprint(json.loads(s) == ts)', '[{"id": 1, "hecha": true}]\nTrue', 'JSON ida y vuelta conserva los datos.'),
        run('Paso 5: escribe pendientes(tareas): títulos no hechas ordenadas por prioridad desc y luego título', 'def pendientes(tareas):\n    ', [['pendientes([{"titulo":"b","hecha":False,"prioridad":1},{"titulo":"a","hecha":False,"prioridad":1},{"titulo":"c","hecha":True,"prioridad":9},{"titulo":"d","hecha":False,"prioridad":5}])', '["d", "a", "b"]'], ['pendientes([])', '[]']], 'Filtra not hecha y ordena con key=(-prioridad, titulo).', 'def pendientes(tareas):\n    p = [t for t in tareas if not t["hecha"]]\n    p.sort(key=lambda t: (-t["prioridad"], t["titulo"]))\n    return [t["titulo"] for t in p]'),
        run('Paso 6: escribe resumen(tareas): JSON con claves ordenadas {"hechas": n, "total": n, "pendientes": n}', 'import json\n\ndef resumen(tareas):\n    ', [['resumen([{"hecha":True},{"hecha":False},{"hecha":False}])', '"{\\"hechas\\": 1, \\"pendientes\\": 2, \\"total\\": 3}"'], ['resumen([])', '"{\\"hechas\\": 0, \\"pendientes\\": 0, \\"total\\": 0}"']], 'Cuenta y usa json.dumps(d, sort_keys=True).', 'import json\n\ndef resumen(tareas):\n    h = sum(1 for t in tareas if t["hecha"])\n    return json.dumps({"total": len(tareas), "hechas": h, "pendientes": len(tareas) - h}, sort_keys=True)'),
      ] },
    { id: 'l3', title: 'Reto: análisis de datos', intro:
'Analizaremos una lista de dicts (ventas) sin librerías externas: 1) agrupar con `defaultdict`, 2) sumar y promediar, 3) rankear con `sorted`, 4) formatear el informe.\n\n```\nventas = [{"region": "N", "monto": 100}, ...]\n```\n\nPatrón clave: recorrer una vez, acumular por clave y luego ordenar. Redondea con `round(x, 2)` para salidas estables.',
      ex: [
        out('Paso 1: ¿qué imprime?', 'from collections import defaultdict\nventas = [{"r": "N", "m": 10}, {"r": "S", "m": 5}, {"r": "N", "m": 7}]\nacc = defaultdict(int)\nfor v in ventas:\n    acc[v["r"]] += v["m"]\nprint(dict(acc))', "{'N': 17, 'S': 5}", 'Se acumula el monto por región.'),
        out('Paso 2: ¿qué imprime?', 'montos = [10, 20, 40]\nprint(sum(montos) / len(montos), max(montos) - min(montos))', '23.333333333333332 30', 'Media y rango; la media es float con muchos decimales.'),
        out('Paso 2: ¿qué imprime?', 'print(round(70 / 3, 2))', '23.33', 'round(x, 2) deja dos decimales.'),
        out('Paso 3: ¿qué imprime?', 'tot = {"N": 17, "S": 5, "E": 17}\nprint(sorted(tot.items(), key=lambda kv: (-kv[1], kv[0])))', "[('E', 17), ('N', 17), ('S', 5)]", 'Total descendente y desempate alfabético.'),
        mc('Paso 3: ¿por qué incluir la clave en el desempate?', ['Para que el resultado sea determinista', 'Porque sorted lo exige', 'Para ir más rápido', 'No sirve para nada'], 0, 'Sin desempate explícito, el orden de empates depende del orden de entrada.'),
        run('Paso 4: escribe total_por_region(ventas): dict región → suma de monto', 'def total_por_region(ventas):\n    ', [['total_por_region([{"region":"N","monto":10},{"region":"S","monto":5},{"region":"N","monto":7}])', '{"N": 17, "S": 5}'], ['total_por_region([])', '{}']], 'Acumula con un dict y .get(clave, 0).', 'def total_por_region(ventas):\n    t = {}\n    for v in ventas:\n        t[v["region"]] = t.get(v["region"], 0) + v["monto"]\n    return t'),
        run('Paso 5: escribe informe(ventas): líneas "REGION: total (xx.x%)" por total desc y región asc, unidas por \\n; porcentaje con 1 decimal', 'def informe(ventas):\n    ', [['informe([{"region":"N","monto":30},{"region":"S","monto":10},{"region":"E","monto":10}])', '"N: 30 (60.0%)\\nE: 10 (20.0%)\\nS: 10 (20.0%)"'], ['informe([{"region":"A","monto":1}])', '"A: 1 (100.0%)"']], 'Agrupa, calcula total general y da formato con f"{pct:.1f}%".', 'def informe(ventas):\n    t = {}\n    for v in ventas:\n        t[v["region"]] = t.get(v["region"], 0) + v["monto"]\n    suma = sum(t.values())\n    filas = sorted(t.items(), key=lambda kv: (-kv[1], kv[0]))\n    return "\\n".join(f"{r}: {m} ({m / suma * 100:.1f}%)" for r, m in filas)'),
      ] },
  ]}
);
})();
