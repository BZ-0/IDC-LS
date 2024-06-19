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
const exMap = (array)=>{
    return array.filter((value, index, self) => {
        return (index === self.findIndex((t) => (t[0] === value[0])))
    })
}

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
            type: "icon-list",
            iconList: ["test"]
        },
        
    ])),
    iconItems: writable(exMap([
        ...(JSON.parse(localStorage.getItem("@icons") || "[]") || []),
        ["test", {
            id: "test",
            icon: "cat",
            cellX: 1,
            cellY: 0
        }],
        
    ]))
}

//
export const currentState = {
    gridPages: [],
    iconItems: new Map([])
}

//
gridState.gridPages.subscribe((s)=>{currentState.gridPages = s});
gridState.iconItems.subscribe((s)=>{currentState.iconItems = new Map(s)});

//
gridState.iconItems.subscribe((v)=>{
    localStorage.setItem("@icons", JSON.stringify(v));
})

//
gridState.gridPages.subscribe((v)=>{
    localStorage.setItem("@pages", JSON.stringify(v));
})

// for using bind:editForIcon={@} for editors
export const editForIcon = writable({
    id: "",
    icon: "",
    label: ""
});

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
