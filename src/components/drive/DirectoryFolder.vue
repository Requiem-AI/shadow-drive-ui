<template>
	<div class="folder">
		<span class="noselect" :class="isActive" @click="onFolderClick"><i class="fa fa-folder"></i> {{ folder }}</span>

		<div class="inner mb-2" :style="showClass">
			<DirectoryFolder :active="active" @active="onFolderActive" @add-folder="onFolderAdd" :folder="folder" :structure="structure" :key="`${folder}-folder-${key}`" v-for="(folder,key) in subfolders"></DirectoryFolder>

			<div v-for="(file,key) in files" :key="`${folder}-file-${key}`">
				<DirectoryFile :structure="structure" :file="file"></DirectoryFile>
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
		}
	},
	data() {
		return {
			isOpen: false,
		}
	},
	computed: {
		isActive: function () {
			return this.active === this.folder ? 'active' : ''
		},

		subfolders: function () {
			return this.structure.getFolders(this.folder)
		},

		files: function() {
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
			// if (this.isOpen) {
				this.$emit("active", this.folder)
			// }
		},

		onFolderAdd: function (folder) {
			this.addFolder(folder)
		},

		addFolder: function (folder) {
			this.$emit("add-folder", folder)
		}
	},
	mounted() {
		this.isOpen = this.folder === "_root"
	}
}
</script>

<style scoped>
.inner {
	margin-left: 5%;
	transition: all 0.2s ease-in-out;
}

.folder {
	cursor: pointer;
}
</style>