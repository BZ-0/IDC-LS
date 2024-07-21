<script type="ts" lang="ts">
    import ItemEdit from "./ItemEdit.svelte";
    import GridItem from "@idc/UI2/Desktop/GridItem.svelte";
    import Frame from "@idc/UI2/Design/Frame/Frame.svelte";

    //
    import type { GridItemType } from "@unite/scripts/utils/GridItemUtils.ts";

    //
    let gridItem: GridItemType | null = null;
    let editor = null;

    //
    import States from "@unite/scripts/reactive/StateManager.ts";
    const UIState = States.getState("UIState");

    //
    const actionMap = States.getState("actionMap");
    const state = States.getState("desktop");

    //
    UIState?.["@subscribe"]?.((v)=>{
        gridItem = v; 
        if (editor) {
            editor.dataset.hidden = false;
        }
    }, "itemOnEdit");

    //
    export let confirm = ()=>{};
    
    //
    const confirmWrap = (ev: PointerEvent | MouseEvent) => { confirm(); gridItem = null; }
    const deleteWrap = (ev: PointerEvent| MouseEvent)=>{
        actionMap.get("delete-item")?.({
            initiator: document.querySelector(`.ux-grid-item[data-type=\"items\"][data-id=\"${gridItem?.id||""}\"]`)
        });
    }
    
    //
    const fieldSet: Field[] = [
        {"name": "label", "label": "Label: ", "icon": "", "value": ""},
        {"name": "icon", "label": "IconID: ", "icon": "", "value": ""},
        {"name": "action", "label": "Action: ", "icon": "", "value": ""},
        {"name": "href", "label": "HREF: ", "icon": "", "value": ""},
    ];
</script>

<!-- -->
<Frame bind:self={editor} class="ux-modal-frame ls-item-edit" data-item={gridItem?.id||""}>
    <ItemEdit whatEdit={gridItem} data-item={gridItem?.id||""} fields={fieldSet} bind:confirm={confirm}></ItemEdit>
    <div class="ls-but">
        <button data-scheme="accent" type="button" class="delete-btn" on:click={deleteWrap}>Delete Icon</button>
        <button data-scheme="accent" type="button" class="confirm-btn" on:click={confirmWrap}>Apply Change</button>
    </div>
</Frame>

<style lang="scss" type="scss">

//
//.ls-item-edit {
    button {
        padding: 0.5rem;
        border-radius: 0.25rem;
    }
//}

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
