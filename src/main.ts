import {
	App,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

import { MyView, VIEW_TYPE } from "./view";
import { createApp } from "vue";
import App from "./App.vue";
import { BT_BCAPI } from "./BT_BCAPI";
import type { BCAPI } from "breadcrumbs/src/api";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
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
	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_TYPE, (leaf) => new MyView(leaf));

		this.addRibbonIcon("dice", "Open my view", (evt) => {
			this.activateView();
		});

		this.exposeAPI();
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
