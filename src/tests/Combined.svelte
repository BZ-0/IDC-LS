
<script>
    import MultiPage from "@svelte/icongrid/MultiPage.svelte";
</script>

<canvas is="w-canvas" class="stretch fixed inset-0" data-src={(localStorage.getItem("@wallpaper") || "../assets/wallpaper/0.jpg")}/>

<MultiPage></MultiPage>
