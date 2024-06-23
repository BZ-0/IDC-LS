<script>
    import { focusField, importFromIcon, listenChanges, reflectToField } from '@states/fieldEdit.mjs';
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
    onMount(()=>{
        if (field) {
            listenChanges(field);
            importFromIcon(onEdit.focusIconState);
            reflectToField(field?.dataset?.name, "change");
            
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
        }
    });
</script>

<!-- -->
<input bind:this={field} value="default" type="text" data-name="label" virtualkeyboardpolicy="manual" {...$$props}>
