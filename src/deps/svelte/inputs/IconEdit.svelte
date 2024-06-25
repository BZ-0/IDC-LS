<script>
    import Field from '@svelte/inputs/Field.svelte';

    //
    export let {onFocus} = await import("@workers/actionRegistry.mjs");
    export let {iconItemId} = onFocus;

    // may cause stack exceeded issue
    // $: iconItemId = onFocus.iconItemId;

    //
    document.addEventListener("click", (ev)=>{
        if (ev.target.matches(".edit-confirm")) {
            applyForIcon(onFocus.iconItem);
        }
    });
    
    //
    export let currentFields = [
        id: "label", label: "Label:",
        id: "icon", label: "IconId:",
        id: "action", label: "Action:",
        id: "href", label: "Href:"
    ];
</script>

{#if $iconItemId}

    <div class="icon-edit">

        <div class="edit-description"></div>
        <div class="fields">
            {#each currentFields as field}
                <div class="edit-field">
                    <div class="edit-label">{field.label}</div>
                    <div class="field-wrap"><Field name={field.id}></Field></div>
                </div>
            {/each}
        </div>
        <div class="buttons">
            <button type="button" class="edit-delete">Delete</button>
            <button type="button" class="edit-confirm">Confirm</button>
        </div>

    </div>

{/if}