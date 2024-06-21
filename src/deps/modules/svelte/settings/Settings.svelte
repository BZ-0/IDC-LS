<script>
	import { settings } from "grid-state.mjs";
	import RangeSlider from 'svelte-range-slider-pips';
	import Area from './../decors/Area.svelte';

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
			<Area class="area-decor lx-tab-item">
				
			</Area>
		</div>
		<div class="lx-page lx-options">
			
			{#if ["grid-settings"].indexOf(currentPage) >= 0}
				<form data-page data-name="grid-columns-row">
					<Area class="area-decor area-alt">
						<div class="opt-label"></div>
						<RangeSlider slot="element" s-class="slider" bind:values={columns} min={4} max={6} step={1}></RangeSlider>
					</Area>
					<Area class="area-decor area-alt">
						<div class="opt-label"></div>
						<RangeSlider slot="element" s-class="slider" bind:values={rows} min={8} max={12} step={1}></RangeSlider>
					</Area>
				</form>
			{/if}
			
		</div>
	</div>

</div>

<style type="scss">
	
</style>
