(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.html.units.push(
  // ───────────── UNIDAD 11 ─────────────
  { id: 'u11', title: 'Multimedia, SVG y formularios avanzados', desc: 'Audio, video, gráficos vectoriales y validación', lessons: [
    { id: 'l1', title: 'Audio, video e imágenes adaptables', intro: L(
'HTML reproduce medios sin plugins:',
'',
'```html',
'<video src="peli.mp4" controls poster="portada.jpg"></video>',
'<audio src="musica.mp3" controls></audio>',
'<picture>',
'  <source srcset="foto.webp" type="image/webp">',
'  <img src="foto.jpg" alt="Descripción" loading="lazy">',
'</picture>',
'```',
'',
'* `controls` muestra los botones de reproducción.',
'* `<picture>` + `<source>` ofrece formatos alternativos; `<img>` es el respaldo obligatorio.',
'* `loading="lazy"` difiere la carga de imágenes fuera de pantalla.',
'* `<figure>` con `<figcaption>` agrupa una imagen con su leyenda.'),
      ex: [
        mc('¿Qué atributo muestra los botones de reproducción de un video?', ['controls', 'play', 'buttons', 'show'], 0, 'Sin controls el video aparece sin botones, salvo que lo controles con JavaScript.'),
        mc('¿Qué etiqueta es el respaldo obligatorio dentro de <picture>?', ['<img>', '<source>', '<figure>', '<video>'], 0, 'Si el navegador no soporta ninguna <source>, usa la <img>.'),
        tf('loading="lazy" hace que las imágenes fuera de pantalla se carguen más tarde.', true, 'Ahorra datos y acelera la carga inicial de la página.'),
        fill('Agrupa la imagen con su leyenda', '<___>\n  <img src="a.jpg" alt="Gato">\n  <figcaption>Mi gato</figcaption>\n</___>', 'figure', '<figure> envuelve contenido autónomo y <figcaption> le pone texto.'),
        pair('Empareja la etiqueta con su uso', [['<video>', 'reproduce video'], ['<audio>', 'reproduce sonido'], ['<picture>', 'imágenes alternativas'], ['<figcaption>', 'leyenda de una figura']], 'Cada etiqueta cubre un tipo de contenido multimedia.'),
        mc('¿Qué atributo de <img> es esencial para la accesibilidad?', ['alt', 'title', 'id', 'class'], 0, 'alt describe la imagen a lectores de pantalla y se muestra si no carga.'),
      ] },
    { id: 'l2', title: 'Gráficos vectoriales con SVG', intro: L(
'**SVG** dibuja gráficos vectoriales que no pierden calidad al escalar y se pueden estilizar con CSS:',
'',
'```html',
'<svg width="120" height="80" viewBox="0 0 120 80">',
'  <rect x="10" y="10" width="40" height="30" fill="tomato" />',
'  <circle cx="90" cy="40" r="20" fill="steelblue" />',
'  <line x1="0" y1="70" x2="120" y2="70" stroke="black" />',
'</svg>',
'```',
'',
'* `viewBox="x y ancho alto"` define el sistema de coordenadas interno.',
'* `<circle>` usa `cx`, `cy` (centro) y `r` (radio); `<rect>` usa `x`, `y`, `width`, `height`.',
'* `<path d="...">` dibuja formas libres con comandos (`M` mover, `L` línea, `Z` cerrar).'),
      ex: [
        mc('¿Qué atributos de <circle> definen su centro?', ['cx y cy', 'x y y', 'left y top', 'center'], 0, 'cx y cy son las coordenadas del centro; r es el radio.'),
        mc('¿Qué ventaja principal tiene SVG sobre una imagen PNG?', ['Se escala sin perder calidad', 'Pesa siempre menos', 'Admite fotografías', 'No necesita navegador'], 0, 'Al ser vectorial, se redibuja a cualquier tamaño.'),
        fill('Define el sistema de coordenadas del SVG', '<svg ___="0 0 120 80"></svg>', 'viewBox', 'viewBox hace que el dibujo se adapte al tamaño del contenedor.'),
        tf('Un SVG se puede escribir directamente dentro del HTML.', true, 'Así puedes estilizarlo con CSS y manipularlo con JavaScript.'),
        pair('Empareja el elemento SVG con su forma', [['<circle>', 'círculo'], ['<rect>', 'rectángulo'], ['<line>', 'línea recta'], ['<path>', 'forma libre']], 'Con estas cuatro formas básicas se arman muchos íconos.'),
        mc('En un <path>, ¿qué hace el comando M?', ['Mueve el punto de inicio', 'Dibuja un círculo', 'Cierra la forma', 'Cambia el color'], 0, 'M x y "levanta el lápiz" y lo coloca en esa posición; L dibuja una línea hasta otra.'),
      ] },
    { id: 'l3', title: 'Reto: validación y controles modernos', intro: L(
'HTML valida formularios **sin JavaScript**:',
'',
'* `required` · `type="email"` · `minlength`, `maxlength` · `min`, `max` (números y fechas) · `pattern="[0-9]{4}"` (expresión regular).',
'* `<datalist>` ofrece sugerencias a un `<input list="id">`.',
'* `<details><summary>` crea un bloque desplegable; `<dialog>` una ventana modal nativa.',
'',
'La validación del navegador **no sustituye** a la del servidor: el usuario puede saltársela.'),
      ex: [
        mc('¿Qué atributo impide enviar un campo vacío?', ['required', 'validate', 'notempty', 'mandatory'], 0, 'required bloquea el envío hasta que el campo tenga valor.'),
        mc('¿Qué atributo valida el texto con una expresión regular?', ['pattern', 'regex', 'match', 'format'], 0, 'Por ejemplo pattern="[0-9]{4}" exige exactamente 4 dígitos.'),
        fill('Ofrece sugerencias al campo', '<input list="paises">\n<___ id="paises">\n  <option value="Colombia">\n</___>', 'datalist', '<datalist> contiene las opciones sugeridas que el input enlaza con list.'),
        tf('La validación del navegador es suficiente para proteger un servidor.', false, 'Se puede evitar con herramientas de desarrollo: siempre valida también en el servidor.'),
        pair('Empareja la etiqueta con su función', [['<details>', 'bloque desplegable'], ['<summary>', 'título del desplegable'], ['<dialog>', 'ventana modal nativa'], ['<datalist>', 'sugerencias para un input']], 'Son controles nativos que antes requerían JavaScript.'),
        mc('¿Qué type de input valida el formato de un correo?', ['email', 'mail', 'text', 'address'], 0, 'type="email" comprueba que haya una @ y una estructura básica válida.'),
      ] },
  ]}
);
})();
