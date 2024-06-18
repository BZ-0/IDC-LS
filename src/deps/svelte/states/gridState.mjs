import { writable } from 'svelte/store';

//
export const columns = writable(parseInt(localStorage.getItem("@settings:@columns")) || 4);
export const rows = writable(parseInt(localStorage.getItem("@settings:@rows")) || 8);

//
columns.subscribe((value)=>{
    localStorage.setItem("@settings:@columns", value);
})

//
rows.subscribe((value)=>{
    localStorage.setItem("@settings:@rows", value);
})
