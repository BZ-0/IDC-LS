const useBabel = true;
const sourceMapsInProduction = true;

//
import { svelte } from "@sveltejs/vite-plugin-svelte";
import legacy from "@vitejs/plugin-legacy";
import autoprefixer from "autoprefixer";
import path from "path";
import sveltePreprocess from "svelte-preprocess";
import { defineConfig, type UserConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import certificate from "./https/certificate.mjs"
import pkg from "./package.json";
import tsconfig from "./tsconfig.json";

//
const __dirname = import.meta.dirname;

const r = (s) => {
	return s;
};

//
const production = process.env.NODE_ENV === 'production';
const config = <UserConfig>defineConfig({
	root: "./src",

	alias: {
		"@": r("/src"),
		"@src": r("/src"),
		"@deps": r("/src/deps"),
		"@libraries": r("/src/libraries"),
		"@workers": r("/src/workers"),
		"@tests": r("/src/tests"),
		"@modules": r("/src/modules"),
		"@svelte": r("/src/modules/svelte"),
		"@webcomp": r("/src/modules/webcomp"),
		"@states": r("/src/modules/states"),
		"@bundle": r("/src/bundle"),
	},

	plugins: [
		svelte({
			emitCss: production,
			preprocess: sveltePreprocess(),
		}),
		VitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: true,
				resolveTempFolder: () => {
					return "./dist";
				},
			},
			workbox: {
				clientsClaim: true,
				skipWaiting: true,
			},
		}),
	],
	server: {
		host: "0.0.0.0",
		port: 8000,
		https: {
			...certificate,
		},
	},
	build: {
		sourcemap: sourceMapsInProduction,
		outDir: "../dist",
		emptyOutDir: true,
		rollupOptions: {
			input: "../dist/index.html",
		},
	},
	css: {
		postcss: {
			plugins: [autoprefixer()],
		},
	},
});

// Babel
if (useBabel) {
    config.plugins?.unshift(
        legacy({
            targets: pkg.browserslist,
        }),
    );
}

// Load path aliases from the tsconfig.json file
const aliases = tsconfig.compilerOptions.paths;

for (const alias in aliases) {
    const paths = aliases[alias].map((p: string) => path.resolve(__dirname, p));

    // Our tsconfig uses glob path formats, whereas vite just wants directories
    // We'll need to transform the glob format into a format acceptable to vite

    const viteAlias = alias.replace(/(\\|\/)\*$/, '');
    const vitePaths = paths.map((p: string) => p.replace(/(\\|\/)\*$/, ''));

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};

    if (config.resolve && config.resolve.alias && !(viteAlias in config.resolve.alias)) {
        config.resolve.alias[viteAlias] = vitePaths.length > 1 ? vitePaths : vitePaths[0];
    }
}

export default config;
