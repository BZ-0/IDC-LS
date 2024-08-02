import { settings } from "@idc/State/CurrentState.ts";

//
export default async ()=>{

    //
    document.documentElement.addEventListener("change", (ev)=>{
        const radio = ev.target;
        if (radio?.matches(".ui-shape input[type=\"radio\"]:checked")) {
            settings.iconShape = radio.value;
        }
    });

};
