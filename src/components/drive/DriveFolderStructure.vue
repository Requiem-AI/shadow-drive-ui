<template>
	<div>
		<hr>
		<DirectoryFolder class="folder-dir" :active="activeFolder" @active="onFolderActive" @delete-folder="onFolderDelete" @add-folder="onFolderAdd" :structure="structure"
				:folder="structure.getRootName()"></DirectoryFolder>
	</div>
</template>

<script>

import DirectoryFolder from "./DirectoryFolder";

export default {
	name: "DriveFolderStructure",
	components: {DirectoryFolder},
	props: {
		structure: {
			required: true,
		},
		activeDrive: {
			type: String,
		},
		activeFolder: {
			type: String,
		},
	},
	methods: {
		onFolderAdd: function(folder) {
			console.log("DriveFolderStructure::onFolderAdd", folder)
			this.$emit("add-folder", folder)
		},

		onFolderActive:function(folder) {
			this.$emit("active", folder)
		},

		onFolderDelete:function(folder) {
			this.$emit("delete-folder", folder)
		},
	},
}
</script>

<style scoped>

.folder-dir {
	max-height: 300px;
	overflow-y: scroll;
}
</style>