(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.csharp.units.push(
  // ───────────── UNIDAD 7 ─────────────
  { id: 'u7', title: 'Records, pattern matching y delegados', desc: 'C# moderno', lessons: [
    { id: 'l1', title: 'Records y pattern matching', intro: L(
'Un **record** es un tipo de datos con igualdad **por valor** y copia no destructiva con `with`:',
'',
'```csharp',
'record Punto(int X, int Y);',
'var p = new Punto(1, 2);',
'var q = p with { X = 9 };   // copia cambiando X',
'```',
'',
'El **pattern matching** permite comprobar la forma de un valor: `o is int i && i > 40`, `switch` como expresión (`n switch { 1 => "uno", 2 or 3 => "pocos", _ => "muchos" }`) y patrones de propiedades (`p is { Edad: >= 18 }`).'),
      ex: [
        out('¿Qué imprime?', L('var p = new Punto(1, 2);', 'Console.WriteLine(p);', 'record Punto(int X, int Y);'), 'Punto { X = 1, Y = 2 }', 'El ToString de un record muestra su nombre y sus propiedades.'),
        out('¿Qué imprime?', L('var p = new Punto(1, 2);', 'var q = p with { X = 9 };', 'Console.WriteLine(q.X + " " + p.X);', 'record Punto(int X, int Y);'), '9 1', 'with crea una copia nueva; el original p no cambia.'),
        out('¿Qué imprime?', L('int n = 3;', 'string s = n switch { 1 => "uno", 2 or 3 => "pocos", _ => "muchos" };', 'Console.WriteLine(s);'), 'pocos', 'El patrón 2 or 3 coincide con 3.'),
        out('¿Qué imprime?', L('object o = 42;', 'if (o is int i && i > 40) Console.WriteLine(i + 1);'), '43', 'El patrón comprueba que es int y crea la variable i ya convertida.'),
        mc('¿Cómo compara la igualdad un record?', ['Por valor, comparando sus propiedades', 'Por referencia', 'Nunca son iguales', 'Solo por la primera propiedad'], 0, 'Dos records con los mismos datos son iguales aunque sean objetos distintos.'),
        tf('Las propiedades de un record posicional se pueden asignar libremente después de crearlo.', false, 'Son init-only: solo se asignan al construir (o con with).'),
        out('¿Qué imprime?', L('var p = new { Edad = 20 };', 'Console.WriteLine(p is { Edad: >= 18 });'), 'True', 'El patrón de propiedad comprueba que Edad sea 18 o más.'),
      ] },
    { id: 'l2', title: 'Delegados, Func y Action', intro: L(
'Un **delegado** es una variable que guarda una función. Los más usados vienen ya definidos:',
'',
'* `Action<...>`: no devuelve nada · `Func<..., R>`: devuelve `R` (el último tipo) · `Predicate<T>`: devuelve `bool`.',
'* Se pueden **combinar** con `+=` (multicast): al invocar, se ejecutan todos en orden.',
'* Un **event** es un delegado protegido: solo la clase que lo declara puede dispararlo; los demás solo se suscriben (`+=`).',
'',
'```csharp',
'Func<int, int> f = x => x * 3;',
'```'),
      ex: [
        out('¿Qué imprime?', L('Func<int, int> f = x => x * 3;', 'Console.WriteLine(f(4));'), '12', 'La lambda multiplica su argumento por 3.'),
        out('¿Qué imprime?', L('Action<string> a = s => Console.WriteLine("hola " + s);', 'a("Ana");'), 'hola Ana', 'Action no devuelve nada; ejecuta el bloque con el argumento.'),
        out('¿Qué imprime?', L('Action a = () => Console.Write("1");', 'a += () => Console.Write("2");', 'a();'), '12', 'Un delegado multicast ejecuta todas las funciones en el orden en que se añadieron.'),
        mc('¿Qué representa Func<int, int, bool>?', ['Una función con dos int que devuelve bool', 'Dos funciones', 'Una función sin parámetros', 'Un evento'], 0, 'En Func el último tipo genérico siempre es el valor devuelto.'),
        tf('Un event solo puede dispararse desde la clase que lo declara.', true, 'Desde fuera únicamente se puede suscribir (+=) o desuscribir (-=).'),
        out('¿Qué imprime?', L('Predicate<int> p = n => n > 2;', 'Console.WriteLine(p(3));'), 'True', 'Predicate devuelve bool: 3 > 2 es verdadero.'),
        fill('Declara una función de int a int', '___<int, int> cuadrado = x => x * x;', 'Func', 'Func<entrada, salida> describe una función que devuelve un valor.'),
      ] },
    { id: 'l3', title: 'Reto: valores nulos', intro: L(
'* `?.` accede solo si el objeto no es null: `s?.Length`.',
'* `??` da un valor por defecto: `s?.Length ?? -1`.',
'* `??=` asigna **solo si** la variable es null.',
'* `int?` es un tipo valor que admite null (`HasValue`, `Value`).',
'* Con *nullable reference types* activado, `string` es no nulo por defecto y `string?` sí admite null.'),
      ex: [
        out('¿Qué imprime?', L('string s = null;', 'Console.WriteLine(s?.Length ?? -1);'), '-1', 's?.Length da null y ?? lo reemplaza por -1.'),
        out('¿Qué imprime?', L('int? x = null;', 'Console.WriteLine(x.HasValue);'), 'False', 'Un int? sin valor devuelve false en HasValue.'),
        out('¿Qué imprime?', L('int? x = 5;', 'Console.WriteLine(x ?? 0);'), '5', 'Como x tiene valor, ?? usa ese valor.'),
        out('¿Qué imprime?', L('string s = null;', 's ??= "x";', 'Console.WriteLine(s);'), 'x', '??= asigna porque s era null.'),
        mc('¿Qué hace el operador ??=?', ['Asigna solo si la variable es null', 'Compara dos valores', 'Convierte a nullable', 'Lanza una excepción'], 0, 'Es una forma corta de "si es null, asigna".'),
        tf('Con nullable reference types, string? indica que el valor puede ser null.', true, 'Y string (sin ?) se considera que nunca debería ser null.'),
      ] },
  ]}
);
})();
