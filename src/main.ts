type Primitives = 'boolean' | 'number' | 'object' | 'string' | 'undefined'

type ShapeType = Record<string, Primitives>

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
  : undefined

type H<S extends ShapeType> = {
  [W in keyof S]: MapPrimitive<S[W]>
}

function AssertType<T extends ShapeType>(obj: unknown, shape: T): obj is H<T> {
  for (const key in shape) {
    if (obj == null || typeof (obj as any)[key] !== shape[key]) {
      return false
    }
  }
  return true
}

function AssertObject(obj: unknown): obj is Record<string, unknown> {
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

if (AssertType(unknownObj, { a: 'string', b: 'number' })) {
  console.log(unknownObj.a.charAt(1))
  console.log(unknownObj.b + 1)
}

if (
  AssertObject(unknownObj) &&
  AssertObject(unknownObj.c) &&
  AssertType(unknownObj.c, { d: 'number', e: 'string' })
) {
  console.log(unknownObj.c.d + 123)
  console.log(unknownObj.c.e.charAt(1))
}
