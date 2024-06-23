<script>
    import { bindToFieldEdit, fieldEditWrite } from "@states/fieldEdit.mjs";
    import LucideIcon from '@svelte/decors/LucideIcon.svelte';
    import { onMount } from 'svelte';

    //
    let {id, value} = fieldEditWrite;
    let input = null;

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
    const unfocus = ()=>{
        requestAnimationFrame(()=>{
            if (!document.activeElement.matches("input")) {
                id.set("");
            }
        });
    }
    
    //
    let copyButton = null;
    let pasteButton = null;
    
    //
    onMount(()=>{
        
        //
        value.subscribe((v)=>{
            if (input != null) { input.value = v; };
        });
    
        //
        document.addEventListener("click", ({})=>{
            unfocus();
        });
    
        //
        requestAnimationFrame(()=>{
            //
            document.addEventListener("click", ({target})=>{
                if (target == copyButton || target == pasteButton) {
                    input?.focus?.();
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
                    input?.focus?.();
                }
            });
        
            //
            if (input) {
                input?.addEventListener("focusout", ({target})=>{
                    unfocus();
                });
                
                //
                bindToFieldEdit(input); 
                input.focus();
            }
        });
    });
</script>

<!-- -->
{#if $id}
    <div class="field-edit fixed stretch exclude-keyboard-vp" data-edit={$id||""}>
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
