<template>
	<div>
		<hr>
		<DirectoryFolder :active="activeFolder" @active="onFolderActive" @add-folder="onFolderAdd" :structure="structure" folder="_root"></DirectoryFolder>

		<div class="modal">
			<div class="modal-card">
				<div class="card">
					<div class="card-body">
						<h1>NEW FOLDER</h1>
						<input class="form-control" placeholder="folder-name" v-model="newFolder.name">
						<button @click="addFolder" class="btn btn-primary">ADD</button>
					</div>
				</div>
			</div>
		</div>
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
	data() {
		return {
			showNewFolderModal: false,
			newFolder: {
				name: "",
				target: "_root"
			}
		}
	},
	methods: {
		onFolderAdd: function(folder) {
			console.log("Folder add", folder)
			this.newFolder.target = folder
			this.showNewFolderModal = true

			this.$emit("add-folder", this.newFolder)

			this.newFolder = {
				name: "",
				target: "_root"
			}
		},

		onFolderActive:function(folder) {
			this.$emit("active", folder)
		},

		addFolder: function() {
			this.structure.cfg.addFolder(this.newFolder.target, this.newFolder.name)
		}
	},
}
</script>

<style scoped>

</style>