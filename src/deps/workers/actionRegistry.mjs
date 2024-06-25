import { focusIconForEdit, gridState } from "@states/gridState.mjs";

//
export let onFocus = {
    iconItem: focusIconForEdit(""),
    iconItemId: writable(""),
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
            }

            //
            const currentIconGrid =
                from?.closest('.icon-grid[data-type="icons"]') ||
                document.querySelector('.icon-grid[data-type="icons"]');

            //
            const currentGridId = currentIconGrid.dataset.id;
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
