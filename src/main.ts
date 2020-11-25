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
  ? Record<string, unknown>
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

type FilterObject<T> = {
  [K in keyof T]: T[K] extends AnyFunction
    ? T[K]
    : T extends Record<string, any>
    ? Partial<T[K]>
    : T[K]
}

function isType<U = undefined, T extends Keys<U> = Keys<U>>(
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

function AssertType<U = undefined, T extends Keys<U> = Keys<U>>(
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

function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj != null && typeof obj === 'object'
}

function AssertObject(
  obj: unknown,
  msg?: string
): asserts obj is Record<string, unknown> {
  if (!(obj != null && typeof obj === 'object')) throw new TypeError(msg)
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
  Anull: { secret: string }
  author?: string
}

const unknownData: unknown = {
  title: 'Lovely',
  year: 2020,
  Anull: { secret: '456' },
  AFun() {
    console.log('AFun!')
  },
}

if (
  isType<Book>(unknownData, {
    title: 'string',
    year: 'number',
    AFun: 'function',
    Anull: 'object',
  })
) {
  console.log(unknownData.title)
  console.log(unknownData.year)
  console.log(unknownData.author)
  console.log(unknownData.Anull.secret?.charAt(2))
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

console.log('Separator --------')
if (isType(unknownObj, { a: 'string', b: 'number', c: 'object' })) {
  if (isType(unknownObj.c, { d: 'number' })) {
    console.log(unknownObj.c.d * 10)
  }
}

AssertType(unknownObj, { a: 'string' })

console.log(unknownObj.a)

interface Person {
  name: string
  age: number
}

const unknownPerson: unknown = {
  name: 'jacky',
  age: 13,
}

AssertType<Person>(unknownPerson, {
  name: 'string',
  age: 'number',
})

console.log(`${unknownPerson.name} ${unknownPerson.age}`)
