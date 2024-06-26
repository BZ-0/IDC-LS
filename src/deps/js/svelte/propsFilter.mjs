export const propsFilter = (obj)=>{
    return Object.fromEntries(Array.from(Object.entries(obj)).filter(([k, v])=>{
        return !(typeof v == "function" || typeof v == "object");
    }));
}