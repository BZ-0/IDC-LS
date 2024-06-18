<script>
    export let id = "";
    export let columns = 4;
    export let rows = 8;
    export let type = "";
</script>

<!-- -->
<div 
    data-type={type}
    data-id={id}
    class="icon-grid stretch fixed inset-0 orientation-adaptive padding-0 overflow-visible grid-inside"
    style={`--columns:${columns};--rows:${rows}`}
>
    <slot></slot>
</div>

<style type="scss">

</style>
