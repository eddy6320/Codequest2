(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, pair } = CQ.h;
const J = (...l) => l.join('\n');
CQ.content.pseint = { id: 'pseint', name: 'PSeInt', emoji: '📝', color: '#16a085', tagline: 'Pseudocódigo para empezar a pensar como programador', runner: null, units: [
{ id: 'u1', title: 'Primeros pasos', desc: 'Algoritmos, variables y datos', lessons: [
 { id: 'l1', title: 'Tu primer algoritmo', intro: J('**PSeInt** es una herramienta para escribir **pseudocódigo**: instrucciones en español que describen un algoritmo antes de pasarlo a un lenguaje real.', '', '```', 'Algoritmo Saludo', '    Escribir "Hola, mundo";', 'FinAlgoritmo', '```', '', 'Todo programa empieza con `Algoritmo` (o `Proceso`) y termina con `FinAlgoritmo` (o `FinProceso`). Cada instrucción acaba en `;` y `Escribir` muestra texto en pantalla.'), ex: [
  mc('¿Qué instrucción muestra texto en pantalla?', ['Leer', 'Escribir', 'Definir', 'Mostrar'], 1, 'Escribir imprime en pantalla.'),
  mc('¿Con qué palabra termina un Algoritmo?', ['Fin', 'FinProceso', 'FinAlgoritmo', 'Salir'], 2, 'Cada Algoritmo se cierra con FinAlgoritmo.'),
  fill('Muestra el mensaje', 'Algoritmo Hola\n    ___ "Hola";\nFinAlgoritmo', ['Escribir', 'escribir'], 'Escribir muestra el texto.'),
  tf('En PSeInt cada instrucción termina con punto y coma (;).', true, 'El ; separa las instrucciones.'),
  order('Ordena el algoritmo', ['Algoritmo Hola', 'Escribir "Hola";', 'FinAlgoritmo'], 'Inicio, instrucciones y cierre.'),
  pair('Palabras clave', [['Algoritmo', 'Inicia el programa'], ['Escribir', 'Muestra en pantalla'], ['FinAlgoritmo', 'Cierra el programa']], 'Cada palabra tiene su función.')] },
 { id: 'l2', title: 'Variables y tipos', intro: J('Una **variable** guarda un dato. Se declara con `Definir` y se le da valor con la flecha `<-`.', '', '```', 'Definir edad Como Entero;', 'edad <- 15;', '```', '', 'Tipos principales: `Entero` (5), `Real` (2.5), `Cadena` o `Texto` ("hola") y `Logico` (Verdadero/Falso).'), ex: [
  mc('¿Qué símbolo asigna un valor a una variable?', ['=', '<-', '==', ':='], 1, 'En PSeInt se asigna con <-.'),
  mc('¿Qué tipo guarda 3.14?', ['Entero', 'Real', 'Cadena', 'Logico'], 1, 'Los decimales son Real.'),
  fill('Declara una variable entera', 'Definir n ___ Entero;', ['Como', 'como'], 'Definir variable Como Tipo.'),
  fill('Asigna 10 a x', 'x ___ 10;', '<-', 'La flecha <- asigna.'),
  tf('"hola" es de tipo Entero.', false, 'Es una Cadena (texto).'),
  pair('Tipos', [['Entero', '7'], ['Real', '2.5'], ['Cadena', '"gato"'], ['Logico', 'Verdadero']], 'Cada dato tiene su tipo.')] },
 { id: 'l3', title: 'Reto: leer y operar', intro: J('`Leer` pide un dato al usuario y lo guarda en una variable.', '', '```', 'Escribir "Edad:";', 'Leer edad;', 'Escribir edad + 1;', '```', '', 'Operadores: `+ - * /`, `^` (potencia) y `MOD` (resto).'), ex: [
  mc('¿Qué instrucción pide un dato al usuario?', ['Escribir', 'Leer', 'Pedir', 'Entrada'], 1, 'Leer guarda lo que escribe el usuario.'),
  mc('¿Cuánto vale 7 MOD 2?', ['3', '1', '0', '2'], 1, 'MOD devuelve el resto: 7 entre 2 sobra 1.'),
  mc('¿Qué muestra?', ['5', '6', '8', '9'], 2, '2 + 3 * 2 = 8: primero se multiplica.', 'Escribir 2 + 3 * 2;'),
  fill('Eleva 2 al cubo', 'Escribir 2 ___ 3;', '^', '^ es la potencia: 2^3 = 8.'),
  order('Pide un nombre y salúdalo', ['Algoritmo Saludo', 'Leer nombre;', 'Escribir "Hola ", nombre;', 'FinAlgoritmo'], 'Inicio, lectura, uso y cierre.')] }]},
{ id: 'u2', title: 'Decisiones y ciclos', desc: 'Si, Mientras y Para', lessons: [
 { id: 'l1', title: 'Condicionales', intro: J('`Si` ejecuta un bloque solo cuando la condición es verdadera. `SiNo` cubre el resto.', '', '```', 'Si edad >= 18 Entonces', '    Escribir "Adulto";', 'SiNo', '    Escribir "Menor";', 'FinSi', '```', '', 'Comparar usa `=` (igual), `<>` (distinto), `<`, `>`, `<=`, `>=`. Se combinan con `Y`, `O` y `NO`.'), ex: [
  mc('¿Qué operador significa "distinto"?', ['!=', '<>', '=/=', '#'], 1, 'En PSeInt distinto es <>.'),
  mc('¿Con qué se cierra un Si?', ['FinSi', 'Fin', 'FinCondicion', 'Entonces'], 0, 'Si ... FinSi.'),
  fill('Completa el condicional', 'Si x > 5 ___\n    Escribir "grande";\nFinSi', ['Entonces', 'entonces'], 'Si cond Entonces.'),
  tf('Para comparar igualdad en una condición se usa =.', true, '<- es asignación; = compara.'),
  order('Ordena el condicional', ['Si n > 0 Entonces', 'Escribir "positivo";', 'SiNo', 'Escribir "no positivo";', 'FinSi'], 'Si, bloque, SiNo, bloque y FinSi.'),
  pair('Lógicos', [['Y', 'Ambas verdaderas'], ['O', 'Al menos una'], ['NO', 'Invierte']], 'Operadores lógicos.')] },
 { id: 'l2', title: 'Mientras y Repetir', intro: J('`Mientras` repite **mientras** la condición sea verdadera (puede no ejecutarse nunca). `Repetir` ejecuta primero y revisa después, por lo que corre **al menos una vez**.', '', '```', 'Mientras n < 3 Hacer', '    n <- n + 1;', 'FinMientras', '```', '', '```', 'Repetir', '    n <- n + 1;', 'Hasta Que n = 3', '```'), ex: [
  mc('¿Qué ciclo siempre se ejecuta al menos una vez?', ['Mientras', 'Repetir', 'Para', 'Ninguno'], 1, 'Repetir revisa la condición al final.'),
  fill('Cierra el ciclo', 'Mientras n < 3 Hacer\n    n <- n + 1;\n___', ['FinMientras', 'finmientras'], 'Mientras ... FinMientras.'),
  tf('Mientras puede no ejecutarse ninguna vez.', true, 'Si la condición es falsa desde el inicio, no entra.'),
  mc('Repetir termina cuando...', ['la condición del Hasta Que es verdadera', 'la condición es falsa', 'pasan 3 vueltas', 'nunca'], 0, 'Repite hasta que la condición se cumple.'),
  order('Ordena el ciclo', ['Mientras n < 3 Hacer', 'n <- n + 1;', 'FinMientras'], 'Condición, cuerpo y cierre.')] },
 { id: 'l3', title: 'Reto: ciclo Para', intro: J('`Para` repite un número conocido de veces.', '', '```', 'Para i <- 1 Hasta 5 Con Paso 1 Hacer', '    Escribir i;', 'FinPara', '```', '', 'Escribe 1, 2, 3, 4, 5. Si omites `Con Paso`, avanza de 1 en 1.'), ex: [
  mc('¿Cuántas veces se repite?', ['3', '4', '5', '6'], 2, 'De 1 a 5 son 5 vueltas.', 'Para i <- 1 Hasta 5 Hacer\n    Escribir i;\nFinPara'),
  fill('Cierra el ciclo', 'Para i <- 1 Hasta 3 Hacer\n    Escribir i;\n___', ['FinPara', 'finpara'], 'Para ... FinPara.'),
  mc('¿Cuándo conviene usar Para?', ['Cuando sabes cuántas vueltas', 'Cuando no sabes', 'Nunca', 'Solo con texto'], 0, 'Para sirve para repeticiones contadas.'),
  tf('En Para i <- 1 Hasta 5 el valor 5 también se repite.', true, 'Hasta incluye el límite.'),
  pair('Ciclos', [['Para', 'Vueltas conocidas'], ['Mientras', 'Revisa antes'], ['Repetir', 'Revisa después']], 'Elige según el caso.')] }]}
]};
})();
