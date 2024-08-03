<script setup>
import LucideIcon from "../WLucideIcon.vue";
import { pickFromCenter } from '@unite/scripts/stylework/ColorTheme';
import { ref } from "vue";

//
const target = ref(null);
setInterval(() => {
    if (target.value) {
        pickFromCenter(target.value);
    }
}, 1000);
</script>

<!-- -->
<template>
    <LucideIcon name="wifi,wifi-off,wifi-high,wifi-low,wifi-zero" data-scheme="dynamic-transparent" :hook="(v)=>{ target = v; }" class="icon-wrap ui-icon-state ui-network" data-icon="wifi" v-bind="$attrs"></LucideIcon>
</template>
