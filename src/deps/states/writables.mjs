import { writable } from "svelte/store";

//
const nullFx = (v) => {
    return v;
};

//
export const makeWritableProperty = (
    base = {},
    name = "",
    { initial = null, setter = nullFx, getter = nullFx, afterSet = nullFx } = {}
) => {
    const state = {
        w: writable(initial),
        v: getter(initial),
    };

    //
    state.w.subscribe((v) => {
        afterSet?.((state.v = getter(v)));
    });

    //
    Object.defineProperty(base, name, {
        configurable: true,
        get() {
            return state.v;
        },
        set(v) {
            state.v = v;
            state.w.set(setter(v));
        },
    });

    //
    return state.w;
};
