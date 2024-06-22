import cdnImport from "@libs/misc/cdnImport.mjs";

//
export default await cdnImport(
    [
        "https://cdn.jsdelivr.net/npm/@importantimport/material-color-utilities/+esm",
    ],
    () => import("@material/material-color-utilities"),
    true
);
