<script setup>
    import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';

    //
    import Number from '@idc/UI2/Vue/Number.vue';
    import Switch from '@idc/UI2/Vue/Switch.vue';

    //
    import { state, layout, size } from "@idc/State/GridState.ts";
    import { settings } from "@idc/State/CurrentState.ts";

    //
    const props = defineProps({
        stateName: { type: String, default: "settings" },
        ifc: Boolean
    });

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
<template>
    <div class="ui-screen ui-content" id="settings" v-bind="$attrs">

        <div class="ui-nav" data-scheme="solid" data-highlight="1">
            <div class="f-space"></div>
            <button class="back-act hl-1 hl-2h" data-tooltip="Back" data-scheme="solid-transparent" data-highlight-hover="1">
                <LucideIcon inert slot="icon" name="arrow-left" class="icon"/>
            </button>
        </div>
        <x-scrollbox class="ui-space">

            <div is="flex-like" data-gap="16">
                <form v-if="forms" v-for="form in forms" data-page class="form-wrap hl-ns" data-name="grid-columns-row">
                    <div class="form-description">{{form.description}}</div>
                    <div v-if="form.fields" v-for="field in form.fields" class="ui-block-decor pe-none" style="--decor-size: 4rem;" >
                        <span class="opt-label">{{field.label}}</span>
                        <LucideIcon data-place="icon" :name="field.icon"/>

                        <div data-place="element">
                            <Number v-if="field.type == 'number'"
                                :min="field.params[0]"
                                :max="field.params[1]"
                                :step="field.params[2]"
                                :data-state="props.stateName"
                                :data-name="field.name"
                            ></Number>

                            <Switch v-if="field.type == 'switch'"
                                :data-state="props.stateName"
                                :data-name="field.name"
                            ></Switch>
                        </div>
                    </div>
                </form>
            </div>

        </x-scrollbox>

    </div>
</template>
