<script lang="ts" type="ts">
	import ContextMenu from "@unite/contextmenu/ContextMenu.svelte";
	import type { GridItemType } from "@unite/grid/GridItemUtils.ts";
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    import actionMap, {onEditItem, windowManager} from "./ActionMap.ts";
    import {state} from "./GridState.ts";
    import AppFrame from "@unite/appframe/AppFrame.svelte";
    
    //
    import MultiPage from "@unite/grid/MultiPage.svelte";
    import IconEdit from "./IconEdit.svelte";
    import Settings from "./Settings.svelte";
    import InputEditor from "@unite/editor/InputEditor.svelte";
    import StatusBar from "@unite/appframe/StatusBar.svelte";
    
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
        action: "change-wallpaper"
    }, {
        icon: "settings",
        name: "Settings",
        action: "open-settings"
    }];
    
</script>

<!-- -->
<canvas is="w-canvas" data-src={wallpaperURL}></canvas>

<!-- -->
<MultiPage state={state} actionMap={actionMap} current={currentPage}></MultiPage>

<!-- TODO: resolve title-bar problem -->
<AppFrame hashIdName="#settings" windowManager={windowManager}>
<Settings actionMap={actionMap}></Settings>
</AppFrame>

<!-- -->
<IconEdit actionMap={actionMap} gridItem={onEditItem}></IconEdit>
<ContextMenu actionMap={actionMap} ctxList={itemCtxList} ctxName={"grid-item"}></ContextMenu>
<ContextMenu actionMap={actionMap} ctxList={gridCtxList} ctxName={"grid-space"}></ContextMenu>

<!-- -->
<InputEditor></InputEditor>

<StatusBar></StatusBar>
