import {JSOX} from 'jsox';

//
import {createReactiveMap} from "@unite/reactive/ReactiveMap.ts";
import {makeReactiveObject} from "@unite/reactive/ReactiveObject.ts";
import {createReactiveSet} from "@unite/reactive/ReactiveSet.ts";
import {parse} from "svelte/compiler";
import {get} from "svelte/store";

//
import type {GridItemType, GridsStateType, GridPageType} from "@unite/grid/GridItemUtils.ts";

//
export const toMapSet = <K, V>(list) => {
    return createReactiveMap<K, V>(list.map(([id, list]) => [id, createReactiveSet(list)]));
};

//
export const toMap = <K, V>(list) => {
    return createReactiveMap<K, V>(list.map((obj) => [obj.id, makeReactiveObject(obj)]));
};

//
export const fromMap = <K, V>(map: Map<K, V>): V[] => {
    return Array.from(map.values());
};

//
export const layout: [number, number] = makeReactiveObject([4, 8]);
export const size: [number, number] = makeReactiveObject([0, 0]);

//
export const state: GridsStateType = makeReactiveObject({
    grids: toMap(JSOX.parse(localStorage.getItem("@gridsState") || "[]")),
    items: toMap(JSOX.parse(localStorage.getItem("@itemsState") || "[]")),
    lists: new Map<string, Set<string>>()
});

//
state.grids.set("backup", {
    id: "backup",
    size: size,
    layout: layout,
    list: []
});

//
state.grids.set("main", state.grids.get("main") || {
    id: "main",
    size: size,
    layout: layout,
    list: ["github"]
});

//
for (const gp of state.grids.values()) {
    gp.size = size;
    gp.layout = layout;
};

//
state.items.set("github", state.items.get("github") || {
    id: "github",
    cell: [0, 0],
    icon: "github",
    label: "GitHub",
    pointerId: -1
});


//
state.lists = toMapSet(Array.from(state.grids?.values?.() || []).map((gs: GridPageType) => [gs?.id || "", gs?.list || []]));

//
state.lists?.["@subscribe"]?.((v, prop) => {
    const changed = state.grids.get(prop);
    if (changed) {changed.list = v;}
});

//
layout?.["@subscribe"]?.(() => {
    requestAnimationFrame(() => {
        localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids.values())));
    });
});

//
state.grids?.["@subscribe"]?.(() => {
    requestAnimationFrame(() => {
        localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids.values())));
    });
});

//
state.items?.["@subscribe"]?.(() => {
    requestAnimationFrame(() => {
        localStorage.setItem("@itemsState", JSOX.stringify(Array.from(state.items.values())));
    });
});

//
state?.["@subscribe"]?.(() => {
    requestAnimationFrame(() => {
        localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids.values())));
        localStorage.setItem("@itemsState", JSOX.stringify(Array.from(state.items.values())));
    });
});
