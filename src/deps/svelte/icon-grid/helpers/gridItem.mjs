import { get, writable } from 'svelte/store';

//
export const makeArgs = (iconItem, iconItems, gridPage, columnsAndRows, iconLists)=>{
    return {
        gridPage: document.querySelector(`.icon-grid[data-id="${gridPage.id}"]`),
        iconList: gridPage.iconList, 
        iconItems, iconLists,
        iconItem, columnsAndRows
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
    iconItem, iconList, columnsAndRows,
    iconItems, iconLists
}, $preCell) => {
    const items = iconItems;
    const preCell = {...$preCell}; // make non-conflict copy
    const icons = iconList?.map((id)=>iconItems.get(id)) || [];

    //
    const checkBusy = (cell)=>{
        return icons.filter((e)=>(e!=iconItem)).find((one)=>{
            return (one.cellX == cell.x && one.cellY == cell.y);
        });
    }

    //
    if (!checkBusy(preCell)) {
        iconItem.cellX = preCell.x;
        iconItem.cellY = preCell.y;
        return {x: iconItem.cellX, y: iconItem.cellY};
    }

    //
    const columns = (columnsAndRows[0] || 4);
    const rows    = (columnsAndRows[1] || 8);

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
        iconItem.cellX = suitable.x;
        iconItem.cellY = suitable.y;
        return {x: iconItem.cellX, y: iconItem.cellY};
    }

    //
    let exceed = 0;
    let busy = checkBusy(preCell);
    while (busy && (exceed++) < (columns*rows)) {
        if (!busy) {
            iconItem.cellX = preCell.x;
            iconItem.cellY = preCell.y;
            return {x: iconItem.cellX, y: iconItem.cellY};
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
CSS?.registerProperty?.({
    name: "--translate-x",
    syntax: "<length-percentage>",
    inherits: true,
    initialValue: "0px",
});

//
CSS?.registerProperty?.({
    name: "--translate-y",
    syntax: "<length-percentage>",
    inherits: true,
    initialValue: "0px",
});


const getOrientedPoint = ()=>{
    const orientation = getCorrectOrientation();
    switch(orientation) {
        case "portrait-primary": 
        return {
            "--translate-x": "calc(calc(calc(var(--grid-w) / var(--f-col)) * var(--vect-x)) * 1px)",
            "--translate-y": "calc(calc(calc(var(--grid-h) / var(--f-row)) * var(--vect-y)) * 1px)",
        }

        case "portrait-secondary": 
        return {
            "--translate-x": "calc(calc(calc(var(--grid-w) / var(--f-col)) * var(--vect-x)) * -1 * var(--pxd))",
            "--translate-y": "calc(calc(calc(var(--grid-h) / var(--f-row)) * var(--vect-y)) * -1 * var(--pxd))",
        }

        case "landscape-primary": 
        return {
            "--translate-x": "calc(calc(calc(var(--grid-w) / var(--f-row)) * var(--vect-y)) * 1 * var(--pxd))",
            "--translate-y": "calc(calc(calc(var(--grid-h) / var(--f-col)) * var(--vect-x)) * -1 * var(--pxd))",
        }

        case "landscape-secondary": 
        return {
            "--translate-x": "calc(calc(calc(var(--grid-w) / var(--f-row)) * var(--vect-y)) * -1 * var(--pxd))",
            "--translate-y": "calc(calc(calc(var(--grid-h) / var(--f-col)) * var(--vect-x)) * 1 * var(--pxd))",
        }

        default: 
        return {
            "--translate-x": "calc(calc(calc(var(--grid-w) / var(--f-col)) * var(--vect-x)) * 1 * var(--pxd))",
            "--translate-y": "calc(calc(calc(var(--grid-h) / var(--f-row)) * var(--vect-y)) * 1 * var(--pxd))",
        }
    }
}


//
export const animationSequence = ()=> { return [{
    "--translate-x": "calc(var(--drag-x) * var(--pxd))",
    "--translate-y": "calc(var(--drag-y) * var(--pxd))",

    easing: "step-start",
    offset: 0.0,
}, {
    "--translate-x": "calc(var(--drag-x) * var(--pxd))",
    "--translate-y": "calc(var(--drag-y) * var(--pxd))",

    easing: "linear",
    offset: 0.01
}, {
    ...getOrientedPoint(),
    easing: "step-end",
    offset: 0.99
}, {
    ...getOrientedPoint(),
    easing: "step-end",
    offset: 1
}] };


//
export const putToCell = ({
    gridPage,
    iconItem, iconList, columnsAndRows,
    iconItems, iconLists
}, $last) => {
    // should be relative from grid-box (not absolute or fixed position)
    const last = $last;

    //
    const orientation = getCorrectOrientation();
    const oxBox = [gridPage.offsetWidth, gridPage.offsetHeight];

    //
    if (orientation.startsWith("landscape")) oxBox.reverse();

    //
    const inBox = [oxBox[0] / columnsAndRows[0], oxBox[1] / columnsAndRows[1]];

    //
    const preCell = {x: iconItem.cellX, y: iconItem.cellY};
        iconItem.pCellX = iconItem.cellX,
        iconItem.pCellY = iconItem.cellY;

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
    const fValue = fixCell({
        gridPage,
        iconItem, iconList, columnsAndRows,
        iconItems, iconLists
    }, preCell);

    //
    return fValue;
}
