
<script>
    import MultiPage from "@svelte/icongrid/MultiPage.svelte";
    import ContextMenu from '@svelte/inputs/ContextMenu.svelte';
    import FieldEdit from '@svelte/inputs/FieldEdit.svelte';
    import IconEdit from '@svelte/inputs/IconEdit.svelte';
    import Settings from '@svelte/settings/Settings.svelte';
</script>

<canvas is="w-canvas" class="stretch fixed inset-0" data-src={(localStorage.getItem("@wallpaper") || "../assets/wallpaper/0.jpg")}/>


<MultiPage></MultiPage>
<Settings></Settings>
<IconEdit></IconEdit>
<FieldEdit></FieldEdit>
<ContextMenu></ContextMenu>
