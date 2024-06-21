<script>
	import { settings } from "grid-state.mjs";
	import RangeSlider from 'svelte-range-slider-pips';

	//
	export let columns = writable([4]);
	export let rows = writable([8]);
	export let currentPage = "grid-settings";

	//
	columns.subscribe(([v])=>{ settings.columns.set(v); })
	rows.subscribe(([v])=>{ settings.rows.set(v); })
</script>

<div class="lx-settings">

	<div class="titlebar">
		
	</div>
	<div class="content">
		<div class="lx-page lx-tabs">
			
		</div>
		<div class="lx-page lx-options">
			
			{#if ["grid-settings"].indexOf(currentPage) >= 0}
				<form data-page data-name="grid-columns-row">
					<RangeSlider s-class="slider" bind:values={columns} min={4} max={6} step={1}></RangeSlider>
					<RangeSlider s-class="slider" bind:values={rows} min={8} max={12} step={1}></RangeSlider>
				</form>
			{/if}
			
		</div>
	</div>

</div>

<style type="scss">
	
</style>
