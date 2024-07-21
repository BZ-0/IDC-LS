import { observeBySelector } from "@unite/scripts/dom/Observer.ts";

//
const computed = Symbol("@computed");
const animateHide = async (target)=>{
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && !target.classList.contains("ux-while-animation")) {
        target.classList.add("ux-while-animation");
    }

    //
    if (target.classList.contains("ux-while-animation")) {
        target[computed] = getComputedStyle(target, "");
        await target.animate([
            {
                easing: "linear",
                offset: 0,

                //
                display: target[computed]?.display || "revert",
                opacity: target[computed]?.opacity || "revert",
                scale: target[computed]?.scale || "revert",
                pointerEvents: "none"
            },
            {
                easing: "linear",
                offset: 0.99,

                //
                display: target[computed]?.display || "revert",
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
            fill: "none",
            duration: 100,
            rangeStart: "cover 0%",
            rangeEnd: "cover 100%",
        }).finished;

        //
        target.classList.remove("ux-while-animation");
    }
}

//
const animateShow = async (target)=>{
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && !target.classList.contains("ux-while-animation")) {
        target.classList.add("ux-while-animation");
    }

    //
    if (target.classList.contains("ux-while-animation")) {
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
                display: target[computed]?.display || "revert",
                opacity: 0,
                scale: 0.8,
                pointerEvents: "none"
            },
            {
                easing: "linear",
                offset: 1,

                //
                display: target[computed]?.display || "revert",
                opacity: target[computed]?.opacity || "revert",
                scale: target[computed]?.scale || "revert",
                pointerEvents: target[computed]?.pointerEvents || "revert"
            }
        ], {
            fill: "none",
            duration: 100,
            rangeStart: "cover 0%",
            rangeEnd: "cover 100%",
        }).finished;

        //
        target.classList.remove("ux-while-animation");
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
