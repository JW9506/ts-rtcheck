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
    unknownPerson;
    /*  // infers
        const unknownPerson: {
            name: string;
            age: number;
            phone: string | number;
        }
    */
});

(() => {
    const unknownPplList: unknown = [
        {
            name: 'lily',
            age: 15,
            phone: { brand: 'apple' },
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
            phone: ['number', 'object'],
        },
    ]);
    unknownPplList;
    /*  // infers:
        const unknownPplList: {
            name: number | string;
            age: number;
            phone: object | number;
        }[]
    */
})();

```
