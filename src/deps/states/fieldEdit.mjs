//
export const fields = new Map([
    ["icon", ""],
    ["label", ""],
    ["action", ""],
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

//
fieldEditWrite.value.subscribe((v) => {
    if (fieldEditState.id) {
        fields.set(fieldEditState.id, (fieldEditState.value = v || ""));
    }
});

//
export const applyToField = (idOf) => {
    const onEdit = document.querySelector(
        `input[data-name=\"${(idOf ||= fieldEditState.id)}\"]`
    );
    if (onEdit) {
        onEdit.value = fields.get(idOf);
        onEdit.dispatchEvent(
            new Event("change", {
                bubbles: true,
                cancelable: true,
            })
        );
    }
};

//
export const focusField = (idOf) => {
    fieldEditWrite.id.set(idOf);
    fieldEditWrite.value.set(fields.get(idOf));
};

//
export const importFromIcon = (iconItem) => {
    for (const k of fields.keys()) {
        fields.set(k, iconItem[k]);
        applyToField(k);
    }
};

//
export const applyForIcon = (iconItemWrite) => {
    for (const k of fields.keys()) {
        iconItemWrite?.[k]?.set?.(fields.get(k) || "");
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
