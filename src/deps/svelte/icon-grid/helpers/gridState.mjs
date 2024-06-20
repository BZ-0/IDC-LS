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
            action: "",
            href: "#",
            label: ""
            
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
export const updateIcons = ()=>{ gridState.iconItems.set(Array.from(currentState.iconItems.values())); }
export const updateGrids = ()=>{ gridState.gridPages.set(Array.from(currentState.gridPages.values())); }
export const updateLists = ()=>{ gridState.iconLists.set(Array.from(currentState.iconLists.entries())); }

//
export const getIconState = (id = "test") => {
    return currentState.iconItems.get(id);
}

//
export const setIconState = (iconItem, id = null)=>{
    currentState.iconItems.set(id || iconItem.id, iconItem);
    updateIcons();
}

//
export const focusIconForEdit = (id = "test")=>{
    const focusIconState  = getIconState(id);
    const focusIconFields = {
        id: writable(iconState.id),
        icon: writable(iconState.icon),
        label: writable(iconState.label),
        action: writable(iconState.action),
        href: writable(iconState.href),
        cellX: writable(iconState.cellX),
        cellY: writable(iconState.cellY),
        pCellX: writable(iconState.pCellX),
        pCellY: writable(iconState.pCellY),
        pointerId: writable(iconState.pointerId)
    }

    //
    {
        focusIconFields.id.subscribe(setIconState);
        focusIconFields.icon.subscribe(setIconState);
        focusIconFields.label.subscribe(setIconState);
        focusIconFields.cellX.subscribe(setIconState);
        focusIconFields.cellY.subscribe(setIconState);
        focusIconFields.action.subscribe(setIconState);
        focusIconFields.href.subscribe(setIconState);
    }

    //
    const updatableIconLists = readable(focusIconState, (set)=>{
        focusIconFields.id.subscribe((v)=>{focusIconState.id=v; set(focusIconState)});
        focusIconFields.icon.subscribe((v)=>{focusIconState.icon=v; set(focusIconState)});
        focusIconFields.label.subscribe((v)=>{focusIconState.label=v; set(focusIconState)});
        focusIconFields.action.subscribe((v)=>{focusIconState.action=v; set(focusIconState)});
        focusIconFields.href.subscribe((v)=>{focusIconState.href=v; set(focusIconState)});
        focusIconFields.cellX.subscribe((v)=>{focusIconState.cellX=v; set(focusIconState)});
        focusIconFields.cellY.subscribe((v)=>{focusIconState.cellY=v; set(focusIconState)});
    });

    //
    return [focusIconFields, updatableIconLists];
}
