import { makeWritableProperty } from "@states/writables.mjs"

//
export const settings = {};
export const settingsEx = {};

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
        document.body.style.setProperty("--scaling", v || 1);
        return v;
    },
});
