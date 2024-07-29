<script setup>
import LucideIcon from "./WLucideIcon.vue";
import {reactive, watch, ref, onMounted} from "vue";

//
const signal = ref(navigator.onLine ? (navigator?.connection?.effectiveType || "4g") : "offline");
const signalIcons = {
    "offline": "wifi-off",
    "4g": "wifi",
    "3g": "wifi-high",
    "2g": "wifi-low",
    "slow-2g": "wifi-zero"
}

//
{
    //
    const changeSignal = ()=>{
        if (navigator.onLine) {
            signal.value = navigator?.connection?.effectiveType || "4g";
        } else {
            signal.value = "offline";
        }
    }
    navigator.connection?.addEventListener("change", changeSignal);

    //
    changeSignal();
};

//
const battery = ref("battery-full");
{
    const batteryStatus = navigator.getBattery?.();
    const batteryIcons = new Map([
        [0, "battery-warning"],
        [25, "battery"],
        [50, " battery-low"],
        [75, "battery-medium"],
        [100, "battery-full"],
    ]);

    //
    const byLevel = (lv = 1.0)=>{
        return batteryIcons.get(Math.ceil(lv / 0.25) * 25);
    }

    //
    const changeBatteryStatus = ()=>{
        batteryStatus?.then?.((btr)=>{
            if (btr.charging)
                { battery.value = "battery-charging"; }  else
                { battery.value = byLevel(btr.level); };
        }).catch(console.warn.bind(console));
    }

    //
    batteryStatus?.then?.((btr)=>{
        btr.addEventListener("chargingchange", changeBatteryStatus);
        btr.addEventListener("levelchange", changeBatteryStatus);
    });

    //
    changeBatteryStatus();
};

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
            <div class="icon-wrap"><LucideIcon :name="signalIcons[signal] || 'wifi'"></LucideIcon></div>
            <div class="icon-wrap"><LucideIcon :name="battery || 'battery-full'"></LucideIcon></div>
            <div class="time"><span class="ui-time-hour"></span>:<span class="ui-time-minute"></span></div>
        </div>
    </div>
</template>
