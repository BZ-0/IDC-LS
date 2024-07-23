<script setup>
    import {settings} from "@idc/State/CurrentState.ts";
    import actionMap from "@idc/State/ActionMap.ts";
    import {state} from "@idc/State/GridState.ts";

    //
    import ContextMenu from "@idc/UI2/Vue/ContextMenu.vue";
    import InputEditor from "@idc/UI2/Vue/InputEdit.vue";
    import IconEdit from "@idc/UI2/Vue/IconEdit.vue";

    //
    /*
    import StatusBar from "@idc/UI2/Vue/StatusBar.vue";
    import AppFrame from "@idc/UI2/Svelte/AppFrame.svelte";
    import DesktopGrid from "@idc/UI2/Svelte/DesktopGrid.svelte";
    import ControlCenter from "@idc/App/Svelte/ControlCenter.svelte";*/

    //
    import DesktopGrid from "@idc/UI2/Vue/DesktopGrid.vue";

    //
    const itemCtxList = [{
        icon: "pencil-line",
        name: "Edit Item",
        action: "edit-item",
    }, {
        icon: "badge-x",
        name: "Delete Item",
        action: "delete-item"
    }];

    //
    const gridCtxList = [{
        icon: "badge-plus",
        name: "Add Item",
        action: "add-item"
    }, {
        icon: "wallpaper",
        name: "Wallpaper",
        action: "open-manager"
    }, {
        icon: "settings",
        name: "Settings",
        action: "open-settings"
    }, {
        icon: "fullscreen",
        name: "Fullscreen",
        action: "fullscreen"
    }];
</script>

<!-- -->
<template>
<DesktopGrid :state="state" :actionMap="actionMap"></DesktopGrid>

<IconEdit></IconEdit>
<ContextMenu :ctxList="itemCtxList" ctxName="grid-item"></ContextMenu>
<ContextMenu :ctxList="gridCtxList" ctxName="grid-space"></ContextMenu>

<InputEditor></InputEditor>

</template>

<!--
<AppFrame hashIdName="#control-center">
    <ControlCenter actionMap={actionMap}></ControlCenter>
</AppFrame>

<StatusBar></StatusBar>
-->
