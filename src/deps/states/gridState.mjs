import { makeWritableProperty } from "@states/writables.mjs"
import { readable, writable } from "svelte/store"

//
export const makeKeyMap = (array) => {
    return new Map(
        Object.entries(Object.groupBy(Array.from(array), ({ id }) => id)).map(
            ([id, [v]]) => [id, v]
        )
    );
};

//
export const unKeyMap = (map) => {
    return Array.from(map.values());
};

//
export const makeListMap = (listMap) => {
    return new Map(listMap);
};

//
export const unListMap = (listMap) => {
    return Array.from(listMap.entries());
};

//
export const exKey = (array) => {
    return array.filter((value, index, self) => {
        return index === self.findIndex((t) => t?.id === value?.id);
    });
};

//
export const currentState = {};

//
export const gridState = {
    gridPages: makeWritableProperty(currentState, "gridPages", {
        initial: exKey([
            ...(JSON.parse(localStorage.getItem("@pages") || "[]") || []),
            {
                id: "home-page",
                type: "icon-list",
            },
        ]),
        getter: makeKeyMap,
        setter(v) {
            const um = unKeyMap(v);
            if (um) {
                localStorage.setItem("@pages", JSON.stringify(um));
            }
            return um;
        },
    }),

    //
    iconItems: makeWritableProperty(currentState, "iconItems", {
        initial: exKey([
            ...(JSON.parse(localStorage.getItem("@icons") || "[]") || []),
            {
                id: "github",
                icon: "github",
                cellX: 0,
                cellY: 0,
                action: "open-link",
                href: "#",
                label: "GitHub",

                // surrogate field - used when edit
                //parent: "home-page"
            },
        ]),
        getter: makeKeyMap,
        setter(v) {
            const um = unKeyMap(v);
            if (um) {
                localStorage.setItem("@icons", JSON.stringify(um));
            }
            return um;
        },
    }),

    //
    iconLists: makeWritableProperty(currentState, "iconLists", {
        initial: exKey([
            ...(JSON.parse(localStorage.getItem("@lists") || "[]") || []),
            ["home-page", ["github"]],
        ]),
        getter: makeListMap,
        setter(v) {
            const um = unListMap(v);
            if (um) {
                localStorage.setItem("@lists", JSON.stringify(um));
            }
            return um;
        },
    }),
};

//
export const makeMap = (array) => {
    return new Map(
        Object.entries(Object.groupBy(Array.from(array), ({ id }) => id)).map(
            ([id, [v]]) => [id, v]
        )
    );
};

//
export const updateIcons = (cs = currentState) => {
    if (cs.iconItems) {
        currentState.iconItems = cs.iconItems; // ?? cs;
    }
};
export const updateGrids = (cs = currentState) => {
    if (cs.gridPages) {
        currentState.gridPages = cs.gridPages; // ?? cs;
    }
};
export const updateLists = (cs = currentState) => {
    if (cs.iconLists) {
        currentState.iconLists = cs.iconLists; // ?? cs;
    }
};

//
export const getIconState = (id = "github") => {
    return currentState.iconItems.get(id);
};

//
export const setIconState = ({ iconItem = null, id = null }) => {
    const iconOf = (iconItem ||= getIconState(idOf));
    const idOf = (id ||= iconItem.id);
    if (idOf && iconOf) {
        currentState.iconItems.set(idOf, iconOf);
    }
    updateIcons();
};

//
export const fieldNames = [
    "id",
    "icon",
    "label",
    "action",
    "href",
    "cellX",
    "cellY",
];

//
export const focusIconForEdit = (id = "github") => {
    const focusIconState = getIconState(id);
    const focusIconWrite = {};
    //const focusFieldSubscribe = {};

    //
    for (const f of fieldNames) {
        focusIconWrite[f] = writable(focusIconState[f]);
        focusIconWrite[f].subscribe((v) => {
            if (v != null) {
                focusIconState[f] = v;
                setIconState({ id, iconItem: focusIconState });
            }
        });
    }

    //
    const updatableIconLists = readable(focusIconState, (set) => {
        for (const f of fieldNames) {
            focusIconWrite[f].subscribe(() => {
                set?.(focusIconState);
            });
        }
    });

    //
    return {
        updatableIconLists,
        focusIconWrite, 
        focusIconState
    };;
};

//
/*export const fixSubscribe = (focusEdit) => {
    for (const f of fieldNames) {
        focusEdit.focusIconWrite[f].subscribe(focusEdit.focusFieldSubscribe[f]);
    }
    return focusEdit;
};
*/