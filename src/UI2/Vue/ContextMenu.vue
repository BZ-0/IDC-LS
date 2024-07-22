<script setup>
import Block from "./Block.vue";
import Frame from "./Frame.vue";
import LucideIcon from "./WLucideIcon.vue";

//
const props = defineProps({
    ctxName: String,
    ctxList: Array
});

//
/*export let ctxName = "ctx-menu";
export let ctxList = [{
    icon: "wallpaper",
    name: "Test",
    action: "unknown"
}];*/
</script>

<template>
    <Frame :data-ctx-name={props.ctxName} class="ux-modal-frame ux-context-menu">
        <div v-for="L in props.ctxList" class="ux-block-decor" data-highlight-hover="1" style="--decor-size: 3rem" :data-action={L.action}>
            <LucideIcon :icon={L.icon} data-place="icon"></LucideIcon>
            <span>{{L.name}}</span>
            <div data-place="element"></div>
        </div>
    </Frame>
</template>
