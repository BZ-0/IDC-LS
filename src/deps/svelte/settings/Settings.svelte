<script>
	import { readableHash } from '@states/readables.mjs';
	import { settingsEx } from "@states/settings.mjs";
	import LucideIcon from '@svelte/decors/LucideIcon.svelte';
	import Number from '@svelte/inputs/Number.svelte';
	import { onMount } from 'svelte';
	import { fade } from "svelte/transition";
	import Block from '../decors/Block.svelte';

	//
	export let {columns, rows} = settingsEx;
	export let currentPage = "";

	//
	const tabs = [{
		"page": "grid-settings",
		"icon": "grid",
		"label": "Grid Settings"
	}, {
		"page": "display-settings",
		"icon": "monitor",
		"label": "Display Settings"
	}];

	//
	let tabsEl = null;
	let settingsEl = null;

	//
	onMount(()=>{
		// default grid-page
		if ((settingsEl?.clientWidth || 0) >= 96*10) {
			currentPage = "grid-settings";
		}

		//
		document.addEventListener("click", (ev)=>{
			const {target} = ev;
			if (target.matches(".ls-tab-item")) {
				currentPage = target.dataset.page || "";
			}
		})
	});
</script>

<!-- -->
{#if $readableHash == "#settings"}
	<div bind:this={settingsEl} class="ls-settings" transition:fade={{ delay: 0, duration: 100 }} data-current-page={currentPage} {...$$props}>

		<div class="titlebar accent apply-color-theme hl-1">
			<div class="back-button accent hl-2 hl-3h apply-color-theme" style="grid-column: back-button; aspect-ratio: 1 / 1;">
				<LucideIcon inert={true} slot="icon" name={"arrow-left"}/>
			</div>
			<div class="title-label" style="grid-column: title-label;">
				<span>{tabs[currentPage]?.label || ""}</span>
			</div>
			<div class="menu-button accent hl-2 hl-3h apply-color-theme" style="grid-column: menu-button; aspect-ratio: 1 / 1;">
				<LucideIcon inert={true} slot="icon" name={"menu"}/>
			</div>
		</div>
		<div class="content apply-color-theme">
			<div class="ls-page ls-tabs accent apply-color-theme" bind:this={tabsEl}>
			
				{#each tabs as tab}
					<Block class="block-decor ls-tab-item accent hl-1h cursor-pointer pe-enable" data-page={tab.page}>
						<LucideIcon inert={true} slot="icon" name={tab.icon}/>
						<div inert={true} class="tab-label">{tab.label}</div>
					</Block>
				{/each}
			</div>
			<div class="ls-page ls-options">
				
				{#if ["grid-settings"].indexOf(currentPage) >= 0}
					<form data-page data-name="grid-columns-row" transition:fade={{ delay: 0, duration: 100 }}>
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
				
			</div>
		</div>

	</div>
{/if}

<style type="scss">
	
</style>
