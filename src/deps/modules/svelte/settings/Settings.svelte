<script>
	import { settings } from "@states/gridState.mjs";
	import LucideIcon from '@svelte/decors/LucideIcon.svelte';
	import Number from '@svelte/inputs/Number.svelte';
	import { writable } from 'svelte/store';
	import Block from '../decors/Block.svelte';

	//
	export let columns = writable(parseInt(localStorage.getItem("@settings:@columns")) || 4);
	export let rows = writable(parseInt(localStorage.getItem("@settings:@rows")) || 8);
	export let currentPage = "grid-settings";

	//
	columns.subscribe((v)=>{ settings.columns.set(v); })
	rows.subscribe((v)=>{ settings.rows.set(v); })
</script>

<div class="lx-settings" data-current-page={currentPage} {...$$props}>

	<div class="titlebar solid apply-color-theme hl-1">
		
	</div>
	<div class="content solid apply-color-theme">
		<div class="lx-page lx-tabs">
			<Block class="block-decor lx-tab-item solid">
				<LucideIcon slot="icon" name={"grid"}/>
				<div class="tab-label">Grid Settings</div>
			</Block>
		</div>
		<div class="lx-page lx-options">
			
			{#if ["grid-settings"].indexOf(currentPage) >= 0}
				<form data-page data-name="grid-columns-row">
					<Block class="block-decor solid">
						<div class="opt-label">Columns:</div>
						<LucideIcon slot="icon" name={"columns-3"}/>
						<Number slot="element" bind:value={columns} min={4} max={6} step={1}></Number>
						<!--<RangeSlider slot="element" bind:values={$columns} min={4} max={6} step={1}></RangeSlider>-->
					</Block>
					<Block class="block-decor solid">
						<div class="opt-label">Rows:</div>
						<LucideIcon slot="icon" name={"rows-3"}/>
						<Number slot="element" bind:value={rows} min={8} max={12} step={1}></Number>
						<!--<RangeSlider slot="element" bind:values={$rows} min={8} max={12} step={1}></RangeSlider>-->
					</Block>
				</form>
			{/if}
			
		</div>
	</div>

</div>

<style type="scss">
	
</style>
