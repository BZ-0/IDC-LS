export const longpress = (node, threshold = 100) => {
    const handle_mousedown = (ev) => {
        const scaling =
            parseFloat(document.body.style.getPropertyValue("--scaling")) || 1;

        //
        const pointerId = ev.pointerId;
        let start = Date.now();
        let begin = [ev.pageX / scaling, ev.pageY / scaling];

        //
        const timeout = setTimeout(() => {
            node.dispatchEvent(new CustomEvent("longpress", { detail: ev }));
        }, threshold);

        //
        const cancel = (ev) => {
            if (ev?.pointerId == pointerId || ev?.pointerId == null) {
                clearTimeout(timeout);
                document.removeEventListener("pointermove", shifted);
                document.removeEventListener("pointerup", cancel);
            }
        };

        //
        const shifted = (ev) => {
            const scaling =
                parseFloat(document.body.style.getPropertyValue("--scaling")) ||
                1;
            if (
                pointerId == ev.pointerId && 
                Math.hypot(
                    begin[0] - ev.pageX / scaling,
                    begin[1] - ev.pageY / scaling
                ) > 10
            ) {
                cancel(ev);
            }
        };

        //
        document.addEventListener('pointermove', shifted);
        document.addEventListener('pointerup', cancel);
        document.addEventListener('pointercancel', cancel);
    }
    
    //
    node.addEventListener('pointerdown', handle_mousedown);
    
    //
    return {
        destroy() {
            node.removeEventListener('pointerdown', handle_mousedown);
        }
    };
}