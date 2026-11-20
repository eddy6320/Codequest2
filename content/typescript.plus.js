(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, pair } = CQ.h;
CQ.content.typescript.units.push({ id: 'u6', title: 'Genéricos y utilidades', desc: 'Tipos reutilizables', lessons: [
{ id: 'l1', title: 'Genéricos básicos', intro: 'Un **genérico** es un tipo con parámetro, para reutilizar código sin perder seguridad.\n\n```\nfunction primero<T>(xs: T[]): T {\n  return xs[0];\n}\n```\n\n`T` toma el tipo con el que llamas la función: con `number[]` devuelve `number`.', ex: [
 mc('¿Qué es T en function f<T>(x: T)?', ['Un parámetro de tipo', 'Un valor', 'Una clase fija', 'Un error'], 0, 'T es un tipo que se decide al usar la función.'),
 fill('Declara la función genérica', 'function id___(x: T): T { return x; }', ['<T>'], 'Los tipos genéricos van entre < >.'),
 tf('Los genéricos permiten reutilizar código manteniendo los tipos.', true, 'Ese es su objetivo.'),
 mc('primero<string>(["a","b"]) devuelve...', ['string', 'number', 'any', 'void'], 0, 'T es string.'),
 order('Ordena la función', ['function id<T>(x: T): T {', 'return x;', '}'], 'Firma, cuerpo y cierre.')] },
{ id: 'l2', title: 'Interfaces genéricas', intro: 'Las interfaces también aceptan parámetros de tipo.\n\n```\ninterface Caja<T> {\n  valor: T;\n}\nconst c: Caja<number> = { valor: 5 };\n```\n\nAsí una sola interfaz sirve para números, textos u objetos.', ex: [
 mc('¿Qué tipo tiene valor en Caja<string>?', ['string', 'number', 'T', 'any'], 0, 'T se reemplaza por string.'),
 fill('Usa la interfaz con números', 'const c: Caja___ = { valor: 1 };', ['<number>'], 'Se indica el tipo entre < >.'),
 tf('Una interfaz puede tener más de un parámetro de tipo.', true, 'Por ejemplo Par<A, B>.'),
 mc('¿Por qué usar Caja<T> en lugar de any?', ['Mantiene el tipo seguro', 'Es más corto', 'Es obligatorio', 'Corre más rápido'], 0, 'any pierde la comprobación de tipos.'),
 pair('Genéricos', [['T', 'Parámetro de tipo'], ['Caja<number>', 'Tipo concreto'], ['<T>', 'Se declara tras el nombre']], 'Partes de un genérico.')] },
{ id: 'l3', title: 'Reto: utilidades', intro: 'TypeScript trae tipos listos: `Partial<T>` (todo opcional), `Readonly<T>` (solo lectura), `Pick<T, K>` (elige propiedades) y `Record<K, V>` (diccionario).', ex: [
 mc('¿Qué hace Partial<T>?', ['Vuelve opcionales las propiedades', 'Las borra', 'Las hace de solo lectura', 'Las convierte en texto'], 0, 'Todas pasan a ser opcionales.'),
 mc('¿Cuál impide modificar propiedades?', ['Readonly<T>', 'Partial<T>', 'Pick<T,K>', 'Record'], 0, 'Readonly las bloquea.'),
 fill('Diccionario de texto a número', 'const m: ___<string, number> = {};', ['Record'], 'Record<K, V> define un diccionario.'),
 tf('Pick<T, K> elige solo algunas propiedades de T.', true, 'Crea un tipo con esas claves.'),
 pair('Utilidades', [['Partial', 'Todo opcional'], ['Readonly', 'Solo lectura'], ['Record', 'Diccionario']], 'Tipos de utilidad.')] }
]});
})();
