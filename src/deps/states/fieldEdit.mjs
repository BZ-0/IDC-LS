import { writable } from "svelte/store"
import { fixSubscribe } from "./gridState.mjs"
import { whenMedia } from "./readables.mjs"

//
export const whenTouch = whenMedia("(hover: none) and (pointer: coarse)");

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
    if (id && id != null && id != "undefined") {
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

//
export const fromField = (idOrInput) => {
    const idOf =
        idOrInput?.dataset?.name ?? idOrInput?.dataset?.edit ?? idOrInput;
    const field =
        typeof idOrInput == "string"
            ? document.querySelector(
                  `input[data-name=\"${(idOf ||= fieldEditState.id)}\"]`
              )
            : idOrInput;
    if (field?.value != null && idOf && idOf != null && idOf != "undefined") {
        fields.set(idOf, field?.value);
    }
};

// may possible is input itself
export const focusField = (idOrInput) => {
    const idOf =
        idOrInput?.dataset?.name ?? idOrInput?.dataset?.edit ?? idOrInput;
    if (idOf && idOf != null && idOf != "undefined") {
        if (idOrInput?.value != null) {
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
    if (iconItem) {
        for (const k of fields.keys()) {
            const iconField = iconItem[k];
            if (iconField) {
                fields.set(k, iconField || "");
            }
        }
    }
};

//
export const applyForIcon = (onEdit) => {
    if (onEdit) {
        fixSubscribe(onEdit);
        for (const k of fields.keys()) {
            const field = fields.get(k) || "";
            onEdit.focusIconWrite[k].set(field);
        }
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
