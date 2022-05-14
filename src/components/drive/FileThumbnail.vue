<template>
	<div class="file">
		<i class="fa fa-file fa-5x"></i>
		{{ file.name }}
	</div>
</template>

<script>
export default {
	name: "FileThumbnail",
	props: {
		file: {
			type: Object,
			required: true
		}
	},
}
</script>

<style scoped>

</style>