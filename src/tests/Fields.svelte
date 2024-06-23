<script>
    import { applyForIcon } from '@states/fieldEdit.mjs';
    import { focusIconForEdit } from '@states/gridState.mjs';
    import Field from '@svelte/inputs/Field.svelte';
    import FieldEdit from '@svelte/inputs/FieldEdit.svelte';
    import { onMount } from 'svelte';

    // can-be re-assigned...
    export let onEdit = focusIconForEdit("github");

    // test purpose...
    let button = null;
    onMount(()=>{
        button.addEventListener("click", ()=>{
            applyForIcon(onEdit);
        });
    });
</script>

<!-- -->
<Field {onEdit} value="default" type="text" data-name="label" virtualkeyboardpolicy="manual"/>

<!--  -->
<button bind:this={button} type="button">Confirm</button>

<!-- -->
<FieldEdit></FieldEdit>
