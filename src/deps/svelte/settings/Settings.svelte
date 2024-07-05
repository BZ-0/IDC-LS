<script>
	import {readableHash} from '@states/readables.mjs';
	import {settings} from "@states/settings.mjs";
	import LucideIcon from '@svelte/decors/LucideIcon.svelte';
	import Checkbox from '@svelte/inputs/Checkbox.svelte';
	import Number from '@svelte/inputs/Number.svelte';
	import Switch from '@svelte/inputs/Switch.svelte';
	import AxGesture from "@unite/interact/gesture.mjs";
	import {onMount} from 'svelte';
	import {fade} from "svelte/transition";
	import Block from '../decors/Block.svelte';

	//
	export let {"@columns": columns, "@rows": rows, "@scaling": scaling , "@theme": theme} = settings;
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
	document.addEventListener("m-dragging", (ev)=>{
		const dt = ev.detail;
		if (settingsEl && dt.pointer.id == pointerIdDrag && (dt.holding.element.deref() == settingsEl)) {
			const wDiff = (settingsEl.parentNode.offsetWidth - settingsEl.clientWidth);
			const hDiff = (settingsEl.parentNode.offsetHeight - settingsEl.clientHeight);

			// change drag-state (correction)
			dt.holding.modified[0] = Math.min(Math.max(dt.holding.shifting[0], -wDiff/2), wDiff/2);
			dt.holding.modified[1] = Math.min(Math.max(dt.holding.shifting[1], -hDiff/2), hDiff/2);
		}
	});
	
	//
	document.addEventListener("click", (ev)=>{
		const {target} = ev;
		if (target.matches(".back-button")) {
			const lessWidth = (settingsEl?.clientWidth || 96*9) <= 96*9
			if (lessWidth && currentPage) { currentPage = ""; } else 
			if ((lessWidth && !currentPage) || !lessWidth) {
				//location.hash = "#";
				history.back(); // true way...
			}
		}
		if (target.matches(".ls-tab-item")) {
			currentPage = target.dataset.page || "";
		}
	})

	//
	let gestureControl = null;
	onMount(()=>{
		// default grid-page
		if ((settingsEl?.clientWidth || 0) >= 96*9) {
			currentPage = "grid-settings";
		}
		
		//
		requestAnimationFrame(()=>{
			if (settingsEl) {
				gestureControl = new AxGesture(settingsEl);
				gestureControl.draggable({
					handler: settingsEl.querySelector(".title-label")
				});
			}
		});
	});
</script>

<script context="module">
    import {propsFilter} from "@unite/utils/utils.mjs";
</script>

<!-- -->
{#if $readableHash == "#settings"}
	<div bind:this={settingsEl} class="ls-settings" transition:fade={{ delay: 0, duration: 100 }} data-current-page={currentPage} {...propsFilter($$props)}>

		<div class="titlebar accent apply-color-theme hl-1">
			<div class="back-button accent hl-2 hl-3h apply-color-theme" style="grid-column: back-button; aspect-ratio: 1 / 1;">
				<LucideIcon inert={true} slot="icon" name={"arrow-left"}/>
			</div>
			<div class="title-label" style="grid-column: title-label;">
				<span tabindex="-1" inert={true}>{tabs.find(({page})=>(page==currentPage))?.label || ""}</span>
			</div>
			<div class="menu-button accent hl-2 hl-3h apply-color-theme" style="grid-column: menu-button; aspect-ratio: 1 / 1;">
				<LucideIcon inert={true} slot="icon" name={"menu"}/>
			</div>
		</div>
		<div class="content apply-color-theme">
			<x-scrollbox class="ls-page ls-tabs accent apply-color-theme" bind:this={tabsEl}>
				
				{#each tabs as tab}
					<Block class="block-decor ls-tab-item accent hl-1h cursor-pointer pe-enable" data-page={tab.page}>
						<LucideIcon inert={true} slot="icon" name={tab.icon}/>
						<div inert={true} class="tab-label">{tab.label}</div>
						<LucideIcon inert={true} slot="element" name={"chevron-right"}/>
					</Block>
				{/each}
			</x-scrollbox>
			<x-scrollbox class="ls-page ls-options">
				
				<div class="page-wrap" transition:fade={{ key: currentPage, delay: 0, duration: 100 }}>
					{#if ["grid-settings", "all-settings"].indexOf(currentPage) >= 0}
						<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
							<div class="form-description"> Grid Layout Settings: </div>
						
							<Block class="block-decor">
								<div class="opt-label">Columns:</div>
								<LucideIcon slot="icon" name={"columns-3"}/>
								<Number slot="element" value={columns} min={4} max={6} step={1}></Number>
								<!--<RangeSlider slot="element" bind:values={$columns} min={4} max={6} step={1}></RangeSlider>-->
							</Block>
							<Block class="block-decor">
								<div class="opt-label">Rows:</div>
								<LucideIcon slot="icon" name={"rows-3"}/>
								<Number slot="element" value={rows} min={8} max={12} step={1}></Number>
								<!--<RangeSlider slot="element" bind:values={$rows} min={8} max={12} step={1}></RangeSlider>-->
							</Block>
						</form>
					{/if}
				
					{#if ["display-settings", "all-settings"].indexOf(currentPage) >= 0}
						<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
							<div class="form-description"> Experimental Display Settings: </div>
						
							<Block class="block-decor">
								<div class="opt-label">Scaling:</div>
								<LucideIcon slot="icon" name={"scaling"}/>
								<Number slot="element" value={scaling} min={0.5} max={1.5} step={0.125}></Number>
								<!--<RangeSlider slot="element" bind:values={$columns} min={4} max={6} step={1}></RangeSlider>-->
							</Block>
						</form>
						
						<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
							<div class="form-description"> Experimental Color Scheme: </div>
							
							<Block class="block-decor">
								<div class="opt-label">Theming:</div>
								<LucideIcon slot="icon" name={"scaling"}/>
								<Switch value={theme} slot="element"></Switch>
							</Block>
						</form>
					{/if}

					{#if ["experimental-settings"].indexOf(currentPage) >= 0}
						<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
							<div class="form-description"> Experimental Color Scheme: </div>

							<Block class="block-decor">
								<div class="opt-label">Test checkbox:</div>
								<LucideIcon slot="icon" name={"scaling"}/>
								<Checkbox slot="element"></Checkbox>
							</Block>
						</form>
					{/if}
				</div>
				
				
			</x-scrollbox>
		</div>

	</div>
{/if}

<style type="scss">
	
</style>
