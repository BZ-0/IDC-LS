<script>
    import { fieldToData, focusField, importFromIcon, listenChanges, reflectToField } from '@states/fieldEdit.mjs';
    import { onMount } from 'svelte';
    
    //
    let field  = null;
    
    //
    export let onEdit = null;//focusIconForEdit("github");
    export let fieldName = "";
    
    //
    $: listenChanges(field);
    $: importFromIcon(onEdit?.focusIconState);
    $: reflectToField(field?.dataset?.name, "change");
    
    //
    const refocus = ()=>{
        requestAnimationFrame(()=>{
            const fieldEditor = document?.querySelector?.(".field-edit input");
            if (document.activeElement != fieldEditor) {
                fieldEditor?.focus?.();
            }
        });
    }

    //
    document.addEventListener("click", (ev)=>{
        if (ev.target == field) {
            const name = field?.dataset?.name;
            if (name) { focusField(name); }
            field?.focus?.();
        }
    });

    //
    document.addEventListener("focusin", (ev)=>{
        // TODO: when mobile...
        if (ev.target == field) {
            focusField(field?.dataset?.name);
            refocus();
        }
    });

    //
    onMount(()=>{
        if (field && onEdit) {
            listenChanges(field);
            importFromIcon(onEdit?.focusIconState);
            reflectToField(field?.dataset?.name, "change");
            
            //
            field.addEventListener("change", (ev)=>{ fieldToData(field?.dataset?.name); });
            field.addEventListener("input", (ev)=>{ fieldToData(field?.dataset?.name); });
        }
    });
</script>

<!-- -->
<input bind:this={field} value="" type="text" data-name={fieldName}>
