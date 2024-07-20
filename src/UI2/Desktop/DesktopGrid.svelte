<script lang="ts" type="ts">
    import { onMount } from "svelte";
    import States from "@unite/scripts/reactive/StateManager.ts"
    import { makeReactiveObject } from "@unite/scripts/reactive/ReactiveObject.ts";
    import {observeBySelector, observeBorderBox} from "@unite/scripts/dom/Observer.ts";

    //
    import GridPage from "./GridPage.svelte";
    import { getCorrectOrientation } from "@unite/scripts/utils/Utils.ts";

    //
    export let state = null;
    export let settings = States.getState("settings");
    export let actionMap = States.getState("actionMap");

    //
    let lists = state?.lists;
    let grids = state?.grids;
    let items = state?.items;

    //
    let gridPage = null;
    let target = null;
    let columns = settings?.columns || 4, rows = settings?.rows || 8;
    let current = "main";

    //
    const changeLayout = ()=>{
        target?.style?.setProperty?.("--columns", columns as unknown as string, "")
        target?.style?.setProperty?.("--rows", rows as unknown as string, "")
    }

    //
    settings?.["@subscribe"]?.((value, prop)=>{
        if (prop == "columns") { columns = value; };
        if (prop == "rows") { rows = value; };
        changeLayout();
    });

    //
    onMount(()=>{
        //
        States.bindState(target, state, ()=>{
            grids = state?.grids;
            items = state?.items;
            lists = state?.lists;
        }).stateBehave(target, (element, prop, value)=>{
            if (prop == "grids") grids = state?.grids;
            if (prop == "items") items = state?.items;
            if (prop == "lists") lists = state?.lists;
        });

        //
        changeLayout();
        
        //
        observeBorderBox(gridPage, (box)=>{
            const idc = 0;

            //
            Array.from(grids.values()).map((g)=>{
                g.size = [box.inlineSize, box.blockSize];
            });

            //
            gridPage?.style?.setProperty?.(["--grid-w", "--grid-h"][idc], box.inlineSize as unknown as string, "")
            gridPage?.style?.setProperty?.(["--grid-h", "--grid-w"][idc], box.blockSize as unknown as string, "")
        })

        //
        target?.addEventListener("dragenter", (ev)=>{
            if (document.elementFromPoint(ev.clientX, ev.clientY)?.matches?.(".ux-grid-desktop, canvas[is=\"w-canvas\"]")) {
                ev.preventDefault();
            }
        });
        
        //
        target?.addEventListener("dragover", (ev)=>{
            if (document.elementFromPoint(ev.clientX, ev.clientY)?.matches?.(".ux-grid-desktop, canvas[is=\"w-canvas\"]")) {
                ev.preventDefault();
            }
        });
        
        //
        target?.addEventListener("drop", (ev)=>{
            if (document.elementFromPoint(ev.clientX, ev.clientY)?.matches?.(".ux-grid-desktop, canvas[is=\"w-canvas\"]")) {
                ev.preventDefault();
                
                //
                const {dataTransfer} = ev;
                const file = dataTransfer?.files?.[0];
                if (file != null) {
                    const wallpaper = document.querySelector("canvas[is=\"w-canvas\"]");
                    wallpaper?.["$useImageAsSource"]?.(file);
                }
            }
        });

    });

</script>

<!-- -->
<div bind:this={target} data-transparent data-current-page={current} data-ctx="grid-space" data-scheme="accent-inverse" class="ux-desktop-grid stretch grid-based-box pe-enable">
    
    <div bind:this={gridPage} class="ux-grid-page stretch grid-based-box" data-transparent>
        <GridPage list={lists.get(current)} gridPage={grids.get(current)} items={items} type="labels"></GridPage>
        <GridPage list={lists.get(current)} gridPage={grids.get(current)} items={items} actionMap={actionMap} type="items"></GridPage>
    </div>
    
</div>

