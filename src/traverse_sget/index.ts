let a = { b: { c: 'something', d: 'ddd', e: { f: 'fff' } }, c: 'test' };

type GetPath<T> = {
  [P in keyof T & string as T[P] extends object ? `${P}.${Path<T[P]> & string}` | `${P}` : P]: P;
};

type Path<T> = T extends object ?  keyof GetPath<T> : never;

function safe_get<T>(obj: T, ...path: Split<Path<T>>) {}
type Split<T> = T extends `${infer R}.${infer U}` ? [R, ...Split<U>] : T extends string ? [T] : [];

safe_get(a, "b", "e", "f");
safe_get(a, 'b');
safe_get(a, 'c');


safe_get(a.b.c, "");