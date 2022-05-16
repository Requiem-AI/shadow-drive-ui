<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-5 col-md-3">

				<div class="card">
					<div class="card-header">
						<div class="row">
							<h4 class="col">Drives</h4>
							<div class="col-4 text-right">
								<button @click="showCreate" class="btn btn-primary btn-sm">New</button>
							</div>
						</div>
					</div>
					<div class="card-body">
						<FolderContainer @active="onVisitDrive" :folders="drives" :activeDrive="activeDrive" :loading="loading"></FolderContainer>
					</div>
				</div>

			</div>

			<div class="col-7 col-md-9">
				<div class="card pt-1">
					<div class="card-body">
						<FolderCreate @create="onDriveCreate" v-show="showCreateFolder" @close="hideCreate"></FolderCreate>
						<DriveShow v-if="activeDrive !== ''" :drive="currentDrive" :uploadFiles="uploadFiles" @undelete="onDriveUnDelete" @edit="onDriveEdit" @resize="onDriveResize" @delete="onDriveDelete" @freeze="onDriveFreeze" @addFile="onFileUpload" @upload="onUpload"></DriveShow>

						<div class="my-5 text-center" v-if="activeDrive === '' && !showCreateFolder">
							<i class="">No drive selected</i>
						</div>

					</div>
				</div>
			</div>
		</div>
		<div class="loader" v-show="loading">
			<div class="row text-center">
				<p>Processing Please Wait...</p>
				<div class="d-block"><i class="fa fa-spinner fa-spin fa-3x"></i></div>
			</div>
		</div>
	</div>
</template>

<script>
import {Shadow} from "../../api/shadow";
import FolderContainer from "../../components/drive/FolderContainer";
import FolderCreate from "../../components/drive/FolderCreate";
import DriveShow from "../../components/drive/DriveShow";

export default {
	name: "Explorer",
	components: {DriveShow, FolderCreate, FolderContainer},
	data() {
		return {
			shadow: null,
			loading: false,
			showCreateFolder: false,
			activeDrive: "",
			drives: [],
			uploadFiles: [],
		}
	},
	watch: {
		'$store.state.wallet_addr'() {
			console.log("Wallet address changed", this.$store.state.wallet_addr);
			this.onWalletConnected()
		}
	},
	computed: {
		currentDrive: function () {
			return this.drives.find(drive => drive.publicKey.toString() === this.activeDrive);
		}
	},
	methods: {
		showCreate() {
			this.activeDrive = ""
			this.showCreateFolder = true;
		},
		hideCreate() {
			this.showCreateFolder = false;
		},


		onDriveCreate(cfg) {
			this.loading = true;
			this.shadow.create(cfg.name, cfg.size, cfg.denom).then((resp) => {
				console.log("Drive created", resp);
				this.$toastr.s("Drive created");

				this.driveIndex();
				this.activeDrive = resp.shdw_bucket;

			}).catch((err) => {
				console.log("Drive create error", err);
				this.$toastr.e(err.message);
			}).finally(() => {
				this.loading = false;
			});
		},

		/**
		 * TODO File progress
		 * @param data
		 */
		onFileUpload(data) {
			this.uploadFiles.push(data);
		},

		onUpload() {
			console.log("Files to upload", this.uploadFiles.length);
			for (let i = 0; i < this.uploadFiles.length; i++) {
				this.uploadSingleFile(this.uploadFiles[i]);
			}
		},

		uploadSingleFile(data) {
			console.log("Attempting to upload file", data);
			this.shadow.uploadFile(this.activeDrive, data).then((resp) => {
				console.log("File Uploaded", resp);
				this.$toastr.s("File Uploaded");

				// this.driveIndex();
				// this.activeDrive = resp.shdw_bucket;

			}).catch((err) => {
				console.log("File upload error", err);
				this.$toastr.e(err.message);
			}).finally(() => {
				this.loading = false;
			});
		},

		onVisitDrive(drive) {
			console.log("Setting active drive", drive);
			this.activeDrive = drive
			this.driveShow(drive);
		},

		onDriveEdit() {
			//TODO
		},
		onDriveResize(data) {
			switch (data.way) {
				case "UP":
					return this.onDriveSizeIncrease(data);
				case "DOWN":
					return this.onDriveSizeReduce(data);
			}
			this.$toastr.e("Invalid size command")
		},
		onDriveSizeIncrease(data) {
			this.loading = true;
			this.shadow.increaseSize(this.activeDrive, data.size, data.denom).then((resp) => {
				console.log("Drive size update", resp);
				this.$toastr.s("Drive size updated");

				this.driveIndex();

			}).catch((err) => {
				console.log("Drive size error", err);
				this.$toastr.e(err.message);
			}).finally(() => {
				this.loading = false;
			});
		},
		onDriveSizeReduce(data) {
			this.loading = true;
			this.shadow.reduceSize(this.activeDrive, data.size, data.denom).then((resp) => {
				console.log("Drive size update", resp);
				this.$toastr.s("Drive size updated");

				this.driveIndex();

			}).catch((err) => {
				console.log("Drive size error", err);
				this.$toastr.e(err.message);
			}).finally(() => {
				this.loading = false;
			});
		},
		onDriveDelete() {
			this.loading = true;
			this.shadow.delete(this.activeDrive).then((resp) => {
				console.log("Drive deleted", resp);
				this.$toastr.s("Drive deleted");

				this.driveIndex();

			}).catch((err) => {
				console.log("Drive delete error", err);
				this.$toastr.e(err.message);
			}).finally(() => {
				this.loading = false;
			});
		},
		onDriveUnDelete() {
			this.loading = true;
			this.shadow.undelete(this.activeDrive).then((resp) => {
				console.log("Drive un-deleted", resp);
				this.$toastr.s("Drive delete cancelled");

				this.driveIndex();
				this.activeDrive = "";

			}).catch((err) => {
				console.log("Drive un-delete error", err);
				this.$toastr.e(err.message);
			}).finally(() => {
				this.loading = false;
			});
		},
		onDriveFreeze() {
			this.loading = true;
			this.shadow.setImmutable(this.activeDrive).then((resp) => {
				console.log("Drive frozen", resp);
				this.$toastr.s("Drive Frozen");

				this.driveIndex();

			}).catch((err) => {
				console.log("Drive freeze error", err);
				this.$toastr.e(err.message);
			}).finally(() => {
				this.loading = false;
			});
		},

		driveShow(id) {
			this.shadow.show(id).then((resp) => {
				console.log("Drive", resp);
				this.currenDrive = resp;
			}).catch((err) => {
				console.log("DriveShow error", err);
				this.$toastr.e("Unable to load drive");
			});
		},

		driveIndex() {
			this.loading = true;
			this.shadow.index().then((resp) => {
				console.log("Drives", resp);
				this.drives = resp;
			}).catch((err) => {
				console.log("DriveIndex error", err);
				this.$toastr.e("Unable to load drives");
			}).finally(() => {
				this.loading = false;
			});
		},

		async onWalletConnected() {
			await this.shadow.initDrive(this.$store.state.wallet_addr);
			this.driveIndex()
		}
	},
	mounted() {
		this.shadow = new Shadow();
		if (this.$store.state.wallet_connected) {
			this.onWalletConnected()
		}
	}
}
</script>

<style scoped>
.loader {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	color: white;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>