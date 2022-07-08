<template>
	<div class="text-center">
		<div ref="uploader" class="upload-container">
			<form enctype="multipart/form-data">
				<input id="file-upload" ref="file" type="file" multiple="true" class="file-upload" @change="filesChange">
			</form>
			<p class="mt-4">Drag to upload</p>
		</div>

		<div class="row mt-3" v-show="uploadFiles.length > 0">
			<hr>
			<div class="pending-file-container">
				<div class="col-12 my-1" v-for="(file,key) in uploadFiles" :key="key">
					<FileUploadInfo @remove="uploadFiles.splice(key,1)" :request="file"></FileUploadInfo>
				</div>
			</div>

			<div class="col-12 text-center mt-3">
				<p class="small mb-0">Total Upload Size: {{ (uploadSize / 1024 / 1024).toFixed(2) }} MB</p>
				<p v-show="!canUpload" class="small text-danger">Upload size exceeds available size!</p>
				<button :disabled="!canUpload" class="btn btn-primary" @click="onUploadClick">Upload</button>
			</div>
		</div>

	</div>
</template>

<script>
import FileUploadInfo from "./FileUploadInfo";
import JSZip from 'jszip';

export default {
	name: "FileUpload",
	components: {FileUploadInfo},
	props: {
		uploadFiles: {
			type: Array,
			default: function () {
				return [];
			}
		},
		drive: {
			type: Object,
			required: true
		},
		files: {
			default: function () {
				return {};
			}
		},
	},
	computed: {
		canUpload: function () {
			const avail = this.drive.account.storageAvailable || (this.drive.account.reserved_bytes - this.drive.account.current_usage)
			return this.uploadSize < avail;
		},

		uploadSize: function () {
			return this.uploadFiles.reduce((acc, file) => {
				return acc + file.file.size;
			}, 0);
		},
	},
	methods: {
		onUploadClick: function () {
			this.$emit("upload")
		},

		onDragOver(e) {
			e.stopPropagation();
			e.preventDefault()
			e.dataTransfer.effectAllowed = "move";
			this.visible = true;
		},

		onDragLeave(e) {
			if (e.pageX !== 0 || e.pageY !== 0) { //Stops flickering
				return false;
			}

			e.stopPropagation();
			e.preventDefault()
			// console.log('onDragLeave', e);
			this.visible = false;
		},
		filesChange: function () {
			for (let i = 0; i < this.$refs.file.files.length; i++) {
				this.onFile(this.$refs.file.files[i])
			}
		},

		onFile: function (file) {
			if (!file) {
				return
			}
			console.log("File dropped", file)
			// handle file changes

			if (file.type === "application/x-zip-compressed") {
				JSZip.loadAsync(file).then((zip) => {
					console.log("Zip loaded:", zip)


					const ok = Object.keys(zip.files)
					for (let i = 0; i < ok.length; i++) {
						// console.log("Loading zip file: ", ok[i])

						const parts = ok[i].split("/")
						const file = parts.pop();
						const folder = parts.pop() || "";
						const folderParent = parts.pop() || "";

						console.log("Adding folder", folder)
						this.$emit("addFolder", folder, folderParent)
						if (zip.files[ok[i]].dir) {
							continue
						}


						console.log("Adding file to folder", folder, file)
						this.$emit("setFileFolder", folder, file)

						zip.file(ok[i]).async("blob").then(str => {
							this.onFileAdded(new File([str], file), folder, folderParent)
						})
					}

				});

			} else {
				this.onFileAdded(file)
			}

		},

		onFileAdded: function (file, folder = "", parentFolder = "") {
			if (file.name.length > 32) {
				const ext = "." + file.name.split('.').pop();
				const shorterName = file.name.substr(0, 32 - ext.length) + ext
				Object.defineProperty(file, 'name', {
					writable: true,
					value: shorterName
				});
			}

			const alreadyExists = this.uploadFiles.filter((f) => f.file.name === file.name)
			const alreadyUploaded = Object.values(this.files).filter((f) => f.name === file.name && f.status !== "pending")

			if (alreadyUploaded.length > 0 || alreadyExists.length > 0) {
				this.$toastr.e("File already uploaded")
				return
			}

			this.$emit("addFile", file, folder, parentFolder)
		}

	},
	mounted() {
		this.$refs.uploader.addEventListener('dragover', this.onDragOver);
		this.$refs.uploader.addEventListener('dragleave', this.onDragLeave);
	},
	beforeDestroy() {
		this.$refs.uploader.removeEventListener('dragover', this.onDragOver)
		this.$refs.uploader.removeEventListener('dragleave', this.onDragLeave)
	},
}
</script>

<style scoped>


.upload-container {
	position: relative;
	min-height: 100px;
}

.pending-file-container {
	max-height: 300px;
	overflow-y: scroll;
}

.upload-container {
	background: rgba(0, 0, 0, 0.3);
	border: 3px dashed white;
}

.file-upload {
	margin: 1%;
	content: '';
	display: inline-block;
	cursor: pointer;
	height: 100%;
	width: 100%;
	opacity: 0;

	background: transparent;
	transform: none;
	text-align: center;
	vertical-align: center;
}


form {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>