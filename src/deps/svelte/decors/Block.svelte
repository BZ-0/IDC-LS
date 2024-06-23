<script>
</script>

<div class="block-decor solid" {...$$props}>
    <div class="icon-wrap hl-1"  inert={true}>
        <div class="icon-box" inert={true}><slot name="icon"></slot></div>
    </div>
    
    <div class="label-box" inert={true}>
        <slot></slot>
    </div>
    
    <div class="in-element">
        <slot name="element"></slot>
    </div>

    <!--<div class="description">
    
    </div>-->
</div>
