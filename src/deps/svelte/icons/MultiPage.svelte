<div class="stretch grid-based-box relative">
    
    {#each gridPages as page}
        <div class="layered grid-based-box">
            <IconGrid type="icons" columns={CL[0]} rows={CL[1]}>
                {#each page.iconList as iconId}
                    {@const iconItem = iconItems.get(iconId)}
                    <IconItem 
                        id={iconItem.id || iconId}
                        labelId={iconItem.id || iconId}
                        icon={iconItem.icon}
                        cellX={iconItem.cellX}
                        cellY={iconItem.cellY}
                    ></IconItem>
                {/each}
            </IconGrid>
            <IconGrid type="labels" columns={CL[0]} rows={CL[1]}>
                {#each page.iconList as iconId}
                    {@const iconItem = iconItems.get(iconId)}
                    <IconLabel
                        hostId={iconItem.id || iconId}
                        cellX={iconItem.cellX}
                        cellY={iconItem.cellY}
                    >{iconItem[iconItem.label]}</IconLabel>
                {/each}
            </IconGrid>
        </div>
    {/each}

    <div inert=true class="grid-based-box pointer-events-none">
        <IconGrid type="bucket" columns={CL[0]} rows={CL[1]}>
            {#each dragBucket as iconId}
                {@const iconItem = iconItems.get(iconId)}
                <IconItem 
                    inert=true
                    id={iconItem.id || iconId} 
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
    import {
        gridPages, iconItems,
        columns, rows,
        editForIcon
    } from "../states/gridState.mjs";

    //
    columns.subscribe((v)=>(CL[0] = v));
    rows.subscribe((v)=>(CL[1] = v));

    //
    export const CL = [8, 4];
    export const dragBucket = [];
    export {editForIcon};
    export {columns, rows};
</script>
