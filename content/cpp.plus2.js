(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.cpp.units.push(
  // ───────────── UNIDAD 7 ─────────────
  { id: 'u7', title: 'Excepciones y tipos modernos', desc: 'Errores, optional, variant y enum class', lessons: [
    { id: 'l1', title: 'try, catch y throw', intro: L(
'Las **excepciones** separan el código normal del manejo de errores:',
'',
'```cpp',
'try {',
'    throw std::runtime_error("fallo");',
'} catch (const std::exception& e) {',
'    std::cout << e.what();',
'}',
'```',
'',
'Se captura por **referencia constante**. Al lanzar una excepción, C++ destruye los objetos locales (*stack unwinding*), por eso los destructores se ejecutan antes de entrar al `catch`. `vector::at` y `stoi` lanzan `out_of_range` e `invalid_argument`.'),
      ex: [
        out('¿Qué imprime?', 'try { throw 42; } catch (int e) { cout << e; }', '42', 'Se lanza un int y se captura el catch cuyo tipo coincide.'),
        out('¿Qué imprime?', L('try {', '    vector<int> v(2);', '    v.at(5);', '} catch (const out_of_range&) {', '    cout << "fuera";', '}'), 'fuera', 'at() comprueba el índice y lanza out_of_range; v[5] no lo haría.'),
        out('¿Qué imprime?', L('struct A { ~A() { cout << "adios "; } };', 'try {', '    A a;', '    throw runtime_error("x");', '} catch (const exception& e) {', '    cout << e.what();', '}'), 'adios x', 'Al salir del try por la excepción se destruye a antes de ejecutar el catch.'),
        mc('¿Cómo se captura normalmente una excepción estándar?', ['catch (const exception& e)', 'catch (exception e)', 'catch e', 'except exception'], 0, 'Por referencia constante evita copias y el "slicing" de clases derivadas.'),
        out('¿Qué imprime?', L('try {', '    stoi("abc");', '} catch (const invalid_argument&) {', '    cout << "invalido";', '}'), 'invalido', 'stoi lanza invalid_argument si el texto no es un número.'),
        fill('Muestra el mensaje de la excepción', 'catch (const std::exception& e) { cout << e.___(); }', 'what', 'what() devuelve el texto descriptivo del error.'),
        tf('Un destructor se ejecuta aunque la función termine por una excepción.', true, 'Es la base de RAII: los recursos se liberan durante el stack unwinding.'),
      ] },
    { id: 'l2', title: 'optional, variant y tuple', intro: L(
'* `std::optional<T>`: un valor que **puede no existir**. `has_value()`, `value()`, `value_or(x)`.',
'* `std::variant<A, B>`: guarda **uno** de varios tipos; `index()` dice cuál.',
'* `std::tuple` y `std::pair`: agrupan valores; con **bindings estructurados** los desempaquetas: `auto [a, b] = par;`',
'',
'```cpp',
'optional<int> o;          // vacío',
'o.value_or(9);            // 9',
'```'),
      ex: [
        out('¿Qué imprime?', L('optional<int> o;', 'cout << o.has_value();'), '0', 'Un optional sin valor devuelve false, que se imprime como 0.'),
        out('¿Qué imprime?', L('optional<int> a = 5, b;', 'cout << a.value_or(9) << " " << b.value_or(9);'), '5 9', 'value_or usa el valor si existe y, si no, la alternativa.'),
        out('¿Qué imprime?', L('auto [a, b] = make_pair(1, string("x"));', 'cout << a << b;'), '1x', 'El binding estructurado desempaqueta el par en a y b.'),
        out('¿Qué imprime?', L('variant<int, string> v = string("hola");', 'cout << v.index();'), '1', 'index() es la posición del tipo activo: string es el segundo (índice 1).'),
        out('¿Qué imprime?', L('tuple<int, string, double> t{1, "a", 2.5};', 'cout << get<2>(t);'), '2.5', 'get<2> accede al tercer elemento de la tupla.'),
        mc('¿Qué tipo usas si una función puede "no devolver nada"?', ['std::optional<T>', 'void*', 'int*', 'std::any'], 0, 'optional expresa la ausencia de valor sin punteros nulos ni valores mágicos.'),
        tf('std::variant guarda varios valores a la vez.', false, 'Guarda uno solo, del tipo que esté activo en ese momento.'),
      ] },
    { id: 'l3', title: 'Reto: enum class, string_view y lambdas', intro: L(
'* `enum class Color { Rojo, Verde };` tiene su propio ámbito (`Color::Verde`) y **no** se convierte sola a `int`.',
'* `std::string_view` es una **vista** de solo lectura de un texto: no copia nada.',
'* Una **lambda** es una función anónima: `[captura](parámetros) { cuerpo }`.',
'',
'```cpp',
'auto cuadrado = [](int x) { return x * x; };',
'```'),
      ex: [
        out('¿Qué imprime?', L('enum class Color { Rojo, Verde };', 'cout << static_cast<int>(Color::Verde);'), '1', 'Rojo vale 0 y Verde 1; hace falta static_cast para convertir.'),
        out('¿Qué imprime?', L('string_view sv = "hola mundo";', 'cout << sv.substr(0, 4);'), 'hola', 'substr sobre string_view no copia el texto; solo ajusta la vista.'),
        out('¿Qué imprime?', L('auto f = [](int x) { return x * x; };', 'cout << f(7);'), '49', 'La lambda eleva al cuadrado su argumento.'),
        mc('¿Qué ventaja tiene enum class frente a enum?', ['Tiene ámbito propio y no se convierte implícitamente a int', 'Ocupa menos memoria', 'Permite herencia', 'Es más rápido'], 0, 'Evita colisiones de nombres y errores por conversiones silenciosas.'),
        tf('string_view hace una copia del texto original.', false, 'Solo guarda un puntero y una longitud; el texto debe seguir existiendo.'),
        out('¿Qué imprime?', L('int main() {', '    int k = 10;', '    auto suma = [k](int x) { return x + k; };', '    k = 99;', '    cout << suma(1);', '}'), '11', 'La captura [k] copia k al crear la lambda (10); el cambio posterior no la afecta.'),
      ] },
  ]},

  // ───────────── UNIDAD 8 ─────────────
  { id: 'u8', title: 'Hilos y concurrencia', desc: 'thread, mutex, async y atomic', lessons: [
    { id: 'l1', title: 'std::thread y mutex', intro: L(
'`std::thread` ejecuta una función en otro hilo (`#include <thread>`). Debes llamar a **`join()`** (esperar) o `detach()` antes de destruirlo; si no, el programa termina.',
'',
'```cpp',
'int x = 0;',
'thread t([&] { x = 5; });',
't.join();',
'```',
'',
'Si varios hilos modifican el mismo dato hay una **condición de carrera**. Se evita con un `mutex` y `lock_guard` (bloquea al crearse y libera al salir del bloque, gracias a RAII) o con `std::atomic`.'),
      ex: [
        out('¿Qué imprime?', L('int x = 0;', 'thread t([&] { x = 5; });', 't.join();', 'cout << x;'), '5', 'join espera a que el hilo termine; después x ya vale 5.'),
        mc('¿Qué ocurre si se destruye un std::thread sin join() ni detach()?', ['El programa termina (std::terminate)', 'Se une solo', 'Se ignora', 'Se reinicia el hilo'], 0, 'C++ obliga a decidir qué hacer con el hilo antes de destruirlo.'),
        out('¿Qué imprime?', L('int c = 0;', 'mutex m;', 'auto f = [&] {', '    for (int i = 0; i < 1000; i++) {', '        lock_guard<mutex> g(m);', '        c++;', '    }', '};', 'thread a(f), b(f);', 'a.join(); b.join();', 'cout << c;'), '2000', 'El mutex hace que cada incremento sea exclusivo: 2 × 1000.'),
        fill('Protege la sección con el mutex m', 'lock_guard<mutex> g(___);', 'm', 'lock_guard recibe el mutex y lo bloquea hasta salir del bloque.'),
        out('¿Qué imprime?', L('atomic<int> n{0};', 'thread a([&] { for (int i = 0; i < 500; i++) n++; });', 'thread b([&] { for (int i = 0; i < 500; i++) n++; });', 'a.join(); b.join();', 'cout << n;'), '1000', 'Las operaciones sobre atomic son indivisibles: no se pierden incrementos.'),
        pair('Empareja el elemento con su función', [['thread', 'crea un hilo'], ['mutex', 'exclusión mutua'], ['lock_guard', 'bloqueo con RAII'], ['join', 'espera al hilo']], 'Son las piezas básicas de la concurrencia en C++.'),
        tf('join() hace que el hilo actual espere a que el otro termine.', true, 'Por eso se llama antes de usar los resultados del hilo.'),
      ] },
    { id: 'l2', title: 'async, future y promise', intro: L(
'`std::async` lanza una tarea y devuelve un **`future`**; con `get()` esperas el resultado (y si la tarea lanzó una excepción, se relanza ahí).',
'',
'```cpp',
'auto f = async(launch::async, [] { return 6 * 7; });',
'cout << f.get();   // 42',
'```',
'',
'Un `promise` es el otro extremo: un hilo llama a `set_value` y quien tiene el `future` lo recibe con `get()`. `launch::async` pide ejecutar en otro hilo.'),
      ex: [
        out('¿Qué imprime?', L('auto f = async(launch::async, [] { return 6 * 7; });', 'cout << f.get();'), '42', 'get() espera a que la tarea termine y devuelve su resultado.'),
        out('¿Qué imprime?', L('promise<int> p;', 'future<int> f = p.get_future();', 'thread t([&] { p.set_value(9); });', 'cout << f.get();', 't.join();'), '9', 'El hilo entrega el valor con set_value y el main lo recibe con get().'),
        mc('¿Qué hace future::get()?', ['Espera el resultado y lo devuelve', 'Cancela la tarea', 'Crea un hilo', 'Copia el future'], 0, 'Bloquea hasta que el valor esté listo.'),
        out('¿Qué imprime?', L('auto f = async(launch::async, []() -> int { throw runtime_error("boom"); });', 'try { f.get(); } catch (const exception& e) { cout << e.what(); }'), 'boom', 'La excepción de la tarea viaja dentro del future y se relanza en get().'),
        fill('Pide ejecutar la tarea en otro hilo', 'async(launch::___, tarea);', 'async', 'launch::async fuerza un hilo nuevo; launch::deferred la retrasa hasta get().'),
        out('¿Qué imprime?', L('vector<int> v(100, 1);', 'auto a = async(launch::async, [&] { return accumulate(v.begin(), v.begin() + 50, 0); });', 'int b = accumulate(v.begin() + 50, v.end(), 0);', 'cout << a.get() + b;'), '100', 'Cada mitad suma 50; el resultado se calcula en paralelo y se combina.'),
        tf('Una excepción lanzada dentro de una tarea async se pierde silenciosamente.', false, 'Se guarda en el future y se relanza cuando llamas a get().'),
      ] },
    { id: 'l3', title: 'Reto: call_once, thread_local y atomic', intro: L(
'* `call_once(flag, f)` ejecuta `f` **una sola vez** aunque lo llamen muchos hilos.',
'* `thread_local` da a cada hilo **su propia copia** de una variable.',
'* Una **condición de carrera** (*data race*) ocurre cuando dos hilos acceden al mismo dato y al menos uno **escribe**, sin sincronización: es comportamiento indefinido.',
'',
'Dos hilos que solo **leen** el mismo dato no tienen problema.'),
      ex: [
        out('¿Qué imprime?', L('once_flag fl;', 'for (int i = 0; i < 3; i++)', '    call_once(fl, [] { cout << "init "; });', 'cout << "fin";'), 'init fin', 'Aunque se llame 3 veces, la inicialización ocurre una sola vez.'),
        out('¿Qué imprime?', L('thread_local int n = 0;', 'n = 5;', 'thread t([] { cout << n; });', 't.join();', 'cout << n;'), '05', 'El hilo nuevo ve su propia copia de n (0); el principal conserva el 5.'),
        mc('¿Qué es una condición de carrera (data race)?', ['Dos hilos acceden al mismo dato y al menos uno escribe sin sincronizar', 'Un hilo que corre muy rápido', 'Un hilo que no termina', 'Usar demasiados hilos'], 0, 'El resultado depende del orden en que se ejecuten y el estándar lo declara indefinido.'),
        tf('Dos hilos que solo leen la misma variable producen una condición de carrera.', false, 'Sin escrituras no hay carrera: leer a la vez es seguro.'),
        out('¿Qué imprime?', L('mutex m;', '{', '    lock_guard<mutex> g(m);', '    cout << "dentro ";', '}', 'cout << m.try_lock();'), 'dentro 1', 'Al salir del bloque el mutex se libera, así que try_lock lo consigue y devuelve true (1).'),
        fill('Declara un contador seguro entre hilos', 'std::___<int> contador{0};', 'atomic', 'std::atomic hace atómicas las operaciones sobre el valor.'),
      ] },
  ]},

  // ───────────── UNIDAD 9 ─────────────
  { id: 'u9', title: 'Más contenedores y algoritmos', desc: 'array, deque, heaps, unordered_map y <numeric>', lessons: [
    { id: 'l1', title: 'array, deque y priority_queue', intro: L(
'* `std::array<T, N>`: arreglo de **tamaño fijo** con interfaz de contenedor (`size()`, `at()`).',
'* `std::deque<T>`: inserta y elimina eficientemente por **ambos extremos** (`push_front`, `push_back`).',
'* `std::priority_queue<T>`: siempre te da el **mayor** con `top()` (un *max-heap*). Para el menor: `priority_queue<int, vector<int>, greater<int>>`.',
'',
'`stack` y `queue` completan los adaptadores clásicos.'),
      ex: [
        out('¿Qué imprime?', L('array<int, 3> a{1, 2, 3};', 'cout << a.size() << a[2];'), '33', 'Tiene 3 elementos y a[2] es el último: 3.'),
        out('¿Qué imprime?', L('deque<int> d;', 'd.push_back(1);', 'd.push_front(0);', 'cout << d.front() << d.back();'), '01', 'push_front pone el 0 al inicio; el 1 queda al final.'),
        out('¿Qué imprime?', L('priority_queue<int> pq;', 'pq.push(3); pq.push(9); pq.push(5);', 'cout << pq.top();'), '9', 'Por defecto es un max-heap: top() devuelve el mayor.'),
        out('¿Qué imprime?', L('priority_queue<int, vector<int>, greater<int>> pq;', 'pq.push(3); pq.push(9); pq.push(1);', 'cout << pq.top();'), '1', 'Con greater<int> se convierte en un min-heap.'),
        mc('¿Qué contenedor inserta eficientemente en ambos extremos?', ['deque', 'vector', 'array', 'stack'], 0, 'deque permite push_front y push_back en tiempo constante.'),
        tf('Por defecto, priority_queue devuelve primero el elemento mayor.', true, 'Es un max-heap salvo que le pases otro comparador.'),
        pair('Empareja el contenedor con su rasgo', [['array', 'tamaño fijo'], ['deque', 'ambos extremos'], ['priority_queue', 'acceso al mayor'], ['stack', 'LIFO']], 'Elige el contenedor según las operaciones que más usarás.'),
      ] },
    { id: 'l2', title: 'unordered_map, set y multiset', intro: L(
'* `unordered_map<K, V>`: tabla hash, búsqueda promedio O(1), **sin orden** de iteración.',
'* `m[clave]` **crea** la entrada si no existía (con valor por defecto); `count(clave)` y `find(clave)` no la crean.',
'* `set<T>`: elementos únicos **ordenados**. `multiset<T>`: ordenados pero permite repetidos.',
'',
'```cpp',
'unordered_map<string,int> m;',
'm["a"]++;   // crea "a" con 0 y lo incrementa',
'```'),
      ex: [
        out('¿Qué imprime?', L('unordered_map<string, int> m;', 'm["a"]++;', 'm["a"]++;', 'cout << m["a"];'), '2', 'La primera vez crea la clave con 0; luego se incrementa dos veces.'),
        out('¿Qué imprime?', L('unordered_map<int, int> m{{1, 2}};', 'cout << m.count(1) << m.count(9);'), '10', 'count devuelve 1 si existe la clave y 0 si no.'),
        out('¿Qué imprime?', L('set<int> s{3, 1, 3, 2};', 'for (int x : s) cout << x;'), '123', 'set elimina repetidos y mantiene el orden ascendente.'),
        out('¿Qué imprime?', L('multiset<int> s{1, 1, 2};', 'cout << s.count(1);'), '2', 'multiset conserva los repetidos.'),
        mc('¿Qué orden de iteración garantiza unordered_map?', ['Ninguno', 'Orden de inserción', 'Orden alfabético', 'Orden inverso'], 0, 'Depende de la tabla hash; si necesitas orden usa map.'),
        fill('Busca la clave "a" sin crearla', 'auto it = m.___("a");', 'find', 'find devuelve un iterador (m.end() si no existe), sin insertar nada.'),
        tf('m[clave] inserta la clave si todavía no existe.', true, 'Por eso, para solo consultar, conviene usar count o find.'),
      ] },
    { id: 'l3', title: 'Reto: <numeric> y <algorithm>', intro: L(
'Los algoritmos trabajan con **rangos de iteradores** `[inicio, fin)`:',
'',
'```cpp',
'iota(v.begin(), v.end(), 1);              // 1,2,3...',
'accumulate(v.begin(), v.end(), 0);        // suma',
'count_if(v.begin(), v.end(), pred);',
'transform(v.begin(), v.end(), v.begin(), f);',
'find(v.begin(), v.end(), 3);              // iterador',
'```',
'',
'`binary_search` exige un rango **ordenado**. `unique` solo quita duplicados **consecutivos**.'),
      ex: [
        out('¿Qué imprime?', L('vector<int> v(5);', 'iota(v.begin(), v.end(), 1);', 'cout << accumulate(v.begin(), v.end(), 0);'), '15', 'iota llena con 1..5 y accumulate suma: 15.'),
        out('¿Qué imprime?', L('vector<int> v{1, 2, 3, 4, 5, 6};', 'cout << count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });'), '3', 'Son pares 2, 4 y 6.'),
        out('¿Qué imprime?', L('vector<int> v{1, 2, 3};', 'transform(v.begin(), v.end(), v.begin(), [](int x) { return x * x; });', 'for (int x : v) cout << x << " ";'), '1 4 9', 'transform escribe el cuadrado de cada elemento sobre sí mismo.'),
        mc('¿Qué hace std::unique?', ['Mueve los duplicados consecutivos al final y devuelve el nuevo fin', 'Ordena el vector', 'Borra todos los repetidos del vector', 'Cuenta elementos únicos'], 0, 'Suele usarse tras sort, junto con erase.'),
        out('¿Qué imprime?', L('vector<int> v{3, 1, 2};', 'sort(v.begin(), v.end(), greater<int>());', 'cout << v[0];'), '3', 'Con greater<int> se ordena de mayor a menor: 3, 2, 1.'),
        out('¿Qué imprime?', L('vector<int> v{1, 2, 3, 4};', 'auto it = find(v.begin(), v.end(), 3);', 'cout << distance(v.begin(), it);'), '2', 'El 3 está en la posición (índice) 2.'),
        tf('binary_search requiere que el rango esté ordenado.', true, 'Si no lo está, el resultado no es fiable.'),
      ] },
  ]}
);
})();
