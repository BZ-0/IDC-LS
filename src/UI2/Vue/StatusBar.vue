<script setup>
import LucideIcon from "./UWLucideIcon.vue";
import {reactive, watch, ref, onMounted} from "vue";

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
    <div class="ui-status-bar" data-transparent data-scheme="accent">
        <div class="left"></div>
        <div class="center"></div>
        <div class="right">
            <div class="icon-wrap ui-icon-state ui-network" data-icon="wifi">
                <LucideIcon name="wifi"></LucideIcon>
                <LucideIcon name="wifi-off"></LucideIcon>
                <LucideIcon name="wifi-high"></LucideIcon>
                <LucideIcon name="wifi-low"></LucideIcon>
                <LucideIcon name="wifi-zero"></LucideIcon>
            </div>
            <div class="icon-wrap ui-icon-state ui-battery" data-icon="battery-charging">
                <LucideIcon name="battery"></LucideIcon>
                <LucideIcon name="battery-full"></LucideIcon>
                <LucideIcon name="battery-low"></LucideIcon>
                <LucideIcon name="battery-medium"></LucideIcon>
                <LucideIcon name="battery-warning"></LucideIcon>
                <LucideIcon name="battery-charging"></LucideIcon>
            </div>
            <div class="time"><span class="ui-time-hour">00</span>:<span class="ui-time-minute">00</span></div>
        </div>
    </div>
</template>
