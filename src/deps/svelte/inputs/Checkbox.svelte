<script>
    import LucideIcon from '@svelte/decors/LucideIcon.svelte';
    import { writable } from "svelte/store";
    
    //
    export let fieldName = "";
    export let value = writable(false);
</script>

<label class="ls-checkbox hl-2">
    <input bind:value={$value} type="checkbox" data-name={fieldName}>
    <div class="icon-sign hl-2"><LucideIcon name={"check"}/></div>
</label>
