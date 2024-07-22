<script setup>
import GestureControl from "@unite/scripts/interact/Gesture.ts";
import { ref } from 'vue'

//
const props = defineProps({
    gridItem: Object,
    onClick: Function
});

// bad mine, be accurate!
const gridItem = reactive(props.gridItem); // react from vue
props.gridItem?.["@subscribe"]?.((v,p)=>{ if (gridItem[p] !== v) { gridItem[p] = v; } }); // react to vue
// any react from external property will react to vue.
// any react from vue will "do" react in external (except no strict change, due avoid "stack exceeded" issue)

// but due `gridItem` is copy, just re-set back into property object (and avoid recursions)...
watch(() => gridItem, (newVal, oldVal) => { for (const k in newVal) { if (props.gridItem[k] !== newVal[k]) { props.gridItem[k] = newVal[k]; } } }, {deep: true});
// please, save such pattern for future!

//
const onClick = props.onClick || ()=>{};

//
const gest = new GestureControl(target);
const target = ref(null);

//
gest.longPress({
    anyPointer: true,
    mouseImmediate: true,
    minHoldTime: 60 * 3600,
    maxHoldTime: 100
});

//
target?.style?.setProperty?.("--cell-x", (gridItem?.cell?.[0] || 0) as unknown as string, "")
target?.style?.setProperty?.("--cell-y", (gridItem?.cell?.[1] || 0) as unknown as string, "")

</script>


<div ref="target" @click="onClick">

</div>
