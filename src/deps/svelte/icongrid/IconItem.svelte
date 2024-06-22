<script>
    import { longpress as lgp } from "@libraries/js/orion/longpress.mjs";
    import { onMount } from 'svelte';
    import LucideIcon from '../decors/LucideIcon.svelte';

    //
    export let iconItem = {};
    export let inert = false;

    //
    export let longpress = ()=>{};
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
        handler.addEventListener("longpress", (ev)=>{
            longpress?.(ev);
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
    class="icon-item icon-placement grid-item auto-space" 
    style={`
        --cell-x: ${iconItem.cellX}; 
        --cell-y: ${iconItem.cellY};
        --p-cell-x: ${iconItem.pCellX ?? iconItem.cellX};
        --p-cell-y: ${iconItem.pCellY ?? iconItem.cellY};
    `}
    data-action={iconItem.action} 
    data-href={iconItem.href} 
    data-id={iconItem.id} 
    data-label-id={iconItem.id}>
    <div use:lgp bind:this={handler} class="icon-design icon-shape">
        <!--<img class="icon-id" alt="IconItem" src="" data-lucide={id}/>-->
        <LucideIcon name={iconItem.icon}/>
    </div>
</div>
