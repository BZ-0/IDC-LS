import { makeWritableProperty } from "@states/writables.mjs";

//
export const settings = {};

//
makeWritableProperty(settings, "theme", {
    initial: parseInt(localStorage.getItem("@settings:@theme")) || 0,
    setter(v) {
        const target = document.documentElement;
        if (v == -1) {
            target.classList.remove("force-light");
            target.classList.remove("force-dark");
            if (!target.classList.contains("force-dark")) {
                target.classList.add("force-dark");
            }
        }
        if (v == 0) {
            target.classList.remove("force-light");
            target.classList.remove("force-dark");
        }
        if (v == 1) {
            target.classList.remove("force-light");
            target.classList.remove("force-dark");
            if (!target.classList.contains("force-light")) {
                target.classList.add("force-light");
            }
        }

        //
        localStorage.setItem("@settings:@theme", v || 0);
        return v;
    },
});

//
makeWritableProperty(settings, "orientation", {
    initial: parseInt(localStorage.getItem("@settings:@orientation")) || "auto",
    setter(v) {
        document.documentElement.dataset["orientation"] = v || "auto";
        localStorage.setItem("@settings:@orientation", v || "auto");
        (async () => {
            switch (v || "auto") {
                case "auto":
                    await screen.orientation.lock("any");
                    await screen.orientation.unlock();
                    break;

                case "lock":
                    await screen.orientation.lock(screen.orientation.type);
                    break;

                default:
                    await screen.orientation.lock(v || "auto");
                    break;
            }
        })().catch(console.warn.bind(console));
        return v;
    },
});

//
makeWritableProperty(settings, "columns", {
    initial: parseInt(localStorage.getItem("@settings:@columns")) || 4,
    setter(v) {
        document.documentElement.style.setProperty("--columns", v || 4);
        localStorage.setItem("@settings:@columns", v || 4);
        return v;
    },
});

//
makeWritableProperty(settings, "rows", {
    initial: parseInt(localStorage.getItem("@settings:@rows")) || 8,
    setter(v) {
        document.documentElement.style.setProperty("--rows", v || 8);
        localStorage.setItem("@settings:@rows", v || 8);
        return v;
    },
});

//
makeWritableProperty(settings, "scaling", {
    initial: parseFloat(localStorage.getItem("@settings:@scaling")) || 1,
    setter(v) {
        localStorage.setItem("@settings:@scaling", v);
        document.documentElement.style.setProperty("--scaling", v || 1);
        return v;
    },
});

//
makeWritableProperty(settings, "use-zoom", {
    initial: !!localStorage.getItem("@settings:@use-zoom") || false,
    setter(v) {
        localStorage.setItem("@settings:@use-zoom", v);

        //
        document.documentElement.classList.remove("__exp-use-zoom");
        document.documentElement.classList.remove("__use_font-size");

        //
        if (!!v) {
            document.documentElement.classList.remove("__use_font-size");
            document.documentElement.classList.add("__exp-use-zoom");
        } else {
            document.documentElement.classList.remove("__exp-use-zoom");
            document.documentElement.classList.add("__use_font-size");
        }

        //
        return v;
    },
});

//
{
    document.documentElement.classList.remove("__exp-use-zoom");
    document.documentElement.classList.remove("__use_font-size");

    //
    if (!!localStorage.getItem("@settings:@use-zoom") || false) {
        document.documentElement.classList.remove("__use_font-size");
        document.documentElement.classList.add("__exp-use-zoom");
    } else {
        document.documentElement.classList.remove("__exp-use-zoom");
        document.documentElement.classList.add("__use_font-size");
    }
}
