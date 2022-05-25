<template>
	<div class="folder">
		<span :class="isActive" class="noselect" @click="onFolderClick"><i class="fa fa-folder"></i></span> <span @click="onFolderNameClick" class="noselect" :class="isActive">{{
			folder
		}}</span> <span @click="onFolderTrashClick" v-show="isActive" class="float-end"><i class="fa fa-trash"></i></span>

		<div class="inner mx-3 mb-2" :style="showClass">
			<DirectoryFolder :show-files="showFiles" :active="active" @active="onFolderActive" @delete-folder="onFolderDelete" @add-folder="onFolderAdd" :folder="folder" :structure="structure"
					:key="`${folder}-folder-${key}`"
					v-for="(folder,key) in subfolders"></DirectoryFolder>

			<div v-if="showFiles">
				<div v-for="(file,key) in files" :key="`${folder}-file-${key}`">
					<DirectoryFile :structure="structure" :file="file"></DirectoryFile>
				</div>
			</div>

			<div v-show="isActive" @click="addFolder(folder)" class="btn btn-folder">NEW</div>
		</div>
	</div>
</template>

<script>
import DirectoryFile from "./DirectoryFile";

export default {
	name: "DirectoryFolder",
	components: {DirectoryFile},
	props: {
		structure: {
			required: true,
		},
		folder: {
			type: String,
			required: true,
		},
		active: {
			type: String,
		},
		showFiles: {
			type: Boolean,
			default() {
				return true;
			}
		}
	},
	data() {
		return {
			isOpen: true,
		}
	},
	computed: {
		isActive: function () {
			return this.active === this.folder ? 'active' : ''
		},

		subfolders: function () {
			return this.structure.getFolders(this.folder)
		},

		files: function () {
			return this.structure.getFiles(this.folder)
		},

		hasSubfolders: function () {
			return this.subfolders.length > 0
		},

		showClass: function () {
			if (this.isOpen) {
				return {
					"max-height": "900px"
				}
			}

			return {
				"max-height": 0,
				"opacity": 0,
			}
		}
	},
	methods: {
		onFolderActive: function (folder) {
			this.$emit("active", folder)
		},

		onFolderClick: function () {
			this.isOpen = !this.isOpen
			this.onFolderNameClick()
		},

		onFolderNameClick: function () {
			this.$emit("active", this.folder)
		},

		onFolderTrashClick: function () {
			this.onFolderDelete(this.folder)
		},

		onFolderAdd: function (folder) {
			this.addFolder(folder)
		},

		onFolderDelete: function (folder) {
			this.$emit("delete-folder", folder)
		},

		addFolder: function (folder) {
			this.$emit("add-folder", folder)
		}
	},
}
</script>

<style scoped>
.inner {
	/*margin-left: 5%;*/
	transition: all 0.2s ease-in-out;
}

.folder {
	cursor: pointer;
}
</style>