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

    //
    const columns = writable(layout[0] || 4);
    const rows = writable(layout[1] || 8);
    const scaling = writable(1);
    const useZoom = writable(true);
    const theme = writable(0);

    //
    $: layout[0] = $columns;
    $: layout[1] = $rows;

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
	document.documentElement.addEventListener("ux-back", (ev)=>{
        const lessWidth = (settingsEl?.clientWidth || 96*9) <= 96*9
		if (lessWidth && currentPage) { currentPage = ""; } else 
		if (!lessWidth || currentPage) {
			ev.preventDefault();
		}
	});
	
	//
	document.documentElement.addEventListener("click", (ev)=>{
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
	onMount(()=>{
		// default grid-page
		if ((settingsEl?.clientWidth || 0) >= 96*9) {
			currentPage = "grid-settings";
		}
	});
</script>

<script context="module">
    import {propsFilter} from "@unite/utils/Utils.ts";
</script>

<!-- -->
<AppFrame hashIdName="#settings">
    <span slot="title-name" tabindex="-1" inert={true}>{tabs.find(({page})=>(page==currentPage))?.label || ""}</span>

		<div class="ux-content stretch" id="settings" bind:this={settingsEl}>
			<x-scrollbox class="ls-page ls-tabs stretch hl-1" bind:this={tabsEl}>
				
				{#each tabs as tab}
					<Block class="ux-block-decor ux-default-theme hl-1 hl-2h ls-tab-item cursor-pointer pe-enable" data-page={tab.page}>
						<LucideIcon inert={true} slot="icon" name={tab.icon}/>
						<div inert={true} class="tab-label">{tab.label}</div>
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
								<div class="opt-label">Columns:</div>
								<LucideIcon slot="icon" name={"columns-3"}/>
								<Number slot="element" value={columns} min={4} max={6} step={1}></Number>
								<!--<RangeSlider slot="element" bind:values={$columns} min={4} max={6} step={1}></RangeSlider>-->
							</Block>
							<Block class="ux-block-decor">
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
						
							<Block class="ux-block-decor">
								<div class="opt-label">Scaling:</div>
								<LucideIcon slot="icon" name={"scaling"}/>
								<Number slot="element" value={scaling} min={0.5} max={1.5} step={0.125}></Number>
								<!--<RangeSlider slot="element" bind:values={$columns} min={4} max={6} step={1}></RangeSlider>-->
							</Block>
						</form>
						
						<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
							<div class="form-description"> Experimental Color Scheme: </div>
							
							<Block class="ux-block-decor">
								<div class="opt-label">Theming:</div>
								<LucideIcon slot="icon" name={"scaling"}/>
								<Switch value={theme} slot="element"></Switch>
							</Block>
						</form>
					{/if}

					{#if ["experimental-settings"].indexOf(currentPage) >= 0}
						<form data-page class="form-wrap solid hl-ns" data-name="grid-columns-row">
							<div class="form-description"> Experimental Color Scheme: </div>

							<Block class="ux-block-decor">
								<div class="opt-label">Use `zoom` property?:</div>
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
	@use "../unite/core/ClassLets";
	@use "../unite/core/Utils" as u;
	@use "../unite/design/ColorTheme";
	
	//
	#settings {
        @extend .contain-size;
	
	    //
        display: grid;
        grid-template-columns: minmax(18rem, max-content) minmax(0px, 1fr);
        container-name: ls-settings;
        container-type: size;
        position: relative;

        //
        .ls-tab-item {
            max-block-size: 4rem;
        }
        
        //
        &[data-current-page="all-settings"] .ls-tab-item[data-page="all-settings"],
        &[data-current-page="grid-settings"] .ls-tab-item[data-page="grid-settings"],
        &[data-current-page="display-settings"] .ls-tab-item[data-page="display-settings"],
        &[data-current-page="experimental-settings"] .ls-tab-item[data-page="experimental-settings"] 
        { @extend .ux-inverse; }
        
        //
        .ls-tab-item .in-element {
            box-sizing: border-box;
            max-block-size: 4rem;
            padding-inline: 0rem !important;
            padding: 1rem !important;
            
            & > * {
                @extend .stretch;
            }
        }
        
        //
        .form-description {
            @extend .stretch;
            @extend .align-center;
        
            //
            display: flex;
            padding: 1rem;
            opacity: 0.6;
            padding-block-end: 0rem;
            font-size: 0.8rem;
            
            //
            background-color: var(--current-surface-color);
        }

        //
        .ls-tabs { grid-column: 1 / 1; }
        .ls-options { grid-column: 2 / 2; position: relative; }

		//
		@container ls-settings (inline-size < 9in) {
			.ls-page { grid-column: 1 / 2 span; }
		}

        //
        .ls-options {
            @extend .stretch;
        }

        //
        .block-decor {
            padding-inline-end: env(safe-area-inset-right, 0px) !important;
        }
        
        //
        .page-wrap {
            inset: 0px;
            position: absolute;

            //
            @include u.clamped-width(stretch, stretch, stretch);
            @include u.clamped-height(stretch, max-content, none);
        }
        
        //
        .opt-label {//
            @extend .align-center;
            @extend .stretch;
            @extend .no-wrap;
            @extend .align-inline-left;
            
            //
            display: flex;
        }

        //
        .ls-tabs {
            display: grid;
            grid-template-columns: minmax(0px, 1fr);
            grid-auto-rows: minmax(2rem, max-content);

            //
            padding: 0px;
            gap: 0px;

            //
            .ls-tab-item {
                @extend .stretch;
                
                //
                display: grid;

                //
                grid-template-columns: subgrid;
                grid-template-rows: minmax(2rem, max-content);
                grid-column: 1 / 3 span;
                grid-row: auto;
                padding: 0px;
    
                //
                padding-inline-start: env(safe-area-inset-left, 0px) !important;
    
                //
                min-block-size: max-content;
            }
        }
    }
</style>
