import { writable } from 'svelte/store';

//
export const columns = writable(parseInt(localStorage.getItem("@settings:@columns")) || 4);
export const rows = writable(parseInt(localStorage.getItem("@settings:@rows")) || 8);

//
export const cGridPages = [{
    id: "home-page",
    type: "icon-list",
    iconList: ["test"]
}].concat(JSON.parse(localStorage.getItem("@pages") || "[]") || []);

//
export const cIconItems = new Map([
    ["test", {
        id: "test",
        icon: "cat",
        cellX: 1,
        cellY: 0
    }]
].concat(JSON.parse(localStorage.getItem("@icons") || "[]") || []));

//
columns.subscribe((value)=>{
    localStorage.setItem("@settings:@columns", value);
})

//
rows.subscribe((value)=>{
    localStorage.setItem("@settings:@rows", value);
})

//
export let saveInStorage = (iconItems)=>{
    
};

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
export let editForIcon = writable({
    id: "",
    icon: "",
    label: ""
});

//
editForIcon.subscribe((newScheme) => {
    let exist = cIconItems.get(newScheme.id);
    if (!exist) {
        cIconItems.set(newScheme.id, exist = {...newScheme});
    };
    Object.assign(exist, newScheme);
    saveInStorage(cIconItems);
});
