import {
  AnyFunction,
  AssertExist,
  AssertType,
  isExist,
  isObject,
  isType,
} from './typeLib'

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
  phone: { brand: string }
}

const unknownPerson: unknown = {
  name: 'jacky',
  age: 13,
  phone: { brand: 'apple' },
}

AssertType<Person>(unknownPerson, {
  name: 'string',
  age: 'number',
  phone: 'object',
})

console.log(`${unknownPerson.name} ${unknownPerson.age}`)

const unknownPplList: unknown = [
  {
    name: 'lily',
    age: 15,
    phone: { brand: 'apple' },
  },
  {
    name: 'booboo',
    age: 16,
    phone: { brand: 'samsung' },
  },
]

if (
  isType<Array<Person>>(unknownPplList, [
    {
      name: 'string',
      age: 'number',
      phone: 'object',
    },
  ])
) {
  unknownPplList.forEach((obj) => {
    AssertExist(obj.phone.brand)
    console.log(`${obj.name}, ${obj.age} ${obj.phone.brand}`)
  })
}

AssertType<Array<Person>>(unknownPplList, [
  {
    name: 'string',
    age: 'number',
    phone: 'object',
  },
])

unknownPplList.forEach((obj) => {
  if (isExist(obj.phone.brand)) {
    console.log(`${obj.name}, ${obj.age} ${obj.phone.brand}`)
  }
})
