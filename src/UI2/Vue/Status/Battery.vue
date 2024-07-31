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
    <div data-transparent data-scheme="dynamic-transparent" ref="target" class="icon-wrap ui-icon-state ui-battery" data-icon="battery-charging">
        <LucideIcon name="battery"></LucideIcon>
        <LucideIcon name="battery-full"></LucideIcon>
        <LucideIcon name="battery-low"></LucideIcon>
        <LucideIcon name="battery-medium"></LucideIcon>
        <LucideIcon name="battery-warning"></LucideIcon>
        <LucideIcon name="battery-charging"></LucideIcon>
    </div>
</template>
