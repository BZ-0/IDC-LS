<script lang="ts" type="ts">
	//
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    
    //
    import ContextMenu from "./UI/contextmenu/ContextMenu.svelte";
	import type { GridItemType } from "./UI/utils/GridItemUtils.ts";
    import AppFrame from "./UI/appframe/AppFrame.svelte";
    import MultiPage from "./UI/grid/MultiPage.svelte";
    import InputEditor from "./UI2/InputEdit/InputEdit.svelte";
    import StatusBar from "./UI/statusbar/StatusBar.svelte";
    
    //
    import actionMap, {onEditItem, controlCenterPage } from "./State/ActionMap.ts";
    import {state} from "./State/GridState.ts";

    //
    import IconEdit from "./App/Editors/IconEdit.svelte";
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
<MultiPage state={state} actionMap={actionMap} current={currentPage}></MultiPage>

<!-- -->
<AppFrame hashIdName="#control-center">
    <ControlCenter actionMap={actionMap} currentPage={controlCenterPage}></ControlCenter>
</AppFrame>


<!-- -->
<IconEdit actionMap={actionMap} gridItem={onEditItem}></IconEdit>
<ContextMenu actionMap={actionMap} ctxList={itemCtxList} ctxName={"grid-item"}></ContextMenu>
<ContextMenu actionMap={actionMap} ctxList={gridCtxList} ctxName={"grid-space"}></ContextMenu>

<!-- -->
<InputEditor></InputEditor>

<StatusBar></StatusBar>
