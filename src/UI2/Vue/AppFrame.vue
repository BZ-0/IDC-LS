<script setup>
    import {reactive, watch, ref, onMounted} from "vue";
    import LucideIcon from './WLucideIcon.vue';

    //
    const props = defineProps({ hashIdName: {type: String, default: "#app"} });

    // vue has poor reactivity in such cases
    let chash = ref(location.hash);
    addEventListener("hashchange", (event) => { chash.value = location.hash; console.log(chash.value != props.hashIdName); });

</script>

<!-- -->
<template>
    <div :data-hidden="chash != props.hashIdName" data-scheme="solid" class="ux-frame ux-app-frame ux-default-theme ux-detached" v-bind="$attrs">

        <div class="titlebar" data-highlight="2" data-scheme="solid">
            <div data-transparent class="back-button" style="grid-column: back-button; aspect-ratio: 1 / 1;">
                <LucideIcon inert name="chevron-down"/>
            </div>
            <div data-transparent class="ux-title-handle" style="background-color: transparent;">

            </div>
            <div data-transparent class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;">
                <LucideIcon inert name="menu"/>
            </div>
        </div>

        <slot></slot>

        <div class="ux-status" data-scheme="solid" data-highlight="2"></div>
        <div class="ux-resize"></div>

    </div>
</template>
