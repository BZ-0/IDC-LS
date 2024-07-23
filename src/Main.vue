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
    */

    //
    import DesktopGrid from "@idc/UI2/Vue/DesktopGrid.vue";
    import AppFrame from "@idc/UI2/Vue/AppFrame.vue";
    import ControlCenter from "@idc/App/Vue/ControlCenter.vue";

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

<AppFrame hashIdName="#control-center">
    <ControlCenter appId="#control-center"></ControlCenter>
</AppFrame>

</template>

<!--


<StatusBar></StatusBar>
-->
