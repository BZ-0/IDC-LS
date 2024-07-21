import {MOC, MOCElement} from "@unite/scripts/utils/Utils.ts";
import States from "@unite/scripts/reactive/StateManager.ts";
const UIState = States.getState("UIState");

//
const appId = "#control-center";

//
document.documentElement.addEventListener("click", (ev)=>{
    const {target} = ev;
    const controlEl = ev.target.closest(".ux-content");
    
    //
    if (target.matches(appId + " .ls-tab-item")) {
        const _ = target.dataset.page || "";
        if (UIState.controlCenterPage != _) { 
            UIState.controlCenterPage = _;
        };
        
        // unable to switch without hiding
        if (controlEl?.clientWidth <= 96 * 9) {
            UIState.controlCenterPanelOpen = false;
        }
    } else 
    
    // just hide panel when clicking to nothing
    if (MOC(target, appId) ? !MOC(target, ".ls-panel") : true) {
        UIState.controlCenterPanelOpen = false;
    }
})

//
document.documentElement?.addEventListener?.("ux-menu", (ev)=>{
    if (ev.target.closest(appId)) {
        UIState.controlCenterPanelOpen = !UIState.controlCenterPanelOpen; 
    }
});

//
document.documentElement?.addEventListener?.("ux-back", (ev)=>{
    
});
