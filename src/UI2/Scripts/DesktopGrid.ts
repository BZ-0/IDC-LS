import {observeBySelector, observeBorderBox} from "@unite/scripts/dom/Observer.ts";
import {grabForDrag} from "@unite/scripts/interact/PointerAPI.ts";
import {createReactiveSet} from "@unite/scripts/reactive/ReactiveLib.ts";
import {MOC, zoomOf} from "@unite/scripts/utils/Utils.ts";
import {putToCell} from "@unite/scripts/utils/GridItemUtils.ts";
import type {GridItemType} from "@unite/scripts/utils/GridItemUtils.ts";
import {animationSequence} from "@unite/scripts/stylework/GridLayout.ts";
import States from "@unite/scripts/reactive/StateManager.ts"

//
export default async ()=>{

    //
    const initGrab = (ev)=> {
        ev?.stopPropagation?.();

        //
        const state = States.getState(ev.target.closest(".ux-desktop-grid"));

        //
        if (ev.target?.dataset?.id) {
            const item = state?.items?.get(ev.target.dataset.id);
            if (item) { item.pointerId = ev.pointerId; }

            //
            const el = ev.target;
            if (item) {
                //el.style.setProperty("--cell-x", item?.cell[0] || 0, "");
                //el.style.setProperty("--cell-y", item?.cell[1] || 0, "");
                el.style.setProperty("--p-cell-x", item?.cell[0] || 0, "");
                el.style.setProperty("--p-cell-y", item?.cell[1] || 0, "");
                grabForDrag(el, item);
            }
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
        const tx = el.closest(".ux-desktop-grid").querySelector("*[data-type=\"labels\"][data-id=\""+id+"\"]");

        //
        const state = States.getState(el.closest(".ux-desktop-grid"));
        const current = "main"; //TODO! bind `current` with state.

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
        //el.style.setProperty("--cell-x", (item?.cell?.[0] || 0) as unknown as string, "");
        //el.style.setProperty("--cell-y", (item?.cell?.[1] || 0) as unknown as string, "");

        //
        //tx.style.setProperty("--cell-x", (item?.cell?.[0] || 0) as unknown as string, "");
        //tx.style.setProperty("--cell-y", (item?.cell?.[1] || 0) as unknown as string, "");

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

};