import { get, writable } from 'svelte/store';

//
export const settings = {
    columns : writable(parseInt(localStorage.getItem("@settings:@columns")) || 4),
    rows : writable(parseInt(localStorage.getItem("@settings:@rows")) || 8)
}

//
settings.columns.subscribe((value)=>{
    localStorage.setItem("@settings:@columns", value);
})

//
settings.rows.subscribe((value)=>{
    localStorage.setItem("@settings:@rows", value);
})

//
const exKey = (array)=>{
    return array.filter((value, index, self) => {
        return (index === self.findIndex((t) => (t.id === value.id)))
    })
}

//
export const gridState = {
    gridPages: writable(exKey([
        ...(JSON.parse(localStorage.getItem("@pages") || "[]") || []), 
        {
            id: "home-page",
            type: "icon-list"
        }])),
    iconItems: writable(exKey([
        ...(JSON.parse(localStorage.getItem("@icons") || "[]") || []), {
            id: "test",
            icon: "cat",
            cellX: 1,
            cellY: 0,
            
            // surrogate field - used when edit
            //parent: "home-page"
        }])),
    iconLists: writable(exKey([
        ...(JSON.parse(localStorage.getItem("@lists") || "[]") || []), 
        ["home-page", ["test"]]
    ])),
}

//
export const makeMap = (array) => {
    return new Map(Object.entries(Object.groupBy(Array.from(array), ({id})=>(id))).map(([id,[v]])=>([id,v])));
}

//
export const currentState = {
    gridPages: new Map([]),
    iconItems: new Map([]),
    iconLists: new Map([])
}

//
gridState.gridPages.subscribe((s)=>{currentState.gridPages = makeMap(s)});
gridState.iconItems.subscribe((s)=>{currentState.iconItems = makeMap(s)});
gridState.iconLists.subscribe((s)=>{currentState.iconLists = new Map(s)});

//
gridState.iconItems.subscribe((v)=>{
    localStorage.setItem("@icons", JSON.stringify(v));
})

//
gridState.iconLists.subscribe((v)=>{
    localStorage.setItem("@lists", JSON.stringify(v));
})

//
gridState.gridPages.subscribe((v)=>{
    localStorage.setItem("@pages", JSON.stringify(v));
})

//
export const editForIcon = writable(currentState.iconItems.get("test"));

//
editForIcon.subscribe((newScheme) => {
    let exist = currentState.iconItems.get(newScheme.id);
    if (!exist && newScheme.id) {
        currentState.iconItems.set(newScheme.id, exist = {...newScheme});
        gridState.iconItems.set(Array.from(currentState.iconItems.entries()));
    }
});

//
export const getIconItemCurrentState = (elementOrId)=>{
    const id = elementOrId?.dataset?.id || elementOrId;
    return currentState.iconItems.get(id);
}

//
export const applyIconItemState = (state)=>{
    editForIcon.set(state);
}
