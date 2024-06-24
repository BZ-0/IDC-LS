<script>
    import { bindToFieldEdit, fieldEditWrite, whenTouch } from "@states/fieldEdit.mjs";
    import LucideIcon from '@svelte/decors/LucideIcon.svelte';
    import { onMount } from 'svelte';
    import { fade } from "svelte/transition";

    //
    let {id, value} = fieldEditWrite;
    let input = null;
    let copyButton = null;
    let pasteButton = null;
    let fieldEdit = null;

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
    const stillInFocus = (el)=>{
        return el && (el.matches("input") || [input, copyButton, pasteButton, fieldEdit].indexOf(el) >= 0);
    }

    //
    const unfocus = ({target})=>{
        if (!stillInFocus(target)) {
            requestAnimationFrame(()=>{
                const active = document.activeElement;
                if (!stillInFocus(active)) {
                    navigator?.virtualKeyboard?.hide?.();
                    active?.blur?.();
                    id.set("");
                }
            });
        }
    }

    //
    const refocus = (input, from)=>{
        //if (target?.matches("input"))
        const idOf = from?.dataset?.name || from?.dataset?.edit;
        if (idOf) { id.set(idOf); };
        
        //
        if (input && document.activeElement != input) {
            input.style.display = "none";
            input.style.removeProperty("display");
            input.focus();
        }
        
        //
        requestAnimationFrame(()=>{
            if (document.activeElement != input) {
                input?.focus?.();
            }
        });
    }

    //
    document.addEventListener("focusout", ({target})=>{
        if (target == input) { unfocus({target}); }
    });

    //
    document.addEventListener("focusin", ({target})=>{
        if (!stillInFocus(target)) {
            if (document.activeElement != input) { refocus(input); }
        }
    });

    //
    document.addEventListener("click", ({target})=>{
        if (stillInFocus(target)) {
            refocus(input, document?.activeElement);
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
{#if $id && $whenTouch}
    <div 
        transition:fade={{ delay: 0, duration: 10 }} 
        bind:this={fieldEdit} 
        class="field-edit fixed" 
        data-edit={$id||""}
    >
        <div class="field-content stretch solid apply-color-theme" style="grid-row: field-edit;">
            <div class="field-wrap solid apply-color-theme">
                <input bind:this={input} type="text" data-edit={$id||""} bind:value={$value}/>
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