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
declare module "BT_BCAPI" {
    import { Plugin, TFile } from "obsidian";
    import MyPlugin from "better-breadcrumb";
    import { BCEdge } from "graph/MyMultiGraph";
    export interface TFileTree {
        file: TFile;
        children: TFileTree[];
    }
    interface EdgeWithPos extends BCEdge {
        source_attr: {
            typePos?: number;
        } & BCEdge["source_attr"];
        target_attr: {
            typePos?: number;
        } & BCEdge["target_attr"];
    }
    export class BT_BCAPI {
        private plugin;
        constructor(plugin: Plugin);
        private static BT_BCAPI;
        static getBT_BCAPI(plugin: MyPlugin): BT_BCAPI;
        getAllTFileFromNoteByType(path: string, type: string): TFile[];
        getTFileTreeFromNoteByType(path: string, type: string): TFileTree;
        test(): import("breadcrumbs/src/graph/builders/explicit/files").AllFiles;
        getTypeLinkPosEdge(EdgeList: BCEdge[]): Promise<EdgeWithPos[]>;
        private getOriginLinkByPath;
        private getTypeLinkPos;
        private getInLineTypeLinkPos;
        renameBCNoteTag(oldTag: string, newTag: string): Promise<{
            fileName: string;
            done: boolean;
        }[]>;
    }
}
declare module "better-breadcrumb" {
    import { Plugin } from "obsidian";
    import { BT_BCAPI } from "BT_BCAPI";
    import type { BCAPI } from "breadcrumbs";
    type MyPluginSettings = typeof DEFAULT_SETTINGS;
    const DEFAULT_SETTINGS: {
        linkTypeHistory: string;
        fromNoteHistory: string;
    };
    global {
        interface Window {
            BCAPI: BCAPI;
            BT_BCAPI: BT_BCAPI;
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
}
