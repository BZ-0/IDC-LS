import { get, writable } from 'svelte/store';

//
export const columns = writable(parseInt(localStorage.getItem("@settings:@columns")) || 4);
export const rows = writable(parseInt(localStorage.getItem("@settings:@rows")) || 8);

//
export const cGridPages = writable([{
    id: "home-page",
    type: "icon-list",
    iconList: ["test"]
}].concat(JSON.parse(localStorage.getItem("@pages") || "[]") || []));

//
export const cIconItems = writable([
    ["test", {
        id: "test",
        icon: "cat",
        cellX: 1,
        cellY: 0
    }]
].concat(JSON.parse(localStorage.getItem("@icons") || "[]") || []));

//
export let iconItems = [];
export let gridPages = [];

//
cIconItems.subscribe((v)=>{iconItems = new Map(v)})
cGridPages.subscribe((v)=>{gridPages = [...v]})

//
export const saveInStorage = (iconItems)=>{
    
};

//
cIconItems.subscribe((v)=>{
    saveInStorage(v);
})

//
columns.subscribe((value)=>{
    localStorage.setItem("@settings:@columns", value);
})

//
rows.subscribe((value)=>{
    localStorage.setItem("@settings:@rows", value);
})


// for editors
export const currentIconState = {
    iconItem: {
        id: "",
        icon: "",
        label: ""
    },
    confirm() {
        editForIcon.set(this.iconItem);
    }
}

//
export const editForIcon = writable({
    id: "",
    icon: "",
    label: ""
});

//
editForIcon.subscribe((newScheme) => {
    let exist = iconItems.get(newScheme.id);
    if (!exist && newScheme.id) {
        iconItems.set(newScheme.id, exist = {...newScheme});
        cIconItems.set(Array.from(iconItems.entries()));
    }
});
