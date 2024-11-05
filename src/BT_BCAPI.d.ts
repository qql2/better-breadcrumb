import { Plugin, TFile } from "obsidian";
import MyPlugin from "./better-breadcrumb";
import type { BCEdge } from "breadcrumbs/src/graph/MyMultiGraph";
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
export declare class BT_BCAPI {
    private plugin;
    constructor(plugin: Plugin);
    private static BT_BCAPI;
    static getBT_BCAPI(plugin: MyPlugin): BT_BCAPI;
    getAllTFileFromNoteByType(path: string, type: string): (TFile | null)[];
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
export {};
