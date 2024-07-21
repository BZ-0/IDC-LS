<script>
    import LucideIcon from '@idc/UI2/Design/WLucideIcon.svelte';
    import Block from '@idc/UI2/Design/Block/Block.svelte';

    //
    import Number from '@idc/UI2/Inputs/Number/Number.svelte';
    import Switch from '@idc/UI2/Inputs/Switch/Switch.svelte';

    //
    import { state, layout, size } from "../../State/GridState.ts";
    import { settings } from "../../State/CurrentState.ts";

    //
    import { onMount } from 'svelte';
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";

    //
    export let stateName = "settings";

    //
    const forms = [
        {
            description: "Grid Layout Settings: ",
            fields: [
                {label: "Columns: ", icon: "columns-3", type: "number", params: [4, 6, 1], name: "columns"}, 
                {label: "Rows: ", icon: "rows-3", type: "number", params: [8, 12, 1], name: "rows"}, 
            ]
        },
        {
            description: "Display Settings: ",
            fields: [
                {label: "Scaling: ", icon: "scaling", type: "number", params: [0.5, 1.5, 0.125], name: "scaling"}, 
                {label: "Theme: ", icon: "sun-moon", type: "switch", params: [-1, 1, 1], name: "theme"}, 
            ]
        }
    ]

</script>

<!-- -->
<div class="ls-screen" id="settings">

    <div class="ls-nav" data-scheme="solid" data-highlight="1">
        <div class="f-space"></div>
        <button class="back-act hl-1 hl-2h">
            <div inert={true} class="icon"><LucideIcon slot="icon" name={"arrow-left"}/></div>
            <div inert={true} class="name">Back</div>
        </button>
    </div>
    <x-scrollbox class="ux-space" transition:fade={{ delay: 0, duration: 100 }}>

        {#each forms as form}
            <form data-page class="form-wrap hl-ns" data-name="grid-columns-row">
                <div class="form-description">{form.description}</div>
                {#each form.fields as field}
                    
                    <Block class="ux-block-decor pe-none" style="--decor-size: 4rem;" >
                        <span class="opt-label">{field.label}</span>
                        <LucideIcon data-place="icon" name={field.icon}/>
                        
                        <div data-place="element" >
                        {#if field.type == "number"}
                            <Number 
                                min={field.params[0]} 
                                max={field.params[1]} 
                                step={field.params[2]} 
                                data-state={stateName} 
                                data-name={field.name}
                            ></Number>
                        {/if}

                        {#if field.type == "switch"}
                            <Switch 
                                data-state={stateName} 
                                data-name={field.name}
                            ></Switch>
                        {/if}
                    </div>

                    </Block>
                {/each}
            </form>
        {/each}

    </x-scrollbox>

</div>
