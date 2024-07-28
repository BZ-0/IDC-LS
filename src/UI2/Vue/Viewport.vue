<script setup>
    import {reactive, watch, ref, onMounted, useAttrs} from "vue";
    import LucideIcon from "@idc/UI2/Vue/WLucideIcon.vue";
    import InputEdit from "@idc/UI2/Vue/InputEdit.vue";

    //
    const attrs = useAttrs();
</script>

<template>
    <div
        class="ux-viewport fixed"
        data-scheme="accent"
        v-bind="$attrs"
    >
        <div class="ux-viewport-box">
            <div class="ux-viewport-content"><slot></slot></div>
        </div>
        <InputEdit></InputEdit>
    </div>
</template>
