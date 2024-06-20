export const longpress = (node, threshold = 200) => {
    const handle_mousedown = (ev) => {
        const pointerId = ev.pointerId;
        let start = Date.now();
        let begin = [ev.pageX, ev.pageY];

        //
        const timeout = setTimeout(() => {
            node.dispatchEvent(new CustomEvent('longpress', {detail: ev}));
        }, threshold);

        //
        const cancel = (ev) => {
            if (ev?.pointerId == pointerId || ev?.pointerId == null) {
                clearTimeout(timeout);
                node.removeEventListener('pointermove', shifted)
                node.removeEventListener('pointerup', cancel);
            }
        }

        //
        const shifted = (ev)=>{
            if (Math.hypot(begin[0]-ev.pageX, begin[1]-ev.pageY) > 10) { cancel(ev); }
        }

        //
        node.addEventListener('pointermove', shifted);
        node.addEventListener('pointerup', cancel);
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