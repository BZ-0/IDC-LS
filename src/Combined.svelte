<script lang="ts" type="ts">
	import GridItem from "@unite/grid/GridItem.svelte";
    import MultiPage from "@unite/grid/MultiPage.svelte";
    import IconEdit from "src/_IconEdit.svelte";
    import Settings from "src/_Settings.svelte";
    import {writable} from "svelte/store";
    import type {Writable} from "svelte/store";
    
    //
    import IconEdit from "./IconEdit.svelte";
    
    //
    export let actionMap = new Map<string, Function>();
    export let wallpaperURL = "";
    
    //
    let gridItem: Writable<GridItem> = writable<GridItem>(null);
    
</script>

<!-- -->
<w-canvas data-src={wallpaperURL}></w-canvas>

<!-- -->
<MultiPage actionMap={actionMap}></MultiPage>
<Settings actionMap={actionMap}></Settings>
<IconEdit actionMap={actionMap} gridItem={gridItem}></IconEdit>
