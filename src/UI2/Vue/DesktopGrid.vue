<script setup>
    import {reactive, watch, ref, onMounted, computed } from "vue";

    //
    import States from "@unite/scripts/reactive/StateManager.ts"
    import { makeReactiveObject } from "@unite/scripts/reactive/ReactiveObject.ts";
    import {observeBySelector, observeBorderBox} from "@unite/scripts/dom/Observer.ts";

    //
    import GridItem from "./GridItem.vue";
    import GridItemLabel from "./GridItemLabel.vue";

    //
    const props = defineProps({
        state: Object,
        actionMap: Object
    });

    //
    const current = ref("main");

    //
    const isItemInList = (id)=>{
        const item = typeof id == "string" ? props.state.items.get(id) : id;
        const ptr = item.pointerId;
        return props.state.lists.get(current.value)?.has?.(item.id) || (ptr != null && ptr >= 0);
    }
    const getItems = (items)=>{ return Array.from(items.values()).filter((item)=>isItemInList(item)); }

    //
    const state = reactive({...props.state}); // react from vue
    props.state?.["@subscribe"]?.((v,p)=>{ if (state[p] !== v) { state[p] = v; }}); // react to vue
    watch(() => state, (newVal, oldVal) => { for (const k in newVal) { if (props.state[k] !== newVal[k]) { props.state[k] = newVal[k]; } } }, {deep: true});

    // read-only, skip ir-reactivity...
    const $settings = States.getState("settings");
    const settings = reactive({...$settings}); $settings?.["@subscribe"]?.((v,p)=>(settings[p] = v));

    //
    const actionMap = props.actionMap || States.getState("actionMap");

    //
    const elRef = ref(null);
    const gpRef = ref(null);

    //
    const changeLayout = ()=>{
        elRef.value?.style?.setProperty?.("--columns", settings.columns, "")
        elRef.value?.style?.setProperty?.("--rows", settings.rows, "")
    }

    //
    settings?.["@subscribe"]?.((value, prop)=>{
        changeLayout();
    });

    //
    const onItemClick = (ev)=>{
        const target = ev.target;
        actionMap?.get?.(target.dataset.action)?.({
            initiator: target
        });
    }

    //
    changeLayout();

    //
    onMounted(()=>{
        if (gpRef.value) {
            States.bindState(elRef.value, props.state, ()=>{})
            observeBorderBox(gpRef.value, (box)=>{
                const idc = 0;

                //
                Array.from(props.state.grids.values()).map((g)=>{
                    g.size = [box.inlineSize, box.blockSize];
                });

                //
                gpRef.value?.style?.setProperty?.(["--grid-w", "--grid-h"][idc], box.inlineSize, "")
                gpRef.value?.style?.setProperty?.(["--grid-h", "--grid-w"][idc], box.blockSize, "")
            })
        }
    });

    //
    const wp = localStorage.getItem("@wallpaper") || "./assets/wallpaper/0.jpg";

    // native VUE reactivity doesn't supported here...
    const items = ref(getItems(state.items));
    props.state?.["@subscribe"]?.((v,p)=>{ if (state[p] !== v) {
        items.value = getItems(state.items);
    }}, "items")
</script>

<!-- -->
<template>
    <canvas is="w-canvas" :data-src="wp"></canvas>
    <div :key="state" ref="elRef" data-transparent :data-current-page="current" data-ctx="grid-space" data-scheme="accent-inverse" class="ux-desktop-grid stretch grid-based-box pe-enable">

        <div class="ux-grid-layout ux-grid-page" data-transparent>
            <GridItemLabel v-if="items" v-for="item in items" :key="item.id" type="labels" :gridItem="item"></GridItemLabel>
        </div>

        <div ref="gpRef" class="ux-grid-layout ux-grid-page" data-transparent>
            <GridItem v-if="items" v-for="item in items" :key="item.id" type="items" :onClick="onItemClick" :gridItem="item"></GridItem>
        </div>
    </div>
</template>
