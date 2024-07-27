<script setup>
    import {reactive, watch, ref, onMounted, useAttrs} from "vue";
    import LucideIcon from "@idc/UI2/Vue/WLucideIcon.vue";

    //
    const attrs = useAttrs();
</script>

<template>
    <div
        class="ux-editor fixed"
        data-hidden="true"
        data-scheme="solid"
        v-bind="$attrs"
    >
        <div data-scheme="solid" class="field-content stretch" style="grid-row: field-edit;">
            <div class="field-wrap">
                <input
                    autofocus
                    autocomplete="off"
                    type="text"
                    maxlength="1024"
                />
            </div>
            <button type="button" tabindex="-1" data-scheme="solid" data-highlight="2" class="field-copy pe-enable">
                <LucideIcon name="copy" tabindex="-1" inert></LucideIcon>
            </button>
            <button type="button" tabindex="-1" data-scheme="solid" data-highlight="2" class="field-paste pe-enable">
                <LucideIcon name="clipboard" tabindex="-1" inert></LucideIcon>
            </button>
        </div>
    </div>
</template>

<!-- TEST ONLY! -->
<!--<input type="text" name="text" />
<input type="text" name="text" />-->
