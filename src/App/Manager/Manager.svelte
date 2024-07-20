<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
    
    //
    const files = new Map([]);
    const fileList = writable(files);
    
    //
    const getFileList = async (exists)=>{
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
            fileList.set(files);
        }
        return files;
    }

    // Function to download data to a file
    const downloadImage = async (file) => {
        const filename = file.name || "wallpaper";
    
        //
        if ("msSaveOrOpenBlob" in self.navigator) {
            // IE10+
            // @ts-ignore
            window.navigator.msSaveOrOpenBlob(file, filename);
        }
    
        //
        // @ts-ignore
        const fx = await (self?.showOpenFilePicker
            ? new Promise((r) =>
                r({
                    // @ts-ignore
                    showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
                    // @ts-ignore
                    showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window),
                    // @ts-ignore
                })
            )
            : import("@unite/scripts/polyfill/showOpenFilePicker.mjs"));
    
        //
        // @ts-ignore
        if (window?.showSaveFilePicker) {
            // @ts-ignore
            const fileHandle = await self
                ?.showSaveFilePicker?.({
                    suggestedName: filename
                })
                ?.catch?.(console.warn.bind(console));
            const writableFileStream = await fileHandle
                ?.createWritable?.()
                ?.catch?.(console.warn.bind(console));
            await writableFileStream
                ?.write?.(file)
                ?.catch?.(console.warn.bind(console));
            await writableFileStream?.close()?.catch?.(console.warn.bind(console));
        } else {
            // Others
            let url = "";
            const a = document.createElement("a");
            a.href = url = URL.createObjectURL(file);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    };

</script>

<!-- Second Season: Finale -->
<script>
    import LucideIcon from '@idc/UI2/Design/WLucideIcon.svelte';
    import Block from '@idc/UI2/Design/Block/Block.svelte';
    
    //
    import { onMount } from 'svelte';
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";

    //
    import { pickWallpaperImage } from "@idc/State/ActionMap.ts";

    //
    let selectedFilename = null;
    
    
    //
    const selectFileEv = (ev)=>{
        document.querySelectorAll("#manager .file").forEach((el)=>{
            el.classList.remove("selected");
        });
        
        //
        ev.target.classList.add("selected");
        
        //
        selectedFilename = ev.target.dataset.filename;
    }
    
    //
    const useItemEv = (ev)=>{
        if (selectedFilename && files.has(selectedFilename)) {
            const file = files.get(selectedFilename);
            if (file != null) {
                const wallpaper = document.querySelector("canvas[is=\"w-canvas\"]");
                wallpaper?.["$useImageAsSource"]?.(file, true).then((file)=>{
                    files.set(selectedFilename, file);
                    fileList.set(files);
                });
            }
        }
    }
    
    //
    const addItemEv = (ev)=>{
        pickWallpaperImage()
            .catch(console.warn.bind(console))
            .then(async (blob) => {
                if (blob) {
                    //
                    const root = await navigator?.storage?.getDirectory?.();
                    const wall = await root?.getDirectoryHandle?.("images");
                    
                    //
                    const fn = blob?.name || "wallpaper";
                    const fw = await (await wall?.getFileHandle?.(fn, {
                        create: true,
                    }))?.createWritable?.();
                    
                    //
                    await fw?.write?.(blob);
                    await fw?.flush?.();
                    await fw?.close?.();
                    
                    //
                    files.set(fn, blob);
                    selectedFilename = fn;
                    fileList.set(files);
                    
                    //
                    await getFileList(wall);
                }
            });
    }
    
    //
    const removeItemEv = (ev)=>{
        if (selectedFilename) {
            (async ()=>{
                if (("/opfs?path=images/" + (selectedFilename || "wallpaper")) != localStorage.getItem("@wallpaper")) {
                    const root = await navigator?.storage?.getDirectory?.();
                    const wall = await root?.getDirectoryHandle?.("images");
                    await wall?.removeEntry?.(selectedFilename);
                    
                    //
                    files.delete(selectedFilename);
                    selectedFilename = null;
                    fileList.set(files);
                    
                    //
                    await getFileList(wall);
                }
            })();
        }
    }
    
    //
    const downloadItemEv = (ev)=>{
        if (selectedFilename && files.has(selectedFilename)) {
            downloadImage(files.get(selectedFilename));
        }
    }

    //
    onMount(()=>{
        getFileList();
    });
    
</script>

<!-- -->
<div class="ls-screen" id="manager">

    <div class="ls-nav" data-scheme="ux-solid-transparent" data-highlight="1">
        <button class="use-item" data-transparent data-highlight-hover="2" on:click={useItemEv}>
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"image-play"}/></div>
            <div inert={true} class="name">Use as Wallpaper</div>
        </button>
        
        <button class="add-item" data-transparent data-highlight-hover="2" on:click={addItemEv}>
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"image-up"}/></div>
            <div inert={true} class="name">Load Image</div>
        </button>
        
        <button class="remove-item" data-transparent data-highlight-hover="2" on:click={removeItemEv}>
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"image-off"}/></div>
            <div inert={true} class="name">Remove Image</div>
        </button>
        
        <button class="download-item" data-transparent data-highlight-hover="2" on:click={downloadItemEv}>
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"image-down"}/></div>
            <div inert={true} class="name">Download Image</div>
        </button>
    </div>
    <x-scrollbox class="ux-space" transition:fade={{ delay: 0, duration: 100 }}>
        
        <div class="file-list">
            {#each $fileList.entries() as [name, file]}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div on:click={selectFileEv} class={`file ${ selectedFilename == file.name ? "selected" : "" }`} data-scheme data-highlight-hover="1" data-filename={file.name}>
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
