<div class="stretch grid-based-box relative">
    
    {#each gridPages as page}
        <div class="layered grid-based-box">
            <IconGrid type="icons" columns={wColumns} rows={wRows}>
                {#each page.iconList as iconId}
                    {@const iconItem = iconItems.get(iconId)}
                    <IconItem 
                        id={iconItem.id}
                        labelId={iconItem.id}
                        icon={iconItem.icon}
                        cellX={iconItem.cellX}
                        cellY={iconItem.cellY}
                    ></IconItem>
                {/each}
            </IconGrid>
            <IconGrid type="labels" columns={wColumns} rows={wRows}>
                {#each page.iconList as iconId}
                    {@const iconItem = iconItems.get(iconId)}
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
        <IconGrid type="bucket" columns={wColumns} rows={wRows}>
            {#each dragBucket as iconId}
                {@const iconItem = iconItems.get(iconId)}
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
    import {
        columns as wColumns, 
        rows as wRows
    } from "../states/gridState.mjs";

    //
    wColumns.subscribe((v)=>(CL[0] = v));
    wRows.subscribe((v)=>(CL[1] = v));

    //
    export let gridPages = [].concat(JSON.parse(localStorage.getItem("@pages") || "[]") || []);
    export let iconItems = new Map([].concat(JSON.parse(localStorage.getItem("@icons") || "[]") || []));
    export let dragBucket = [];
    export let CL = [8, 4];

    //
    export const makeArgs = (iconItem, gridPage)=>{
        return {
            gridPage: document.querySelector(`.icon-grid[data-id="${gridPage.id}"]`),
            iconList: gridPage.iconList, 
            iconItems,
            iconItem, CL
        };
    }

</script>
