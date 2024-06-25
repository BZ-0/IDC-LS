import { writable } from "svelte/store"

//
const nullFx = (v) => {
    return v;
};

//
class RWWrap {
    #wt = null;
    #gt = nullFx;
    #st = nullFx;

    //
    constructor(wt, {
        getter = nullFx, 
        setter= nullFx
    }) {
        this.#wt = wt;
        this.#gt = getter;
        this.#st = setter;
    }
    
    //
    subscribe(fx, ...args) {
        return this.#wt.subscribe((v)=>{
            fx(this.#gt(v));
        }, ...args);
    }
    
    //
    set(v, ...args) {
        this.#wt.set(this.#st(v), ...args);
    }

    //
    update(fx, ...args) {
        this.#wt.update((v, ...arg0)=>{
            return this.#st(fx(this.#gt(v), ...arg0));
        }, ...args);
    }
}

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
    })

    //
    state.w.set(setter(state.v));

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
    const wrap = (new RWWrap(state.w, {
        setter, getter
    }));

    //
    const accessPrefix = "@";

    //
    Object.defineProperty(base, `${accessPrefix}${name}`, {
        configurable: true,
        get() {
            return wrap;
        },
        set(v) {
            wrap.set(v);
        },
    });

    //
    return wrap;
};
