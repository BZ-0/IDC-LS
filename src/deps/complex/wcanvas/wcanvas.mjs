
//
const getCorrectOrientation = ()=>{
    let orientationType = screen.orientation.type;
    if (matchMedia("(orientation: portrait)" ).matches) { orientationType = orientationType.replace("landscape", "portrait"); } else
    if (matchMedia("(orientation: landscape)").matches) { orientationType = orientationType.replace("portrait", "landscape"); };
    return orientationType;
}

//
const landscapeCover = (ctx, img, scale = 1) => {
    const orientation = getCorrectOrientation();
    const canvas = ctx.canvas;

    //
    switch(orientation) {
        //
        case "landscape-primary": {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(0 * (Math.PI/180));
            ctx.translate(-(img.width / 2) * scale, -(img.height / 2) * scale);
        }
        break;

        //
        case "portrait-primary": {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-90 * (Math.PI/180));
            ctx.translate(-(img.width / 2) * scale, -(img.height / 2) * scale);
        }
        break;

        //
        case "landscape-secondary": {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-180 * (Math.PI/180));
            ctx.translate(-(img.width / 2) * scale, -(img.height / 2) * scale);
        }
        break;

        //
        case "portrait-primary": {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-270 * (Math.PI/180));
            ctx.translate(-(img.width / 2) * scale, -(img.height / 2) * scale);
        }
        break;
    }
}

//
class WCanvas extends HTMLCanvasElement {
    static observedAttributes = ["data-src"];

    //
    constructor() {
        super();

        //
        const canvas = this;
        
        //
        this.ctx = canvas.getContext("2d", {
            desynchronized: true,
            willReadFrequently: false,
            powerPreference: "high-performance"
        });
        
        //
        this.inert  = true;
        this.width  = (this.offsetWidth  * devicePixelRatio);
        this.height = (this.offsetHeight * devicePixelRatio);

        //
        this.style.objectFit = "cover";
        this.style.objectPosition = "center";
        this.classList.add("w-canvas");

        //
        new ResizeObserver((entries)=>{
            for (const entry of entries) {
                if (entry.contentBoxSize[0]) {
                    this.width  = entry.contentBoxSize[0].inlineSize * devicePixelRatio;
                    this.height = entry.contentBoxSize[0].blockSize * devicePixelRatio;
                    this.#render();
                }
            }
        }).observe(this, {box: "content-box"});

        //
        screen.orientation.addEventListener("change", () => {
            this.#render();
        });

        //
        this.#preload(this.dataset.src).then(()=>this.#render());
    }

    //
    #render() {
        const canvas = this;
        const ctx = this.ctx;
        const img = this.image;

        //
        if (img) {
            const orientation = getCorrectOrientation();
            const ox = orientation.startsWith("portrait") - 0;
            const scale = Math.max(canvas[["width","height"][ox]] / img.width, canvas[["height","width"][ox]] / img.height);
            
            
            // TODO: support portrait images
            if (img.width >= img.height) {
                landscapeCover(ctx, img, scale);
                ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
            }
        }
        
    }

    //
    #preload(src) {
        return fetch(src).then(async (rp)=>{
            const blob = await rp.blob();
            const img  = await createImageBitmap(blob).catch((_)=>null);
            if (img) {
                this.image = img;
                window.dispatchEvent(new CustomEvent("wallpaper", { detail: {
                    blob
                }}));
            }
        }).catch(console.warn.bind(console));
    }

    //
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "data-src") {
            this.#preload(newValue).then(()=>this.#render());
        };
    }
}

//
customElements.define('w-canvas', WCanvas, {extends: 'canvas'});
