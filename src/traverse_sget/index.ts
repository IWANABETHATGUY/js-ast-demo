let a = { b: { c: 'something', d: 'ddd', e: {f: 'fff'} }, c: 'test' };

type key<T> = keyof T;
type s = key<typeof a>;
// type Path<T> = T extends object ? `${TT<T> & string}` : '';
type Path<T> = keyof { [P in keyof T & string as T[P] extends object ? `${P}.${Path<T[P]> & string}` | `${P}` : `${P}`]: P };

type res = Path<typeof a>;

function safe_get<T>(obj: T, ...path: Split<Path<T>>) {

}
type Split<T> = T extends `${infer R}.${infer U}` ? [R, ...Split<U>]  : T extends string ? [T] : [];

// @ts-expect-error
safe_get(a, "b", "d", "f")
safe_get(a, "b", "e", "f")
safe_get(a, "c")
