import { makeWritableProperty } from "@states/writables.mjs"

//
export const settings = {};
export const settingsEx = {};

//
settingsEx.columns = makeWritableProperty(settings, "columns", {
    initial: parseInt(localStorage.getItem("@settings:@columns")) || 4,
    setter(v) {
        localStorage.setItem("@settings:@columns", v);
        return v;
    },
});

//
settingsEx.rows = makeWritableProperty(settings, "rows", {
    initial: parseInt(localStorage.getItem("@settings:@rows")) || 4,
    setter(v) {
        localStorage.setItem("@settings:@rows", v);
        return v;
    },
});

//
settingsEx.scaling = makeWritableProperty(settings, "scaling", {
    initial: parseFloat(localStorage.getItem("@settings:@scaling")) || 4,
    setter(v) {
        localStorage.setItem("@settings:@scaling", v);
        document.body.style.setProperty("--scaling", v || 1);
        return v;
    },
});
