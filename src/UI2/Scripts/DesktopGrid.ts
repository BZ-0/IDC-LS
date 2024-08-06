import {observeBySelector, observeBorderBox} from "@unite/scripts/dom/Observer.ts";
import {grabForDrag} from "@unite/scripts/interact/PointerAPI.ts";
import {MOC} from "@unite/scripts/utils/Utils.ts";
import {zoomOf} from "@unite/scripts/utils/Zoom.ts";
import {redirectCell} from "@unite/scripts/utils/GridItemUtils.ts";
import type {GridItemType} from "@unite/scripts/utils/GridItemUtils.ts";
import {animationSequence} from "@unite/scripts/stylework/GridLayout.ts";
import stateMap from "@unite/scripts/reactive/StateManager.ts"
import {
    absoluteCXToRelativeCX,
    relativeToAbsoluteInPx,
    convertOrientPxToCX,
    absolutePxToRelativeInOrientPx,
    convertPointerPxToOrientPx,
    floorInCX
} from "@unite/scripts/utils/GridItemUtils.ts";

//
export default async ()=>{

    //
    const initGrab = (target, pointerId = -1)=> {
        const state = stateMap.get(target.closest(".ui-desktop-grid"));

        //
        if (target?.dataset?.id) {
            const item = state?.items?.get(target.dataset.id);
            if (item) { item.pointerId = pointerId; }

            //
            const el = target;
            if (item) {
                grabForDrag(el, item);
            }
        }
    }

    //
    const grabItem = (ev, ptr)=>{
        //
        const dragState = {
            pointerId: ptr.pointerId,
            startX: ptr.clientX,
            startY: ptr.clientY
        };

        //
        const grabEvent: ["pointermove", (e: PointerEvent)=>any, AddEventListenerOptions] = ["pointermove", (evm: PointerEvent)=>{
            if (dragState.pointerId == evm.pointerId && Math.hypot(
                dragState.startX - evm.clientX,
                dragState.startY - evm.clientY
            ) >= 10) {
                //ev?.stopPropagation?.();
                initGrab(ev.target, ptr.pointerId);
                document.documentElement.removeEventListener(...grabEvent);
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
            grabItem(ev, ev.detail);
        }
    });

    //
    const placeElement = async ({pointer, holding})=>{
        const el = holding.element.deref();
        const id = el.dataset.id;
        const tx = el.closest(".ui-desktop-grid").querySelector("*[data-type=\"labels\"][data-id=\""+id+"\"]");

        //
        const state = stateMap.get(el.closest(".ui-desktop-grid"));
        const current = "main"; //TODO! bind `current` with state.

        //
        const shift = [
            parseFloat(el.style.getPropertyValue("--c-shift-mod")),
            parseFloat(el.style.getPropertyValue("--r-shift-mod")),
        ];

        //
        const prev = [...(state.items?.get?.(id)?.cell || [0, 0])];
        const item: GridItemType = state.items?.get(id) as unknown as GridItemType;
        const page: GridPageType = state.grids?.get(current) as unknown as GridPageType;

        //
        const cur = [...(item.cell || [0, 0])];
        const com = { items: state.items, item, page };
        const xy: [number, number] = floorInCX([cur[0] + shift[0], cur[1] + shift[1]], com);

        //
        el.style.setProperty("--cell-x", xy[0], "");
        el.style.setProperty("--cell-y", xy[1], "");

        //
        if (state.items) { redirectCell(xy, com); }
        if (item) { item.pointerId = -1; }

        //
        await el.animate(animationSequence(), {
            fill: "none",
            duration: 150,
            easing: "linear"
            //rangeStart: "cover 0%",
            //rangeEnd: "cover 100%",
        }).finished;

        //
        el.style.setProperty("--p-cell-x", xy[0], "");
        el.style.setProperty("--p-cell-y", xy[1], "");
        el.style.setProperty("--c-shift-mod", 0, "");
        el.style.setProperty("--r-shift-mod", 0, "");
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
            }
        }

        // trigger icon state change (localStorage)
        if (item) state.items?.set?.(id, item);
    }

    //
    document.addEventListener("m-dragstart", (ev)=>{
        if (MOC(ev.target, ".ux-grid-item[data-type=\"items\"]")) {
            const current = "main"; //TODO! bind `current` with state.
            const state = stateMap.get(ev.target.closest(".ui-desktop-grid"));
            const id = ev.target.dataset.id;
            const item: GridItemType = state.items?.get(id) as unknown as GridItemType;
            const page: GridPageType = state.grids?.get(current) as unknown as GridPageType;
            const com = { items: state.items, item, page };
            item.cell = floorInCX(item.cell, com);

            //
            ev.target.style.setProperty("--p-cell-x", ev.target.style.getPropertyValue("--cell-x"));
            ev.target.style.setProperty("--p-cell-y", ev.target.style.getPropertyValue("--cell-y"));
        }
    });

    //
    document.addEventListener("m-dragend", (ev)=>{
        if (MOC(ev.target, ".ux-grid-item[data-type=\"items\"]")) {
            placeElement(ev.detail);
        }
    });

    //
    document.addEventListener("m-dragging", (ev)=>{
        if (ev.target.matches(".ux-grid-item")) {
            const el = ev.target;
            const id = el.dataset.id;

            //
            const current = "main"; //TODO! bind `current` with state.
            const state = stateMap.get(el.closest(".ui-desktop-grid"));
            const item: GridItemType = state.items?.get(id) as unknown as GridItemType;
            const page: GridPageType = state.grids?.get(current) as unknown as GridPageType;

            //
            const {detail, target} = ev;
            const {modified} = detail.holding;
            const pack = { items: state.items, item, page };
            const absolute = relativeToAbsoluteInPx([modified[0] / zoomOf(), modified[1] / zoomOf()], pack);
            const orient = convertPointerPxToOrientPx(absolute, pack);
            const CXa = convertOrientPxToCX(orient, pack);
            const cx = absoluteCXToRelativeCX(CXa, pack);

            //
            target.style.setProperty("--c-shift-mod", cx[0]);
            target.style.setProperty("--r-shift-mod", cx[1]);
        }
    });


};
