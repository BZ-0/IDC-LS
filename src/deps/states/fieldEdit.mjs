import { writable } from "svelte/store";
import { fixSubscribe } from "./gridState.mjs";

//
export const fields = new Map([
    ["icon", ""],
    ["label", ""],
    ["action", ""],
    ["href", ""],
]);

//
export const fieldEditState = { value: "", id: "" };
export const fieldEditWrite = {
    value: writable(""),
    id: writable(""),
};

//
fieldEditWrite.id.subscribe((v) => {
    fieldEditState.id = v;
});
fieldEditWrite.value.subscribe((v) => {
    const { id } = fieldEditState;
    if (id) {
        fields.set(id, (fieldEditState.value = v || ""));
    }
});

///////////////////////////
// applicants for fields //
///////////////////////////

//
export const reflectToField = (idOf, evName = "input") => {
    const onEdit = document.querySelector(
        `input[data-name=\"${(idOf ||= fieldEditState.id)}\"]`
    );
    if (onEdit) {
        /*if (onEdit.value) {
            fields.set(idOf, onEdit.value);
        }*/
        onEdit.value = fields.get(idOf) || "";
        onEdit.dispatchEvent(
            new Event(evName || "input", {
                bubbles: true,
                cancelable: true,
            })
        );
    }
};

//
export const onInputChange = ({ target }) => {
    if (target.value != null) {
        fieldEditWrite.value.set(target.value);
    }
};

//
export const listenChanges = (field) => {
    field.addEventListener("input", onInputChange);
    field.addEventListener("change", onInputChange);
};

//
export const bindToFieldEdit = (input) => {
    const id = input?.dataset?.edit || "";
    input?.addEventListener?.("change", (ev) => reflectToField(id, "change"));
    input?.addEventListener?.("input", (ev) => reflectToField(id, "input"));
    if (input) {
        reflectToField(id, "change");
    }
};

// may possible is input itself
export const focusField = (idOrInput) => {
    const idOf =
        idOrInput?.dataset?.name ?? idOrInput?.dataset?.edit ?? idOrInput;
    if (idOf) {
        if (idOrInput?.value) {
            fields.set(idOf, idOrInput?.value);
        }
        fieldEditWrite.id.set(idOf);
        fieldEditWrite.value.set(fields.get(idOf));
    }
};

//////////////////////////
// applicants for icons //
//////////////////////////

//
export const importFromIcon = (iconItem) => {
    for (const k of fields.keys()) {
        fields.set(k, iconItem[k]);
    }
};

//
export const applyForIcon = (onEdit) => {
    fixSubscribe(onEdit);
    for (const k of fields.keys()) {
        onEdit.focusIconWrite[k].set(fields.get(k) || "");
    }
};

// for example...
/*
    export const fieldEditState = {
        value: "",
        id: "",
    };
    
    //
    fieldEditWrite.value.subscribe((v) => (fieldEditState.value = v));
    fieldEditWrite.id.subscribe((v) => (fieldEditState.id = v));
*/
