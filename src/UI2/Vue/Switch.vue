<script setup>
    import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';
    import {reactive, watch, ref, onMounted} from "vue";

    //
    import RangeTouch from 'rangetouch';
    import States from "@unite/scripts/reactive/StateManager.ts";

    //
    const input = ref(null);
    const target = ref(null);
    //const state = ref(null);

    //
    const whenChange = (ev)=>{
        const inp = ev.target;
        (target.value).style.setProperty("--value-mod", (inp.valueAsNumber - inp.min) / (inp.max - inp.min), "");
    }

    //
    onMounted(()=>{
        const inp = input.value;
        //state.value = States.getState(target.value.dataset.state);
        (target.value).style.setProperty("--value-mod", (inp.valueAsNumber - inp.min) / (inp.max - inp.min), "");
    });

</script>

<!-- -->
<template>
    <label ref="target" class="ux-input ux-switch" data-scheme data-highlight="1" v-bind="$attrs">
        <input ref="input" @change="whenChange" @input="whenChange" type="range" min="-1" max="1" step="1"/>
        <div class="fill" data-scheme data-highlight="1"></div>
        <div class="track" data-scheme data-highlight="1"></div>
        <div class="thumb icon-sign" data-scheme data-highlight="1"><LucideIcon name="circle"/></div>
    </label>
</template>
