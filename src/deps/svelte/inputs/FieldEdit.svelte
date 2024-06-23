<script>
    import { bindToFieldEdit, fieldEditWrite } from "@states/fieldEdit.mjs";
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
    onMount(()=>{
        value.subscribe((v)=>{
            if (input != null) { input.value = v; };
        });
    
        //
        requestAnimationFrame(()=>{
            if (input) {
                bindToFieldEdit(input); 
                input.focus();
            }
        });
    });
</script>

<!-- -->
{#if $id}
    <div class="field-edit fixed stretch exclude-keyboard-vp" data-edit={$id||""}>
        <div class="field-content stretch" style="grid-row: field-edit;">
            <div class="field-wrap">
                <input bind:this={input} autofocus={true} type="text" data-edit={$id||""} bind:value={$value}/>
            </div>
            <div class="field-copy">
                
            </div>
            <div class="field-paste">
                
            </div>
        </div>
    </div>
{/if}
