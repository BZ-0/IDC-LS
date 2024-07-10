import {writable} from "svelte/store";
import {state} from "./GridState.ts";
import type {GridItemType} from "@unite/grid/GridItemUtils.ts";


//
export const onEditItem = writable<GridItemType>(null);


//
const actionMap = new Map<string, Function>([

    ["open-link", ({initiator}) => {

    }],


    ["edit-item", ({initiator}) => {
        if (initiator) {
            onEditItem.set(state.items.get(initiator.dataset.id || ""));
        }
    }],


    ["delete-item", ({initiator}) => {

    }],


    ["add-item", ({}) => {

    }]


]);

export default actionMap;
