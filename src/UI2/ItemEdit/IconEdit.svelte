<script type="ts" lang="ts">
    import ItemEdit from "./ItemEdit.svelte";
    import GridItem from "@idc/UI2/Desktop/GridItem.svelte";
    import Frame from "@idc/UI2/Design/Frame/Frame.svelte";

    //
    import type { GridItemType } from "@unite/scripts/utils/GridItemUtils.ts";

    //
    import {state} from "@idc/State/GridState.ts";

    //
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";

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
        confirm(); 
        state.items.set($gridItem?.id || "", $gridItem);
        gridItem.set(null);
    }
    
    //
    const deleteWrap = (ev: PointerEvent| MouseEvent)=>{
        actionMap.get("delete-item")?.({
            initiator: document.querySelector(`.ux-grid-item[data-type=\"items\"][data-id=\"${itemId}\"]`)
        });
    }
    
    //
    const fieldSet: Field[] = [
        {"name": "label", "label": "Label: ", "icon": "", "value": ""},
        {"name": "icon", "label": "IconID: ", "icon": "", "value": ""},
        {"name": "action", "label": "Action: ", "icon": "", "value": ""},
        {"name": "href", "label": "HREF: ", "icon": "", "value": ""},
    ]
    
    
</script>

<!-- -->
<Frame focused={gridItem} class="ux-modal-frame ls-item-edit" data-item={$gridItem?.id||""}>
    <ItemEdit whatEdit={$gridItem} data-item={$gridItem?.id||""} fields={fieldSet} bind:confirm={confirm}></ItemEdit>
    <div class="ls-but">
        <button type="button" class="delete-btn" on:click={deleteWrap}>Delete Icon</button>
        <button type="button" class="confirm-btn" on:click={confirmWrap}>Apply Change</button>
    </div>
</Frame>

<style lang="scss" type="scss">

//
.ls-but {
    inline-size: stretch;
    block-size: stretch;

    display: grid;
    grid-template-columns: minmax(0px, 1fr) minmax(0px, 1fr);
    grid-template-rows: minmax(0px, max-content);
    
    gap: 1rem;
    padding: 0.5rem;
}

</style>