import {makeReactiveObject} from "@unite/reactive/ReactiveObject.ts";

//
export const settings = makeReactiveObject({
    columns: parseInt(localStorage.getItem("@settings:@columns")) || 4,
    rows: parseInt(localStorage.getItem("@settings:@rows")) || 8,
    theme: parseInt(localStorage.getItem("@settings:@theme")) || 0,
    orientation: parseInt(localStorage.getItem("@settings:@orientation")) || "auto",
    scaling: parseFloat(localStorage.getItem("@settings:@scaling")) || 1,
    useZoom: !!localStorage.getItem("@settings:@use-zoom") || true
});


//
settings?.["@subscribe"]?.((v) => {
    localStorage.setItem("@settings:@use-zoom", v);

    //
    document.documentElement.classList.remove("__exp-use-zoom");
    document.documentElement.classList.remove("__use_font-size");

    //
    if (!!v) {
        document.documentElement.classList.remove("__use_font-size");
        document.documentElement.classList.add("__exp-use-zoom");
    } else {
        document.documentElement.classList.remove("__exp-use-zoom");
        document.documentElement.classList.add("__use_font-size");
    }
}, "useZoom");


//
settings?.["@subscribe"]?.((v) => {
    localStorage.setItem("@settings:@theme", v);

    //
    const target = document.documentElement;
    if (v == -1) {
        target.classList.remove("force-light");
        target.classList.remove("force-dark");
        if (!target.classList.contains("force-dark")) {
            target.classList.add("force-dark");
        }
    }
    if (v == 0) {
        target.classList.remove("force-light");
        target.classList.remove("force-dark");
    }
    if (v == 1) {
        target.classList.remove("force-light");
        target.classList.remove("force-dark");
        if (!target.classList.contains("force-light")) {
            target.classList.add("force-light");
        }
    }

    //
    localStorage.setItem("@settings:@theme", v || 0);
}, "theme");



settings?.["@subscribe"]?.((v) => {
    document.documentElement.dataset["orientation"] = v || "auto";
    localStorage.setItem("@settings:@orientation", v || "auto");
    (async () => {
        switch (v || "auto") {
            case "auto":
                await screen.orientation.lock(screen.orientation.type);
                await screen.orientation.unlock();
                break;

            default:
                await screen.orientation.lock(v || "any");
                break;
        }
    })().catch(console.warn.bind(console));
}, "orientation");


//
settings?.["@subscribe"]?.((v) => {
    document.documentElement.style.setProperty("--columns", v || 4);
    localStorage.setItem("@settings:@columns", v || 4);
}, "columns");

//
settings?.["@subscribe"]?.((v) => {
    document.documentElement.style.setProperty("--rows", v || 8);
    localStorage.setItem("@settings:@rows", v || 8);
}, "rows");

//
settings?.["@subscribe"]?.((v) => {
    document.documentElement.style.setProperty("--scaling", v || 1);
    localStorage.setItem("@settings:@scaling", v || 1);
}, "scaling");
