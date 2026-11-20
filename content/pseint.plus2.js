(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.pseint.units.push(
  // ───────────── UNIDAD 4 ─────────────
  { id: 'u4', title: 'Algoritmos clásicos', desc: 'Factorial, primos, búsqueda, ordenamiento y recursión', lessons: [
    { id: 'l1', title: 'Factorial, dígitos y primos', intro: L(
'Tres problemas clásicos que se resuelven con ciclos:',
'',
'* **Factorial**: multiplicar `1 · 2 · ... · n` acumulando en una variable que empieza en 1.',
'* **Suma de dígitos**: con `n MOD 10` obtienes el último dígito y con `trunc(n / 10)` lo quitas.',
'* **Número primo**: tiene exactamente **2 divisores** (1 y él mismo). Cuenta cuántos `i` cumplen `n MOD i = 0`.',
'',
'Un acumulador debe **inicializarse** antes del ciclo: 0 para sumas, 1 para productos.'),
      ex: [
        out('¿Qué escribe?', L('Algoritmo f', '  Definir r, i Como Entero', '  r <- 1', '  Para i <- 1 Hasta 5 Con Paso 1 Hacer', '    r <- r * i', '  FinPara', '  Escribir r', 'FinAlgoritmo'), '120', '1·2·3·4·5 = 120.'),
        out('¿Qué escribe?', L('Algoritmo d', '  Definir n, s Como Entero', '  n <- 1234', '  s <- 0', '  Mientras n > 0 Hacer', '    s <- s + n MOD 10', '    n <- trunc(n / 10)', '  FinMientras', '  Escribir s', 'FinAlgoritmo'), '10', 'Suma 4 + 3 + 2 + 1 = 10.'),
        mc('¿Qué operador da el resto de una división?', ['MOD (o %)', 'DIV', 'RESTO', '//'], 0, 'n MOD d es el resto de dividir n entre d.'),
        out('¿Cuántos divisores cuenta?', L('Algoritmo p', '  Definir i, c Como Entero', '  c <- 0', '  Para i <- 1 Hasta 7 Con Paso 1 Hacer', '    Si 7 MOD i = 0 Entonces', '      c <- c + 1', '    FinSi', '  FinPara', '  Escribir c', 'FinAlgoritmo'), '2', '7 solo es divisible entre 1 y 7: es primo.'),
        tf('Para calcular un producto, el acumulador debe empezar en 0.', false, 'Empezaría en 1; con 0 todo el producto daría 0.'),
        fill('Repite mientras queden dígitos', 'Mientras n ___ 0 Hacer', '>', 'El ciclo continúa mientras n sea mayor que 0.'),
      ] },
    { id: 'l2', title: 'Búsqueda y ordenamiento', intro: L(
'* **Búsqueda lineal**: recorrer el arreglo comparando cada posición con el valor buscado hasta encontrarlo.',
'* **Ordenamiento burbuja**: en cada pasada compara **pares vecinos** y los intercambia si están en mal orden; tras cada pasada el mayor "sube" a su lugar final.',
'* Para intercambiar dos valores necesitas una variable **auxiliar**: `aux <- a[i]; a[i] <- a[j]; a[j] <- aux`.',
'',
'Recuerda que en PSeInt los arreglos empiezan en la posición **1**.'),
      ex: [
        mc('¿Qué compara el ordenamiento burbuja en cada paso?', ['Dos elementos vecinos', 'El primero con el último', 'Todos con el mayor', 'Solo los pares'], 0, 'Va intercambiando vecinos desordenados hasta que el arreglo queda ordenado.'),
        out('¿En qué posición encuentra el valor?', L('Algoritmo b', '  Dimension a[3]', '  Definir i, pos Como Entero', '  a[1] <- 5', '  a[2] <- 8', '  a[3] <- 2', '  pos <- 0', '  Para i <- 1 Hasta 3 Con Paso 1 Hacer', '    Si a[i] = 2 Entonces', '      pos <- i', '    FinSi', '  FinPara', '  Escribir pos', 'FinAlgoritmo'), '3', 'El 2 está en la tercera posición.'),
        mc('¿Para qué sirve la variable auxiliar al intercambiar?', ['Para no perder uno de los valores durante el intercambio', 'Para ahorrar memoria', 'Para contar pasadas', 'No sirve'], 0, 'Sin ella, a[i] <- a[j] borraría el valor original de a[i].'),
        tf('En PSeInt el primer elemento de un arreglo está en la posición 0.', false, 'Por defecto empieza en 1 (se puede cambiar en la configuración).'),
        order('Ordena el intercambio de a[i] y a[j]', ['aux <- a[i]', 'a[i] <- a[j]', 'a[j] <- aux'], 'Primero se guarda uno en aux, luego se copia el otro y al final se recupera el guardado.'),
        out('¿Qué escribe?', L('Algoritmo m', '  Dimension a[3]', '  Definir i, mayor Como Entero', '  a[1] <- 4', '  a[2] <- 9', '  a[3] <- 6', '  mayor <- a[1]', '  Para i <- 2 Hasta 3 Con Paso 1 Hacer', '    Si a[i] > mayor Entonces', '      mayor <- a[i]', '    FinSi', '  FinPara', '  Escribir mayor', 'FinAlgoritmo'), '9', 'Se guarda el mayor visto hasta el momento: 4, luego 9, y 6 no lo supera.'),
      ] },
    { id: 'l3', title: 'Reto: funciones y recursión', intro: L(
'Una **función** devuelve un valor y se define con `Funcion resultado <- nombre(parametros)`:',
'',
'```',
'Funcion r <- factorial(n)',
'  Si n <= 1 Entonces',
'    r <- 1',
'  SiNo',
'    r <- n * factorial(n - 1)',
'  FinSi',
'FinFuncion',
'```',
'',
'Una función **recursiva** se llama a sí misma y necesita un **caso base** que detenga las llamadas.'),
      ex: [
        out('¿Qué escribe?', L('Funcion r <- fib(n)', '  Si n <= 2 Entonces', '    r <- 1', '  SiNo', '    r <- fib(n - 1) + fib(n - 2)', '  FinSi', 'FinFuncion', 'Algoritmo t', '  Escribir fib(6)', 'FinAlgoritmo'), '8', 'La serie 1, 1, 2, 3, 5, 8: el sexto término es 8.'),
        mc('¿Qué es el caso base de una función recursiva?', ['La condición que detiene las llamadas', 'La primera llamada', 'El valor que devuelve siempre', 'Un comentario'], 0, 'Sin caso base la función se llamaría infinitamente.'),
        tf('Una función recursiva es una función que se llama a sí misma.', true, 'Cada llamada resuelve un problema más pequeño hasta llegar al caso base.'),
        fill('Escribe la llamada recursiva del factorial', 'r <- n * factorial(___)', 'n - 1', 'El factorial de n es n por el factorial de n - 1.'),
        pair('Empareja el concepto con su descripción', [['Funcion', 'devuelve un valor'], ['SubProceso', 'puede no devolver valor'], ['Caso base', 'detiene la recursión'], ['Parámetro', 'dato que recibe la función']], 'Son los conceptos clave para dividir un algoritmo en partes.'),
      ] },
  ]}
);
})();
