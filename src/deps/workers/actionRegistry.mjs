import { applyForIcon } from '@states/fieldEdit.mjs'
import { fixCell, makeArgs } from "@states/gridItem.mjs"
import { currentState, focusIconForEdit } from "@states/gridState.mjs"
import { settings } from "@states/settings.mjs"
import { writable } from 'svelte/store'

//
export let onFocus = {
    iconItem: focusIconForEdit(""),
    iconItemId: writable(""),
    focus (id){
        this.iconItem = focusIconForEdit(id);
        this.iconItemId.set(id);
        return this.iconItem;
    }
};

//
export const UUIDv4 = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
            +c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
        ).toString(16)
    );
};


//
export const pickWallpaperImage = async ()=>{
    const fpc = (self?.showOpenFilePicker ? new Promise((r)=>r({
        showOpenFilePicker: window.showOpenFilePicker.bind(window),
        showSaveFilePicker: window.showSaveFilePicker.bind(window)
    })) :
    /* webpackPrefetch: true */ import('@libs/polyfill/showOpenFilePicker.mjs'));

    //
    const fx = await fpc;
    return (fx?.showOpenFilePicker ?? window?.showOpenFilePicker)({
        types: [
            {
                description: "wallpaper",
                accept: {
                    "image/*": [".png", ".gif", ".jpg", ".jpeg", ".webp", ".jxl"],
                },
            },
        ],
        startIn: "pictures",
        multiple: false,
    })
    .then(([handle]=[])=>handle?.getFile?.())
    .catch(console.warn.bind(console));
}

//
export const actionRegistry = new Map([
    [
        "open-settings", (from, event) => {
            location.hash = "#settings";
        },
    ],
    [
        "default",
        (from, event) => {
            from?.dispatchEvent?.(new CustomEvent("action", { detail: event }));
        },
    ],
    [
        "open-link",
        (from, event) => {
            window.open(from.dataset.href, "_blank");
        },
    ],
    [
        "edit-icon",
        (from, event) => {
            const id = from?.dataset?.id;
            if (id) {
                onFocus.focus(id);
            }
        },
    ],
    [
        "delete-icon",
        (from, event) => {
            const id = from?.dataset?.id || onFocus?.focusIconState?.id;
            if (id) {
                currentState.iconItems.delete(id);
                currentState.iconItems = currentState.iconItems;

                // do lost focus when deleted
                onFocus.focus("");

                //
                const currentIconGrid =
                    from?.closest('.icon-grid[data-type="icons"]') ||
                    document.querySelector('.icon-grid[data-type="icons"]');

                //
                const currentPage = currentIconGrid.dataset.id;
                const iconList = currentState.iconLists.get(currentPage) || [];

                //
                const indexOf = iconList.indexOf(id);
                if (indexOf >= 0) { iconList.splice(indexOf, 1); }
                currentState.iconLists = currentState.iconLists;
            }
        },
    ],
    [
        "create-icon",
        (from, event) => {
            //
            const currentIconGrid =
                from?.closest('.icon-grid[data-type="icons"]') ||
                document.querySelector('.icon-grid[data-type="icons"]');

            //
            const currentPage = currentIconGrid.dataset.id;
            
            //
            const iconId = UUIDv4();
            const iconItem = {
                id: iconId,
                label: "Unknown",
                icon: "file-question",
                action: "open-link",
                href: "#",
                cellX: 0,
                cellY: 0,
            };

            //
            const iconElement = null;
            const gridPage = currentState.gridPages.get(currentPage);
            const iconList = currentState.iconLists.get(currentPage) || [];
            const args = makeArgs(
                iconItem,
                currentState.iconItems,
                gridPage,
                [settings.columns, settings.rows],
                currentState.iconLists,
                iconList
            );

            //
            const { x: cellX, y: cellY } = fixCell(args, {
                x: iconItem.cellX || 0,
                y: iconItem.cellY || 0,
            });

            //
            (iconItem.cellX = cellX || 0), (iconItem.cellY = cellY || 0);
            (iconItem.pCellX = cellX || 0), (iconItem.pCellY = cellY || 0);

            //
            currentState.iconItems.set(iconId, iconItem);
            currentState.iconLists.get(currentPage)?.push?.(iconId);
            
            // update svelte writer
            currentState.iconItems = currentState.iconItems;
            currentState.iconLists = currentState.iconLists;

            // use editor...
            onFocus.focus(iconId);
        },
    ],
    [
        "confirm-edit",
        (from, event) => {
            if (onFocus.iconItem) {
                applyForIcon(onFocus.iconItem);
            }
        },
    ],
    [
        "change-wallpaper", (from, event)=>{
            const wallpaper = document.querySelector("canvas[is=\"w-canvas\"]");
            if (wallpaper) {
                pickWallpaperImage().catch(console.warn.bind(console)).then((blob)=>{
                    wallpaper?.["$useImageAsSource"]?.(blob);
                });
            }
        }
    ]
]);

// support of actions
document.addEventListener("click", (ev) => {
    const el = ev.target;
    const pr = el.matches("[data-action]") ? el : el.closest("[data-action]");
    
    if (pr?.dataset?.action && !pr?.matches(".ctx-button")) {
        actionRegistry.get(pr.dataset.action)?.(pr, ev);
    }
});
