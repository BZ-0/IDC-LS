
let session = null;
export const initWebDav = async ()=>{
    if (!session) {
        const { createClient, AuthType } = await import("webdav");
        const private = await fetch(new URL("@idc/PRIVATE.json", import.meta.url).href)?.catch?.(console.warn.bind(console));
        const result = await private?.text?.();
        if (result) {
            const data = JSON.parse(result);
            session = createClient(data.WebDavURL, {
                authType: AuthType.Digest,
                username: data.WebDavUsername,
                password: data.WebDavPassword,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }
    }
    return session;
}
