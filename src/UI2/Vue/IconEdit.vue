<script type="ts" lang="ts">
    import ItemEdit from "./ItemEdit.vue";
    import GridItem from "@idc/UI2/Vue/GridItem.vue";
    import Frame from "@idc/UI2/Vue/Frame.vue";
    import States from "@unite/scripts/reactive/StateManager.ts";

    //
    const gridItem = ref(null);
    const editor = ref(null);

    //
    const UIState = States.getState("UIState");
    const actionMap = States.getState("actionMap");
    const state = States.getState("desktop");

    //
    UIState?.["@subscribe"]?.((v)=>{
        gridItem.value = v;
        if (editor) {
            editor.value.dataset.hidden = false;
        }
    }, "itemOnEdit");

    //
    const confirm = ref(null);

    //
    const confirmWrap = (ev: PointerEvent | MouseEvent) => { confirm?.value?.(); gridItem.value = null; }
    const deleteWrap = (ev: PointerEvent| MouseEvent)=>{
        actionMap.get("delete-item")?.({
            initiator: document.querySelector(`.ux-grid-item[data-type=\"items\"][data-id=\"${gridItem.value?.id||""}\"]`)
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
<template>
    <div ref="editor" class="ux-modal-frame ls-item-edit" :data-item="gridItem?.id">
        <ItemEdit v-bind:whatEdit="gridItem" :data-item="gridItem?.id" :fields="fieldSet" :confirm="confirm"></ItemEdit>
        <div class="ls-but">
            <button data-scheme="accent" type="button" class="delete-btn" @click="deleteWrap">Delete Icon</button>
            <button data-scheme="accent" type="button" class="confirm-btn" @click="confirmWrap">Apply Change</button>
        </div>
    </div>
</template>
