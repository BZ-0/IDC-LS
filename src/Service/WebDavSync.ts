
export const getFileList = async (exists, state)=>{
    //
    const files = new Map([]);

    //
    let wall = null;

    //
    if (exists) { wall = exists; } else {
        const root = await navigator?.storage?.getDirectory?.();
        wall = await root?.getDirectoryHandle?.("images");
    }

    //
    const it = await wall?.entries();//getFileHandle()
    const entries = [];
    while (true) {
        const v = (await it.next())?.value;
        if (!v) break; entries.push(v);
    }

    //
    if (entries) {
        await Promise.all(entries.filter(([fn,fm])=>(fm instanceof FileSystemFileHandle)).map(async ([fn,fm])=>{
            files.set(fn, await fm.getFile());
        }));
        if (state) { state.fileList = files; };
    }

    //
    return files;
}


export default async()=>{
    const {initWebDav} = await import("@idc/Config/WebDavInit.ts");
    const webdav = await initWebDav();
    const encoder = new TextEncoder();
    const {exportSettings} = await import('@idc/State/ImportExport');

    //
    (async ()=>{
        const exp = encoder.encode(await exportSettings());

        //
        //webdav.putFileContents("./idc-ls/settings.jsox", exp.buffer, { overwrite: true });

    })();

    //
    (async ()=>{
        const files = await getFileList();
        Promise.all([Array.from(files.entries()).map(async ([name, file])=>{

        })]);
    })();
}
