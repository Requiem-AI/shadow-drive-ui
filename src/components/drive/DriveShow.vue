<template>
	<div class="drive-show">
		<div class="row mb-3" v-show="drive !== null">
			<div class="col-sm-12 col-md-6 col-lg-4">
				<span class="inlineh4">{{ drive.account.identifier }}</span>
				<DriveLock class="d-inline mx-3" :folder="drive"></DriveLock>
				<span v-if="drive.account.toBeDeleted" class="badge bg-danger">PENDING DELETION</span>
			</div>
			<div class="col-sm-12 col-md-6 col-lg-4">
				<DriveStorage v-show="!edit" class="inlineh4 text-center" :folder="drive"></DriveStorage>
				<DriveStorageEdit @edit="onEdit" v-show="edit" :folder="drive"></DriveStorageEdit>
			</div>
			<!--			<div class="col-1">-->
			<!--				<button class="btn btn-primary btn-block btn-sm" @click="$emit('edit')">Edit</button>-->
			<!--			</div>-->
			<div class="col-4 col-md-4 col-lg">
				<button class="btn btn-warning btn-block btn-sm" @click="edit = !edit">Resize</button>
			</div>
			<div class="col-4 col-md-4 col-lg" v-if="!drive.account.toBeDeleted">
				<button class="btn btn-danger btn-block btn-sm" @click="$emit('delete')">Delete</button>
			</div>
			<div class="col-4 col-md-4 col-lg">
				<button class="btn btn-secondary btn-block btn-sm" @click="$emit('freeze')">Freeze</button>
			</div>
			<div class="col-4 col-lg-2" v-if="drive.account.toBeDeleted">
				<button class="btn btn-danger btn-block btn-sm" @click="$emit('undelete')">Cancel Delete</button>
			</div>
		</div>

		<div class="row info" v-show="showInfo">
			<div class="col">
				<p>Account: </p>
				<code>{{ drive.publicKey.toString() }}</code>
			</div>
			<div class="col">
				<p>Owner(s): </p>
				<code>{{ drive.account.owner1.toString() }}</code>
				<code v-if="drive.account.owner2.toString() !== drive.account.owner1.toString()">{{drive.account.owner2.toString() }}</code>
			</div>
			<div class="col">
				<p>Creation Time: </p>
				<code>{{ createdAt }}</code>
			</div>
			<div class="col">
				<p>Last Fee Epoch: </p>
				<code>{{ drive.account.lastFeeEpoch }}</code>
			</div>
			<div class="col" v-if="drive.account.toBeDeleted">
				<p>Deletion Epoch: </p>
				<code>{{ drive.account.deleteRequestEpoch + 1 }}</code>
			</div>
			<div class="col-1 text-right pointer" @click="showInfo = !showInfo">
				<i class="fa fa-minus"></i>
			</div>
		</div>

		<hr>

		<div class="row text-right" v-show="!showInfo" @click="showInfo = !showInfo">
			<div class="col-12 pointer">
				<span class="mx-3 c float-start text-uppercase small badge">Details</span>
				<i class="fa fa-plus float-end"></i>
			</div>
		</div>

		<hr>

		<div class="file-container row mt-3" v-if="useThumbnails">
			<div class="col" v-for="(file,key) in files" :key="key">
				<FileThumbnail @delete="onDeleteFile" :file="file"></FileThumbnail>
			</div>
		</div>

		<div class="file-container row mt-3" v-if="!useThumbnails">
			<div class="col-12" :key="key" v-for="(file,key) in files">
				<FileRow @delete="onDeleteFile" :file="file" :drive="drive"></FileRow>
			</div>
		</div>


		<div class="file-container text-center" v-show="files === null">
			<p class="small">Loading files...</p>
			<i class="fa fa-spinner fa-spin"></i>
		</div>

		<div class="no-files text-center" v-show="files !== null && files.length <= 0">
			<p class="small">No files uploaded...</p>
		</div>

		<div class="row mt-3">
			<div class="text-center">
				<div ref="uploader" class="upload-container">
					<form enctype="multipart/form-data">
						<input id="file-upload" ref="file" type="file" multiple="true" class="file-upload" accept=".png,.jpg,.jpeg,.gif" @change="filesChange">
					</form>
					<p class="mt-4">Drag to upload</p>
				</div>

				<div class="row mt-3" v-show="uploadFiles.length > 0">
					<div class="col-12 my-1" v-for="(file,key) in uploadFiles" :key="key">
						<FileUpload @remove="uploadFiles.splice(key,1)" :request="file"></FileUpload>
					</div>

					<div class="col-12 text-center my-3">
						<p class="small mb-0">Total Upload Size: {{ (uploadSize / 1024 / 1024).toFixed(2) }} MB</p>
						<p v-show="!canUpload" class="small text-danger">Upload size exceeds available size!</p>
						<button :disabled="!canUpload" class="btn btn-primary" @click="onUploadClick">Upload</button>
					</div>
				</div>

			</div>
		</div>

	</div>
