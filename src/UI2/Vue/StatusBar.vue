<script setup>
import {reactive, watch, ref, onMounted} from "vue";

//
import Signal from "./Status/Signal.vue";
import Battery from "./Status/Battery.vue";
import Time from "./Status/Time.vue";

//
document.documentElement.addEventListener("contextmenu", (ev)=>{
	const target = ev.target;
	if ((target?.matches?.(".ui-status-bar") || target?.closest?.(".ui-status-bar"))) {
		ev.stopPropagation();
		ev.stopImmediatePropagation();
		ev.preventDefault();
	}
}, {capture: true});

</script>

<!-- -->
<template>
    <div class="ui-status-bar" data-transparent data-scheme="dynamic-transparent">
        <div class="left">
            <Time></Time>
        </div>
        <div class="center"></div>
        <div class="right">
            <Signal></Signal>
            <Battery></Battery>
        </div>
    </div>
</template>
