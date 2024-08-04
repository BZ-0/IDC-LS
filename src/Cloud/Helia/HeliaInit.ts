import { Buffer } from 'buffer';

let session = null;
let pinner = null;

//
async function HMAC(key, message){
    const g = str => new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))),
    k = g(key),
    m = g(message),
    c = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' },true, ['sign']),
    s = await crypto.subtle.sign('HMAC', c, m);
    return btoa(String.fromCharCode(...new Uint8Array(s)))
}

//
export const initHelia = async ()=>{
    const {createHeliaHTTP} = await import("@helia/http");
    const {delegatedHTTPRouting, httpGatewayRouting } = await import('@helia/routers');
    const {trustlessGateway  } = await import('@helia/block-brokers');

    if (!session) {
        session = createHeliaHTTP({
            blockBrokers: [
                trustlessGateway({
                    gateways: ["http://127.0.0.1:8080"],
                }),
            ],
            routers: [
                delegatedHTTPRouting('http://127.0.0.1:8080/')
            ]
        });
    }
    return Promise.all([session/*, pinner*/]);
}

//
export const LocalPinCID = async (cidStr, name="test")=>{
    const private = await fetch(new URL("@idc/PRIVATE.json", import.meta.url).href)?.catch?.(console.warn.bind(console));
    const json = await private?.text?.();
    if (json) {
        const data = JSON.parse(json);
        const client = new Client(data.GW3Access, data.GW3Secret);
        return await client.addPin(cidStr);
    }
    return null;
}
