import { readable } from "svelte/store";

//
export const whenMedia = (media = "") => {
    const md = matchMedia(media);
    return readable(md.matches, (set) => {
        md.addEventListener("change", ({ matches }) => {
            set(matches);
        });
    });
};

//
export const orientationType = () => {
    const md = matchMedia(media);
    return readable(screen.orientation.type, (set) => {
        screen.orientation.addEventListener("change", ({ type }) => {
            set(type);
        });
    });
};

//
export const orientationAngle = () => {
    const md = matchMedia(media);
    return readable(screen.orientation.angle, (set) => {
        screen.orientation.addEventListener("change", ({ angle }) => {
            set(angle);
        });
    });
};

// for listen settings window size (use it only when mount)
export const whenResize = (element, box = "border-box") => {
    if (!element) return null;
    return readable(
        [element?.clientWidth || 0, element?.clientHeight || 0],
        (set) => {
            //
            const obs = new ResizeObserver(() => {
                for (const entry of entries) {
                    const box =
                        entry[
                            box == "border-box"
                                ? "borderBoxSize"
                                : "contentBoxSize"
                        ][0];
                    if (box) {
                        set([box.inlineSize, box.blockSize]);
                    }
                }
            });

            //
            if (element) {
                obs.observe(element, { box });
            }
        }
    );
};
