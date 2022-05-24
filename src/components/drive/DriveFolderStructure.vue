<template>
	<div>
		<hr>
		<DirectoryFolder :active="activeFolder" @active="onFolderActive" @add-folder="onFolderAdd" :structure="structure" :folder="structure.getRootName()"></DirectoryFolder>
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
	},
}
</script>

<style scoped>
</style>