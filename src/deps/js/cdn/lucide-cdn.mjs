import cdnImport from "@libs/misc/cdnImport.mjs";

//
export default await cdnImport(
    ["https://cdn.jsdelivr.net/npm/lucide/+esm"],
    () => import("lucide"),
    true
);
