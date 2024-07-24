// Initiate loading instantly
import $Bundle from "@unite/scripts/stylework/Bundle.ts";

//
const loading = Promise.allSettled([
    import("@idc/UI2/Scripts/Appear.ts"),
    import("@idc/UI2/Scripts/Dropper.ts"),
    import("@idc/UI2/Scripts/AppFrame.ts"),
    import("@idc/UI2/Scripts/ContextMenu.ts"),
    import("@idc/UI2/Scripts/DesktopGrid.ts"),
    import("@idc/UI2/Scripts/InputEdit.ts"),
    import("@idc/UI2/Scripts/ItemEdit.ts"),
    import("@idc/App/Scripts/Settings.ts"),
    import("@idc/App/Scripts/ControlCenter.ts"),
    import("@unite/wcomp/scrollbox/ScrollBox.ts")
]);

//
(async ()=>{
    const {createApp} = await import("vue");
    const App = (await import("./Main.vue")).default;
    const app = createApp(App);
    app.mount(document.body);

    //
    (await loading).map((mod)=>{
        const lazy = mod?.value?.default;
        if (typeof lazy == "function") { lazy?.(); };
    });
})();

//
document.documentElement.style.setProperty("--theme-base-color", localStorage.getItem("--theme-base-color") || "oklch(50% 0.3 0)", "");
document.documentElement.style.setProperty("--theme-wallpaper-is-dark", localStorage.getItem("--theme-wallpaper-is-dark") || "0", "");

// avoid any dragging when no-needed...
document.documentElement.addEventListener("dragstart", (ev) => {
    if ((ev?.target as HTMLElement)?.matches?.("div, img, picture, canvas, video, svg")) {
        ev.preventDefault();
    }
}, {passive: false, capture: true});
