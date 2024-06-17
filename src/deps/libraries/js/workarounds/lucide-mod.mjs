import replaceElement from "./replaceElement-mod.mjs";

//
const lucide = (await import("@libraries/js/cdn/lucide-cdn.mjs")).default;
const { createElement } = lucide;

//
export const createIcons = ({ icons = {}, nameAttr = 'data-lucide', attrs = {}, rootElement = document } = {}) => {
    if (!Object.values(icons).length) {
        throw new Error(
            "Please provide an icons object.\nIf you want to use all the icons you can import it like:\n `import { createIcons, icons } from 'lucide';\nlucide.createIcons({icons});`",
        );
    }

    if (typeof rootElement === 'undefined') {
        throw new Error('`createIcons()` only works in a browser environment.');
    }

    const elementsToReplace = rootElement.querySelectorAll(`[${nameAttr}]`);
    Array.from(elementsToReplace).forEach((element) =>
        replaceElement(element, { nameAttr, icons, attrs }),
    );

      /** @todo: remove this block in v1.0 */
    if (nameAttr === 'data-lucide') {
        const deprecatedElements = rootElement.querySelectorAll('[icon-name]');
        if (deprecatedElements.length > 0) {
            console.warn(
                '[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide',
            );
            Array.from(deprecatedElements).forEach((element) =>
                replaceElement(element, { nameAttr: 'icon-name', icons, attrs }),
            );
        }
    }
}

//
export { createElement };
export const icons = lucide.icons;
