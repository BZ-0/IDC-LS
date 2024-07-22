<script context="module">
    import { MOC, propsFilter } from "@unite/scripts/utils/Utils.ts";
    import LucideIcon from "@idc/UI2/Svelte/WLucideIcon.svelte";
</script>

<div
    class="ux-editor fixed"
    data-hidden={true}
    data-scheme="transparent"
    {...propsFilter($$props)}
>
    <div data-scheme="solid" class="field-content stretch" style="grid-row: field-edit;">
        <div class="field-wrap">
            <input
                autofocus={true}
                autocomplete="off"
                type="text"
                maxlength="1024"
            />
        </div>
        <button type="button" tabindex="-1" data-scheme="solid" data-highlight="2" class="field-copy pe-enable">
            <LucideIcon name="copy" tabindex="-1" inert={true}></LucideIcon>
        </button>
        <button type="button" tabindex="-1" data-scheme="solid" data-highlight="2" class="field-paste pe-enable">
            <LucideIcon name="clipboard" tabindex="-1" inert={true}></LucideIcon>
        </button>
    </div>
</div>

<!-- TEST ONLY! -->
<!--<input type="text" name="text" />
<input type="text" name="text" />-->
