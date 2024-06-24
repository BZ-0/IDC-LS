<script>
    import { focusField, fromField, importFromIcon, listenChanges, reflectToField } from '@states/fieldEdit.mjs';
    import { onMount } from 'svelte';
    
    //
    let field  = null;
    
    //
    export let onEdit = null;//focusIconForEdit("github");
    
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
        if (field) {
            listenChanges(field);
            importFromIcon(onEdit.focusIconState);
            reflectToField(field?.dataset?.name, "change");
            
            //
            field.addEventListener("change", (ev)=>{ fromField(field?.dataset?.name); });
            field.addEventListener("input", (ev)=>{ fromField(field?.dataset?.name); });
        }
    });
</script>

<!-- -->
<input bind:this={field} value="default" type="text" data-name="label" virtualkeyboardpolicy="manual">
