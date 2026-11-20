# CodeQuest

App web progresiva (PWA) para aprender a programar con lecciones cortas, quizzes, vidas, XP, rachas, repaso espaciado y prueba de nivel. Sin dependencias ni paso de compilación: son archivos estáticos.

## Probarla en local
```
cd codequest
python3 -m http.server 8000      # abre http://localhost:8000
```
(El service worker y la instalación como app requieren http://localhost o HTTPS; con doble clic a `index.html` funciona pero sin modo offline.)

## Publicarla gratis (para promocionarla)
Sube la carpeta tal cual a cualquiera de estos (todos con HTTPS gratis): **Cloudflare Pages**, **Netlify** (arrastrar y soltar la carpeta), **GitHub Pages** o **Vercel**.
En el celular: abrir la URL → menú del navegador → "Añadir a pantalla de inicio" (se instala como app y funciona sin conexión).
Cuando cambies archivos, sube `V` en `sw.js` (`cq-v2`, …) para que los usuarios reciban la actualización.

## Contenido actual
14 lenguajes · 324 lecciones · 2 075 ejercicios, todo en español y de cero a avanzado:
Python (15 unidades) · JavaScript (13) · HTML y CSS (10) · SQL (10) · Java (10) · C (10) · TypeScript, C++, C#, Go, Rust, PHP, Kotlin y Bash (5 unidades cada uno).
Próximamente (ya visibles en la app, ver `roadmap.js`): Swift, Ruby, R y Dart.
Las salidas de los ejercicios de Python, JavaScript, SQL, Java, C, Go, Rust, PHP y Bash se comprobaron ejecutando el código real; las de Kotlin (no había compilador) y algunas de C#/C++/TypeScript hay que revisarlas con un experto antes de lanzar.

## Experiencia
Mascota animada (parpadea, celebra, se entristece), camino curvo con unidades fijas arriba, transiciones entre preguntas, combos, "+XP" flotante, estrellas y anillo de precisión animados, pantallas de celebración (racha, subida de nivel, unidad completada, logros), vibración y sonidos. Respeta "reducir movimiento" del sistema. Los estilos de animación están en `fx.css`.

## Añadir un lenguaje o lecciones
Lee `CONTENT_SPEC.md`. Un lenguaje = un archivo `content/<id>.js`. Luego:
1. `node validate.js content/<id>.js` (ejecuta tu código de ejemplo y verifica que las respuestas sean correctas; debe dar 0 errores).
2. Agrega `<script src="content/<id>.js">` en `index.html` y el archivo en `ASSETS` de `sw.js` (sube `V`); añade el id a `ORDER` en `app.js` y quítalo de `roadmap.js`.
Para ampliar un curso existente con más unidades usa `content/<id>.plus.js` (ver `CONTENT_SPEC.md`).
No renombres ids de unidades/lecciones ya publicadas: el progreso de los usuarios depende de ellos.

## Ejercicios que ejecutan código
JavaScript se ejecuta en el navegador (Web Worker, con límite de tiempo). Python usa Pyodide, que se descarga del CDN la primera vez que aparece un ejercicio de escribir código (necesita internet esa vez; si falla, el usuario puede omitirlo sin penalización).

## Siguientes pasos hacia monetización (cuando haya usuarios)
- Cuentas y sincronización de progreso (Firebase/Supabase) — hoy el progreso vive en el dispositivo (hay exportar/importar).
- Plan "Plus": vidas ilimitadas, sin anuncios, certificados, rutas de carrera, tutor con IA.
- Empaquetar para tiendas con Capacitor (Android/iOS) y cobrar con suscripciones de la tienda o Stripe en web.
- Ligas semanales y amigos (requieren backend).
- Comprueba que el nombre "CodeQuest" esté libre antes de lanzarlo; la mascota "Bit" es original.

## Mascotas (v1.2)
Pestaña **Mascota**: 5 especies kawaii (gato, conejo, dragón, pollito y el robot Bit) que se eligen y se pueden cambiar cuando quieras. Evolucionan por nivel (Cría → Joven → Adulta → Legendaria), se cuidan (comer, bañar, jugar con monedas que ganas aprendiendo) y se personalizan (colores y 9 accesorios, algunos se desbloquean por nivel). Su arte está en `pet.js`; la lógica de cuidado en `app.js` (`viewPet`). La mascota aparece también en lecciones, resultados y perfil. Estado guardado en `S.pet` y `S.coins`.

### v1.3
Misiones diarias (4 + regalo), minijuego "Atrapa" (3 partidas/día), especies Panda y Zorro, 3 accesorios nuevos y efectos propios de cada especie al hacer combo.

### v1.4
Nueva paleta violeta/rosa (variables en `styles.css`), animaciones por acción (comer, bañar, jugar, tocar), minijuegos Atrapa/Memoria/Simón, tienda (congelar racha, XP doble), cofre diario y cambio de especie 1 vez por semana.

### v1.5
Liga semanal (7 divisiones, ascenso/descenso, rivales simulados deterministas en `leagueRows`; sustituir por datos reales al tener servidor), identidad de marca (degradado `--grad`, tipografía redondeada del sistema, botones con brillo), foco accesible, avisos sin conexión y metadatos para compartir.

### v1.6
Minijuegos que usan el curso actual (`qaPool`, `pairPool`, `wordPool` en app.js): Corredor, Conducir, Plataformas, Burbujas, Conectar y Sopa de letras. Tope diario de 120 monedas por juegos.

### v1.7
Nodos del camino por tipo (★ lección, 💪 refuerzo, 🎁 cofre +25🪙, 🏆 fin de unidad +40🪙) con animaciones propias; calendario de racha (toca 🔥); la mascota se desmaya tras 24 h con hambre al máximo y revive con 1 lección o 150🪙 (no pierde nivel ni accesorios).

### v1.8
Bubble Shot real (canvas, rebotes, grupos de 3, burbujas flotantes, 💣 al responder bien), Ordena el código, Ahorcado, Puzzle de mascota. Pestañas: Aprender · Misiones (desafío mensual + diarios) · Liga · Mascota · Más (Tienda, Práctica, Perfil). Escudo de racha, cofre de racha y pestaña Amigos (pendiente de servidor).

### v1.9
Contenido: 6 lecciones nuevas de Python (u1-u6, antes del Reto) y 'Repaso mixto' automático en cada unidad de todos los lenguajes (content/extras.js). Animaciones: banners con brillo, mascota que respira, pestañas con rebote, confeti al completar unidad.

### v2.0
Mascota con volumen (sombreado SVG + inclinación 3D al tocar), comida arrastrable (10 alimentos, la mascota abre la boca), baño con jabón y regadera, fiesta de baile, 5 ranuras de ropa (cabeza, cara, cuello, cuerpo, espalda) con 13 prendas nuevas, pantalla de resultados con monedas animadas y fondos animados en los minijuegos.

### v2.1
100 prendas/accesorios (20 por segmento: cabeza, cara, cuello, cuerpo, espalda) generados por forma+color en pet.js; vista previa real de cada prenda; minijuegos con marco, mascota que reacciona y más animación; Python u7-u9 +1 lección y 'Desafío extra' automático por unidad.

### v2.2
Vestidor a pantalla completa (100 prendas por segmento), service worker con red primero (siempre la versión nueva), mascotas esponjosas con ojos grandes y brillo, compañero en el camino.

### v2.3
**Lugares** para la mascota (pestaña Mascota → Lugares): Naturaleza, Casa, Piscina y Playa se compran con monedas; Espacio se desbloquea en el nivel 6 (datos en `PLACES`, `app.js`; estilos `.place-*` en `fx.css`). Minijuegos más lentos (Corredor, Conducir, Plataformas, Burbujas) y con más tiempo para leer la explicación tras responder. Nuevo lenguaje **PSeInt / pseudocódigo** (`content/pseint.js`, 2 unidades, 6 lecciones; sube `V` en `sw.js` al ampliarlo).

### v2.4
Unidades nuevas: PSeInt u3 (arreglos, Segun, subprocesos), C# u6 (colecciones y LINQ), Go u6 (concurrencia), C++ u6 (STL) y TypeScript u6 (genéricos). Lugares de la mascota ampliados a 16.

### v2.5
- **Minijuegos ordenados**: los paneles de juego ya no se encogen ni se tapan entre sí (`.sheet>*{flex-shrink:0}` y estructura pregunta → tablero en `fx.css`). Bubble Shot reescrito: esferas con volumen, partículas, cañón, guía con rebote y tablero que se adapta al alto de la pantalla.
- **Contenido coherente con el nivel**: todos los juegos usan `unlockedFlat()` (lecciones completadas + la lección abierta); si aún no hay suficiente contenido el juego aparece con 🔒 (`gReady`). Se eliminaron las palabras de relleno que podían adelantar temas.
- **Mascotas más kawaii**: ojos grandes con brillo, sin anillo de iris, orejas y cachetes redondeados, cuernos suaves en Drako, sin rayas en la frente.
- **Evolución visible**: Cría (cascarón) → Joven (pañuelo) → Adulta (alas y aureola) → Legendaria (corona, alas grandes y aura). Se oculta lo que choque con prendas equipadas. Al evolucionar hay pantalla de antes/después.
- Más profundidad: tarjetas con inclinación, nodos con brillo, bloques y colinas con relieve, perspectiva en Corredor/Conducir.

### v2.6
Cuidados de la mascota rehechos (`care` en `app.js`, estilos en `fx.css`): **Comer** (la comida vuela a la boca, mastica con migajas, eructito y barra de hambre en vivo; 14 alimentos), **Bañar** (bañera con agua y patito, jabón, espuma, regadera, sacudida final con gotas y arcoíris), y 6 acciones nuevas: **Pelota** (la mascota persigue y cabecea), **Fiesta** (bola disco, ecualizador y pasos de baile distintos), **Mimar** (ojitos de corazón), **Cepillar** (quita los nudos), **Dormir** (noche, luna y Zzz; 1 vez cada 2 h) y **Foto** (cuenta regresiva, flash y foto instantánea). Nuevas caras en `pet.js`: `sleep` y `love`.

### v2.7 · Ampliación de contenido
+66 lecciones nuevas (≈400 ejercicios) en los 15 lenguajes; archivos `content/*.plus2.js` (y `bash/rust/php/kotlin.plus.js`). `node validate.js` ahora **ejecuta de verdad** los ejercicios `out` de Python, JS, **C, C++, Java, Bash, TypeScript y SQL** (SQLite) y compara con la respuesta; Go, Rust, PHP, Kotlin, C# y PSeInt no tienen compilador en el validador (se revisaron a mano).
