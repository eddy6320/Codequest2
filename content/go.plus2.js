(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.go.units.push(
  // ───────────── UNIDAD 7 ─────────────
  { id: 'u7', title: 'Genéricos, pruebas y JSON', desc: 'Go en proyectos reales', lessons: [
    { id: 'l1', title: 'Genéricos', intro: L(
'Desde Go 1.18 puedes escribir funciones y tipos **genéricos** con parámetros de tipo entre corchetes:',
'',
'```go',
'func Max[T int | float64](a, b T) T {',
'    if a > b { return a }',
'    return b',
'}',
'type Pila[T any] struct{ items []T }',
'```',
'',
'* `any` acepta cualquier tipo (es un alias de `interface{}`).',
'* `comparable` permite usar `==` y `!=`.',
'* Una **restricción** como `int | float64` limita los tipos permitidos.'),
      ex: [
        out('¿Qué imprime?', L('func Max[T int | float64](a, b T) T {', '    if a > b {', '        return a', '    }', '    return b', '}', 'fmt.Println(Max(3, 7), Max(2.5, 1.5))'), '7 2.5', 'Go deduce T: int en la primera llamada y float64 en la segunda.'),
        mc('¿Qué restricción permite usar == con valores de tipo T?', ['comparable', 'any', 'ordered', 'equal'], 0, 'comparable agrupa los tipos que se pueden comparar con == y !=.'),
        out('¿Qué imprime?', L('func Map[T, U any](xs []T, f func(T) U) []U {', '    out := make([]U, 0, len(xs))', '    for _, x := range xs {', '        out = append(out, f(x))', '    }', '    return out', '}', 'fmt.Println(Map([]int{1, 2, 3}, func(x int) string { return strings.Repeat("a", x) }))'), '[a aa aaa]', 'Cada número se transforma en una cadena con esa cantidad de "a".'),
        tf('any es otro nombre para interface{}.', true, 'Desde Go 1.18 any es un alias predeclarado de interface{}.'),
        fill('Restringe T a enteros o decimales', 'func Suma[T ___ | float64](a, b T) T { return a + b }', 'int', 'La unión int | float64 permite el operador + en ambos casos.'),
        out('¿Qué imprime?', L('type Pila[T any] struct{ items []T }', 'func (p *Pila[T]) Push(x T) { p.items = append(p.items, x) }', 'func (p *Pila[T]) Len() int { return len(p.items) }', 'p := &Pila[string]{}', 'p.Push("a")', 'p.Push("b")', 'fmt.Println(p.Len())'), '2', 'Se agregaron dos elementos a la pila.'),
      ] },
    { id: 'l2', title: 'Pruebas con testing', intro: L(
'Go incluye pruebas en la biblioteca estándar. Reglas:',
'',
'* El archivo termina en `_test.go` (por ejemplo `calc_test.go`).',
'* Cada prueba es `func TestNombre(t *testing.T)`.',
'* Se ejecutan con `go test` (`go test ./...` para todo el proyecto, `-cover` para cobertura).',
'',
'`t.Errorf` marca fallo y **continúa**; `t.Fatalf` marca fallo y **detiene** esa prueba. Lo habitual son las pruebas **por tabla**: una lista de casos recorrida con `for` y `t.Run` para cada subprueba.'),
      ex: [
        mc('¿Cómo debe llamarse un archivo de pruebas de calc.go?', ['calc_test.go', 'test_calc.go', 'calc.test.go', 'calc_spec.go'], 0, 'Solo los archivos que terminan en _test.go los compila go test.'),
        mc('¿Cuál es la firma de una función de prueba?', ['func TestSuma(t *testing.T)', 'func suma_test()', 'func Test(t T)', 'func TestSuma() bool'], 0, 'Debe empezar por Test con mayúscula y recibir *testing.T.'),
        tf('t.Errorf marca la prueba como fallida pero la deja continuar.', true, 'Para detenerla en el acto se usa t.Fatalf.'),
        fill('Ejecuta todas las pruebas del proyecto', 'go ___ ./...', 'test', 'go test ./... recorre todos los paquetes.'),
        pair('Empareja la herramienta con su función', [['t.Errorf', 'falla y continúa'], ['t.Fatalf', 'falla y detiene la prueba'], ['t.Run', 'crea una subprueba'], ['go test -cover', 'mide la cobertura']], 'Son las piezas del paquete testing que más se usan.'),
        out('¿Cuántos fallos cuenta?', L('casos := []struct{ a, b, want int }{{1, 2, 3}, {2, 2, 5}}', 'fallos := 0', 'for _, c := range casos {', '    if c.a+c.b != c.want {', '        fallos++', '    }', '}', 'fmt.Println(fallos)'), '1', 'Solo el segundo caso falla: 2 + 2 no es 5.'),
      ] },
    { id: 'l3', title: 'Reto: encoding/json', intro: L(
'El paquete `encoding/json` convierte entre structs y JSON:',
'',
'```go',
'type P struct {',
'    Nombre string `json:"nombre"`',
'    Edad   int    `json:"edad"`',
'}',
'b, _ := json.Marshal(P{"Ana", 20})      // struct → JSON',
'json.Unmarshal(b, &p)                   // JSON → struct (necesita puntero)',
'```',
'',
'Solo se codifican los campos **exportados** (empiezan con mayúscula). Las etiquetas `json:"..."` eligen el nombre de cada clave. Los mapas se codifican con las claves ordenadas.'),
      ex: [
        out('¿Qué imprime?', L('b, _ := json.Marshal(map[string]int{"b": 2, "a": 1})', 'fmt.Println(string(b))'), '{"a":1,"b":2}', 'Marshal ordena las claves de un mapa alfabéticamente.'),
        out('¿Qué imprime?', L('type P struct {', '    Nombre string `json:"nombre"`', '    Edad   int    `json:"edad"`', '}', 'b, _ := json.Marshal(P{"Ana", 20})', 'fmt.Println(string(b))'), '{"nombre":"Ana","edad":20}', 'Las etiquetas definen los nombres de las claves en el JSON.'),
        out('¿Qué imprime?', L('var p struct {', '    N int `json:"n"`', '}', 'json.Unmarshal([]byte(`{"n": 7}`), &p)', 'fmt.Println(p.N)'), '7', 'Unmarshal rellena el struct a partir del JSON.'),
        mc('¿Qué campos de un struct se codifican con json.Marshal?', ['Solo los exportados (mayúscula inicial)', 'Todos', 'Solo los de tipo string', 'Solo los privados'], 0, 'Los campos en minúscula no son visibles para el paquete json.'),
        tf('json.Marshal necesita que le pases un puntero.', false, 'Quien necesita puntero es Unmarshal, porque debe modificar el destino.'),
        fill('Decodifica el JSON en la variable x', 'err := json.___(datos, &x)', 'Unmarshal', 'Unmarshal(datos, &destino) devuelve un error si el JSON no es válido.'),
      ] },
  ]}
);
})();
