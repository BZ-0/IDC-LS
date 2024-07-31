<script setup>
import LucideIcon from "../WLucideIcon.vue";
import { pickFromCenter } from '@unite/scripts/stylework/ColorTheme';
import { ref } from "vue";

const target = ref(null);
setInterval(() => {
    if (target.value) {
        pickFromCenter(target.value);
    }
}, 1000);
</script>

<!-- -->
<template>
    <LucideIcon name="wifi,wifi-off,wifi-high,wifi-low,wifi-zero" data-transparent data-scheme="dynamic-transparent" ref="target" class="icon-wrap ui-icon-state ui-network" data-icon="wifi"></LucideIcon>
</template>
