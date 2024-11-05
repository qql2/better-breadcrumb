import { Plugin } from "obsidian";
import { App } from "vue";
import MyPlugin from "./better-breadcrumb";
export declare function setPlugin(app: App, plugin: Plugin): void;
export declare function usePlugin(): MyPlugin | undefined;
