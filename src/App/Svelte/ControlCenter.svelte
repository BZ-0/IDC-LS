<script>
	import { currentLocationHash } from "@unite/svelte/utils/Realtime.ts";
    import {observeBySelector} from "@unite/scripts/dom/Observer.ts"
    import {MOC, MOCElement} from "@unite/scripts/utils/Utils.ts";
    import States from "@unite/scripts/reactive/StateManager.ts";

    //
    import LucideIcon from '@idc/UI2/Svelte/WLucideIcon.svelte';
    import Block from '@idc/UI2/Svelte/Block.svelte';
    
    //
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";

    //
    import Manager from "./Manager.svelte";
    import Settings from "./Settings.svelte";
    
    //
    const UIState = States.getState("UIState");

    //
    export let appId = "#control-center";

    //
    let currentPage = "wallpapers";
    UIState?.["@subscribe"]?.((v)=> (currentPage = v), "controlCenterPage");

    //
    let panelOpen = false;
    UIState?.["@subscribe"]?.((v)=> (panelOpen = v), "controlCenterPanelOpen");

    //
    let panelEl = null;
    let controlEl = null;
    
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
    observeBySelector(document.body, appId, ({addedNodes})=>{
        controlEl ||= addedNodes[0];
    });
</script>

<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
</script>

<!-- -->
<div class="ux-title-label" style="background-color: transparent;">
    <span tabindex="-1" inert={true}>{tabs.find(({page})=>(page==currentPage))?.label || ""}</span>
</div>

<div class="ux-content stretch" id={appId.replace("#","")} bind:this={controlEl} data-current-page={currentPage}>

    {#if panelOpen}
        <x-scrollbox data-scheme="solid" data-highlight="2" class="ls-panel" bind:this={panelEl} transition:fade={{ key: currentPage, delay: 0, duration: 100 }}>
            {#each tabs as tab}
                <Block style="--decor-size: 4rem;" class="ux-block-decor ls-tab-item" data-scheme data-highlight="2" data-page={tab.page}>
                    <LucideIcon inert={true} data-place="icon" name={tab.icon}/>
                    <span inert={true} class="tab-label">{tab.label}</span>
                    <LucideIcon inert={true} data-place="element" name={"chevron-right"}/>
                </Block>
            {/each}
        </x-scrollbox>
    {/if}
    
    {#if ["settings"].indexOf(currentPage) >= 0}
        <Settings></Settings>
    {/if}
    
    {#if ["wallpapers"].indexOf(currentPage) >= 0}
        <Manager></Manager>
    {/if}
    
</div>

<style type="scss" lang="scss">

</style>
