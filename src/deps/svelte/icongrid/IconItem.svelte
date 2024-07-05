
<script context="module">
    import {propsFilter} from "@unite/utils/utils.mjs";
</script>

<script>
    import AxGesture from "@unite/interact/gesture.mjs";
    import {onMount} from 'svelte';
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
    let gestureControl = null;//new AxGesture(handler);

    //
    onMount(()=>{
        setCellPosition();
        
        // currently, you can't un-use iconItem.pointerId, or else lost multi-touch drag...
        onmount?.(element, iconItem);

        //
        requestAnimationFrame(()=>{
            if (handler) {
                gestureControl = new AxGesture(handler);
                gestureControl.longPress({
                    anyPointer: true,
                    mouseImmediate: true,
                    minHoldTime: 60 * 3600,
                    maxHoldTime: 100
                }, longPress);
            }
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
    <div bind:this={handler} class="icon-design icon-shape">
        <!--<img class="icon-id" alt="IconItem" src="" data-lucide={id}/>-->
        <LucideIcon name={iconItem.icon}/>
    </div>
</div>
