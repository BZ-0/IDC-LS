{#each contextMenus as [id, menu]}
    {#if id == initiator?.dataset?.ctx}
        <div class="ls-contextmenu solid apply-color-theme" data-name={id}>
            <ul>
                {#each menu as button}
                    <li class="ctx-button solid hl-1h apply-color-theme" data-action={button.action}>
                        <div class="icon-wrap" style="grid-column: icon;"><LucideIcon name={button.icon}></LucideIcon></div>
                        <div class="ctx-label" style="grid-column: label;"> <span>{button.label}</span> </div>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
{/each}

<script>
	import LucideIcon from '@svelte/decors/LucideIcon.svelte';
	import { actionRegistry } from '@workers/actionRegistry.mjs';
	import { onMount } from 'svelte';

    //
    export let initiator = null;
    export let contextMenus = [
        ["grid", [
            { action: "create-icon", label: "Create Icon", icon: "badge-plus"},
            { action: "change-wallpaper", label: "Change Wallpaper", icon: "wallpaper" },
            { action: "open-settings", label: "Open Settings", icon: "settings" }
        ]],
        ["icon", [
            { action: "edit-icon", label: "Edit Icon", icon: "pencil-line" },
            { action: "delete-icon", label: "Delete Icon", icon: "badge-x" }
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
        const forbidSelectors = ".icon-edit .field-edit, .lx-modal";
        const parentAreContextMenu = ev.target.matches(".ls-contextmenu") ? ev.target : ev.target.closest(".ls-contextmenu");

        //
        if (parentAreContextMenu && ev.target.matches("ctx-button")) {
            const button = ev.target;
            if (initiator) {
                actionRegistry.get(button.dataset.action || "")?.(initiator, ev);
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
