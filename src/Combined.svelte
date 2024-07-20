<script lang="ts" type="ts">
	import ContextMenu from "@unite/contextmenu/ContextMenu.svelte";
	import type { GridItemType } from "@unite/utils/GridItemUtils.ts";
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    import actionMap, {onEditItem, controlCenterPage } from "./ActionMap.ts";
    import {state} from "./GridState.ts";
    import AppFrame from "@unite/appframe/AppFrame.svelte";
    
    //
    import MultiPage from "@unite/grid/MultiPage.svelte";
    import IconEdit from "./IconEdit.svelte";
    import ControlCenter from "./ControlCenter.svelte";
    import InputEditor from "@unite/editor/InputEditor.svelte";
    import StatusBar from "@unite/statusbar/StatusBar.svelte";
    //import WManager from "@unite/appframe/WindowManager.svelte";
    
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
