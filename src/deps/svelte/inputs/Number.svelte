<script>
import LucideIcon from '@svelte/decors/LucideIcon.svelte';
import { onMount } from 'svelte';

//
let value = $$props?.value;

//
let plusBtn = null;
let minusBtn = null;
let input = null;
export let onchange = (ev)=>{}

//
let onchangeInternal = (ev)=>{
    value?.set(input?.value);
    onchange(ev);
}

//
onMount(()=>{
    //
    plusBtn.addEventListener("click", ()=>{
        input?.stepUp?.();
        onchangeInternal();
    });
    
    //
    minusBtn.addEventListener("click", ()=>{
        input?.stepDown?.();
        onchangeInternal();
    });
    
    //
    input.addEventListener("change", (ev)=>{ onchangeInternal?.(ev); });
    input.addEventListener("input", (ev)=>{ onchangeInternal?.(ev);  });
});
</script>

<script context="module">
    import { propsFilter } from "@libs/svelte/propsFilter.mjs";
</script>

<!-- -->
<div class="number-input solid hl-ns round-ns" {...propsFilter($$props)}>
    <div bind:this={minusBtn} class="icon-wrap f-minus hl-1h">
        <LucideIcon inert={true} name={"chevron-left"}/>
    </div>
    <div class="input-wrap">
        <input {...propsFilter($$props)} bind:this={input} inert={true} type="number" inputmode="numeric" pattern="\d*" virtualkeyboardpolicy="manual" bind:value={$value}/>
    </div>
    <div bind:this={plusBtn} class="icon-wrap f-plus hl-1h">
        <LucideIcon inert={true} name={"chevron-right"}/>
    </div>
</div>
