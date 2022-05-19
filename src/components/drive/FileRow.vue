<template>
	<div class="file my-1">
		<div class="row text-left">
			<div class="col-1"><i class="fa fa-file fa-2x"></i></div>
			<div class="col-3">
				<p class="small">{{ file }}</p>
<!--				<p><a :href="`https://explorer.solana.com/a`"><code class="small">{{ publicKey }}</code></a></p>-->
			</div>
			<div class="col-6">
				<a target="_blank" :href="url" class="small uri">{{ url }}</a>
			</div>
			<div class="col-2">
				<a target="_blank" :href="url" class="btn btn-primary btn-sm mx-2">View</a>
				<button class="btn btn-danger btn-sm" @click="onDelete">Delete</button>
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
	border: 1px solid white;
	padding: 1%;
	border-radius: 7px;
	transition: all 0.2s ease-in-out;
}

.file:hover {
	background: rgba(38, 182, 212, 0.2);
}

.uri {
	font-size: 0.7em;
}

code.small {
	font-size: 0.6em;
}

p {
	font-size: 0.8em;
	margin-bottom: 0;
}
</style>