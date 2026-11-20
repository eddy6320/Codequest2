(window.CQ = window.CQ || { content: {}, roadmap: [] });
{
const { mc, tf, fill, order, out, pair, run } = CQ.h;

CQ.content.html = {
  id: 'html', name: 'HTML y CSS', emoji: '🌐', color: '#e34c26',
  tagline: 'Construye y da estilo a páginas web',
  runner: null,
  units: [
    { id: 'u1', title: 'Estructura de una página', desc: 'Etiquetas, head y body', lessons: [
      { id: 'l1', title: 'Etiquetas y elementos', intro:
`**HTML** describe el contenido de una página con **etiquetas**. Casi todas van en pareja: una de apertura y otra de cierre con \`/\`.

\`\`\`
<p>Hola, mundo</p>
\`\`\`

Apertura + contenido + cierre forman un **elemento**. Algunas etiquetas no tienen contenido ni cierre, como \`<br>\` (salto de línea) o \`<img>\`. Los elementos pueden anidarse: uno dentro de otro, cerrando primero el más interno.`, ex: [
        mc('¿Cómo se cierra un elemento <p>?', ['</p>', '<p/>', '<end p>', '<\\p>'], 0, 'La etiqueta de cierre lleva una barra antes del nombre.'),
        fill('Completa la etiqueta de cierre del párrafo.', '<p>Hola</___>', 'p', 'Se cierra con </p>.'),
        tf('<br> es una etiqueta que no necesita etiqueta de cierre.', true, 'Es una etiqueta vacía: no tiene contenido.'),
        order('Ordena las fichas para formar un párrafo.', ['<p>', 'Hola', '</p>'], 'Apertura, contenido y cierre.'),
        pair('Empareja cada etiqueta con su función.', [['<p>', 'Párrafo'], ['<h1>', 'Título principal'], ['<br>', 'Salto de línea'], ['<hr>', 'Línea horizontal']], 'Cada etiqueta tiene un significado.'),
        mc('¿Cuál es un anidado correcto?', ['<p><b>Hola</b></p>', '<p><b>Hola</p></b>', '<b><p>Hola</b></p>', '<p><b>Hola</p>'], 0, 'La etiqueta que se abre última debe cerrarse primero.'),
      ]},
      { id: 'l2', title: 'El esqueleto: head y body', intro:
`Todas las páginas comparten la misma estructura:

\`\`\`
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Mi página</title>
  </head>
  <body>
    <h1>Hola</h1>
  </body>
</html>
\`\`\`

\`<head>\` guarda información sobre la página (título, codificación) que no se ve en ella. \`<body>\` contiene lo que se muestra. \`<title>\` aparece en la pestaña del navegador.`, ex: [
        mc('¿Qué contiene <body>?', ['El contenido visible de la página', 'Solo el título de la pestaña', 'La codificación de caracteres', 'Los comentarios'], 0, 'Todo lo que ves en la página va dentro de <body>.'),
        fill('Pon el título de la pestaña del navegador.', '<head><___>Mi web</title></head>', 'title', 'El texto de <title> aparece en la pestaña.'),
        tf('El contenido de <title> se muestra dentro de la página, bajo el menú.', false, 'Se muestra en la pestaña del navegador, no en la página.'),
        order('Ordena el esqueleto básico.', ['<html>', '<head>', '</head>', '<body>', '</body>', '</html>'], 'head va antes que body y ambos dentro de html.'),
        fill('Indica el idioma de la página.', '<html ___="es">', 'lang', 'El atributo lang declara el idioma.'),
        pair('Empareja cada parte con su función.', [['<!DOCTYPE html>', 'Indica que es HTML5'], ['<head>', 'Información de la página'], ['<body>', 'Contenido visible'], ['<meta charset="UTF-8">', 'Codificación de caracteres']], 'Estas piezas forman el esqueleto de toda página.'),
      ]},
      { id: 'l3', title: 'Reto: atributos y comentarios', intro:
`Las etiquetas pueden llevar **atributos**: pares \`nombre="valor"\` dentro de la etiqueta de apertura.

\`\`\`
<p id="intro" class="destacado">Hola</p>
\`\`\`

\`id\` identifica un elemento único; \`class\` agrupa varios. Los comentarios no se muestran:

\`\`\`
<!-- Esto es un comentario -->
\`\`\`

Además, \`<div>\` es un contenedor genérico de bloque y \`<span>\`, uno genérico en línea.`, ex: [
        mc('¿Dónde se escriben los atributos?', ['En la etiqueta de apertura', 'En la etiqueta de cierre', 'Entre las etiquetas, como texto', 'Dentro de <head> siempre'], 0, 'Van en la apertura: <p id="x">.'),
        fill('Completa el comentario HTML.', '<!-- Mi comentario ___', '-->', 'Un comentario se cierra con -->.'),
        tf('Un comentario HTML se muestra en la página.', false, 'Los comentarios son para el programador y el navegador no los muestra.'),
        order('Ordena un párrafo con la clase "aviso".', ['<p', 'class="aviso"', '>', 'Cuidado', '</p>'], 'El atributo va dentro de la etiqueta de apertura.'),
        mc('¿Qué diferencia hay entre id y class?', ['id debe ser único; class puede repetirse', 'class debe ser único; id puede repetirse', 'No hay diferencia', 'id solo vale para imágenes'], 0, 'Un id identifica un solo elemento; una clase agrupa varios.'),
        pair('Empareja cada elemento con su tipo.', [['<div>', 'Contenedor de bloque'], ['<span>', 'Contenedor en línea'], ['class', 'Atributo para agrupar'], ['id', 'Atributo identificador único']], 'div y span no tienen significado propio; sirven para agrupar.'),
      ]},
    ]},
    { id: 'u2', title: 'Texto, enlaces e imágenes', desc: 'El contenido de la página', lessons: [
      { id: 'l1', title: 'Texto y títulos', intro:
`Hay seis niveles de títulos, de \`<h1>\` (el más importante) a \`<h6>\`. Usa un solo \`<h1>\` por página.

\`\`\`
<h1>Título</h1>
<p>Un párrafo con <strong>negrita</strong> y <em>cursiva</em>.</p>
\`\`\`

\`<strong>\` marca importancia (se ve en negrita) y \`<em>\` énfasis (cursiva). Las etiquetas indican el **significado**; el aspecto visual se controla con CSS.`, ex: [
        mc('¿Qué título es el más importante?', ['<h1>', '<h6>', '<h3>', '<title>'], 0, 'h1 es el nivel más alto; h6 el más bajo.'),
        fill('Pon "importante" en negrita semántica.', '<p>Es <___>importante</strong></p>', 'strong', 'strong marca importancia y suele verse en negrita.'),
        tf('<em> se suele mostrar en cursiva.', true, 'em marca énfasis y los navegadores lo muestran en cursiva.'),
        order('Ordena un título y un párrafo.', ['<h1>', 'Bienvenido', '</h1>', '<p>', 'Hola', '</p>'], 'Cada elemento con su apertura y cierre.'),
        pair('Empareja cada etiqueta con su resultado.', [['<strong>', 'Negrita'], ['<em>', 'Cursiva'], ['<h2>', 'Subtítulo'], ['<br>', 'Salto de línea']], 'Cada etiqueta de texto tiene un significado.'),
        mc('¿Cuántos <h1> se recomienda tener por página?', ['Uno', 'Seis', 'Ninguno', 'Los que se quiera'], 0, 'El h1 es el título principal y debe ser único.'),
      ]},
      { id: 'l2', title: 'Enlaces e imágenes', intro:
`Los enlaces usan \`<a>\` con el atributo \`href\` (destino):

\`\`\`
<a href="https://ejemplo.com">Visítanos</a>
\`\`\`

Las imágenes usan \`<img>\`, que no lleva cierre. \`src\` es la ruta y \`alt\` el texto alternativo (para lectores de pantalla o si falla la carga):

\`\`\`
<img src="gato.jpg" alt="Un gato naranja">
\`\`\`

Con \`target="_blank"\` el enlace se abre en una pestaña nueva.`, ex: [
        fill('Indica el destino del enlace.', '<a ___="https://ejemplo.com">Ir</a>', 'href', 'href contiene la dirección de destino.'),
        mc('¿Para qué sirve el atributo alt de <img>?', ['Dar un texto alternativo a la imagen', 'Cambiar el tamaño', 'Indicar la ruta del archivo', 'Poner un borde'], 0, 'alt describe la imagen si no carga y ayuda a la accesibilidad.'),
        fill('Indica la ruta de la imagen.', '<img ___="gato.jpg" alt="Gato">', 'src', 'src es la ruta del archivo de imagen.'),
        tf('<img> necesita una etiqueta de cierre </img>.', false, 'img es una etiqueta vacía y no se cierra.'),
        order('Ordena un enlace a ejemplo.com con el texto "Ir".', ['<a', 'href="https://ejemplo.com"', '>', 'Ir', '</a>'], 'El atributo va en la apertura y el texto visible entre las etiquetas.'),
        pair('Empareja cada atributo con su función.', [['href', 'Destino del enlace'], ['src', 'Ruta de la imagen'], ['alt', 'Texto alternativo'], ['target="_blank"', 'Abrir en pestaña nueva']], 'Son los atributos más usados en enlaces e imágenes.'),
      ]},
      { id: 'l3', title: 'Reto: listas', intro:
`Hay tres tipos de listas. \`<ul>\` es sin ordenar (viñetas), \`<ol>\` es ordenada (números) y cada ítem va en un \`<li>\`:

\`\`\`
<ul>
  <li>Pan</li>
  <li>Leche</li>
</ul>
\`\`\`

Las listas pueden anidarse metiendo otro \`<ul>\` dentro de un \`<li>\`. Un enlace puede estar dentro de un \`<li>\`, lo que es la base de los menús de navegación.`, ex: [
        mc('¿Qué etiqueta crea una lista con viñetas?', ['<ul>', '<ol>', '<li>', '<dl>'], 0, 'ul = unordered list.'),
        mc('¿Qué etiqueta crea una lista numerada?', ['<ul>', '<li>', '<ol>', '<nl>'], 2, 'ol = ordered list.'),
        fill('Cada elemento de la lista va en...', '<ul><___>Pan</li></ul>', 'li', 'li es un ítem de la lista.'),
        tf('Un <li> debe ir directamente dentro de <ul> u <ol>.', true, 'Los ítems se escriben dentro de una lista.'),
        order('Ordena una lista de dos elementos.', ['<ul>', '<li>Uno</li>', '<li>Dos</li>', '</ul>'], 'La lista envuelve a sus ítems.'),
        pair('Empareja cada etiqueta con su uso.', [['<ul>', 'Lista con viñetas'], ['<ol>', 'Lista numerada'], ['<li>', 'Elemento de lista'], ['<a>', 'Enlace']], 'Estas son las piezas de las listas y los menús.'),
      ]},
    ]},
    { id: 'u3', title: 'Formularios y tablas', desc: 'Recoge datos y ordénalos en filas', lessons: [
      { id: 'l1', title: 'Formularios básicos', intro:
`Un formulario recoge datos del usuario:

\`\`\`
<form action="/enviar" method="post">
  <label for="nombre">Nombre</label>
  <input type="text" id="nombre" name="nombre">
  <button type="submit">Enviar</button>
</form>
\`\`\`

\`<input>\` es el campo; su \`type\` define el tipo (\`text\`, \`email\`, \`password\`, \`number\`, \`checkbox\`). \`<label for="id">\` asocia el texto al campo con ese \`id\`. \`name\` es el nombre con que se envía el dato.`, ex: [
        mc('¿Qué etiqueta agrupa todos los campos de un formulario?', ['<form>', '<input>', '<label>', '<fieldset>'], 0, 'form envuelve los campos y define adónde se envían.'),
        fill('Crea un campo de correo electrónico.', '<input type="___" name="correo">', 'email', 'type="email" valida que parezca un correo.'),
        fill('Une la etiqueta con el campo cuyo id es "edad".', '<label ___="edad">Edad</label>', 'for', 'El atributo for coincide con el id del campo.'),
        tf('type="password" oculta los caracteres que escribe el usuario.', true, 'Los muestra como puntos o asteriscos.'),
        order('Ordena un campo de texto con su etiqueta.', ['<label for="n">', 'Nombre', '</label>', '<input type="text" id="n">'], 'La etiqueta va antes del campo, enlazada por for e id.'),
        pair('Empareja cada tipo de input con su uso.', [['text', 'Texto libre'], ['password', 'Contraseña'], ['checkbox', 'Casilla de marcar'], ['number', 'Valores numéricos']], 'El atributo type cambia el comportamiento del campo.'),
      ]},
      { id: 'l2', title: 'Más controles y tablas', intro:
`Otros controles: \`<textarea>\` (texto largo), \`<select>\` con \`<option>\` (desplegable) y \`<input type="radio">\`.

\`\`\`
<select name="curso">
  <option value="sql">SQL</option>
  <option value="html">HTML</option>
</select>
\`\`\`

Las **tablas** usan \`<table>\`; cada fila es \`<tr>\`, cada celda \`<td>\` y la celda de cabecera \`<th>\`:

\`\`\`
<table>
  <tr><th>Nombre</th><th>Edad</th></tr>
  <tr><td>Ana</td><td>20</td></tr>
</table>
\`\`\``, ex: [
        mc('¿Qué etiqueta define una fila de tabla?', ['<tr>', '<td>', '<th>', '<row>'], 0, 'tr = table row.'),
        mc('¿Qué etiqueta crea una celda de datos?', ['<th>', '<tr>', '<td>', '<cell>'], 2, 'td = table data; th es la celda de cabecera.'),
        fill('Cada opción del desplegable usa...', '<select><___ value="a">A</option></select>', 'option', 'option define cada opción.'),
        tf('<textarea> sirve para introducir texto de varias líneas.', true, 'Es el campo de texto largo.'),
        order('Ordena una fila con dos celdas de datos.', ['<tr>', '<td>Ana</td>', '<td>20</td>', '</tr>'], 'Las celdas van dentro de la fila.'),
        pair('Empareja cada etiqueta con su papel.', [['<table>', 'Tabla'], ['<th>', 'Celda de cabecera'], ['<select>', 'Lista desplegable'], ['<textarea>', 'Texto largo']], 'Cada etiqueta tiene su función.'),
      ]},
      { id: 'l3', title: 'Reto: formulario y tabla', intro:
`Algunos atributos mejoran los formularios:

\`placeholder\` muestra una pista dentro del campo, \`required\` lo hace obligatorio y \`value\` da el valor inicial.

\`\`\`
<input type="email" name="correo" placeholder="tu@correo.com" required>
\`\`\`

En tablas, \`colspan="2"\` hace que una celda ocupe dos columnas y \`rowspan\` ocupa varias filas.`, ex: [
        mc('¿Qué hace el atributo required?', ['Impide enviar el formulario con el campo vacío', 'Pone texto de ayuda', 'Oculta el campo', 'Hace el campo de solo lectura'], 0, 'required exige rellenar el campo.'),
        fill('Pon una pista dentro del campo.', '<input type="text" ___="Tu nombre">', 'placeholder', 'placeholder muestra texto guía que desaparece al escribir.'),
        fill('Haz que la celda ocupe 2 columnas.', '<td ___="2">Total</td>', 'colspan', 'colspan indica cuántas columnas abarca la celda.'),
        tf('Dentro de <table> las celdas <td> van directamente dentro de <tr>.', true, 'Una fila contiene celdas.'),
        order('Ordena una tabla con cabecera y una fila.', ['<table>', '<tr><th>Curso</th></tr>', '<tr><td>HTML</td></tr>', '</table>'], 'La tabla contiene filas, y estas, celdas.'),
        pair('Empareja cada atributo con su efecto.', [['required', 'Campo obligatorio'], ['placeholder', 'Pista en el campo'], ['colspan', 'Celda sobre varias columnas'], ['value', 'Valor inicial']], 'Son atributos habituales de formularios y tablas.'),
      ]},
    ]},
    { id: 'u4', title: 'CSS básico', desc: 'Dale estilo a tu página', lessons: [
      { id: 'l1', title: 'Selectores y propiedades', intro:
`**CSS** da estilo al HTML. Una regla tiene un **selector** y declaraciones \`propiedad: valor;\` entre llaves:

\`\`\`
p {
  color: blue;
}
\`\`\`

Selectores: de etiqueta (\`p\`), de clase (\`.aviso\`, con punto) y de id (\`#cabecera\`, con almohadilla). Se enlaza desde el HTML con \`<link rel="stylesheet" href="estilos.css">\` o con \`<style>\` en el head.`, ex: [
        mc('¿Cómo se selecciona la clase "aviso" en CSS?', ['.aviso', '#aviso', 'aviso', '*aviso'], 0, 'Las clases usan un punto.'),
        mc('¿Cómo se selecciona el elemento con id "menu"?', ['.menu', '#menu', 'menu()', '@menu'], 1, 'Los ids usan almohadilla.'),
        fill('Pinta los párrafos de rojo.', 'p { ___: red; }', 'color', 'color cambia el color del texto.'),
        order('Ordena una regla que pone los títulos h1 en verde.', ['h1', '{', 'color: green;', '}'], 'Selector, llave, declaración y llave.'),
        tf('Cada declaración CSS termina con punto y coma.', true, 'Separa unas declaraciones de otras.'),
        pair('Empareja cada selector con lo que elige.', [['p', 'Todos los párrafos'], ['.nota', 'Elementos con class="nota"'], ['#logo', 'El elemento con id="logo"'], ['h1, h2', 'Los h1 y los h2']], 'Cada tipo de selector tiene su sintaxis.'),
      ]},
      { id: 'l2', title: 'Color y fuente', intro:
`Propiedades de texto y color:

\`\`\`
h1 {
  color: #e34c26;
  background-color: #fff3ee;
  font-family: Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
\`\`\`

Los colores pueden ser nombres (\`red\`), hexadecimales (\`#ff0000\`) o \`rgb(255, 0, 0)\`. \`font-size\` admite \`px\`, \`em\` o \`rem\`.`, ex: [
        mc('¿Qué propiedad cambia el color de fondo?', ['background-color', 'color', 'bg', 'fondo'], 0, 'color es para el texto; background-color para el fondo.'),
        fill('Haz el texto más grande.', 'p { ___: 20px; }', 'font-size', 'font-size define el tamaño de la letra.'),
        fill('Centra el texto.', 'h1 { text-align: ___; }', 'center', 'text-align: center centra el texto.'),
        tf('#ff0000 es un color rojo en notación hexadecimal.', true, 'Los pares son rojo, verde y azul: ff, 00, 00.'),
        order('Ordena la regla: texto azul y letra de 18px.', ['p {', 'color: blue;', 'font-size: 18px;', '}'], 'Las declaraciones van entre llaves.'),
        pair('Empareja cada propiedad con su efecto.', [['color', 'Color del texto'], ['font-family', 'Tipo de letra'], ['font-weight', 'Grosor de la letra'], ['background-color', 'Color de fondo']], 'Son propiedades de texto y color muy habituales.'),
      ]},
      { id: 'l3', title: 'Reto: modelo de caja', intro:
`Cada elemento es una **caja** formada, de dentro a fuera, por: contenido, \`padding\` (espacio interior), \`border\` (borde) y \`margin\` (espacio exterior).

\`\`\`
.tarjeta {
  width: 200px;
  padding: 10px;
  border: 2px solid black;
  margin: 20px;
}
\`\`\`

Con \`margin: 10px 20px\` los valores son vertical y horizontal. Con \`box-sizing: border-box\` el ancho incluye padding y borde.`, ex: [
        mc('¿Qué propiedad crea espacio entre el contenido y el borde?', ['padding', 'margin', 'spacing', 'gap'], 0, 'padding es el espacio interior; margin, el exterior.'),
        mc('¿Qué propiedad separa un elemento de los vecinos?', ['padding', 'border', 'margin', 'width'], 2, 'margin es el espacio fuera del borde.'),
        fill('Pon un borde sólido de 1px.', '.caja { border: 1px ___ black; }', 'solid', 'solid es el estilo de línea continua.'),
        order('Ordena las capas de la caja, de dentro a fuera.', ['contenido', 'padding', 'border', 'margin'], 'Contenido, relleno, borde y margen exterior.'),
        tf('margin: 10px 20px; aplica 10px arriba y abajo y 20px a izquierda y derecha.', true, 'Con dos valores, el primero es vertical y el segundo horizontal.'),
        pair('Empareja cada propiedad con su efecto.', [['padding', 'Espacio interior'], ['margin', 'Espacio exterior'], ['border', 'Línea alrededor'], ['width', 'Anchura del contenido']], 'Son las propiedades básicas del modelo de caja.'),
      ]},
    ]},
    { id: 'u5', title: 'Layout', desc: 'Flexbox, grid y diseño adaptable', lessons: [
      { id: 'l1', title: 'Flexbox', intro:
`**Flexbox** coloca elementos en una fila o columna. Se activa en el contenedor:

\`\`\`
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
\`\`\`

\`justify-content\` alinea en el eje principal (por defecto horizontal) y \`align-items\` en el transversal. \`flex-direction: column\` cambia a vertical. \`gap\` deja espacio entre los hijos.`, ex: [
        fill('Activa flexbox en el contenedor.', '.menu { display: ___; }', 'flex', 'display: flex convierte a los hijos en elementos flexibles.'),
        mc('¿Qué hace flex-direction: column?', ['Coloca los hijos en vertical', 'Crea columnas de texto', 'Centra los hijos', 'Oculta los hijos'], 0, 'Cambia el eje principal a vertical.'),
        mc('¿Qué propiedad centra los hijos en el eje transversal?', ['align-items: center', 'text-align: center', 'margin: center', 'flex-center'], 0, 'align-items controla la alineación en el eje transversal.'),
        tf('Las propiedades justify-content y align-items se escriben en el contenedor padre.', true, 'Los hijos se colocan según lo que defina el padre.'),
        order('Ordena la regla para un menú flex centrado horizontalmente.', ['.menu {', 'display: flex;', 'justify-content: center;', '}'], 'display: flex primero y luego la alineación.'),
        pair('Empareja cada propiedad con su efecto.', [['display: flex', 'Activa flexbox'], ['justify-content', 'Alinea en el eje principal'], ['align-items', 'Alinea en el eje transversal'], ['gap', 'Espacio entre hijos']], 'Son las bases de flexbox.'),
      ]},
      { id: 'l2', title: 'CSS Grid', intro:
`**Grid** distribuye elementos en filas y columnas a la vez:

\`\`\`
.galeria {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}
\`\`\`

\`fr\` es una fracción del espacio disponible: tres \`1fr\` crean tres columnas iguales. Con \`repeat(3, 1fr)\` se abrevia. Flexbox es ideal para una dimensión (fila o columna); Grid, para dos.`, ex: [
        fill('Activa grid en el contenedor.', '.galeria { display: ___; }', 'grid', 'display: grid crea una cuadrícula.'),
        mc('¿Cuántas columnas crea grid-template-columns: 1fr 1fr 1fr?', ['3', '1', '2', '6'], 0, 'Hay tres valores, por lo tanto tres columnas iguales.'),
        mc('¿Qué significa 1fr?', ['Una fracción del espacio disponible', 'Un píxel', 'El 1% del ancho', 'Una fila'], 0, 'fr reparte el espacio sobrante entre columnas.'),
        tf('Grid permite organizar elementos en filas y columnas a la vez.', true, 'Es un sistema bidimensional.'),
        order('Ordena la regla de una cuadrícula de 2 columnas iguales.', ['.cuadro {', 'display: grid;', 'grid-template-columns: 1fr 1fr;', '}'], 'Primero se activa grid y luego se definen las columnas.'),
        pair('Empareja cada propiedad con su función.', [['display: grid', 'Activa la cuadrícula'], ['grid-template-columns', 'Define las columnas'], ['gap', 'Espacio entre celdas'], ['fr', 'Fracción del espacio']], 'Son las propiedades básicas de Grid.'),
      ]},
      { id: 'l3', title: 'Reto: diseño responsive', intro:
`Una página **responsive** se adapta a cualquier pantalla. Necesita esta etiqueta en el \`<head>\`:

\`\`\`
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

Las **media queries** aplican estilos solo si se cumple una condición:

\`\`\`
.menu { display: flex; }
@media (max-width: 600px) {
  .menu { flex-direction: column; }
}
\`\`\`

En pantallas de 600px de ancho o menos, el menú pasa a vertical. Las unidades relativas (\`%\`, \`rem\`) y \`max-width\` también ayudan.`, ex: [
        mc('¿Para qué sirven las media queries?', ['Aplicar estilos según el tamaño u otra característica de la pantalla', 'Insertar imágenes', 'Crear formularios', 'Cargar fuentes'], 0, 'Permiten adaptar el diseño a distintas pantallas.'),
        fill('Aplica estilos en pantallas de hasta 600px.', '@media (___-width: 600px) { .menu { flex-direction: column; } }', 'max', 'max-width: 600px se cumple con anchos de 600px o menos.'),
        mc('¿Qué etiqueta del head hace que la página se ajuste a móviles?', ['<meta name="viewport" ...>', '<meta charset="UTF-8">', '<title>', '<link rel="icon">'], 0, 'La etiqueta viewport hace que el ancho siga al del dispositivo.'),
        tf('Una página responsive se ve bien tanto en móvil como en escritorio.', true, 'Ese es su objetivo: adaptarse al dispositivo.'),
        order('Ordena la media query para pantallas de hasta 600px.', ['@media (max-width: 600px) {', '.menu {', 'flex-direction: column;', '}', '}'], 'La media query envuelve a la regla normal.'),
        pair('Empareja cada concepto con su función.', [['@media', 'Estilos condicionales'], ['viewport', 'Ajuste al ancho del dispositivo'], ['max-width: 600px', 'Pantallas de 600px o menos'], ['flex-direction: column', 'Hijos en vertical']], 'Son las piezas del diseño adaptable.'),
      ]},
    ]},
  ],
};
}
