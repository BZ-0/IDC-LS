<script>
    import Field from '@svelte/inputs/Field.svelte';
    import {onFocus} from "@workers/actionRegistry.mjs";
    import {fade} from "svelte/transition";

    // import writable store
    export let {iconItemId} = onFocus;
    export let onEdit = onFocus?.iconItem;
    $: onEdit = onFocus.focus($iconItemId);

    // may cause stack exceeded issue
    // $: iconItemId = onFocus.iconItemId;

    //
    document.addEventListener("click", (ev)=>{
        const forbidSelectors = ".icon-edit, .field-edit, .field-content, .ls-modal";
        const parentAreIconEdit = ev.target.matches(".ls-contextmenu") ? ev.target : ev.target.closest(".ls-contextmenu");

        // don't close modal when such selectors...
        if (!parentAreIconEdit && !(ev.target.matches(forbidSelectors) || ev.target.closest(forbidSelectors)) || ev.target.matches("button.edit-delete, button.edit-confirm")) {
            $iconItemId = null;
        }
    });
    
    //
    export let currentFields = [
        {id: "label", label: "Label:"},
        {id: "icon", label: "IconId:"},
        {id: "action", label: "Action:"},
        {id: "href", label: "Href:"}
    ]
    
</script>

<!-- -->
<script context="module">
    import {propsFilter} from "@unite/utils/utils.mjs";
</script>

{#if $iconItemId}
    <div 
        transition:fade={{ delay: 0, duration: 100 }} 
        class="icon-edit solid apply-color-theme" 
        data-icon-edit={$iconItemId}
        {...propsFilter($$props)}
    >
        <div class="edit-description"></div>
        <div class="fields">
            {#each currentFields as field}
                <div class="edit-field">
                    <div class="edit-label">{field.label}</div>
                    <div class="field-wrap solid hl-1 apply-color-theme"><Field onEdit={onEdit} fieldName={"item-" + field.id}></Field></div>
                </div>
            {/each}
        </div>
        <div class="buttons">
            <button type="button" class="edit-delete  solid hl-2 apply-color-theme" data-id={$iconItemId} data-action="delete-icon">Delete</button>
            <button type="button" class="edit-confirm solid hl-2 apply-color-theme" data-id={$iconItemId} data-action="confirm-edit">Confirm</button>
        </div>
    </div>
{/if}
