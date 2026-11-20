(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.rust.units.push(
  // ───────────── UNIDAD 6 ─────────────
  { id: 'u6', title: 'Errores, módulos y punteros inteligentes', desc: 'Result, ?, mod, Box, Rc y RefCell', lessons: [
    { id: 'l1', title: 'Result y el operador ?', intro: L(
'Rust no tiene excepciones: los errores son **valores** de tipo `Result<T, E>` (`Ok(valor)` o `Err(error)`).',
'',
'```rust',
'fn doble(s: &str) -> Result<i32, std::num::ParseIntError> {',
'    let n: i32 = s.parse()?;   // si falla, retorna el Err',
'    Ok(n * 2)',
'}',
'```',
'',
'El operador **`?`** devuelve el error automáticamente a quien llamó; solo funciona en funciones que devuelven `Result` u `Option`. `unwrap_or(x)` da un valor por defecto y `map` transforma el valor interior.'),
      ex: [
        out('¿Qué imprime?', L('fn dividir(a: i32, b: i32) -> Result<i32, String> {', '    if b == 0 { Err("cero".to_string()) } else { Ok(a / b) }', '}', 'println!("{:?}", dividir(6, 3));', 'println!("{:?}", dividir(1, 0));'), 'Ok(2)\nErr("cero")', '{:?} muestra el valor con formato de depuración: Ok(2) y Err("cero").'),
        out('¿Qué imprime?', L('fn doble(s: &str) -> Result<i32, std::num::ParseIntError> {', '    let n: i32 = s.parse()?;', '    Ok(n * 2)', '}', 'println!("{:?}", doble("21"));', 'println!("{}", doble("x").is_err());'), 'Ok(42)\ntrue', '"21" se convierte y se duplica; "x" no es un número, así que devuelve Err.'),
        mc('¿Qué hace el operador ? cuando recibe un Err?', ['Retorna ese error de la función actual', 'Hace panic', 'Lo ignora', 'Lo convierte en 0'], 0, 'Propaga el error hacia arriba sin escribir un match.'),
        out('¿Qué imprime?', L('let r: Result<i32, String> = Err("x".into());', 'println!("{}", r.unwrap_or(0));'), '0', 'Como es Err, unwrap_or entrega el valor por defecto.'),
        tf('El operador ? solo puede usarse en funciones que devuelven Result u Option.', true, 'Necesita un tipo de retorno al que pueda "propagar" el error.'),
        out('¿Qué imprime?', L('let x = Some(3).map(|n| n + 1);', 'println!("{:?}", x);'), 'Some(4)', 'map aplica la función al valor dentro del Some.'),
        fill('Propaga el error con el operador adecuado', 'let n: i32 = "5".parse()___;', '?', 'El signo ? al final de la expresión propaga el posible error.'),
      ] },
    { id: 'l2', title: 'Módulos y visibilidad', intro: L(
'Los **módulos** organizan el código: `mod nombre { ... }` (o un archivo `nombre.rs`).',
'',
'* Todo es **privado** por defecto; `pub` lo hace público.',
'* Se accede con rutas: `mates::doble(4)`; `use mates::doble;` trae el nombre al ámbito.',
'* `crate` es la raíz del paquete actual.',
'* Las dependencias externas se declaran en `Cargo.toml`, sección `[dependencies]`.'),
      ex: [
        out('¿Qué imprime?', L('mod mates {', '    pub fn doble(x: i32) -> i32 { x * 2 }', '}', 'println!("{}", mates::doble(4));'), '8', 'La función es pub, por lo que se puede llamar desde fuera del módulo.'),
        mc('Por defecto, ¿cómo son los elementos dentro de un mod?', ['Privados', 'Públicos', 'Estáticos', 'Constantes'], 0, 'Rust es "privado por defecto": hay que escribir pub para exponerlos.'),
        tf('use trae un nombre al ámbito actual para no escribir la ruta completa.', true, 'Por ejemplo, use std::collections::HashMap; permite escribir HashMap.'),
        fill('Haz pública la función', '___ fn saluda() {}', 'pub', 'pub expone la función a otros módulos.'),
        mc('¿Dónde se declaran las dependencias de un proyecto?', ['En Cargo.toml, sección [dependencies]', 'En main.rs', 'En lib.rs', 'En target/'], 0, 'Cargo las descarga y compila automáticamente.'),
        pair('Empareja la palabra con su función', [['mod', 'define un módulo'], ['pub', 'hace público'], ['use', 'trae al ámbito'], ['crate', 'raíz del paquete']], 'Con estas cuatro organizas cualquier proyecto Rust.'),
        out('¿Qué imprime?', L('mod a {', '    pub mod b {', '        pub const N: i32 = 5;', '    }', '}', 'println!("{}", a::b::N);'), '5', 'Se accede a la constante por la ruta a::b::N.'),
      ] },
    { id: 'l3', title: 'Reto: Box, Rc y RefCell', intro: L(
'Los **punteros inteligentes** gestionan memoria con reglas claras:',
'',
'* `Box<T>`: guarda el valor en el **heap** con un único dueño (útil para tipos recursivos).',
'* `Rc<T>`: **varios dueños** en un solo hilo; `Rc::strong_count` cuenta las referencias (para hilos, `Arc<T>`).',
'* `RefCell<T>`: permite **mutar** dentro de algo inmutable; comprueba las reglas de préstamo **en tiempo de ejecución** (si las rompes, hay `panic`).'),
      ex: [
        out('¿Qué imprime?', L('let b = Box::new(5);', 'println!("{}", *b + 1);'), '6', '*b accede al valor dentro del Box.'),
        out('¿Qué imprime?', L('use std::rc::Rc;', 'let a = Rc::new(String::from("hola"));', 'let b = Rc::clone(&a);', 'println!("{}", Rc::strong_count(&a));'), '2', 'Rc::clone no copia el texto: solo aumenta el contador de dueños.'),
        out('¿Qué imprime?', L('use std::cell::RefCell;', 'let c = RefCell::new(1);', '*c.borrow_mut() += 5;', 'println!("{}", c.borrow());'), '6', 'borrow_mut da acceso mutable temporal al interior del RefCell.'),
        mc('¿Cuándo se usa Rc en lugar de una referencia normal?', ['Cuando varios dueños comparten un dato en un solo hilo', 'Cuando hay varios hilos', 'Para evitar el heap', 'Para datos muy pequeños'], 0, 'Con hilos se usa Arc, su versión atómica.'),
        tf('RefCell comprueba las reglas de préstamo en tiempo de ejecución.', true, 'Si pides dos borrow_mut a la vez, el programa hace panic.'),
        mc('¿Para qué sirve Box en un tipo recursivo, como una lista enlazada?', ['Da un tamaño conocido al guardar el siguiente nodo en el heap', 'Hace el código más rápido', 'Evita los errores', 'Permite herencia'], 0, 'Sin Box el compilador no podría calcular el tamaño infinito del tipo.'),
      ] },
  ]}
);
})();
