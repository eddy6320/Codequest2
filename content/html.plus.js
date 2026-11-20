(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair, run } = CQ.h;

CQ.content.html.units.push(
  { id: 'u6', title: 'HTML semántico y accesibilidad', desc: 'Landmarks, alt, ARIA, contraste y SEO', lessons: [
    { id: 'l1', title: 'Etiquetas semánticas', intro:
`Una etiqueta **semántica** dice qué *es* el contenido, no solo cómo se ve. Los lectores de pantalla y los buscadores se apoyan en ellas.

\`\`\`
<header>Logo y título</header>
<nav>Menú de enlaces</nav>
<main>
  <article>Una entrada de blog</article>
  <aside>Contenido relacionado</aside>
</main>
<footer>Pie de página</footer>
\`\`\`

Estas zonas se llaman **landmarks** (puntos de referencia). Solo debe haber un \`<main>\` por página. Un \`<div>\` no aporta significado.`, ex: [
      mc('¿Qué etiqueta envuelve el contenido principal y único de la página?', ['<section>', '<main>', '<aside>', '<header>'], 1, '<main> marca el contenido central; solo debe haber uno.'),
      fill('Completa la etiqueta de cierre del menú de navegación.', '<nav>\n  <a href="/">Inicio</a>\n</___>', 'nav', 'El bloque de enlaces principales se marca con <nav>.'),
      tf('Usar solo <div> es igual de accesible que usar etiquetas semánticas.', false, 'Un <div> no dice nada a un lector de pantalla; las etiquetas semánticas sí.'),
      pair('Empareja cada etiqueta con su función.', [['<header>', 'Cabecera de página o sección'], ['<nav>', 'Enlaces de navegación principales'], ['<aside>', 'Contenido complementario'], ['<footer>', 'Pie de página']], 'Cada una describe el papel de su contenido.'),
      mc('¿Qué etiqueta es la adecuada para una entrada de blog independiente?', ['<article>', '<aside>', '<nav>', '<footer>'], 0, '<article> representa contenido autónomo que tendría sentido por sí solo.'),
      order('Ordena la estructura de una página semántica.', ['<header>Logo</header>', '<nav>Menú</nav>', '<main>Contenido</main>', '<footer>Pie</footer>'], 'Cabecera, navegación, contenido principal y pie.'),
    ]},
    { id: 'l2', title: 'Imágenes, formularios y ARIA', intro:
`Para que una web sea accesible, toda imagen informativa necesita texto alternativo:

\`\`\`
<img src="gato.jpg" alt="Gato naranja dormido">
<img src="adorno.svg" alt="">
\`\`\`

Si es solo decorativa, usa \`alt=""\` vacío. En formularios, asocia cada \`<label>\` con su campo mediante \`for\` e \`id\`:

\`\`\`
<label for="mail">Correo</label>
<input id="mail" type="email">
\`\`\`

**ARIA** (\`role\`, \`aria-label\`...) completa lo que HTML no expresa. Regla de oro: usa primero el elemento nativo (\`<button>\`).`, ex: [
      mc('¿Para qué sirve el atributo alt de una imagen?', ['Para describirla a quien no puede verla', 'Para cambiar su tamaño', 'Para elegir su formato', 'Para enlazarla'], 0, 'Lo leen los lectores de pantalla y se muestra si la imagen no carga.'),
      fill('Añade el texto alternativo a la imagen.', '<img src="gato.jpg" ___="Gato naranja dormido">', 'alt', 'El atributo alt contiene el texto alternativo.'),
      tf('Una imagen puramente decorativa debe llevar alt="" (vacío).', true, 'Con alt vacío el lector de pantalla la ignora en lugar de leer ruido.'),
      mc('¿Cómo se vincula un <label> con su <input>?', ['for del label = id del input', 'class igual en ambos', 'name del label = type del input', 'Poniéndolos en líneas seguidas'], 0, 'El atributo for debe coincidir con el id del campo.'),
      mc('¿Qué es preferible para un botón accesible?', ['<div role="button">', '<button>', '<span onclick>', '<a> sin href'], 1, 'El elemento nativo ya trae teclado, foco y rol correctos.'),
      pair('Empareja cada atributo con su uso.', [['alt', 'Describe una imagen'], ['aria-label', 'Da nombre accesible a un elemento'], ['aria-hidden="true"', 'Oculta a los lectores de pantalla'], ['for', 'Une un label con un campo']], 'Todos mejoran la experiencia con tecnologías de apoyo.'),
      order('Ordena un campo de correo con su etiqueta.', ['<label for="mail">', 'Correo', '</label>', '<input id="mail" type="email">'], 'Etiqueta primero y luego el campo con el id referido.'),
    ]},
    { id: 'l3', title: 'Reto: contraste, SEO y meta', intro:
`El **contraste** entre texto y fondo debe ser suficiente: las pautas WCAG nivel AA piden **4,5:1** para texto normal.

Para el **SEO** (posicionamiento en buscadores) cuida el \`<head>\`:

\`\`\`
<title>Curso de HTML</title>
<meta name="description" content="Aprende HTML desde cero">
\`\`\`

Usa encabezados en orden (\`h1\`, \`h2\`, \`h3\`...) sin saltarte niveles, y enlaces con texto descriptivo: "Ver precios" mejor que "Haz clic aquí".`, ex: [
      mc('¿Qué contraste mínimo pide WCAG AA para texto normal?', ['2:1', '3:1', '4,5:1', '10:1'], 2, 'AA exige 4,5:1 para texto normal y 3:1 para texto grande.'),
      fill('Completa la meta etiqueta que resume la página en los buscadores.', '<meta name="___" content="Aprende HTML desde cero">', 'description', 'meta description es el resumen que suele mostrarse en los resultados.'),
      tf('Saltar niveles de encabezado (de h1 a h4) perjudica la navegación con lector de pantalla.', true, 'Los encabezados forman un índice; los saltos lo rompen.'),
      mc('¿Cuál es el mejor texto para un enlace?', ['Haz clic aquí', 'Ver precios del plan Pro', 'Más', 'Pulsa'], 1, 'Un texto descriptivo se entiende incluso fuera de contexto.'),
      order('Ordena un <head> bien formado.', ['<head>', '<meta charset="UTF-8">', '<meta name="viewport" content="width=device-width, initial-scale=1">', '<title>Mi web</title>', '</head>'], 'Codificación, viewport y título dentro de head.'),
      pair('Empareja cada elemento con su utilidad.', [['<title>', 'Texto de la pestaña y de los resultados'], ['meta description', 'Resumen para buscadores'], ['lang en <html>', 'Idioma para lectores de pantalla'], ['alt', 'Alternativa textual de imágenes']], 'Son pequeños detalles con gran efecto en accesibilidad y SEO.'),
    ]},
  ]},

  { id: 'u7', title: 'Transiciones y animaciones CSS', desc: 'transition, transform, @keyframes y rendimiento', lessons: [
    { id: 'l1', title: 'Transiciones suaves', intro:
`Una **transición** hace que un cambio de estilo ocurra poco a poco en lugar de al instante.

\`\`\`
.btn {
  background: royalblue;
  transition: background 0.3s ease;
}
.btn:hover {
  background: tomato;
}
\`\`\`

\`transition\` indica **propiedad**, **duración**, **función de tiempo** (\`ease\`, \`linear\`, \`ease-in-out\`) y, opcional, **retraso**. Se dispara cuando cambia el valor, por ejemplo con \`:hover\` o \`:focus\`.`, ex: [
      mc('¿Qué hace "transition: background 0.3s ease;"?', ['Anima el cambio de fondo durante 0,3 s', 'Cambia el fondo a 0,3 s', 'Repite el fondo cada 0,3 s', 'Retrasa la página 0,3 s'], 0, 'Suaviza el cambio de la propiedad background durante 0,3 segundos.'),
      fill('Aplica el estilo cuando el puntero está encima.', '.btn:___ { background: tomato; }', 'hover', ':hover se activa al pasar el ratón.'),
      tf('Una transición se ejecuta sola al cargar la página, sin que cambie ningún valor.', false, 'Necesita un cambio de estado (hover, focus, clase...) que la dispare.'),
      pair('Empareja cada propiedad con su significado.', [['transition-property', 'Qué propiedad se anima'], ['transition-duration', 'Cuánto dura'], ['transition-timing-function', 'La curva de velocidad'], ['transition-delay', 'Espera antes de empezar']], 'Son las partes de la abreviatura transition.'),
      order('Ordena una tarjeta que crece suavemente al pasar el ratón.', ['.card {', 'transition: transform 0.2s ease;', '}', '.card:hover {', 'transform: scale(1.1);', '}'], 'La transición va en el estado base; el cambio, en :hover.'),
      mc('¿Qué describe "ease-in-out"?', ['Arranca y termina despacio', 'Velocidad constante', 'Salta al final', 'Solo arranca despacio'], 0, 'ease-in-out acelera al principio y frena al final.'),
    ]},
    { id: 'l2', title: 'transform y @keyframes', intro:
`\`transform\` mueve, gira o escala un elemento sin alterar la posición del resto:

\`\`\`
transform: translateX(20px) rotate(10deg) scale(1.2);
\`\`\`

Para animaciones más largas usa **@keyframes** y la propiedad \`animation\`:

\`\`\`
@keyframes girar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.loader { animation: girar 2s linear infinite; }
\`\`\`

Detalles útiles: \`animation-iteration-count\`, \`animation-delay\`, \`animation-direction\`.`, ex: [
      fill('Declara el conjunto de fotogramas de la animación.', '@___ girar { to { transform: rotate(360deg); } }', 'keyframes', '@keyframes define los pasos de una animación.'),
      pair('Empareja cada función de transform con su efecto.', [['translate', 'Mover'], ['rotate', 'Girar'], ['scale', 'Cambiar de tamaño'], ['skew', 'Inclinar']], 'Son las transformaciones 2D más usadas.'),
      tf('transform mueve visualmente un elemento sin empujar a los demás.', true, 'No altera el flujo del documento, por eso es ideal para animar.'),
      fill('Haz que la animación se repita sin fin.', 'animation-iteration-count: ___;', 'infinite', 'infinite repite la animación indefinidamente.'),
      order('Ordena una animación de latido.', ['@keyframes latir {', '50% { transform: scale(1.2); }', '}', '.corazon {', 'animation: latir 1s infinite;', '}'], 'Primero se definen los fotogramas y luego se aplican con animation.'),
      mc('¿Qué diferencia principal hay entre transition y animation?', ['animation usa @keyframes y puede arrancar sola', 'transition solo funciona con JavaScript', 'animation no puede repetirse', 'No hay diferencia'], 0, 'animation define varios pasos con @keyframes y no necesita un cambio de estado.'),
    ]},
    { id: 'l3', title: 'Reto: animaciones con buen rendimiento', intro:
`Animar algunas propiedades es caro: \`width\`, \`height\`, \`top\` o \`margin\` obligan al navegador a recalcular el diseño (**reflow**).

Las baratas son **\`transform\`** y **\`opacity\`**, que se componen en la GPU.

\`will-change\` avisa de una animación próxima, pero úsalo con moderación.

Y respeta a quien se marea con el movimiento:

\`\`\`
@media (prefers-reduced-motion: reduce) {
  * { animation: none; transition: none; }
}
\`\`\``, ex: [
      mc('¿Qué par de propiedades es mejor para animar?', ['width y height', 'transform y opacity', 'top y left', 'margin y padding'], 1, 'transform y opacity no provocan reflow y se aceleran por GPU.'),
      tf('Animar width es tan barato como animar transform.', false, 'width fuerza recalcular el diseño en cada fotograma.'),
      fill('Respeta a los usuarios que piden menos movimiento.', '@media (prefers-reduced-motion: ___) { * { animation: none; } }', 'reduce', 'El valor reduce indica que el usuario prefiere menos animación.'),
      pair('Empareja cada concepto con su efecto.', [['transform', 'Se anima en la GPU'], ['width', 'Provoca reflow'], ['will-change', 'Avisa de un cambio próximo'], ['prefers-reduced-motion', 'Respeta la preferencia de movimiento']], 'Elegir bien qué animar mantiene los 60 fps.'),
      mc('¿Cómo conviene usar will-change?', ['En todos los elementos', 'Solo en los que se animarán pronto', 'Nunca en transform', 'Dentro de @keyframes'], 1, 'Abusar de will-change consume memoria; úsalo donde haga falta.'),
      order('Ordena una animación con respeto al movimiento reducido.', ['.logo { animation: girar 3s infinite; }', '@media (prefers-reduced-motion: reduce) {', '.logo { animation: none; }', '}'], 'Se define la animación y luego se anula en la media query.'),
    ]},
  ]},

  { id: 'u8', title: 'CSS avanzado', desc: 'Variables, especificidad, grid, clamp() y unidades', lessons: [
    { id: 'l1', title: 'Variables y pseudo-clases', intro:
`Las **variables CSS** guardan valores reutilizables:

\`\`\`
:root { --marca: #e34c26; }
a { color: var(--marca); }
\`\`\`

\`var(--x, rojo)\` admite un valor de reserva.

Una **pseudo-clase** (\`:hover\`, \`:focus\`, \`:first-child\`, \`:nth-child(2)\`) selecciona un elemento según su estado o posición. Un **pseudo-elemento** (\`::before\`, \`::after\`, \`::placeholder\`) selecciona una *parte* de él. \`::before\` solo se muestra si tiene \`content\`.`, ex: [
      fill('Usa la variable --marca como color.', 'a { color: ___(--marca); }', 'var', 'var() lee el valor de una variable CSS.'),
      mc('¿Qué diferencia a ":hover" de "::before"?', [':hover es pseudo-clase (estado); ::before, pseudo-elemento (parte)', 'Son lo mismo', ':hover crea contenido nuevo', '::before depende del ratón'], 0, 'Las pseudo-clases usan un solo : y los pseudo-elementos dos.'),
      pair('Empareja cada selector con lo que elige.', [[':hover', 'Elemento con el puntero encima'], [':first-child', 'Primer hijo de su padre'], ['::before', 'Contenido generado antes'], ['::placeholder', 'Texto de ayuda de un campo']], 'Unos filtran por estado o posición, otros crean o eligen partes.'),
      tf('Un ::before no se muestra si no tiene la propiedad content.', true, 'content es obligatorio para generar el pseudo-elemento.'),
      order('Ordena la declaración y uso de una variable.', [':root {', '--marca: #e34c26;', '}', 'h1 { color: var(--marca); }'], 'Se declara en :root y se usa con var().'),
      mc('¿Qué color tendrá el texto con "color: var(--x, red)" si --x no existe?', ['red', 'negro', 'transparente', 'Error'], 0, 'El segundo argumento de var() es el valor de reserva.'),
    ]},
    { id: 'l2', title: 'Especificidad y cascada', intro:
`Cuando dos reglas chocan, gana la de mayor **especificidad**. Se cuenta como (id, clase, etiqueta):

- \`p\` → (0,0,1)
- \`.aviso\` → (0,1,0)
- \`#menu\` → (1,0,0)

Las pseudo-clases cuentan como clases. El estilo en línea (\`style="..."\`) gana a los selectores, y \`!important\` a casi todo (evítalo).

Con especificidad **igual**, gana la regla declarada **más tarde**.`, ex: [
      mc('Con "p { color: red }" y ".texto { color: blue }", ¿de qué color es <p class="texto">?', ['Rojo', 'Azul', 'Negro', 'Depende del navegador'], 1, 'Una clase pesa más que una etiqueta.', 'p { color: red; }\n.texto { color: blue; }'),
      mc('¿Qué selector tiene mayor especificidad?', ['.a.b.c', 'div p span', '#caja', 'ul li a'], 2, 'Un solo id (1,0,0) supera a cualquier número de clases.'),
      fill('La especificidad de ".menu a:hover" es (0,___,1).', '.menu a:hover → (0,___,1)', '2', 'La clase .menu y la pseudo-clase :hover cuentan como clases: 2.'),
      tf('!important debe usarse con moderación porque dificulta sobrescribir estilos.', true, 'Rompe la cascada normal y genera guerras de especificidad.'),
      pair('Empareja cada tipo de selector con su peso.', [['Etiqueta (p)', '(0,0,1)'], ['Clase (.a)', '(0,1,0)'], ['Id (#a)', '(1,0,0)'], ['Estilo en línea', 'Supera a los selectores']], 'A mayor peso, más probable que gane.'),
      mc('Dos reglas con la misma especificidad chocan. ¿Cuál gana?', ['La primera del archivo', 'La última declarada', 'La más corta', 'La de menos propiedades'], 1, 'En empate manda el orden: la posterior sobrescribe.'),
    ]},
    { id: 'l3', title: 'Reto: grid avanzado, clamp() y unidades', intro:
`Un grid adaptable sin media queries:

\`\`\`
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
\`\`\`

\`clamp(mínimo, ideal, máximo)\` fija un valor flexible entre límites: \`font-size: clamp(1rem, 2vw, 2rem)\`.

Unidades: \`rem\` (relativa a la raíz), \`em\` (al elemento), \`vw\` (1% del ancho de ventana) y \`fr\` (fracción libre del grid). Con \`grid-column: 1 / -1\` un elemento ocupa todas las columnas.`, ex: [
      fill('Columnas que se adaptan, de al menos 200px y repartiendo el resto.', 'grid-template-columns: repeat(auto-fit, minmax(200px, ___));', '1fr', 'minmax(200px, 1fr) fija un mínimo y reparte el espacio sobrante.'),
      mc('¿Qué hace "font-size: clamp(1rem, 2vw, 2rem)"?', ['Tamaño fluido entre 1rem y 2rem', 'Siempre 2vw', 'Siempre 1rem', 'Tamaño mínimo de 2rem'], 0, 'El valor ideal 2vw se limita entre 1rem y 2rem.'),
      pair('Empareja cada unidad con su significado.', [['rem', 'Relativa a la fuente raíz'], ['em', 'Relativa a la fuente del elemento'], ['vw', '1% del ancho de la ventana'], ['fr', 'Fracción del espacio libre del grid']], 'Elegir bien la unidad hace el diseño flexible.'),
      tf('grid-template-areas permite nombrar zonas de la cuadrícula.', true, 'Dibujas el layout con nombres como "cabecera" o "menu".'),
      mc('¿Qué efecto tiene "grid-column: 1 / -1"?', ['Ocupa de la primera a la última línea', 'Oculta la columna', 'Invierte el orden', 'Crea una columna nueva'], 0, '-1 es la última línea del grid, así que abarca todas las columnas.'),
      order('Ordena una galería de 3 columnas con separación.', ['.galeria {', 'display: grid;', 'grid-template-columns: repeat(3, 1fr);', 'gap: 1rem;', '}'], 'Se activa grid, se definen columnas y se añade el espacio.'),
    ]},
  ]},

  { id: 'u9', title: 'Diseño responsive y mobile-first', desc: 'Viewport, media queries, imágenes y container queries', lessons: [
    { id: 'l1', title: 'Viewport y mobile-first', intro:
`Sin la meta **viewport**, los móviles muestran la página como si fuera de escritorio, en pequeño:

\`\`\`
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

El enfoque **mobile-first** consiste en escribir primero los estilos para pantallas pequeñas y *ampliar* con \`min-width\` para pantallas mayores. Es más ligero y obliga a priorizar lo esencial.

Un **breakpoint** es el ancho a partir del cual cambia el diseño.`, ex: [
      mc('¿Para qué sirve la meta viewport?', ['Para que la página se ajuste al ancho del dispositivo', 'Para cargar imágenes más rápido', 'Para cambiar el idioma', 'Para activar JavaScript'], 0, 'Indica al móvil que use su ancho real en vez de simular escritorio.'),
      fill('Completa la meta viewport.', '<meta name="viewport" content="width=device-width, ___=1">', 'initial-scale', 'initial-scale=1 fija el zoom inicial al 100%.'),
      tf('En mobile-first, los estilos base son para móvil y se amplían con min-width.', true, 'Se parte de lo pequeño y se añaden reglas para pantallas mayores.'),
      pair('Empareja cada concepto con su descripción.', [['min-width', 'Enfoque mobile-first'], ['max-width', 'Enfoque desktop-first'], ['viewport', 'Área visible del navegador'], ['breakpoint', 'Ancho donde cambia el diseño']], 'Estos términos son la base del diseño responsive.'),
      order('Ordena la meta viewport.', ['<meta', 'name="viewport"', 'content="width=device-width, initial-scale=1">'], 'Etiqueta, nombre y contenido.'),
      mc('¿Cuál es una ventaja de mobile-first?', ['El móvil carga solo lo necesario y se prioriza lo esencial', 'No hace falta probar en móvil', 'Evita usar CSS', 'Solo sirve para móviles'], 0, 'Parte de un diseño sencillo y lo enriquece en pantallas grandes.'),
    ]},
    { id: 'l2', title: 'Media queries e imágenes responsive', intro:
`Una **media query** aplica estilos según las condiciones del dispositivo:

\`\`\`
@media (min-width: 768px) {
  .menu { display: flex; }
}
\`\`\`

Imágenes que no desbordan: \`img { max-width: 100%; height: auto; }\`.

Para servir la imagen adecuada:

\`\`\`
<img src="p.jpg" srcset="p-400.jpg 400w, p-800.jpg 800w"
     sizes="(min-width: 600px) 50vw, 100vw"
     alt="Paisaje" loading="lazy">
\`\`\`

\`<picture>\` permite elegir distintas fuentes por formato o tamaño.`, ex: [
      fill('Aplica los estilos desde 768px de ancho en adelante.', '@media (___-width: 768px) { .menu { display: flex; } }', 'min', 'min-width se cumple cuando el ancho es igual o mayor.'),
      mc('¿Qué hace "img { max-width: 100%; height: auto; }"?', ['La imagen nunca excede su contenedor y mantiene proporción', 'Estira la imagen al 100% siempre', 'Oculta la imagen', 'Fija su alto en píxeles'], 0, 'max-width evita desbordes y height:auto conserva la proporción.'),
      pair('Empareja cada atributo con su función.', [['srcset', 'Lista de versiones de la imagen'], ['sizes', 'Ancho que ocupará la imagen'], ['<picture>', 'Fuentes distintas según condición'], ['loading="lazy"', 'Carga diferida']], 'Ayudan a no descargar más píxeles de los necesarios.'),
      tf('loading="lazy" pospone la carga de imágenes que aún no están a la vista.', true, 'Ahorra datos y acelera la carga inicial.'),
      order('Ordena una media query para pantallas anchas.', ['@media (min-width: 768px) {', '.menu {', 'display: flex;', '}', '}'], 'La media query envuelve la regla del selector.'),
      mc('¿Cuándo se aplica "@media (min-width: 600px)"?', ['Cuando el ancho es 600px o más', 'Cuando el ancho es menor de 600px', 'Solo a 600px exactos', 'Solo en impresión'], 0, 'min-width significa "a partir de".'),
    ]},
    { id: 'l3', title: 'Reto: container queries', intro:
`Las **container queries** adaptan un componente al tamaño de *su contenedor*, no al de la ventana. Primero declaras el contenedor y luego consultas:

\`\`\`
.tarjeta-caja { container-type: inline-size; }

@container (min-width: 400px) {
  .tarjeta { display: flex; }
}
\`\`\`

Son ideales para componentes reutilizables que aparecen en zonas de distinto ancho (barra lateral, cuerpo principal). Una media query, en cambio, mira el viewport.`, ex: [
      mc('¿En qué se diferencia una container query de una media query?', ['Mira el tamaño del contenedor, no el de la ventana', 'Solo sirve para impresión', 'No admite min-width', 'Es más antigua'], 0, 'El componente reacciona a su espacio disponible.'),
      fill('Declara el elemento como contenedor consultable.', '.caja { ___-type: inline-size; }', 'container', 'container-type habilita las consultas sobre ese elemento.'),
      fill('Escribe la regla que consulta el contenedor.', '@___ (min-width: 400px) { .tarjeta { display: flex; } }', 'container', '@container aplica estilos según el tamaño del contenedor.'),
      tf('Para usar @container hay que declarar antes container-type en un ancestro.', true, 'Sin un contenedor declarado, la consulta no tiene a qué referirse.'),
      mc('¿Cuándo es mejor una container query?', ['Con un componente reutilizado en zonas de distinto ancho', 'Para cambiar la fuente global', 'Para cargar scripts', 'Para el color del fondo del body'], 0, 'El componente se adapta a su sitio, vaya donde vaya.'),
      order('Ordena una tarjeta que se vuelve horizontal en contenedores anchos.', ['.caja { container-type: inline-size; }', '@container (min-width: 400px) {', '.tarjeta { display: flex; }', '}'], 'Primero se declara el contenedor y luego se consulta.'),
    ]},
  ]},

  { id: 'u10', title: 'Proyecto y buenas prácticas', desc: 'Landing, BEM, rendimiento, Lighthouse y despliegue', lessons: [
    { id: 'l1', title: 'Estructura de una landing', intro:
`Una **landing page** busca una sola acción. Estructura típica:

\`\`\`
<header>  logo y menú
<section class="hero">  titular + CTA
<section class="beneficios">  3 ventajas
<section class="precios">
<footer>  contacto y legales
\`\`\`

El **hero** es lo primero que se ve: titular claro y un **CTA** (call to action, llamada a la acción) como "Empieza gratis". Los enlaces internos usan anclas: \`<a href="#contacto">\` lleva al elemento con \`id="contacto"\`.`, ex: [
      order('Ordena las secciones de una landing de arriba abajo.', ['<header>', '<section class="hero">', '<section class="beneficios">', '<section class="precios">', '<footer>'], 'Cabecera, hero, ventajas, precios y pie.'),
      mc('¿Qué es un CTA?', ['Un botón o enlace que invita a una acción', 'Una hoja de estilos', 'Un tipo de imagen', 'Una etiqueta del head'], 0, 'Call to action: guía al visitante hacia lo que quieres que haga.'),
      fill('Haz que el enlace salte a esta sección.', '<a href="#contacto">Contactar</a>\n<section id="___">...</section>', 'contacto', 'El valor del id debe coincidir con el ancla del enlace.'),
      pair('Empareja cada parte con su función.', [['Hero', 'Primer impacto con titular y CTA'], ['Beneficios', 'Razones para elegir el producto'], ['Precios', 'Planes y costes'], ['Footer', 'Contacto y avisos legales']], 'Cada bloque cumple un paso en el camino del visitante.'),
      tf('Una landing page eficaz debe tener una llamada a la acción clara.', true, 'Su objetivo es conseguir una acción concreta del visitante.'),
      mc('¿Dónde debe ir el titular principal de la landing?', ['En el hero, arriba', 'En el footer', 'Dentro de <head>', 'Al final del body'], 0, 'Lo primero que se ve debe explicar de qué trata.'),
    ]},
    { id: 'l2', title: 'Nombrar con BEM', intro:
`**BEM** (Bloque, Elemento, Modificador) es una convención para nombrar clases:

- **Bloque**: componente independiente, \`.tarjeta\`
- **Elemento**: parte del bloque, \`.tarjeta__titulo\` (dos guiones bajos)
- **Modificador**: variante, \`.tarjeta--destacada\` (dos guiones)

\`\`\`
<article class="tarjeta tarjeta--destacada">
  <h2 class="tarjeta__titulo">Oferta</h2>
</article>
\`\`\`

Al basarse solo en clases mantiene la especificidad baja y el CSS predecible.`, ex: [
      mc('¿Qué significa BEM?', ['Bloque, Elemento, Modificador', 'Base, Estilo, Medida', 'Body, Element, Media', 'Borde, Espacio, Margen'], 0, 'Son los tres tipos de nombre que usa la convención.'),
      pair('Empareja cada clase con su rol BEM.', [['.tarjeta', 'Bloque'], ['.tarjeta__titulo', 'Elemento'], ['.tarjeta--destacada', 'Modificador'], ['.menu__item', 'Elemento de otro bloque']], 'Los elementos llevan __ y los modificadores --.'),
      mc('¿Cuál es un nombre BEM correcto para el botón de un formulario?', ['.form__boton', '.form-->boton', '.form.boton', '#form_boton'], 0, 'Bloque + __ + elemento.'),
      tf('BEM selecciona con clases, lo que mantiene la especificidad baja.', true, 'Evita selectores anidados o con id, que son difíciles de sobrescribir.'),
      order('Ordena el HTML de una tarjeta destacada con título.', ['<article class="tarjeta tarjeta--destacada">', '<h2 class="tarjeta__titulo">', 'Oferta', '</h2>', '</article>'], 'La tarjeta contiene su elemento título.'),
      mc('¿Qué clase es el modificador?', ['.boton--grande', '.boton__grande', '.boton', '.boton_grande'], 0, 'Los modificadores se separan con dos guiones.'),
    ]},
    { id: 'l3', title: 'Reto: rendimiento, Lighthouse y despliegue', intro:
`**Lighthouse** (en las DevTools de Chrome) audita rendimiento, accesibilidad, buenas prácticas y SEO con una puntuación de 0 a 100.

Mejoras habituales:
- Imágenes del tamaño real y en formatos modernos (WebP, AVIF).
- Minificar CSS y JS, y cargar scripts con \`defer\`.
- Carga diferida de lo que no se ve.

Un sitio estático se **despliega** subiendo sus archivos a un hosting (GitHub Pages, Netlify...) que te da una URL pública.`, ex: [
      mc('¿Qué mide Lighthouse?', ['Rendimiento, accesibilidad, buenas prácticas y SEO', 'Solo la velocidad del servidor', 'Solo el número de líneas de CSS', 'Los errores de JavaScript únicamente'], 0, 'Genera un informe con puntuaciones por categoría.'),
      fill('Carga el script sin bloquear el análisis del HTML.', '<script src="app.js" ___></script>', 'defer', 'defer descarga en paralelo y ejecuta al terminar de leer el HTML.'),
      pair('Empareja cada técnica con su beneficio.', [['Minificar', 'Archivos más pequeños'], ['Lazy loading', 'Carga diferida de imágenes'], ['WebP/AVIF', 'Imágenes más ligeras'], ['CDN', 'Servir desde un servidor cercano']], 'Cada técnica reduce el tiempo de carga.'),
      tf('Subir una imagen de 4000px y reducirla solo con CSS es buena práctica.', false, 'El navegador descarga todos los píxeles; hay que redimensionar el archivo.'),
      mc('¿Dónde puedes alojar gratis un sitio estático?', ['GitHub Pages o Netlify', 'Solo en tu propio ordenador', 'En el atributo alt', 'En un archivo .css'], 0, 'Ambos publican HTML, CSS y JS estáticos con una URL pública.'),
      order('Ordena el flujo para publicar tu landing.', ['Optimizar imágenes y minificar', 'Auditar con Lighthouse', 'Subir el proyecto a un hosting estático', 'Comprobar la URL pública'], 'Primero se optimiza y se audita; luego se publica y se verifica.'),
    ]},
  ]},
);
})();
