
class PointerEdge {
    constructor(pointer) {
        this.pointer = pointer;
        this.results = {
            left: false,
            top: false,
            bottom: false,
            right: false
        }
    }

    get left() {
        const current = Math.abs(this.pointer[0] - 0) < 10;
        return (this.results.left = current);
    }

    get top() {
        const current = Math.abs(this.pointer[1] - 0) < 10;
        return (this.results.top = current);
    }

    get right() {
        const current = Math.abs(this.pointer[0] - window.innerWidth) < 10;
        return (this.results.right = current);
    }

    get bottom() {
        const current = Math.abs(this.pointer[1] - window.innerHeight) < 10;
        return (this.results.bottom = current);
    }
}

//
export const pointerMap = new Map([
    [0, {
        movement: [],
        down: [],
        current: [],
        event: null, 

        //
        holding: []
    }]
]);

//
document.addEventListener("pointerdown", (ev)=>{
    const np = {
        event: ev,
        current: [ev.pageX, ev.pageY],
        down: [ev.pageX, ev.pageY]
    }

    //
    const exists = pointerMap.has(ev.pointerId) ? pointerMap.get(ev.pointerId) : np;
    np.movement[0] = np.current[0] - exists.current[0];
    np.movement[1] = np.current[1] - exists.current[1];

    //
    hm.shifting = [...(hm.modified || hm.shifting)];

    //
    if (!exists.edges) {
        exists.edges = new PointerEdge(exists);
    }

    //
    Object.assign(exists, np);
    pointerMap.set(exists);
}, {capture: true, passive: true});

// 
document.addEventListener("pointermove", (ev)=>{
    const np = {
        event: ev,
        current: [ev.pageX, ev.pageY],
        down: [ev.pageX, ev.pageY]
    }

    //
    const exists = pointerMap.has(ev.pointerId) ? pointerMap.get(ev.pointerId) : np;
    np.movement[0] = np.current[0] - exists.current[0];
    np.movement[1] = np.current[1] - exists.current[1];

    //
    if (!exists.edges) {
        exists.edges = new PointerEdge(exists);
    }

    //
    Object.assign(exists, np);
    pointerMap.set(exists);

    //
    exists.holding.map((hm)=>{
        hm.shifting[0] += np.movement[0];
        hm.shifting[1] += np.movement[1];
        hm.modified = [...hm.shifting];

        //
        const nev = new CustomEvent("m-dragging", { detail: {
            pointer: exists,
            holding: hm
        }});
        em?.dispatchEvent?.(nev);

        //
        const em = hm.element.deref();
        em?.style?.setProperty?.(`--${hm.propertyName||"drag"}-x`, hm.modified[0]);
        em?.style?.setProperty?.(`--${hm.propertyName||"drag"}-y`, hm.modified[1]);
    });

    //
    ["left", "top", "right", "bottom"].map((side)=>{
        if (exists.edges.results[side] != exists.edges[side]) {
            const nev = new CustomEvent((exists.edges[side] ? "m-contact-" : "m-leave-") + side, { detail: exists });
            document?.dispatchEvent?.(nev);
        }
    });

}, {capture: true, passive: true});

//
export const releasePointer = (ev)=>{
    const exists = pointerMap.get(ev.pointerId);

    //
    if (exists) {
        exists.holding.map((hm)=>{
            const em = hm.element.deref();
            const nev = new CustomEvent("m-dragend", { detail: {
                pointer: exists,
                holding: hm
            }});
            em?.dispatchEvent?.(nev);
        });
    }

    //
    pointerMap.delete(ev.pointerId);
}

//
document.addEventListener("pointercancel", releasePointer, {capture: true, passive: true});
document.addEventListener("pointerup", releasePointer, {capture: true, passive: true});

//
export const grabForDrag = (element, pointerId = 0, {
    shifting = [0, 0], 
    propertyName = "drag" // use dragging events for use limits
} = {})=>{
    const exists = pointerMap.get(ev.pointerId);
    exists.event = ev;

    //
    const hm = exists.holding.find((hm)=>(hm.element == element)) || {};
    exists.holding.push(Object.assign(hm, {
        element: new WeakRef(element),
        shifting: [...(hm?.modified || hm?.shifting)]
    }));

    // pls, assign "ev.detail.holding.shifting" to initial value (f.e. "ev.detail.holding.modified")
    // note about "ev.detail.holding.element is WeakRef, so use ".deref()"
    const nev = new CustomEvent("m-dragstart", { detail: {
        pointer: exists,
        holding: hm
    }});

    //
    element?.dispatchEvent?.(nev);
}
