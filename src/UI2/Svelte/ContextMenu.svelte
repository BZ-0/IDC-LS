<script lang="ts" type="ts">
import Block from "./Block.svelte";
import Frame from "./Frame.svelte";
import WLucideIcon from "./WLucideIcon.svelte";

//
export let ctxName = "ctx-menu";
export let ctxList = [{
    icon: "wallpaper",
    name: "Test",
    action: "unknown"
}];
</script>

<Frame data-ctx-name={ctxName} class="ux-modal-frame ux-context-menu">
    {#each ctxList as L}
        <Block class="ux-block-decor" data-highlight-hover="1" style="--decor-size: 3rem" data-action={L.action}>
            <WLucideIcon name={L.icon} data-place="icon"></WLucideIcon>
            <span>{L.name}</span>
            <div data-place="element"></div>
        </Block>
    {/each}
</Frame>
