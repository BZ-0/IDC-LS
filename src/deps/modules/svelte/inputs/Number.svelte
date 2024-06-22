<script>
import LucideIcon from '@svelte/decors/LucideIcon.svelte';
import { onMount } from 'svelte';

//
let value = $$props.value;
export let min = 0;
export let max = 1;
export let step = 1;

//
let plusBtn = null;
let minusBtn = null;
let input = null;
export let onchange = (ev)=>{}

//
let onchangeInternal = (ev)=>{
    value.set(input.value);
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

<!-- -->
<div class="number-input solid">
    <div bind:this={minusBtn} class="icon-wrap f-minus hl-1">
        <LucideIcon inert={true} name={"chevron-left"}/>
    </div>
    <div class="input-wrap">
        <input bind:this={input} {min} {max} {step} bind:value={$value} inert={true} type="number" inputmode="numeric" pattern="\d*" virtualkeyboardpolicy="manual"/>
    </div>
    <div bind:this={plusBtn} class="icon-wrap f-plus hl-1">
        <LucideIcon inert={true} name={"chevron-right"}/>
    </div>
</div>
