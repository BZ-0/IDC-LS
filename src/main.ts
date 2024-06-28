        
import "./main.scss"

document.documentElement.style.setProperty("--theme-base-color", localStorage.getItem("--theme-base-color") || "oklch(50% 0.3 0)", "");
document.documentElement.style.setProperty("--theme-wallpaper-is-dark", parseInt(localStorage.getItem("--theme-wallpaper-is-dark") || "0") || 0, "");



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
    import("@workers/stylework.mjs"),
    import("@workers/actionRegistry.mjs"),
    import("@webcomp/scrollbox/scrollbox.mjs"),
    import("@webcomp/wcanvas/wcanvas.mjs").then(
        (_) => import("@workers/colormod.mjs")
    ),
]);

//
//import App from "@tests/MultiPageTest.svelte";
//import App from '@tests/ScrollBox.svelte'
//import App from "@tests/CtxMenu.svelte";
//import App from "@tests/SettingsTest.svelte"
import App from "@tests/Candidate.svelte"

export default  loading.then(()=>{
    return (new App({
        target: document.body,
    }));
});


//
//const app = new App({
    //target: document.body,
//});

//
//export default app;
