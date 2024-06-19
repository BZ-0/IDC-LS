
//
import "@deps/modifiers/js/stylework.mjs"
import "@deps/modifiers/js/colormod.mjs"

//
import "@complex/scrollbox/scrollbox.mjs";
import "@complex/wcanvas/wcanvas.mjs";

//
import App from '@apps/tests/WCanvas.svelte';
//import App from '@apps/tests/ScrollBox.svelte';
//import App from '@apps/tests/MultiPageTest.svelte';

//
const app = new App({
	target: document.body
});

//
export default app;
