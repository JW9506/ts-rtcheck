###

A Typescript runtime checker

```ts
import assert from 'assert';

export type isSameType<T, U> = (((a: T) => any) extends (a: U) => any ? true : never) &
    (((a: U) => any) extends (a: T) => any ? true : never);

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

(() => {
    const str: unknown = '456';
    AssertType(str, ['string', 'number']);
    const T: isSameType<typeof str, string | number> = true;
})();

(() => {
    const unknown: unknown = {
        name: 'bar',
        age: 1,
    };
    type Person = {
        name: string;
        age: number;
    };
    forceCast<Person, { age: string }>(unknown, (obj) => {
        obj.age = obj.age.toString();
    });
    const T: isSameType<typeof unknown.age, string> = true;
    const TT: isSameType<typeof unknown, { name: string; age: string }> = true;
})();
```
