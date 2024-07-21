import { observeBySelector } from "@unite/scripts/dom/Observer.ts";

//
const animateHide = async (target)=>{
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && !target.classList.contains("ux-display-animated")) {
        target.classList.add("ux-display-animated");
    }

    if (target.classList.contains("ux-display-animated")) {
        //
        await target.animate([
            {
                easing: "linear",
                offset: 0,

                //
                display: "unset",
                opacity: "unset",
                scale: "unset",
                pointerEvents: "none"
            },
            {
                easing: "linear",
                offset: 0.99,

                //
                display: "unset",
                opacity: 0,
                scale: 0.8,
                pointerEvents: "none"
            },
            {
                easing: "linear",
                offset: 1,

                //
                display: "none",
                opacity: 0,
                scale: 0.8,
                pointerEvents: "none"
            }
        ],  {
            fill: "forwards",
            duration: 100,
            rangeStart: "cover 0%",
            rangeEnd: "cover 100%",
        }).finished;
    }
}

//
const animateShow = async (target)=>{
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && !target.classList.contains("ux-display-animated")) {
        target.classList.add("ux-display-animated");
    }

    if (target.classList.contains("ux-display-animated")) {

        //
        await target.animate([
            {
                easing: "linear",
                offset: 0,

                //
                display: "none",
                opacity: 0,
                scale: 0.8,
                pointerEvents: "none"
            },
            {
                easing: "linear",
                offset: 0.01,

                //
                display: "unset",
                opacity: 0,
                scale: 0.8,
                pointerEvents: "none"
            },
            {
                easing: "linear",
                offset: 1,

                //
                display: "unset",
                opacity: "unset",
                scale: "unset",
                pointerEvents: "unset"
            }
        ], {
            fill: "forwards",
            duration: 100,
            rangeStart: "cover 0%",
            rangeEnd: "cover 100%",
        }).finished;

    }
}

//
const observed = new WeakSet();
const observer = new MutationObserver((mutations)=>{
    mutations.forEach((mutation)=>{
        if (mutation.type == 'attributes' && mutation.attributeName == 'data-hidden') {
            const target = mutation.target;

            //
            if (target.dataset.hidden != mutation.oldValue) {
                if ((target.dataset.hidden && target.dataset.hidden != "false")) {
                    animateHide(target);
                } else {
                    animateShow(target);
                }
            }
        }
    });
});

//
observeBySelector(document.documentElement, "*[data-hidden]", ({addedNodes})=>{

    //
    addedNodes.forEach((node)=>{
        if (!observed.has(node)) {
            observer.observe(node, { attributes: true, attributeOldValue : true });
            observed.add(node);
        }
    });

});
