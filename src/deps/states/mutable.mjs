import { writable } from "svelte/store";

const setter = (v) => {
    return v;
};

const getter = (v) => {
    return v;
};

//
export class RTMap {
    #dict = null;

    constructor(dict) {
        this.#dict = dict;
    }

    set(key) {
        const temp = new Map(this.#dict);
        this.#dict;
    }
}

//
export const makeMap = (array) => {
    return new Map(
        Object.entries(Object.groupBy(Array.from(array), ({ id }) => id)).map(
            ([id, [v]]) => [id, v]
        )
    );
};

//
export const makeIdMapped = (
    base = {},
    name,
    initial = null,
    whenSet = null
) => {
    const state = {
        w: writable(initial),
        v: makeMap(initial),
        s: (v) => {
            state.v = makeMap(v);
        },
    };

    //
    state.w.subscribe(state.s);
    if (whenSet) {
        state.w.subscribe(whenSet);
    }

    //
    Object.defineProperty(base, name, {
        configurable: true,
        get() {
            return state.v;
        },
        set(v) {
            state.set(Array.from(v.values()));
        },
    });

    //
    return state;
};

//
export const makeMapped = (base = {}, name, initial = null, whenSet = null) => {
    const state = {
        w: writable(initial),
        v: new Map(initial),
        s: (v) => {
            state.v = v;
        },
    };

    //
    state.w.subscribe(state.s);
    if (whenSet) {
        state.w.subscribe(whenSet);
    }

    //
    Object.defineProperty(base, name, {
        configurable: true,
        get() {
            return state.v;
        },
        set(v) {
            state.set(Array.from(v.entries()));
        },
    });

    //
    return state;
};
