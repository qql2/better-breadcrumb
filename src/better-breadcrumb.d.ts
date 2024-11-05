import { Plugin } from "obsidian";
import { BT_BCAPI } from "./BT_BCAPI";
import type { BCAPI } from "breadcrumbs/src/api";
declare type MyPluginSettings = typeof DEFAULT_SETTINGS;
declare const DEFAULT_SETTINGS: {
    linkTypeHistory: string;
    fromNoteHistory: string;
};
declare global {
    interface Window {
        BCAPI: BCAPI;
        BT_BCAPI?: BT_BCAPI;
    }
}
export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;
    unloadFn: Function[];
    BT_BCAPI: BT_BCAPI;
    onload(): Promise<void>;
    openNoteFilter(): void;
    exposeAPI(): void;
    onunload(): void;
    loadSettings(): Promise<void>;
    saveSettings(): Promise<void>;
    activateView(): Promise<void>;
}
export {};
