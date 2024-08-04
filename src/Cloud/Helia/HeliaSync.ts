import { unixfs } from "@helia/unixfs";
import { initHelia } from "@idc/Cloud/Helia/HeliaInit.ts"
import { exportSettings } from '@idc/State/ImportExport.ts';
import bs58 from 'bs58'

//
export default async()=>{
    const {Key} = await import("interface-datastore");
    const {unixfs } = await import('@helia/unixfs');
    //const {mfs } = await import('@helia/mfs');
    const encoder = new TextEncoder();

    //
    const [helia] = await initHelia();
    const fs = await unixfs(helia)
    const cid = await fs.addBytes(encoder.encode(await exportSettings()));/*await fs.addFile({
        path: './settings.jsox',
        content: encoder.encode(await exportSettings()),
        mode: 0x777,
    })*/

    console.log(cid);

    //
    localStorage.setItem("@ipfs:@settings", cid.toString());
}
