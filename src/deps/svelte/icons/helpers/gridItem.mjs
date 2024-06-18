import { get } from "http";
import { type } from "os";
import { parse } from "path";

//
export let gridPages = [{
    id: "home-page",
    type: "icon-list",
    iconList: ["test"]
}].concat(JSON.parse(localStorage.getItem("@pages") || "[]") || []);
export let iconItems = new Map([
    ["test", {
        id: "test",
        icon: "cat",
        cellX: 0,
        cellY: 0
    }]
].concat(JSON.parse(localStorage.getItem("@icons") || "[]") || []));

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
    let exist = iconItems.get(newScheme.id);
    if (!exist) {
        iconItems.set(newScheme.id, exist = {...newScheme});
    };
    Object.assign(exist, newScheme);
    saveInStorage(iconItems);
});

//
export const makeArgs = (iconItem, gridPage)=>{
    return {
        gridPage: document.querySelector(`.icon-grid[data-id="${gridPage.id}"]`),
        iconList: gridPage.iconList, 
        iconItems,
        iconItem, CL
    };
}

//
const or_mod = {
    "landscape-primary":   [ 1,  1, 1],
    "landscape-secondary": [ 1,  1, 1],
    "portrait-primary":    [ 1,  1, 0],
    "portrait-secondary":  [-1, -1, 0],
};

//
export const getParent = (e) => {
    const parent = (e.parentNode || e.parentElement || e?.getRootNode?.()?.host);
    return (parent.shadowRoot && e.slot != null ? (parent.shadowRoot.querySelector(e.slot ? `slot[name=\"${e.slot}\"]` : `slot:not([name])`).parentNode) : parent);
}

//
export const getCorrectOrientation = ()=>{
    let orientationType = screen.orientation.type;
    if (matchMedia("(orientation: portrait)" ).matches) { orientationType = orientationType.replace("landscape", "portrait"); } else
    if (matchMedia("(orientation: landscape)").matches) { orientationType = orientationType.replace("portrait", "landscape"); };
    return orientationType;
}

//
export const fixCell = ({
    gridPage,
    itemItem, iconList, CL,
    iconItems
}, $preCell) => {
    const items = iconItems;
    const preCell = {...$preCell}; // make non-conflict copy
    const icons = iconList.map((id)=>iconItems.get(id));

    //
    const checkBusy = (cell)=>{
        return icons.filter((e)=>(e!=iconItem)).find((one)=>{
            return (one.cellX == cell.x && one.cellY == cell.y);
        });
    }

    //
    if (!checkBusy(preCell)) {
        iconItem.cellX = preCell.x;
        iconItem.cellX = preCell.y;
        return;
    }

    //
    const columns = (CL[0] || 4);
    const rows    = (CL[1] || 8);

    // 
    const variants = [
        {x: preCell.x + 1, y: preCell.y},
        {x: preCell.x - 1, y: preCell.y},
        {x: preCell.x, y: preCell.y + 1},
        {x: preCell.x, y: preCell.y - 1},
    ].filter((v)=>{
        return (v.x >= 0 && v.x < columns && v.y >= 0 && v.y < rows);
    });

    //
    const suitable = variants.find((v)=>!checkBusy(v));
    if (suitable) {
        return [suitable.x, suitable.y];
    }

    //
    let exceed = 0;
    let busy = checkBusy(preCell);
    while (busy && (exceed++) < (columns*rows)) {
        if (!busy) {
            return [preCell.x, preCell.y];
        }

        //
        preCell.x++;
        if (preCell.x >= columns) {
            preCell.x = 0;
            preCell.y++;

            //
            if (preCell.y >= rows) {
                preCell.y = 0;
            }
        }

        //
        busy = checkBusy(preCell);
    }
}

//
export const animationSequence = [{
    "--translate-x": "calc(var(--p-drag-x) * var(--pxd))",
    "--translate-y": "calc(var(--p-drag-y) * var(--pxd))",

    easing: "step-start",
    offset: 0.0,
}, {
    "--translate-x": "calc(var(--p-drag-x) * var(--pxd))",
    "--translate-y": "calc(var(--p-drag-y) * var(--pxd))",

    easing: "linear",
    offset: 0.01
}, {
    "--translate-x": "calc(calc(calc(var(--grid-w, 0) / var(--f-col)) * var(--vect-x) * var(--xmd) + var(--drag-x)) * var(--pxd))",
    "--translate-y": "calc(calc(calc(var(--grid-h, 0) / var(--f-row)) * var(--vect-y) * var(--ymd) + var(--drag-y)) * var(--pxd))",

    easing: "step-end",
    offset: 0.99
}, {
    "--translate-x": "calc(calc(calc(var(--grid-w, 0) / var(--f-col)) * var(--vect-x) * var(--xmd) + var(--drag-x)) * var(--pxd))",
    "--translate-y": "calc(calc(calc(var(--grid-h, 0) / var(--f-row)) * var(--vect-y) * var(--ymd) + var(--drag-y)) * var(--pxd))",

    easing: "step-end",
    offset: 1
}];


//
export const putToCell = ({
    gridPage,
    itemItem, iconList, CL,
    iconItems
}, $last) => {
    // should be relative from grid-box (not absolute or fixed position)
    const last = $last;

    //
    const orientation = getCorrectOrientation();
    const oxBox = [gridPage.offsetWidth, gridPage.offsetHeight];

    //
    if (orientation.startsWith("landscape")) oxBox.reverse();

    //
    const inBox = [oxBox[0] / CL[0], oxBox[1] / CL[1]];

    //
    const preCell = {x: itemItem.cellX, y: itemItem.cellY};

    //
    switch(orientation) {
        case "portrait-primary":
            preCell.x = Math.floor((last.x) / inBox[0]) || 0;
            preCell.y = Math.floor((last.y) / inBox[1]) || 0;
        break;
        case "landscape-primary":
            preCell.x = Math.floor((oxBox[0] - last.y) / inBox[0]) || 0;
            preCell.y = Math.floor((last.x) / inBox[1]) || 0;
        break;
        case "portrait-secondary":
            preCell.x = Math.floor((oxBox[0] - last.x) / inBox[0])  || 0;
            preCell.y = Math.floor((oxBox[1] - last.y) / inBox[1]) || 0;
        break;
        case "landscape-secondary":
            preCell.x = Math.floor(last.y / inBox[0]) || 0;
            preCell.y = Math.floor((oxBox[1] - last.x) / inBox[1]) || 0;
        break;
    }

    //
    return fixCell({
        gridPage,
        itemItem, iconList, CL,
        iconItems
    }, preCell);
}
