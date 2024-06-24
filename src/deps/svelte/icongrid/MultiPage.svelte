<script>
    //
    import { grabForDrag } from "@libs/orion/pointer-api.mjs";
    import { animationSequence, makeArgs, putToCell } from "@states/gridItem.mjs";
    import { currentState } from "@states/gridState.mjs";
    import { settings } from "@states/settings.mjs";
    import { onMount } from "svelte";
    import IconGrid from "./IconGrid.svelte";
    import IconItem from "./IconItem.svelte";
    import IconLabel from "./IconLabel.svelte";

    //
    let {rows, columns} = settings;

    //
    export let dragBucket = [];
    export let currentPage = "home-page";
    export let mainElement = null;
    export let columnsAndRows = [$columns, $rows];

    //
    let {iconLists, iconItems, gridPages} = currentState;
    let gridPagesArray = Array.from(gridPages.values());

    //
    $: columnsAndRows = [$columns, $rows];
    $: iconLists = currentState.iconLists;
    $: iconItems = currentState.iconItems;
    $: gridPages = currentState.gridPages;
    $: gridPagesArray = Array.from(gridPages.values());

    //
    const grabItem = (ev)=>{
        const grabEvent = ["pointermove", ()=>{
            const iconElement = ev.detail.target.closest(".icon-item");
            const iconId      = iconElement.dataset["id"];
            const iconItem    = iconItems.get(iconId);
            const iconList    = iconLists.get(currentPage);

            //
            iconItem.pCellX = iconItem.cellX;
            iconItem.pCellY = iconItem.cellY;
            iconItem.pointerId = ev.detail.pointerId;

            //
            const argObj = makeArgs(iconItem, iconItems, gridPages.get(currentPage), columnsAndRows, iconLists);

            //iconId
            iconLists.set(currentPage, iconList.filter((id)=>(id!=iconId)) || []);
            currentState.iconLists = iconLists;
            dragBucket = [...dragBucket, iconId];
            
        }, {once: true, capture: true, passive: true}];

        //
        document.addEventListener(...grabEvent);
        document.addEventListener("pointerup", ()=>{
            document.removeEventListener(...grabEvent, {once: true, capture: true, passive: true});
        });
    }

    //
    const placeElement = async ({pointer, holding})=>{
        const iconElement = holding.element.deref();
        const iconId      = iconElement.dataset["id"];
        const iconItem    = {...iconItems.get(iconId)}; // avoid force update
        const gridPage    = gridPages.get(currentPage);
        const iconList    = iconLists.get(currentPage) || [];
        const args        = makeArgs(iconItem, iconItems, gridPage, columnsAndRows, iconLists);

        //
        const bbox = args.gridPage?.getBoundingClientRect?.();
        const xy   = [pointer.current[0] - (bbox?.left || 0), pointer.current[1] - (bbox?.top || 0)];

        //
        putToCell(args, {
            x: xy[0], 
            y: xy[1]
        });

        // dirty hack-fix
        iconElement.style.setProperty("--cell-x", iconItem.cellX, "");
        iconElement.style.setProperty("--cell-y", iconItem.cellY, "");

        //
        await iconElement.animate(animationSequence(), {
            fill: "none",
            duration: 100,
            rangeStart: "cover 0%",
            rangeEnd: "cover 100%",
        }).finished;

        //
        dragBucket = dragBucket.filter((id)=>(id!=iconId));
        iconLists.set(currentPage, [...iconList, iconId]);
        iconItems.set(iconId, iconItem);

        //
        currentState.iconLists = iconLists;
        currentState.iconItems = iconItems;
    }

    // make true value of cells
    const reCalcPosition = (element, ev = {pointerId: 0})=>{
        //updateIcons();
    }

    //
    onMount(()=>{
        //mainElement
    });

</script>


<div bind:this={mainElement} class="layer-2 stretch grid-based-box fixed-avail fixed" style="isolation: isolate;" {...$$props}>
    <canvas is="w-canvas" class="stretch fixed inset-0" data-src="./assets/wallpaper/0.jpg"/>
    
    {#each gridPagesArray as page}
        {#if currentPage==page.id}
            
            <IconGrid id={page.id} type="labels" columns={columnsAndRows[0]} rows={columnsAndRows[1]}>
                {@const iconList = iconLists.get(page.id)||[]}
                {#each iconList as iconId}
                    {@const iconItem = iconItems.get(iconId)}
                    {#if iconItem && iconItem.id}
                        <IconLabel iconItem={iconItem}></IconLabel>
                    {/if}
                {/each}
            </IconGrid>

            <IconGrid id={page.id} type="icons" columns={columnsAndRows[0]} rows={columnsAndRows[1]}>
                {@const iconList = iconLists.get(page.id)||[]}
                {#each iconList as iconId}
                    {@const iconItem = iconItems.get(iconId)}
                    {#if iconItem && iconItem.id}
                        <IconItem 
                            onmount={reCalcPosition}
                            iconItem={iconItem}
                            dragend={placeElement}
                            longpress={grabItem}
                        ></IconItem>
                    {/if}
                {/each}
            </IconGrid>
            
        {/if}
    {/each}

    <IconGrid type="bucket" columns={columnsAndRows[0]} rows={columnsAndRows[1]}>
        {#each dragBucket as iconId}
        {@const iconItem = iconItems.get(iconId)}
            {#if iconItem && iconItem.id}
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

