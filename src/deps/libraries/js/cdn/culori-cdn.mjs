import cdnImport from "@libraries/js/misc/cdnImport.mjs";

//
export default await cdnImport(["https://unpkg.com/culori", "https://cdn.jsdelivr.net/npm/culori", "https://cdn.skypack.dev/culori"], ()=>import("culori"), true);
