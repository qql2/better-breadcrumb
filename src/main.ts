import { App, Modal, Plugin, SuggestModal } from "obsidian";

import { MyView, VIEW_TYPE } from "./view";
import { BT_BCAPI } from "./BT_BCAPI";
import type { BCAPI } from "breadcrumbs";
import { createApp } from "vue";
import { default as NoteFilterComponent } from "./NoteFilter.vue";

type MyPluginSettings = typeof DEFAULT_SETTINGS;

const DEFAULT_SETTINGS = {
	linkTypeHistory: "",
	fromNoteHistory: "",
};

declare global {
	interface Window {
		BCAPI: BCAPI;
		BT_BCAPI: BT_BCAPI;
	}
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	unloadFn: Function[] = [];
	BT_BCAPI: BT_BCAPI;
	async onload() {
		await this.loadSettings();
		this.BT_BCAPI = BT_BCAPI.getBT_BCAPI(this);
		this.registerView(VIEW_TYPE, (leaf) => new MyView(leaf));

		// this.addRibbonIcon("dice", "Open my view", (evt) => {
		// 	this.activateView();
		// });

		this.exposeAPI();
		this.addCommand({
			id: "Filter notes by type link",
			name: "Filter notes by type link",
			callback: () => {
				this.openNoteFilter();
			},
		});
	}
	openNoteFilter() {
		let modal = new NoteFilter(this.app, this);
		modal.open();
	}
	exposeAPI() {
		window.BT_BCAPI = BT_BCAPI.getBT_BCAPI(this);
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
		this.unloadFn.forEach((fn) => fn());
		delete window.BT_BCAPI;
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	async activateView() {
		if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length === 0) {
			await this.app.workspace.getRightLeaf(false).setViewState({
				type: VIEW_TYPE,
				active: true,
			});
		}

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
		);
	}
}

class NoteFilter extends Modal {
	constructor(app: App, protected plugin: Plugin) {
		super(app);
	}
	onOpen() {
		let { contentEl } = this;
		let vueApp = createApp(NoteFilterComponent);
		vueApp.provide("plugin", this.plugin);
		vueApp.mount(contentEl);
	}
	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
