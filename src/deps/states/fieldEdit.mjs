import { makeWritableProperty } from "@states/writables.mjs"
import { whenMedia } from "./readables.mjs"

//
export const whenTouch = whenMedia("(hover: none) and (pointer: coarse)");

//
export const fieldsData = new Map([
    ["icon", ""],
    ["label", ""],
    ["action", ""],
    ["href", ""],
]);

//
export const fieldEditState = {};
export const fieldEditWrite = {
    value: makeWritableProperty(fieldEditState, "value", {
        initial: "",
        setter: (v) => {
            const id = fieldEditState.id;
            if (id && id != null && id != "undefined") {
                fieldsData.set(id, v || "");
            }
            return v || "";
        },
    }),
    id: makeWritableProperty(fieldEditState, "id", { initial: "" }),
};

///////////////////////////
// applicants for fieldsData //
///////////////////////////

//
export const reflectToField = (idOf, evName = "input", value = null) => {
    const onEdit = document.querySelector(
        `input[data-name=\"${(idOf ||= fieldEditState.id)}\"]`
    );
    if (onEdit) {
        if (value != null) {
            fieldsData.set(idOf, value);
        }
        onEdit.value = fieldsData.get(idOf) || "";
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
        fieldEditState.value = target.value;
    }
};

//
export const listenChanges = (field) => {
    if (!field) return;
    field.addEventListener("input", onInputChange);
    field.addEventListener("change", onInputChange);
};

//
export const bindToFieldEdit = (input) => {
    const id = input?.dataset?.edit || "";
    input?.addEventListener?.("change", (ev) =>
        reflectToField(id, "change", ev.target.value)
    );
    input?.addEventListener?.("input", (ev) =>
        reflectToField(id, "input", ev.target.value)
    );
    if (input) {
        reflectToField(id, "change", input.value);
    }
};

//
export const fieldToData = (idOrInput) => {
    const idOf = (idOrInput?.dataset?.name ?? idOrInput?.dataset?.edit ?? idOrInput) || fieldEditState.id;
    const field =
        typeof idOrInput == "string"
            ? document.querySelector(
                  `input[data-name=\"${(idOf)}\"]`
              )
            : idOrInput;
    if (field?.value != null && idOf && idOf != null && idOf != "undefined") {
        fieldsData.set(idOf, field?.value);
    }
};

// may possible is input itself
export const focusField = (idOrInput) => {
    const idOf =
        idOrInput?.dataset?.name ?? idOrInput?.dataset?.edit ?? idOrInput;
    if (idOf && idOf != null && idOf != "undefined") {
        if (idOrInput?.value != null) {
            fieldsData.set(idOf, idOrInput?.value);
        }
        fieldEditState.id = idOf;
        fieldEditState.value = fieldsData.get(idOf);
    }
};

//////////////////////////
// applicants for icons //
//////////////////////////

//
export const importFromIcon = (iconItem) => {
    if (iconItem) {
        for (const k of fieldsData.keys()) {
            const iconField = iconItem[k];
            if (iconField) {
                fieldsData.set(k, iconField || "");
            }
        }
    }
};

//
export const applyForIcon = (onEdit) => {
    if (onEdit) {
        //fixSubscribe(onEdit);
        for (const k of fieldsData.keys()) {
            const field = fieldsData.get(k) || "";
            onEdit.focusIconWrite[k].set(field);
        }
    }
};
