<script setup>
import LucideIcon from "../UWLucideIcon.vue";
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
    <div data-transparent data-scheme="dynamic-transparent" ref="target" class="icon-wrap ui-icon-state ui-network" data-icon="wifi">
        <LucideIcon name="wifi"></LucideIcon>
        <LucideIcon name="wifi-off"></LucideIcon>
        <LucideIcon name="wifi-high"></LucideIcon>
        <LucideIcon name="wifi-low"></LucideIcon>
        <LucideIcon name="wifi-zero"></LucideIcon>
    </div>
</template>
