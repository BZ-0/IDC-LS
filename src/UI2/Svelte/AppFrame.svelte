<script type="ts" lang="ts">
    import {currentLocationHash} from '@unite/svelte/utils/Realtime.ts';
    import LucideIcon from './WLucideIcon.svelte';

    //
    import {fade} from "svelte/transition";
    import {writable} from "svelte/store";
    import {onMount} from "svelte";

    //
    export let hashIdName = $$props.hashIdName || "#app";
</script>

<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
</script>

<!-- -->
<div {...propsFilter($$props)} data-hidden={$currentLocationHash != hashIdName} data-scheme="solid" class="ux-frame ux-app-frame ux-default-theme ux-detached" transition:fade={{ delay: 0, duration: 100 }}>

    <div class="titlebar" data-highlight="2" data-scheme="solid">
        <div data-transparent class="back-button" style="grid-column: back-button; aspect-ratio: 1 / 1;">
            <LucideIcon inert={true} slot="icon" name={"chevron-down"}/>
        </div>
        <div data-transparent class="ux-title-handle" style="background-color: transparent;">

        </div>
        <div data-transparent class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;">
            <LucideIcon inert={true} slot="icon" name={"menu"}/>
        </div>
    </div>

    <slot></slot>

    <div class="ux-status" data-scheme="solid" data-highlight="2"></div>
    <div class="ux-resize"></div>

</div>

<style type="scss">

</style>
