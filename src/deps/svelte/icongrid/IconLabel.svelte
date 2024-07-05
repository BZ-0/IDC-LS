<script>
    export let iconItem = {};
</script>

<script context="module">
    import {propsFilter} from "@unite/utils/utils.mjs";
</script>

<!-- -->
<div class="icon-placement grid-item-label auto-space translate-down horizontal-force" 
    style={`--cell-x: ${iconItem.cellX}; --cell-y: ${iconItem.cellY}; --translate-shift: 3rem;`} 
    data-host={iconItem.id}
    data-name={iconItem.id}
    {...propsFilter($$props)}>
    <span class="icon-label">{iconItem?.label||""}</span>
</div>
