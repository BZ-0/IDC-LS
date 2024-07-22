<script context="module">
    import {propsFilter} from "@unite/scripts/utils/Utils.ts";
</script>

<script>
    import LucideIcon from '@idc/UI2/Svelte/WLucideIcon.svelte';
    import Block from '@idc/UI2/Svelte/Block.svelte';
    import { makeReactiveObject } from "@unite/scripts/reactive/ReactiveObject.ts";

    //
    import { onMount } from 'svelte';
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";

    //
    import {
        downloadImage,
        getFileList,
        selectFileEv,
        useItemEv,
        addItemEv,
        removeItemEv,
        downloadItemEv
    } from "@idc/App/Scripts/Manager.ts";

    //
    let state = makeReactiveObject({
        selectedFilename: null,
        fileList: new Map([])
    })

    //
    state?.["@subscribe"]?.(()=>{ state = state; });

    //
    onMount(()=>{ getFileList(null, state); });
</script>

<div class="ls-screen" id="manager" transition:fade={{ delay: 0, duration: 100 }}>

    <div class="ls-nav" data-scheme="ux-solid-transparent" data-highlight="1">
        <button class="use-item" data-transparent data-highlight-hover="2" on:click={(ev)=>useItemEv(ev, state)}>
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"image-play"}/></div>
            <div inert={true} class="name">Use as Wallpaper</div>
        </button>

        <button class="add-item" data-transparent data-highlight-hover="2" on:click={(ev)=>addItemEv(ev, state)}>
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"image-up"}/></div>
            <div inert={true} class="name">Load Image</div>
        </button>

        <button class="remove-item" data-transparent data-highlight-hover="2" on:click={(ev)=>removeItemEv(ev, state)}>
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"image-off"}/></div>
            <div inert={true} class="name">Remove Image</div>
        </button>

        <button class="download-item" data-transparent data-highlight-hover="2" on:click={(ev)=>downloadItemEv(ev, state)}>
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"image-down"}/></div>
            <div inert={true} class="name">Download Image</div>
        </button>
    </div>
    <x-scrollbox class="ux-space">

        <div class="file-list">
            {#each state.fileList.entries() as [name, file]}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div on:click={(ev)=>selectFileEv(ev, state)} class={`file ${ state.selectedFilename == file.name ? "selected" : "" }`} data-scheme data-highlight-hover="1" data-filename={file.name}>
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
