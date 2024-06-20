<script>
	import { get, writable } from 'svelte/store';

	//
	import IconItem from "./IconItem.svelte";
	import IconGrid from "./IconGrid.svelte";
	import IconLabel from "./IconLabel.svelte";
	import { fade } from 'svelte/transition';
	import { swipe } from 'svelte-gestures';

	//
	import { settings, gridState, makeMap } from "./helpers/gridState.mjs";
	import { animationSequence, makeArgs, putToCell } from "./helpers/gridItem.mjs"
	import { onMount } from "svelte";

	//
	import { grabForDrag } from "../../libraries/js/orion/pointer-api.mjs"

	//
	export let dragBucket = [];
	export let currentPage = "home-page";
	export let mainElement = null;
	export let columnsAndRows = [8, 4];

	//
	settings.columns.subscribe((v)=>(columnsAndRows = [v,columnsAndRows[1]]));
	settings.rows.subscribe((v)=>(columnsAndRows = [columnsAndRows[0], v]));

	//
	let iconItems = new Map([]);
	let gridPages = new Map([]);
	let gridPagesArray = [];

	//
	gridState.iconItems.subscribe((v)=>{ iconItems = makeMap(v) })
	gridState.gridPages.subscribe((v)=>{ gridPages = makeMap(v); gridPagesArray = v; })

	//
	const updateIcons = ()=>{ gridState.iconItems.set(Array.from(iconItems.values())); }
	const updateGrids = ()=>{ gridState.gridPages.set(Array.from(gridPages.values())); }

	//
	const grabItem = (ev)=>{
		//document.addEventListener("pointermove", ()=>{
			const iconElement = ev.target.closest(".icon-item");
			const iconId      = iconElement.dataset["id"];
			const iconItem    = iconItems.get(iconId);
			const gridPage    = gridPages.get(currentPage);
	
			//
			iconItem.pCellX = iconItem.cellX;
			iconItem.pCellY = iconItem.cellY;
			iconItem.pointerId = ev.pointerId;
	
			//
			const argObj = makeArgs(iconItem, iconItems, gridPage, columnsAndRows);
	
			//iconId
			gridPage.iconList = gridPage.iconList.filter((id)=>(id!=iconId));
			dragBucket = [...dragBucket, iconId];
	
			//
			updateGrids();
		//}, {once: true, capture: true, passive: true});
	}

	//
	const placeElement = async ({pointer, holding})=>{
		const iconElement = holding.element.deref();
		const iconId      = iconElement.dataset["id"];
		const iconItem    = {...iconItems.get(iconId)}; // avoid force update
		const gridPage    = gridPages.get(currentPage);
		const args        = makeArgs(iconItem, iconItems, gridPage, columnsAndRows);

		//
		const bbox = args.gridPage.getBoundingClientRect();
		const xy   = [pointer.current[0] - bbox.left, pointer.current[1] - bbox.top];

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
		iconItems.set(iconId, iconItem);

		//
		dragBucket = dragBucket.filter((id)=>(id!=iconId));
		gridPage.iconList = [...gridPage.iconList, iconId];
		
		//
		updateGrids();
		updateIcons();
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


<div bind:this={mainElement} class="layer-2 stretch grid-based-box fixed-avail relative">
	
	{#each gridPagesArray as page}
		{#if currentPage==page.id}
			<div class="layered grid-based-box" type={page.type} visible={currentPage==page.id}
				transition:fade={{ delay: 0, duration: 200 }}>

				<IconGrid id={page.id} type="labels" columns={columnsAndRows[0]} rows={columnsAndRows[1]}>
					{@const iconList = page.iconList}
					{#each iconList as iconId}
						{@const iconItem = iconItems.get(iconId)}
						{#if iconItem && iconItem.id}
							<IconLabel iconItem={iconItem}></IconLabel>
						{/if}
					{/each}
				</IconGrid>

				<IconGrid id={page.id} type="icons" columns={columnsAndRows[0]} rows={columnsAndRows[1]}>
					{@const iconList = page.iconList}
					{#each iconList as iconId}
						{@const iconItem = iconItems.get(iconId)}
						{#if iconItem && iconItem.id}
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

</div>

