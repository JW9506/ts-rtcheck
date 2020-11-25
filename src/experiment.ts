import { Primitives, MapPrimitive, AnyFunction, isSameType } from './typeLib'

type Assert<S> = S extends Array<infer R>
  ? R extends Record<string, Primitives>
    ? Array<
        {
          [W in keyof R]: MapPrimitive<R[W]>
        }
      >
    : never
  : S extends Record<string, Primitives>
  ? {
      [W in keyof S]: MapPrimitive<S[W]>
    }
  : never

type Keys<T> = T extends undefined
  ? Record<string, Primitives>
  : T extends Array<infer R>
  ? Array<
      {
        [K in keyof R]: Primitives
      }
    >
  : {
      [K in keyof T]: Primitives
    }

type FilterObject<T> = T extends Array<infer R>
  ? {
      [K in keyof R]: R[K] extends AnyFunction
        ? R[K]
        : R extends Record<string, any>
        ? Partial<R[K]>
        : R[K]
    }
  : {
      [K in keyof T]: T[K] extends AnyFunction
        ? T[K]
        : T extends Record<string, any>
        ? Partial<T[K]>
        : T[K]
    }

// type g = Array<
//   {
//     [K: string]: Primitives
//   }
// >
// type gg = H<g>

function AssertType<U = undefined, T extends Keys<U> = Keys<U>>(
  obj: unknown,
  // shape: T | Array<T>,
  shape: T,
  msg?: string
): asserts obj is U extends undefined
  ? Assert<T>
  : U extends Array<infer R>
  ? Array<FilterObject<R>>
  : FilterObject<U> {
  if (Array.isArray(obj) !== Array.isArray(shape)) throw new TypeError(msg)
  shape = Array.isArray(shape) ? shape[0] : shape
  if (Array.isArray(obj)) {
    const _obj = obj
    for (obj of _obj) {
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
  } else {
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
}

const myUnknownData: unknown = {
  a: 'foo',
  b: 123,
}

AssertType(myUnknownData, { a: 'string', b: 'number' })
console.log(myUnknownData.b + 1)

const myUnknownDataList: unknown[] = [
  {
    a: 'foo',
    b: 123,
  },
]

AssertType<Array<{ a: string; b: number }>>(myUnknownDataList, [
  {
    a: 'string',
    b: 'number',
  },
])
myUnknownDataList
console.log(myUnknownDataList[0].b + 1)
