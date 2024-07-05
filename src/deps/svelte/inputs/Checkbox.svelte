<script>
    import LucideIcon from '@svelte/decors/LucideIcon.svelte';
    import {onMount} from 'svelte';
    import {writable} from "svelte/store";

    //
    export let fieldName = "";
    export let value = $$props?.value || writable(0);
    export let element = null;
    export let container = null;

    //
    const _whenChange = (ev)=>{
        value?.set?.(ev.target.valueAsNumber);
    }

    //
    onMount(()=>{
        //value?.set?.(element);
    });
</script>

<!-- -->
<script context="module">
    import {propsFilter} from "@unite/utils/utils.mjs";
</script>

<!-- -->
<label bind:this={container} class="ls-checkbox hl-2">
    <input 
        {...propsFilter($$props)}
        on:change={_whenChange}
        on:input={_whenChange}
        bind:this={element} bind:value={$value} type="checkbox" data-name={fieldName}>
    <div class="icon-sign hl-2"><LucideIcon class="done lucide" name={"check"}/> <LucideIcon class="circle lucide" name={"circle"}/> </div>
</label>
