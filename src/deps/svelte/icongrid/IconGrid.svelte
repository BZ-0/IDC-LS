<script>
    import {settings} from "@states/settings.mjs";
    import {onMount} from "svelte";
    import {fade} from "svelte/transition";

    //
    let {
        "@rows": rows, 
        "@columns": columns
    } = settings;
    let element = null;

    // 
    rows.subscribe((v)=>{
        if (element) {
            element.style.setProperty("--rows", v, "");
        }
    });
    
    //
    columns.subscribe((v)=>{
        if (element) {
            element.style.setProperty("--columns", v, "");
        }
    });

    //
    export let id = "";
    export let type = "";

    //
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
    {...propsFilter($$props)}>
    <slot></slot>
</div>
