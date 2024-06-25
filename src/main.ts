// use workers
const loading = Promise.allSettled([
    import("@states/gridState.mjs"),
    import("@workers/stylework.mjs"),
    import("@workers/actionRegistry.mjs"),
    import("@webcomp/scrollbox/scrollbox.mjs"),
    import("@webcomp/wcanvas/wcanvas.mjs").then(
        (_) => import("@workers/colormod.mjs")
    ),
]);

//
//import App from "@tests/MultiPageTest.svelte";
//import App from '@tests/ScrollBox.svelte'
//import App from "@tests/CtxMenu.svelte";
//import App from "@tests/SettingsTest.svelte"
import App from "@tests/Candidate.svelte"

//
const app = new App({
    target: document.body,
});

//
export default app;
