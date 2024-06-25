import cdnImport from "@libs/misc/cdnImport.mjs"

//
export default cdnImport(
    [
        "https://unpkg.com/culori",
        "https://cdn.jsdelivr.net/npm/culori",
        "https://cdn.skypack.dev/culori",
    ],
    () => import("culori"),
    true
);
