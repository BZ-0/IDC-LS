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
    <LucideIcon name="battery-charging,battery,battery-full,battery-low,battery-medium,battery-warning" data-transparent data-scheme="dynamic-transparent" ref="target" class="icon-wrap ui-icon-state ui-battery" data-icon="battery-charging"></LucideIcon>
</template>
