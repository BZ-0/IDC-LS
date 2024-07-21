<script>
import LucideIcon from '@idc/UI2/Design/WLucideIcon.svelte';
import { writable } from "svelte/store";
import { onMount } from "svelte";
import States from "@unite/scripts/reactive/StateManager.ts";

//
let input = null;
let target = null;

//
onMount(()=>{
    const input = target.querySelector("input");
    const state = States.getState(target.dataset.state);
    input.value = state[target.dataset.name];
});

</script>

<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
</script>

<!-- -->
<div bind:this={target} data-scheme="solid" data-highlight="1" class="ux-input number-input round-ns" {...propsFilter($$props)}>
    <button type="button" on:click={()=>{
        input?.stepDown?.();
        input?.dispatchEvent(new Event("input", { bubbles: true, cancelable: true, }))
        //onchangeInternal();
    }} class="icon-wrap f-minus" data-scheme="solid" data-highlight="2">
        <LucideIcon inert={true} name={"chevron-left"}/>
    </button>
    <div class="input-wrap hl-ms">
        <input 
            bind:this={input}
            min={$$props.min} 
            max={$$props.max} 
            step={$$props.step} 
            inert={true} 
            type="number" 
            inputmode="numeric" 
            pattern="\d*" 
            virtualkeyboardpolicy="manual"
        />
    </div>
    <button type="button" on:click={()=>{
        input?.stepUp?.();
        input?.dispatchEvent(new Event("input", { bubbles: true, cancelable: true, }))
        //onchangeInternal();
    }} class="icon-wrap f-plus" data-scheme="solid" data-highlight="2">
        <LucideIcon inert={true} name={"chevron-right"}/>
    </button>
</div>
