(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.c.units.push(
  // ───────────── UNIDAD 11 ─────────────
  { id: 'u11', title: 'Bits y máscaras', desc: 'Trabaja directamente con los bits', lessons: [
    { id: 'l1', title: 'AND, OR, XOR y NOT', intro: L(
'Los operadores **bit a bit** actúan sobre cada bit de un entero:',
'',
'```c',
'6 & 3   // 110 & 011 = 010 → 2   (AND)',
'6 | 3   // 110 | 011 = 111 → 7   (OR)',
'6 ^ 3   // 110 ^ 011 = 101 → 5   (XOR)',
'~x      // invierte todos los bits',
'```',
'',
'No los confundas con `&&` y `||`, que trabajan con verdadero/falso y devuelven 0 o 1.'),
      ex: [
        out('¿Qué imprime?', 'printf("%d\\n", 6 & 3);', '2', '110 AND 011 = 010, que es 2.'),
        out('¿Qué imprime?', 'printf("%d\\n", 6 | 3);', '7', '110 OR 011 = 111, que es 7.'),
        out('¿Qué imprime?', 'printf("%d\\n", 6 ^ 3);', '5', 'XOR da 1 solo donde los bits difieren: 101 = 5.'),
        mc('¿Qué operador invierte todos los bits de un entero?', ['~', '!', '^', '&'], 0, '~ es el NOT bit a bit; ! es la negación lógica.'),
        tf('& y && hacen exactamente lo mismo.', false, '& opera bit a bit; && evalúa condiciones lógicas con cortocircuito.'),
        pair('Empareja el operador con su nombre', [['&', 'AND bit a bit'], ['|', 'OR bit a bit'], ['^', 'XOR bit a bit'], ['~', 'NOT bit a bit']], 'Cada uno combina o invierte los bits de sus operandos.'),
        out('¿Qué imprime?', 'printf("%d %d\\n", 5 & 1, 4 & 1);', '1 0', 'x & 1 vale 1 si x es impar (su último bit es 1) y 0 si es par.'),
      ] },
    { id: 'l2', title: 'Desplazamientos y máscaras', intro: L(
'`<<` y `>>` desplazan los bits: `x << n` equivale a multiplicar por 2ⁿ y `x >> n` a dividir entre 2ⁿ.',
'',
'Con ellos armas **máscaras** para manejar banderas:',
'',
'```c',
'flags |= (1 << 2);       // encender el bit 2',
'flags &= ~(1 << 2);      // apagar el bit 2',
'flags ^= (1 << 2);       // invertir el bit 2',
'if (flags & (1 << 2)) {} // ¿está encendido?',
'(x >> n) & 1             // valor del bit n',
'```'),
      ex: [
        out('¿Qué imprime?', 'printf("%d\\n", 1 << 3);', '8', '1 desplazado 3 posiciones es 1000 en binario = 8.'),
        out('¿Qué imprime?', 'printf("%d\\n", 40 >> 2);', '10', 'Desplazar 2 a la derecha divide entre 4.'),
        out('¿Qué imprime?', L('int f = 0;', 'f |= 1 << 2;', 'f |= 1;', 'printf("%d\\n", f);'), '5', 'Se encienden los bits 2 y 0: 100 | 001 = 101 = 5.'),
        out('¿Qué imprime?', L('int x = 13;', 'printf("%d\\n", (x >> 2) & 1);'), '1', '13 es 1101; desplazado 2 queda 11 y el último bit es 1.'),
        out('¿Qué imprime?', L('unsigned x = 15;', 'x &= ~(1u << 1);', 'printf("%u\\n", x);'), '13', 'Se apaga el bit 1 de 1111 y queda 1101 = 13.'),
        mc('Sin desbordar, ¿a qué equivale x << 1?', ['x * 2', 'x + 2', 'x / 2', 'x * 1'], 0, 'Desplazar a la izquierda un bit duplica el valor.'),
        fill('Comprueba si el bit 2 de flags está encendido', 'int activo = (flags ___ 4) != 0;', '&', 'flags & 4 conserva solo el bit 2; si no es cero, está encendido.'),
      ] },
    { id: 'l3', title: 'Reto: hexadecimal y ancho fijo', intro: L(
'Cada dígito **hexadecimal** equivale a 4 bits: `0xFF` = `11111111`. Se imprime con `%x`.',
'',
'`<stdint.h>` ofrece tipos de ancho exacto: `uint8_t` (0‑255), `uint16_t`, `uint32_t`, `int32_t`... Los **sin signo** hacen "vuelta al inicio" al desbordar (aritmética módulo 2ⁿ), mientras que el desbordamiento de un `int` con signo es **comportamiento indefinido**.'),
      ex: [
        out('¿Qué imprime?', 'printf("%x\\n", 255);', 'ff', '%x imprime en hexadecimal minúscula: 255 = 0xff.'),
        out('¿Qué imprime?', 'printf("%d\\n", 0x1F);', '31', '0x1F = 1·16 + 15 = 31.'),
        out('¿Qué imprime?', L('uint8_t a = 250;', 'a += 10;', 'printf("%d\\n", a);'), '4', '260 no cabe en 8 bits: 260 mod 256 = 4.'),
        out('¿Cuántos bits en 1 tiene 29?', L('unsigned n = 29;', 'int c = 0;', 'while (n) {', '    c += n & 1;', '    n >>= 1;', '}', 'printf("%d\\n", c);'), '4', '29 = 11101 en binario: cuatro bits encendidos.'),
        mc('¿Por qué el hexadecimal es cómodo para hablar de bits?', ['Cada dígito hex equivale a 4 bits', 'Ocupa menos memoria', 'Es más rápido de calcular', 'Lo exige el estándar'], 0, '2 dígitos hex = 1 byte, así que es una forma compacta de leer binario.'),
        tf('El desbordamiento de un int con signo es comportamiento indefinido en C.', true, 'Solo los enteros sin signo tienen una vuelta definida (módulo 2ⁿ).'),
      ] },
  ]},

  // ───────────── UNIDAD 12 ─────────────
  { id: 'u12', title: 'Matrices y cadenas a fondo', desc: 'Arreglos 2D y la biblioteca de texto', lessons: [
    { id: 'l1', title: 'Arreglos de dos dimensiones', intro: L(
'Una matriz es un arreglo de arreglos: `int m[filas][columnas];`',
'',
'```c',
'int m[2][3] = { {1, 2, 3}, {4, 5, 6} };',
'm[1][2]            // fila 1, columna 2 → 6',
'sizeof(m) / sizeof(m[0])   // número de filas',
'```',
'',
'Se recorre con dos bucles anidados. En memoria las filas están **contiguas**, una tras otra.'),
      ex: [
        out('¿Qué imprime?', L('int m[2][3] = { {1, 2, 3}, {4, 5, 6} };', 'printf("%d\\n", m[1][2]);'), '6', 'Fila 1 (la segunda), columna 2 (la tercera): 6.'),
        out('¿Qué imprime?', L('int m[2][2] = { {1, 2}, {3, 4} };', 'int s = 0;', 'for (int i = 0; i < 2; i++)', '    for (int j = 0; j < 2; j++)', '        s += m[i][j];', 'printf("%d\\n", s);'), '10', 'Suma de todos los elementos: 1+2+3+4.'),
        mc('En int m[3][4], ¿cuántas filas hay?', ['3', '4', '12', '7'], 0, 'El primer índice es el número de filas y el segundo el de columnas.'),
        out('¿Cuántas filas calcula?', L('int m[2][3];', 'printf("%zu\\n", sizeof(m) / sizeof(m[0]));'), '2', 'sizeof(m) es el total y sizeof(m[0]) el tamaño de una fila.'),
        fill('Muestra el 3 (fila 1, columna 0)', 'int t[2][2] = { {1, 2}, {3, 4} };\nprintf("%d", t[___][0]);', '1', 'El 3 está en la segunda fila, índice 1.'),
        out('¿Qué imprime?', L('int m[3][3] = { {1,0,0}, {0,1,0}, {0,0,1} };', 'int d = 0;', 'for (int i = 0; i < 3; i++)', '    d += m[i][i];', 'printf("%d\\n", d);'), '3', 'm[i][i] recorre la diagonal principal: 1+1+1.'),
        tf('C guarda las matrices fila por fila en memoria contigua.', true, 'Se llama orden "row-major".'),
      ] },
    { id: 'l2', title: 'string.h y ctype.h', intro: L(
'Funciones útiles de `<string.h>`:',
'',
'* `strlen(s)` longitud (sin el `\\0`) · `strcmp(a, b)` da 0 si son iguales',
'* `strcpy(destino, origen)` · `strcat(destino, origen)` · `strchr(s, c)` busca un carácter',
'',
'De `<ctype.h>`: `toupper`, `tolower`, `isdigit`, `isalpha`...',
'',
'Estas funciones **no revisan el tamaño** del destino: asegúrate de que quepa el texto y el `\\0`.'),
      ex: [
        out('¿Qué imprime?', 'printf("%zu\\n", strlen("hola"));', '4', 'strlen cuenta los caracteres sin el terminador \\0.'),
        out('¿Qué imprime?', L('char a[10] = "ab";', 'strcat(a, "cd");', 'printf("%s\\n", a);'), 'abcd', 'strcat añade "cd" al final de "ab".'),
        out('¿Qué imprime?', 'printf("%d\\n", strcmp("a", "b") < 0);', '1', '"a" va antes que "b", así que strcmp da un valor negativo y la comparación es 1.'),
        out('¿Qué imprime?', L('char s[] = "hola";', 'for (int i = 0; s[i]; i++)', '    s[i] = toupper(s[i]);', 'printf("%s\\n", s);'), 'HOLA', 'El bucle se detiene en el \\0 y convierte cada letra a mayúscula.'),
        mc('¿Qué función copia una cadena en otro arreglo?', ['strcpy', 'strlen', 'strcmp', 'strchr'], 0, 'strcpy(destino, origen) copia incluyendo el \\0.'),
        fill('Compara dos cadenas (igual si da 0)', 'if (___(a, b) == 0) printf("iguales");', 'strcmp', 'Para comparar contenido usa strcmp, no ==.'),
        out('¿Qué imprime?', L('char *p = strchr("hola mundo", \'m\');', 'printf("%s\\n", p);'), 'mundo', 'strchr devuelve un puntero a la primera m y desde ahí se imprime el resto.'),
      ] },
    { id: 'l3', title: 'Reto: formatear y trocear texto', intro: L(
'* `sprintf(buf, formato, ...)` escribe en un arreglo en vez de la pantalla; **`snprintf(buf, tamaño, ...)`** es más seguro porque limita los bytes.',
'* `atoi("42abc")` lee el número inicial (42). `strtol` además avisa de errores.',
'* `strtok(s, delimitadores)` va partiendo la cadena (la **modifica**): la primera llamada recibe `s`, las siguientes `NULL`.',
'* Un literal como `"hola"` **no debe modificarse**; para cambiarlo guárdalo en un arreglo `char s[] = "hola";`.'),
      ex: [
        out('¿Qué imprime?', L('char b[20];', 'sprintf(b, "%d-%d", 3, 7);', 'printf("%s\\n", b);'), '3-7', 'sprintf guarda el texto formateado en b.'),
        out('¿Qué imprime?', 'printf("%d\\n", atoi("42abc"));', '42', 'atoi lee los dígitos iniciales y se detiene en la primera letra.'),
        out('¿Qué imprime?', L('char s[] = "a,b,c";', 'char *t = strtok(s, ",");', 'while (t) {', '    printf("%s\\n", t);', '    t = strtok(NULL, ",");', '}'), 'a\nb\nc', 'strtok devuelve un trozo por llamada hasta quedarse sin ellos (NULL).'),
        mc('¿Por qué snprintf es más seguro que sprintf?', ['Limita cuántos bytes escribe', 'Es más rápido', 'Usa menos memoria', 'Imprime en pantalla'], 0, 'Con el tamaño del buffer evita escribir fuera de los límites.'),
        out('¿Qué imprime?', L('char s[] = "hola";', 's[0] = \'H\';', 'printf("%s\\n", s);'), 'Hola', 'Al ser un arreglo propio, sí se puede modificar.'),
        tf('Es seguro modificar un literal de cadena como "hola".', false, 'Los literales suelen estar en memoria de solo lectura: modificarlos es comportamiento indefinido.'),
        out('¿Cuántos bytes mide "año" según strlen (archivo en UTF‑8)?', 'printf("%d\\n", (int)strlen("año"));', '4', 'strlen cuenta bytes, no letras: la ñ ocupa 2 bytes en UTF‑8.'),
      ] },
  ]}
);
})();
