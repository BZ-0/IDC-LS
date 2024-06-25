<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

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
    onMount(()=>{
        gridW = element?.offsetWidth;
        gridH = element?.offsetHeight;

        //
        new ResizeObserver((entries)=>{
            if (entries.length > 0) {
                for (const entry of entries) {
                    if (entry && entry.contentBoxSize) {
                        gridW = element?.offsetWidth;
                        gridH = element?.offsetHeight;
                    }
                }
            }
        }, {box: "content-box"}).observe(element);
    });
</script>

<!-- -->
<div 
    transition:fade={{ delay: 0, duration: 100 }}
    bind:this={element} 
    data-type={type}
    data-id={id}
    class="icon-grid stretch relative inset-0 orientation-adaptive overflow-visible grid-inside pointer-events-none no-contain inset-0"
    style={`--columns:${columns};--rows:${rows};--grid-w:${gridW};--grid-h:${gridH};`}
    {...$$props}>
    <slot></slot>
</div>
