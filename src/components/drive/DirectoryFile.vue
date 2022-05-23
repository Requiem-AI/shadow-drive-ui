<template>
<div class="file">
	<i class="fa fa-file"></i> <span class="name">{{file}}</span>
</div>
</template>

<script>
export default {
	name: "DirectoryFile",
	props: {
		file: {
			type: String,
			required: true,
		}
	}
}
</script>

<style scoped>
.file {
	cursor: default;
	transition: 0.2s all ease-in-out;
}
.file:hover .name {
	color: #26B6D4;
}
</style>