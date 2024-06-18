<script>
    import * as icons from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
    import { createEventDispatcher } from "svelte";

    //
    const dispatch = createEventDispatcher();

    //
    let realCell = {x: 0, y: 0};

    //
    export let labelId = "";
    export let cellX = writable(0);
    export let cellY = writable(0);
    export let id = "";
    export let icon = "";
    export let inert = false;

    //
    cellX.subscribe((value)=>{ realCell.x = value; });
    cellY.subscribe((value)=>{ realCell.y = value; });

    //
    let element = null;

    //
    onMount(()=>{
        element.addEventListener("m-dragstart", (ev)=>{
            dispatch("m-dragstart", ev.detail);
        });
        element.addEventListener("m-dragging", (ev)=>{
            dispatch("m-dragging", ev.detail);
        });
        element.addEventListener("m-dragend", (ev)=>{
            dispatch("m-dragend", ev.detail);
        });
    });
</script>

<!-- -->
<div bind:this={element} inert={inert} class="icon-placement grid-item fspace" style={`--cell-x: ${realCell.x}; --cell-y: ${realCell.y}`} data-id={id} data-label-id={labelId}>
    <div class="icon-design icon-shape">
        <!--<img class="icon-id" alt="IconItem" src="" data-lucide={id}/>-->
        <svelte:component class="icon-sign" this="{icons[icon]}" {...$$props} />
    </div>
</div>

<!-- -->
<style type="scss">@use "./helpers/gridutils";</style>
