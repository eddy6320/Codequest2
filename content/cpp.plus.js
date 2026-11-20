(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, pair } = CQ.h;
CQ.content.cpp.units.push({ id: 'u6', title: 'La STL', desc: 'vector, map y algoritmos', lessons: [
{ id: 'l1', title: 'std::vector', intro: '`vector` es un arreglo dinámico (`#include <vector>`).\n\n```\nstd::vector<int> v;\nv.push_back(4);\nstd::cout << v.size();\n```', ex: [
 mc('¿Qué método agrega al final?', ['push_back', 'add', 'append', 'insert_end'], 0, 'push_back agrega al final.'),
 fill('Pide el tamaño', 'v.___()', ['size'], 'size() da la cantidad.'),
 tf('Un vector puede crecer en tiempo de ejecución.', true, 'A diferencia de un arreglo fijo.'),
 mc('¿Qué encabezado necesitas?', ['<vector>', '<array.h>', '<list>', '<stdio>'], 0, '#include <vector>.'),
 pair('Métodos', [['push_back', 'Agrega'], ['size', 'Cuántos hay'], ['clear', 'Vacía']], 'Los básicos.')] },
{ id: 'l2', title: 'std::map', intro: '`map` guarda pares clave-valor ordenados por clave (`#include <map>`).\n\n```\nstd::map<std::string, int> m;\nm["ana"] = 20;\nm.count("ana");\n```', ex: [
 mc('¿Cómo se ordena un map?', ['Por clave', 'Por valor', 'Al azar', 'Por inserción'], 0, 'Siempre ordenado por clave.'),
 fill('Pregunta si existe la clave', 'm.___("ana")', ['count', 'find'], 'count devuelve 0 o 1.'),
 tf('Las claves de un map no se repiten.', true, 'Cada clave es única.'),
 mc('¿Cómo asignas un valor?', ['m["ana"] = 20;', 'm.add(ana, 20);', 'm->ana = 20;', 'm(ana) = 20;'], 0, 'Con corchetes.'),
 order('Crea y llena un map', ['std::map<std::string, int> m;', 'm["ana"] = 20;', 'm["luis"] = 18;'], 'Declarar y asignar.')] },
{ id: 'l3', title: 'Reto: sort y lambdas', intro: '`std::sort` ordena un rango (`#include <algorithm>`).\n\n```\nstd::sort(v.begin(), v.end());\nstd::sort(v.begin(), v.end(),\n    [](int a, int b) { return a > b; });\n```\nLa lambda define el criterio; aquí ordena de mayor a menor.', ex: [
 mc('¿Qué ordena std::sort por defecto?', ['De menor a mayor', 'De mayor a menor', 'Al azar', 'Alfabético inverso'], 0, 'Orden ascendente.'),
 fill('Ordena todo el vector', 'std::sort(v.___(), v.end());', ['begin'], 'begin() y end() delimitan el rango.'),
 mc('¿Qué hace la lambda [](int a, int b){ return a > b; }?', ['Ordena de mayor a menor', 'Ordena de menor a mayor', 'Invierte el vector', 'Cuenta elementos'], 0, 'Devuelve true si a va antes que b.'),
 tf('Una lambda es una función corta sin nombre.', true, 'Se escribe en el lugar donde se usa.'),
 pair('STL', [['sort', 'Ordena'], ['begin', 'Inicio del rango'], ['end', 'Fin del rango']], 'Piezas del rango.')] }
]});
})();
