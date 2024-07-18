<script context="module">
    import {propsFilter} from "@unite/utils/Utils.ts";
</script>

<!-- Second Season: Finale -->
<script>
    import LucideIcon from '@unite/design/WLucideIcon.svelte';
    import Block from '@unite/design/Block.svelte';
    
    //
    import { onMount } from 'svelte';
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";

    //
    let selectedFilename = null;
    let files = new Map([]);
    
    //
    const fileList = writable(files);
    
    //
    const getFileList = async ()=>{
        const root = await navigator?.storage?.getDirectory?.();
        const wall = await root?.getDirectoryHandle?.("images");
        
        //
        const it = await wall?.entries();//getFileHandle()
        const entries = [];
        while (true) {
            const v = (await it.next())?.value;
            if (!v) break; entries.push(v);
        }
        
        if (entries) {
            files = new Map(await Promise.all(entries.filter(([fn,fm])=>(fm instanceof FileSystemFileHandle)).map(async ([fn,fm])=>{
                return [fn, await fm.getFile()];
            })));
            fileList.set(files);
        }
        return files;
    }

    //
    document.documentElement.addEventListener("click", (ev)=>{
        if (ev.target.matches("#manager .file")) {
            document.querySelectorAll("#manager .file").forEach((el)=>{
                el.classList.remove("selected");
            });
            
            //
            ev.target.classList.add("selected");
            
            //
            selectedFilename = ev.target.dataset.filename;
        }
        
        if (ev.target.matches("#manager .use-item")) {
            if (selectedFilename && files.has(selectedFilename)) {
                const file = files.get(selectedFilename);
                
                if (file != null) {
                    const wallpaper = document.querySelector("canvas[is=\"w-canvas\"]");
                    wallpaper?.["$useImageAsSource"]?.(file);
                }
            }
        }
    });

    //
    onMount(()=>{
        getFileList();
    });
    
</script>

<!-- -->
<div class="ls-screen" id="manager">

    <div class="ls-nav ux-solid hl-1">
        <button class="use-item hl-1 hl-2h">
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"wallpaper"}/></div>
            <div inert={true} class="name">Use as Wallpaper</div>
        </button>
    </div>
    <x-scrollbox class="ux-space" transition:fade={{ key: currentPage, delay: 0, duration: 100 }}>
        
        <div class="file-list">
            {#each $fileList.entries() as [name, file]}
                <div class="file hl-1h" data-filename={file.name}>
                    <div inert={true} class="icon">
                        <LucideIcon name={"wallpaper"}/>
                    </div>
                    <div inert={true} class="name">{file.name}</div>
                </div>
            {/each}
        </div>
        
    </x-scrollbox>

</div>

<style type="scss" lang="scss">

</style>
