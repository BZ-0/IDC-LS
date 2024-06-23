<script>
    import { fieldEditWrite } from "@states/fieldEdit.mjs";
    import { onMount } from 'svelte';

    //
    let {id, value} = fieldEditWrite;
    let input = null;

    //
    let idOf = "";
    id.subscribe((v)=>{ idOf = v; });

    //
    const onChange = (evName) => {
        return (ev)=>{
            const {target} = ev;
            const onEdit = document.querySelector(`input[data-name=\"${idOf}\"]`);
            if (onEdit) {
                onEdit.value = target.value;
                onEdit.dispatchEvent(new Event(evName || "input", {
                    'bubbles': true,
                    'cancelable': true
                }));
            }
        }
    }

    //
    onMount(()=>{
        input?.addEventListener?.("change", onChange("change"));
        input?.addEventListener?.("input", onChange("input"));
    });
</script>

<!-- -->
{#if idOf}
    <div class="field-edit" data-edit={idOf||""}>
        <div class="field-wrap">
            <input bind:this={input} type="text" data-edit={idOf||""} bind:value={$value}/>
        </div>
        <div class="field-copy">
            
        </div>
        <div class="field-paste">
            
        </div>
    </div>
{/if}
