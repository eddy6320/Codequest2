(window.CQ = window.CQ || { content: {}, roadmap: [] });
{
const { mc, tf, fill, order, out, pair, run } = CQ.h;

const ALU = `-- alumnos
-- id | nombre | edad | ciudad  | curso_id
-- 1  | Ana    | 20   | Madrid  | 1
-- 2  | Luis   | 22   | Sevilla | 2
-- 3  | Marta  | 19   | Madrid  | 1
-- 4  | Pedro  | 25   | Bilbao  | 3
-- 5  | Sara   | 22   | Sevilla | NULL`;
const CUR = `-- cursos
-- id | titulo | horas
-- 1  | SQL    | 30
-- 2  | Python | 40
-- 3  | HTML   | 20
-- 4  | Java   | 50`;

CQ.content.sql = {
  id: 'sql', name: 'SQL', emoji: '🗄️', color: '#0d8a72',
  tagline: 'Habla con las bases de datos',
  runner: null,
  units: [
    { id: 'u1', title: 'SELECT y FROM', desc: 'Pide datos a una tabla', lessons: [
      { id: 'l1', title: 'Tu primera consulta', intro:
`Una base de datos guarda la información en **tablas**: filas (registros) y columnas (campos). Con SQL les haces preguntas.

\`\`\`
SELECT nombre, edad
FROM alumnos;
\`\`\`

\`SELECT\` indica **qué columnas** quieres y \`FROM\` **de qué tabla**. El asterisco \`*\` significa "todas las columnas". La sentencia termina con \`;\`.

Usaremos las tablas \`alumnos\` y \`cursos\`, que verás descritas en las preguntas.`, ex: [
        mc('¿Qué hace esta consulta?', ['Muestra la columna nombre de todos los alumnos', 'Borra la tabla alumnos', 'Muestra solo el primer alumno', 'Crea una columna nombre'], 0, 'SELECT elige columnas y FROM la tabla; devuelve todos los nombres.', 'SELECT nombre FROM alumnos;'),
        fill('Completa para obtener todas las columnas de alumnos.', 'SELECT ___ FROM alumnos;', '*', 'El asterisco representa todas las columnas.'),
        fill('Indica la tabla de la que se leen los datos.', 'SELECT titulo ___ cursos;', ['FROM', 'from'], 'FROM va seguido del nombre de la tabla.'),
        order('Ordena las fichas para ver nombre y ciudad de alumnos.', ['SELECT', 'nombre, ciudad', 'FROM', 'alumnos;'], 'Primero SELECT con las columnas, luego FROM con la tabla.'),
        tf('En SQL, escribir "select" en minúsculas funciona igual que "SELECT".', true, 'Las palabras clave de SQL no distinguen mayúsculas de minúsculas; por convención se escriben en mayúsculas.'),
        pair('Empareja cada elemento con su función.', [['SELECT', 'Elige las columnas'], ['FROM', 'Indica la tabla'], ['*', 'Todas las columnas'], [';', 'Termina la sentencia']], 'Cada parte de la consulta tiene un papel concreto.'),
      ]},
      { id: 'l2', title: 'Alias y DISTINCT', intro:
`Puedes renombrar una columna en el resultado con \`AS\`:

\`\`\`
SELECT nombre AS alumno FROM alumnos;
\`\`\`

Y eliminar repetidos con \`DISTINCT\`:

\`\`\`
SELECT DISTINCT ciudad FROM alumnos;
\`\`\`

El alias solo cambia el nombre en el resultado, no en la tabla. También puedes hacer cálculos: \`SELECT horas * 60 AS minutos FROM cursos;\``, ex: [
        fill('Da el alias "alumno" a la columna nombre.', 'SELECT nombre ___ alumno FROM alumnos;', ['AS', 'as'], 'AS pone un alias a la columna en el resultado.'),
        mc('¿Para qué sirve DISTINCT?', ['Para ordenar el resultado', 'Para quitar filas repetidas', 'Para contar filas', 'Para borrar duplicados de la tabla'], 1, 'DISTINCT devuelve cada valor distinto una sola vez, sin modificar la tabla.'),
        fill('Obtén cada ciudad una sola vez.', 'SELECT ___ ciudad FROM alumnos;', ['DISTINCT', 'distinct'], 'DISTINCT va justo después de SELECT.'),
        order('Ordena: mostrar las horas de cada curso multiplicadas por 60 como minutos.', ['SELECT', 'horas * 60', 'AS', 'minutos', 'FROM', 'cursos;'], 'La expresión va tras SELECT y el alias tras AS.'),
        tf('Usar AS modifica el nombre de la columna en la tabla original.', false, 'El alias solo afecta al resultado de esa consulta.'),
        mc('En la tabla alumnos hay 5 filas y 3 ciudades distintas. ¿Cuántas filas devuelve SELECT DISTINCT ciudad FROM alumnos?', ['5', '3', '1', '2'], 1, 'Cada ciudad distinta aparece una vez: 3 filas.'),
      ]},
      { id: 'l3', title: 'Reto: consultas básicas', intro:
`Repaso: \`SELECT\` columnas, \`FROM\` tabla, \`*\` para todas, \`AS\` para alias y \`DISTINCT\` para quitar repetidos.

Tablas de los ejercicios:

\`\`\`
alumnos(id, nombre, edad, ciudad, curso_id)
cursos(id, titulo, horas)
\`\`\`

Lee con calma cada consulta antes de contestar.`, ex: [
        mc('¿Qué consulta muestra el título de todos los cursos?', ['SELECT titulo FROM cursos;', 'SELECT cursos FROM titulo;', 'FROM cursos SELECT titulo;', 'SELECT * titulo cursos;'], 0, 'La forma es SELECT columna FROM tabla.'),
        out('¿Cuántas filas devuelve esta consulta?', ALU + '\n\nSELECT DISTINCT ciudad FROM alumnos;', '3', 'Madrid, Sevilla y Bilbao: 3 ciudades distintas.'),
        fill('Muestra nombre y edad con el alias años para la edad.', 'SELECT nombre, edad ___ años FROM alumnos;', ['AS', 'as'], 'AS crea el alias de la columna.'),
        order('Ordena la consulta para ver todas las columnas de cursos.', ['SELECT', '*', 'FROM', 'cursos;'], 'SELECT * FROM tabla devuelve todo.'),
        out('¿Qué valor muestra la primera fila del resultado?', CUR + '\n\nSELECT horas * 2 AS doble FROM cursos;', '60', 'El primer curso tiene 30 horas; 30 * 2 = 60.'),
        pair('Empareja cada consulta con lo que devuelve.', [['SELECT nombre FROM alumnos;', 'Solo los nombres'], ['SELECT * FROM alumnos;', 'Todas las columnas'], ['SELECT DISTINCT ciudad FROM alumnos;', 'Ciudades sin repetir'], ['SELECT edad AS años FROM alumnos;', 'Edad con otro nombre']], 'Fíjate en las columnas y en las palabras DISTINCT y AS.'),
      ]},
    ]},
    { id: 'u2', title: 'WHERE y operadores', desc: 'Filtra las filas que quieres', lessons: [
      { id: 'l1', title: 'Filtrar con WHERE', intro:
`\`WHERE\` filtra las filas que cumplen una condición:

\`\`\`
SELECT nombre FROM alumnos
WHERE edad > 20;
\`\`\`

Operadores de comparación: \`=\`, \`<>\` (distinto), \`>\`, \`<\`, \`>=\`, \`<=\`. En SQL se usa **un solo** \`=\` para comparar. Los textos van entre comillas simples: \`WHERE ciudad = 'Madrid'\`.`, ex: [
        mc('¿Qué devuelve esta consulta?', ['Los alumnos de Madrid', 'Todos los alumnos', 'Los alumnos que no son de Madrid', 'Solo el primer alumno'], 0, 'WHERE filtra por la condición ciudad = Madrid.', "SELECT * FROM alumnos WHERE ciudad = 'Madrid';"),
        fill('Alumnos con edad mayor que 21.', 'SELECT nombre FROM alumnos ___ edad > 21;', ['WHERE', 'where'], 'WHERE va después de FROM.'),
        fill('Alumnos cuya ciudad sea distinta de Sevilla.', "SELECT nombre FROM alumnos WHERE ciudad ___ 'Sevilla';", ['<>', '!='], 'El operador de distinto es <> (muchos motores aceptan también !=).'),
        order('Ordena la consulta para ver cursos de más de 25 horas.', ['SELECT', 'titulo', 'FROM', 'cursos', 'WHERE', 'horas > 25;'], 'WHERE se coloca al final, tras FROM.'),
        tf("En SQL los textos se escriben entre comillas simples, como 'Madrid'.", true, 'Las comillas simples delimitan los valores de texto.'),
        pair('Empareja cada operador con su significado.', [['=', 'Igual a'], ['<>', 'Distinto de'], ['>=', 'Mayor o igual que'], ['<', 'Menor que']], 'Son los operadores de comparación de SQL.'),
      ]},
      { id: 'l2', title: 'AND, OR, IN y BETWEEN', intro:
`Combina condiciones:

\`\`\`
WHERE ciudad = 'Madrid' AND edad > 19
WHERE ciudad = 'Madrid' OR ciudad = 'Bilbao'
WHERE ciudad IN ('Madrid', 'Bilbao')
WHERE edad BETWEEN 20 AND 22
WHERE NOT ciudad = 'Madrid'
\`\`\`

\`AND\` exige que se cumplan ambas; \`OR\`, al menos una. \`IN\` abrevia varios OR. \`BETWEEN\` incluye los dos extremos.`, ex: [
        mc('¿Qué alumnos devuelve WHERE edad > 20 AND ciudad = \'Sevilla\'?', ['Los que cumplen las dos condiciones', 'Los que cumplen al menos una', 'Solo los de Sevilla', 'Ninguno, es un error'], 0, 'AND exige que se cumplan las dos condiciones a la vez.'),
        fill('Alumnos de Madrid o de Bilbao.', "SELECT nombre FROM alumnos WHERE ciudad = 'Madrid' ___ ciudad = 'Bilbao';", ['OR', 'or'], 'OR basta con que una condición sea cierta.'),
        fill('Usa IN para Madrid y Bilbao.', "SELECT nombre FROM alumnos WHERE ciudad ___ ('Madrid', 'Bilbao');", ['IN', 'in'], 'IN comprueba si el valor está en la lista.'),
        tf('BETWEEN 20 AND 22 incluye tanto el 20 como el 22.', true, 'BETWEEN es inclusivo en ambos extremos.'),
        order('Ordena: alumnos con edad entre 20 y 25.', ['SELECT', 'nombre', 'FROM', 'alumnos', 'WHERE', 'edad', 'BETWEEN', '20', 'AND', '25;'], 'BETWEEN valor1 AND valor2.'),
        pair('Empareja cada condición con lo que expresa.', [['AND', 'Se cumplen ambas'], ['OR', 'Se cumple al menos una'], ['NOT', 'Niega la condición'], ['IN', 'Está en una lista']], 'Son los operadores lógicos más habituales.'),
      ]},
      { id: 'l3', title: 'Reto: LIKE y NULL', intro:
`\`LIKE\` busca patrones de texto: \`%\` representa cualquier cantidad de caracteres y \`_\` exactamente uno.

\`\`\`
WHERE nombre LIKE 'A%'     -- empieza por A
WHERE nombre LIKE '%a'     -- termina en a
\`\`\`

\`NULL\` significa "sin valor". No se compara con \`=\`; se usa \`IS NULL\` o \`IS NOT NULL\`:

\`\`\`
WHERE curso_id IS NULL
\`\`\``, ex: [
        mc("¿Qué nombres cumplen LIKE 'M%'?", ['Los que empiezan por M', 'Los que terminan en M', 'Los que contienen solo una M', 'Los que no tienen M'], 0, '% al final significa "lo que sea después de la M".'),
        fill('Alumnos sin curso asignado (curso_id vacío).', 'SELECT nombre FROM alumnos WHERE curso_id ___;', ['IS NULL', 'is null'], 'NULL se comprueba con IS NULL, nunca con = NULL.'),
        tf('WHERE curso_id = NULL encuentra correctamente las filas sin valor.', false, 'Comparar con = NULL nunca es cierto; hay que usar IS NULL.'),
        out('¿Cuántas filas devuelve esta consulta?', ALU + "\n\nSELECT nombre FROM alumnos\nWHERE edad > 20 AND ciudad = 'Sevilla';", '2', 'Luis (22) y Sara (22) son de Sevilla y mayores de 20.'),
        out('¿Qué nombre devuelve esta consulta?', ALU + '\n\nSELECT nombre FROM alumnos\nWHERE curso_id IS NULL;', 'Sara', 'Solo Sara tiene curso_id NULL.'),
        order('Ordena: nombres que terminan en "a".', ['SELECT', 'nombre', 'FROM', 'alumnos', 'WHERE', 'nombre', 'LIKE', "'%a';"], "El patrón '%a' acepta cualquier inicio y exige terminar en a."),
      ]},
    ]},
    { id: 'u3', title: 'Ordenar y agregar', desc: 'ORDER BY, LIMIT, COUNT, GROUP BY...', lessons: [
      { id: 'l1', title: 'ORDER BY y LIMIT', intro:
`\`ORDER BY\` ordena el resultado; por defecto es ascendente (\`ASC\`). Usa \`DESC\` para descendente. \`LIMIT\` restringe el número de filas.

\`\`\`
SELECT nombre, edad FROM alumnos
ORDER BY edad DESC
LIMIT 3;
\`\`\`

Orden de las cláusulas: \`SELECT\`, \`FROM\`, \`WHERE\`, \`ORDER BY\`, \`LIMIT\`.`, ex: [
        mc('¿Qué devuelve ORDER BY edad DESC?', ['Primero los de mayor edad', 'Primero los de menor edad', 'Solo la edad máxima', 'Las edades sin repetir'], 0, 'DESC ordena de mayor a menor.', 'SELECT nombre FROM alumnos ORDER BY edad DESC;'),
        fill('Ordena los cursos por horas de menor a mayor.', 'SELECT titulo FROM cursos ORDER ___ horas;', ['BY', 'by'], 'Se escribe ORDER BY.'),
        fill('Muestra solo los 2 primeros alumnos.', 'SELECT nombre FROM alumnos ___ 2;', ['LIMIT', 'limit'], 'LIMIT n devuelve como máximo n filas.'),
        order('Ordena: los 3 cursos con más horas.', ['SELECT', 'titulo', 'FROM', 'cursos', 'ORDER BY', 'horas DESC', 'LIMIT 3;'], 'Primero ordenas y luego limitas.'),
        tf('Si no indicas ASC o DESC, ORDER BY ordena de forma ascendente.', true, 'ASC es el valor por defecto.'),
        pair('Empareja cada cláusula con su función.', [['ORDER BY', 'Ordena el resultado'], ['LIMIT', 'Limita el número de filas'], ['DESC', 'Orden descendente'], ['ASC', 'Orden ascendente']], 'Se combinan al final de la consulta.'),
      ]},
      { id: 'l2', title: 'Agregación y GROUP BY', intro:
`Las funciones de agregación resumen muchas filas en un valor:

\`COUNT(*)\` cuenta filas, \`SUM(col)\` suma, \`AVG(col)\` media, \`MIN\` y \`MAX\`.

\`\`\`
SELECT COUNT(*) FROM alumnos;
SELECT ciudad, COUNT(*) FROM alumnos
GROUP BY ciudad;
\`\`\`

\`GROUP BY\` forma grupos y calcula la agregación en cada uno. \`COUNT(col)\` ignora los valores NULL.`, ex: [
        mc('¿Qué calcula AVG(edad)?', ['La media de las edades', 'La suma de las edades', 'La edad máxima', 'El número de edades'], 0, 'AVG es la media aritmética.'),
        fill('Cuenta cuántas filas tiene alumnos.', 'SELECT ___(*) FROM alumnos;', ['COUNT', 'count'], 'COUNT(*) cuenta todas las filas.'),
        fill('Cuenta alumnos por ciudad.', 'SELECT ciudad, COUNT(*) FROM alumnos ___ BY ciudad;', ['GROUP', 'group'], 'GROUP BY agrupa las filas por la columna indicada.'),
        out('¿Qué devuelve esta consulta?', ALU + '\n\nSELECT COUNT(*) FROM alumnos\nWHERE ciudad = \'Madrid\';', '2', 'Ana y Marta viven en Madrid.'),
        out('¿Qué devuelve esta consulta?', ALU + '\n\nSELECT SUM(edad) FROM alumnos;', '108', '20 + 22 + 19 + 25 + 22 = 108.'),
        tf('COUNT(curso_id) cuenta también las filas donde curso_id es NULL.', false, 'COUNT(columna) ignora los NULL; COUNT(*) cuenta todas las filas.'),
      ]},
      { id: 'l3', title: 'Reto: HAVING', intro:
`\`WHERE\` filtra filas **antes** de agrupar; \`HAVING\` filtra grupos **después**, normalmente con una agregación:

\`\`\`
SELECT ciudad, COUNT(*) AS total
FROM alumnos
GROUP BY ciudad
HAVING COUNT(*) > 1;
\`\`\`

Orden: \`SELECT\`, \`FROM\`, \`WHERE\`, \`GROUP BY\`, \`HAVING\`, \`ORDER BY\`, \`LIMIT\`.`, ex: [
        mc('¿Cuándo se usa HAVING en lugar de WHERE?', ['Para filtrar grupos ya agregados', 'Para ordenar el resultado', 'Para filtrar filas antes de agrupar', 'Para limitar filas'], 0, 'HAVING actúa sobre los resultados de GROUP BY.'),
        fill('Muestra solo las ciudades con más de 1 alumno.', 'SELECT ciudad FROM alumnos GROUP BY ciudad ___ COUNT(*) > 1;', ['HAVING', 'having'], 'HAVING filtra grupos por su agregación.'),
        out('¿Cuántas filas devuelve esta consulta?', ALU + '\n\nSELECT ciudad, COUNT(*) FROM alumnos\nGROUP BY ciudad\nHAVING COUNT(*) > 1;', '2', 'Madrid y Sevilla tienen 2 alumnos cada una; Bilbao solo 1.'),
        out('¿Qué devuelve esta consulta?', CUR + '\n\nSELECT MAX(horas) FROM cursos;', '50', 'El curso con más horas es Java: 50.'),
        order('Ordena: ciudades con más de un alumno, de la más numerosa a la menos.', ['SELECT', 'ciudad', 'FROM alumnos', 'GROUP BY ciudad', 'HAVING COUNT(*) > 1', 'ORDER BY COUNT(*) DESC;'], 'Agrupar, filtrar grupos y al final ordenar.'),
        out('¿Qué devuelve esta consulta?', ALU + '\n\nSELECT COUNT(curso_id) FROM alumnos;', '4', 'Sara tiene curso_id NULL y COUNT(columna) la ignora.'),
      ]},
    ]},
    { id: 'u4', title: 'JOINs', desc: 'Combina datos de varias tablas', lessons: [
      { id: 'l1', title: 'INNER JOIN', intro:
`Los datos relacionados viven en tablas distintas. \`alumnos.curso_id\` apunta a \`cursos.id\`. Con \`JOIN\` las unes:

\`\`\`
SELECT alumnos.nombre, cursos.titulo
FROM alumnos
INNER JOIN cursos
  ON alumnos.curso_id = cursos.id;
\`\`\`

\`ON\` indica cómo se emparejan las filas. \`INNER JOIN\` devuelve solo las filas con pareja en **ambas** tablas. Se usa \`tabla.columna\` para evitar ambigüedades.`, ex: [
        mc('¿Qué devuelve INNER JOIN?', ['Solo filas con coincidencia en ambas tablas', 'Todas las filas de la tabla izquierda', 'Todas las filas de ambas tablas', 'El producto de las dos tablas sin condición'], 0, 'INNER JOIN descarta las filas sin pareja.'),
        fill('Une alumnos con cursos.', 'SELECT * FROM alumnos INNER ___ cursos ON alumnos.curso_id = cursos.id;', ['JOIN', 'join'], 'Se escribe INNER JOIN.'),
        fill('Indica la condición de unión.', 'SELECT * FROM alumnos INNER JOIN cursos ___ alumnos.curso_id = cursos.id;', ['ON', 'on'], 'ON define qué columnas se emparejan.'),
        order('Ordena la consulta que muestra nombre del alumno y título del curso.', ['SELECT alumnos.nombre, cursos.titulo', 'FROM alumnos', 'INNER JOIN cursos', 'ON alumnos.curso_id = cursos.id;'], 'SELECT, FROM, JOIN con ON.'),
        tf('Con tablas.columna evitas confusión cuando dos tablas tienen una columna con el mismo nombre, como id.', true, 'Sirve para indicar de qué tabla es cada columna.'),
        pair('Empareja cada elemento con su papel.', [['curso_id', 'Clave que apunta a otra tabla'], ['ON', 'Condición del JOIN'], ['INNER JOIN', 'Solo filas con pareja'], ['alumnos.nombre', 'Columna de una tabla concreta']], 'Estos son los ingredientes de un JOIN.'),
      ]},
      { id: 'l2', title: 'LEFT JOIN', intro:
`\`LEFT JOIN\` conserva **todas** las filas de la tabla izquierda (la del \`FROM\`). Si no hay pareja, las columnas de la derecha salen como \`NULL\`.

\`\`\`
SELECT alumnos.nombre, cursos.titulo
FROM alumnos
LEFT JOIN cursos
  ON alumnos.curso_id = cursos.id;
\`\`\`

Así aparecen también los alumnos sin curso, con \`titulo\` a NULL. Es útil para encontrar filas sin relación con \`WHERE cursos.id IS NULL\`.`, ex: [
        mc('En un LEFT JOIN, ¿qué pasa con una fila izquierda sin pareja?', ['Aparece con NULL en las columnas de la derecha', 'Desaparece del resultado', 'Provoca un error', 'Se duplica'], 0, 'LEFT JOIN conserva todas las filas de la izquierda.'),
        fill('Muestra todos los alumnos, tengan curso o no.', 'SELECT nombre, titulo FROM alumnos ___ JOIN cursos ON alumnos.curso_id = cursos.id;', ['LEFT', 'left'], 'LEFT JOIN conserva la tabla izquierda completa.'),
        out('¿Cuántas filas devuelve esta consulta?', ALU + '\n' + CUR + '\n\nSELECT alumnos.nombre, cursos.titulo\nFROM alumnos\nLEFT JOIN cursos ON alumnos.curso_id = cursos.id;', '5', 'Los 5 alumnos aparecen; Sara con titulo NULL.'),
        out('¿Cuántas filas devuelve esta consulta?', ALU + '\n' + CUR + '\n\nSELECT alumnos.nombre, cursos.titulo\nFROM alumnos\nINNER JOIN cursos ON alumnos.curso_id = cursos.id;', '4', 'Sara no tiene curso, así que el INNER JOIN la descarta.'),
        tf('INNER JOIN y LEFT JOIN siempre devuelven el mismo número de filas.', false, 'LEFT JOIN puede devolver más, al conservar filas sin pareja.'),
        order('Ordena: alumnos sin curso.', ['SELECT alumnos.nombre', 'FROM alumnos', 'LEFT JOIN cursos', 'ON alumnos.curso_id = cursos.id', 'WHERE cursos.id IS NULL;'], 'LEFT JOIN más IS NULL localiza las filas sin pareja.'),
      ]},
      { id: 'l3', title: 'Reto: unir y agrupar', intro:
`Puedes combinar JOIN con todo lo anterior: \`WHERE\`, \`GROUP BY\`, \`ORDER BY\`...

\`\`\`
SELECT cursos.titulo, COUNT(alumnos.id) AS total
FROM cursos
LEFT JOIN alumnos
  ON alumnos.curso_id = cursos.id
GROUP BY cursos.titulo;
\`\`\`

Con \`cursos\` a la izquierda salen también los cursos sin alumnos (total 0). \`COUNT(alumnos.id)\` ignora los NULL.`, ex: [
        mc('¿Cuántos alumnos cuenta Java en la consulta del ejemplo?', ['0', '1', '4', 'NULL'], 0, 'Nadie tiene curso_id 4; COUNT(alumnos.id) ignora los NULL y da 0.'),
        fill('Cuenta alumnos por título de curso.', 'SELECT cursos.titulo, COUNT(*) FROM alumnos INNER JOIN cursos ON alumnos.curso_id = cursos.id GROUP BY cursos.___;', ['titulo'], 'Se agrupa por la columna que se muestra.'),
        out('¿Qué título devuelve esta consulta?', ALU + '\n' + CUR + "\n\nSELECT cursos.titulo\nFROM alumnos\nINNER JOIN cursos ON alumnos.curso_id = cursos.id\nWHERE alumnos.nombre = 'Pedro';", 'HTML', 'Pedro tiene curso_id 3, que es HTML.'),
        out('¿Cuántas filas devuelve esta consulta?', ALU + '\n' + CUR + '\n\nSELECT cursos.titulo\nFROM cursos\nLEFT JOIN alumnos ON alumnos.curso_id = cursos.id;', '5', 'SQL(2) + Python(1) + HTML(1) + Java(1 con NULL) = 5 filas.'),
        order('Ordena: cursos con más de un alumno.', ['SELECT cursos.titulo', 'FROM cursos', 'INNER JOIN alumnos', 'ON alumnos.curso_id = cursos.id', 'GROUP BY cursos.titulo', 'HAVING COUNT(*) > 1;'], 'HAVING se escribe después de GROUP BY.'),
        pair('Empareja cada consulta con su resultado.', [['INNER JOIN alumnos y cursos', '4 filas'], ['alumnos LEFT JOIN cursos', '5 filas'], ['COUNT(*) por ciudad', 'Un total por cada ciudad'], ['Curso sin alumnos con LEFT JOIN', 'Columnas de alumno a NULL']], 'Piensa qué filas conserva cada tipo de JOIN.'),
      ]},
    ]},
    { id: 'u5', title: 'Crear y modificar datos', desc: 'CREATE, INSERT, UPDATE, DELETE y más', lessons: [
      { id: 'l1', title: 'CREATE TABLE e INSERT', intro:
`\`CREATE TABLE\` define una tabla con sus columnas y tipos. Una **clave primaria** (\`PRIMARY KEY\`) identifica cada fila de forma única.

\`\`\`
CREATE TABLE cursos (
  id INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL,
  horas INTEGER
);

INSERT INTO cursos (id, titulo, horas)
VALUES (5, 'Git', 10);
\`\`\`

Tipos comunes: \`INTEGER\`, \`TEXT\`, \`REAL\` (decimales), \`DATE\`. \`NOT NULL\` impide dejar el valor vacío.`, ex: [
        mc('¿Qué hace PRIMARY KEY?', ['Identifica de forma única cada fila', 'Ordena la tabla', 'Permite valores repetidos', 'Borra duplicados'], 0, 'La clave primaria es única y distingue cada fila.'),
        fill('Crea una tabla llamada alumnos.', 'CREATE ___ alumnos (id INTEGER PRIMARY KEY, nombre TEXT);', ['TABLE', 'table'], 'Se escribe CREATE TABLE nombre (...).'),
        fill('Inserta una fila en cursos.', "INSERT INTO cursos (id, titulo, horas) ___ (6, 'Java', 50);", ['VALUES', 'values'], 'VALUES lleva los datos de la nueva fila.'),
        order('Ordena la sentencia para añadir a Ana.', ['INSERT INTO', 'alumnos', '(nombre, edad)', 'VALUES', "('Ana', 20);"], 'Tabla, columnas y luego VALUES.'),
        tf('NOT NULL en una columna impide insertar filas sin valor en ella.', true, 'NOT NULL obliga a dar un valor.'),
        pair('Empareja cada tipo con el dato que guarda.', [['INTEGER', 'Número entero'], ['TEXT', 'Texto'], ['REAL', 'Número decimal'], ['DATE', 'Fecha']], 'Elegir el tipo adecuado ayuda a la base de datos a validar los datos.'),
      ]},
      { id: 'l2', title: 'UPDATE, DELETE e índices', intro:
`\`UPDATE\` modifica filas y \`DELETE\` las borra. **Siempre** usa \`WHERE\`, o afectarás a todas las filas.

\`\`\`
UPDATE alumnos SET edad = 21 WHERE id = 1;
DELETE FROM alumnos WHERE id = 5;
\`\`\`

Una **clave foránea** (\`FOREIGN KEY\`) enlaza con la clave primaria de otra tabla.

Un **índice** acelera las búsquedas por una columna:

\`\`\`
CREATE INDEX idx_ciudad ON alumnos(ciudad);
\`\`\``, ex: [
        mc('¿Qué ocurre con DELETE FROM alumnos; sin WHERE?', ['Se borran todas las filas', 'No pasa nada', 'Se borra la primera fila', 'Se borra la tabla y su estructura'], 0, 'Sin WHERE afecta a todas las filas, aunque la tabla sigue existiendo.'),
        fill('Cambia la ciudad de Ana a Valencia.', "UPDATE alumnos ___ ciudad = 'Valencia' WHERE nombre = 'Ana';", ['SET', 'set'], 'SET indica qué columnas se modifican.'),
        fill('Borra al alumno con id 3.', 'DELETE ___ alumnos WHERE id = 3;', ['FROM', 'from'], 'Se escribe DELETE FROM tabla WHERE ...'),
        out('¿Qué edad tiene Ana después de ejecutar las sentencias?', ALU + "\n\nUPDATE alumnos SET edad = edad + 1\nWHERE ciudad = 'Madrid';\nSELECT edad FROM alumnos WHERE nombre = 'Ana';", '21', 'Ana tenía 20 y UPDATE suma 1 a las edades de Madrid.'),
        order('Ordena la sentencia que crea un índice sobre la ciudad.', ['CREATE INDEX', 'idx_ciudad', 'ON', 'alumnos(ciudad);'], 'CREATE INDEX nombre ON tabla(columna).'),
        tf('Un índice hace más rápidas las búsquedas por esa columna.', true, 'El índice permite localizar las filas sin recorrer toda la tabla.'),
      ]},
      { id: 'l3', title: 'Reto: subconsultas', intro:
`Una **subconsulta** es un \`SELECT\` dentro de otro, entre paréntesis:

\`\`\`
SELECT nombre FROM alumnos
WHERE edad = (SELECT MAX(edad) FROM alumnos);
\`\`\`

Primero se resuelve la interna y su resultado se usa en la externa. Con varios valores se usa \`IN\`:

\`\`\`
WHERE curso_id IN (SELECT id FROM cursos WHERE horas > 25)
\`\`\``, ex: [
        mc('¿Qué es una subconsulta?', ['Un SELECT dentro de otra consulta', 'Una tabla temporal', 'Un tipo de índice', 'Una clave foránea'], 0, 'Va entre paréntesis y su resultado lo usa la consulta externa.'),
        fill('Alumnos con la edad máxima.', 'SELECT nombre FROM alumnos WHERE edad = (SELECT ___(edad) FROM alumnos);', ['MAX', 'max'], 'MAX devuelve la mayor edad.'),
        out('¿Qué nombre devuelve esta consulta?', ALU + '\n\nSELECT nombre FROM alumnos\nWHERE edad = (SELECT MAX(edad) FROM alumnos);', 'Pedro', 'La edad máxima es 25, la de Pedro.'),
        out('¿Cuántas filas quedan en alumnos tras ejecutar esto?', ALU + '\n\nDELETE FROM alumnos WHERE edad < 21;\nSELECT COUNT(*) FROM alumnos;', '3', 'Ana (20) y Marta (19) se borran; quedan 3.'),
        order('Ordena: alumnos de cursos de más de 25 horas.', ['SELECT nombre', 'FROM alumnos', 'WHERE curso_id IN', '(SELECT id', 'FROM cursos', 'WHERE horas > 25);'], 'La subconsulta devuelve los id de los cursos largos.'),
        pair('Empareja cada sentencia con su efecto.', [['INSERT', 'Añade filas'], ['UPDATE', 'Modifica filas'], ['DELETE', 'Elimina filas'], ['CREATE TABLE', 'Define una tabla nueva']], 'Son las operaciones básicas para modificar datos y estructura.'),
      ]},
    ]},
  ],
};
}
