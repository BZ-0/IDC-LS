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

        <div class="ui-nav" data-scheme="solid" style="pointer-events: auto;" data-highlight="1">
            <button data-tooltip="Use as Wallpaper" class="use-item" data-scheme="solid-transparent" data-highlight="1" data-highlight-hover="2" @click="(ev)=>useItemEv(ev, state)">
                <LucideIcon inert name="image-play" class="icon"/>
            </button>

            <button data-tooltip="Load Image" class="add-item" data-scheme="solid-transparent" data-highlight="1" data-highlight-hover="2" @click="(ev)=>addItemEv(ev, state)">
                <LucideIcon inert name="image-up" class="icon"/>
            </button>

            <button data-tooltip="Remove Image" class="remove-item" data-scheme="solid-transparent" data-highlight="1" data-highlight-hover="2" @click="(ev)=>removeItemEv(ev, state)">
                <LucideIcon inert name="image-off" class="icon"/>
            </button>

            <button data-tooltip="Download Image" class="download-item" data-scheme="solid-transparent" data-highlight="1" data-highlight-hover="2" @click="(ev)=>downloadItemEv(ev, state)">
                <LucideIcon inert name="image-down" class="icon"/>
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
                    <div inert class="date">{{new Date(file.lastModified).toLocaleString("ru-RU")}}</div>
                </div>
            </div>

        </x-scrollbox>

    </div>
</template>

<style type="scss" lang="scss">

</style>
