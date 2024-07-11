<script lang="ts" type="ts">
	import ContextMenu from "./../unite/contextmenu/ContextMenu.svelte";
	import type { GridItemType } from "@unite/grid/GridItemUtils.ts";
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    import actionMap, {onEditItem} from "./ActionMap.ts";
    import {state} from "./GridState.ts";
    
    //
    import MultiPage from "@unite/grid/MultiPage.svelte";
    import IconEdit from "./IconEdit.svelte";
    import Settings from "./Settings.svelte";
    
    //
    export let wallpaperURL = "";
    export let currentPage = "main";
    
    //
    const itemCtxList = [{
        icon: "gear",
        name: "Edit Item",
        action: "edit-item"
    }];
    
</script>

<!-- -->
<w-canvas data-src={wallpaperURL}></w-canvas>

<!-- -->
<MultiPage state={state} actionMap={actionMap} current={currentPage}></MultiPage>
<Settings actionMap={actionMap}></Settings>

<!-- -->
<IconEdit actionMap={actionMap} gridItem={onEditItem}></IconEdit>
<ContextMenu actionMap={actionMap} ctxList={itemCtxList} ctxName={"grid-item"}></ContextMenu>
