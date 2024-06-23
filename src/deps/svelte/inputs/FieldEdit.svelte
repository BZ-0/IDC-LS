<script>
    import { fieldEditWrite } from "@states/fieldEdit.mjs";
    import { onMount } from 'svelte';

    //
    let {id, value} = fieldEditWrite;
    let input = null;

    //
    onMount(()=>{
        if (input) { bindToFieldEdit(input); }
    });
</script>

<!-- -->
{#if $id}
    <div class="field-edit" data-edit={$id||""}>
        <div class="field-wrap">
            <input bind:this={input} type="text" data-edit={$id||""} bind:value={$value}/>
        </div>
        <div class="field-copy">
            
        </div>
        <div class="field-paste">
            
        </div>
    </div>
{/if}
