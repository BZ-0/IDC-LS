<script>
    import {fieldEditWrite, reflectToField, whenTouch} from "@states/fieldEdit.mjs";
    import LucideIcon from '@svelte/decors/LucideIcon.svelte';
    import {onMount} from 'svelte';
    import {fade} from "svelte/transition";

    //
    let {id, value} = fieldEditWrite;
    let input = null, copyButton = null,pasteButton = null, fieldEdit = null;

    //
    id.subscribe((v)=>{
        requestAnimationFrame(()=>{
            if (v && input) {
                if (document.activeElement != input) { input.focus(); }
            }
        });
    });

    //
    const stillInFocus = (el)=>{
        return el && (el.matches("input") || [input, copyButton, pasteButton, fieldEdit].filter((l)=>!!l).indexOf(el) >= 0);
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
        if (document.activeElement == input) return;
        
        //
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
    document.addEventListener("click", (ev)=>{
        const target = ev.target;

        //
        if (stillInFocus(target) || target.matches(".field-edit, .field-content, .icon-edit, input.ls-modal")) {
            refocus(input, document?.activeElement);
        } else {
            unfocus({target});
        }
        
        //
        if ([input, copyButton, pasteButton].indexOf(document.activeElement) >= 0) {
            ev.preventDefault();
        }
        
        //
        requestAnimationFrame(()=>{
            if (input && document.activeElement == input) {
                if (target == copyButton && input.selectionStart < input.selectionEnd) {
                    navigator.clipboard.writeText(input.value.substring(input.selectionStart, input.selectionEnd));
                }
                
                // TODO: needs to action
                if (target == pasteButton && input.selectionStart <= input.selectionEnd) {
                    navigator.clipboard.readText().then(
                        (clipText) => {
                            const oldStart = input.selectionStart;
                            const paste = (input.value.substring(0, input.selectionStart) + (clipText || "") + input.value.substring(input.selectionEnd));
                            input.value = paste;

                            //
                            input.setSelectionRange(
                                oldStart + clipText.length, 
                                oldStart + clipText.length
                            );

                            //
                            input.dispatchEvent(new Event("input", {
                                bubbles: false,
                                cancelable: true,
                            }))
                        },
                    );
                }
            }
        })
        
    });
    
    //
    onMount(()=>{
        requestAnimationFrame(()=>{
            if (input) {
                //indToFieldEdit(input); 
                reflectToField(id, "change", input.value);
                refocus(input);
            }
        });
    });
</script>

<!-- -->
<script context="module">
    import {propsFilter} from "@unite/utils/utils.mjs";
</script>

<!-- -->
{#if $id && $whenTouch}
    <div 
        transition:fade={{ delay: 0, duration: 10 }} 
        bind:this={fieldEdit} 
        class="field-edit fixed" 
        data-edit={$id||""}
        {...propsFilter($$props)}
    >
        <div class="field-content stretch solid apply-color-theme" style="grid-row: field-edit;">
            <div class="field-wrap solid apply-color-theme">
                <input 
                on:input={(ev) => { reflectToField(ev.target.dataset.edit, "input", ev.target.value); }}
                on:change={(ev) => { reflectToField(ev.target.dataset.edit, "change", ev.target.value); }}
                bind:value={$value}
                bind:this={input} 
                type="text" 
                data-edit={$id||""} 
            />
            </div>
            <div tabindex="-1" bind:this={copyButton} class="field-copy solid hl-1 hl-2h apply-color-theme pe-enable">
                <LucideIcon name="copy" tabindex="-1" inert={true}></LucideIcon>
            </div>
            <div tabindex="-1" bind:this={pasteButton} class="field-paste solid hl-1 hl-2h apply-color-theme pe-enable">
                <LucideIcon name="clipboard" tabindex="-1" inert={true}></LucideIcon>
            </div>
        </div>
    </div>
{/if}
