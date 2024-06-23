import { writable } from "svelte/store";

//
export const settings = {
    columns: writable(
        parseInt(localStorage.getItem("@settings:@columns")) || 4
    ),
    rows: writable(parseInt(localStorage.getItem("@settings:@rows")) || 8),
    scaling: writable(
        parseFloat(localStorage.getItem("@settings:@scaling")) || 1.5
    ),
};

//
settings.columns.subscribe((value) => {
    localStorage.setItem("@settings:@columns", value);
});

//
settings.rows.subscribe((value) => {
    localStorage.setItem("@settings:@rows", value);
});

//
settings.scaling.subscribe((value) => {
    localStorage.setItem("@settings:@scaling", value);
    document.body.style.setProperty("--scaling", value || 1);
});
