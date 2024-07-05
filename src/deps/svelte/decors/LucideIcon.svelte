<script>
    import * as icons from 'lucide-svelte';

    export let name = "";
    
    //
    const camelize = (str) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
    
    //
    const fup = (str)=>{
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
</script>

<script context="module">
    import {propsFilter} from "@unite/utils/utils.mjs";
</script>

<svelte:component inert=true class="icon-sign" this={icons[fup(camelize(name))]} {...propsFilter($$props)} />
