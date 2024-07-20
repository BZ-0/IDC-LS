<script>
    import LucideIcon from '@idc/UI2/Design/WLucideIcon.svelte';
    import {onMount} from 'svelte';
    import {writable} from "svelte/store";

    //
    export let value = $$props?.value || writable(false);
    export let element = null;
    export let container = null;

    //
    const _change = (ev)=>{
        value.set(ev.target.checked ?? true);
        
        //
        ev.target.classList.remove("checked");
        if ($value) {
            ev.target.classList.add("checked");
        }
    }

    //
    const _click = (ev)=>{
        value.set(!$value);
        
        //
        ev.target.classList.remove("checked");
        if ($value) {
            ev.target.classList.add("checked");
        }
    }
    
    //
    onMount(()=>{
        element.classList.remove("checked");
        if ($value) {
            element.classList.add("checked");
        }
    });
</script>

<!-- -->
<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
</script>

<!-- -->
<label bind:this={container} class="ux-checkbox" data-scheme data-highlight="1">
    <input 
        type="checkbox"
        on:input={_change}
        on:change={_change}
        on:click={_click}
        bind:this={element}/>
    <div class="icon-sign" data-scheme><LucideIcon class="done lucide" name={"check"}/> <LucideIcon class="circle lucide" name={"circle"}/> </div>
</label>
