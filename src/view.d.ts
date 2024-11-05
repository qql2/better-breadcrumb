import { ItemView, WorkspaceLeaf } from 'obsidian';
import { App as VueApp } from 'vue';
export declare const VIEW_TYPE: string;
export declare class MyView extends ItemView {
    vueapp: VueApp;
    constructor(leaf: WorkspaceLeaf);
    getViewType(): string;
    getDisplayText(): string;
    getIcon(): string;
    onOpen(): Promise<void>;
    onClose(): Promise<void>;
}
