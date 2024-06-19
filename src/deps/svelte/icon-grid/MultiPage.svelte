<script>
    import IconItem from "./IconItem.svelte";
	import IconGrid from "./IconGrid.svelte";
    import IconLabel from "./IconLabel.svelte";
    import { fade } from 'svelte/transition';
    import { swipe } from 'svelte-gestures';

    //
    import { cGridPages, cIconItems, columns, rows, editForIcon } from "./helpers/gridState.mjs";
    import { animationSequence, makeArgs, putToCell } from "./helpers/gridItem.mjs"
	import { onMount } from "svelte";

    //
    export let iconItems = new Map([]);
    export let gridPages = [];

    //
    export const updateIcons = ()=>{ cIconItems.set(Array.from(iconItems.entries())); };
    export const updateForce = ()=>{ cGridPages.set(gridPages); dragBucket = [...dragBucket]; };

    //
    cIconItems.subscribe((v)=>{iconItems = new Map(v)});
    cGridPages.subscribe((v)=>{gridPages = [...v]});

    //
    import {grabForDrag} from "../../libraries/js/orion/pointer-api.mjs"

    //
    export let CL = [8, 4];
    export let dragBucket = [];
    export {editForIcon, columns, rows};

    //
    columns.subscribe((v)=>(CL = [v,CL[1]]));
    rows.subscribe((v)=>(CL = [CL[0], v]));

    //
    export let currentPage = "home-page";
    export let mainElement = null;

    

    //
    const grabItem = (ev)=>{
        const iconElement = ev.target.closest(".icon-item");//ev.holding.element.deref();
        const iconId      = iconElement.dataset["id"];
        const iconItem    = iconItems.get(iconId);
        const gridPage    = gridPages.find((g)=>(currentPage==g.id));

        //
        iconItem.pCellX = iconItem.cellX;
        iconItem.pCellY = iconItem.cellY;
        iconItem.pointerId = ev.pointerId;

        //
        const argObj = makeArgs(iconItem, iconItems, gridPage, CL);

        //
        gridPage.iconList = gridPage.iconList.filter((id)=>(id!=iconId));
        dragBucket.push(iconId);

        //
        updateForce();
    }

    //
    const placeElement = async ({pointer, holding})=>{
        const bbox = mainElement.getBoundingClientRect();
        const xy   = [pointer.current[0] - bbox.left, pointer.current[1] - bbox.top];

        //
        const iconElement = holding.element.deref();
        const iconId      = iconElement.dataset["id"];
        const iconItem    = {...iconItems.get(iconId)}; // avoid force update
        const gridPage    = gridPages.find((g)=>(currentPage==g.id));

        //
        const argObj = makeArgs(iconItem, iconItems, gridPage, CL);

        //
        putToCell(argObj, {
            x: xy[0], 
            y: xy[1]
        });

        // dirty hack-fix
        //iconElement.style.setProperty("--p-cell-x", iconItem.pCellX, "");
        //iconElement.style.setProperty("--p-cell-y", iconItem.pCellY, "");
        iconElement.style.setProperty("--cell-x", iconItem.cellX, "");
        iconElement.style.setProperty("--cell-y", iconItem.cellY, "");

        //
        const animation = iconElement.animate(animationSequence(), {
            fill: "none",
            duration: 100,
            rangeStart: "cover 0%",
            rangeEnd: "cover 100%",
        });

        await animation.finished;

        //
        iconItems.set(iconId, iconItem);
        dragBucket = dragBucket.filter((id)=>(id!=iconId));
        gridPage.iconList.push(iconId);

        //
        updateForce();
    }

    // make true value of cells
    const reCalcPosition = (element, ev = {pointerId: 0})=>{
        
        
        //
        updateIcons();
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

                <IconGrid id={page.id} type="labels" columns={CL[0]} rows={CL[1]}>
                    {@const iconList = page.iconList}
                    {#each iconList as iconId}
                        {@const iconItem = iconItems.get(iconId)}
                        {#if iconItem}
                            <IconLabel iconItem={iconItem}></IconLabel>
                        {/if}
                    {/each}
                </IconGrid>

                <IconGrid id={page.id} type="icons" columns={CL[0]} rows={CL[1]}>
                    {@const iconList = page.iconList}
                    {#each iconList as iconId}
                        {@const iconItem = iconItems.get(iconId)}
                        {#if iconItem}
                            <IconItem 
                                onmount={reCalcPosition}
                                iconItem={iconItem}
                                dragend={placeElement}
                                pointerdown={grabItem}
                            ></IconItem>
                        {/if}
                    {/each}
                </IconGrid>
                
            </div>
        {/if}
    {/each}

    <div inert=true class="grid-based-box pointer-events-none">
        <IconGrid type="bucket" columns={CL[0]} rows={CL[1]}>
            {#each dragBucket as iconId}
            {@const iconItem = iconItems.get(iconId)}
                {#if iconItem}
                    <IconItem 
                        inert=true
                        iconItem={iconItem}
                        onmount={grabForDrag}
                        dragend={placeElement}
                    ></IconItem>
                {/if}
            {/each}
        </IconGrid>
    </div>

</div>

