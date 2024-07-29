<script setup>
    import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';

    //
    import {reactive, watch, ref, onMounted} from "vue";

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
    const state = reactive({
        selectedFilename: null,
        fileList: new Map([])
    })

    //
    const props = defineProps({ ifc: Boolean });
    onMounted(()=>{ getFileList(null, state); });
</script>

<template>
    <div class="ui-screen" id="manager" v-bind="$attrs">

        <div class="ui-nav" data-scheme="ui-solid-transparent" data-highlight="1">
            <button class="use-item" data-transparent data-highlight-hover="2" @click="(ev)=>useItemEv(ev, state)">
                <div inert class="icon"><LucideIcon slot="icon" name="image-play"/></div>
                <div inert class="name">Use as Wallpaper</div>
            </button>

            <button class="add-item" data-transparent data-highlight-hover="2" @click="(ev)=>addItemEv(ev, state)">
                <div inert class="icon"><LucideIcon slot="icon" name="image-up"/></div>
                <div inert class="name">Load Image</div>
            </button>

            <button class="remove-item" data-transparent data-highlight-hover="2" @click="(ev)=>removeItemEv(ev, state)">
                <div inert class="icon"><LucideIcon slot="icon" name="image-off"/></div>
                <div inert class="name">Remove Image</div>
            </button>

            <button class="download-item" data-transparent data-highlight-hover="2" @click="(ev)=>downloadItemEv(ev, state)">
                <div inert class="icon"><LucideIcon slot="icon" name="image-down"/></div>
                <div inert class="name">Download Image</div>
            </button>
        </div>
        <x-scrollbox class="ui-space">

            <div class="file-list">
                <div
                    v-for="[name, file] in state.fileList"
                    @click="(ev)=>selectFileEv(ev, state)"
                    :data-filename="file.name"
                    class="file"
                    v-bind:class="{selected: state.selectedFilename == file.name}"
                    data-scheme
                    data-highlight-hover="1"
                    :key="file.name"
                >
                    <div inert class="icon"><LucideIcon name="wallpaper"/></div>
                    <div inert class="name">{{file.name}}</div>
                </div>
            </div>

        </x-scrollbox>

    </div>
</template>

<style type="scss" lang="scss">

</style>
