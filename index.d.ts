declare module "view" {
    import { ItemView, WorkspaceLeaf } from 'obsidian';
    import { App as VueApp } from 'vue';
    export const VIEW_TYPE: string;
    export class MyView extends ItemView {
        vueapp: VueApp;
        constructor(leaf: WorkspaceLeaf);
        getViewType(): string;
        getDisplayText(): string;
        getIcon(): string;
        onOpen(): Promise<void>;
        onClose(): Promise<void>;
    }
}
declare module "main" {
    import { Plugin } from "obsidian";
    import { BT_BCAPI } from "BT_BCAPI";
    import type { BCAPI } from "breadcrumbs/src/api";
    interface MyPluginSettings {
        mySetting: string;
    }
    global {
        interface Window {
            BCAPI: BCAPI;
            BT_BCAPI: BT_BCAPI;
        }
    }
    export default class MyPlugin extends Plugin {
        settings: MyPluginSettings;
        unloadFn: Function[];
        onload(): Promise<void>;
        exposeAPI(): void;
        onunload(): void;
        loadSettings(): Promise<void>;
        saveSettings(): Promise<void>;
        activateView(): Promise<void>;
    }
}
declare module "BT_BCAPI" {
    import { Plugin, TFile } from "obsidian";
    import MyPlugin from "main";
    export class BT_BCAPI {
        private plugin;
        constructor(plugin: Plugin);
        private static BT_BCAPI;
        static getBT_BCAPI(plugin: MyPlugin): BT_BCAPI;
        getAllNoteFromNote(note: TFile): TFile[];
        renameBCNoteTag(oldTag: string, newTag: string): Promise<{
            fileName: string;
            done: boolean;
        }[]>;
    }
}
declare module "Hello" {
    const _default: import("vue").DefineComponent<{}, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
    export default _default;
}
//# sourceMappingURL=index.d.ts.map