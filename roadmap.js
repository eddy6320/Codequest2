/* Lenguajes planificados (aparecen como "Próximamente"). Para publicar uno: crea content/<id>.js
   siguiendo CONTENT_SPEC.md, agrégalo a index.html y a sw.js, y quítalo de esta lista. */
(window.CQ = window.CQ || { content: {}, roadmap: [] });
CQ.roadmap.push(
  { id: 'swift', name: 'Swift', emoji: '🕊️', color: '#f05138', units: ['Primeros pasos', 'Opcionales', 'Structs y clases', 'Protocolos y genéricos', 'Concurrencia'] },
  { id: 'ruby', name: 'Ruby', emoji: '💎', color: '#cc342d', units: ['Primeros pasos', 'Colecciones y bloques', 'Clases y módulos', 'Metaprogramación suave', 'Testing'] },
  { id: 'r', name: 'R', emoji: '📊', color: '#276dc3', units: ['Primeros pasos', 'Vectores y data frames', 'Visualización', 'Estadística básica'] },
  { id: 'dart', name: 'Dart', emoji: '🎯', color: '#0175c2', units: ['Primeros pasos', 'Clases y null safety', 'Colecciones', 'Async y streams'] }
);
