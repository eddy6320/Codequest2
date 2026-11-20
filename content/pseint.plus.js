(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, pair } = CQ.h;
CQ.content.pseint.units.push({ id: 'u3', title: 'Arreglos, Segun y subprocesos', desc: 'Organiza tus algoritmos', lessons: [
{ id: 'l1', title: 'Arreglos', intro: 'Un **arreglo** guarda varios datos bajo un mismo nombre. Se crea con `Dimension` y se accede con corchetes. En PSeInt los índices empiezan en **1**.\n\n```\nDimension notas[3];\nnotas[1] <- 8;\n```', ex: [
 mc('¿Cómo se crea un arreglo de 5 posiciones llamado a?', ['Dimension a[5];', 'Arreglo a(5);', 'Lista a[5];', 'Crear a[5];'], 0, 'Dimension nombre[tamaño];'),
 mc('Por defecto, ¿en qué índice empieza un arreglo en PSeInt?', ['0', '1', '2', '-1'], 1, 'La primera posición es la 1.'),
 fill('Guarda 10 en la primera posición', 'Dimension a[3];\na[___] <- 10;', ['1'], 'La primera posición es a[1].'),
 tf('Un arreglo puede guardar varios valores con un solo nombre.', true, 'Ese es su propósito.'),
 order('Llena el arreglo con un Para', ['Dimension a[3];', 'Para i <- 1 Hasta 3 Hacer', 'a[i] <- i * 2;', 'FinPara'], 'Declarar, recorrer y asignar.')] },
{ id: 'l2', title: 'Segun (selección múltiple)', intro: '`Segun` elige entre varios valores posibles.\n\n```\nSegun op Hacer\n    1: Escribir "Suma";\n    2: Escribir "Resta";\n    De Otro Modo: Escribir "Inválida";\nFinSegun\n```', ex: [
 mc('¿Cuándo se ejecuta De Otro Modo?', ['Cuando ningún caso coincide', 'Siempre', 'Al inicio', 'Nunca'], 0, 'Es el caso por defecto.'),
 mc('¿Con qué se cierra un Segun?', ['FinSegun', 'FinSi', 'Fin', 'FinCaso'], 0, 'Segun ... FinSegun.'),
 fill('Completa el caso por defecto', 'De Otro ___: Escribir "?";', ['Modo'], 'De Otro Modo.'),
 tf('Segun sirve para elegir entre varios valores de una misma variable.', true, 'Evita muchos Si anidados.'),
 pair('Estructuras', [['Si', 'Una condición'], ['Segun', 'Varios valores'], ['Para', 'Vueltas contadas']], 'Cada una resuelve un caso.')] },
{ id: 'l3', title: 'Reto: subprocesos', intro: 'Un **SubProceso** es una función: recibe datos y devuelve un resultado.\n\n```\nSubProceso r <- Doble(n)\n    r <- n * 2;\nFinSubProceso\n```', ex: [
 mc('¿Para qué sirve un SubProceso?', ['Reutilizar un bloque de código', 'Repetir vueltas', 'Declarar tipos', 'Leer datos'], 0, 'Agrupa pasos reutilizables.'),
 fill('Cierra el subproceso', 'SubProceso r <- Doble(n)\n    r <- n * 2;\n___', ['FinSubProceso'], 'SubProceso ... FinSubProceso.'),
 mc('En SubProceso r <- Doble(n), ¿cuál es la variable que devuelve?', ['r', 'n', 'Doble', 'ninguna'], 0, 'Lo que está a la izquierda de <-.'),
 tf('Un subproceso puede recibir parámetros.', true, 'Por ejemplo n.'),
 order('Ordena el subproceso', ['SubProceso r <- Triple(n)', 'r <- n * 3;', 'FinSubProceso'], 'Cabecera, cuerpo y cierre.')] }
]});
})();
