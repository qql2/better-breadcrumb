import { App, getFrontMatterInfo, parseYaml, Plugin, TFile } from "obsidian";
import MyPlugin from "./main";
import { YAML } from "qql1-yaml";
import { ModifyFile } from "obsidian-modify-file";

export class BT_BCAPI {
	constructor(private plugin: Plugin) {}
	private static BT_BCAPI: BT_BCAPI = null;
	public static getBT_BCAPI(plugin: MyPlugin) {
		if (BT_BCAPI.BT_BCAPI) return BT_BCAPI.BT_BCAPI;
		BT_BCAPI.BT_BCAPI = new BT_BCAPI(plugin);
		return BT_BCAPI.BT_BCAPI;
	}
	public getAllNoteFromNote(note: TFile) {
		let rst: TFile[] = [];

		window.BCAPI.get_neighbours();
		return rst;
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
		for await (const { file, frontmatter, content } of _files) {
			let doneFrontmatter = YAML.setFieldInYAML(
				frontmatter.frontmatter,
				BCField,
				newTag
			);
			editor.replaceRange(
				doneFrontmatter,
				editor.offsetToPos(frontmatter.from),
				editor.offsetToPos(frontmatter.to),
				content
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
