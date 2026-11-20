(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;

const EMP = `-- empleados
-- id | nombre | depto  | salario
-- 1  | Ana    | Ventas | 2000
-- 2  | Luis   | Ventas | 2500
-- 3  | Marta  | IT     | 3000
-- 4  | Pedro  | IT     | 3000
-- 5  | Sara   | RRHH   | 2200
-- 6  | Diego  | IT     | 2800`;
const PED = `-- pedidos
-- id | cliente | total | fecha
-- 1  | Ana     | 50    | 2024-01-10
-- 2  | Luis    | 80    | 2024-01-15
-- 3  | Ana     | 70    | 2024-02-03
-- 4  | Marta   | 120   | 2024-02-20
-- 5  | Luis    | 30    | 2024-03-05`;
const ALU = `-- alumnos
-- id | nombre | edad | ciudad  | curso_id
-- 1  | Ana    | 20   | Madrid  | 1
-- 2  | Luis   | 22   | Sevilla | 2
-- 3  | Marta  | 19   | Madrid  | 1
-- 4  | Pedro  | 25   | Bilbao  | 3
-- 5  | Sara   | 22   | Sevilla | NULL`;
const MAT = `-- matriculas
-- alumno_id | curso_id
-- 1         | 1
-- 1         | 2
-- 2         | 1
-- 3         | 3`;
const CUE = `-- cuentas
-- id | saldo
-- 1  | 100
-- 2  | 50`;

CQ.content.sql.units.push(
  { id: 'u6', title: 'Subconsultas, CASE y CTE', desc: 'Consultas dentro de consultas', lessons: [
    { id: 'l1', title: 'Subconsultas', intro:
`Una **subconsulta** es un \`SELECT\` dentro de otro, entre paréntesis. Se ejecuta primero y su resultado se usa en la consulta externa.

\`\`\`
SELECT nombre FROM empleados
WHERE salario > (SELECT AVG(salario) FROM empleados);
\`\`\`

Si devuelve un solo valor se usa con \`=\`, \`>\`, etc. Si devuelve varios, con \`IN\`:

\`\`\`
WHERE depto IN (SELECT depto FROM empleados WHERE salario > 2900)
\`\`\`

Tablas: \`empleados(id, nombre, depto, salario)\` y \`pedidos(id, cliente, total, fecha)\`.`, ex: [
      mc('¿Qué devuelve esta consulta?', ['Empleados que cobran más que la media', 'El salario medio', 'Todos los empleados', 'Empleados que cobran menos que la media'], 0, 'La subconsulta calcula la media y el WHERE se queda con quien la supera.', 'SELECT nombre FROM empleados\nWHERE salario > (SELECT AVG(salario) FROM empleados);'),
      fill('Completa para comparar con el salario máximo.', 'SELECT nombre FROM empleados WHERE salario = (SELECT ___(salario) FROM empleados);', ['MAX', 'max'], 'MAX devuelve el mayor valor; la subconsulta da un único número.'),
      tf('Una subconsulta se escribe entre paréntesis.', true, 'Los paréntesis delimitan el SELECT interno.'),
      out('¿Cuántas filas devuelve esta consulta?', EMP + '\n\nSELECT nombre FROM empleados\nWHERE salario > (SELECT AVG(salario) FROM empleados);', '3', 'La media es 2583,33; la superan Marta, Pedro y Diego.'),
      fill('Usa el operador adecuado para comparar con una lista de valores.', 'SELECT * FROM empleados WHERE depto ___ (SELECT depto FROM empleados WHERE salario > 2900);', ['IN', 'in'], 'Si la subconsulta devuelve varias filas, se compara con IN.'),
      order('Ordena: pedidos con total superior a la media.', ['SELECT', '*', 'FROM', 'pedidos', 'WHERE', 'total', '>', '(SELECT AVG(total) FROM pedidos);'], 'La subconsulta va entre paréntesis dentro del WHERE.'),
    ]},
    { id: 'l2', title: 'CASE y CTE', intro:
`\`CASE\` crea valores condicionales, como un if:

\`\`\`
SELECT nombre,
  CASE WHEN salario >= 2800 THEN 'alto'
       ELSE 'normal' END AS nivel
FROM empleados;
\`\`\`

Una **CTE** (\`WITH\`) da nombre a una consulta intermedia, y hace el código más legible:

\`\`\`
WITH por_depto AS (
  SELECT depto, SUM(salario) AS total FROM empleados GROUP BY depto
)
SELECT depto FROM por_depto WHERE total > 5000;
\`\`\``, ex: [
      mc('¿Qué hace la cláusula ELSE en un CASE?', ['Da el valor cuando ninguna condición se cumple', 'Termina la consulta', 'Repite el CASE', 'Filtra las filas'], 0, 'ELSE es el valor por defecto si no coincide ningún WHEN.'),
      fill('Cierra la expresión CASE.', "SELECT CASE WHEN edad >= 18 THEN 'mayor' ELSE 'menor' ___ FROM alumnos;", ['END', 'end'], 'Todo CASE termina con END.'),
      fill('Empieza la consulta con una CTE.', 'WITH t AS (SELECT depto FROM empleados) SELECT * FROM t; -- palabra clave:  ___', ['WITH', 'with'], 'WITH introduce la CTE.'),
      out('¿Qué devuelve esta consulta?', EMP + "\n\nSELECT CASE WHEN salario >= 2800 THEN 'alto' ELSE 'normal' END\nFROM empleados WHERE nombre = 'Sara';", 'normal', 'Sara cobra 2200, menor que 2800, así que se usa ELSE.'),
      out('¿Qué departamento devuelve?', EMP + '\n\nWITH t AS (\n  SELECT depto, SUM(salario) AS s FROM empleados GROUP BY depto\n)\nSELECT depto FROM t WHERE s > 5000;', 'IT', 'IT suma 8800; Ventas 4500 y RRHH 2200 no superan 5000.'),
      tf('Una CTE crea una tabla permanente en la base de datos.', false, 'La CTE solo existe durante esa consulta.'),
    ]},
    { id: 'l3', title: 'Reto: anidar consultas', intro:
`Repaso: subconsultas con \`(SELECT ...)\`, \`IN\` para listas, \`CASE WHEN ... END\` para condiciones y \`WITH\` para nombrar pasos.

Un truco: \`SUM(CASE WHEN cond THEN 1 ELSE 0 END)\` cuenta filas que cumplen la condición.

Puedes usar subconsultas incluso dentro de otras subconsultas. Lee de dentro hacia fuera.`, ex: [
      out('¿Qué número devuelve?', EMP + '\n\nSELECT MAX(salario) FROM empleados\nWHERE salario < (SELECT MAX(salario) FROM empleados);', '2800', 'Es el segundo salario más alto: el máximo es 3000, y por debajo el mayor es 2800.'),
      out('¿Qué número devuelve?', EMP + "\n\nSELECT SUM(CASE WHEN depto = 'IT' THEN 1 ELSE 0 END)\nFROM empleados;", '3', 'Suma 1 por cada empleado de IT: Marta, Pedro y Diego.'),
      out('¿Cuántos pedidos superan la media del total?', PED + '\n\nSELECT COUNT(*) FROM pedidos\nWHERE total > (SELECT AVG(total) FROM pedidos);', '2', 'La media es 70; solo 80 y 120 la superan (el 70 no es mayor).'),
      mc('¿Cuál es la ventaja principal de una CTE frente a subconsultas anidadas?', ['Es más legible y reutilizable en la consulta', 'Guarda datos en disco', 'Siempre es más rápida', 'Evita usar SELECT'], 0, 'Dar nombre a los pasos intermedios facilita leer la consulta.'),
      pair('Empareja cada elemento con su uso.', [['(SELECT ...)', 'Subconsulta'], ['CASE WHEN', 'Valor condicional'], ['WITH', 'Consulta con nombre'], ['IN (...)', 'Comparar con una lista']], 'Son las herramientas de esta unidad.'),
      order('Ordena una CTE sencilla.', ['WITH', 'ventas', 'AS', '(SELECT * FROM pedidos)', 'SELECT', 'COUNT(*)', 'FROM', 'ventas;'], 'Primero se define la CTE y luego se consulta.'),
    ]},
  ]},
  { id: 'u7', title: 'Funciones de ventana', desc: 'Calcula sin perder filas', lessons: [
    { id: 'l1', title: 'ROW_NUMBER y RANK', intro:
`Una **función de ventana** calcula sobre un grupo de filas **sin colapsarlas** como hace \`GROUP BY\`. Se define con \`OVER\`:

\`\`\`
SELECT nombre,
  ROW_NUMBER() OVER (ORDER BY salario DESC) AS pos
FROM empleados;
\`\`\`

\`ROW_NUMBER\` numera 1, 2, 3... \`RANK\` da el mismo número a los empates y salta los siguientes (1, 1, 3). \`DENSE_RANK\` no salta (1, 1, 2).`, ex: [
      mc('¿Qué diferencia a una función de ventana de GROUP BY?', ['Mantiene todas las filas del resultado', 'Solo funciona con texto', 'Elimina filas duplicadas', 'No admite ORDER BY'], 0, 'GROUP BY colapsa filas; OVER calcula sin quitarlas.'),
      fill('Completa la cláusula que define la ventana.', 'SELECT nombre, ROW_NUMBER() ___ (ORDER BY salario DESC) FROM empleados;', ['OVER', 'over'], 'Toda función de ventana lleva OVER.'),
      tf('RANK da el mismo número a filas empatadas y salta el siguiente.', true, 'Con empates 1, 1 la siguiente posición es 3.'),
      out('¿Qué posición RANK tiene Diego por salario descendente?', EMP + '\n\nSELECT r FROM (\n  SELECT nombre, RANK() OVER (ORDER BY salario DESC) AS r FROM empleados\n) WHERE nombre = \'Diego\';', '3', 'Marta y Pedro empatan en 1; Diego es el siguiente: 3.'),
      out('¿Y con DENSE_RANK?', EMP + '\n\nSELECT r FROM (\n  SELECT nombre, DENSE_RANK() OVER (ORDER BY salario DESC) AS r FROM empleados\n) WHERE nombre = \'Diego\';', '2', 'DENSE_RANK no deja huecos tras los empates.'),
      out('¿Quién tiene ROW_NUMBER 2 (salario DESC, id)?', EMP + '\n\nSELECT nombre FROM (\n  SELECT nombre, ROW_NUMBER() OVER (ORDER BY salario DESC, id) AS rn FROM empleados\n) WHERE rn = 2;', 'Pedro', 'Marta y Pedro empatan; el desempate por id deja a Marta primera y a Pedro segundo.'),
    ]},
    { id: 'l2', title: 'SUM OVER y PARTITION BY', intro:
`Con \`PARTITION BY\` divides las filas en grupos; la función se calcula dentro de cada grupo:

\`\`\`
SUM(total) OVER (PARTITION BY cliente)
\`\`\`

Con \`ORDER BY\` dentro de \`OVER\`, la suma es **acumulada**:

\`\`\`
SUM(total) OVER (ORDER BY fecha)
\`\`\`

Y \`ROW_NUMBER() OVER (PARTITION BY depto ORDER BY salario DESC)\` numera dentro de cada departamento: sirve para "el top N por grupo".`, ex: [
      mc('¿Qué calcula SUM(total) OVER (PARTITION BY cliente)?', ['La suma de totales de cada cliente en todas sus filas', 'La suma de todos los pedidos', 'El total del primer pedido', 'El número de clientes'], 0, 'PARTITION BY reparte por cliente y suma dentro de cada grupo.'),
      fill('Divide por departamento.', 'ROW_NUMBER() OVER (___ BY depto ORDER BY salario DESC)', ['PARTITION', 'partition'], 'PARTITION BY define los grupos.'),
      tf('SUM(total) OVER (ORDER BY fecha) devuelve una suma acumulada.', true, 'Con ORDER BY la ventana crece fila a fila.'),
      out('¿Qué acumulado tiene el pedido 4?', PED + '\n\nSELECT acum FROM (\n  SELECT id, SUM(total) OVER (ORDER BY fecha) AS acum FROM pedidos\n) WHERE id = 4;', '320', 'Por fecha: 50 + 80 + 70 + 120 = 320.'),
      out('¿Qué valor sale para el pedido 3?', PED + '\n\nSELECT s FROM (\n  SELECT id, SUM(total) OVER (PARTITION BY cliente) AS s FROM pedidos\n) WHERE id = 3;', '120', 'El pedido 3 es de Ana, que suma 50 + 70 = 120.'),
      order('Ordena la ventana por cliente.', ['SUM(total)', 'OVER', '(PARTITION', 'BY', 'cliente)'], 'Función, OVER y luego la definición de la ventana.'),
    ]},
    { id: 'l3', title: 'Reto: LAG, LEAD y top N', intro:
`\`LAG(col)\` toma el valor de la fila **anterior** y \`LEAD(col)\` el de la **siguiente**, según el orden de la ventana:

\`\`\`
LAG(total) OVER (ORDER BY fecha)
\`\`\`

La primera fila no tiene anterior: devuelve \`NULL\`. Útil para comparar con el periodo anterior.

Para el "top 1 por grupo", numera con \`ROW_NUMBER\` en una subconsulta y filtra \`= 1\` fuera, porque \`WHERE\` no admite funciones de ventana.`, ex: [
      out('¿Qué total tiene el pedido anterior al 4 (por fecha)?', PED + '\n\nSELECT ant FROM (\n  SELECT id, LAG(total) OVER (ORDER BY fecha) AS ant FROM pedidos\n) WHERE id = 4;', '70', 'Por fecha, antes del pedido 4 está el 3, con total 70.'),
      out('¿Qué total tiene el pedido siguiente al 1?', PED + '\n\nSELECT sig FROM (\n  SELECT id, LEAD(total) OVER (ORDER BY fecha) AS sig FROM pedidos\n) WHERE id = 1;', '80', 'LEAD mira hacia delante: tras el pedido 1 viene el 2, con 80.'),
      out('¿Qué número tiene Diego en su departamento (salario DESC, id)?', EMP + '\n\nSELECT n FROM (\n  SELECT nombre, ROW_NUMBER() OVER (PARTITION BY depto ORDER BY salario DESC, id) AS n FROM empleados\n) WHERE nombre = \'Diego\';', '3', 'En IT: Marta 1, Pedro 2, Diego 3.'),
      mc('¿Qué devuelve LAG en la primera fila de la ventana?', ['NULL', '0', 'La propia fila', 'Un error'], 0, 'No hay fila anterior, así que el resultado es NULL.'),
      tf('Puedes escribir WHERE ROW_NUMBER() OVER (...) = 1 directamente.', false, 'Las funciones de ventana no se permiten en WHERE; hay que usar una subconsulta o CTE.'),
      pair('Empareja cada función con su resultado.', [['ROW_NUMBER', 'Numera 1, 2, 3 sin repetir'], ['RANK', 'Empates con huecos'], ['LAG', 'Valor de la fila anterior'], ['LEAD', 'Valor de la fila siguiente']], 'Cada función mira las filas de la ventana de forma distinta.'),
    ]},
  ]},
  { id: 'u8', title: 'Diseño de bases de datos', desc: 'Tablas bien pensadas', lessons: [
    { id: 'l1', title: 'Claves y relaciones', intro:
`La **clave primaria** (\`PRIMARY KEY\`) identifica cada fila de forma única y no admite NULL. La **clave foránea** (\`FOREIGN KEY\`) apunta a la clave primaria de otra tabla.

\`\`\`
CREATE TABLE alumnos (
  id INTEGER PRIMARY KEY,
  curso_id INTEGER REFERENCES cursos(id)
);
\`\`\`

Relaciones: **1:N** (un curso, muchos alumnos) se resuelve con una clave foránea en el lado "muchos". **N:M** (alumnos y cursos) necesita una **tabla intermedia**, como \`matriculas(alumno_id, curso_id)\`.`, ex: [
      mc('¿Para qué sirve una clave primaria?', ['Identificar cada fila de forma única', 'Ordenar la tabla', 'Cifrar los datos', 'Duplicar filas'], 0, 'Garantiza que ninguna fila se repite y permite referenciarla.'),
      fill('Declara la clave primaria.', 'CREATE TABLE cursos (id INTEGER ___ KEY, titulo TEXT);', ['PRIMARY', 'primary'], 'PRIMARY KEY marca la columna identificadora.'),
      mc('¿Cómo se modela una relación N:M entre alumnos y cursos?', ['Con una tabla intermedia', 'Con una columna de texto en alumnos', 'Con dos claves primarias en cursos', 'No se puede'], 0, 'La tabla intermedia guarda una fila por cada pareja alumno-curso.'),
      tf('En una relación 1:N, la clave foránea va en la tabla del lado "muchos".', true, 'Cada alumno guarda el id de su único curso.'),
      out('¿Cuántas matrículas tiene el curso 1?', MAT + '\n\nSELECT COUNT(*) FROM matriculas WHERE curso_id = 1;', '2', 'Las filas (1,1) y (2,1) pertenecen al curso 1.'),
      pair('Empareja cada concepto con su definición.', [['PRIMARY KEY', 'Identifica la fila'], ['FOREIGN KEY', 'Apunta a otra tabla'], ['1:N', 'Un curso, muchos alumnos'], ['Tabla intermedia', 'Resuelve la N:M']], 'Son los bloques básicos del diseño relacional.'),
    ]},
    { id: 'l2', title: 'Normalización', intro:
`**Normalizar** es organizar los datos para evitar repeticiones y errores.

* **1FN**: cada celda guarda un solo valor (nada de "SQL, Python" en una columna).
* **2FN**: cumple 1FN y cada columna depende de **toda** la clave (importa con claves compuestas).
* **3FN**: cumple 2FN y ninguna columna depende de otra que no sea la clave (ej.: \`ciudad\` y \`codigo_postal\` guardados junto al alumno).

Resultado: cada dato vive en un solo sitio.`, ex: [
      mc('Una columna "telefonos" contiene "600111222, 600333444". ¿Qué forma normal incumple?', ['1FN', '2FN', '3FN', 'Ninguna'], 0, 'La 1FN exige un único valor por celda.'),
      tf('Normalizar ayuda a evitar datos duplicados e inconsistentes.', true, 'Si cada dato vive en un solo sitio, no hay que actualizarlo en varios.'),
      fill('La tercera forma normal se abrevia ___.', 'Tercera forma normal = ___', ['3FN', '3NF'], 'Es la 3FN.'),
      mc('En pedidos(id, cliente, ciudad_cliente), ciudad_cliente depende de cliente y no de id. ¿Qué incumple?', ['3FN', '1FN', 'Ninguna', 'La clave primaria'], 0, 'Dependencia transitiva: se separa en una tabla clientes.'),
      order('Ordena las formas normales de la más básica a la más estricta.', ['1FN', '2FN', '3FN'], 'Cada forma incluye las condiciones de la anterior.'),
      pair('Empareja cada forma normal con su regla.', [['1FN', 'Un valor por celda'], ['2FN', 'Depende de toda la clave'], ['3FN', 'Sin dependencias transitivas']], 'Cada nivel añade una condición.'),
    ]},
    { id: 'l3', title: 'Reto: restricciones', intro:
`Las **restricciones** protegen la calidad de los datos:

\`\`\`
CREATE TABLE empleados (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  salario INTEGER CHECK (salario > 0),
  depto TEXT DEFAULT 'IT'
);
\`\`\`

\`NOT NULL\` prohíbe vacíos, \`UNIQUE\` evita repetidos, \`CHECK\` valida una condición y \`DEFAULT\` da un valor si no se indica. La base de datos rechaza lo que las incumple.`, ex: [
      mc('¿Qué restricción impide dos emails iguales?', ['UNIQUE', 'NOT NULL', 'DEFAULT', 'CHECK'], 0, 'UNIQUE rechaza valores repetidos en la columna.'),
      fill('Prohíbe valores vacíos.', 'nombre TEXT ___ NULL', ['NOT', 'not'], 'NOT NULL obliga a dar un valor.'),
      tf('CHECK (salario > 0) permite insertar un salario de -5.', false, 'CHECK rechaza las filas que no cumplen la condición.'),
      mc('¿Qué hace DEFAULT \'IT\' en una columna?', ['Usa IT si no se indica valor', 'Obliga a escribir IT', 'Borra los demás valores', 'Hace la columna única'], 0, 'Es el valor por defecto en los INSERT que no lo especifican.'),
      out('¿Cuántos alumnos distintos hay en matriculas?', MAT + '\n\nSELECT COUNT(DISTINCT alumno_id) FROM matriculas;', '3', 'Hay 4 filas, pero el alumno 1 aparece dos veces: 3 alumnos.'),
      pair('Empareja cada restricción con su efecto.', [['NOT NULL', 'No admite vacíos'], ['UNIQUE', 'No admite repetidos'], ['CHECK', 'Valida una condición'], ['DEFAULT', 'Valor por defecto']], 'Cada una protege un aspecto distinto.'),
    ]},
  ]},
  { id: 'u9', title: 'Transacciones, índices y rendimiento', desc: 'Datos seguros y consultas rápidas', lessons: [
    { id: 'l1', title: 'Transacciones y ACID', intro:
`Una **transacción** agrupa varias operaciones que deben ocurrir **todas o ninguna**.

\`\`\`
BEGIN;
UPDATE cuentas SET saldo = saldo - 30 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 30 WHERE id = 2;
COMMIT;
\`\`\`

\`COMMIT\` confirma los cambios; \`ROLLBACK\` los deshace. ACID resume sus garantías: **A**tomicidad, **C**onsistencia, a**I**slamiento y **D**urabilidad.`, ex: [
      mc('¿Qué garantiza la atomicidad?', ['Todas las operaciones se aplican o ninguna', 'Que las consultas sean rápidas', 'Que no haya NULL', 'Que los datos se cifren'], 0, 'Atomicidad: la transacción es indivisible.'),
      fill('Confirma los cambios de la transacción.', 'BEGIN; UPDATE cuentas SET saldo = 0 WHERE id = 1; ___;', ['COMMIT', 'commit'], 'COMMIT hace permanentes los cambios.'),
      tf('ROLLBACK deshace los cambios hechos desde BEGIN.', true, 'Vuelve al estado anterior a la transacción.'),
      out('¿Qué saldo tiene la cuenta 1 al final?', CUE + '\n\nBEGIN;\nUPDATE cuentas SET saldo = saldo - 30 WHERE id = 1;\nROLLBACK;\nSELECT saldo FROM cuentas WHERE id = 1;', '100', 'El ROLLBACK anula el UPDATE y el saldo sigue siendo 100.'),
      out('¿Qué saldo tiene la cuenta 2 al final?', CUE + '\n\nBEGIN;\nUPDATE cuentas SET saldo = saldo - 30 WHERE id = 1;\nUPDATE cuentas SET saldo = saldo + 30 WHERE id = 2;\nCOMMIT;\nSELECT saldo FROM cuentas WHERE id = 2;', '80', 'Con COMMIT la transferencia queda confirmada: 50 + 30 = 80.'),
      pair('Empareja cada letra de ACID con su idea.', [['Atomicidad', 'Todo o nada'], ['Consistencia', 'Respeta las reglas'], ['Aislamiento', 'Transacciones sin interferir'], ['Durabilidad', 'Lo confirmado persiste']], 'Son las cuatro garantías de una transacción.'),
    ]},
    { id: 'l2', title: 'Índices y EXPLAIN', intro:
`Un **índice** es como el índice de un libro: permite encontrar filas sin recorrer toda la tabla.

\`\`\`
CREATE INDEX idx_ciudad ON alumnos(ciudad);
\`\`\`

Acelera \`WHERE\`, \`JOIN\` y \`ORDER BY\` sobre esa columna, pero ocupa espacio y **ralentiza** \`INSERT\`, \`UPDATE\` y \`DELETE\`, porque hay que mantenerlo.

\`EXPLAIN\` muestra el **plan de ejecución**: si la base usa un índice o recorre todo (*full scan*).`, ex: [
      mc('¿Para qué sirve un índice?', ['Localizar filas más rápido', 'Guardar copias de seguridad', 'Evitar duplicados siempre', 'Cifrar la columna'], 0, 'Evita recorrer toda la tabla en las búsquedas.'),
      fill('Crea un índice sobre la columna ciudad.', 'CREATE ___ idx_ciudad ON alumnos(ciudad);', ['INDEX', 'index'], 'CREATE INDEX nombre ON tabla(columna).'),
      tf('Un índice acelera las lecturas pero puede ralentizar las escrituras.', true, 'Cada INSERT o UPDATE debe actualizar también el índice.'),
      mc('¿Qué muestra EXPLAIN?', ['El plan de ejecución de la consulta', 'Los datos de la tabla', 'La documentación de SQL', 'Los errores del servidor'], 0, 'Indica cómo piensa ejecutar la consulta el motor.'),
      mc('¿En qué columna conviene más un índice?', ['La que se usa mucho en WHERE de una tabla grande', 'Una columna que nunca se consulta', 'Todas las columnas de una tabla', 'Una columna de una tabla de 5 filas'], 0, 'Los índices rinden en columnas muy filtradas de tablas grandes.'),
      order('Ordena la sentencia para ver el plan.', ['EXPLAIN', 'SELECT', '*', 'FROM', 'alumnos', 'WHERE', "ciudad = 'Madrid';"], 'EXPLAIN se escribe delante de la consulta.'),
    ]},
    { id: 'l3', title: 'Reto: el problema N+1', intro:
`El **problema N+1** ocurre cuando una aplicación lanza 1 consulta para obtener N filas y luego **otra por cada fila**:

\`\`\`
SELECT * FROM autores;            -- 1 consulta
SELECT * FROM libros WHERE autor_id = ?;  -- N veces
\`\`\`

Con 100 autores son 101 consultas. La solución es traer todo de una vez con un \`JOIN\` o con \`WHERE autor_id IN (...)\`.

Ir y volver a la base de datos cuesta tiempo: menos viajes, más velocidad.`, ex: [
      mc('Una app lee 20 autores y luego hace una consulta de libros por cada uno. ¿Cuántas consultas son?', ['21', '20', '2', '40'], 0, 'Es 1 inicial + 20 una por autor: 21 (N+1).'),
      tf('Usar un JOIN puede evitar el problema N+1.', true, 'Un JOIN obtiene autores y libros en una sola consulta.'),
      mc('¿Por qué es mala la solución N+1?', ['Hace demasiados viajes a la base de datos', 'Devuelve datos incorrectos', 'No funciona con índices', 'Bloquea la tabla para siempre'], 0, 'Cada viaje tiene coste de red y de ejecución.'),
      out('¿Cuántos alumnos distintos hay en matriculas?', MAT + '\n\nSELECT COUNT(DISTINCT alumno_id) FROM matriculas;', '3', 'Un solo SELECT agrupado sustituye a una consulta por alumno.'),
      fill('Trae los libros de varios autores a la vez.', 'SELECT * FROM libros WHERE autor_id ___ (1, 2, 3);', ['IN', 'in'], 'IN sustituye a varias consultas con un solo viaje.'),
      pair('Empareja cada herramienta con su uso.', [['COMMIT', 'Confirma cambios'], ['ROLLBACK', 'Deshace cambios'], ['INDEX', 'Acelera búsquedas'], ['EXPLAIN', 'Muestra el plan']], 'Son las herramientas de la unidad.'),
    ]},
  ]},
  { id: 'u10', title: 'SQL en la práctica', desc: 'Vistas, fechas, NULL y seguridad', lessons: [
    { id: 'l1', title: 'Vistas y UNION', intro:
`Una **vista** guarda una consulta con nombre, como una tabla virtual:

\`\`\`
CREATE VIEW grandes AS
SELECT * FROM pedidos WHERE total >= 70;
\`\`\`

Después haces \`SELECT * FROM grandes\`. No guarda datos propios.

Para combinar resultados de dos consultas con las mismas columnas: \`UNION\` (sin repetidos), \`UNION ALL\` (con repetidos), \`INTERSECT\` (los comunes) y \`EXCEPT\` (los del primero que no están en el segundo).`, ex: [
      mc('¿Qué es una vista?', ['Una consulta guardada con nombre', 'Una copia de la tabla', 'Un índice', 'Una transacción'], 0, 'La vista se evalúa cada vez que se consulta.'),
      fill('Crea una vista.', 'CREATE ___ grandes AS SELECT * FROM pedidos WHERE total >= 70;', ['VIEW', 'view'], 'CREATE VIEW nombre AS consulta.'),
      tf('UNION elimina las filas repetidas; UNION ALL las conserva.', true, 'UNION ALL es además más rápido al no comparar.'),
      out('¿Cuántas filas tiene la vista grandes (total >= 70)?', PED + '\n\nCREATE VIEW grandes AS SELECT * FROM pedidos WHERE total >= 70;\nSELECT COUNT(*) FROM grandes;', '3', 'Cumplen 80, 70 y 120.'),
      out('¿Cuántos nombres devuelve este UNION?', EMP + '\n' + PED + '\n\nSELECT COUNT(*) FROM (\n  SELECT nombre FROM empleados\n  UNION\n  SELECT cliente FROM pedidos\n);', '6', 'Ana, Luis y Marta se repiten: hay 6 nombres distintos.'),
      out('¿Y con UNION ALL?', EMP + '\n' + PED + '\n\nSELECT COUNT(*) FROM (\n  SELECT nombre FROM empleados\n  UNION ALL\n  SELECT cliente FROM pedidos\n);', '11', 'No quita repetidos: 6 empleados + 5 pedidos.'),
    ]},
    { id: 'l2', title: 'NULL y fechas', intro:
`\`NULL\` es "valor desconocido": una comparación con NULL no es cierta ni falsa. Por eso \`curso_id <> 1\` **no** devuelve las filas con NULL.

\`COUNT(col)\` ignora los NULL; \`COUNT(*)\` cuenta filas. \`COALESCE(col, 0)\` sustituye NULL por un valor.

Las fechas se guardan como texto \`'2024-02-20'\` (ISO) y se comparan bien: \`WHERE fecha >= '2024-02-01'\`. Las funciones para extraer partes cambian según el motor; en SQLite: \`strftime('%Y-%m', fecha)\`.`, ex: [
      out('¿Qué devuelve COUNT(curso_id)?', ALU + '\n\nSELECT COUNT(curso_id) FROM alumnos;', '4', 'COUNT(columna) no cuenta NULL; Sara no cuenta.'),
      out('¿Cuántas filas cumplen curso_id <> 1?', ALU + '\n\nSELECT COUNT(*) FROM alumnos WHERE curso_id <> 1;', '2', 'Solo Luis (2) y Pedro (3); Sara tiene NULL y se descarta.'),
      out('¿Qué devuelve COALESCE para Sara?', ALU + "\n\nSELECT COALESCE(curso_id, 0) FROM alumnos\nWHERE nombre = 'Sara';", '0', 'COALESCE sustituye el NULL por 0.'),
      out('¿Cuántos pedidos son de febrero de 2024 o posteriores?', PED + "\n\nSELECT COUNT(*) FROM pedidos\nWHERE fecha >= '2024-02-01';", '3', 'Son los pedidos 3, 4 y 5.'),
      fill('Obtén año y mes de la fecha en SQLite.', "SELECT ___('%Y-%m', fecha) FROM pedidos;", ['strftime', 'STRFTIME'], 'strftime formatea fechas en SQLite.'),
      tf('NULL = NULL es verdadero en SQL.', false, 'Comparar con NULL da desconocido; se usa IS NULL.'),
    ]},
    { id: 'l3', title: 'Reto: inyección SQL y caso final', intro:
`La **inyección SQL** ocurre cuando se pega texto del usuario dentro de la consulta:

\`\`\`
"SELECT * FROM usuarios WHERE nombre = '" + entrada + "'"
\`\`\`

Si el usuario escribe \`' OR '1'='1\`, la condición siempre es cierta y ve todos los datos.

La defensa son las **consultas parametrizadas**: el SQL lleva marcadores (\`?\`) y los valores se envían aparte, así nunca se interpretan como código.

\`\`\`
SELECT * FROM usuarios WHERE nombre = ?
\`\`\``, ex: [
      mc('¿Cuál es la mejor defensa contra la inyección SQL?', ['Consultas parametrizadas', 'Poner el SQL en mayúsculas', 'Usar solo SELECT *', 'Ocultar el nombre de las tablas'], 0, 'Separan el código SQL de los datos del usuario.'),
      tf('Concatenar texto del usuario dentro de la consulta es seguro si es corto.', false, 'La longitud no importa; el texto puede cambiar el significado de la consulta.'),
      fill('Marca el valor como parámetro.', 'SELECT * FROM usuarios WHERE nombre = ___;', ['?'], 'El marcador ? se rellena después con el valor.'),
      order('Ordena la consulta parametrizada.', ['SELECT', '*', 'FROM', 'usuarios', 'WHERE', 'id', '=', '?;'], 'El valor se sustituye por ? y se envía aparte.'),
      out('Caso: ¿qué cliente gasta más (desempate por nombre)?', PED + '\n\nSELECT cliente FROM pedidos\nGROUP BY cliente\nORDER BY SUM(total) DESC, cliente\nLIMIT 1;', 'Ana', 'Ana y Marta suman 120; el desempate alfabético deja a Ana primera.'),
      out('Caso: ¿qué nombre aparece primero entre empleados que también son clientes?', EMP + '\n' + PED + '\n\nSELECT nombre FROM empleados\nINTERSECT\nSELECT cliente FROM pedidos\nORDER BY nombre\nLIMIT 1;', 'Ana', 'INTERSECT deja Ana, Luis y Marta; ordenados, Ana va primero.'),
    ]},
  ]},
);
})();
