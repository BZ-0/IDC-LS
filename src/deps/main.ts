// use workers
const loading = Promise.allSettled([
	import("@workers/js/stylework.mjs"),
	import("@workers/js/colormod.mjs"),
	import("@workers/js/actionRegistry.mjs"),
	import("@webcomp/scrollbox/scrollbox.mjs"),
	import("@webcomp/wcanvas/wcanvas.mjs"),
]);

//
import App from "@tests/ColorsAndDecors.svelte";
//import App from '@apps/tests/ScrollBox.svelte';
//import App from '@apps/tests/MultiPageTest.svelte';

//
const app = new App({
	target: document.body,
});

//
export default app;
