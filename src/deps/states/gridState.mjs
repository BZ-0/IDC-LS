import { readable, writable } from "svelte/store";

//
export const settings = {
    columns: writable(
        parseInt(localStorage.getItem("@settings:@columns")) || 4
    ),
    rows: writable(parseInt(localStorage.getItem("@settings:@rows")) || 8),
    scaling: writable(
        parseFloat(localStorage.getItem("@settings:@scaling")) || 1.5
    ),
};

//
settings.columns.subscribe((value) => {
    localStorage.setItem("@settings:@columns", value);
});

//
settings.rows.subscribe((value) => {
    localStorage.setItem("@settings:@rows", value);
});

//
settings.scaling.subscribe((value) => {
    localStorage.setItem("@settings:@scaling", value);
    document.body.style.setProperty("--scaling", value || 1);
});

//
const exKey = (array) => {
    return array.filter((value, index, self) => {
        return index === self.findIndex((t) => t.id === value.id);
    });
};

//
export const gridState = {
    gridPages: writable(
        exKey([
            ...(JSON.parse(localStorage.getItem("@pages") || "[]") || []),
            {
                id: "home-page",
                type: "icon-list",
            },
        ])
    ),
    iconItems: writable(
        exKey([
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
        ])
    ),
    iconLists: writable(
        exKey([
            ...(JSON.parse(localStorage.getItem("@lists") || "[]") || []),
            ["home-page", ["github"]],
        ])
    ),
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
export const currentState = {
    gridPages: new Map([]),
    iconItems: new Map([]),
    iconLists: new Map([]),
};

//
gridState.gridPages.subscribe((s) => {
    currentState.gridPages = makeMap(s);
});
gridState.iconItems.subscribe((s) => {
    currentState.iconItems = makeMap(s);
});
gridState.iconLists.subscribe((s) => {
    currentState.iconLists = new Map(s);
});

//
gridState.iconItems.subscribe((v) => {
    localStorage.setItem("@icons", JSON.stringify(v));
});

//
gridState.iconLists.subscribe((v) => {
    localStorage.setItem("@lists", JSON.stringify(v));
});

//
gridState.gridPages.subscribe((v) => {
    localStorage.setItem("@pages", JSON.stringify(v));
});

//
export const updateIcons = () => {
    gridState.iconItems.set(Array.from(currentState.iconItems.values()));
};
export const updateGrids = () => {
    gridState.gridPages.set(Array.from(currentState.gridPages.values()));
};
export const updateLists = () => {
    gridState.iconLists.set(Array.from(currentState.iconLists.entries()));
};

//
export const getIconState = (id = "github") => {
    return currentState.iconItems.get(id);
};

//
export const setIconState = ({ iconItem = null, id = null }) => {
    currentState.iconItems.set(
        (id ||= iconItem.id),
        (iconItem ||= getIconState((id ||= iconItem.id)))
    );
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
    const focusEdit = {};
    const focusIconState = getIconState(id);
    const focusIconWrite = {};
    const focusFieldSubscribe = {};

    //
    for (const f of fieldNames) {
        focusIconWrite[f] = writable(focusIconState[f]);
        focusIconWrite[f].subscribe(
            (focusFieldSubscribe[f] = (v) => {
                focusIconState[f] = v;
                setIconState({ id, iconItem: focusIconState });
            })
        );
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
    focusEdit.updatableIconLists = updatableIconLists;
    focusEdit.focusIconWrite = focusIconWrite;
    focusEdit.focusIconState = focusIconState;
    focusEdit.focusFieldSubscribe = focusFieldSubscribe;

    //
    return focusEdit;
};

//
export const fixSubscribe = (focusEdit) => {
    for (const f of fieldNames) {
        focusEdit.focusIconWrite[f].subscribe(focusEdit.focusFieldSubscribe[f]);
    }
    return focusEdit;
};
