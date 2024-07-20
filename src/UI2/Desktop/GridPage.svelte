<script type="ts" lang="ts">
    import {onMount} from 'svelte';
    import {observeBorderBox, observeBySelector} from "@unite/scripts/dom/Observer.ts";
    import type {GridItemType, GridPageType} from "@unite/scripts/utils/GridItemUtils.ts";

    //
    import GridItem from "./GridItem.svelte";
    import GridItemLabel from "./GridItemLabel.svelte";
    
    //
    export let actionMap = new Map();
    export let items = null;//new Map<string, GridItemType>([]);
    export let type = "items";
    export let list = null;//new Set<string>;
    
    //
    const onItemClick = (ev)=>{
        const target = ev.target as HTMLElement;
        actionMap?.get?.(target.dataset.action as string)?.({
            initiator: target
        });
    }

</script>

<!-- -->
{#each list as L (L)}
    {#if type == "labels"}
        <GridItemLabel type={type} gridItem={items.get(L)}></GridItemLabel>
    {:else}
        <GridItem onClick={onItemClick} type={type} gridItem={items.get(L)}></GridItem>
    {/if}
{/each}
