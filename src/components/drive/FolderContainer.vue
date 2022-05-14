<template>
	<div class="folder-container">
		<Folder v-for="(folder,key) in folders" :key="key" :folder="folder"></Folder>

		<div class="text-center" v-if="folders.length === 0">
			<i>No Drives Created</i>
		</div>
	</div>
</template>

<script>
import Folder from "./Folder";

export default {
	name: "FolderContainer",
	components: {Folder},
	props: {
		folders: {
			type: Array,
			required: true
		}
	}
}
</script>

<style scoped>

</style>