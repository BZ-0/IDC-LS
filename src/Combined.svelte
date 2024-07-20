<script lang="ts" type="ts">
	//
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    
    //
    import ContextMenu from "@unite/svelte/UI/contextmenu/ContextMenu.svelte";
	import type { GridItemType } from "@unite/svelte/UI/utils/GridItemUtils.ts";
    import AppFrame from "@unite/svelte/UI/appframe/AppFrame.svelte";
    import MultiPage from "@unite/svelte/UI/grid/MultiPage.svelte";
    import InputEditor from "@unite/svelte/UI/editor/InputEditor.svelte";
    import StatusBar from "@unite/svelte/UI/statusbar/StatusBar.svelte";
    
    //
    import actionMap, {onEditItem, controlCenterPage } from "./ActionMap.ts";
    import {state} from "./GridState.ts";
    import IconEdit from "./IconEdit.svelte";
    import ControlCenter from "./ControlCenter.svelte";
    
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
