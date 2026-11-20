(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, pair } = CQ.h;
CQ.content.go.units.push({ id: 'u6', title: 'Concurrencia', desc: 'Goroutines y canales', lessons: [
{ id: 'l1', title: 'Goroutines', intro: 'Una **goroutine** es una función que corre en paralelo. Se lanza con `go`.\n\n```\ngo saludar()\n```\n\nSon muy ligeras. Si `main` termina, el programa acaba aunque queden goroutines.', ex: [
 mc('¿Qué palabra lanza una goroutine?', ['go', 'async', 'thread', 'spawn'], 0, 'go f() la ejecuta en paralelo.'),
 fill('Lanza la función en paralelo', '___ saludar()', ['go'], 'Anteponer go.'),
 tf('Si main termina, las goroutines también terminan.', true, 'El programa acaba con main.'),
 mc('¿Cómo son las goroutines respecto a los hilos del sistema?', ['Más ligeras', 'Más pesadas', 'Iguales', 'Imposibles de usar'], 0, 'Go las gestiona con muy poco costo.'),
 pair('Ideas', [['go f()', 'Ejecuta en paralelo'], ['main', 'Función principal'], ['goroutine', 'Tarea ligera']], 'Conceptos básicos.')] },
{ id: 'l2', title: 'Canales', intro: 'Un **canal** comunica goroutines.\n\n```\nch := make(chan int)\ngo func() { ch <- 5 }()\nv := <-ch\n```\n\n`ch <- x` envía y `<-ch` recibe; ambos esperan a que el otro lado esté listo.', ex: [
 mc('¿Cómo se crea un canal de enteros?', ['make(chan int)', 'new chan int', 'chan(int)', 'channel<int>'], 0, 'Se crea con make.'),
 fill('Recibe un valor del canal', 'v := ___ch', ['<-'], '<-ch recibe.'),
 mc('¿Qué hace ch <- 5?', ['Envía 5 al canal', 'Recibe 5', 'Cierra el canal', 'Crea el canal'], 0, 'La flecha apunta hacia el canal.'),
 tf('Un canal sin búfer bloquea hasta que alguien recibe.', true, 'Sincroniza ambas goroutines.'),
 order('Envía y recibe', ['ch := make(chan int)', 'go func() { ch <- 5 }()', 'v := <-ch'], 'Crear, enviar en una goroutine y recibir.')] },
{ id: 'l3', title: 'Reto: WaitGroup', intro: '`sync.WaitGroup` espera a que terminen varias goroutines.\n\n```\nvar wg sync.WaitGroup\nwg.Add(1)\ngo func() { defer wg.Done(); work() }()\nwg.Wait()\n```', ex: [
 mc('¿Para qué sirve WaitGroup?', ['Esperar a varias goroutines', 'Crear canales', 'Leer archivos', 'Manejar errores'], 0, 'Wait bloquea hasta que todas terminen.'),
 fill('Marca la tarea como terminada', 'defer wg.___()', ['Done'], 'Done resta uno al contador.'),
 mc('¿Qué hace wg.Add(1)?', ['Registra una tarea pendiente', 'Termina una tarea', 'Espera', 'Crea un canal'], 0, 'Suma uno al contador.'),
 tf('wg.Wait() bloquea hasta que el contador llega a cero.', true, 'Así main espera.'),
 pair('sync', [['Add', 'Suma tareas'], ['Done', 'Termina una'], ['Wait', 'Espera todas']], 'Los tres métodos.')] }
]});
})();
