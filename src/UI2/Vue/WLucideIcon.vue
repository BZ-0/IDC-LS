<script setup>
    import { computed } from 'vue';
    import * as icons from "lucide-vue-next";

    //
    const camelize = (str) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }

    //
    const fup = (str)=>{
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    //
    const props = defineProps({
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
    const attrs = useAttrs();
    const icon = computed(() => icons[fup(camelize(props.name||""))]);
</script>

<template>
    <div inert class="icon-wrap" v-bind="$attrs">
        <component
            :is="icon"
            :size="size"
            :color="color"
            :stroke-width="strokeWidth" :default-class="defaultClass"
        />
    </div>
</template>
