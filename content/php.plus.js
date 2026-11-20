(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.php.units.push(
  // ───────────── UNIDAD 6 ─────────────
  { id: 'u6', title: 'PHP 8 moderno', desc: 'match, enums, readonly y tipado estricto', lessons: [
    { id: 'l1', title: 'match, null-safe y argumentos con nombre', intro: L(
'PHP 8 trajo sintaxis más segura:',
'',
'```php',
'echo match($n) { 1 => "uno", 2 => "dos", default => "otro" };',
'echo $u?->nombre ?? "anónimo";   // null-safe',
'f(b: 1, a: 10);                  // argumentos con nombre',
'```',
'',
'**match** es una *expresión* (devuelve valor), compara con `===` y lanza `UnhandledMatchError` si ningún caso coincide y no hay `default`. El operador **`?->`** devuelve `null` si el objeto es `null` en vez de dar error.'),
      ex: [
        out('¿Qué imprime?', '<?php\necho match(2) { 1 => "uno", 2 => "dos", default => "otro" };', 'dos', 'match devuelve el valor de la rama cuyo patrón coincide.'),
        out('¿Qué imprime?', '<?php\n$u = null;\necho $u?->nombre ?? "anónimo";', 'anónimo', '?-> evita el error y produce null; ?? aporta el valor por defecto.'),
        out('¿Qué imprime?', L('<?php', 'function f(int $a, int $b = 2) { return $a - $b; }', 'echo f(b: 1, a: 10);'), '9', 'Con argumentos con nombre el orden no importa: 10 - 1.'),
        mc('¿En qué se diferencia match de switch?', ['match devuelve un valor y compara de forma estricta (===)', 'match es más lento', 'match necesita break', 'No hay diferencias'], 0, 'switch compara con == y necesita break; match no tiene "caída" entre ramas.'),
        tf('match lanza UnhandledMatchError si ningún caso coincide y no hay default.', true, 'A diferencia de switch, no falla en silencio.'),
        out('¿Qué imprime?', '<?php\necho match(true) { 5 > 3 => "mayor", default => "menor" };', 'mayor', 'match(true) permite evaluar condiciones: la primera que sea true gana.'),
        fill('Completa la expresión', '$x = ___ (1) { 1 => "a", default => "b" };', 'match', 'La palabra clave match inicia la expresión.'),
      ] },
    { id: 'l2', title: 'Enums, readonly y promoción de constructor', intro: L(
'* **Enums** (PHP 8.1): `enum Palo: string { case Oros = "O"; }` → `Palo::Oros->value`.',
'* **Promoción de constructor**: declara y asigna propiedades en el constructor.',
'* **`readonly`**: la propiedad solo se asigna una vez; modificarla lanza `Error`.',
'* **Tipos unión**: `int|string`. **Funciones flecha**: `fn($x) => $x * 2`.',
'* `str_contains($texto, $parte)` (PHP 8) comprueba si un texto contiene otro.',
'',
'```php',
'class P { public function __construct(public int $x = 0) {} }',
'```'),
      ex: [
        out('¿Qué imprime?', L('<?php', 'enum Palo: string {', '    case Oros = "O";', '    case Copas = "C";', '}', 'echo Palo::Copas->value;'), 'C', 'value devuelve el valor asociado al caso del enum.'),
        out('¿Qué imprime?', L('<?php', 'class P {', '    public function __construct(public int $x = 0) {}', '}', '$p = new P(5);', 'echo $p->x;'), '5', 'La promoción crea la propiedad x y le asigna el argumento recibido.'),
        out('¿Qué imprime?', L('<?php', 'class A {', '    public function __construct(public readonly int $v) {}', '}', '$a = new A(1);', 'try { $a->v = 2; } catch (Error $e) { echo "inmutable"; }'), 'inmutable', 'Modificar una propiedad readonly ya inicializada lanza un Error.'),
        mc('¿Qué significa int|string en un parámetro?', ['Acepta un entero o un string', 'Acepta ambos a la vez', 'Convierte a entero', 'Es un comentario'], 0, 'Es un tipo unión: el valor debe ser de alguno de los tipos indicados.'),
        out('¿Qué imprime?', '<?php\n$f = fn($x) => $x * 2;\necho $f(4);', '8', 'La función flecha devuelve el resultado de su única expresión.'),
        tf('Una propiedad readonly se puede reasignar después de inicializarla.', false, 'Solo se puede asignar una vez, normalmente en el constructor.'),
        out('¿Qué imprime?', '<?php\necho str_contains("hola mundo", "mun") ? "si" : "no";', 'si', 'str_contains devuelve true si el texto contiene la parte buscada.'),
      ] },
    { id: 'l3', title: 'Reto: excepciones y tipado estricto', intro: L(
'* `try { } catch (Tipo $e) { } finally { }`: `finally` se ejecuta **siempre**.',
'* `Throwable` es la interfaz base de `Exception` (errores de tu lógica) y `Error` (errores del motor, como `TypeError`).',
'* `declare(strict_types=1);` al inicio del archivo **desactiva la coerción** de tipos escalares: pasar `"5"` a un parámetro `int` lanza `TypeError`.',
'* Puedes crear tus propias excepciones: `class MiError extends Exception {}`.',
'* `intdiv(7, 2)` hace división entera (3).'),
      ex: [
        out('¿Qué imprime?', '<?php\ntry { throw new Exception("x"); }\ncatch (Exception $e) { echo "c"; }\nfinally { echo "f"; }', 'cf', 'Se ejecuta el catch y después el finally.'),
        out('¿Qué imprime?', L('<?php', 'declare(strict_types=1);', 'function f(int $x) { return $x; }', 'try { f("5"); } catch (TypeError $e) { echo "tipo"; }'), 'tipo', 'Con strict_types, un string no se convierte a int automáticamente.'),
        mc('¿Qué hace declare(strict_types=1)?', ['Evita la conversión automática de tipos escalares en llamadas', 'Activa el modo debug', 'Hace todas las variables constantes', 'Ordena los imports'], 0, 'Obliga a que los argumentos coincidan exactamente con el tipo declarado.'),
        out('¿Qué imprime?', '<?php\necho intdiv(7, 2);', '3', 'intdiv devuelve el cociente entero de la división.'),
        tf('Throwable es la interfaz de la que derivan Error y Exception.', true, 'Por eso catch (Throwable $e) atrapa ambos tipos.'),
        out('¿Qué imprime?', L('<?php', 'class MiError extends Exception {}', 'try { throw new MiError("hola"); }', 'catch (MiError $e) { echo $e->getMessage(); }'), 'hola', 'La excepción personalizada hereda getMessage de Exception.'),
      ] },
  ]}
);
})();
