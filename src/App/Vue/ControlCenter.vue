<script setup>
    import {observeBySelector} from "@unite/scripts/dom/Observer.ts"
    import {MOC, MOCElement} from "@unite/scripts/utils/Utils.ts";
    import States from "@unite/scripts/reactive/StateManager.ts";

    //
    import {reactive, watch, ref, onMounted} from "vue";
    import {subscribe} from "@unite/scripts/reactive/ReactiveLib.ts";

    //
    import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';;

    //
    import Manager from "./Manager.vue";
    import Settings from "./Settings.vue";

    //
    const UIState = States.getState("UIState");

    //
    const props = defineProps({
        appId: {type: String, default: "#control-center"}
    });

    //
    const currentPage = ref("wallpapers");
    const panelOpen = ref(false);

    //
    const panelEl = ref(null);
    const controlEl = ref(null);

    //
    const _LOG_ = (v)=>{
        console.log(v);
        return v;
    }

    //
    subscribe(UIState, (v)=> (currentPage.value = v), "controlCenterPage")
    subscribe(UIState, (v)=> (panelOpen.value = v), "controlCenterPanelOpen")

    //
    const tabs = [{
        "page": "settings",
        "icon": "settings",
        "label": "Settings"
    }, {
        "page": "wallpapers",
        "icon": "wallpaper",
        "label": "Wallpapers"
    }];

    //
    observeBySelector(document.body, props.appId, ({addedNodes})=>{
        controlEl.value ||= addedNodes[0];
    });
</script>

<!-- -->
<template>
    <div class="ui-title-label" style="background-color: transparent;">
        <span tabindex="-1" inert :key="currentPage">{{tabs.find(({page})=>(page==currentPage))?.label || ""}}</span>
    </div>

    <div class="ui-content stretch" :id="props.appId.replace('#','')" ref="controlEl" :data-current-page="currentPage">
        <x-scrollbox :data-hidden="!panelOpen" data-instant data-scheme="solid" data-highlight="1" class="ui-panel" ref="panelEl">
            <div v-for="tab in tabs" style="--decor-size: 4rem;" class="ui-block-decor ui-tab-item" data-scheme="solid-transparent" data-highlight="1" :data-page="tab.page">
                <LucideIcon inert data-place="icon" :name="tab.icon"/>
                <span inert class="tab-label">{{tab.label}}</span>
                <LucideIcon inert data-place="element" name="chevron-right"/>
            </div>
        </x-scrollbox>

        <Settings :data-hidden="currentPage != 'settings'" data-instant></Settings>
        <Manager :data-hidden="currentPage != 'wallpapers'" data-instant></Manager>
    </div>
</template>
