import { writable } from "svelte/store";

//
const setter = (v) => {
    return v;
};

//
const getter = (v) => {
    return v;
};

//
export const makeWritableProperty = (
    base = {},
    name = "",
    { initial = null, setter = setter, getter = getter } = {}
) => {
    const state = {
        w: writable(initial),
        v: getter(initial),
        s: (v) => {
            state.v = getter(v);
        },
    };

    //
    state.w.subscribe(state.s);

    //
    Object.defineProperty(base, name, {
        configurable: true,
        get() {
            return state.v;
        },
        set(v) {
            state.w.set(setter(v));
            state.v = v;
        },
    });

    //
    return state.w;
};
