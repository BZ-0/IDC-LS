<script>
    import IconItem from "./IconItem.svelte";
	import IconGrid from "./IconGrid.svelte";
    import IconLabel from "./IconLabel.svelte";
    import { fade } from 'svelte/transition';
    import { swipe } from 'svelte-gestures';

    //
    import { gridPages, iconItems,columns, rows, editForIcon } from "./helpers/gridState.mjs";
    import {  } from "./helpers/gridItem.mjs"
	import { onMount } from "svelte";

    //
    export const CL = [8, 4];
    export const dragBucket = [];
    export {editForIcon, columns, rows};

    //
    columns.subscribe((v)=>(CL[0] = v));
    rows.subscribe((v)=>(CL[1] = v));

    //
    export let currentPage = "home-page";

    //
    let mainElement = null;

    //
    const grabItem = (ev)=>{
        console.log("grabbing");
    }

    //
    const placeElement = ({pointer, holding})=>{
        const bbox = mainElement.getBoundingClientRect();
        const xy = [pointer.currentX - bbox.left, pointer.currentY - bbox.top];
        //putToCell({x: xy[0], y: xy[1]});
    }

    //
    onMount(()=>{
        
    });


</script>


<div bind:this={mainElement} class="stretch grid-based-box relative">
    
    {#each gridPages as page}
        {#if currentPage==page.id}
            <div class="layered grid-based-box" type={page.type} visible={currentPage==page.id}
                transition:fade={{ delay: 0, duration: 200 }}>

                <IconGrid type="labels" columns={CL[0]} rows={CL[1]}>
                    {#each page.iconList as iconId}
                        {@const iconItem = iconItems.get(iconId)}
                        <IconLabel
                            iconItem={iconItem}
                        ></IconLabel>
                    {/each}
                </IconGrid>

                <IconGrid type="icons" columns={CL[0]} rows={CL[1]}>
                    {#each page.iconList as iconId}
                        {@const iconItem = iconItems.get(iconId)}
                        <IconItem 
                            iconItem={iconItem}
                            dragend={placeElement}
                            pointerdown={grabItem}
                        ></IconItem>
                    {/each}
                </IconGrid>
                
            </div>
        {/if}
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

