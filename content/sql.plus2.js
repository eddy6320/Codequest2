(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');
const EMP = `-- empleados
-- id | nombre | jefe_id
-- 1  | Ana    | NULL
-- 2  | Luis   | 1
-- 3  | Marta  | 1
-- 4  | Pedro  | 2
-- 5  | Sara   | 4`;

CQ.content.sql.units.push(
  // ───────────── UNIDAD 11 ─────────────
  { id: 'u11', title: 'CTE recursivas y jerarquías', desc: 'Recorre árboles y genera series con SQL', lessons: [
    { id: 'l1', title: 'WITH RECURSIVE', intro: L(
'Una **CTE recursiva** se llama a sí misma hasta que no genera filas nuevas:',
'',
'```sql',
'WITH RECURSIVE n(i) AS (',
'  SELECT 1                      -- ancla: fila inicial',
'  UNION ALL',
'  SELECT i + 1 FROM n WHERE i < 5   -- paso recursivo',
')',
'SELECT SUM(i) FROM n;',
'```',
'',
'Tiene siempre una **ancla**, un **paso recursivo** y una **condición de parada** (el `WHERE`). Sin condición de parada se repite sin fin.'),
      ex: [
        out('¿Qué valor devuelve?', 'WITH RECURSIVE n(i) AS (\n  SELECT 1\n  UNION ALL\n  SELECT i + 1 FROM n WHERE i < 5\n)\nSELECT SUM(i) FROM n;', '15', 'Genera 1,2,3,4,5 y los suma: 15.'),
        mc('¿Qué detiene la recursión en el ejemplo de la lección?', ['La condición WHERE i < 5', 'El UNION ALL', 'El SUM', 'El nombre n'], 0, 'Cuando el paso recursivo ya no produce filas, la CTE termina.'),
        out('¿Cuántas filas devuelve?', 'WITH RECURSIVE n(i) AS (\n  SELECT 10\n  UNION ALL\n  SELECT i - 3 FROM n WHERE i > 0\n)\nSELECT COUNT(*) FROM n;', '5', 'Genera 10, 7, 4, 1 y -2; con -2 la condición i > 0 ya no se cumple.'),
        tf('UNION ALL conserva las filas duplicadas.', true, 'UNION las elimina; UNION ALL no, y por eso es más rápido.'),
        fill('Declara la CTE recursiva', 'WITH ___ n(i) AS (\n  SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 3\n)\nSELECT * FROM n;', 'RECURSIVE', 'La palabra RECURSIVE permite que la CTE se referencie a sí misma.'),
        out('¿Qué valor devuelve?', 'WITH RECURSIVE f(a, b) AS (\n  SELECT 0, 1\n  UNION ALL\n  SELECT b, a + b FROM f WHERE b < 50\n)\nSELECT MAX(a) FROM f;', '34', 'Es la serie de Fibonacci; la última fila generada es (34, 55) y su mayor a es 34.'),
      ] },
    { id: 'l2', title: 'Jerarquías y árboles', intro: L(
'Una tabla puede apuntar a sí misma: cada empleado tiene un `jefe_id`. Para recorrer **todos los descendientes** de alguien se parte de él (ancla) y se unen sus subordinados una y otra vez (paso recursivo):',
'',
'```sql',
'WITH RECURSIVE sub(id) AS (',
'  SELECT id FROM empleados WHERE id = 2',
'  UNION ALL',
'  SELECT e.id FROM empleados e JOIN sub s ON e.jefe_id = s.id',
')',
'SELECT * FROM sub;',
'```',
'',
'El jefe supremo se reconoce porque `jefe_id IS NULL`. Puedes llevar una columna `nivel` que aumenta en cada paso.'),
      ex: [
        out('¿Cuántas filas devuelve (incluye a Luis)?', EMP + '\n\nWITH RECURSIVE sub(id) AS (\n  SELECT id FROM empleados WHERE id = 2\n  UNION ALL\n  SELECT e.id FROM empleados e JOIN sub s ON e.jefe_id = s.id\n)\nSELECT COUNT(*) FROM sub;', '3', 'Luis, su subordinado Pedro y el de este, Sara.'),
        out('¿Qué nivel máximo hay?', EMP + '\n\nWITH RECURSIVE t(id, nivel) AS (\n  SELECT id, 0 FROM empleados WHERE jefe_id IS NULL\n  UNION ALL\n  SELECT e.id, t.nivel + 1 FROM empleados e JOIN t ON e.jefe_id = t.id\n)\nSELECT MAX(nivel) FROM t;', '3', 'Ana (0) → Luis (1) → Pedro (2) → Sara (3).'),
        mc('¿Cómo se llama la parte inicial de una CTE recursiva?', ['Ancla', 'Cola', 'Bucle', 'Índice'], 0, 'Es la consulta que produce las primeras filas antes de recursar.'),
        out('¿Cuántas personas hay en el nivel 1?', EMP + '\n\nWITH RECURSIVE t(id, nivel) AS (\n  SELECT id, 0 FROM empleados WHERE jefe_id IS NULL\n  UNION ALL\n  SELECT e.id, t.nivel + 1 FROM empleados e JOIN t ON e.jefe_id = t.id\n)\nSELECT COUNT(*) FROM t WHERE nivel = 1;', '2', 'Luis y Marta dependen directamente de Ana.'),
        tf('Una CTE recursiva sin condición de parada puede repetirse sin fin.', true, 'Si cada paso siempre produce filas nuevas, la consulta no termina (o el motor la corta).'),
        fill('Encuentra al jefe supremo (no tiene jefe)', 'SELECT nombre FROM empleados WHERE jefe_id ___ NULL;', 'IS', 'Con NULL se usa IS NULL, nunca = NULL.'),
      ] },
    { id: 'l3', title: 'Reto: cadenas de mando y series', intro: L(
'Para subir por el árbol (de un empleado hacia sus jefes) se invierte la unión: el paso recursivo busca al **jefe** de la fila actual.',
'',
'Las CTE recursivas también generan **series** (números, fechas) sin necesitar una tabla auxiliar, y `group_concat` (SQLite) o `STRING_AGG` (PostgreSQL, SQL Server) juntan valores en un solo texto.'),
      ex: [
        out('¿Cuántas personas hay en la cadena de mando de Sara (incluida ella)?', EMP + '\n\nWITH RECURSIVE up(id, jefe) AS (\n  SELECT id, jefe_id FROM empleados WHERE id = 5\n  UNION ALL\n  SELECT e.id, e.jefe_id FROM empleados e JOIN up ON e.id = up.jefe\n)\nSELECT COUNT(*) FROM up;', '4', 'Sara, Pedro, Luis y Ana.'),
        out('¿Cuántos números pares genera?', 'WITH RECURSIVE n(i) AS (\n  SELECT 1\n  UNION ALL\n  SELECT i + 1 FROM n WHERE i < 10\n)\nSELECT COUNT(*) FROM n WHERE i % 2 = 0;', '5', 'De 1 a 10 hay cinco pares: 2, 4, 6, 8 y 10.'),
        tf('Las CTE recursivas sirven para recorrer jerarquías y grafos.', true, 'Son la herramienta estándar de SQL para estructuras de árbol.'),
        pair('Empareja la parte con su función', [['ancla', 'fila inicial'], ['paso recursivo', 'genera filas nuevas'], ['condición de parada', 'evita el ciclo infinito'], ['UNION ALL', 'une ancla y pasos']], 'Las tres piezas más el UNION ALL forman toda CTE recursiva.'),
        out('¿Qué texto devuelve?', EMP + '\n\nSELECT group_concat(nombre, \',\') FROM empleados WHERE jefe_id = 1;', 'Luis,Marta', 'group_concat une los nombres de los subordinados directos de Ana.'),
        mc('¿Qué debe cambiar para subir por el árbol en lugar de bajar?', ['Unir por e.id = up.jefe en lugar de e.jefe_id = s.id', 'Quitar el UNION ALL', 'Usar ORDER BY', 'Cambiar COUNT por SUM'], 0, 'En cada paso se busca al jefe de la fila actual, no a sus subordinados.'),
      ] },
  ]}
);
})();
