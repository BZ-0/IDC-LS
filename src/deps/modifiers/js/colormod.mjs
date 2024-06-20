import {sourceColorFromImage} from "@libraries/js/workarounds/color-mod.mjs";
import { parse, oklch, interpolate, interpolatorSplineBasis, formatHex, formatCss } from 'culori';
import {hexFromArgb} from "@material/material-color-utilities";

//
import {setStyleRule} from "./stylework.mjs";

//
export const provide = async (path="", rw = false)=>{
    const relPath = path.replace(location.origin, "");
    if (relPath.startsWith("/opfs")) {
        const params = relPath.split(/\?/i)?.[1]||relPath;
        const $path = new URLSearchParams(params).get("path");
        const parts = $path?.split?.("/")||$path||"";

        //
        let dir = await navigator?.storage?.getDirectory?.()?.catch?.(console.warn.bind(console));;
        for (let I=0;I<parts.length-1;I++) {
            if (!parts[I]) continue;
            dir = await dir?.getDirectoryHandle?.(parts[I], { create: rw })?.catch?.(console.warn.bind(console));
            if (!dir) break;
        }

        //
        const fileh = await dir?.getFileHandle?.(parts[parts.length-1], { create: rw });
        return await fileh?.[rw ? "createWritable" : "getFile"]?.();
    } else
    if (relPath.startsWith("/")) {
        return fetch(path).then((r)=>r.blob());
    }
    return null;
}

//
const lightMods = ["#000000", "#FFFFFF"], darkMods = ["#FFFFFF", "#000000"];
let baseColorI    = {};
let baseColorH    = "#FFFFFF";
let baseColor     = localStorage.getItem("--theme-base-color") || "#FFFFFF";
let surfaceColorI = {};
let surfaceColorH = "#FFFFFF";
let surfaceColor  = "#FFFFFF";
let chromaMod     = {};

//
setStyleRule(":host, :root, :scope, :where(*)", {
    "--theme-base-color": baseColor
});

//
export const switchTheme = (isDark = false)=>{
    if (!baseColorI) return;

    // used in UI
    surfaceColorI = interpolate([baseColorI, ([lightMods, darkMods][isDark-0])[1]], 'oklch', {  })(0.96);

    //
    surfaceColorH = formatHex(surfaceColorI);
    surfaceColor  = formatCss(baseColorI);
    
    //
    const media = document?.head?.querySelector?.("meta[name=\"theme-color\"]:not([media])");
    if (media) {
        media.content = surfaceColorH;
    }
}

//
export const colorScheme = async (blob)=>{
    const image = await createImageBitmap(blob);
    const [chroma, common] = await sourceColorFromImage(image);

    //
    const chromaHex = hexFromArgb(chroma);
    const commonHex = hexFromArgb(common);

    //
    const chromaOkLch = oklch(parse(chromaHex));
    const commonOkLch = oklch(parse(commonHex));

    //
    baseColorI = interpolate([commonOkLch, chromaOkLch], 'oklch', {
        // spline instead of linear interpolation:
        
    })(0.80);

    //
    const whiteMod  = {...baseColorI};
    whiteMod.c = 0.0;
    whiteMod.l = 1;

    //
    const blackMod  = {...baseColorI};
    blackMod.c = 0.0;
    blackMod.l = 0;

    //
    chromaMod = {...baseColorI};
    chromaMod.c = 1;

    //
    lightMods[0] = interpolate([baseColorI, whiteMod], 'oklch', {  })(0.98),
    lightMods[1] = interpolate([baseColorI, blackMod], 'oklch', {  })(0.9)
    
    //
    darkMods[0] = interpolate([baseColorI, whiteMod], 'oklch', {  })(0.98),
    darkMods[1] = interpolate([baseColorI, blackMod], 'oklch', {  })(0.9)

    //
    baseColorH    = formatHex(baseColorI);
    baseColor     = formatCss(baseColorI);

    //
    if (baseColor) {
        setStyleRule(":host, :root, :scope, :where(*)", {
            "--theme-base-color": baseColor
        });
        
        //
        localStorage.setItem("--theme-base-color", baseColor);
    }

    //
    switchTheme(false);
}

//
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
    switchTheme(matches);
})

//
window.addEventListener("wallpaper", (ev)=>{
    const blob = ev?.detail?.blob;
    if (blob) colorScheme(blob).then(()=>{
        provide("/opfs?path=images/wallpaper").then(async (fw)=>{
            await fw?.write?.(blob);
            await fw?.flush?.();
            await fw?.close?.();
        }).catch(console.warn.bind(console));
    }).catch(console.warn.bind(console));
});
