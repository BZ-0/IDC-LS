<script setup>
    import { computed, onMounted, ref } from 'vue';
    import * as iconPack from "lucide-vue-next";

    //
    const camelize = (str) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }

    //
    const fup = (str)=>{
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    //
    const cmz = (str)=>{
        return fup(camelize(str?.trim?.()||""));
    }

    //
    const props = defineProps({
        hook: {
            type: Function,
            default: ()=>{}
        },
        name: {
            type: String,
            required: true
        },
        size: Number,
        color: String,
        strokeWidth: {
            type: Number,
            default: 2
        },
        defaultClass: String
    });

    //
    import { useAttrs } from 'vue';
    import { observeAttribute } from '@unite/scripts/dom/Observer.ts';

    //
    const attrs = useAttrs();
    const names = ref((props.name.split(",")||[props.name]));
    //const icons = computed(() => Array.from(Object.entries(iconPack)).filter( ([K,I])=>names.value.indexOf(K)>=0 ));

    // reactive attribute...
    const target = ref(null);
    const current = ref(cmz(names.value[0]));

    //
    onMounted(()=>{
        observeAttribute(target.value, "data-icon", ()=>{
            current.value = cmz(target.value.getAttribute("data-icon"));
        });

        //
        props?.hook?.(target.value);
    });

</script>

<template>
    <div class="icon-wrap" :data-icon="names[0]" ref="target" v-bind="$attrs">
        <component
            inert
            :is="iconPack[current]"
            :size="size"
            :color="color"
            :stroke-width="strokeWidth" :default-class="defaultClass"
            :data-name="current"
        />
    </div>
</template>
