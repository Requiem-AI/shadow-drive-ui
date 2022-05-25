<template>
	<div class="file-view-overlay">
		<div class="row">
			<div class="col text-left">
				<h4>{{ file.name }}</h4>
			</div>
			<div class="col-1">
				<div @click="$emit('close')" class="close float-end">
					<i class="fa fa-close fa-2x"></i>
				</div>
			</div>
		</div>

		<div class="col-12 file-load">
			<img alt="file image" v-if="isImage" :src="url">
			<video controls v-if="isVideo" width="75%">
				<source :src="url">
			</video>
			<iframe :src="url" v-if="isViewableFile" width="100%" height="100%"></iframe>

			<pre v-if="isDownloadFile" class="file-data-preview">{{fileData}}</pre>
		</div>

		<hr>
		<div class="details p-2">
			<div class="row text-left">
				<div class="info col col-md-6 col-lg">
					<p class="">Name: </p>
					<p class="">{{ file.name }}</p>
				</div>
				<div class="info col-4 col-md-3 col-lg">
					<p class="">Size: </p>
					<p class="">{{ toSize }}</p>
				</div>
				<div class="info col-4 col-md-3 col-lg">
					<p class="">File Type: </p>
					<p class="">{{ ext.toUpperCase() }}</p>
				</div>
				<div class="info col-4 col-md-3 col-lg">
					<p class="">Immutable: </p>
					<p class="">{{ file.immutable ? 'Yes' : 'No' }}</p>
				</div>
				<div class="info col-4 col-md col-lg">
					<p class="">Pending Deletion: </p>
					<p class="">{{ file.toBeDeleted ? 'Yes' : 'No' }}</p>
				</div>
				<!--				<div class="info col-sm-12 col-md-6 col-lg">-->
				<!--					<p class="">Immutable: </p> <p class="">{{ file.immutable ? 'Yes' : 'No' }}</p>-->
				<!--					<p class="">Pending Deletion: </p> <p class="">{{ file.toBeDeleted ? 'Yes' : 'No' }}</p>-->
				<!--				</div>-->

				<div class="info col-sm-12 col-md-12">
					<p class="">File Url: </p> <a target="_blank" :href="file.url" class="x-small">{{ file.url }}</a>
					<p class="mt-3">Hosted Url: </p> <a target="_blank" :href="hostUrl" class="x-small">{{ hostUrl }}</a>
				</div>

			</div>
		</div>

		<div class="row text-center" v-if="!readonly">
<!--			<div class="mt-2 col-6 col-md-4 col-lg-2 offset-lg-1">-->
<!--				<button class="btn btn-outline-secondary btn-block btn-sm"><i class="fa fa-eye"></i> View</button>-->
<!--			</div>-->
			<div class="mt-2 col-6 col-md-4 col-lg-2 offset-lg-2"><a :download="file.name" :href="file.url" class="btn btn-outline-secondary btn-block btn-sm"><i
					class="fa fa-download"></i> Download</a></div>
			<div class="mt-2 col-6 col-md-4 col-lg-2">
				<button class="btn btn-outline-secondary btn-block btn-sm"><i class="fa fa-edit"></i> Edit</button>
			</div>
			<div class="mt-2 col-6 col-md-4 col-lg-2">
				<button @click="$emit('share')" class="btn btn-outline-secondary btn-block btn-sm"><i class="fa fa-link"></i> Share</button>
			</div>
			<div class="mt-2 col-6 col-md-4 col-lg-2">
				<button class="btn btn-outline-secondary btn-block btn-sm"><i class="fa fa-trash"></i> Delete</button>
			</div>
		</div>


	</div>
</template>

<script>
import md5 from 'md5';
import axios from "axios";

export default {
	name: "FileView",
	props: {
		file: {
			type: Object,
			required: true,
		},
		readonly: {
			type: Boolean,
			default() {
				return true
			}
		}
	},
	data() {
		return {
			fileData: null,
			formats: {
				image: {
					"png": true,
					"jpg": true,
					"jpeg": true,
					"gif": true,
					"svg": true,
				},
				video: {
					"mp4": true,
					"ogg": true,
					"webm": true,
					"wav": true,
				},
				file: {
					"js": true,
					"map": true,
					"css": true,
					"html": true,
					"json": true,
				},
				download: {
					"_folder": true,
					"": true,
				}
			}
		}
	},
	computed: {
		ext: function () {
			const ext = this.file.name.split(".").pop();
			if (ext === this.file.name && !this.formats.download[ext])
				return "Unknown"

			return ext.toLowerCase()
		},

		isImage: function () {
			return this.formats.image[this.ext]
		},
		isVideo: function () {
			return this.formats.video[this.ext]
		},
		isViewableFile: function () {
			return this.formats.file[this.ext]
		},
		/**
		 * Used for files with annoying mime types
		 * @returns {*}
		 */
		isDownloadFile: function () {
			return this.formats.download[this.ext]
		},
		isHostable: function () {
			return this.ext === "html"
		},

		url: function () {
			if (this.isHostable)
				return this.hostUrl

			return this.file.url
		},

		hostHash: function () {
			if (!this.file.storageAccount)
				return "";

			return md5(this.file.storageAccount)
		},

		hostUrl: function () {
			return `https://${this.hostHash}.blok.host/${this.file.name}`
		},

		toSize: function () {
			const s = this.file.size;
			if (s < 1024) {
				return `${s} B`;
			}
			if (s < 1048576) {
				const f = (s / 1024).toFixed(2)
				return `${f} KB`;
			}
			if (s < 1073741824) {
				const f = (s / 1024 / 1024).toFixed(2)
				return `${f} MB`;
			}
			const f = (s / 1024 / 1024 / 1024).toFixed(2)
			return `${f} GB`;
		},
	},
	mounted() {
		if (this.isDownloadFile)
			axios.get(this.url).then(r => {
				this.fileData = r.data
			})
	}
}
</script>

<style scoped>
.view {
	height: 90%;
}

.file-view-overlay {
	background: black;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 9;
	bottom: 0;
	right: 0;
	text-align: center;
	display: table;
	width: 100%;
	height: 100%;
	padding: 1%;
}

iframe {
	min-height: 400px;
	height: 100%;
	max-height: 500px;
}

.file-data-preview {
	text-align: left;
	color: white;
	height: 100%;
	min-height: 400px;
	max-height: 500px;
	background: rgba(0, 0, 0, 0.2);
}

.details {
	font-size: 0.7em;
}

img {
	height: auto;
	/*max-width: 90%;*/
	max-height: 100%;
}

.close {
	position: relative;
	z-index: 10;
	top: 0;
	right: 0;
	cursor: pointer;
}

.info-row :first-child {
	font-weight: bold;
}

.info p:nth-child(3), .info p:nth-child(1) {
	font-weight: bold;
	margin-bottom: 0;
}

.x-small {
	font-family: monospace;
	line-height: 1em;
	word-break: break-all;
}

.file-load :first-child {
	background: rgba(0, 0, 0, 0.2);
	padding: 1%;
	border-radius: 7px;
	max-height: 525px;
}
</style>