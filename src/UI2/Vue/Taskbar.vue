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
</script>

<!-- -->
<template>
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
