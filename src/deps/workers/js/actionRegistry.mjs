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
]);

// support of actions
document.addEventListener("click", (ev)=>{
    const el = ev.target;
    const pr = el.matches("[data-action]") ? el : el.closest("[data-action]")
    if (pr?.dataset?.action) {
        actionRegistry.get(pr.dataset.action)?.(pr, ev);
    }
});
