import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BREADCRUMBS_PATH = resolve(__dirname, '../../../../breadcrumbs');

export default defineConfig({
	input: './src/better-breadcrumb.ts',
	output: {
		file: 'index.d.ts',
		format: 'es',
	},
	external: [
		'obsidian',
		'vue',
		'breadcrumbs',
		/\.vue$/,
		/^src\//,
		'dataview'
	],
	plugins: [
		dts({
			respectExternal: true,
			tsconfig: './tsconfig.types.json',
			inline: true,
			exclude: [
				'node_modules/**',
				'src/**/*.vue'
			]
		})
	]
}); 