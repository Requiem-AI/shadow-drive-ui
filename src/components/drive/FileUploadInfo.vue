<template>
	<div class="file mx-3 p-2">
		<div class="row text-center">
			<!--		<div class="col">-->
			<!--			<i class="fa fa-file fa-2x"></i>-->
			<!--		</div>-->
			<div class="col-8 text-left">
				<span class="small">{{ request.file.name }}</span>
			</div>
<!--			<div class="col" v-if="request.result !== null">-->
<!--				<div class=""><code class="small">{{ request.result.finalized_location }}</code></div>-->
<!--			</div>-->
			<div class="col">
				<div class="badge bg-primary">{{ request.status }}</div>
			</div>
			<div class="col">
				<code>{{ request.file.type }}</code>
			</div>
			<div class="col">
				{{ size }} MB
			</div>
			<div class="col" @click="remove">
				<i class="fa fa-close"></i>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "FileUploadInfo",
	props: {
		request: {
			type: Object,
			required: true
		}
	},
	computed: {
		size: function () {
			return (this.request.file.size / 1024 / 1024).toFixed(2);
		}
	},
	methods: {
		remove: function (e) {
			e.preventDefault()
			this.$emit("remove", this.request.file);
		}
	},
	mounted() {
		console.log("FileUpload mounted", this.request);
	}
}
</script>

<style scoped>
.file {
	border: 1px solid grey;
	border-radius: 7px;
}
</style>