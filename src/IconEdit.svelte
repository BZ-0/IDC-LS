<script type="ts" lang="ts">
	import ItemEdit from "@unite/forms/ItemEdit.svelte";
	import GridItem from "@unite/grid/GridItem.svelte";
    import Frame from "@unite/design/Frame.svelte";
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    import type { GridItemType } from "@unite/grid/GridItemUtils.ts";
    
    //
    export let gridItem: Writable<GridItemType> = writable<GridItemType>(null);
    export let actionMap = new Map<string, Function>();
    
    //
    let confirm = ()=>{};
    let itemId = "";
    
    //
    $: itemId = $gridItem?.id||"";
    
    //
    const confirmWrap = (ev: PointerEvent | MouseEvent)=>{
        gridItem.set(null);
        confirm();
    }
    
    //
    const deleteWrap = (ev: PointerEvent| MouseEvent)=>{
        actionMap.get("delete-icon")?.({
            initiator: document.querySelector(`.ux-grid-item[data-type=\"items\"][data-id=\"${itemId}\"]`)
        });
    }
</script>

<!-- -->
<Frame focused={$gridItem} class="ux-modal-frame ls-item-edit" data-item={$gridItem?.id||""}>
    <ItemEdit whatEdit={$gridItem} data-item={$gridItem?.id||""} bind:confirm={confirm}></ItemEdit>
    <div class="ls-but">
        <button type="button" class="delete-btn" on:click={deleteWrap}>Delete Icon</button>
        <button type="button" class="confirm-btn" on:click={confirmWrap}>Apply Change</button>
    </div>
</Frame>