</template>

<script>
import FileThumbnail from "./FileThumbnail";
import DriveStorage from "./DriveStorage";
import DriveLock from "./DriveLock";
import FileUpload from "./FileUpload";
import DriveStorageEdit from "./DriveStorageEdit";
import FileRow from "./FileRow";

export default {
	name: "DriveShow",
	components: {FileRow, DriveStorageEdit, FileUpload, DriveStorage, FileThumbnail, DriveLock},
	props: {
		drive: {
			type: Object,
			required: true
		},
		files: {
			default: function () {
				return null;
			}
		},
		uploadFiles: {
			type: Array,
			default: function () {
				return [];
			}
		}
	},
	data() {
		return {
			useThumbnails: false,
			edit: false,
			showInfo: false,
		}
	},
	computed: {
		createdAt: function () {
			return new Date(this.drive.account.creationTime).toLocaleString();
		},

		uploadSize: function () {
			return this.uploadFiles.reduce((acc, file) => {
				return acc + file.file.size;
			}, 0);
		},

		canUpload: function () {
			return this.uploadSize < this.drive.account.storageAvailable;
		}
	},
	methods: {
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
			for(let i = 0; i< this.$refs.file.files.length;i++) {
				this.onFile(this.$refs.file.files[i])
			}
		},

		onFile:function(file) {
			if (!file) {
				return
			}
			console.log("File dropped", file)
			// handle file changes

			if (file.name.length > 32) {
				const ext = "." + file.name.split('.').pop();
				const shorterName = file.name.substr(0, 32 - ext.length) + ext
				Object.defineProperty(file, 'name', {
					writable: true,
					value: shorterName
				});
			}

			const alreadyExists = this.uploadFiles.filter((f) => f.file.name === file.name)
			const alreadyUploaded = this.files.filter((f) => f.name === file.name && f.status !== "pending")

			if (alreadyUploaded.length > 0 || alreadyExists.length > 0) {
				this.$toastr.e("File already uploaded")
				return
			}

			// file.status = 'pending'
			// file.uri = URL.createObjectURL(file);
			// file.progress = 0
			// file.formData = formData

			this.$emit("addFile", file)
		},

		onEdit: function (data) {
			this.$emit("resize", data);
			this.edit = !this.edit;
		},

		onUploadClick: function () {
			this.$emit("upload")
		},

		onDeleteFile: function (f) {
			this.$emit("file-delete", f)
		},
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
.inlineh4 {
	font-size: 1.5rem;
}

.info p {
	margin-bottom: 0;
	font-size: 0.8em;
}

.c {
	cursor: pointer;
}

.upload-container {
	position: relative;
	min-height: 100px;
}

.upload-container {
	background: rgba(0, 0, 0, 0.3);
	border: 3px dashed white;
}

form {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
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

::-webkit-file-upload-button, ::file-selector-button {
	display: none;
}

.pointer {
	cursor: pointer;
}

.file-container {
	max-height: 525px;
	overflow-y: scroll;
}

.no-files {
	min-height: 100px;
}
</style>