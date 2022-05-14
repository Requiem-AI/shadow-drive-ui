<template>
	<div class="drive-show">
		<div class="row mb-3" v-show="drive === null">
			<div class="col">
				<h4>{{ drive }} DN</h4>
			</div>
			<div class="col-1">
				<button class="btn btn-primary btn-block btn-sm" @click="$emit('edit')">Edit</button>
			</div>
			<div class="col-1">
				<button class="btn btn-warning btn-block btn-sm" @click="$emit('resize')">Resize</button>
			</div>
			<div class="col-1">
				<button class="btn btn-danger btn-block btn-sm" @click="$emit('delete')">Delete</button>
			</div>
			<div class="col-1">
				<button class="btn btn-secondary btn-block btn-sm" @click="$emit('freeze')">Freeze</button>
			</div>
		</div>

		<div class="row">
			<div class="col" v-for="(file,key) in files" :key="key">
				<FileThumbnail :file="file"></FileThumbnail>
			</div>
		</div>

		<div class="text-center" v-show="drive === null">
			<i>No files uploaded...</i>
			<div class="my-3"></div>
			<i>Drag to upload</i>
		</div>

	</div>
</template>

<script>
import FileThumbnail from "./FileThumbnail";

export default {
	name: "DriveShow",
	components: {FileThumbnail},
	props: {
		drive: {
			type: Array,
			required: false
		}
	},
	computed: {
		files() {
			if (this.drive === null) {
				return [];
			}
			return this.drive.files;
		}
	}
}
</script>

<style scoped>

</style>