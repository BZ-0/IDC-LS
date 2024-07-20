<script lang="ts" type="ts">
	//
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    
    //
    import {settings} from "./State/CurrentState.ts";
    import actionMap, {onEditItem, controlCenterPage } from "./State/ActionMap.ts";
    import {state} from "./State/GridState.ts";

    //
    import ContextMenu from "./UI2/ContextMenu/ContextMenu.svelte";
    import AppFrame from "./UI2/AppFrame/AppFrame.svelte";
    import DesktopGrid from "./UI2/Desktop/DesktopGrid.svelte";
    import InputEditor from "./UI2/InputEdit/InputEdit.svelte";
    import StatusBar from "./UI2/StatusBar/StatusBar.svelte";
    import ItemEdit from "./UI2/ItemEdit/IconEdit.svelte";

    //
    import ControlCenter from "./App/ControlCenter/ControlCenter.svelte";
    
    //
    export let wallpaperURL = (localStorage.getItem("@wallpaper") || "./assets/wallpaper/0.jpg");
    export let currentPage = "main";
    
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
<canvas is="w-canvas" data-src={wallpaperURL}></canvas>

<!-- -->
<DesktopGrid state={state} actionMap={actionMap} current={currentPage}></DesktopGrid>

<!-- -->
<AppFrame hashIdName="#control-center">
    <ControlCenter actionMap={actionMap} currentPage={controlCenterPage}></ControlCenter>
</AppFrame>

<!-- -->
<ItemEdit actionMap={actionMap} gridItem={onEditItem}></ItemEdit>
<ContextMenu actionMap={actionMap} ctxList={itemCtxList} ctxName={"grid-item"}></ContextMenu>
<ContextMenu actionMap={actionMap} ctxList={gridCtxList} ctxName={"grid-space"}></ContextMenu>

<!-- -->
<InputEditor></InputEditor>

<StatusBar></StatusBar>
