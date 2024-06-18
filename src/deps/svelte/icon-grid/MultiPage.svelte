<script>
    import IconItem from "./IconItem.svelte";
	import IconGrid from "./IconGrid.svelte";
    import IconLabel from "./IconLabel.svelte";
    import { fade } from 'svelte/transition';
    import { swipe } from 'svelte-gestures';

    //
    import { cGridPages, cIconItems, columns, rows, editForIcon } from "./helpers/gridState.mjs";
    import { makeArgs } from "./helpers/gridItem.mjs"
	import { onMount } from "svelte";

    //
    import {grabForDrag} from "../../libraries/js/orion/pointer-api.mjs"

    //
    export let CL = [8, 4];
    export let dragBucket = [];
    export {editForIcon, columns, rows};

    //
    let gridPages = [...cGridPages];
    let iconItems = [...cIconItems];;

    //
    columns.subscribe((v)=>(CL = [v,CL[1]]));
    rows.subscribe((v)=>(CL = [CL[0], v]));

    //
    export let currentPage = "home-page";
    export let mainElement = null;
    
    //
    /*export const resynchronize = ()=>{
        gridPages = [...cGridPages];
        iconItems = [...cIconItems];
    }*/

    //
    export const forceUpdate = ()=>{
        gridPages = [...cGridPages];
        dragBucket = [...dragBucket];
    };

    //
    export const forceUpdateIcons = ()=>{
        iconItems = [...cIconItems];
    };

    //
    const grabItem = (ev)=>{
        const iconElement = ev.target.closest(".icon-item");//ev.holding.element.deref();
        const iconId      = iconElement.dataset["id"];
        const iconItem    = new Map(cIconItems).get(iconId);
        const gridPage    = cGridPages.find((g)=>(currentPage==g.id));

        //
        iconItem.pointerId = ev.pointerId;
        const argObj = makeArgs(iconItem, iconItems, gridPage, CL);

        //
        gridPage.iconList = gridPage.iconList.filter((id)=>(id!=iconId));
        dragBucket.push(iconId);

        //
        forceUpdate();
    }

    //
    const placeElement = ({pointer, holding})=>{
        const bbox = mainElement.getBoundingClientRect();
        const xy   = [pointer.currentX - bbox.left, pointer.currentY - bbox.top];

        //
        const iconElement = holding.element.deref();
        const iconId      = iconElement.dataset["id"];
        const iconItem    = new Map(cIconItems).get(iconId);
        const gridPage    = cGridPages.find((g)=>(currentPage==g.id));

        //
        dragBucket = dragBucket.filter((id)=>(id!=iconId));
        gridPage.iconList.push(iconId);

        //
        forceUpdate();
    }

    // make true value of cells
    const reCalcPosition = (element, ev = {pointerId: 0})=>{
        
        
        //
        forceUpdateIcons();
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
                    {@const iconList = page.iconList}
                    {#each iconList as iconId}
                        <IconLabel iconItem={new Map(iconItems).get(iconId)}></IconLabel>
                    {/each}
                </IconGrid>

                <IconGrid type="icons" columns={CL[0]} rows={CL[1]}>
                    {@const iconList = page.iconList}
                    {#each iconList as iconId}
                        <IconItem 
                            onmount={reCalcPosition}
                            iconItem={new Map(iconItems).get(iconId)}
                            dragend={placeElement}
                            pointerdown={grabItem}
                        ></IconItem>
                    {/each}
                </IconGrid>
                
            </div>
        {/if}
    {/each}

    <div inert=true class="grid-based-box pointer-events-none">
        <IconGrid dragend={placeElement} type="bucket" columns={CL[0]} rows={CL[1]}>
            {#each dragBucket as iconId}
                <IconItem 
                    inert=true
                    iconItem={new Map(iconItems).get(iconId)}
                    onmount={grabForDrag}
                    dragend={placeElement}
                ></IconItem>
            {/each}
        </IconGrid>
    </div>

</div>

