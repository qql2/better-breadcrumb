import { Plugin } from "obsidian";
import { App, inject } from "vue";
import MyPlugin from "./main";

export function setPlugin(app: App, plugin: Plugin) {
	app.provide("plugin", plugin);
}

export function usePlugin() {
	return inject<MyPlugin>("plugin");
}
