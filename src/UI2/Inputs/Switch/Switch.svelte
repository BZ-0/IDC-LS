<script>
    import LucideIcon from '@idc/UI2/Design/WLucideIcon.svelte';
    import {onMount} from 'svelte';
    import {writable} from "svelte/store";
    import RangeTouch from 'rangetouch';
    import States from "@unite/scripts/reactive/StateManager.ts";

    //
    let input = null;
    let target = null;

    //
    const _whenChange = (ev)=>{
        const input = ev.target;
        target.style.setProperty("--value-mod", (input.valueAsNumber - input.min) / (input.max - input.min), "");
    }

    //
    onMount(()=>{
        const input = target.querySelector("input");
        const state = States.getState(target.dataset.state);
        input.value = state[target.dataset.name];
        target.style.setProperty("--value-mod", (input.valueAsNumber - input.min) / (input.max - input.min), "");
    });

</script>

<!-- -->
<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
</script>

<!-- -->
<label  bind:this={target} class="ux-input ux-switch" data-scheme data-highlight="1" {...propsFilter($$props)}>
    <input 
        on:change={_whenChange} 
        on:input={_whenChange} 
        type="range" 
        min={-1} max={1} step={1}>
    <div class="fill" data-scheme data-highlight="1"></div>
    <div class="track" data-scheme data-highlight="1"></div>
    <div class="thumb icon-sign" data-scheme data-highlight="1"><LucideIcon name={"circle"}/></div>
</label>
