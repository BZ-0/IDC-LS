<script type="ts" lang="ts" context="module">
    import { observeBySelector} from "@unite/scripts/dom/Observer.ts";
    import { MOC, propsFilter } from "@unite/scripts/utils/Utils.ts";
    import LucideIcon from "@idc/UI/design/WLucideIcon.svelte";
    import {writable} from "svelte/store";
    import {onMount} from "svelte";

    //
    const TextInputSelector = "input[type=\"text\"]";
    const InputValidSelector = ".ux-editor, input";
    const IsEditorInputSelector = ".ux-editor input";

    //
    let input: HTMLInputElement | null = null, copyButton: HTMLButtonElement | null = null, pasteButton: HTMLButtonElement | null = null, fieldEdit: HTMLDivElement | null = null;
    let targetInput: HTMLInputElement | null = null;
    let value = writable("");

    //
    const isInputOrIn = (el)=>{
        return (el && MOC(el, InputValidSelector)) || (document?.activeElement && (MOC(document?.activeElement as HTMLElement, InputValidSelector)));
    }

    //
    observeBySelector(document.documentElement, ".ux-editor", (mut)=>{
        fieldEdit ||= mut.addedNodes[0];
        input ||= fieldEdit?.querySelector("input") || null;
        copyButton ||= fieldEdit?.querySelector(".field-copy") || null;
        pasteButton ||= fieldEdit?.querySelector(".field-paste") || null;
        
        //
        if (document.activeElement != input) { input?.focus?.(); }
    });

    //
    const unfocus = (target: HTMLInputElement | null)=>{
        if (!isInputOrIn(target || targetInput)) {

            // @ts-ignore
            navigator?.virtualKeyboard?.hide?.();

            //
            (document.activeElement as HTMLElement)?.blur?.();

            //
            input?.blur?.();

            //
            fieldEdit?.setAttribute("data-hidden", true);

            //
            targetInput = null;
        }
    }

    //
    const reflectInEdit = ()=>{
        if (input && targetInput) {
            const value = targetInput?.value || "";
            const range: [number, number] = [
                (targetInput?.selectionStart ?? input?.selectionStart) || 0, 
                (targetInput?.selectionEnd ?? input?.selectionEnd) || 0
            ];

            //
            const oldValue = input?.value || "";
            if (input && oldValue != value) { input.value = value; }

            //
            const prevActive = document.activeElement;
            if (prevActive != input) { input?.focus?.() }

            //
            if (document.activeElement == input && prevActive == targetInput) {
                input?.setSelectionRange?.(...range);
            }
        }
    }
    
    //
    const refocus = (from)=>{
        //if (target?.matches("input"))
        //if (input && document.activeElement == input) return;
        
        //
        if (matchMedia("(hover: none) and (pointer: coarse)").matches) {
            if ((from as HTMLElement)?.matches?.(TextInputSelector) && (!input || from != input) && !MOC(from as HTMLElement, IsEditorInputSelector)) {
                targetInput = from;

                //
                fieldEdit?.setAttribute("data-hidden", false);
            }
        }
        
        //
        //reflectInEdit();
        requestAnimationFrame(reflectInEdit);
    }
    
    //
    const reflect = (ev)=>{
        if (ev.target.matches(TextInputSelector) && !input) {
            input = ev.target;
        }
        if (input && targetInput && targetInput != input) {
            targetInput.value = input.value;
            targetInput.dispatchEvent(new Event("input", {
                bubbles: false,
                cancelable: true,
            }))
        }
    }

    //
    document.addEventListener("input", (ev)=>{
        //reflect
        const {target} = ev;
        if (target == input) { reflect(ev); }
    });

    //
    document.addEventListener("focusout", (ev)=>{
        const {target} = ev;
        if (target != input && !((target as HTMLElement)?.matches?.(TextInputSelector)) && !MOC(target as HTMLElement, InputValidSelector)) { 
            ev.preventDefault();
            ev.stopPropagation();
            unfocus(target as HTMLInputElement);
        }
    });

    //
    document.addEventListener("focusin", (ev)=>{
        const {target} = ev;
        
        //
        if (MOC(target as HTMLElement, IsEditorInputSelector)) { 
            input = target as HTMLInputElement;
        } else 
        if ((target as HTMLElement)?.matches?.(TextInputSelector) && (target != input || !input)) {
            ev.preventDefault();
            ev.stopPropagation();
            refocus(target);
        }
    });

    //
    document.addEventListener("click", (ev)=>{
        const target = ev.target as HTMLElement;
        
        //
        if (MOC(target, IsEditorInputSelector)) { input = target as HTMLInputElement; }
        if ([input, copyButton, pasteButton].indexOf(target as any) >= 0 || MOC(target, InputValidSelector)) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        
        //
        if (isInputOrIn(target)) {
            refocus(target);
        } else 
        if (isInputOrIn(document?.activeElement)) {
            refocus(document?.activeElement);
        } else {
            unfocus(target as HTMLInputElement);
        }
        
        //
        if (input && targetInput && targetInput != input) {
            if (target == copyButton && (input?.selectionStart||0) < (input?.selectionEnd||0)) {
                navigator.clipboard.writeText(input.value.substring(input.selectionStart||0, input.selectionEnd||0));
            }
            
            // 
            if (target == pasteButton && (input?.selectionStart||0) <= (input?.selectionEnd||0)) {
                navigator.clipboard.readText().then(
                    (clipText) => {
                        const oldStart = input?.selectionStart||0;
                        const paste = (input?.value?.substring(0, input?.selectionStart||0)||"") + (clipText || "") + (input?.value?.substring?.(input?.selectionEnd||0)||"");
                        if (input) { input.value = paste; };

                        //
                        input?.setSelectionRange(
                            oldStart + clipText.length, 
                            oldStart + clipText.length
                        );

                        //
                        input?.dispatchEvent(new Event("input", {
                            bubbles: false,
                            cancelable: true,
                        }))
                    },
                );
            }
        }
        
    });

</script>


<div 
    class="ux-editor fixed" 
    data-hidden={true}
    data-scheme="transparent"
    {...propsFilter($$props)}
>
    <div data-scheme="solid" class="field-content stretch" style="grid-row: field-edit;">
        <div class="field-wrap">
            <input 
                autofocus={true}
                autocomplete="off"
                type="text"
                maxlength="1024"
            />
        </div>
        <button type="button" tabindex="-1" bind:this={copyButton} data-scheme="solid" data-highlight="2" class="field-copy pe-enable">
            <LucideIcon name="copy" tabindex="-1" inert={true}></LucideIcon>
        </button>
        <button type="button" tabindex="-1" bind:this={pasteButton} data-scheme="solid" data-highlight="2" class="field-paste pe-enable">
            <LucideIcon name="clipboard" tabindex="-1" inert={true}></LucideIcon>
        </button>
    </div>
</div>

<!-- TEST ONLY! -->
<!--<input type="text" name="text" />
<input type="text" name="text" />-->
