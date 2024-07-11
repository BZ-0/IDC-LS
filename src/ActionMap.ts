import {writable} from "svelte/store";
import {state} from "./GridState.ts";
import type {GridItemType} from "@unite/grid/GridItemUtils.ts";
import {makeReactiveObject} from "@unite/reactive/ReactiveObject.ts";
import {redirectCell} from "@unite/grid/GridItemUtils.ts";

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
        if (initiator) {
            const ID = initiator.dataset.id || "";

            //
            state.items.delete(ID);
            state.items = state.items;
            onEditItem.set(null);

            //
            for (const L of state.lists) {
                L[1].delete(ID);
                state.lists.set(...L);
            }
            state.lists = state.lists;
        }
    }],


    ["add-item", ({initiator}) => {
        if (initiator && initiator.dataset.currentPage) {
            const currentPage = initiator.dataset.currentPage;
            const newItem = makeReactiveObject({
                id: UUIDv4(),
                cell: [0, 0],
                icon: "file-question",
                label: "Untitled",
                pointerId: -1,
                action: "open-link",
                href: "#"
            });

            //
            state.items.set(newItem.id, newItem);
            state.items = state.items;
            onEditItem.set(newItem);

            //
            state.lists.get(currentPage)?.add?.(newItem.id);
            state.lists.set(currentPage, state.lists.get(currentPage));
            state.lists = state.lists;

            //
            redirectCell({item: newItem, items: state.items, page: state.grids.get(currentPage)}, newItem.cell);
        }
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
