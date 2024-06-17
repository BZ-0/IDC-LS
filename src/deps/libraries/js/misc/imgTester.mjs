import { convertPointFromPageToNode, convertPointFromNodeToPage } from '../dom/geometryUtils.mjs';

//
/*
export const obscureImage = async (img, t = 0.1) => {
    await img.decode();

    //
    const can = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
    const ctx = can.getContext('2d', {
        desynchronized: true,
        willReadFrequently: true,
    });

    // needs to be animated?
    {
        ctx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);
        ctx.drawImage(img, 0, 0);
    }

    //
    img.addEventListener('load', (e) => {
        can.width = img.naturalWidth;
        can.height = img.naturalHeight;
        ctx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);
        ctx.drawImage(img, 0, 0);
    });

    //
    const msc = (e) => {
        e.stopPropagation();

        //
        const p = convertPointFromPageToNode(img, e.pageX, e.pageY);
        const matrix = new DOMMatrix();

        // First, center the image
        const elementCenter = new DOMPoint(img.offsetWidth / 2, img.offsetHeight / 2);
        const imageCenter = new DOMPoint(img.naturalWidth / 2, img.naturalHeight / 2);
        matrix.translateSelf(elementCenter.x - imageCenter.x, elementCenter.y - imageCenter.y);

        // And now zoom
        // Containing the object take the minimal zoom
        const zoom = Math.min(img.offsetWidth / img.naturalWidth, img.offsetHeight / img.naturalHeight);
        matrix.scaleSelf(zoom, zoom, 1, imageCenter.x, imageCenter.y);

        //
        const c = matrix.inverse().transformPoint(p);
        const r = c.x >= 0 && c.y >= 0 && c.x < img.naturalWidth && c.y < img.naturalHeight && ctx.getImageData(c.x, c.y, 1, 1).data[3] >= t * 255;

        //
        //img.style.pointerEvents = r ? "bounding-box" : "none";
        img.style.pointerEvents = r ? 'auto' : 'none';
        img.style.cursor = r ? 'inherit' : 'auto';
    };

    //
    document.addEventListener('pointermove', msc, { passive: false, capture: true });
    document.addEventListener('pointerdown', msc, { passive: false, capture: true });
    document.addEventListener('pointerup', msc, { passive: false, capture: true });
};
*/
