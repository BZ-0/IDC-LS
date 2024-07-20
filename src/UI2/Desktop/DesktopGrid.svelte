<script lang="ts" type="ts" context="module">
    import {observeBySelector, observeBorderBox} from "@unite/scripts/dom/Observer.ts";
    import {grabForDrag} from "@unite/scripts/interact/PointerAPI.ts";
    import {createReactiveSet} from "@unite/scripts/reactive/ReactiveSet.ts";
    import {MOC, zoomOf} from "@unite/scripts/utils/Utils.ts";
    import {putToCell} from "@unite/scripts/utils/GridItemUtils.ts";
    import type {GridItemType} from "@unite/scripts/utils/GridItemUtils.ts";
    import {animationSequence} from "@unite/scripts/stylework/GridLayout.ts";
    import States from "@unite/scripts/reactive/StateManager.ts"

    //
    let current = "main";
    let state: GridsStateType | null = null;

    //
    observeBySelector(document.documentElement, ".ux-desktop-grid", ({addedNodes})=>{
        const target = addedNodes[0];
        requestAnimationFrame(()=>{
            state ||= States.getState(target);
        });
    });

    //
    const initGrab = (ev)=> {
        ev?.stopPropagation?.();
        if (ev.target?.dataset?.id) {
            const item = state.items?.get(ev.target.dataset.id);
            if (item) { item.pointerId = ev.pointerId; }

            //
            const el = ev.target;
            el.style.setProperty("--cell-x", item?.cell[0] || 0, "");
            el.style.setProperty("--cell-y", item?.cell[1] || 0, "");
            el.style.setProperty("--p-cell-x", item?.cell[0] || 0, "");
            el.style.setProperty("--p-cell-y", item?.cell[1] || 0, "");

            //
            grabForDrag(el, item);
        }
    }

    //
    const grabItem = (ev)=>{
        //
        const dragState = {
            pointerId: ev.pointerId,
            startX: ev.clientX / zoomOf(),
            startY: ev.clientY / zoomOf()
        };

        //
        const grabEvent: ["pointermove", (e: PointerEvent)=>any, AddEventListenerOptions] = ["pointermove", (evm: PointerEvent)=>{
            if (dragState.pointerId == evm.pointerId && Math.hypot(
                dragState.startX - (evm.clientX / zoomOf()), 
                dragState.startY - (evm.clientY / zoomOf())
            ) >= 10) {
                initGrab(ev); document.documentElement.removeEventListener(...grabEvent);
            }
        }, {capture: true, passive: true}];

        //
        document.documentElement.addEventListener(...grabEvent);
        document.documentElement.addEventListener("pointerup", ()=>{
            document.documentElement.removeEventListener(...grabEvent);
        }, {once: true});
    }

    //
    document.documentElement.addEventListener("long-press", (ev)=>{
        if (MOC(ev.target, ".ux-grid-item[data-type=\"items\"]")) {
            grabItem(ev.detail);
        }
    });

    //
    const placeElement = async ({pointer, holding})=>{
        const el = holding.element.deref();
        const id = el.dataset.id;
        
        //
        const bbox = el.closest(".ux-grid-page").getBoundingClientRect();
        const xy: [number, number] = [pointer.current[0] - (bbox?.left || 0), pointer.current[1] - (bbox?.top || 0)];
        
        //
        const prev = [...(state.items?.get?.(id)?.cell || [0, 0])];
        const item: GridItemType = state.items?.get(id) as unknown as GridItemType;
        const page: GridPageType = state.grids?.get(current) as unknown as GridPageType;

        //
        if (state.items) { putToCell({ items: state.items, item, page }, xy); }
        if (item) { item.pointerId = -1; }
        
        //
        el.style.setProperty("--p-cell-x", prev[0], "");
        el.style.setProperty("--p-cell-y", prev[1], "");
        el.style.setProperty("--cell-x", (item?.cell?.[0] || 0) as unknown as string, "");
        el.style.setProperty("--cell-y", (item?.cell?.[1] || 0) as unknown as string, "");
        
        //
        await el.animate(animationSequence(), {
            fill: "none",
            duration: 150,
            rangeStart: "cover 0%",
            rangeEnd: "cover 100%",
        }).finished;

        //
        el.style.setProperty("--drag-x", 0, "");
        el.style.setProperty("--drag-y", 0, "");
        
        //
        if (!state.lists?.get?.(current)?.has?.(id)) {
            const oldList = Array.from(state.lists?.values()||[]).find((L)=>{
                return L.has(id);
            });
            
            //
            if (oldList) {
                oldList.delete(id);
                state.lists?.get?.(current)?.add?.(id);
                
                // trigger re-draw
                state.lists = lists;
                state.items = items;
            }
        }

        // trigger icon state change (localStorage)
        if (item) state.items?.set?.(id, item);
    }

    //
    document.addEventListener("m-dragend", (ev)=>{
        if (MOC(ev.target, ".ux-grid-item[data-type=\"items\"]")) {
            placeElement(ev.detail);
        }
    });
