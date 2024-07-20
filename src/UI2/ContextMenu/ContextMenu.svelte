<script lang="ts" type="ts">
import Block from "../Design/Block/Block.svelte";
import Frame from "../Design/Frame/Frame.svelte";
import WLucideIcon from "../Design/WLucideIcon.svelte";

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
        <Block class="ux-block-decor ux-default-theme" data-highlight-hover="1" style="--decor-size: 2rem" data-action={L.action}>
            <WLucideIcon name={L.icon} slot="icon"></WLucideIcon>
            <span>{L.name}</span>
            <div slot="element"></div>
        </Block>
    {/each}
</Frame>
