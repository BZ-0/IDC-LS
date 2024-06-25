{#each contextMenus as [id, menu]}
    {#if id == initiator?.dataset?.ctx}
        <div bind:this={ctxMenuElement} class="ls-contextmenu" data-name={id}>
            <ul>
                {#each menu as button}
                    <li><div class="ctx-button" data-action={button.action}> {button.label} </div></li>
                {/each}
            </ul>
        </div>
    {/if}
{/each}

<script>
    import { actionRegistry } from '@workers/actionRegistry.mjs';
    import { onMount } from 'svelte';

    //
    export let initiator = null;
    export let contextMenus = [
        ["grid", [
            { action: "change-wallpaper", label: "Change Wallpaper" },
            { action: "open-settings", label: "Open Settings" }
        ]],
        ["icon", [
            { action: "edit-icon", label: "Edit Icon" },
            { action: "delete-icon", label: "Delete Icon" }
        ]]
    ];

    //
    document.addEventListener("contextmenu", (ev)=>{
        ev.preventDefault();

        // from data-ctx holders
        const realElement = ev.target.matches("[data-ctx]") ? ev.target : ev.target.closest("[data-ctx]");
        if (realElement) { initiator = realElement, contextMenus = contextMenus; }
    });

    //
    document.addEventListener("click", (ev)=>{
        const forbidSelectors = ".field-edit, .lx-modal";
        const parentAreContextMenu = ev.target.matches(".ls-contextmenu") ? ev.target : ev.target.closest(".ls-contextmenu");
        if (parentAreContextMenu && ev.target.matches("ctx-button")) {
            const button = ev.target;
            if (initiator) {
                actionRegistry.get(button.dataset.action)?.(initiator, ev);
            }
        } else 

        // don't close modal when such selectors...
        if (!parentAreContextMenu && !(ev.target.matches(forbidSelectors) || ev.target.closest(forbidSelectors))) {
            initiator = null;
        }
    });

    //
    onMount(()=>{
        
    });
</script>
