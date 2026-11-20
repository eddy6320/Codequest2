/* CodeQuest - constructores de ejercicios. Se carga antes que los archivos de contenido. */
(function (root) {
  const CQ = (root.CQ = root.CQ || {});
  CQ.content = CQ.content || {};
  CQ.roadmap = CQ.roadmap || [];
  CQ.h = {
    // Opción múltiple. a = índice de la opción correcta. code = bloque de código opcional.
    mc: (q, o, a, e, code) => ({ k: 'mc', q, o, a, e, code }),
    // Verdadero / Falso (se convierte en mc). a = true | false
    tf: (q, a, e, code) => ({ k: 'mc', q, o: ['Verdadero', 'Falso'], a: a ? 0 : 1, e, code }),
    // Completar el código. code contiene ___ ; a = respuesta o lista de respuestas válidas.
    fill: (q, code, a, e) => ({ k: 'fill', q, code, a: [].concat(a), e }),
    // Ordenar fichas. t = fichas EN EL ORDEN CORRECTO (la app las mezcla).
    order: (q, t, e) => ({ k: 'order', q, t, e }),
    // ¿Qué imprime este código? El usuario escribe la salida. a = salida (o lista de salidas válidas).
    out: (q, code, a, e) => ({ k: 'out', q, code, a: [].concat(a), e }),
    // Emparejar. pairs = [[izq, der], ...] (3 a 5 pares)
    pair: (q, pairs, e) => ({ k: 'pair', q, pairs, e }),
    // Escribir código que se ejecuta. tests = [[expresión, resultadoJSON], ...]
    // Ej: run('Escribe suma(a,b)', 'def suma(a, b):\n    ', [['suma(2,3)','5']], expl, solucion)
    run: (q, starter, tests, e, sol) => ({ k: 'run', q, starter, tests, e, sol }),
  };
})(typeof window !== 'undefined' ? window : globalThis);
