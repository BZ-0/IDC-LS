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
export const gridState = {
    gridPages: writable([{
        id: "home-page",
        type: "icon-list",
        iconList: ["test"]
    }].concat(JSON.parse(localStorage.getItem("@pages") || "[]") || [])),    
    iconItems: writable([
        ["test", {
            id: "test",
            icon: "cat",
            cellX: 1,
            cellY: 0
        }]
    ].concat(JSON.parse(localStorage.getItem("@icons") || "[]") || []))
}

//
export const saveInStorage = (iconItems)=>{
    
};

//
gridState.iconItems.subscribe((v)=>{
    saveInStorage(v);
})

