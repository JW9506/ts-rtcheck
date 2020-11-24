type Primitives =
  | 'boolean'
  | 'number'
  | 'object'
  | 'string'
  | 'undefined'
  | 'function'

type AnyFunction<T extends any[] = any[], R = void> = (...args: T) => R

type MapPrimitive<P extends Primitives> = P extends 'bigint'
  ? bigint
  : P extends 'boolean'
  ? boolean
  : P extends 'number'
  ? number
  : P extends 'object'
  ? object
  : P extends 'string'
  ? string
  : P extends 'function'
  ? AnyFunction
  : undefined

type Assert<S extends Record<string, Primitives>> = {
  [W in keyof S]: MapPrimitive<S[W]>
}

type Keys<T> = T extends undefined
  ? Record<string, Primitives>
  : {
      [K in keyof T]: Primitives
    }

function isType<U = undefined, T extends Keys<U> = Keys<U>>(
  obj: unknown,
  shape: T
): obj is U extends undefined ? Assert<T> : U {
  for (const key in shape) {
    if (obj == null || typeof (obj as any)[key] !== shape[key]) {
      return false
    }
  }
  return true
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj != null && typeof obj === 'object'
}

const unknownObj: unknown = {
  a: '123',
  b: 456,
  c: {
    d: 9,
    e: '10',
  },
}

interface Book {
  title: string
  year: number
  AFun: AnyFunction
  author?: string
}

const unknownData: unknown = {
  title: 'Lovely',
  year: 2020,
  AFun() {
    console.log('AFun!')
  },
}

if (
  isType<Book>(unknownData, {
    title: 'string',
    year: 'number',
    AFun: 'function',
  })
) {
  console.log(unknownData.title)
  console.log(unknownData.year)
  console.log(unknownData.author)
  unknownData.AFun()
}

if (isType(unknownObj, { a: 'string', b: 'number' })) {
  console.log(unknownObj.a.charAt(1))
  console.log(unknownObj.b + 1)
}

if (
  isObject(unknownObj) &&
  isObject(unknownObj.c) &&
  isType(unknownObj.c, { d: 'number', e: 'string' })
) {
  console.log(unknownObj.c.d + 123)
  console.log(unknownObj.c.e.charAt(1))
}
