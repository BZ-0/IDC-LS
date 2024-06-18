<script>
    export let name = "";
    export let hostId = "";
    export let cellX = 0;
    export let cellY = 0;
    export let label = "";
</script>

<!-- -->
<div class="icon-placement grid-item fspace translate-down horizontal-force" 
    style={`--cell-x: ${cellX}; --cell-y: ${cellY}; --translate-shift: 3rem;`} 
    data-host={hostId}
    data-name={name}>
    <span class="icon-label">{label}</span>
</div>

<style type="scss">

</style>
