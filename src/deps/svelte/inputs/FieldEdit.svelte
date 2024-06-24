<script>
    import { bindToFieldEdit, fieldEditWrite } from "@states/fieldEdit.mjs";
    import LucideIcon from '@svelte/decors/LucideIcon.svelte';
    import { onMount } from 'svelte';

    //
    let {id, value} = fieldEditWrite;
    let input = null;
    let copyButton = null;
    let pasteButton = null;
    
    //
    id.subscribe((v)=>{
        requestAnimationFrame(()=>{
            if (v && input) {
                bindToFieldEdit(input); 
                input.focus();
            }
        });
    });
    
    //
    value.subscribe((v)=>{
        if (input != null) { input.value = v; };
    });

    //
    const unfocus = ({target})=>{
        if (target == input) {
            requestAnimationFrame(()=>{
                if (!document?.activeElement?.matches?.("input")) {
                    navigator?.virtualKeyboard?.hide?.();
                    if (document?.activeElement == input) {
                        document?.activeElement?.blur?.();
                    }
                    id.set("");
                }
            });
        }
    }

    //
    const refocus = (input)=>{
        //if (target?.matches("input"))
        if (input && document.activeElement != input) {
            input.style.display = "none";
            input.style.removeProperty("display");
            input.focus();
        }
    }

    //
    document.addEventListener("focusout", ({target})=>{
        unfocus({target});
    });

    //
    document.addEventListener("click", ({target})=>{
        if (target == copyButton || target == pasteButton || target == input || document?.activeElement?.matches?.("input")) {
            refocus(input);
        } else {
            unfocus({target});
        }
        
        // TODO: needs to action
        if (target == copyButton) {
        }
        
        // TODO: needs to action
        if (target == pasteButton) {
        }
    });

    //
    document.addEventListener("focusin", ({target})=>{
        if (target == copyButton || target == pasteButton) {
            if (document.activeElement != input) { refocus(input); }
        }
    });
    
    //
    onMount(()=>{
        requestAnimationFrame(()=>{
            if (input) {
                bindToFieldEdit(input); 
                refocus(input);
            }
        });
    });
</script>

<!-- -->
{#if $id}
    <div class="field-edit fixed" data-edit={$id||""}>
        <div class="field-content stretch solid apply-color-theme" style="grid-row: field-edit;">
            <div class="field-wrap solid apply-color-theme">
                <input bind:this={input} autofocus={true} type="text" data-edit={$id||""} bind:value={$value}/>
            </div>
            <div bind:this={copyButton} class="field-copy solid hl-1 hl-2h apply-color-theme pe-enable">
                <LucideIcon name="copy"></LucideIcon>
            </div>
            <div bind:this={pasteButton} class="field-paste solid hl-1 hl-2h apply-color-theme pe-enable">
                <LucideIcon name="clipboard"></LucideIcon>
            </div>
        </div>
    </div>
{/if}
