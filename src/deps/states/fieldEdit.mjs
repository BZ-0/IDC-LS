import { makeWritableProperty } from "@states/writables.mjs"
import { whenMedia } from "./readables.mjs"

//
export const whenTouch = whenMedia("(hover: none) and (pointer: coarse)");

//
export const fieldsData = new Map([
    // icon-items
    ["item-icon", ""],
    ["item-label", ""],
    ["item-action", ""],
    ["item-href", ""],
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
    idOf ||= fieldEditState.id;
    if (!idOf) return;

    //
    const onEdit = document.querySelector(
        `input[data-name=\"${(idOf)}\"]`
    );
    if (onEdit && onEdit?.dataset?.name == idOf) {
        if (value) {
            fieldsData.set(idOf, value);
        }
        onEdit.value = fieldsData.get(idOf) || "";
        onEdit.dispatchEvent(
            new Event(evName || "input", {
                bubbles: false,
                cancelable: true,
            })
        );
    }
};

//
export const fieldToData = (idOrInput) => {
    const idOf = idOrInput?.dataset?.name ?? idOrInput?.dataset?.edit ?? (typeof idOrInput == "string" ? idOrInput : fieldEditState.id);
    const field =
        typeof idOrInput == "string"
            ? document.querySelector(
                  `input[data-name=\"${(idOf)}\"]`
              )
            : idOrInput;
    if (field?.value != null && idOf && idOf != null && idOf != "undefined") {
        fieldEditState.id = idOf;
        fieldEditState.value = field?.value;
        fieldsData.set(idOf, field?.value);
    }
};

// may possible is input itself
export const focusField = (idOrInput) => {
    const idOf = idOrInput?.dataset?.name ?? idOrInput?.dataset?.edit ?? (typeof idOrInput == "string" ? idOrInput : fieldEditState.id);
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

// GitVerse Test

//
export const iconFields = ["icon", "label", "action", "href"];

//
export const importFromIcon = (iconItem) => {
    if (iconItem) {
        for (const k of iconFields) {
            const iconField = iconItem[k];
            if (iconField) {
                fieldsData.set("item-" + k, iconField || "");
            }
        }
    }
};

//
export const applyForIcon = (onEdit) => {
    if (onEdit) {
        //fixSubscribe(onEdit);
        for (const k of iconFields) {
            const field = fieldsData.get("item-" + k) || "";
            onEdit.focusIconWrite[k].set(field);
        }
    }
};
