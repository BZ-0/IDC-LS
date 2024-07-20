<script>
	import { currentLocationHash } from "@unite/svelte/utils/Realtime.ts";
    import LucideIcon from '@idc/UI/design/WLucideIcon.svelte';
    import Block from '@idc/UI/design/block/Block.svelte';
    
    //
    import {observeBySelector} from "@unite/scripts/dom/Observer.ts"
    import {MOC, MOCElement} from "@unite/scripts/utils/Utils.ts";

    //
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";

    //
    import Manager from "../Manager/Manager.svelte";
    import Settings from "../Settings/Settings.svelte";
    
    //
    export let appId = "#control-center";
    export let windowManager = null;
    export let currentPage = writable("settings");
    
    //
    windowManager?.addTask?.(appId, {
        icon: "settings",
        label: "Settings",
        detached: false
    });

    //
    let panelEl = null;
    let controlEl = null;
    
    //
    let panelOpen = false;//matchMedia("(width < 9in) or (orientation: portrait)");

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
    document.documentElement.addEventListener("click", (ev)=>{
        const {target} = ev;
        
        //
        if (target.matches(appId + " .ls-tab-item")) {
            const _ = target.dataset.page || "";
            if (_ != $currentPage) { currentPage?.set?.(_); };
            
            // unable to switch without hiding
            if (controlEl?.clientWidth <= 96 * 9) {
                panelOpen = false;
            }
        } else 
        
        // just hide panel when clicking to nothing
        if (MOC(target, appId) ? !MOC(target, ".ls-panel") : true) {
            panelOpen = false;
        }
    })

    //
    document.documentElement?.addEventListener?.("ux-menu", (ev)=>{
        if (ev.target == controlEl) { panelOpen = !panelOpen; }
    });

    //
    document.documentElement?.addEventListener?.("ux-back", (ev)=>{
        
    });

    //
    observeBySelector(document.body, appId, ({addedNodes})=>{
        controlEl ||= addedNodes[0];
    });
</script>

<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
</script>

<!-- -->
<div class="ux-title-label" data-scheme="solid-transparent">
    <span tabindex="-1" inert={true}>{tabs.find(({page})=>(page==$currentPage))?.label || ""}</span>
</div>

<div class="ux-content stretch" id={appId.replace("#","")} bind:this={controlEl} data-current-page={$currentPage}>

    {#if panelOpen}
        <x-scrollbox class="ls-panel hl-1" bind:this={panelEl} transition:fade={{ key: $currentPage, delay: 0, duration: 100 }}>
            {#each tabs as tab}
                <Block class="ux-block-decor ux-default-theme hl-2h ls-tab-item cursor-pointer pe-enable" data-page={tab.page}>
                    <LucideIcon inert={true} slot="icon" name={tab.icon}/>
                    <span inert={true} class="tab-label">{tab.label}</span>
                    <LucideIcon inert={true} slot="element" name={"chevron-right"}/>
                </Block>
            {/each}
        </x-scrollbox>
    {/if}
    
    {#if ["settings"].indexOf($currentPage) >= 0}
        <Settings></Settings>
    {/if}
    
    {#if ["wallpapers"].indexOf($currentPage) >= 0}
        <Manager></Manager>
    {/if}
    
</div>

<style type="scss" lang="scss">

</style>
