<script>
    import Area from '@svelte/decors/Area.svelte';
    import LucideIcon from '@svelte/decors/LucideIcon.svelte';

</script>

<!-- -->
<div class="test-container" style="--theme-is-dark: 1; color-scheme: dark;">
    <Area>
        <LucideIcon name={"github"} slot="icon"></LucideIcon>
        <span>When Dark Theme</span>
    </Area>
</div>

<!-- -->
<div class="test-container" style="--theme-is-dark: 0; color-scheme: light;">
    <Area>
        <LucideIcon name={"github"} slot="icon"></LucideIcon>
        <span>When Light Theme</span>
    </Area>
</div>

<style type="scss">
    .test-container {
        inline-size: 20rem;
        block-size: 20rem;
        
        container-type: size;
        contain: content;
        
        display: inline-block;
    }
</style>