</script>

<script lang="ts" type="ts">
    import { onMount } from "svelte";
    //import States from "@unite/state/StateManager.ts"
    import { makeReactiveObject } from "@unite/scripts/reactive/ReactiveObject.ts";

    //
    import GridPage from "./GridPage.svelte";
    import { getCorrectOrientation } from "@unite/scripts/utils/Utils.ts";

    //
    export let state = null;

    //
    let settings = States.getState("settings");
    let actionMap = States.getState("actionMap");

    //
    //state = States.getState("desktop");
    let lists = state?.lists;
    let grids = state?.grids;
    let items = state?.items;

    //
    let gridPage = null;
    let target = null;
    let columns = settings?.columns || 4, rows = settings?.rows || 8;
    let current = "main";

    //
    const changeLayout = ()=>{
        target?.style?.setProperty?.("--columns", columns as unknown as string, "")
        target?.style?.setProperty?.("--rows", rows as unknown as string, "")
    }

    //
    settings?.["@subscribe"]?.((value, prop)=>{
        if (prop == "columns") { columns = value; };
        if (prop == "rows") { rows = value; };
        changeLayout();
    });

    //
    onMount(()=>{
        //
        States.bindState(target, state, ()=>{
            grids = state?.grids;
            items = state?.items;
            lists = state?.lists;
        }).stateBehave(target, (element, prop, value)=>{
            if (prop == "grids") grids = state?.grids;
            if (prop == "items") items = state?.items;
            if (prop == "lists") lists = state?.lists;
        });

        //
        changeLayout();
        
        //
        observeBorderBox(gridPage, (box)=>{
            const idc = 0;

            //
            Array.from(grids.values()).map((g)=>{
                g.size = [box.inlineSize, box.blockSize];
            });

            //
            gridPage?.style?.setProperty?.(["--grid-w", "--grid-h"][idc], box.inlineSize as unknown as string, "")
            gridPage?.style?.setProperty?.(["--grid-h", "--grid-w"][idc], box.blockSize as unknown as string, "")
        })

        //
        target?.addEventListener("dragenter", (ev)=>{
            if (document.elementFromPoint(ev.clientX, ev.clientY)?.matches?.(".ux-grid-desktop, canvas[is=\"w-canvas\"]")) {
                ev.preventDefault();
            }
        });
        
        //
        target?.addEventListener("dragover", (ev)=>{
            if (document.elementFromPoint(ev.clientX, ev.clientY)?.matches?.(".ux-grid-desktop, canvas[is=\"w-canvas\"]")) {
                ev.preventDefault();
            }
        });
        
        //
        target?.addEventListener("drop", (ev)=>{
            if (document.elementFromPoint(ev.clientX, ev.clientY)?.matches?.(".ux-grid-desktop, canvas[is=\"w-canvas\"]")) {
                ev.preventDefault();
                
                //
                const {dataTransfer} = ev;
                const file = dataTransfer?.files?.[0];
                if (file != null) {
                    const wallpaper = document.querySelector("canvas[is=\"w-canvas\"]");
                    wallpaper?.["$useImageAsSource"]?.(file);
                }
            }
        });

    });

</script>

<!-- -->
<div bind:this={target} data-transparent data-current-page={current} data-ctx="grid-space" data-scheme="accent-inverse" class="ux-desktop-grid stretch grid-based-box pe-enable">
    
    <div bind:this={gridPage} class="ux-grid-page stretch grid-based-box" data-transparent>
        <GridPage list={lists.get(current)} gridPage={grids.get(current)} items={items} type="labels"></GridPage>
        <GridPage list={lists.get(current)} gridPage={grids.get(current)} items={items} actionMap={actionMap} type="items"></GridPage>
    </div>
    
</div>

