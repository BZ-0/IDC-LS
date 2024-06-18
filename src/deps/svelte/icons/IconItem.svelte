<script>
    import * as icons from 'lucide-svelte';
    
    //
    export let labelId = "";
    export let cellX = 0;
    export let cellY = 0;
    export let id = "";
    export let icon = "";
    export let inert = false;
</script>

<!-- -->
<div inert={inert} class="icon-placement grid-item fspace" style={`--cell-x: ${cellX}; --cell-y: ${cellY}`} data-id={id} data-label-id={labelId}>
    <div class="icon-design">
        <!--<img class="icon-id" alt="IconItem" src="" data-lucide={id}/>-->
        <svelte:component this="{icons[icon]}" {...$$props} />
    </div>
</div>

<style type="scss">

</style>
