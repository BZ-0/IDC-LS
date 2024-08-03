<script setup>
import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';
import States from "@unite/scripts/reactive/StateManager.ts";

//
import {reactive, watch, ref, onMounted} from "vue";

//
const input = ref(null);
const target = ref(null);

//
//const state = ref(null);
const props = defineProps({
    min: Number,
    max: Number,
    step: Number
});

//
const whenClickDown = ()=>{
    input.value?.stepDown?.();
    input.value?.dispatchEvent(new Event("input", { bubbles: true, cancelable: true, }))
    requestAnimationFrame(()=>navigator?.vibrate?.([10]))
}

//
const whenClickUp = ()=>{
    input.value?.stepUp?.();
    input.value?.dispatchEvent(new Event("input", { bubbles: true, cancelable: true, }))
    requestAnimationFrame(()=>navigator?.vibrate?.([10]))
}

onMounted(() => {
    //state.value = States.getState(target.dataset.state);
});

</script>

<template>
    <div ref="target" data-scheme="solid" data-highlight="1" class="ui-input number-input" v-bind="$attrs">
        <button type="button" @click="whenClickDown" class="icon-wrap f-minus" data-scheme="solid" data-highlight="2">
            <LucideIcon inert name="chevron-left"/>
        </button>
        <div class="input-wrap hl-ms">
            <input
                ref="input"
                :min="props.min"
                :max="props.max"
                :step="props.step"
                inert
                type="number"
                inputmode="numeric"
                pattern="\d*"
                virtualkeyboardpolicy="manual"
            />
        </div>
        <button type="button" @click="whenClickUp" class="icon-wrap f-plus" data-scheme="solid" data-highlight="2">
            <LucideIcon inert name="chevron-right"/>
        </button>
    </div>
</template>
