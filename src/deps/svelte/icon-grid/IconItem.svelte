<script>
    import * as icons from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

    //
    export let iconItem = {};
    export let inert = false;

    //
    export let pointerdown = ()=>{};
    export let dragstart = ()=>{};
    export let dragging = ()=>{};
    export let dragend = ()=>{};
    export let changed = ()=>{};
    export let onmount = ()=>{}

    //
    let element = null;
    let handler = null;
    
    //
    onMount(()=>{
        onmount?.(element, iconItem);

        //
        handler.addEventListener("pointerdown", (ev)=>{
            pointerdown?.(ev);
        });

        //
        element.addEventListener("m-dragstart", (ev)=>{
            dragstart?.(ev.detail);
        });

        //
        element.addEventListener("m-dragging", (ev)=>{
            dragging?.(ev.detail);
        });

        //
        element.addEventListener("m-dragend", (ev)=>{
            iconItem.pointerId = -1;
            dragend?.(ev.detail);
        });

        //
        element.addEventListener("m-changed", (ev)=>{
            changed?.(ev.detail);
        });

    });
</script>

<!-- -->
<div bind:this={element} 
    inert={inert} 
    class="icon-item icon-placement grid-item fspace" 
    style={`
        --cell-x: ${iconItem.cellX}; 
        --cell-y: ${iconItem.cellY};
        --p-cell-x: ${iconItem.pCellX ?? iconItem.cellX};
        --p-cell-y: ${iconItem.pCellY ?? iconItem.cellY};
    `}
    data-id={iconItem.id} 
    data-label-id={iconItem.id}>
    <div bind:this={handler} class="icon-design icon-shape">
        <!--<img class="icon-id" alt="IconItem" src="" data-lucide={id}/>-->
        <svelte:component class="icon-sign" this={icons[iconItem.icon]} {...$$props} />
    </div>
</div>
