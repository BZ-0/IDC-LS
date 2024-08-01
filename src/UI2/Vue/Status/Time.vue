<script setup>
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
    <div data-transparent data-scheme="dynamic-transparent" ref="target" class="ui-time" color-scheme="" v-bind="$attrs"><span class="ui-time-hour">00</span>:<span class="ui-time-minute">00</span></div>
</template>
