import { putToCell } from "@states/gridItem.mjs"
import { focusIconForEdit, gridState } from "@states/gridState.mjs"
import { settings } from "@states/settings.mjs"

//
export let onFocus = {
    iconItem: focusIconForEdit(""),
    iconItemId: writable(""),
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
                onFocus.iconItem = focusIconForEdit(id);
                onFocus.iconItemId.set(id);
            }
        },
    ],
    [
        "delete-icon",
        (from, event) => {
            const id = from?.dataset?.id || onFocus?.focusIconState?.id;
            if (id) {
                gridState.iconItems.delete(id);
                gridState.iconItems = gridState.iconItems;

                // do lost focus when deleted
                onFocus.iconItem = focusIconForEdit("");
                onFocus.iconItemId.set("");

                //
                const currentIconGrid =
                    from?.closest('.icon-grid[data-type="icons"]') ||
                    document.querySelector('.icon-grid[data-type="icons"]');

                //
                const currentGridId = currentIconGrid.dataset.id;
                const iconList = gridState.iconLists.get(currentPage) || [];

                //
                const indexOf = iconList.indexOf(id);
                if (indexOf >= 0) { iconList.splice(indexOf, 1); }
                gridState.iconLists = gridState.iconLists;
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
            const currentGridId = currentIconGrid.dataset.id;

            //
            const iconId = UUIDv4();
            const iconItem = {
                id: iconId,
                label: "",
                icon: "",
                action: "open-link",
                href: "#",
                cellX: 0,
                cellY: 0,
            };

            //
            const iconElement = null;
            const gridPage = gridState.gridPages.get(currentPage);
            const iconList = gridState.iconLists.get(currentPage) || [];
            const args = makeArgs(
                iconItem,
                iconItems,
                gridPage,
                [settings.columns, settings.rows],
                iconLists
            );

            //
            const { cellX = x, cellY = y } = putToCell(args, {
                x: iconItem.cellX,
                y: iconItem.cellY,
            });

            //
            (iconItem.cellX = cellX || 0), (iconItem.cellY = cellY || 0);

            //
            gridState.iconItems.set(iconId, iconItem);
            gridState.iconLists.get(currentGridId)?.push?.(iconId);
            
            // update svelte writer
            gridState.iconItems = gridState.iconItems;
            gridState.iconLists = gridState.iconLists;

            // use editor...
            onFocus.iconItem = focusIconForEdit(iconId);
            onFocus.iconItemId.set(iconId);
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
    if (pr?.dataset?.action) {
        actionRegistry.get(pr.dataset.action)?.(pr, ev);
    }
});
