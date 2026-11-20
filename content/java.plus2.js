(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.java.units.push(
  // ───────────── UNIDAD 11 ─────────────
  { id: 'u11', title: 'Java moderno', desc: 'records, enums, switch expressions y sealed', lessons: [
    { id: 'l1', title: 'Records', intro: L(
'Un **record** es una clase **inmutable** para guardar datos, en una sola línea:',
'',
'```java',
'record Punto(int x, int y) {}',
'var p = new Punto(1, 2);',
'p.x();        // accesor (sin "get")',
'System.out.println(p);   // Punto[x=1, y=2]',
'```',
'',
'Java genera por ti el constructor, los accesores, `equals`, `hashCode` y `toString`. Un **constructor compacto** valida los datos:',
'',
'```java',
'record Edad(int v) { Edad { if (v < 0) throw new IllegalArgumentException("negativa"); } }',
'```'),
      ex: [
        out('¿Qué imprime?', L('record Punto(int x, int y) {}', 'Punto p = new Punto(1, 2);', 'System.out.println(p);'), 'Punto[x=1, y=2]', 'El toString generado muestra el nombre del record y sus componentes.'),
        out('¿Qué imprime?', L('record Punto(int x, int y) {}', 'var p = new Punto(3, 4);', 'System.out.println(p.x() + p.y());'), '7', 'Los accesores se llaman igual que el componente: x() e y().'),
        out('¿Qué imprime?', L('record Punto(int x, int y) {}', 'System.out.println(new Punto(1, 2).equals(new Punto(1, 2)));'), 'true', 'Un record compara por valor, no por referencia.'),
        mc('¿Qué genera automáticamente un record?', ['Constructor, accesores, equals, hashCode y toString', 'Solo el constructor', 'Setters para cada campo', 'Solo toString'], 0, 'Por eso reemplaza a mucho código repetitivo en clases de datos.'),
        tf('Los campos de un record se pueden modificar con setters.', false, 'Un record es inmutable: sus componentes son finales y no hay setters.'),
        out('¿Qué imprime?', L('record Edad(int v) {', '    Edad {', '        if (v < 0) throw new IllegalArgumentException("negativa");', '    }', '}', 'try { new Edad(-1); }', 'catch (IllegalArgumentException e) { System.out.println(e.getMessage()); }'), 'negativa', 'El constructor compacto valida antes de asignar los campos.'),
        fill('Declara un record llamado Persona', '___ Persona(String nombre, int edad) {}', 'record', 'La palabra clave record sustituye a class.'),
      ] },
    { id: 'l2', title: 'enum, switch expressions y text blocks', intro: L(
'* Un `enum` es un conjunto fijo de constantes; puede tener campos y constructor. `ordinal()` da su posición y `values()` lista todas.',
'* **switch expression**: devuelve un valor y usa `->` (sin `break`):',
'',
'```java',
'String s = switch (n) {',
'    case 1, 2 -> "bajo";',
'    case 3 -> "medio";',
'    default -> "alto";',
'};',
'```',
'',
'* **Text block**: texto de varias líneas entre `"""`; Java quita la sangría común.'),
      ex: [
        out('¿Qué imprime?', L('enum Dia { LUN, MAR }', 'System.out.println(Dia.MAR.ordinal());'), '1', 'ordinal es la posición empezando en 0: LUN=0, MAR=1.'),
        out('¿Qué imprime?', L('int n = 3;', 'String s = switch (n) {', '    case 1, 2 -> "bajo";', '    case 3 -> "medio";', '    default -> "alto";', '};', 'System.out.println(s);'), 'medio', 'La rama case 3 produce el valor "medio".'),
        out('¿Qué imprime?', L('String t = """', '    Hola', '      Mundo', '    """;', 'System.out.print(t);'), ['Hola\nMundo', 'Hola\n  Mundo'], 'Java elimina la sangría común; la línea de Mundo conserva 2 espacios extra.'),
        out('¿Qué imprime?', L('enum Color { ROJO, VERDE }', 'for (Color c : Color.values())', '    System.out.print(c + " ");'), 'ROJO VERDE', 'values() devuelve todas las constantes en orden de declaración.'),
        mc('En un switch con flechas (->), ¿hace falta break?', ['No, no hay "caída" entre casos', 'Sí, siempre', 'Solo en el default', 'Solo con enums'], 0, 'Con -> se ejecuta únicamente la rama elegida.'),
        tf('Una switch expression debe cubrir todos los casos posibles.', true, 'Al devolver un valor, el compilador exige exhaustividad (por eso suele llevar default).'),
        out('¿Qué imprime?', L('enum Planeta {', '    TIERRA(9.8), MARTE(3.7);', '    final double g;', '    Planeta(double g) { this.g = g; }', '}', 'System.out.println(Planeta.MARTE.g);'), '3.7', 'Cada constante del enum se construye con su propio valor de g.'),
      ] },
    { id: 'l3', title: 'Reto: sealed y pattern matching', intro: L(
'* `x instanceof String s` comprueba el tipo **y** crea la variable `s` ya convertida.',
'* Una **interfaz sealed** limita quién puede implementarla (`permits`); así un `switch` puede ser exhaustivo sin `default`.',
'* Los **patrones de record** desarman un record: `if (o instanceof P(int a, int b))`.',
'* `var` deja que el compilador deduzca el tipo (sigue siendo tipado estáticamente).'),
      ex: [
        out('¿Qué imprime?', L('Object o = "hola";', 'if (o instanceof String s && s.length() > 3)', '    System.out.println(s.toUpperCase());'), 'HOLA', 'El patrón crea s como String sin necesidad de casting.'),
        out('¿Qué imprime?', L('sealed interface Forma permits Circulo, Cuadrado {}', 'record Circulo(double r) implements Forma {}', 'record Cuadrado(double l) implements Forma {}', 'Forma f = new Cuadrado(3);', 'double a = switch (f) {', '    case Circulo c -> 3 * c.r() * c.r();', '    case Cuadrado q -> q.l() * q.l();', '};', 'System.out.println(a);'), '9.0', 'El switch cubre todas las subclases permitidas; el cuadrado de lado 3 vale 9.0.'),
        mc('¿Qué garantiza una interfaz sealed?', ['Que solo las clases listadas en permits pueden implementarla', 'Que no tiene métodos', 'Que es inmutable', 'Que es privada'], 0, 'Esto permite al compilador comprobar que un switch trata todos los casos.'),
        out('¿Qué imprime?', L('var lista = new ArrayList<String>();', 'lista.add("x");', 'System.out.println(lista.getClass().getSimpleName());'), 'ArrayList', 'var infiere ArrayList<String>; getSimpleName devuelve el nombre de la clase.'),
        tf('var permite que una variable cambie de tipo después de asignarla.', false, 'El tipo se deduce una sola vez, en la declaración; Java sigue siendo estático.'),
        out('¿Qué imprime?', L('record P(int x, int y) {}', 'Object o = new P(1, 2);', 'if (o instanceof P(int a, int b))', '    System.out.println(a + b);'), '3', 'El patrón de record extrae x e y directamente en a y b.'),
      ] },
  ]},

  // ───────────── UNIDAD 12 ─────────────
  { id: 'u12', title: 'Texto y expresiones regulares', desc: 'String, StringBuilder y regex', lessons: [
    { id: 'l1', title: 'Métodos de String', intro: L(
'`String` es **inmutable**: cada método devuelve un String nuevo.',
'',
'* `strip()` quita espacios · `repeat(n)` repite · `isBlank()` ¿vacío o solo espacios?',
'* `split(",")` parte en un arreglo (los campos vacíos intermedios se conservan).',
'* `String.format("%05.1f|%-4s|%3d", ...)` da formato.',
'* Compara contenido con **`equals`**; `==` compara referencias.'),
      ex: [
        out('¿Qué imprime?', 'System.out.println("  hola ".strip().length());', '4', 'strip elimina los espacios de los extremos: queda "hola".'),
        out('¿Qué imprime?', 'System.out.println("ab".repeat(3));', 'ababab', 'repeat(3) concatena el texto tres veces.'),
        out('¿Qué imprime?', 'System.out.println("".isBlank() + " " + "  ".isBlank());', 'true true', 'isBlank es true para vacío o solo espacios en blanco.'),
        out('¿Qué imprime?', 'System.out.println(String.format("%05.1f|%-4s|%3d", 3.14159, "ab", 7));', '003.1|ab  |  7', '%05.1f: ancho 5 con ceros; %-4s alinea a la izquierda; %3d alinea a la derecha.'),
        out('¿Qué imprime?', 'System.out.println("a,b,,c".split(",").length);', '4', 'Se obtienen "a", "b", "" y "c": el campo vacío del medio se conserva.'),
        mc('¿Cómo se compara el contenido de dos String?', ['a.equals(b)', 'a == b', 'a = b', 'a.same(b)'], 0, '== solo dice si son el mismo objeto; equals compara los caracteres.'),
        tf('Los objetos String son inmutables.', true, 'Métodos como toUpperCase devuelven un String nuevo y no cambian el original.'),
      ] },
    { id: 'l2', title: 'StringBuilder y regex', intro: L(
'`StringBuilder` modifica texto **sin crear objetos nuevos**: ideal para armar cadenas dentro de bucles (`append`, `insert`, `reverse`, `deleteCharAt`).',
'',
'Para **expresiones regulares**:',
'',
'```java',
'Pattern p = Pattern.compile("\\\\d+");',
'Matcher m = p.matcher("a12b345");',
'while (m.find()) System.out.println(m.group());',
'"2024-05-17".matches("\\\\d{4}-\\\\d{2}-\\\\d{2}");',
'```',
'',
'En el código Java hay que escribir la barra invertida **dos veces** (`"\\\\d"`).'),
      ex: [
        out('¿Qué imprime?', L('StringBuilder sb = new StringBuilder("abc");', 'sb.reverse().append("!");', 'System.out.println(sb);'), 'cba!', 'reverse invierte en su sitio y append añade el signo al final.'),
        out('¿Qué imprime?', L('StringBuilder sb = new StringBuilder("bc");', 'sb.insert(0, "a");', 'sb.deleteCharAt(1);', 'System.out.println(sb);'), 'ac', '"abc" sin el carácter de la posición 1 queda "ac".'),
        out('¿Qué imprime?', L('Matcher m = Pattern.compile("\\\\d+").matcher("a12b345");', 'while (m.find()) System.out.println(m.group());'), '12\n345', 'find() avanza por cada coincidencia y group() devuelve el texto encontrado.'),
        out('¿Qué imprime?', 'System.out.println("2024-05-17".matches("\\\\d{4}-\\\\d{2}-\\\\d{2}"));', 'true', 'matches exige que toda la cadena cumpla el patrón.'),
        out('¿Qué imprime?', 'System.out.println("a1b2".replaceAll("[0-9]", "#"));', 'a#b#', 'Cada dígito se sustituye por #.'),
        mc('¿Cuándo conviene StringBuilder?', ['Al concatenar muchas veces en un bucle', 'Al comparar textos', 'Al leer archivos', 'Nunca'], 0, 'Con String cada + crea un objeto nuevo; StringBuilder reutiliza el mismo buffer.'),
        fill('Compila el patrón', 'Pattern p = Pattern.___("a+");', 'compile', 'Pattern.compile convierte el texto del patrón en un objeto reutilizable.'),
      ] },
    { id: 'l3', title: 'Reto: procesar texto con streams', intro: L(
'`String.chars()` devuelve un **`IntStream`** (códigos de carácter, no `Character`). Combínalo con `filter`, `count` y `sum`.',
'',
'`String.join("-", lista)` une elementos. Con `Collectors.groupingBy` agrupas y con `counting()` cuentas: un `TreeMap` mantiene las claves ordenadas.',
'',
'`a.compareTo(b)` devuelve un entero **negativo, cero o positivo** (no solo -1, 0 o 1).'),
      ex: [
        out('¿Qué imprime?', 'System.out.println("hola mundo java".chars().filter(c -> c == \'a\').count());', '3', 'Hay una a en "hola" y dos en "java".'),
        out('¿Qué imprime?', 'System.out.println(String.join("-", List.of("a", "b", "c")));', 'a-b-c', 'join intercala el separador entre los elementos.'),
        out('¿Qué imprime?', 'System.out.println("Hola".chars().sum());', '388', 'H=72, o=111, l=108, a=97: la suma es 388.'),
        out('¿Qué imprime?', L('Map<String, Long> m = Arrays.stream("a b a c a".split(" "))', '    .collect(Collectors.groupingBy(w -> w, TreeMap::new, Collectors.counting()));', 'System.out.println(m);'), '{a=3, b=1, c=1}', 'Se agrupan las palabras iguales y se cuenta cuántas hay de cada una.'),
        mc('¿Qué devuelve a.compareTo(b) en String?', ['Un entero negativo, cero o positivo', 'true o false', 'Solo -1, 0 o 1', 'El índice de la diferencia'], 0, 'Solo importa el signo; no se debe comparar con -1 ni con 1.'),
        tf('String.chars() devuelve un Stream<Character>.', false, 'Devuelve un IntStream con los códigos de cada carácter.'),
      ] },
  ]}
);
})();
