<script setup>
    const FocusSelector = ".ux-modal-frame, .ux-modal, .ux-editor, input, button";
    const DNBSelector = "input[type=\"text\"], .ux-editor, input, button";

    //
    const props = defineProps({ self: Object });
    const elRef = props.self || ref(null);

    //
    document.addEventListener("click", (ev)=>{
        const target: HTMLElement = ev.target;
        const modalFrame = elRef.value;

        //
        if (!(modalFrame == target || target.matches(FocusSelector) || target.closest(FocusSelector)) && !(document?.activeElement?.matches(DNBSelector) || target.matches(DNBSelector) || target.closest(DNBSelector)) || target.matches(".ux-modal-frame button")) {
            if (modalFrame.value) {
                modalFrame.dataset.hidden = true;
            }
        }
    });

</script>

<template>
    <div ref="props.self" data-hidden="true" class="ux-modal-frame" v-bind="$attrs">
        <div class="cut-space">
            <slot></slot>
        </div>
    </div>
</template>
