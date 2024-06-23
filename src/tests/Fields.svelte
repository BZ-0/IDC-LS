<script>
    import { applyForIcon, focusField, importFromIcon, listenChanges, reflectToField } from '@states/fieldEdit.mjs';
    import { focusIconForEdit } from '@states/gridState.mjs';
    import FieldEdit from '@svelte/inputs/FieldEdit.svelte';
    import { onMount } from 'svelte';
    
    //
    let button = null;
    let field  = null;
    
    //
    const onEdit = focusIconForEdit("github");
    importFromIcon(onEdit.focusIconState);
    
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
    onMount(()=>{
        listenChanges(field);

        //
        reflectToField(field.dataset.name, "change");

        //
        field.addEventListener("click", (ev)=>{
            const name = ev?.target?.dataset?.name;
            if (name) { focusField(name); }
        });
        
        //
        field.addEventListener("focusin", (ev)=>{
            // TODO: when mobile...
            focusField(ev?.target?.dataset?.name);
            refocus();
        });
    
        //
        button.addEventListener("click", ()=>{
            applyForIcon(onEdit);
        });
    });
</script>

<!-- -->
<input bind:this={field} value="default" type="text" data-name="label" virtualkeyboardpolicy="manual">
<button bind:this={button} type="button">Confirm</button>

<!-- -->
<FieldEdit></FieldEdit>
