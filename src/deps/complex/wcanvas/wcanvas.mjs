
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
            ctx.translate(-(img.height / 2) * scale, -(img.width / 2) * scale);
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
            ctx.translate(-(img.height / 2) * scale, -(img.width / 2) * scale);
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
        this.ctx = canvas.getContext("2d", {
            desynchronized: true,
            willReadFrequently: false,
            powerPreference: "high-performance"
        });

        //
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
        addEventListener("orientationchange", () => {
            this.#render();
        });

        //
        this.#preload(this.dataset.src).then(()=>this.#render());
    }

    //
    #render() {
        const canvas = this;
        const ctx = this.ctx;

        //
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);

        //
        if (this.image) {
            // TODO: support portrait images
            if (this.image.width >= this.image.height) {
                landscapeCover(ctx, this.image, scale);
                ctx.drawImage(this.image, 0, 0, img.width * scale, img.height * scale);
            }
        }
        
    }

    //
    #preload(src) {
        return fetch(src).then(async (rp)=>{
            this.image = await createImageBitmap(await rp.blob());
        }).catch(console.warn.bind(console));
    }

    //
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "data-src") {
            this.#preload(newValue);
        };
    }
}

//
customElements.define('w-canvas', WCanvas, {extends: 'canvas'});
