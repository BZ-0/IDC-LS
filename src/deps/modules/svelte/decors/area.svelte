<div class="area-decor" {...$$props}>
    <div class="icon-box hl-1">
        <slot name="icon"></slot>
    </div>
    
    <div class="label-box">
        <slot></slot>
    </div>
    
    <div class="in-element">
        <slot name="element"></slot>
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
        
        //
        display: grid;
        
        //
        grid-template-columns: minmax(2rem, max-content) minmax(0px, 1fr) minmax(2rem, max-content);
        grid-template-rows: minmax(2rem, max-content);
        
        //
        & .icon-box   { grid-column: 1 / 1; grid-row: 1 / 1; }
        & .label-box  { grid-column: 2 / 2; grid-row: 1 / 1; }
        & .in-element { grid-column: 3 / 3; grid-row: 1 / 1; }
        
        //
        &.area-alt {
            grid-template-columns: minmax(2rem, max-content) minmax(0px, 1fr);
            grid-template-rows: minmax(2rem, max-content) minmax(2rem, max-content);
            
            //
            & .icon-box   { grid-column: 1 / 1;  grid-row: 1 / 2; }
            & .in-element { grid-column: 2 / 2;  grid-row: 2 / 2; }
            & .label-box  { grid-column: 2 / 2; grid-row: 1 / 1; }
        }
        
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
