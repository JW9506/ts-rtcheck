import {
    AnyFunction,
    AssertExist,
    AssertType,
    isExist,
    isObject,
    isType,
} from './typeLib';
import assert from 'assert';

const unknownObj: unknown = {
    a: '123',
    b: 456,
    c: {
        d: 9,
        e: '10',
    },
};

interface Book {
    title: string;
    year: number;
    AFun: AnyFunction;
    Anull: { secret: string };
    author?: string;
}

const unknownData: unknown = {
    title: 'Lovely',
    year: 2020,
    Anull: { secret: '456' },
    AFun() {
        console.log('AFun!');
    },
};

if (
    isType<Book>(unknownData, {
        title: 'string',
        year: 'number',
        AFun: 'function',
        Anull: 'object',
    })
) {
    console.log(unknownData.title);
    console.log(unknownData.year);
    console.log(unknownData.author);
    console.log(unknownData.Anull.secret?.charAt(2));
    unknownData.AFun();
}

if (isType(unknownObj, { a: 'string', b: 'number' })) {
    console.log(unknownObj.a.charAt(1));
    console.log(unknownObj.b + 1);
}

if (
    isObject(unknownObj) &&
    isObject(unknownObj.c) &&
    isType(unknownObj.c, { d: 'number', e: 'string' })
) {
    console.log(unknownObj.c.d + 123);
    console.log(unknownObj.c.e.charAt(1));
}

console.log('Separator --------');
if (isType(unknownObj, { a: 'string', b: 'number', c: 'object' })) {
    if (isType(unknownObj.c, { d: 'number' })) {
        console.log(unknownObj.c.d * 10);
    }
}

AssertType(unknownObj, { a: 'string' });

console.log(unknownObj.a);

interface Person {
    name: string;
    age: number;
    phone: { brand: string };
}

assert.throws(() => {
    const unknownPerson: unknown = {
        name: 'jacky',
        age: 13,
        phone: { brand: 'apple' },
    };
    AssertType(unknownPerson, {
        name: 'number',
        age: 'number',
        phone: 'number',
    });
    unknownPerson.phone + 1;
});

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
    unknownPerson.phone;
});

assert.throws(() => {
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
    ];
    AssertType<Array<Person>>(unknownPplList, [
        {
            name: 'string',
            age: 'number',
            phone: 'number',
        },
    ]);
});

(() => {
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
    ];
    AssertType<Array<Person>>(unknownPplList, [
        {
            name: 'string',
            age: 'number',
            phone: 'object',
        },
    ]);
})();

assert.throws(() => {
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
    ];

    AssertType<[{ name: string; age: number; phone: number }]>(unknownPplList, [
        {
            name: 'string',
            age: 'number',
            phone: 'number',
        },
    ]);
    unknownPplList;
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
})();

assert.throws(() => {
    const unknown: unknown = {
        a: null,
    };
    AssertType(unknown, {
        a: ['number', 'string', 'undefined', 'object'],
    });
    console.log(unknown.a);
});

assert.throws(() => {
    const unknown: unknown = {
        a: null,
    };
    AssertType(unknown, {
        a: 'object',
    });
    console.log(unknown.a);
});

(() => {
    const unknown: unknown = {
        a: {},
    };
    AssertType(unknown, {
        a: 'object',
    });
    console.log('unknown.a is an object');
})();

assert.throws(() => {
    const unknown: unknown = {
        a: null,
    };
    AssertType(unknown, {
        a: ['number', 'object'],
    });
    console.log(unknown.a);
});
