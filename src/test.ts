import { AnyFunction, AssertType, isObject, isSameType, isType } from '.';
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
    const T: isSameType<
        typeof unknownPerson,
        { name: string; age: number; phone: number | string }
    > = true;
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
    const T: isSameType<
        typeof unknownPplList,
        { name: number | string; age: number; phone: object | number }[]
    > = true;
});

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

    AssertType<[{ name: { foo: { bart: { lisa: string } } } }]>(unknownPplList, [{
        name: 'object',
    }]);
    unknownPplList[0].name.foo?.bart?.lisa;
    const T: isSameType<
        typeof unknownPplList,
        { name: { foo?: { bart?: { lisa?: string } } } }[]
    > = true;
});

assert.throws(() => {
    const unknownPplList: unknown = [{ name: 'bart' }];

    AssertType<[{ name: { foo: { bart: { lisa: string } } } }]>(unknownPplList, [{
        name: 'object',
    }]);
    unknownPplList[0].name.foo?.bart?.lisa;
    const T: isSameType<
        typeof unknownPplList,
        { name: { foo?: { bart?: { lisa?: string } } } }[]
    > = true;
});

assert.throws(() => {
    const unknown: unknown = '456';
    AssertType(unknown, 'string');
    const T: isSameType<typeof unknown, string> = true;
});

assert.throws(() => {
    const unknown: unknown = '456';
    if (isType(unknown, 'string')) {
        unknown.toUpperCase();
    }
    AssertType(unknown, 'string');
    const T: isSameType<typeof unknown, string> = true;
});

assert.throws(() => {
    const unknown: unknown = {
        a: null,
    };
    AssertType(unknown, {
        a: ['number', 'string', 'undefined', 'object'],
    });
    const T: isSameType<
        typeof unknown,
        { a: string | number | Record<string, unknown> | undefined }
    > = true;
});

assert.throws(() => {
    const unknown: unknown = {
        a: null,
    };
    AssertType(unknown, {
        a: 'object',
    });
    const T: isSameType<typeof unknown, { a: Record<string, unknown> }> = true;
});

(() => {
    const unknown: unknown = {
        a: {},
    };
    AssertType(unknown, {
        a: 'object',
    });
    const T: isSameType<typeof unknown, { a: Record<string, unknown> }> = true;
})();

assert.throws(() => {
    const unknown: unknown = {
        a: null,
    };
    AssertType(unknown, {
        a: ['number', 'object'],
    });
    const T: isSameType<
        typeof unknown,
        { a: number | Record<string, unknown> }
    > = true;
});
