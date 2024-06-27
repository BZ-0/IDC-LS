<script>
    //
    import { grabForDrag } from "@libs/orion/pointer-api.mjs";
    import { animationSequence, makeArgs, putToCell } from "@states/gridItem.mjs";
    import { currentState, gridState } from "@states/gridState.mjs";
    import { settingsEx } from "@states/settings.mjs";
    import { onMount } from "svelte";
    import IconGrid from "./IconGrid.svelte";
    import IconItem from "./IconItem.svelte";
    import IconLabel from "./IconLabel.svelte";

    //
    let {rows, columns} = settingsEx;
    export let columnsAndRows = [$columns, $rows];
    $: columnsAndRows = [$columns, $rows];

    //
    export let dragBucket = [];
    export let currentPage = "home-page";
    export let mainElement = null;
    
    //
    let {iconLists, iconItems, gridPages} = currentState;
    gridState.iconLists.subscribe((v)=>{ iconLists = v; });
    gridState.iconItems.subscribe((v)=>{ iconItems = v; });
    gridState.gridPages.subscribe((v)=>{ gridPages = v; });

    //
    let gridPagesArray = Array.from(gridPages.values());
    $: gridPagesArray = Array.from(gridPages.values());

    //
    let dragState = {
        pointerId: -1,
        startX: 0,
        startY: 0
    }

    //
    const initGrab = (ev)=>{
        const iconElement = ev.target.closest(".icon-item");
        const iconId      = iconElement?.dataset?.["id"];
        if (!iconId) return;
        
        //
        const iconItem    = iconItems.get(iconId);
        const iconList    = iconLists.get(currentPage);

        //
        iconItem.pCellX = iconItem.cellX;
        iconItem.pCellY = iconItem.cellY;
        iconItem.pointerId = ev.pointerId;
        
        //
        const argObj = makeArgs(iconItem, iconItems, gridPages.get(currentPage), columnsAndRows, iconLists);

        //iconId
        iconLists.set(currentPage, iconList.filter((id)=>(id!=iconId)) || []);
        currentState.iconLists = iconLists;
        dragBucket = [...dragBucket, iconId];
    }

    //
    const grabItem = ({detail: ev})=>{
        dragState.startX = ev.pageX;
        dragState.startY = ev.pageY;
        dragState.pointerId = ev.pointerId;
    
        //
        const grabEvent = ["pointermove", (evm)=>{
            if (dragState.pointerId == evm.pointerId && Math.hypot(dragState.startX - evm.pageX, dragState.startY - evm.pageY) >= 10) {
                initGrab(evm); document.removeEventListener(...grabEvent);
            }
        }, {capture: true, passive: true}];

        //
        document.addEventListener(...grabEvent);
        document.addEventListener("pointerup", ()=>{
            document.removeEventListener(...grabEvent);
        }, {once: true});
    }

    //
    const placeElement = async ({pointer, holding})=>{
        dragState.pointerId = -1;
        
        //
        const iconElement = holding.element.deref();
        const iconId      = iconElement.dataset["id"];
        const iconItem    = {...iconItems.get(iconId)}; // avoid force update
        const gridPage    = gridPages.get(currentPage);
        const iconList  = [...dragBucket, ...(iconLists.get(currentPage) || [])];
        const args        = makeArgs(iconItem, iconItems, gridPage, columnsAndRows, iconLists, iconList);

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
        iconLists.set(currentPage, iconList);
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
        
        //
        mainElement.addEventListener("dragenter", (ev)=>{
            ev.preventDefault();
        });
        
        //
        mainElement.addEventListener("dragover", (ev)=>{
            ev.preventDefault();
        });
        
        //
        mainElement.addEventListener("drop", (ev)=>{
            ev.preventDefault();
            const {dataTransfer} = ev;
            const file = dataTransfer?.files?.[0];
            if (file != null) {
                const wallpaper = document.querySelector("canvas[is=\"w-canvas\"]");
                wallpaper?.["$useImageAsSource"]?.(file);
            }
        });
    });

</script>

<script context="module">
    import { propsFilter } from "@libs/svelte/propsFilter.mjs";
</script>

<!-- -->
<canvas is="w-canvas" class="stretch fixed inset-0" data-src={(localStorage.getItem("@wallpaper") || "../assets/wallpaper/0.jpg")}/>

<!-- -->
<div bind:this={mainElement} data-ctx="grid" class="ls-grid-mp layer-2 stretch grid-based-box fixed-avail relative pe-enable" style="touch-action: none; isolation: isolate;" {...propsFilter($$props)}>
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

