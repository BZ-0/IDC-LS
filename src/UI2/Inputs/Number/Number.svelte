<script>
import LucideIcon from '@idc/UI2/Design/WLucideIcon.svelte';
import { writable } from "svelte/store";

//
let value = $$props?.value || writable(0);
let input = null;

//
$: value = $$props?.value || writable(0);

//
const onchangeInternal = (ev)=>{
    value?.set(input?.valueAsNumber);
}

</script>

<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
</script>

<!-- -->
<div data-scheme="solid" data-highlight="1" class="number-input round-ns" {...propsFilter($$props)}>
    <button type="button" on:click={()=>{
        input?.stepDown?.();
        onchangeInternal();
    }} class="icon-wrap f-minus" data-scheme="solid" data-highlight="2">
        <LucideIcon inert={true} name={"chevron-left"}/>
    </button>
    <div class="input-wrap hl-ms">
        <input on:change={onchangeInternal} on:input={onchangeInternal} {...propsFilter($$props)} bind:this={input} inert={true} value={$value} type="number" inputmode="numeric" pattern="\d*" virtualkeyboardpolicy="manual"/>
    </div>
    <button type="button" on:click={()=>{
        input?.stepUp?.();
        onchangeInternal();
    }} class="icon-wrap f-plus" data-scheme="solid" data-highlight="2">
        <LucideIcon inert={true} name={"chevron-right"}/>
    </button>
</div>
