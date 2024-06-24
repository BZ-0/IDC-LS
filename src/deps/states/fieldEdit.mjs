import { makeWritableProperty } from "@states/writables.mjs"
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
export const fieldEditState = {};
export const fieldEditWrite = {
    value: makeWritableProperty(fieldEditState, "value", {
        initial: "",
        setter: (v) => {
            const id = fieldEditState.id;
            if (id && id != null && id != "undefined") {
                fields.set(id, v || "");
            }
            return v || "";
        },
    }),
    id: makeWritableProperty(fieldEditState, "id", { initial: "" }),
};

///////////////////////////
// applicants for fields //
///////////////////////////

//
export const reflectToField = (idOf, evName = "input", value = null) => {
    const onEdit = document.querySelector(
        `input[data-name=\"${(idOf ||= fieldEditState.id)}\"]`
    );
    if (onEdit) {
        if (value != null) {
            fields.set(idOf, value);
        }
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
        fieldEditState.value = target.value;
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
        fieldEditState.id = idOf;
        fieldEditState.value = fields.get(idOf);
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
        //fixSubscribe(onEdit);
        for (const k of fields.keys()) {
            const field = fields.get(k) || "";
            onEdit.focusIconWrite[k].set(field);
        }
    }
};
