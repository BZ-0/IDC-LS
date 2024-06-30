import { decode, encode } from 'cbor-x'

//
import { currentState } from "./gridState.mjs"
import { settings } from "./settings.mjs"

// Function to download data to a file
export const saveBinaryToFS = async (data, filename = "settings.base64") => {
    const file = new Blob([data], {type: "plain/text"});
    if ("msSaveOrOpenBlob" in self.navigator) {// IE10+
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(file, filename);
    }

    //
    // @ts-ignore
    const fx = await (self?.showOpenFilePicker ? new Promise((r)=>r({
        // @ts-ignore
        showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
        // @ts-ignore
        showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window)
    // @ts-ignore
    })) : import('@libs/polyfill/showOpenFilePicker.mjs'));

    //
    // @ts-ignore
    if (window?.showSaveFilePicker) {
        // @ts-ignore
        const fileHandle = await (self?.showSaveFilePicker)?.({
            suggestedName: filename,
            types: [
                {
                    description: "Base64 Encoded",
                    accept: { "text/plain": [".base64"] },
                },
            ],
        })?.catch?.(console.warn.bind(console));
        const writableFileStream = await fileHandle?.createWritable?.()?.catch?.(console.warn.bind(console));
        await writableFileStream?.write?.(file)?.catch?.(console.warn.bind(console));
        await writableFileStream?.close()?.catch?.(console.warn.bind(console));
    } else { // Others
        let url = "";
        const a = document.createElement("a");
        a.href = (url = URL.createObjectURL(file));
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

//
export const pickBinaryFromFS = async () => {
    // @ts-ignore
    const fpc = (self.showOpenFilePicker ? new Promise((r)=>r({
        // @ts-ignore
        showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
        // @ts-ignore
        showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window)
    // @ts-ignore
    })) : /* webpackPrefetch: true */ import('@libs/polyfill/showOpenFilePicker.mjs'));

    //
    let fileBlob = null;
    try {
        // @ts-ignore
        fileBlob = fpc.then((fx)=>(fx?.showOpenFilePicker ?? self?.showOpenFilePicker)({
                types: [
                    {
                        description: "Base64 Encoded",
                        accept: { "text/plain": [".base64"] },
                    },
                ],
            }))
            .then(([handle]=[])=>handle?.getFile?.())
            .then((blob)=>{
                return blob.text();
            }).catch(console.warn.bind(console));
    } catch(e) {
        console.warn(e);
    };
    
    //
    return fileBlob;
}

//
export const exportSettings = async ()=>{
    const exports = {
        icons: currentState.iconItems,
        lists: currentState.iconLists,
        pages: currentState.gridPages,
        settings: {
            scaling: obj.settings.scaling || 1,
            columns: obj.settings.columns || 4,
            rows: obj.settings.rows || 8,
        }
    }
    
    //
    const binary = Buffer.from(encode(exports));
    const data = binary.toString("base64");
    
    //
    return data;
}

//
export const importSettings = async (data)=>{
    if (!data) return;

    //
    const binary = Buffer.from(data, "base64");
    const obj = decode(binary);

    //
    settings.scaling = obj.settings.scaling;
    settings.columns = obj.settings.columns;
    settings.rows = obj.settings.rows;

    //
    currentState.iconItems = obj.icons;
    currentState.iconLists = obj.lists;
    currentState.gridPages = obj.pages;

    //
    return obj;
}

