###

A Typescript runtime checker

```bash
yarn add ts-rtcheck -D
npm install ts-rtcheck -D
```

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

(() => {
    const unknown: unknown = ['foo', 123];
    AssertType(unknown, 'array');
    const T: isSameType<typeof unknown, unknown[]> = true;
    forceCast<Array<string | number>>(unknown);
    const TT: isSameType<typeof unknown, Array<string | number>> = true;
})();

(() => {
    const unknown: unknown = {
        name: 'bar',
        notes: ['foo', 'baz', 'foe'],
    };
    AssertType(unknown, {
        name: 'string',
        notes: 'array',
    });
    const T: isSameType<typeof unknown, { name: string; notes: unknown[] }> = true;
    forceCast<typeof unknown, { notes: string[] }>(unknown);
    const TT: isSameType<typeof unknown, { name: string; notes: string[] }> = true;
})();

(() => {
    const unknown: unknown = [
        {
            name: 'bar',
            notes: ['foo', 'baz', 'foe'],
        },
    ];
    AssertType(unknown, [
        {
            name: 'string',
            notes: 'array',
        },
    ]);
    const T: isSameType<typeof unknown, { name: string; notes: unknown[] }[]> = true;
})();

assert.throws(() => {
    const unknown: unknown = {
        name: 'bar',
        notes: {},
    };
    AssertType(unknown, {
        name: ['string', 'undefined'],
        notes: 'array',
    });
    const T: isSameType<typeof unknown, { name: string | undefined; notes: unknown[] }> = true;
    forceCast<PowerNonNullable<typeof unknown>>(unknown);
    const TT: isSameType<typeof unknown, { name: string; notes: {}[] }> = true;
});

(() => {
    const unknown: unknown = [
        {
            name: 'bart',
            diary: [{ detail: { rain: { afternoon: true } } }],
        },
    ];
    AssertType<
        [
            {
                name: string;
                diary: {
                    detail: {
                        page: number;
                        rain: { morning: boolean; afternoon: boolean };
                    };
                }[];
            }
        ]
    >(unknown, [
        {
            name: 'string',
            diary: 'array',
        },
    ]);
    const T: isSameType<
        typeof unknown,
        Array<{
            name: string;
            diary: Array<
                | PowerPartial<{
                      detail: {
                          page: number;
                          rain: { morning: boolean; afternoon: boolean };
                      };
                  }>
                | undefined
            >;
        }>
    > = true;
    unknown[0].diary[99]?.detail?.rain?.afternoon; // afternoon is boolean | undefined;
    assert(unknown[0].diary[0]?.detail?.rain?.afternoon === true);
    forceCast<PowerNonNullable<typeof unknown>>(unknown, (obj) => {
        obj.push({
            name: 'lisa',
            diary: [
                {
                    detail: {
                        page: 1,
                        rain: { morning: true, afternoon: true },
                    },
                },
            ],
        });
    });
    assert(unknown[1].diary[0].detail.rain.afternoon === true);
})();

(() => {
    const unknown: unknown = {
        name: ['a', 'b'],
    };
    try {
        AssertType(unknown, {
            name: 'object',
        });
        const T: isSameType<typeof unknown, { name: Record<string, unknown> }> = true;
    } catch (error) {
        assert(error.message === 'name is expected to be of type "object", got "array"');
    }
})();

(() => {
    const unknwon: unknown = ['a', 'b'];
    try {
        AssertType(unknwon, 'object');
    } catch (error) {
        assert(error.message === 'Input is expected to be of type "object", got "array"');
    }
})();

(() => {
    const unknown: unknown = [
        {
            name: 'bar',
            notes: ['foo', 'baz', 'foe'],
        },
    ];
    try {
        AssertType(unknown, [
            {
                name: 'string',
                notes: 'object',
            },
        ]);
        const T: isSameType<typeof unknown, { name: string; notes: Record<string, unknown> }[]> = true;
    } catch (error) {
        assert(error.message === 'notes is expected to be of type "object", got "array"');
    }
})();

(() => {
    const unknown: unknown = [
        {
            name: 'bar',
            notes: ['foo', 'baz', 'foe'],
        },
    ];
    try {
        AssertType(unknown, [
            {
                name: 'string',
                notes: ['object', 'string'],
            },
        ]);
        const T: isSameType<typeof unknown, { name: string; notes: Record<string, unknown> | string }[]> = true;
    } catch (error) {
        assert(error.message === 'notes is expected to be of type "object | string", got "array"');
    }
})();

(() => {
    const unknown: unknown = [
        {
            name: 'bar',
            notes: ['foo', 'baz', 'foe'],
        },
    ];
    AssertType(unknown, [
        {
            name: 'string',
            notes: ['object', 'array'],
        },
    ]);
    const T: isSameType<typeof unknown, { name: string; notes: Record<string, unknown> | unknown[] }[]> = true;
})();

(() => {
    const unknown: unknown = [
        {
            name: 'bar',
            notes: {},
        },
    ];
    AssertType(unknown, [
        {
            name: 'string',
            notes: ['object', 'array'],
        },
    ]);
    const T: isSameType<typeof unknown, { name: string; notes: Record<string, unknown> | unknown[] }[]> = true;
})();
```
