<div class="stretch relative">
    
    {#each gridPages as page}
        <div class="layered grid-based-box">
            <IconGrid type="icons">
                {#each page.icons as iconId}
                    {@const iconItem = iconItems[iconId]}
                    <IconItem 
                        id={iconItem.id}
                        labelId={iconItem.id}
                        icon={iconItem.icon}
                        cellX={iconItem.cellX}
                        cellY={iconItem.cellY}
                    ></IconItem>
                {/each}
            </IconGrid>
            <IconGrid type="labels">
                {#each page.icons as iconId}
                    {@const iconItem = iconItems[iconId]}
                    <IconLabel
                        hostId={iconItem.id}
                        cellX={iconItem.cellX}
                        cellY={iconItem.cellY}
                    >{iconItem[iconItem.label]}</IconLabel>
                {/each}
            </IconGrid>
        </div>
    {/each}

    <div inert=true class="grid-based-box pointer-events-none">
        <IconGrid type="bucket">
            {#each dragBucket as iconId}
                {@const iconItem = iconItems[iconId]}
                <IconItem 
                    inert=true
                    id={iconItem.id} 
                    cellX={iconItem.cellX}
                    cellY={iconItem.cellY}
                ></IconItem>
            {/each}
        </IconGrid>
    </div>

</div>

<script>
    import IconItem from "./IconItem.svelte";
	import IconGrid from "./IconGrid.svelte";
    import IconLabel from "./IconGrid.svelte";

    //
    export let gridPages = [].concat(JSON.parse(localStorage.getItem("@pages") || "[]") || []);
    export let iconItems = [].concat(JSON.parse(localStorage.getItem("@icons") || "[]") || []);
    export let dragBucket = [];
</script>
