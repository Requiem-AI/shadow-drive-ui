<template>
	<div class="folder-container">
		<Folder class="my-2" v-for="(folder,key) in folders" :key="`${key}`" :folder="folder" :active="activeDrive === folder.publicKey.toString()"
				@active="onDriveClick"></Folder>

		<div class="text-center" v-if="folders.length === 0">
			<i v-show="loading">Loading...</i>

			<i v-if="$store.state.wallet_connected" v-show="!loading">No Drives Created</i>
			<i v-else>
				<Phantom class="btn btn-outline-light"></Phantom>
			</i>
		</div>
	</div>
</template>

<script>
import Folder from "./Folder";
import Phantom from "../wallet/Phantom";

export default {
	name: "FolderContainer",
	components: {Phantom, Folder},
	props: {
		folders: {
			type: Array,
			required: true
		},
		activeDrive: {
			type: String,
			required: true
		},
		loading: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		onDriveClick: function (drive) {
			this.$emit("active", drive);
		}
	}
}
</script>

<style scoped>
.folder-container {
	max-height: 400px;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>