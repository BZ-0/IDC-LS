import { initHelia } from "@idc/Cloud/Helia/HeliaInit.ts"

//
export default async()=>{
    const {unixfs } = await import('@helia/unixfs');

    //
    const [helia] = await initHelia();
    const fs = await unixfs(helia)

    

    //
    const $loadFile = async (cid)=>{
        const chunks = [];
        for await (const buf of fs.cat(cid)) {
            chunks.push(buf);
        }
        return chunks;
    }

    //
    const loadFile = (cid) => {
        return Promise.race([$loadFile(cid), new Promise((r)=>setTimeout(r, 2000))]);
    }

    //
    const cid = localStorage.getItem("@ipfs:@settings");

    if (cid) {
        console.log(await loadFile(cid));
    }
}
