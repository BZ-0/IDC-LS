<div class="area-decor">
    <div class="icon-box hl-1">
        
    </div>
    <div class="content-box">
        <div class="label-box">
            <slot></slot>
        </div>
        <div class="in-element">
            <slot name="element"></slot>
        </div>
    </div>
    <!--<div class="description">
    
    </div>-->
</div>

<style type="scss">
    //
    .area-decor {
        min-block-size: 2rem;
        inline-size: stretch;
        block-size: max-content;
        
        display: grid;
        grid-template-columns: minmax(2rem, max-content) minmax(0px, 1fr) minmax(2rem, max-content);
        grid-template-rows: minmax(2rem, max-content);
        
        //
        .icon-box {
            min-block-size: 2rem;
            max-block-size: 2rem;
            
            min-inline-size: 2rem;
            max-inline-size: 2rem;
            
            block-size: max-content;
            inline-size: max-content;
        }
    }
</style>