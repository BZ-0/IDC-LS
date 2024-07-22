<script setup>
    import { observeBySelector } from "@unite/scripts/dom/Observer.vue";

    //
    const props = defineProps({
        fields: Array,
        whatEdit: Object,
        confirm: Object
    });

    // isn't reactive, sorry...
    const whatEdit = props.whatEdit;//reactive({...});
    //props.whatEdit?.["@subscribe"]?.((v,p)=>{ if (state[p] !== v) { state[p] = v; synchronize(); } }); // react to vue
    //watch(() => whatEdit, (newVal, oldVal) => { for (const k in newVal) { if (props.whatEdit[k] !== newVal[k]) { props.whatEdit[k] = newVal[k]; } } }, {deep: true});
    // please, save such pattern for future!

    // isn't reactive, sorry...
    const fields = props.fields;
    //
    //const fields = reactive({...props.fields});
    //props.fields?.["@subscribe"]?.((v,p)=>{ if (state[p] !== v) { state[p] = v; synchronize(); } }); // react to vue
    //watch(() => fields, (newVal, oldVal) => { for (const k in newVal) { if (props.fields[k] !== newVal[k]) { props.fields[k] = newVal[k]; } } }, {deep: true});

    //
    let elRef = ref(null);

    //
    const confirm = ()=>{
        if (whatEdit) {
            for (const F of fields) {
                if (F.name in whatEdit) {
                    whatEdit[F.name] = F.value;
                };
            }
        }
    }

    //
    if (props.confirm) {
        props.confirm.value = confirm;
    }

    //
    const synchronize = (whatFrom)=>{
        //
        /*if (whatFrom && whatFrom != whatEdit) {
            whatEdit = whatFrom;
        }*/

        //
        if (whatEdit) {
            for (const F of fields) {
                if (F.name in whatEdit) {
                    F.value = whatEdit[F.name];
                };
            }
            fields = fields;
        }
    }

    //
    observeBySelector(elRef.value, ".ux-field-block", ()=>{
        synchronize();
    });

    //
    synchronize();

    //@change="confirm"
</script>

<!-- -->
<template>
    <form ref="elRef" class="ux-edit-form" autocomplete="off">
        <div class="ux-edit-desc">
            <slot name="description"/>
        </div>
            <div class="ux-field-block" v-for="F in fields">
                <div inert class="field-label">{{F.label}}</div>
                <input
                    class="field-input hl-1 hl-2h"
                    data-highlight="1"
                    data-highlight-hover="2"
                    type="text"
                    maxlength="1024"
                    autocomplete="off"
                    v-bind:value="F.value"
                    :name="F.name"
                    :data-name="F.name"
                    />
            </div>
    </form>
</template>
