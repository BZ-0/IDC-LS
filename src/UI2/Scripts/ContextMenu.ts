

//
import {writable} from "svelte/store";

//
import {zoomOf} from "@unite/scripts/utils/Utils.ts";
import { MOC } from "@unite/scripts/utils/Utils.ts";
import States from "@unite/scripts/reactive/StateManager.ts"

//
export default async ()=>{
    const settings = States.getState("settings");
    const actionMap = States.getState("actionMap");

    //
    const initiators = new Map<string, HTMLElement>();
    const hideAllCtx = ()=>{
        initiators.clear();
        document.querySelectorAll(".ux-context-menu").forEach((el)=>{
            el.dataset.hidden = true;
        });
    }

    //
    document.documentElement.addEventListener("contextmenu", (ev)=>{
        const target = ev.target as HTMLElement;

        //
        ev.stopPropagation();
        ev.preventDefault();

        //
        hideAllCtx();

        //
        if (target.matches("*[data-ctx]")) {
            const ctxName = target.dataset.ctx;
            initiators.set(ctxName, target);

            //
            requestAnimationFrame(()=>{
                const ctxMenu: HTMLElement | null = document.querySelector(".ux-context-menu[data-ctx-name=\""+ctxName+"\"]");
                if (ctxMenu) {
                    ctxMenu.dataset.hidden = false;
                    ctxMenu.style.setProperty("--click-x", (ev.clientX / zoomOf()) as unknown as string, "");
                    ctxMenu.style.setProperty("--click-y", (ev.clientY / zoomOf()) as unknown as string, "");
                }
            })
        }
    }, {capture: true});

    //
    document.documentElement.addEventListener("contextmenu", (ev)=>{
        const target = ev.target as HTMLElement;
        if ((target?.matches?.(".ux-modal-frame") || target?.closest?.(".ux-modal-frame")) && !target.matches("input[type=\"text\"]")) {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            ev.preventDefault();
        }
    }, {capture: true});

    //
    const onClick = (ev)=>{
        const target = ev.target as HTMLElement;

        //
        const initiator = initiators.get(target.closest(".ux-context-menu").dataset.ctxName);
        actionMap?.get?.(target.dataset.action as string)?.({
            initiator
        });

        //
        hideAllCtx();
    }

    //
    document.addEventListener("click", (ev)=>{
        const target = ev.target as HTMLElement;

        //
        if (target.matches(".ux-context-menu *[data-action]")) {
            onClick(ev);
        }

        //
        if (!MOC(target, ".ux-context-menu[data-ctx-name]") || target.matches("*[data-action]")) {
            requestAnimationFrame(()=>{
                hideAllCtx();
            });
        }
    });
}