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
fieldEditWrite.id.subscribe((v) => {fieldEditState.id = v; });
fieldEditWrite.value.subscribe((v) => {
    const {id} = fieldEditState;
    if (id) { fields.set(id, (fieldEditState.value = v || "")); }
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
export const bindToFieldEdit = (input)=>{
    const id = input.dataset.edit;
    input?.addEventListener?.("change", (ev)=>reflectToField(id, "change"));
    input?.addEventListener?.("input", (ev)=>reflectToField(id, "input"));
}

// may possible is input itself
export const focusField = (idOrInput) => {
    const ifOd = idOrInput?.dataset?.name ?? idOrInput?.dataset?.edit ?? idOrInput;
    if (ifOd) {
        fieldEditWrite.id.set(ifOd);
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
