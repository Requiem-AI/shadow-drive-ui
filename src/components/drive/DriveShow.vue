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
				<code v-if="drive.account.owner2.toString() !== drive.account.owner1.toString()">{{
						drive.account.owner2.toString()
					}}</code>
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

		<!--		<div class="file-container row mt-3" v-if="tableView">-->
		<!--			<div class="col" v-for="(file,key) in files" :key="key">-->
		<!--				<FileThumbnail @delete="onDeleteFile" :file="file"></FileThumbnail>-->
		<!--			</div>-->
		<!--		</div>-->

		<div class="file-container row mt-3" v-if="tableView">
			<table class="table table-hover text-white">
				<thead>
				<tr class="text-left">
<!--					<th>-</th>-->
					<th>Name</th>
					<th>Size</th>
					<th>Type</th>
					<th>Status</th>
					<th class="d-none d-md-table-cell"></th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(file,key) in files" :key="key" class="">
<!--					<td>-</td>-->
					<td class="pointer" @click="setActiveFile(file)">{{ file.name }}</td>
					<td class="pointer" @click="setActiveFile(file)">{{ toSize(file.size) }}</td>
					<td class="pointer" @click="setActiveFile(file)">{{ guessType(file.name) }}</td>
					<td class="pointer" @click="setActiveFile(file)">
						<div v-if="!file.immutable" class="badge bg-secondary">Editable</div>
						<div v-if="file.immutable" class="badge bg-info">Immutable</div>
						<div v-if="file.toBeDeleted" class="badge mx-md-2 bg-danger">Deleting</div>
					</td>
					<td class="text-right d-none d-md-table-cell">
						<a :href="file.url" target="_blank" :download="file.name"><i class="fa fa-download mx-2 pointer"></i></a>
<!--						<i class="fa fa-edit mx-2 pointer"></i>-->
						<a @click="copyLink(file)"><i class="fa fa-link mx-2 pointer"></i></a>
						<a @click="onDeleteFile(file)"><i class="fa fa-trash mx-2 pointer"></i></a>
					</td>
				</tr>
				</tbody>
			</table>
		</div>

		<div class="file-container row mt-3" v-if="!tableView">
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
			<FileUpload :files="files" :drive="drive" :upload-files="uploadFiles" @upload="onUploadClick"
									@addFile="onFileAdded"></FileUpload>
		</div>


		<FileView @close="hideFileInfo" v-if="showFileInfo" :file="activeFile"></FileView>
	</div>
</template>

<script>
import DriveStorage from "./DriveStorage";
import DriveLock from "./DriveLock";
import DriveStorageEdit from "./DriveStorageEdit";
import FileRow from "./FileRow";
import FileUpload from "./FileUpload";
import FileView from "./FileView";

export default {
	name: "DriveShow",
	components: {FileView, FileUpload, FileRow, DriveStorageEdit, DriveStorage, DriveLock},
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
		},

		showFileInfo: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			tableView: true,
			edit: false,
			showInfo: false,
			activeFile: {name: ''},
		}
	},
	computed: {
		createdAt: function () {
			return new Date(this.drive.account.creationTime).toLocaleString();
		},
	},
	methods: {
		copyLink: function(f) {
			navigator.clipboard
					.writeText(f.url)
					.then(() => {
						this.$toastr.s(`Copied to clipboard.`);
					})
					.catch((err) => {
						this.$toastr.e(err, `Error copying text to clipboard`);
					});
		},

		setActiveFile: function(f) {
			console.log("Setting active file: ", f)
			this.activeFile = f;
			this.$emit("file-info", true)
		},

		hideFileInfo:function() {
			this.$emit("file-info", false)
		},

		toSize: function (s) {
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

		guessType: function (filename) {
			const ext = filename.split('.').pop();

			switch (ext.toLowerCase()) {
				case "png":
				case "jpg":
				case "jpeg":
				case "gif":
				case "svg":
					return "Image"

				case "css":
					return "Stylesheet"

				case "json":
				case "md":
				case "config":
				case "env":
				case "html":
					return "Text"

				case "map":
				case "js":
				case "ts":
				case "tsx":
					return "Script"
			}

			return `File`
		},

		onEdit: function (data) {
			this.$emit("resize", data);
			this.edit = !this.edit;
		},

		onUploadClick: function () {
			this.$emit("upload")
		},

		onFileAdded: function (f) {
			this.$emit("addFile",f)
		},

		onDeleteFile: function (f) {
			this.$emit("file-delete", f)
		},
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

table {
	color: white;
	font-weight: normal;
	font-size: 0.9em;
}

.table-hover > tbody > tr:hover > *, tr:hover {
	background: rgba(255, 255, 255, 0.1);
	color: white;
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