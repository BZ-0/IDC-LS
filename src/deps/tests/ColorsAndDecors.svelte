<script>
    import Block from '@svelte/decors/Block.svelte';
    import LucideIcon from '@svelte/decors/LucideIcon.svelte';

</script>

<!-- -->
<div class="test-container" style="--theme-is-dark: 1; color-scheme: dark;">
    <Block>
        <LucideIcon name={"github"} slot="icon"></LucideIcon>
        <span>When Dark Theme</span>
    </Block>
</div>

<!-- -->
<div class="test-container" style="--theme-is-dark: 0; color-scheme: light;">
    <Block>
        <LucideIcon name={"github"} slot="icon"></LucideIcon>
        <span>When Light Theme</span>
    </Block>
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