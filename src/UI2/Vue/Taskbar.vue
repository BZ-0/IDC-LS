<script setup>
    import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';
    import {reactive, watch, ref, onMounted} from "vue";
    import States from "@unite/scripts/reactive/StateManager.ts";
    import { subscribe } from '@unite/scripts/reactive/ReactiveLib';

    //
    import Signal from "./Status/Signal.vue";
    import Battery from "./Status/Battery.vue";
    import Time from "./Status/Time.vue";

    //
    import TaskManager from "@idc/UI2/Scripts/TaskManager.ts";

    //
    const UIState = States.getState("UIState");
    const tasks  = ref([...TaskManager.tasks]);

    //
    TaskManager.on("*", ()=> { tasks.value = [...TaskManager.tasks]; });

    //
    const focusTask = (ev)=>{
        const target = ev.target;
        if (TaskManager.inFocus(target.dataset.id) && !matchMedia("(width < 9in) or (orientation: portrait)").matches) {
            TaskManager.deactivate(target.dataset.id);
        } else {
            TaskManager.focus(target.dataset.id);
        }
    }

    // vue has poor reactivity in such cases
    const currentHash = ref(location.hash);

    addEventListener("hashchange", (event) => {
        currentHash.value = location.hash;
    });

    addEventListener("popstate", (event) => {
        currentHash.value = location.hash;
    });

    //
    const panelOpened = ref(false);
    const openPanel = (ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        UIState.taskPanelOpen = !UIState.taskPanelOpen;
    }

    //
    document.documentElement.addEventListener("click", (ev)=>{
        if (!ev.target.matches(".ui-task-panel, .menu-button")) {
            UIState.taskPanelOpen = false;
        }
    });

    //
    subscribe(UIState, (v)=>{ panelOpened.value = v; }, "taskPanelOpen");
</script>

<!-- -->
<template>
    <div class="ui-task-panel" :data-hidden="!panelOpened">
        <div
            v-for="task in tasks"
            style="--decor-size: 4rem;" class="ui-block-decor ui-tab-item"
            :style="{'order': task.order||0}"
            data-highlight="1" data-highlight-hover="2" @click="focusTask"
            :data-scheme="task.id == currentHash ? 'inverse' : 'solid-transparent'"
            :data-id="task.id"
            :key="task.id">
            <LucideIcon inert data-place="icon" :name="task.icon" data-transparent/>
            <span data-transparent inert class="tab-label">{{task.label||""}}</span>
            <LucideIcon inert data-place="element" name="chevron-right" data-transparent/>
        </div>
    </div>

    <!-- -->
    <div class="ui-taskbar" v-bind="$attrs">
        <div class="ui-app-menu" data-highlight="1" data-highlight-hover="2">
            <LucideIcon inert name="layout-grid" data-transparent></LucideIcon>
        </div>
        <div class="ui-task-bar">
            <div v-for="task in tasks"
                :class="{'ui-focus': task.id == currentHash, 'ui-active': task.active}"
                :key="task.id"
                :style="{'order': task.order||0}"
                class="ui-task"
                data-scheme="accent" :data-id="task.id"
                data-highlight-hover="1"
                data-transparent
                @click="focusTask"
            >
                <LucideIcon inert data-scheme="solid-transparent" :name="task.icon" data-transparent></LucideIcon>
            </div>
        </div>
        <div class="ui-status">
            <Signal data-highlight="1" data-highlight-hover="2"></Signal>
            <Battery data-highlight="1" data-highlight-hover="2"></Battery>
            <Time data-highlight="1" data-highlight-hover="2"></Time>
        </div>
    </div>

    <!-- -->
    <div class="ui-navbar" data-highlight="2" data-scheme="solid" v-bind="$attrs">
        <LucideIcon name="chevron-down" class="back-button" style="grid-column: back-button; aspect-ratio: 1 / 1;" data-scheme="solid" data-highlight="2" />
        <div data-scheme="solid" data-highlight="2" class="ui-title-handle" @pointerdown="toFocus"></div>
        <LucideIcon name="menu" class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;" data-scheme="solid" data-highlight="2" @click="openPanel"/>
    </div>


</template>
