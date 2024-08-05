import { observeBySelector } from "@unite/scripts/dom/Observer.ts";
import "@idc/State/CurrentState.ts";
import stateMap from "@unite/scripts/reactive/StateManager.ts";

//
export default async ()=>{

    //
    const onChange = (ev)=>{
        const input  = ev.target;
        const target = input.closest(".ui-input");
        const state  = stateMap.get(target?.dataset?.state);

        //
        if (state) {
            if (input.matches("input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])")) {
                state[target.dataset.name] = input.valueAsNumber ?? input.value;
            }

            //
            if (input?.matches(".ui-shape input[type=\"radio\"]:checked")) {
                state[target.dataset.name] = input.value;
            }
        }
    };

    //
    document.documentElement.addEventListener("input", onChange);
    document.documentElement.addEventListener("change", onChange);

    //
    observeBySelector(document.documentElement, ".ui-input", (mutations)=>{
        mutations.addedNodes.forEach((target)=>{
            const input = target.querySelector("input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])");
            const state = stateMap.get(target?.dataset?.state);
            if (state && input) {
                input.value = state[target?.dataset?.name];
                input.dispatchEvent(new Event("change", { bubbles: false, cancelable: true, }))
            }
        });
    });
}
