<script setup>
    import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';
    import {reactive, watch, ref, onMounted} from "vue";
    import States from "@unite/scripts/reactive/StateManager.ts";

    //
    import Signal from "./Status/Signal.vue";
    import Battery from "./Status/Battery.vue";
    import Time from "./Status/Time.vue";

    //
    import TaskManager from "@idc/UI2/Scripts/TaskManager.ts";

    //
    const target = ref(null);
    const tasks  = ref([...TaskManager.tasks]);

    //
    TaskManager.on("*", ()=> { tasks.value = [...TaskManager.tasks]; });

    //
    const focusTask = (ev)=>{
        const target = ev.target;
        TaskManager.focus(target.dataset.id);
    }

    // vue has poor reactivity in such cases
    const currentHash = ref(location.hash);
    addEventListener("hashchange", (event) => {
        currentHash.value = location.hash;
    });
</script>

<!-- -->
<template>
    <div class="ui-task-panel" data-hidden="true">
        <div
            v-for="task in tasks"
            style="--decor-size: 4rem;" class="ui-block-decor ui-tab-item"
            data-highlight="1" data-highlight-hover="2" @click="focusTask"
            :data-scheme="task.id == currentHash ? 'inverse' : 'solid-transparent'"
            :data-id="task.id"
            :key="task.id">
            <LucideIcon inert data-place="icon" :name="task.icon" data-scheme="solid-transparent" data-transparent/>
            <span data-scheme="solid-transparent" data-transparent inert class="tab-label">{{task.label||""}}</span>
            <LucideIcon inert data-place="element" name="chevron-right" data-scheme="solid-transparent" data-transparent/>
        </div>
    </div>

    <!-- -->
    <div ref="target" class="ui-taskbar" v-bind="$attrs">
        <div class="ui-app-menu" data-highlight="1" data-highlight-hover="2">
            <LucideIcon inert name="layout-grid" data-transparent></LucideIcon>
        </div>
        <div class="ui-task-bar">
            <div v-for="task in tasks" class="ui-task" data-transparent data-scheme="accent" :data-id="task.id" :key="task.id" data-highlight-hover="1" @click="focusTask">
                <LucideIcon inert data-scheme="solid-transparent" :name="task.icon" data-transparent></LucideIcon>
            </div>
        </div>
        <div class="ui-status">
            <Signal data-highlight="1" data-highlight-hover="2"></Signal>
            <Battery data-highlight="1" data-highlight-hover="2"></Battery>
            <Time data-highlight="1" data-highlight-hover="2"></Time>
        </div>
    </div>
</template>
