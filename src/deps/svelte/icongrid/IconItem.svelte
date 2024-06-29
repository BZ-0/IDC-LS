
<script context="module">
    import { propsFilter } from "@libs/svelte/propsFilter.mjs";
</script>

<script>
    import { longpress as lgp } from "@libs/orion/longpress.mjs";
    import { onMount } from 'svelte';
    import LucideIcon from '../decors/LucideIcon.svelte';
    

    //
    export let iconItem = {};
    export let inert = false;

    //
    export let longPress = ()=>{};
    export let dragstart = ()=>{};
    export let dragging = ()=>{};
    export let dragend = ()=>{};
    export let changed = ()=>{};
    export let onmount = ()=>{}

    //
    let element = null;
    let handler = null;
    
    //
    const setCellPosition = (el = element)=>{
        if (el) {
            el.style.setProperty("--p-cell-x", iconItem.cellX, "");
            el.style.setProperty("--p-cell-y", iconItem.cellY, "");
            el.style.setProperty("--cell-x", iconItem.cellX, "");
            el.style.setProperty("--cell-y", iconItem.cellY, "");
        }
    }
    
    //
    onMount(()=>{
        setCellPosition();
        
        // currently, you can't un-use iconItem.pointerId, or else lost multi-touch drag...
        onmount?.(element, iconItem);

        //
        handler.addEventListener("long-press", (ev)=>{
            longPress?.(ev);
        });

        //
        element.addEventListener("m-dragstart", (ev)=>{
            setCellPosition();
            dragstart?.(ev.detail);
        });

        //
        element.addEventListener("m-dragging", (ev)=>{
            dragging?.(ev.detail);
        });

        //
        element.addEventListener("m-dragend", (ev)=>{
            setCellPosition();
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
    class="icon-item icon-placement grid-item auto-space" 
    {...propsFilter($$props)}
    data-action={iconItem.action} 
    data-href={iconItem.href} 
    data-id={iconItem.id} 
    data-label-id={iconItem.id}
    data-ctx={"icon"}
    >
    <div use:lgp bind:this={handler} class="icon-design icon-shape">
        <!--<img class="icon-id" alt="IconItem" src="" data-lucide={id}/>-->
        <LucideIcon name={iconItem.icon}/>
    </div>
</div>
