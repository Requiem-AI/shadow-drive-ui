<template>
	<div class="file">
		<i class="fa fa-file fa-5x"></i>
		<p>{{ file }}</p>
	</div>
</template>

<script>
export default {
	name: "FileThumbnail",
	props: {
		file: {
			type: String,
			required: true
		}
	},
}
</script>

<style scoped>

.file {
	text-align: center;
}

p {
	font-size: 0.8em;
	margin-bottom: 0;
}
</style>