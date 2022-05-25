<template>
	<div class="folder-container">
		<div v-if="!hasSubfolders">
			<i class="small">No folders</i>
		</div>
		<!--		<span :class="isActive" class="noselect" @click="onFolderClick"><i class="fa fa-folder"></i></span> <span @click="onFolderNameClick" class="noselect" :class="isActive">{{ folder }}</span>-->
		<div class="inner mb-2" :style="showClass">
			<DirectoryFolder class="ml-1" :show-files="false" :active="active" @active="onFolderActive" @add-folder="onFolderAdd" :folder="folder" :structure="structure"
					:key="`${folder}-folder-${key}`"
					v-for="(folder,key) in subfolders"></DirectoryFolder>
			<div v-show="isActive" @click="addFolder(folder)" class="btn btn-folder">NEW</div>
		</div>
	</div>
</template>

<script>
import DirectoryFolder from "./DirectoryFolder";

export default {
	name: "DirectoryFolderList",
	components: {DirectoryFolder},
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

		onFolderAdd: function (folder) {
			this.addFolder(folder)
		},

		addFolder: function (folder) {
			this.$emit("add-folder", folder)
		}
	},
}
</script>

<style scoped>
.inner {
	transition: all 0.2s ease-in-out;
}

.folder-container {
	max-height: 100px;
	overflow-y: scroll;
	border-bottom: 1px solid rgba(0,0,0,0.4);
}
</style>