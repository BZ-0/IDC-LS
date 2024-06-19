<script>
	import { onMount } from "svelte";

    export let id = "";
    export let columns = 4;
    export let rows = 8;
    export let type = "";

    let element = null;
    let gridW = 0;
    let gridH = 0;

    //
    onMount(()=>{
        gridW = element.offsetWidth;
        gridH = element.offsetHeight;

        //
        new ResizeObserver((entries)=>{
            if (entries.length > 0) {
                for (const entry of entries) {
                    if (entry && entry.contentBoxSize) {
                        gridW = element.offsetWidth;
                        gridH = element.offsetHeight;
                    }
                }
            }
        }, {box: "content-box"}).observe(element);
    });
</script>

<!-- -->
<div 
    bind:this={element} 
    data-type={type}
    data-id={id}
    class="icon-grid stretch fixed inset-0 orientation-adaptive padding-0 overflow-visible grid-inside pointer-events-none"
    style={`--columns:${columns};--rows:${rows};--grid-w:${gridW};--grid-h:${gridH};`}>
    <slot></slot>
</div>
