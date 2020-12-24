###

A Typescript runtime checker

```ts
import assert from 'assert';

export type isSameType<T, U> = (T extends U ? true : false) & (U extends T ? true : false);

assert.throws(() => {
    const unknownPerson: unknown = {
        name: 'jacky',
        age: 13,
        phone: { brand: 'apple' },
    };
    AssertType(unknownPerson, {
        name: 'string',
        age: 'number',
        phone: ['number', 'string'],
    });
    /* // infers
        const unknownPerson: {
            name: string;
            age: number;
            phone: string | number;
        }
    */
    const T: isSameType<typeof unknownPerson, { name: string; age: number; phone: number | string }> = true;
});

assert.throws(() => {
    const unknownPplList: unknown = [
        {
            name: 'lily',
            age: '15',
            phone: '954',
        },
        {
            name: 5,
            age: 16,
            phone: { brand: 'samsung' },
        },
    ];

    AssertType<[{ name: number | string; age: number; phone: object | number }]>(unknownPplList, [
        {
            name: ['string', 'number'],
            age: 'number',
            phone: ['string', 'object'],
        },
    ]);
    /* // infers
        const unknownPplList: {
            name: number | string;
            age: number;
            phone: object | number;
        }[]
    */
    const T: isSameType<typeof unknownPplList, { name: number | string; age: number; phone: object | number }[]> = true;
});

(() => {
    const unknown: unknown = '456';
    if (isType(unknown, 'string')) {
        unknown.toUpperCase();
    }
    AssertType(unknown, 'string');
    const T: isSameType<typeof unknown, string> = true;
})();

assert.throws(() => {
    const unknownPplList: unknown = [{ name: 'bart' }];

    AssertType(unknownPplList, [
        {
            name: ['string', 'number'],
            foo: ['object', 'number'],
        },
    ]);
    const T: isSameType<
        typeof unknownPplList,
        { name: number | string; foo: Record<string, unknown> | number }[]
    > = true;
});

assert.throws(() => {
    const unknownPplList: unknown = [{ name: 'bart' }];

    AssertType<[{ bart: string }]>(unknownPplList, [
        {
            name: ['string', 'number'],
            foo: ['object', 'number'],
        },
    ]);
    const T: isSameType<typeof unknownPplList, { bart: string }[]> = true;
});

assert.throws(() => {
    const unknownPplList: unknown = [{ name: 'bart' }];

    AssertType<[{ name: { foo: { bart: { lisa: string } } } }]>(unknownPplList, [
        {
            name: 'object',
        },
    ]);
    unknownPplList[0].name.foo?.bart?.lisa;
    const T: isSameType<typeof unknownPplList, { name: { foo?: { bart?: { lisa?: string } } } }[]> = true;
});

(() => {
    const unknown: unknown = {
        name: 'bar',
    };
    type Person = {
        name: string;
        age: number;
    };
    forceCast<Person>(unknown, (obj) => {
        obj.age = 123;
    });
    const T: isSameType<typeof unknown.age, number> = true;
    const TT: isSameType<typeof unknown, Person> = true;
})();
```
