type Primitives =
    | 'boolean'
    | 'number'
    | 'object'
    | 'string'
    | 'undefined'
    | 'function';

type ShiftArr<T> = T extends [_: any, ...rest: infer R]
    ? R
    : T extends string
    ? T
    : never;
type Inner<P> = P extends 'string'
    ? string
    : P extends 'number'
    ? number
    : P extends 'function'
    ? AnyFunction
    : P extends 'boolean'
    ? boolean
    : P extends 'undefined'
    ? undefined
    : P extends 'bigint'
    ? bigint
    : P extends 'object'
    ? Record<string, unknown>
    : never;

type Unwrap<T> = T extends any[] ? T[0] : T;
type PrimitivesTuple =
    | [Primitives, Primitives]
    | [Primitives, Primitives, Primitives]
    | [Primitives, Primitives, Primitives, Primitives]
    | [Primitives, Primitives, Primitives, Primitives, Primitives];

type MapPrimitive<P extends any[] | string | any, O = never> = {
    0: MapPrimitive<ShiftArr<P>, O | Inner<Unwrap<P>>>;
    1: O;
    2: Inner<P>;
}[P extends [] ? 1 : P extends string ? 2 : 0];

type Assert<S> = S extends [infer U]
    ? Array<
          {
              [W in keyof U]: MapPrimitive<U[W]>;
          }
      >
    : S extends Record<string, Primitives | PrimitivesTuple>
    ? {
          [W in keyof S]: MapPrimitive<S[W]>;
      }
    : MapPrimitive<[S]>;

type Keys<T> = T extends undefined
    ? Record<string, Primitives | PrimitivesTuple>
    : T extends Array<any>
    ? Array<Record<string, Primitives | PrimitivesTuple>>
    : {
          [K in keyof T]: Primitives | PrimitivesTuple;
      };

export type PowerPartial<T> = {
    [U in keyof T]?: T[U] extends object ? PowerPartial<T[U]> : T[U];
};

type FilterObject<T> = T extends Array<infer R>
    ? {
          [K in keyof R]: R[K] extends AnyFunction
              ? R[K]
              : R extends Record<string, any>
              ? PowerPartial<R[K]>
              : R[K];
      }
    : {
          [K in keyof T]: T[K] extends AnyFunction
              ? T[K]
              : T extends Record<string, any>
              ? PowerPartial<T[K]>
              : T[K];
      };

export type isSameType<T, U> = (((a: T) => any) extends (a: U) => any ? true : never) &
    (((a: U) => any) extends (a: T) => any ? true : never);

export type AnyFunction<T extends any[] = any[], R = any> = (...args: T) => R;

function errMsg(key: any, shape: any, obj: any, msg?: string) {
    return `${msg ? msg + ', ' : ''}${key} is expected to be of type "${
        Array.isArray(shape[key]) ? shape[key].join(' | ') : shape[key]
    }", got "${obj[key] === null ? null : typeof obj[key]}"`;
}

export function AssertType<
    U = undefined,
    T extends
        | Keys<U>
        | Primitives
        | Primitives[]
        | [Record<string, Primitives | Primitives[]>] = Keys<U>
>(
    obj: unknown,
    typeShape: T,
    msg?: string
): asserts obj is T extends Primitives
    ? MapPrimitive<[T]>
    : T extends Array<infer R>
    ? R extends Primitives
        ? Assert<R>
        : U extends undefined
        ? Assert<T>
        : U extends Array<infer R>
        ? Array<FilterObject<R>>
        : FilterObject<U>
    : U extends undefined
    ? Assert<T>
    : U extends Array<infer R>
    ? Array<FilterObject<R>>
    : FilterObject<U> {
    if (typeof obj !== 'object') {
        if (Array.isArray(typeShape)) {
            const flag = typeShape.some((type) => {
                if (type === 'object' && obj === null) {
                    return false;
                }
                return obj != null && typeof obj === type;
            });
            if (!flag) {
                throw new TypeError(
                    `${
                        msg ? msg + ', ' : ''
                    }Input is expected to be of type "${typeShape.join(
                        ' | '
                    )}", got "${obj === null ? null : typeof obj}"`
                );
            } else {
                return;
            }
        } else {
            if (typeof obj !== typeShape) {
                throw TypeError(
                    `${
                        msg ? msg + ', ' : ''
                    }Input is expected to be of type "${typeShape}", got "${
                        obj === null ? null : typeof obj
                    }"`
                );
            } else {
                return;
            }
        }
    }
    if (Array.isArray(obj) !== Array.isArray(typeShape))
        throw new TypeError(
            'Passed in value is expected to be of type "Array"'
        );
    const shape = (Array.isArray(typeShape)
        ? typeShape[0]
        : typeShape) as Record<string, Primitives | Primitives[]>;

    const checkOneObj = (obj: any) => {
        for (const key in shape) {
            if (Array.isArray(shape[key])) {
                const flag = (shape[key] as Primitives[]).some((type) => {
                    if (type === 'object' && obj[key] === null) {
                        return false;
                    }
                    return obj != null && typeof obj[key] === type;
                });
                if (!flag) {
                    throw new TypeError(errMsg(key, shape, obj, msg));
                }
            } else {
                if (
                    (shape[key] === 'object' && obj[key] === null) ||
                    obj == null ||
                    typeof obj[key] !== shape[key]
                ) {
                    throw new TypeError(errMsg(key, shape, obj, msg));
                }
            }
        }
    };

    if (Array.isArray(obj)) {
        const _obj = obj;
        for (obj of _obj) {
            checkOneObj(obj);
        }
    } else {
        checkOneObj(obj);
    }
}

export function isType<
    U = undefined,
    T extends
        | Keys<U>
        | Primitives
        | Primitives[]
        | [Record<string, Primitives | Primitives[]>] = Keys<U>
>(
    obj: unknown,
    typeShape: T
): obj is T extends Primitives
    ? MapPrimitive<[T]>
    : T extends Array<infer R>
    ? R extends Primitives
        ? Assert<R>
        : U extends undefined
        ? Assert<T>
        : U extends Array<infer R>
        ? Array<FilterObject<R>>
        : FilterObject<U>
    : U extends undefined
    ? Assert<T>
    : U extends Array<infer R>
    ? Array<FilterObject<R>>
    : FilterObject<U> {
    try {
        AssertType(obj, typeShape as any);
    } catch {
        return false;
    }
    return true;
}

export function isObject(obj: unknown): obj is Record<string, unknown> {
    return obj != null && typeof obj === 'object';
}

export function AssertObject(
    obj: unknown,
    msg?: string
): asserts obj is Record<string, unknown> {
    if (!(obj != null && typeof obj === 'object'))
        throw new TypeError(
            `${msg ? msg + ', ' : ''}Input is expected to be an object, got "${
                obj === null ? null : typeof obj
            }"`
        );
}

export function AssertExist<T extends any>(
    obj: T,
    msg?: string
): asserts obj is NonNullable<T> {
    if (obj == null)
        throw new TypeError(`${msg ? msg + ', ' : ''}Input doesn't exist`);
}

export function isExist<T extends any>(obj: T): obj is NonNullable<T> {
    return obj != null;
}

type TakeLastType<T, U> = U extends undefined ? T : Omit<T, keyof U> & U;
type RemoveKey<T, U> = U extends undefined
    ? T
    : T &
          {
              [K in keyof U]: any;
          };

export function forceCast<T, U = undefined>(
    obj: any,
    cb?: AnyFunction<[RemoveKey<T, U>]>
): asserts obj is TakeLastType<T, U> {
    cb?.(obj);
}
