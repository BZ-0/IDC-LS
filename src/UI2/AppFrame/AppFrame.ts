//
import { MOCElement } from "@unite/scripts/utils/Utils.ts";
import AxGesture from "@unite/scripts/interact/Gesture.ts";
import { observeBySelector } from "@unite/scripts/dom/Observer.ts";
import { zoomOf } from "../../../unite/scripts/utils/Utils.ts";

//
document.documentElement.addEventListener("contextmenu", (ev)=>{
    const target = ev.target as HTMLElement;
    if ((target?.matches?.(".ux-app-frame") || target?.closest?.(".ux-app-frame")) && !target.matches("input[type=\"text\"]")) {
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        ev.preventDefault();
    }
}, {capture: true});

//
document.documentElement.addEventListener("click", (ev)=>{
    const target = ev.target as HTMLElement;
    
    //
    if (target.matches(".ux-app-frame *:not(.back-button, .menu-button)")) {
        //ev.stopPropagation();
        //ev.stopImmediatePropagation();
        //ev.preventDefault();
        
        //
        //if (windowManager) {
            //windowManager?.focusTask?.("#" + MOCElement(target, ".ux-app-frame")?.querySelector(".ux-content")?.id||"");
        //}
    }
    
    //
    if (target.matches(".ux-app-frame .menu-button")) {
        // kuril i umer
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        ev.preventDefault();
        
        //
        const content = MOCElement(target, ".ux-app-frame")?.querySelector?.(".ux-content");
        if (content) {
            const event = new CustomEvent("ux-menu", {
                cancelable: true,
                bubbles: true,
                detail: {}
            });
            content.dispatchEvent(event);
        }
    }
    
    //
    if (target.matches(".ux-app-frame .back-button")) {
        // kuril i umer
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        ev.preventDefault();
        
        //
        const content = MOCElement(target, ".ux-app-frame")?.querySelector?.(".ux-content");
        if (content) {
            const event = new CustomEvent("ux-back", {
                cancelable: true,
                bubbles: true,
                detail: {}
            });
            
            //
            if (content.dispatchEvent(event)) {
                //if (windowManager) {
                    //windowManager?.minimizeTask?.("#" + content.id);
                //} else {
                    history.back();
                //}
            }
        }
    }
    
})

//
const makeControl = (frameElement)=>{
    let gestureControl: AxGesture | null = null;
    if (frameElement && !frameElement["@control"]) {
        gestureControl = new AxGesture(frameElement);
        frameElement["@control"] = gestureControl;
        
        //
        gestureControl.draggable({
            handler: frameElement.querySelector(".ux-title-handle")
        });
        
        //
        gestureControl.resizable({
            handler: frameElement.querySelector(".ux-resize")
        });
    }

    //
    if (frameElement) {
        // @ts-ignore
        frameElement.style.setProperty("--drag-x", -(Math.max(frameElement.clientWidth, (64*16 * zoomOf())) / 2) + frameElement.parentNode.offsetWidth / 2, "");
        
        // @ts-ignore
        frameElement.style.setProperty("--drag-y", -(Math.max(frameElement.clientHeight, (36*16 * zoomOf())) / 2) + frameElement.parentNode.offsetHeight / 2, "");
    }
}

//
observeBySelector(document.body, ".ux-app-frame", ({addedNodes})=>{
    makeControl(addedNodes[0]);
});
