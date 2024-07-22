//
document.documentElement.style.setProperty("--theme-base-color", localStorage.getItem("--theme-base-color") || "oklch(50% 0.3 0)", "");
document.documentElement.style.setProperty("--theme-wallpaper-is-dark", localStorage.getItem("--theme-wallpaper-is-dark") || "0", "");

// avoid any dragging when no-needed...
document.documentElement.addEventListener("dragstart", (ev) => {
    if ((ev?.target as HTMLElement)?.matches?.("div, img, picture, canvas, video, svg")) {
        ev.preventDefault();
    }
}, {passive: false, capture: true});

// use workers
const loading = Promise.allSettled([
    import("@idc/UI2/Scripts/Appear.ts"),
    import("@idc/UI2/Scripts/Dropper.ts"),
    import("@idc/UI2/Scripts/AppFrame.ts"),
    import("@idc/UI2/Scripts/ContextMenu.ts"),
    import("@idc/UI2/Scripts/DesktopGrid.ts"),
    import("@idc/UI2/Scripts/InputEdit.ts"),
    import("@idc/UI2/Scripts/ItemEdit.ts"),

    import("@idc/App/Scripts/Settings.ts").catch(console.warn.bind(console)),
    import("@idc/App/Scripts/ControlCenter.ts").catch(console.warn.bind(console)),

    import("@unite/wcomp/scrollbox/ScrollBox.ts"),
    import("@unite/scripts/stylework/Bundle.ts")
]);

//
/*
import App from "./Main.svelte";
import {mount} from 'svelte';

//
export default loading.then(() => {
    mount(App, {target: document.body});
});
*/

//
import { createApp } from "vue";
import App from "./Main.vue";

//
const app = createApp(App);
app.mount(document.body);
