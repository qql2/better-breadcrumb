import { App, getFrontMatterInfo, parseYaml, Plugin, TFile } from "obsidian";
import MyPlugin from "./better-breadcrumb";
import { YAML } from "qql1-yaml";
import { ModifyFile } from "obsidian-modify-file";
import { get_all_files } from "breadcrumbs/src/graph/builders/explicit/files";
import { BCEdge } from "graph/MyMultiGraph";

export interface TFileTree {
	file: TFile;
	children: TFileTree[];
}

interface EdgeWithPos extends BCEdge {
	source_attr: { typePos?: number } & BCEdge["source_attr"];
	target_attr: { typePos?: number } & BCEdge["target_attr"];
}

export class BT_BCAPI {
	constructor(private plugin: Plugin) {}
	private static BT_BCAPI: BT_BCAPI = null;
	public static getBT_BCAPI(plugin: MyPlugin) {
		if (BT_BCAPI.BT_BCAPI) return BT_BCAPI.BT_BCAPI;
		BT_BCAPI.BT_BCAPI = new BT_BCAPI(plugin);
		return BT_BCAPI.BT_BCAPI;
	}
	public getAllTFileFromNoteByType(path: string, type: string) {
		let notes = window.BCAPI.get_neighbours(path)
			.filter((v) => v.attr.field == type)
			.map((v) => v.target_id);
		return notes.map((v) => this.plugin.app.vault.getFileByPath(v));
	}
	public getTFileTreeFromNoteByType(path: string, type: string) {
		let _fn = (_TFile: TFile, pathSet: Set<string>) => {
			let node: TFileTree = { file: _TFile, children: [] };
			let subTFiles = this.getAllTFileFromNoteByType(_TFile.path, type);
			for (const subTFile of subTFiles) {
				if (pathSet.has(subTFile.path)) continue;
				node.children.push(
					_fn(subTFile, structuredClone(pathSet).add(subTFile.path))
				);
			}
			return node;
		};
		return _fn(
			this.plugin.app.vault.getAbstractFileByPath(path) as TFile,
			new Set<string>()
		);
	}
	public test() {
		return get_all_files(this.plugin.app);
	}
	public async getTypeLinkPosEdge(EdgeList: BCEdge[]) {
		let rst: EdgeWithPos[] = [];
		for (const edge of EdgeList) {
			if (edge.attr.explicit === false) {
				let rgx = new RegExp(
					`transitive:\\[(.*?)\\] <- ${edge.attr.field}`
				);
				let explicitField = edge.attr.implied_kind.match(rgx)[1];
				if (!explicitField) continue;
				let newEdge: EdgeWithPos = structuredClone(edge);
				let originLink = this.getOriginLinkByPath(
					edge.target_id,
					edge.source_id
				);
				let pos = await this.getTypeLinkPos(
					edge.target_id,
					explicitField,
					originLink
				);
				newEdge.target_attr.typePos = pos;
				rst.push(newEdge);
				continue;
			}
			if (edge.attr.source !== "typed_link") continue;
			let newEdge: EdgeWithPos = structuredClone(edge);
			let originLink = this.getOriginLinkByPath(
				edge.source_id,
				edge.target_id
			);
			let pos = await this.getTypeLinkPos(
				edge.source_id,
				edge.attr.field,
				originLink
			);
			newEdge.source_attr.typePos = pos;
			rst.push(newEdge);
		}
		return rst;
	}
	private getOriginLinkByPath(sourcePath: string, targetPath: string) {
		let cache = this.plugin.app.metadataCache.getCache(sourcePath);
		let links = [
			...(cache.links ?? []),
			...(cache.embeds ?? []).map((v) => ({
				...v,
				link: v.link.split("#")[0],
			})),
		];
		return links.find((link) => {
			let file = this.plugin.app.metadataCache.getFirstLinkpathDest(
				link.link,
				sourcePath
			);
			return file.path === targetPath;
		}).original;
	}
	private async getTypeLinkPos(id: string, field: string, link: string) {
		let note = this.plugin.app.vault.getFileByPath(id);
		let content = await this.plugin.app.vault.cachedRead(note);
		let frontmatter = getFrontMatterInfo(content);
		if (frontmatter) {
			let yaml = parseYaml(frontmatter.frontmatter);
			if (yaml[field]?.includes(link)) return null;
		}
		return this.getInLineTypeLinkPos(content, field, link);
	}
	private getInLineTypeLinkPos(content: string, field: string, link: string) {
		link = link.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		let rgx = new RegExp(`${field} *:: *?${link}`);
		let match = content.match(rgx);
		if (!match) throw new Error(`No match${rgx}`);
		return match.index;
	}
	public async renameBCNoteTag(oldTag: string, newTag: string) {
		let files = this.plugin.app.vault.getFiles();
		let BCField = "BC-tag-note-tag";
		// let files = [this.plugin.app.workspace.getActiveFile()];
		let _files = (
			await Promise.all(
				files.map(async (file) => {
					let content = await this.plugin.app.vault.read(file);
					let frontmatter = getFrontMatterInfo(content);
					if (
						frontmatter &&
						frontmatter.frontmatter.includes(BCField)
					) {
						let tag = parseYaml(frontmatter.frontmatter)[BCField];
						if (tag.replace("#", "") == oldTag.replace("#", ""))
							return { file, frontmatter, content };
					}
					return null;
				})
			)
		).filter((x) => x);
		let editor = this.plugin.app.workspace.activeEditor.editor;
		if (!editor) throw new Error("No active editor");
		let rst = [];
		for await (const { file, frontmatter } of _files) {
			let doneFrontmatter = YAML.setFieldInYAML(
				frontmatter.frontmatter,
				BCField,
				newTag
			);

			rst.push({
				fileName: file.basename,
				done: await ModifyFile.replaceRange(
					file,
					this.plugin,
					frontmatter.from,
					frontmatter.to,
					doneFrontmatter
				),
			});
		}
		return rst;
	}
}
