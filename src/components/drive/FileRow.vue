<template>
	<div class="file my-1">
		<div class="row text-left">
			<div class="col-10">
				<p class="small">{{ file }}</p>
<!--				<p><a :href="`https://explorer.solana.com/a`"><code class="small">{{ publicKey }}</code></a></p>-->
				<div class="uri-container"><a target="_blank" :href="url" class="small uri">{{ url }}</a></div>
			</div>
			<div class="col-sm-2 text-right text-sm-center">
				<a target="_blank" :href="url" class="btn btn-primary btn-xs btn-block me-2">View</a>
				<button class="btn btn-danger btn-xs btn-block" @click="onDelete">Delete</button>

			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: "FileRow",
	props: {
		drive: {
			type: Object,
			required: true
		},
		file: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			info: {
				"file-account-pubkey": ""
			}
		}
	},
	computed: {
		url: function () {
			return `https://shdw-drive.genesysgo.net/${this.drive.publicKey}/${this.file}`
		},

		publicKey :function () {
			return  this.info["file-account-pubkey"]
		}
	},
	methods: {
		onDelete: function () {
			this.$emit('delete', this.url)
		},

		getInfo: function () {
			axios.post("https://shadow-storage.genesysgo.net/get-object-data", {location: this.url}).then((r) => {
				console.log("file info", r.data.file_data)
				this.info = r.data.file_data;
			})
		}
	},
	mounted: function () {
		// this.getInfo()
	}
}
</script>

<style scoped>

.file {
	text-align: center;
	border-bottom: 1px solid white;
	padding: 5px;
	transition: all 0.2s ease-in-out;
}

.btn-xs {
	padding: 0 0.25rem;
	font-size: 0.6em;
	line-height: 2;
}

.file:hover {
	background: rgba(38, 182, 212, 0.2);
}

.uri-container {
	width: 100%;
	overflow: hidden;
}

.uri {
	font-size: 0.7em;
	white-space: nowrap;
}

code.small {
	font-size: 0.6em;
}

p {
	font-size: 0.8em;
	margin-bottom: 0;
}
</style>