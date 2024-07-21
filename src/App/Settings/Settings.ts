import { observeBySelector } from "@unite/scripts/dom/Observer.ts";
import States from "@unite/scripts/reactive/StateManager.ts";

//
const onChange = (ev)=>{
    const input = ev.target;

    //
    const target = input.closest(".ux-input");
    const state = States.getState(target.dataset.state);
    state[target.dataset.name] = input.valueAsNumber ?? input.value;
};

//
document.documentElement.addEventListener("input", onChange);
document.documentElement.addEventListener("change", onChange);

//
observeBySelector(document.documentElement, ".ux-input", (mutations)=>{
    mutations.addedNodes.map((target)=>{
        const input = target.querySelector("input");
        const state = States.getState(target.dataset.state);
        input.value = state[target.dataset.name];
        input.dispatchEvent(new Event("change", { bubbles: false, cancelable: true, }))
    });
});
