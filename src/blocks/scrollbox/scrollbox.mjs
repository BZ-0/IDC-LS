import styles from "./scrollbox.scss?inline";
import html from "./scrollbox.html?raw";

//
class ScrollBar {
	constructor({
        holder,
        scrollbar
    }, axis = 0) {
        this.scrollbar = scrollbar;
        this.holder  = holder;

        //
        const onChanges = ()=>{
            const thumbSize = this.scrollbar[["offsetWidth", "offsetHeight"][axis]] * 
            ( 
                this.holder[["offsetWidth", "offsetHeight"][axis]] /
                this.holder[["scrollWidth", "scrollHeight"][axis]]
            );
            
            //
            const percentInPx = this.scrollbar[["offsetWidth", "offsetHeight"][axis]] - thumbSize;

            // @ts-ignore
            this.scrollbar.style.setProperty("--thumbSize", thumbSize, "");

            // @ts-ignore
            this.scrollbar.style.setProperty("--percentInPx", percentInPx, "");

            //
            this.holder.style.setProperty("--scroll-top" , this.holder.scrollTop , "");
            this.holder.style.setProperty("--scroll-left", this.holder.scrollLeft, "");
        }
        
        //
        this.holder.addEventListener("scroll", onChanges);
        new ResizeObserver((entries)=>{
            if (entries) {
                onChanges();
            }
        }).observe(this.holder, {box: "content-box"});
    }

}

//
CSS?.registerProperty?.({
    name: "--percent",
    syntax: "<number>",
    inherits: true,
    initialValue: "0",
});

//
class ScrollBox extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");

        dom.querySelector("template")?.content?.childNodes.forEach((cp)=>{
            shadowRoot.appendChild(cp.cloneNode(true));
        });

        //
        const style = document.createElement("style");
        style.innerHTML = styles;
        shadowRoot.appendChild(style);

        //
        this["@scrollbar-x"] = new ScrollBar({
            holder: this,
            scrollbar: shadowRoot.querySelector(".scrollbar-x")
        }, 0);

        //
        this["@scrollbar-y"] = new ScrollBar({
            holder: this,
            scrollbar: shadowRoot.querySelector(".scrollbar-y")
        }, 1);
    }
}

//
customElements.define('x-scrollbox', ScrollBox);
