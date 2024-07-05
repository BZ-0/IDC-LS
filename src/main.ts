        
import "./main.scss";

//
document.documentElement.style.setProperty("--theme-base-color", localStorage.getItem("--theme-base-color") || "oklch(50% 0.3 0)", "");
document.documentElement.style.setProperty("--theme-wallpaper-is-dark", parseInt(localStorage.getItem("--theme-wallpaper-is-dark") || "0") || 0, "");

// avoid any dragging when no-needed...
document.addEventListener("dragstart", (ev)=>{
    ev.preventDefault();
}, {passive: false, capture: true});

//
if ("virtualKeyboard" in navigator && navigator?.virtualKeyboard) {
    navigator.virtualKeyboard.overlaysContent = true;
}

//
if (typeof navigator != "undefined") {
    navigator?.serviceWorker?.register?.(new URL('./service.mjs', import.meta.url), {scope: "/"}).then(
        (registration) => {
            console.log('Service worker registration succeeded:', registration);
        },
        (error) => {
            console.error(`Service worker registration failed: ${error}`);
        }
    )?.catch?.(console.warn.bind(console));

    //
    navigator?.registerProtocolHandler?.(
        "web+mxs",
        location.origin + `/opfs?path=%s`
    );
}

// use workers
const loading = Promise.allSettled([
    import("@states/gridState.mjs"),
    import("@workers/actionRegistry.mjs"),
    import("@unite/scrollbox/scrollbox.mjs"),
    import("@unite/dom/stylework.mjs"),
    import("@unite/dom/wcanvas.mjs").then(
        (_) => import("@workers/colormod.mjs")
    ),
]);

//
import App from "@tests/Candidate.svelte";

//
export default  loading.then(()=>{
    return (new App({
        target: document.body,
    }));
});
