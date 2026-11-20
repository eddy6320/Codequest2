(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.bash.units.push(
  // ───────────── UNIDAD 6 ─────────────
  { id: 'u6', title: 'Scripts robustos', desc: 'Que tus scripts fallen bien y sean claros', lessons: [
    { id: 'l1', title: 'Modo estricto y trap', intro: L(
'Un buen script **falla rápido** y limpia lo que ensució:',
'',
'```bash',
'set -e            # sale si un comando falla',
'set -u            # error si usas una variable sin definir',
'set -o pipefail   # un pipeline falla si falla cualquiera de sus partes',
'trap \'rm -f "$tmp"\' EXIT   # se ejecuta al terminar',
'```',
'',
'`${x:-defecto}` usa un valor por defecto. `$?` guarda el código de salida del último comando (0 = éxito). `a || b` ejecuta `b` solo si `a` falla.'),
      ex: [
        out('¿Qué imprime?', L('set -e', 'echo uno', 'false', 'echo dos'), 'uno', 'Con set -e el script se detiene en el primer comando que falla (false).'),
        out('¿Qué imprime?', L('trap \'echo adios\' EXIT', 'echo hola'), 'hola\nadios', 'El trap de EXIT se ejecuta justo al terminar el script.'),
        out('¿Qué imprime?', L('set -u', 'echo "${x:-vacio}"'), 'vacio', 'Con :- se usa el valor por defecto aunque x no exista (y set -u no se queja).'),
        out('¿Qué imprime?', 'false || echo recuperado', 'recuperado', 'El comando tras || solo se ejecuta cuando el anterior falla.'),
        mc('¿Qué hace set -o pipefail?', ['El pipeline falla si cualquiera de sus comandos falla', 'Ignora los errores', 'Muestra cada comando', 'Cierra la terminal'], 0, 'Sin pipefail, solo cuenta el estado del último comando del pipeline.'),
        out('¿Qué imprime?', L('(exit 3)', 'echo $?'), '3', '$? guarda el código de salida del último comando: 3.'),
        tf('Con set -u, usar una variable no definida produce un error.', true, 'Ayuda a detectar errores de escritura en nombres de variables.'),
      ] },
    { id: 'l2', title: 'Arreglos y expansión de parámetros', intro: L(
'Bash tiene **arreglos**: `a=(x y z)`; `${a[1]}` es un elemento, `${a[@]}` todos y `${#a[@]}` la cantidad. Con `declare -A m` creas un arreglo **asociativo**.',
'',
'La **expansión de parámetros** transforma variables sin comandos externos:',
'',
'* `${f%.txt}` quita el sufijo · `${f##*/}` quita el prefijo hasta la última `/`',
'* `${#s}` longitud · `${s^^}` a mayúsculas · `${x:-d}` valor por defecto'),
      ex: [
        out('¿Qué imprime?', L('a=(x y z)', 'echo ${a[1]} ${#a[@]}'), 'y 3', 'El índice 1 es el segundo elemento y hay 3 elementos.'),
        out('¿Qué imprime?', L('f=informe.txt', 'echo ${f%.txt}'), 'informe', '% elimina el sufijo más corto que coincida con el patrón.'),
        out('¿Qué imprime?', L('f=/a/b/c.tar.gz', 'echo ${f##*/}'), 'c.tar.gz', '## elimina el prefijo más largo que termine en /, como basename.'),
        out('¿Qué imprime?', L('declare -A m', 'm[uno]=1', 'm[dos]=2', 'echo ${m[dos]}'), '2', 'Los arreglos asociativos se indexan por texto.'),
        out('¿Qué imprime?', L('s=hola', 'echo ${s^^} ${#s}'), 'HOLA 4', '^^ pasa a mayúsculas y # da la longitud.'),
        out('¿Qué imprime?', L('a=(1 2 3)', 'for n in "${a[@]}"; do', '  echo $((n * 2))', 'done'), '2\n4\n6', '"${a[@]}" recorre cada elemento por separado, incluso con espacios.'),
        pair('Empareja la expansión con su efecto', [['${x:-d}', 'valor por defecto'], ['${#x}', 'longitud'], ['${x%.txt}', 'quita sufijo'], ['${x^^}', 'a mayúsculas']], 'Evitan llamar a programas externos para tareas sencillas.'),
      ] },
    { id: 'l3', title: 'Reto: here-docs, sustitución y getopts', intro: L(
'* **Here-doc**: texto de varias líneas como entrada (`cat <<EOF ... EOF`); expande variables.',
'* **Sustitución de procesos** `<(cmd)` presenta la salida de un comando como si fuera un archivo: `diff <(cmd1) <(cmd2)`.',
'* **`getopts`** procesa opciones como `-a -b valor` (`OPTARG` guarda el valor).',
'* `read x y <<< "uno dos"` reparte una cadena en variables.',
'* `$(...)` sustituye por la salida de un comando; `[[ ... ]]` es la prueba ampliada de bash.'),
      ex: [
        out('¿Qué imprime?', L('n=5', 'cat <<EOF', 'valor=$n', 'EOF'), 'valor=5', 'El here-doc expande $n antes de pasarlo a cat.'),
        out('¿Qué imprime?', 'diff <(echo a) <(echo a) && echo iguales', 'iguales', 'diff no encuentra diferencias (código 0) y se ejecuta el echo.'),
        out('¿Qué imprime?', L('set -- -a -b x', 'while getopts "ab:" o; do', '  echo "$o=$OPTARG"', 'done'), 'a=\nb=x', 'La opción a no lleva valor; b: sí lo lleva y OPTARG vale x.'),
        out('¿Qué imprime?', L('read x y <<< "uno dos"', 'echo $y'), 'dos', 'read reparte las palabras entre las variables indicadas.'),
        mc('¿Qué hace $(comando)?', ['Sustituye por la salida del comando', 'Ejecuta en segundo plano', 'Define una función', 'Comenta la línea'], 0, 'Es la sustitución de comandos: x=$(date) guarda la fecha en x.'),
        out('¿Qué imprime?', 'echo $((7 % 3)) $((2 ** 5))', '1 32', 'La aritmética $(( )) calcula el resto (1) y la potencia (32).'),
        tf('[[ ]] es una extensión de bash y no existe en sh estricto.', true, '[ ] es el estándar POSIX; [[ ]] agrega patrones y operadores como &&.'),
      ] },
  ]}
);
})();
