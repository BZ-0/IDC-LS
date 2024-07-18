<script>
    import LucideIcon from '@unite/design/WLucideIcon.svelte';
    import Block from '@unite/design/Block.svelte';

    //
    import Checkbox from '@unite/inputs/Checkbox.svelte';
    import Number from '@unite/inputs/Number.svelte';
    import Switch from '@unite/inputs/Switch.svelte';

    //
    import { state, layout, size } from "./GridState.ts";
    import { settings } from "./CurrentState.ts";

    //
    import { onMount } from 'svelte';
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";

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

</script>

<!-- -->
<div class="ls-screen" id="settings">

    <div class="ls-nav ux-solid hl-1">

    
        <div class="f-space"></div>
    
        <button class="back-act hl-1 hl-2h">
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"arrow-left"}/></div>
            <div inert={true} class="name">Back</div>
        </button>
    </div>
    <x-scrollbox class="ux-space" transition:fade={{ key: currentPage, delay: 0, duration: 100 }}>
        <form data-page class="form-wrap hl-ns" data-name="grid-columns-row">
            <div class="form-description"> Grid Layout Settings: </div>
    
            <Block class="ux-block-decor pe-none">
                <span class="opt-label">Columns:</span>
                <LucideIcon slot="icon" name={"columns-3"}/>
                <Number slot="element" value={columns} min={4} max={6} step={1}></Number>
                <!--<RangeSlider slot="element" bind:values={$columns} min={4} max={6} step={1}></RangeSlider>-->
            </Block>
            <Block class="ux-block-decor pe-none">
                <span class="opt-label">Rows:</span>
                <LucideIcon slot="icon" name={"rows-3"}/>
                <Number slot="element" value={rows} min={8} max={12} step={1}></Number>
                <!--<RangeSlider slot="element" bind:values={$rows} min={8} max={12} step={1}></RangeSlider>-->
            </Block>
        </form>
    
        <form data-page class="form-wrap hl-ns" data-name="grid-columns-row">
            <div class="form-description"> Experimental Display Settings: </div>
        
            <Block class="ux-block-decor pe-none">
                <span class="opt-label">Scaling:</span>
                <LucideIcon slot="icon" name={"scaling"}/>
                <Number slot="element" value={scaling} min={0.5} max={1.5} step={0.125}></Number>
                <!--<RangeSlider slot="element" bind:values={$columns} min={4} max={6} step={1}></RangeSlider>-->
            </Block>
        </form>
    
        <form data-page class="form-wrap hl-ns" data-name="grid-columns-row">
            <div class="form-description"> Experimental Color Scheme: </div>
            
            <Block class="ux-block-decor pe-none">
                <span class="opt-label">Theming:</span>
                <LucideIcon slot="icon" name={"scaling"}/>
                <Switch value={theme} slot="element"></Switch>
            </Block>
        </form>
    </x-scrollbox>

</div>
