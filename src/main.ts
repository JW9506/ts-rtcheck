import { AnyFunction, AssertType, isObject, isType } from './typeLib'

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
