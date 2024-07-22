<script lang="ts" type="ts">
	//
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    
    //
    import {settings} from "@idc/State/CurrentState.ts";
    import actionMap from "@idc/State/ActionMap.ts";
    import {state} from "@idc/State/GridState.ts";

    //
    import ContextMenu from "@idc/UI2/Svelte/ContextMenu.svelte";
    import AppFrame from "@idc/UI2/Svelte/AppFrame.svelte";
    import DesktopGrid from "@idc/UI2/Svelte/DesktopGrid.svelte";
    import InputEditor from "@idc/UI2/Svelte/InputEdit.svelte";
    import StatusBar from "@idc/UI2/Svelte/StatusBar.svelte";
    import ItemEdit from "@idc/UI2/Svelte/IconEdit.svelte";

    //
    import ControlCenter from "@idc/App/Svelte/ControlCenter.svelte";

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
<DesktopGrid state={state} actionMap={actionMap}></DesktopGrid>

<!-- -->
<AppFrame hashIdName="#control-center">
    <ControlCenter actionMap={actionMap}></ControlCenter>
</AppFrame>

<!-- -->
<ItemEdit actionMap={actionMap}></ItemEdit>
<ContextMenu actionMap={actionMap} ctxList={itemCtxList} ctxName={"grid-item"}></ContextMenu>
<ContextMenu actionMap={actionMap} ctxList={gridCtxList} ctxName={"grid-space"}></ContextMenu>

<!-- -->
<InputEditor></InputEditor>

<StatusBar></StatusBar>
