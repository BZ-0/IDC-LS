<script>
    import LucideIcon from '@svelte/decors/LucideIcon.svelte';
    import { onMount } from 'svelte';
    import { writable } from "svelte/store";
    
    //
    export let fieldName = "";
    export let value = $$props?.value || writable(0);
    export let element = null;
    export let container = null;
    
    //
    const _whenChange = (ev)=>{
        value?.set?.(element.valueAsNumber);
        container.style.setProperty("--value-mod", (element.valueAsNumber - element.min) / (element.max - element.min), "");
    }
    
    //
    onMount(()=>{
        element.addEventListener("change", _whenChange);
        element.addEventListener("input", _whenChange);
        
        //
        container.style.setProperty("--value-mod", (element.valueAsNumber - element.min) / (element.max - element.min), "");
    });
</script>

<!-- -->
<label bind:this={container} class="ls-switch hl-1">
    <input bind:this={element} bind:value={$value} type="range" data-name={fieldName} min={-1} max={1} step={1}>
    <div class="track hl-1"></div>
    <div class="thumb icon-sign hl-2"><LucideIcon name={"circle"}/></div>
</label>
