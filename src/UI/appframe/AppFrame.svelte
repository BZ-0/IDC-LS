<script type="ts" lang="ts">
    import {currentLocationHash} from '@unite/svelte/utils/Realtime.ts';
    import LucideIcon from '../design/WLucideIcon.svelte';

    //
    import { MOCElement } from "@unite/scripts/utils/Utils.ts";
    import AxGesture from "@unite/scripts/interact/Gesture.ts";
    import { observeBySelector } from "@unite/scripts/dom/Observer.ts";

    //
    import {fade} from "svelte/transition";
    import {writable} from "svelte/store";
    import {onMount} from "svelte";

    //
    export let hashIdName = $$props.hashIdName || "#app";
    export let windowManager: any = null;

    //
    let frameElement: HTMLElement | null = null;
    let isInactive = writable(false);
    
    //
    requestAnimationFrame(()=>{
        if (windowManager) {
            isInactive = windowManager.getTask(hashIdName).inactive || writable(true);
        }
    });
    
    //
    document.documentElement.addEventListener("contextmenu", (ev)=>{
        const target = ev.target as HTMLElement;
        if ((target?.matches?.(".ux-app-frame") || target?.closest?.(".ux-app-frame")) && !target.matches("input[type=\"text\"]")) {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            ev.preventDefault();
        }
    }, {capture: true});
    
    //
    document.documentElement.addEventListener("click", (ev)=>{
        const target = ev.target as HTMLElement;
        
        //
        if (MOCElement(target, ".ux-app-frame") == frameElement) 
        {
            //
            if (target.matches(".ux-app-frame *:not(.back-button, .menu-button)")) {
                //ev.stopPropagation();
                //ev.stopImmediatePropagation();
                //ev.preventDefault();
                
                //
                if (windowManager) {
                    windowManager?.focusTask?.("#" + MOCElement(target, ".ux-app-frame")?.querySelector(".ux-content")?.id||"");
                }
            }
            
            //
            if (target.matches(".ux-app-frame .menu-button")) {
                // kuril i umer
                ev.stopPropagation();
                ev.stopImmediatePropagation();
                ev.preventDefault();
                
                //
                const content = MOCElement(target, ".ux-app-frame")?.querySelector?.(".ux-content");
                if (content && (hashIdName == ("#" + content.id))) {
                    const event = new CustomEvent("ux-menu", {
                        cancelable: true,
                        bubbles: true,
                        detail: {}
                    });
                    content.dispatchEvent(event);
                }
            }
            
            //
            if (target.matches(".ux-app-frame .back-button")) {
                // kuril i umer
                ev.stopPropagation();
                ev.stopImmediatePropagation();
                ev.preventDefault();
                
                //
                const content = MOCElement(target, ".ux-app-frame")?.querySelector?.(".ux-content");
                if (content && (hashIdName == ("#" + content.id))) {
                    const event = new CustomEvent("ux-back", {
                        cancelable: true,
                        bubbles: true,
                        detail: {}
                    });
                    
                    //
                    if (content.dispatchEvent(event)) {
                        if (windowManager) {
                            windowManager?.minimizeTask?.("#" + content.id);
                        } else {
                            history.back();
                        }
                    }
                }
            }
            
        }
    })

    //
    let gestureControl: AxGesture | null = null;

    //
    const makeControl = (frameElement)=>{
        if (frameElement && !frameElement["@control"]) {
            gestureControl = new AxGesture(frameElement);
            frameElement["@control"] = gestureControl;
            
            //
            gestureControl.draggable({
                handler: frameElement.querySelector(".ux-title-handle")
            });
            
            //
            gestureControl.resizable({
                handler: frameElement.querySelector(".ux-resize")
            });
        }

        //
        if (frameElement) {
            // @ts-ignore
            frameElement.style.setProperty("--drag-x", -(frameElement.clientWidth / 2) + frameElement.parentNode.offsetWidth / 2, "");
            
            // @ts-ignore
            frameElement.style.setProperty("--drag-y", -(frameElement.clientHeight / 2) + frameElement.parentNode.offsetHeight / 2, "");
        }
    }

    //
    const observer = new MutationObserver((mutationsList, _)=>{
        for (let mutation of mutationsList) {
            if (mutation.type == "childList") {
                const validOf = Array.from(mutation.addedNodes).filter((n)=>(n == frameElement)) as HTMLElement[];
                if (validOf[0]) {
                    makeControl(validOf[0]);
                }
            }
        }
    });
    
    //
    observeBySelector(document.body, ".ux-app-frame:has(" + hashIdName + ")", ({addedNodes})=>{
        frameElement ||= addedNodes[0];
    });
    
    //
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    //
    onMount(()=>{
        makeControl(frameElement);
    });
</script>

<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
</script>

<!-- -->
{#if !$isInactive && $currentLocationHash == hashIdName}
    <div {...propsFilter($$props)} bind:this={frameElement} data-scheme="solid" class="ux-frame ux-app-frame ux-default-theme hl-1 ux-detached" transition:fade={{ delay: 0, duration: 100 }}>

        <div class="titlebar" data-scheme="solid" data-highlight="2">
            <div class="back-button" style="grid-column: back-button; aspect-ratio: 1 / 1;">
                <LucideIcon inert={true} slot="icon" name={"chevron-down"}/>
            </div>
            <div class="ux-title-handle hl-2">
                
            </div>
            <div class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;">
                <LucideIcon inert={true} slot="icon" name={"menu"}/>
            </div>
        </div>
        
        <slot></slot>

        <div class="ux-status"></div>
        <div class="ux-resize" data-scheme="transparent"></div>

    </div>
{/if}

<style type="scss">
    
</style>
