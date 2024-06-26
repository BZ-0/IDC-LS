import { makeWritableProperty } from "@states/writables.mjs"

//
export const settings = {};
export const settingsEx = {};

//
settingsEx.theme = makeWritableProperty(settings, "theme", {
    initial: parseInt(localStorage.getItem("@settings:@theme")) || 0,
    setter(v) {
        const target = document.body;
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
        return v;
    },
});

//
settingsEx.columns = makeWritableProperty(settings, "columns", {
    initial: parseInt(localStorage.getItem("@settings:@columns")) || 4,
    setter(v) {
        localStorage.setItem("@settings:@columns", v || 4);
        return v;
    },
});

//
settingsEx.rows = makeWritableProperty(settings, "rows", {
    initial: parseInt(localStorage.getItem("@settings:@rows")) || 8,
    setter(v) {
        localStorage.setItem("@settings:@rows", v || 8);
        return v;
    },
});

//
settingsEx.scaling = makeWritableProperty(settings, "scaling", {
    initial: parseFloat(localStorage.getItem("@settings:@scaling")) || 1,
    setter(v) {
        localStorage.setItem("@settings:@scaling", v);
        document.documentElement.style.setProperty("--scaling", v || 1);
        return v;
    },
});
