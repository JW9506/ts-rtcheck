###

A Typescript runtime checker

```ts
import assert from 'assert';

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
    const T: isSameType<
        typeof unknownPerson,
        { name: string; age: number; phone: number | string }
    > = true;
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

    AssertType<
        [{ name: number | string; age: number; phone: object | number }]
    >(unknownPplList, [
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
    const T: isSameType<
        typeof unknownPplList,
        { name: number | string; age: number; phone: object | number }[]
    > = true;
});

assert.throws(() => {
    const unknown: unknown = '456';
    if (isType(unknown, 'string')) {
        unknown.toUpperCase();
    }
    AssertType(unknown, 'string');
    const T: isSameType<typeof unknown, string> = true;
});


```
