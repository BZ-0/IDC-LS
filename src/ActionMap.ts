import {writable} from "svelte/store";
import {state} from "./GridState.ts";
import type {GridItemType} from "@unite/grid/GridItemUtils.ts";


//
export const onEditItem = writable<GridItemType>(null);


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
export const pickWallpaperImage = async () => {
    const fpc = self?.showOpenFilePicker
        ? new Promise((r) =>
            r({
                showOpenFilePicker: window.showOpenFilePicker.bind(window),
                showSaveFilePicker: window.showSaveFilePicker.bind(window),
            })
        )
        : /* webpackPrefetch: true */ import(
            "@unite/polyfill/showOpenFilePicker.mjs"
        );

    //
    const fx = await fpc;
    return (fx?.showOpenFilePicker ?? window?.showOpenFilePicker)({
        types: [
            {
                description: "wallpaper",
                accept: {
                    "image/*": [
                        ".png",
                        ".gif",
                        ".jpg",
                        ".jpeg",
                        ".webp",
                        ".jxl",
                    ],
                },
            },
        ],
        startIn: "pictures",
        multiple: false,
    })
        .then(([handle] = []) => handle?.getFile?.())
        .catch(console.warn.bind(console));
};


//
const actionMap = new Map<string, Function>([

    ["open-settings", ({initiator}) => {
        location.hash = "#settings";
    }],

    ["open-link", ({initiator}) => {

    }],


    ["edit-item", ({initiator}) => {
        if (initiator) {
            const item = state.items.get(initiator.dataset.id || "");
            onEditItem.set(item);
        }
    }],


    ["delete-item", ({initiator}) => {

    }],


    ["add-item", ({}) => {

    }],


    [
        "change-wallpaper",
        ({}) => {
            const wallpaper = document.querySelector('canvas[is="w-canvas"]');
            if (wallpaper) {
                pickWallpaperImage()
                    .catch(console.warn.bind(console))
                    .then((blob) => {
                        wallpaper?.["$useImageAsSource"]?.(blob);
                    });
            }
        },
    ],
]);

export default actionMap;
