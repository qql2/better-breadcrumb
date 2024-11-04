<template>
	<div id="container">
		<h2>From note</h2>
		<input type="text" v-model="fromNote" />
		<h2>link type</h2>
		<input type="text" v-model="linkType" />
		<button id="submit" @click="setNotes">getNotes</button>
		<h2>Output notes</h2>
		<textarea :value="outputNotes.join('\n')" cols="50"></textarea>
	</div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { usePlugin } from "./mixin";
import { TFileTree } from "./BT_BCAPI";

let plugin = usePlugin();
let fromNote = ref(plugin.settings.fromNoteHistory);
let linkType = ref(plugin.settings.linkTypeHistory);
watch(linkType, async (v) => {
	plugin.settings.linkTypeHistory = v;
	await plugin.saveSettings();
});
watch(fromNote, async (v) => {
	plugin.settings.fromNoteHistory = v;
	await plugin.saveSettings();
});
let outputNotes = ref([]);
function setNotes() {
	let file = plugin.app.vault
		.getMarkdownFiles()
		.find((file) => file.basename === fromNote.value);
	let tree = plugin.BT_BCAPI.getTFileTreeFromNoteByType(
		file.path,
		linkType.value
	);
	outputNotes.value = [];
	function dfs(tree: TFileTree) {
		outputNotes.value.push(tree.file.path);
		if (tree.children.length == 0) {
			return;
		}
		for (let child of tree.children) {
			dfs(child);
		}
	}
	dfs(tree);
}
</script>
<style scoped>
#container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
#submit {
	margin-top: 10px;
}
</style>
