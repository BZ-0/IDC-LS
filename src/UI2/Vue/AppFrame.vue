<script setup>
    import {reactive, watch, ref, onMounted} from "vue";
    import LucideIcon from './WLucideIcon.vue';

    //
    const props = defineProps({ hashIdName: {type: String, default: "#app"} });

    // vue has poor reactivity in such cases
    let chash = ref(location.hash);
    addEventListener("hashchange", (event) => { chash.value = location.hash; });

</script>

<!-- -->
<template>
    <div :data-hidden="chash != props.hashIdName" data-scheme="solid" class="ui-frame ui-app-frame ui-default-theme ui-detached" v-bind="$attrs">

        <div class="titlebar" data-highlight="2" data-scheme="solid">
            <LucideIcon name="chevron-down" class="back-button" style="grid-column: back-button; aspect-ratio: 1 / 1;" data-scheme="solid" data-highlight="2" />
            <div data-scheme="solid" data-highlight="2" class="ui-title-handle"></div>
            <LucideIcon name="menu" class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;" data-scheme="solid" data-highlight="2" />
        </div>

        <slot></slot>

        <div class="ui-status" data-scheme="solid" data-highlight="2"></div>
        <div class="ui-resize"></div>
    </div>
</template>
