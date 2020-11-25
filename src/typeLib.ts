export type Primitives =
  | 'boolean'
  | 'number'
  | 'object'
  | 'string'
  | 'undefined'
  | 'function'

export type AnyFunction<T extends any[] = any[], R = void> = (...args: T) => R

export type MapPrimitive<P extends Primitives> = P extends 'bigint'
  ? bigint
  : P extends 'boolean'
  ? boolean
  : P extends 'number'
  ? number
  : P extends 'object'
  ? Record<string, unknown>
  : P extends 'string'
  ? string
  : P extends 'function'
  ? AnyFunction
  : undefined

export type Assert<S extends Record<string, Primitives>> = {
  [W in keyof S]: MapPrimitive<S[W]>
}

export type Keys<T> = T extends undefined
  ? Record<string, Primitives>
  : {
      [K in keyof T]: Primitives
    }

export type FilterObject<T> = {
  [K in keyof T]: T[K] extends AnyFunction
    ? T[K]
    : T extends Record<string, any>
    ? Partial<T[K]>
    : T[K]
}

export function isType<U = undefined, T extends Keys<U> = Keys<U>>(
  obj: unknown,
  shape: T
): obj is U extends undefined ? Assert<T> : FilterObject<U> {
  for (const key in shape) {
    if (
      obj == null ||
      (obj as any)[key] == null ||
      typeof (obj as any)[key] !== shape[key]
    ) {
      return false
    }
  }
  return true
}

export function AssertType<U = undefined, T extends Keys<U> = Keys<U>>(
  obj: unknown,
  shape: T,
  msg?: string
): asserts obj is U extends undefined ? Assert<T> : FilterObject<U> {
  for (const key in shape) {
    if (
      obj == null ||
      (obj as any)[key] == null ||
      typeof (obj as any)[key] !== shape[key]
    ) {
      throw new TypeError(msg)
    }
  }
}

export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj != null && typeof obj === 'object'
}

export function AssertObject(
  obj: unknown,
  msg?: string
): asserts obj is Record<string, unknown> {
  if (!(obj != null && typeof obj === 'object')) throw new TypeError(msg)
}
