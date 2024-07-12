import {JSOX} from 'jsox';

//
import {createReactiveMap} from "@unite/reactive/ReactiveMap.ts";
import {makeReactiveObject} from "@unite/reactive/ReactiveObject.ts";
import {createReactiveSet} from "@unite/reactive/ReactiveSet.ts";
import {makeObjectAssignable} from "@unite/reactive/AssignObject.ts";
import {parse} from "svelte/compiler";
import {get} from "svelte/store";

//
import {settings} from "./CurrentState.ts";

//
import type {GridItemType, GridsStateType, GridPageType} from "@unite/grid/GridItemUtils.ts";

//
const isArrayLike = (a) => {
    return (
        a != null &&
        typeof (a[Symbol.iterator]) === 'function' &&
        typeof (a.length) === 'number' &&
        typeof (a) !== 'string'
    );
}

//
export const toMapSet = <K, V>(list) => {
    return createReactiveMap<K, V>(list.map(([id, list2]) => [id, createReactiveSet((isArrayLike(list2) ? Array.from(list2) : null) || [])]));
};

//
export const toMap = <K, V>(list) => {
    return createReactiveMap<K, V>(list.map((obj) => [obj.id, makeReactiveObject(obj)]));
};

//
export const fromMap = <K, V>(map: Map<K, V>): V[] => {
    return Array.from(map.values() || []);
};

//
export const layout: [number, number] = makeReactiveObject([settings.columns || 4, settings.rows || 8]);
export const size: [number, number] = makeReactiveObject([0, 0]);

/* TODO: makeObjectAssignable */
export const state: GridsStateType = makeReactiveObject(makeObjectAssignable({
    grids: toMap(JSOX.parse(localStorage.getItem("@gridsState") || "[]")),
    items: toMap(JSOX.parse(localStorage.getItem("@itemsState") || "[]")),
    lists: createReactiveMap<string, Set<string>>()
}));

//
settings?.["@subscribe"]?.((v) => {layout[0] = v;}, "columns");
settings?.["@subscribe"]?.((v) => {layout[1] = v;}, "rows");

//
size?.["@subscribe"]?.((v, p) => {
    for (const gp of state.grids.values()) {gp.size = size;};
    //localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids.values())));
});

//
layout?.["@subscribe"]?.((v, p) => {
    for (const gp of state.grids.values()) {gp.layout = layout;};
    localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids.values())));
});

//
state.grids?.["@subscribe"]?.(() => {
    localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids.values())));
});

//
state.items?.["@subscribe"]?.(() => {
    localStorage.setItem("@itemsState", JSOX.stringify(Array.from(state.items.values())));
});

//
state.grids.set("backup", {
    id: "backup",
    size: size,
    layout: layout,
    list: []
});

//
state.grids.set("main", state.grids.get("main") || makeReactiveObject({
    id: "main",
    size: size,
    layout: layout,
    list: ["settings", "import", "export"]
}));

//
state.lists = toMapSet(Array.from(state.grids?.values?.() || []).map((gs: GridPageType) => [gs?.id || "", gs?.list || []]));
state.lists?.["@subscribe"]?.((v, prop) => {
    const changed = state.grids.get(prop);
    if (changed) {
        changed.list = [...(v?.["@extract"] || v || [])];
        state.grids.set(prop, changed);
    }

    //
    localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids?.values() || v)));
});

//
state?.["@subscribe"]?.((v, prop) => {
    if (prop == "grids") localStorage.setItem("@gridsState", JSOX.stringify(Array.from(v?.values() || v)));
    if (prop == "items") localStorage.setItem("@itemsState", JSOX.stringify(Array.from(v?.values() || v)));
});

//
state.items.set("import", state.items.get("import") || makeReactiveObject({
    id: "import",
    cell: [1, 0],
    icon: "upload",
    label: "Import Data",
    pointerId: -1,
    action: "import-data",
    href: "#"
}));

//
state.items.set("export", state.items.get("export") || makeReactiveObject({
    id: "export",
    cell: [2, 0],
    icon: "download",
    label: "Export Data",
    pointerId: -1,
    action: "export-data",
    href: "#"
}));


//
state.items.set("settings", state.items.get("settings") || makeReactiveObject({
    id: "settings",
    cell: [0, 0],
    icon: "settings",
    label: "Settings",
    pointerId: -1,
    action: "open-settings",
    href: "#settings"
}));

//
const ls = state.lists.get("main");
ls.add("settings");
ls.add("import");
ls.add("export");
state.lists.set("main", ls);
