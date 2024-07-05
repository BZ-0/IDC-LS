<script>
    import {onMount} from "svelte";
    import {fade} from "svelte/transition";

    //
    export let id = "";
    export let columns = 4;
    export let rows = 8;
    export let type = "";

    //
    let element = null;
    let gridW = 0;
    let gridH = 0;

    //
    const observer = new ResizeObserver((entries)=>{
        if (entries.length > 0) {
            for (const entry of entries) {
                if (entry && entry.contentBoxSize) {
                    element?.style.setProperty?.("--grid-w", gridW = element?.offsetWidth  || entry.contentBoxSize?.[0]?.inlineSize, "");
                    element?.style.setProperty?.("--grid-h", gridH = element?.offsetHeight || entry.contentBoxSize?.[0]?.blockSize, "");
                }
            }
        }
    }, {box: "content-box"})

    //
    onMount(()=>{
        element?.style.setProperty?.("--grid-w", gridW = element?.offsetWidth, "");
        element?.style.setProperty?.("--grid-h", gridH = element?.offsetHeight, "");
        observer.observe(element);
    });
</script>

<script context="module">
    import {propsFilter} from "@unite/utils/utils.mjs";
</script>


<!-- -->
<div 
    transition:fade={{ delay: 0, duration: 100 }}
    bind:this={element} 
    data-type={type}
    data-id={id}
    class="icon-grid stretch relative inset-0 orientation-adaptive overflow-visible grid-inside pointer-events-none no-contain inset-0"
    style={`--columns:${columns};--rows:${rows};--grid-w:${gridW};--grid-h:${gridH};`}
    {...propsFilter($$props)}>
    <slot></slot>
</div>
