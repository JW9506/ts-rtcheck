export type Primitives =
    | 'boolean'
    | 'number'
    | 'object'
    | 'string'
    | 'undefined'
    | 'function';

export type AnyFunction<T extends any[] = any[], R = void> = (...args: T) => R;

type ShiftArr<T extends string[] | string> = T extends [
    _: any,
    ...rest: infer R
]
    ? R
    : T;
type Inner<P> = P extends 'bigint'
    ? bigint
    : P extends 'boolean'
    ? boolean
    : P extends 'undefined'
    ? undefined
    : P extends 'number'
    ? number
    : P extends 'object'
    ? Record<string, unknown>
    : P extends 'string'
    ? string
    : never;

type Unwrap<T> = T extends any[] ? T[0] : T;

export type MapPrimitive<P extends any[] | string, O = never> = {
    0: MapPrimitive<ShiftArr<P>, O | Inner<Unwrap<P>>>;
    1: O;
    2: Inner<P>;
}[P extends [] ? 1 : P extends string ? 2 : 0];

export type Assert<S> = S extends Array<infer R>
    ? R extends Record<string, Primitives | [Primitives, Primitives]>
        ? Array<
              {
                  [W in keyof R]: MapPrimitive<R[W]>;
              }
          >
        : never
    : S extends Record<string, Primitives | [Primitives, Primitives]>
    ? {
          [W in keyof S]: MapPrimitive<S[W]>;
      }
    : never;

export type Keys<T> = T extends undefined
    ? Record<string, Primitives | [Primitives, Primitives]>
    : T extends Array<unknown>
    ? Array<Record<string, Primitives | [Primitives, Primitives]>>
    : T extends Array<infer R>
    ? Array<
          {
              [K in keyof R]: Primitives | [Primitives, Primitives];
          }
      >
    : {
          [K in keyof T]: Primitives | [Primitives, Primitives];
      };

export type FilterObject<T> = T extends Array<infer R>
    ? {
          [K in keyof R]: R[K] extends AnyFunction
              ? R[K]
              : R extends Record<string, any>
              ? Partial<R[K]>
              : R[K];
      }
    : {
          [K in keyof T]: T[K] extends AnyFunction
              ? T[K]
              : T extends Record<string, any>
              ? Partial<T[K]>
              : T[K];
      };

export type isSameType<T, U> = (T extends U ? true : false) &
    (U extends T ? true : false);

export function isType<U = undefined, T extends Keys<U> = Keys<U>>(
    obj: unknown,
    shape: T
): obj is U extends undefined
    ? Assert<T>
    : U extends Array<infer R>
    ? Array<FilterObject<R>>
    : FilterObject<U> {
    if (Array.isArray(obj) !== Array.isArray(shape)) return false;
    shape = Array.isArray(shape) ? shape[0] : shape;
    if (Array.isArray(obj)) {
        const _obj = obj;
        for (obj of _obj) {
            for (const key in shape) {
                if (
                    obj == null ||
                    (obj as any)[key] == null ||
                    typeof (obj as any)[key] !== shape[key]
                ) {
                    return false;
                }
            }
        }
    } else {
        for (const key in shape) {
            if (
                obj == null ||
                (obj as any)[key] == null ||
                typeof (obj as any)[key] !== shape[key]
            ) {
                return false;
            }
        }
    }
    return true;
}

export function AssertType<U = undefined, T extends Keys<U> = Keys<U>>(
    obj: unknown,
    shape: T,
    msg?: string
): asserts obj is U extends undefined
    ? Assert<T>
    : U extends Array<infer R>
    ? Array<FilterObject<R>>
    : FilterObject<U> {
    if (Array.isArray(obj) !== Array.isArray(shape))
        throw new TypeError(
            'Passed in value is expected to be of type "Array"'
        );
    shape = Array.isArray(shape) ? shape[0] : shape;
    if (Array.isArray(obj)) {
        const _obj = obj;
        for (obj of _obj) {
            for (const key in shape) {
                if (!Array.isArray(shape[key])) {
                    if (
                        obj == null ||
                        (obj as any)[key] == null ||
                        typeof (obj as any)[key] !== shape[key]
                    ) {
                        throw new TypeError(
                            `${
                                msg ? msg + ', ' : ''
                            }${key} is expected to be of type "${
                                shape[key]
                            }", got ${typeof (obj as any)[key]}`
                        );
                    }
                } else {
                    const flag = (shape[key] as any[]).some((_key) => {
                        return (
                            obj != null &&
                            (obj as any)[key] != null &&
                            typeof (obj as any)[key] === _key
                        );
                    });
                    if (!flag) {
                        throw new TypeError(
                            `${
                                msg ? msg + ', ' : ''
                            }${key} is expected to be of type "${(shape[
                                key
                            ] as any[]).join(
                                ' | '
                            )}", got ${typeof (obj as any)[key]}`
                        );
                    }
                }
            }
        }
    } else {
        for (const key in shape) {
            if (!Array.isArray(shape[key])) {
                if (
                    obj == null ||
                    (obj as any)[key] == null ||
                    typeof (obj as any)[key] !== shape[key]
                ) {
                    throw new TypeError(
                        `${
                            msg ? msg + ', ' : ''
                        }${key} is expected to be of type "${
                            shape[key]
                        }", got ${typeof (obj as any)[key]}`
                    );
                }
            } else {
                const flag = (shape[key] as any[]).some((_key) => {
                    return (
                        obj != null &&
                        (obj as any)[key] != null &&
                        typeof (obj as any)[key] === _key
                    );
                });
                if (!flag) {
                    throw new TypeError(
                        `${
                            msg ? msg + ', ' : ''
                        }${key} is expected to be of type "${(shape[
                            key
                        ] as any[]).join(' | ')}", got ${typeof (obj as any)[
                            key
                        ]}`
                    );
                }
            }
        }
    }
}

export function isObject(obj: unknown): obj is Record<string, unknown> {
    return obj != null && typeof obj === 'object';
}

export function AssertObject(
    obj: unknown,
    msg?: string
): asserts obj is Record<string, unknown> {
    if (!(obj != null && typeof obj === 'object')) throw new TypeError(msg);
}

export function AssertExist<T extends any>(
    obj: T,
    msg?: string
): asserts obj is NonNullable<T> {
    if (obj == null) throw new TypeError(msg);
}

export function isExist<T extends any>(obj: T): obj is NonNullable<T> {
    return obj != null;
}
