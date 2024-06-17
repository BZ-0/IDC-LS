//
export const EmbedStyle = async (shadow, styles)=>{
    const style = document.createElement("style");
    //style.setAttribute("scoped", "");
    shadow.appendChild(style);

    //
    style.innerHTML = styles;

    //
    return style;
}

//
export const exchange = (obj, name, value) => {
    const old = obj[name];
    obj[name] = value;
    return old;
}

//
export const clamp = (v, mn, mx)=>{
    return Math.min(Math.max(v, mn), mx);
}

//
export const url = (type, ...source)=>{
    return URL.createObjectURL(new Blob(source, {type}));
}

//
export const EmbedStyleURL = async (shadow, url)=>{
    /*
    const style = document.createElement("style");

    //
    shadow.appendChild(style);

    //
    //style.innerHTML = `@scope { @import url(\"${url}\"); }`;
    style.innerHTML = `@import url(\"${url}\");`;

    //
    return style;
    */

    //
    const link       = document.createElement('link');
    link.rel         = 'stylesheet';
    link.type        = 'text/css';
    link.href        = url;
    link.media       = 'all';
    link.crossOrigin = "same-origin";
    shadow?.appendChild?.(link);
    return link;
}

//
/*export const EmbedStyleURL = async (shadow, url)=>{
    const style = document.createElement("style");
    //style.setAttribute("scoped", "");
    shadow.appendChild(style);

    //
    style.innerHTML = await (await fetch(url)).text();

    //
    return style;
}*/



//
const parser = new DOMParser();
export const html = (source, type = 'text/html')=>{
    const parsed = parser.parseFromString(source, type);
    return parsed.querySelector('template') ?? parsed.querySelector("*");
}
