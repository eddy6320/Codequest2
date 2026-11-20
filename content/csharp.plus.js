(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, pair } = CQ.h;
CQ.content.csharp.units.push({ id: 'u6', title: 'Colecciones y LINQ', desc: 'List, Dictionary y consultas', lessons: [
{ id: 'l1', title: 'List<T>', intro: '`List<T>` es una lista que crece.\n\n```\nvar xs = new List<int>();\nxs.Add(3);\nConsole.WriteLine(xs.Count);\n```\n\n`Count` da la cantidad de elementos y `Add` agrega uno.', ex: [
 mc('¿Qué propiedad da el número de elementos?', ['Count', 'Length', 'Size', 'Total'], 0, 'En List se usa Count (Length es de arreglos).'),
 fill('Agrega el 5', 'var xs = new List<int>();\nxs.___(5);', ['Add'], 'Add agrega al final.'),
 tf('Una List<T> puede crecer después de crearse.', true, 'A diferencia de un arreglo fijo.'),
 mc('¿Qué tipo guarda List<string>?', ['Textos', 'Enteros', 'Booleanos', 'Cualquier cosa'], 0, 'T es string.'),
 pair('Métodos', [['Add', 'Agrega'], ['Remove', 'Quita'], ['Count', 'Cuántos hay']], 'Los básicos de List.')] },
{ id: 'l2', title: 'Dictionary', intro: 'Un `Dictionary<K, V>` guarda pares clave-valor.\n\n```\nvar d = new Dictionary<string, int>();\nd["ana"] = 20;\nbool ok = d.ContainsKey("ana");\n```', ex: [
 mc('¿Qué guarda un Dictionary?', ['Pares clave-valor', 'Solo números', 'Solo textos', 'Una cola'], 0, 'Cada clave apunta a un valor.'),
 fill('Pregunta si existe la clave', 'd.___("ana")', ['ContainsKey'], 'ContainsKey devuelve true o false.'),
 tf('Las claves de un Dictionary no se pueden repetir.', true, 'Cada clave es única.'),
 mc('¿Cómo accedes al valor de "ana"?', ['d["ana"]', 'd.ana()', 'd(ana)', 'd->ana'], 0, 'Con corchetes y la clave.'),
 order('Crea y llena un diccionario', ['var d = new Dictionary<string, int>();', 'd["ana"] = 20;', 'd["luis"] = 18;'], 'Crear y luego asignar.')] },
{ id: 'l3', title: 'Reto: LINQ', intro: '**LINQ** consulta colecciones (`using System.Linq;`).\n\n```\nvar r = xs.Where(x => x > 2)\n          .Select(x => x * 2)\n          .ToList();\n```\n`Where` filtra, `Select` transforma y `ToList` devuelve una lista.', ex: [
 mc('¿Qué hace Where?', ['Filtra elementos', 'Transforma elementos', 'Ordena', 'Cuenta'], 0, 'Deja los que cumplen la condición.'),
 mc('¿Qué hace Select?', ['Transforma cada elemento', 'Filtra', 'Borra', 'Agrupa'], 0, 'Aplica una función a cada uno.'),
 fill('Convierte el resultado en lista', 'var r = xs.Where(x => x > 2).___();', ['ToList'], 'ToList materializa la consulta.'),
 tf('x => x * 2 es una expresión lambda.', true, 'Una función corta sin nombre.'),
 pair('LINQ', [['Where', 'Filtrar'], ['Select', 'Transformar'], ['Count', 'Contar']], 'Operaciones comunes.')] }
]});
})();
