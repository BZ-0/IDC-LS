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
