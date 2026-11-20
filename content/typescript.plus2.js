(window.CQ = window.CQ || { content: {}, roadmap: [] });
(function () {
const { mc, tf, fill, order, out, pair } = CQ.h;
const L = (...a) => a.join('\n');

CQ.content.typescript.units.push(
  // ───────────── UNIDAD 7 ─────────────
  { id: 'u7', title: 'Tipos avanzados', desc: 'Mapped, condicionales, plantillas y guardas', lessons: [
    { id: 'l1', title: 'Mapped y conditional types', intro: L(
'Los **tipos mapeados** transforman las propiedades de otro tipo:',
'',
'```ts',
'type Lectura<T> = { readonly [K in keyof T]: T[K] };',
'type Solo<T> = { [K in keyof T]: string };',
'```',
'',
'Los **tipos condicionales** eligen según un tipo: `T extends string ? "si" : "no"`.',
'',
'Los utilitarios (`Partial`, `Required`, `Readonly`, `Pick`, `Record`) están hechos con estas piezas. Todo esto existe **solo en compilación**: se borra al generar JavaScript.'),
      ex: [
        mc('¿Qué hace Partial<T>?', ['Vuelve opcionales todas las propiedades', 'Elimina propiedades', 'Las hace de solo lectura', 'Las vuelve strings'], 0, 'Partial<T> añade ? a cada propiedad de T.'),
        out('¿Qué imprime?', L('type Solo<T> = { [K in keyof T]: string };', 'const x: Solo<{ a: number }> = { a: "hola" };', 'console.log(x.a);'), 'hola', 'El tipo mapeado cambia el tipo de a de number a string.'),
        out('¿Qué imprime?', L('type EsString<T> = T extends string ? "si" : "no";', 'const v: EsString<string> = "si";', 'console.log(v);'), 'si', 'string extiende string, así que el tipo resultante es "si".'),
        fill('Completa el tipo mapeado de solo lectura', 'type Lectura<T> = { readonly [K ___ keyof T]: T[K] };', 'in', 'La sintaxis [K in keyof T] recorre cada nombre de propiedad.'),
        tf('Los tipos condicionales se evalúan mientras el programa se ejecuta.', false, 'Se resuelven al compilar; en JavaScript no queda rastro.'),
        out('¿Cuántas claves tiene r?', L('type R = Record<"a" | "b", number>;', 'const r: R = { a: 1, b: 2 };', 'console.log(Object.keys(r).length);'), '2', 'Record<"a" | "b", number> exige exactamente las claves a y b.'),
        pair('Empareja el utilitario con su efecto', [['Partial<T>', 'todas opcionales'], ['Required<T>', 'todas obligatorias'], ['Readonly<T>', 'solo lectura'], ['Pick<T, K>', 'elige propiedades']], 'Son transformaciones comunes ya incluidas en TypeScript.'),
      ] },
    { id: 'l2', title: 'Template literals, infer y as const', intro: L(
'* **Template literal types**: `` type Ev = `on${"Click" | "Hover"}` `` produce `"onClick" | "onHover"`.',
'* **`as const`** congela un valor: los literales se vuelven tipos exactos y los arreglos, `readonly`.',
'* **`infer`** extrae un tipo dentro de uno condicional: `T extends (...a: any[]) => infer R ? R : never`.',
'* **`satisfies`** comprueba que un valor cumple un tipo **sin ensancharlo**.',
'* `keyof T` es la unión de los nombres de propiedades de `T`.'),
      ex: [
        out('¿Qué imprime?', L('type Ev = `on${"Click" | "Hover"}`;', 'const e: Ev = "onClick";', 'console.log(e);'), 'onClick', 'El tipo Ev admite "onClick" y "onHover" y nada más.'),
        out('¿Qué imprime?', L('const dias = ["lun", "mar"] as const;', 'type Dia = typeof dias[number];', 'const d: Dia = "mar";', 'console.log(d);'), 'mar', 'as const convierte el arreglo en una tupla de literales; Dia es "lun" | "mar".'),
        out('¿Qué imprime?', L('type Ret<T> = T extends (...a: any[]) => infer R ? R : never;', 'const n: Ret<() => number> = 5;', 'console.log(n);'), '5', 'infer captura el tipo de retorno (number) de la función.'),
        mc('¿Qué efecto tiene as const?', ['Vuelve literales exactos y readonly', 'Convierte a string', 'Hace el valor opcional', 'Lo borra'], 0, 'Evita que "mar" se ensanche a string y que el arreglo sea modificable.'),
        out('¿Qué imprime?', L('const cfg = { port: 80 } satisfies Record<string, number>;', 'console.log(cfg.port);'), '80', 'satisfies valida la forma y conserva el tipo preciso del objeto.'),
        tf('keyof T produce la unión de los nombres de las propiedades de T.', true, 'Para { a: 1, b: 2 } produce "a" | "b".'),
        fill('Congela el arreglo con la aserción adecuada', 'const x = ["a", "b"] ___ const;', 'as', 'La sintaxis es valor as const.'),
      ] },
    { id: 'l3', title: 'Reto: uniones discriminadas y guardas', intro: L(
'Una **unión discriminada** usa una propiedad literal común (`t: "c" | "q"`) para que TypeScript sepa qué variante tienes tras comprobarla (*narrowing*).',
'',
'Una **guarda de tipo** es una función con `x is T`; una **función de aserción** usa `asserts x is T` y lanza error si no se cumple. `unknown` te obliga a comprobar antes de usar el valor. `never` sirve para comprobar que un `switch` cubre todos los casos.'),
      ex: [
        out('¿Qué imprime?', L('type F = { t: "c"; r: number } | { t: "q"; l: number };', 'function area(f: F): number {', '  return f.t === "c" ? 3 * f.r * f.r : f.l * f.l;', '}', 'console.log(area({ t: "q", l: 4 }));'), '16', 'Al comprobar f.t, TypeScript sabe qué propiedades existen en cada rama.'),
        out('¿Qué imprime?', L('function esNum(x: unknown): x is number { return typeof x === "number"; }', 'const v: unknown = 5;', 'if (esNum(v)) console.log(v + 1);'), '6', 'La guarda convierte v de unknown a number dentro del if.'),
        out('¿Qué imprime?', L('function debeSerTexto(x: unknown): asserts x is string {', '  if (typeof x !== "string") throw new Error("no");', '}', 'const v: unknown = "ok";', 'debeSerTexto(v);', 'console.log(v.length);'), '2', 'Tras la aserción, TypeScript trata v como string.'),
        mc('¿Para qué sirve never en un switch exhaustivo?', ['Detecta casos que se olvidaron al añadir variantes', 'Acelera el código', 'Convierte a string', 'Evita los break'], 0, 'Si queda una variante sin tratar, su tipo ya no es never y el compilador marca error.'),
        tf('unknown obliga a comprobar el tipo antes de usar el valor.', true, 'A diferencia de any, no permite operar sin antes acotar el tipo.'),
        out('¿Qué imprime?', L('const o = { a: 1 };', 'type K = keyof typeof o;', 'const k: K = "a";', 'console.log(k);'), 'a', 'typeof o da el tipo del objeto y keyof extrae sus claves: "a".'),
      ] },
  ]}
);
})();
