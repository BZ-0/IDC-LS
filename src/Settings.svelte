<script>
	import { state, layout, size } from "./GridState.ts";
	import LucideIcon from '@unite/design/WLucideIcon.svelte';
	import Checkbox from '@unite/inputs/Checkbox.svelte';
	import Number from '@unite/inputs/Number.svelte';
	import Switch from '@unite/inputs/Switch.svelte';
	import {onMount} from 'svelte';
	import {fade} from "svelte/transition";
	import Block from '@unite/design/Block.svelte';
    import AppFrame from "@unite/appframe/AppFrame.svelte";
    import {writable} from "svelte/store";
	import {settings} from "./CurrentState.ts";
    import {observeBySelector} from "../unite/dom/Observer.ts";

    //
    const columns = writable(settings.columns);
    const rows = writable(settings.rows);
    const scaling = writable(settings.scaling);
    const useZoom = writable(settings.useZoom ?? true);
    const theme = writable(settings.theme);

    //
    $: settings.columns = $columns;
    $: settings.rows = $rows;
	$: settings.scaling = $scaling;
	$: settings.useZoom = $useZoom ?? true;
	$: settings.theme = $theme;

	//
	//export let {"@columns": columns, "@rows": rows, "@scaling": scaling , "@theme": theme, "@use-zoom": useZoom} = settings;
	export let currentPage = "";

	//
	let tabsEl = null;
	let settingsEl = null;

	//
	const tabs = [{
		"page": "grid-settings",
		"icon": "grid",
		"label": "Grid Settings"
	}, {
		"page": "display-settings",
		"icon": "monitor",
		"label": "Display Settings"
	}, {
		"page": "all-settings",
		"icon": "cog",
		"label": "All Settings"
	}, {
		"page": "experimental-settings",
		"icon": "flask-conical",
		"label": "Experimental"
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
	document.documentElement?.addEventListener?.("ux-back", (ev)=>{
        const lessWidth = (settingsEl?.clientWidth || 96*9) < 96*9;
        if (lessWidth && currentPage) { currentPage = ""; ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation(); }
	});

	//
	observeBySelector(document.body, "#settings", ({addedNodes})=>{
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
<AppFrame hashIdName="#settings">
    <span slot="title-name" tabindex="-1" inert={true}>{tabs.find(({page})=>(page==currentPage))?.label || ""}</span>

	<div class="ux-content stretch" id="settings" bind:this={settingsEl} data-current-page={currentPage}>
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
				{#if ["grid-settings", "all-settings"].indexOf(currentPage) >= 0}
					<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
						<div class="form-description"> Grid Layout Settings: </div>
					
						<Block class="ux-block-decor">
							<span class="opt-label">Columns:</span>
							<LucideIcon slot="icon" name={"columns-3"}/>
							<Number slot="element" value={columns} min={4} max={6} step={1}></Number>
							<!--<RangeSlider slot="element" bind:values={$columns} min={4} max={6} step={1}></RangeSlider>-->
						</Block>
						<Block class="ux-block-decor">
							<span class="opt-label">Rows:</span>
							<LucideIcon slot="icon" name={"rows-3"}/>
							<Number slot="element" value={rows} min={8} max={12} step={1}></Number>
							<!--<RangeSlider slot="element" bind:values={$rows} min={8} max={12} step={1}></RangeSlider>-->
						</Block>
					</form>
				{/if}
			
				{#if ["display-settings", "all-settings"].indexOf(currentPage) >= 0}
					<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
						<div class="form-description"> Experimental Display Settings: </div>
					
						<Block class="ux-block-decor">
							<span class="opt-label">Scaling:</span>
							<LucideIcon slot="icon" name={"scaling"}/>
							<Number slot="element" value={scaling} min={0.5} max={1.5} step={0.125}></Number>
							<!--<RangeSlider slot="element" bind:values={$columns} min={4} max={6} step={1}></RangeSlider>-->
						</Block>
					</form>
					
					<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
						<div class="form-description"> Experimental Color Scheme: </div>
						
						<Block class="ux-block-decor">
							<span class="opt-label">Theming:</span>
							<LucideIcon slot="icon" name={"scaling"}/>
							<Switch value={theme} slot="element"></Switch>
						</Block>
					</form>
				{/if}

				{#if ["experimental-settings"].indexOf(currentPage) >= 0}
					<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
						<div class="form-description"> Experimental Color Scheme: </div>

						<Block class="ux-block-decor">
							<span class="opt-label">Use `zoom` property?:</span>
							<LucideIcon slot="icon" name={"scan-search"}/>
							<Checkbox value={useZoom} slot="element"></Checkbox>
						</Block>
					</form>
				{/if}
			</div>
			
			
		</x-scrollbox>
	</div>
</AppFrame>

<style type="scss" lang="scss">

</style>
