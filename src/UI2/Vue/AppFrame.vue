<script setup>
    import {reactive, watch, ref, onMounted} from "vue";
    import LucideIcon from './WLucideIcon.vue';

    //
    import TaskManager from "@idc/UI2/Scripts/TaskManager.ts";

    //
    const props = defineProps({
        hashIdName: {type: String, default: "#app"},
        icon: {type: String, default: "settings"}
    });

    //
    const task = {
        get id() { return props.hashIdName },
        get icon() { return props.icon },
        active: false
    };

    //
    const toTask = ()=>{
        if (currentHash.value == props.hashIdName) {
            TaskManager.addTask(task);
        }
    }

    // vue has poor reactivity in such cases
    const currentHash = ref(location.hash); toTask();
    addEventListener("hashchange", (event) => {
        currentHash.value = location.hash; toTask();
    });
</script>

<!-- -->
<template>
    <div :data-hidden="currentHash != props.hashIdName" data-scheme="solid" class="ui-frame ui-app-frame ui-default-theme ui-detached" v-bind="$attrs">

        <div class="titlebar" data-highlight="2" data-scheme="solid">
            <LucideIcon name="chevron-down" class="back-button" style="grid-column: back-button; aspect-ratio: 1 / 1;" data-scheme="solid" data-highlight="2" />
            <div data-scheme="solid" data-highlight="2" class="ui-title-handle"></div>
            <LucideIcon name="menu" class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;" data-scheme="solid" data-highlight="2" />
        </div>

        <slot></slot>

        <div class="ui-status" data-scheme="solid" data-highlight="1"></div>
        <div class="ui-resize"></div>
    </div>
</template>
