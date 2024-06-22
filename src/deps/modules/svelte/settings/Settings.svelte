<script>
	import LucideIcon from '@modules/svelte/icongrid/LucideIcon.svelte';
	import { settings } from "grid-state.mjs";
	import RangeSlider from 'svelte-range-slider-pips';
	import Block from './../decors/Block.svelte';

	//
	export let columns = writable([4]);
	export let rows = writable([8]);
	export let currentPage = "grid-settings";

	//
	columns.subscribe(([v])=>{ settings.columns.set(v); })
	rows.subscribe(([v])=>{ settings.rows.set(v); })
</script>

<div class="lx-settings" data-current-page={currentPage}>

	<div class="titlebar">
		
	</div>
	<div class="content">
		<div class="lx-page lx-tabs">
			<Block class="block-decor lx-tab-item">
				<LucideIcon name={iconItem.icon}/>
				<div class="tab-label"></div>
			</Block>
		</div>
		<div class="lx-page lx-options">
			
			{#if ["grid-settings"].indexOf(currentPage) >= 0}
				<form data-page data-name="grid-columns-row">
					<Block class="block-decor layout-alt">
						<div class="opt-label"></div>
						<RangeSlider slot="element" s-class="slider" bind:values={columns} min={4} max={6} step={1}></RangeSlider>
					</Block>
					<Block class="block-decor layout-alt">
						<div class="opt-label"></div>
						<RangeSlider slot="element" s-class="slider" bind:values={rows} min={8} max={12} step={1}></RangeSlider>
					</Block>
				</form>
			{/if}
			
		</div>
	</div>

</div>

<style type="scss">
	
</style>
