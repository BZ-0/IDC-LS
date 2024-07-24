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
    <div :data-hidden="chash != props.hashIdName" data-scheme="solid" class="ux-frame ux-app-frame ux-default-theme ux-detached" v-bind="$attrs">

        <div class="titlebar" data-highlight="2" data-scheme="solid">
            <div data-scheme="solid" data-highlight="2" class="back-button" style="grid-column: back-button; aspect-ratio: 1 / 1;">
                <LucideIcon inert name="chevron-down"/>
            </div>
            <div data-scheme="solid" data-highlight="2" class="ux-title-handle">

            </div>
            <div data-scheme="solid" data-highlight="2" class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;">
                <LucideIcon inert name="menu"/>
            </div>
        </div>

        <slot></slot>

        <div class="ux-status" data-scheme="solid" data-highlight="2"></div>
        <div class="ux-resize"></div>

    </div>
</template>
