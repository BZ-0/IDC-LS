<script>
	import { state, layout, size } from "./GridState.ts";
	import LucideIcon from '@unite/design/WLucideIcon.svelte';
	import Checkbox from '@unite/inputs/Checkbox.svelte';
	import Number from '@unite/inputs/Number.svelte';
	import Switch from '@unite/inputs/Switch.svelte';
	import {onMount} from 'svelte';
	import {fade} from "svelte/transition";
	import Block from '@unite/design/Block.svelte';
    import {writable} from "svelte/store";
	import {settings} from "./CurrentState.ts";
    import {observeBySelector} from "../unite/dom/Observer.ts";

	//
	export let windowManager = null;
	
	//
	windowManager.addTask("#manager", {
		icon: "folder",
		label: "Manager",
		detached: false
	});

	//
	//export let {"@columns": columns, "@rows": rows, "@scaling": scaling , "@theme": theme, "@use-zoom": useZoom} = settings;
	export let currentPage = "";

	//
	let tabsEl = null;
	let settingsEl = null;

	//
	const tabs = [{
		"page": "wallpapers",
		"icon": "wallpaper",
		"label": "Wallpapers"
	}];

	//
	let pointerIdDrag = -1;
	
	//
	document.documentElement.addEventListener("click", (ev)=>{
		const {target} = ev;
		if (target.matches(".ls-tab-item")) {
			const _ = target.dataset.page || "";
			if (_ != currentPage) { currentPage = _; };
		}
	})

	//
	/*document.documentElement?.addEventListener?.("ux-back", (ev)=>{
        if (ev.target == settingsEl) {
            const lessWidth = (settingsEl?.clientWidth || 96*9) < 96*9;
            if (lessWidth && currentPage) { currentPage = ""; ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation(); }
		}
	});*/

	//
	observeBySelector(document.body, "#manager", ({addedNodes})=>{
		settingsEl ||= addedNodes[0];
		
		//
		if ((settingsEl?.clientWidth || 0) >= 96*9) {
			currentPage ||= "grid-settings";
		}
	});

	//
	onMount(()=>{
		// default grid-page
		if ((settingsEl?.clientWidth || 0) >= 96*9) {
			currentPage ||= "grid-settings";
		}
	});
</script>

<script context="module">
    import {propsFilter} from "@unite/utils/Utils.ts";
</script>

<!-- -->

    <div class="ux-title-label ux-solid-transparent">
        <span tabindex="-1" inert={true}>{tabs.find(({page})=>(page==currentPage))?.label || ""}</span>
    </div>

	<div class="ux-content stretch" id="manager" bind:this={settingsEl} data-current-page={currentPage}>
		<x-scrollbox class="ls-page ls-tabs stretch hl-1" bind:this={tabsEl}>
			
			{#each tabs as tab}
				<Block class="ux-block-decor ux-default-theme hl-1 hl-2h ls-tab-item cursor-pointer pe-enable" data-page={tab.page}>
					<LucideIcon inert={true} slot="icon" name={tab.icon}/>
					<span inert={true} class="tab-label">{tab.label}</span>
					<LucideIcon inert={true} slot="element" name={"chevron-right"}/>
				</Block>
			{/each}
		</x-scrollbox>
		<x-scrollbox class="ls-page ls-options stretch">
			
			<div class="page-wrap" transition:fade={{ key: currentPage, delay: 0, duration: 100 }}>
				{#if ["wallpapers"].indexOf(currentPage) >= 0}
					<form data-page class="form-wrap hl-ns" data-name="wallpapers">

					</form>
				{/if}
			</div>
			
		</x-scrollbox>
	</div>

<style type="scss" lang="scss">

</style>
