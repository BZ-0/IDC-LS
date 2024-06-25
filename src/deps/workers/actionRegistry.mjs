import { applyForIcon } from '@states/fieldEdit.mjs'
import { makeArgs, putToCell } from "@states/gridItem.mjs"
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
export const actionRegistry = new Map([
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
                currentState.iconLists
            );

            //
            const { x: cellX, y: cellY } = putToCell(args, {
                x: iconItem.cellX,
                y: iconItem.cellY,
            });

            //
            (iconItem.cellX = cellX || 0), (iconItem.cellY = cellY || 0);

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
]);

// support of actions
document.addEventListener("click", (ev) => {
    const el = ev.target;
    const pr = el.matches("[data-action]") ? el : el.closest("[data-action]");
    
    if (pr?.dataset?.action && !pr?.matches(".ctx-button")) {
        actionRegistry.get(pr.dataset.action)?.(pr, ev);
    }
});
