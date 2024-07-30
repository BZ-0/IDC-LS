import {MOC, MOCElement} from "@unite/scripts/utils/Utils.ts";
import States from "@unite/scripts/reactive/StateManager.ts";

//
export default async ()=>{
    //
    const appId = "#control-center";

    //
    document.documentElement.addEventListener("click", (ev)=>{
        const {target} = ev;
        const controlEl = ev.target.closest(".ui-content");
        const UIState = States.getState("UIState");

        //
        if (target.matches(appId + " .ui-tab-item")) {
            const _ = target.dataset.page || "";
            if (UIState.controlCenterPage != _) {
                UIState.controlCenterPage = _;
            };

            // unable to switch without hiding
            if (controlEl?.offsetWidth <= 96 * 9) {
                UIState.controlCenterPanelOpen = false;
            }
        } else

        // just hide panel when clicking to nothing
        if (MOC(target, appId) ? !MOC(target, ".ui-panel") : true && UIState) {
            UIState.controlCenterPanelOpen = false;
        }
    })

    //
    document.documentElement?.addEventListener?.("ui-menu", (ev)=>{
        if (ev.target.closest(appId)) {
            const UIState = States.getState("UIState");
            UIState.controlCenterPanelOpen = !UIState.controlCenterPanelOpen;
        }
    });

    //
    document.documentElement?.addEventListener?.("ui-back", (ev)=>{

    });
}