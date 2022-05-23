<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12 col-md-4 col-lg-3 mb-2 mb-md-0 ">
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
						<DriveFolderStructure v-if="structure !== null" @active="onFolderActive" :active-drive="activeDrive" :active-folder="activeFolder" :structure="structure"></DriveFolderStructure>
						<button @click="expo" class="btn btn-outline-secondary btn-block btn-sm py-0" :disabled="true">Save Structure</button>
					</div>
				</div>

				<div class="card mt-2">
					<div class="card-body text-center">
						<div class="balances row text-center">
							<div class="col-12" v-show="$store.state.balances['shdw'] < 0.02">
								<div class="alert p-0 alert-warning">Not Enough SHDW</div>
							</div>
							<div class="col-12" v-show="$store.state.balances['sol'] <= 0">
								<div class="alert p-0 alert-warning">Not Enough SOL</div>
							</div>

							<div class="col-6 balance">
								<img alt="solana token" class="sol-icon" src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" height="32px"> {{ $store.state.balances['sol'] }} SOL
							</div>

							<div class="col-6 balance">
								<img alt="shdw token" src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y/logo.png" height="32px"> {{ $store.state.balances['shdw'] }} SHDW
							</div>
						</div>
					</div>

						<div class="card-footer text-center">
							<p class="small footer">Created With ❤️ By <a target="_blank" href="https://twitter.com/alpha_batem">@AlphaBatem</a>
							</p>
							<p class="mb-0 small">
								<a target="_blank" href="https://solana.com">Solana</a> |
								<a target="_blank" href="https://alphabatem.com">AlphaBatem</a> |
								<a target="_blank" href="https://metaverse.alphabatem.com">Metaverse</a> |
								<a target="_blank" href="https://genesysgo.com/">GenesysGo</a>
							</p>
					</div>
				</div>

			</div>

			<div class="col-sm-12 col-md-8 col-lg-9">
				<div class="card pt-1">
					<div class="card-body">
						<FolderCreate @create="onDriveCreate" v-show="showCreateFolder" @close="hideCreate"></FolderCreate>
						<DriveShow v-if="activeDrive !== ''" :show-file-info="showFileInfo" :files="filterFiles" :drive="currentDrive" :uploadFiles="uploadFiles" @file-info="onToggleFileInfo" @undelete="onDriveUnDelete" @edit="onDriveEdit" @resize="onDriveResize" @delete="onDriveDelete" @file-delete="onFileDelete" @freeze="onDriveFreeze" @addFile="onFileUpload" @upload="onUpload"></DriveShow>

						<div class="my-5 text-center" v-if="activeDrive === '' && !showCreateFolder">
							<i class="">No drive selected</i>
						</div>

					</div>
				</div>
			</div>
		</div>
		<div class="loader" v-show="loading">
			<div class="row text-center">
				<p>Loading Please Wait...</p>
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
import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import DriveFolderStructure from "../../components/drive/DriveFolderStructure";
import {DriveConfig, FolderStructure} from "../../api/folder";
import axios from "axios"

export default {
	name: "Explorer",
	components: {DriveFolderStructure, DriveShow, FolderCreate, FolderContainer},
	data() {
		return {
			shadow: null,
			loading: false,
			showCreateFolder: false,
			showFileInfo: false,
			activeFolder: "_root",
			activeDrive: "",
			drives: [],
			files: {},
			uploadFiles: [],
			folderStructure: {},
			structure: new FolderStructure(new DriveConfig()),
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
		},

		filterFiles: function() {
			if (this.activeFolder === "_root" || this.activeFolder === "")
				return this.files;

			const filtered = {};
			const includes = this.structure.getFiles(this.activeFolder)
			for(let i = 0;i<includes.length;i++) {
				const key = includes[i]
				if (!this.files[key])
					continue

				filtered[key] = this.files[key]
			}

			return filtered
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

		expo: function() {
			const folderOut = this.structure.export()
			console.log(folderOut)
			const url = `https://shdw-drive.genesysgo.net/${this.activeDrive}/_folder`
			const file = new File([folderOut], "_folder")

			let promise;
			if (this.structure.folderHasFile("_root", "_folder")) {
				promise = this.shadow.editFile(this.activeDrive, url, file)
			} else {
				promise = this.shadow.uploadFile(this.activeDrive, file)
			}

			promise.then(() => {
				this.$toastr.s("Structure saved")
			}).catch((err) => {
				console.log("Structure save error", err);
				this.$toastr.e(err.message);
			});

		},

		onToggleFileInfo(v) {
			console.log("Toggle file info", v)
			this.showFileInfo =v;
		},

		onDriveCreate(cfg) {
			this.loading = true;
			this.shadow.create(cfg.name, cfg.size, cfg.denom).then((resp) => {
				console.log("Drive created", resp);
				this.$toastr.s("Drive created");
				this.hideCreate();
				this.driveIndex();

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
			console.log("On file upload",data)

			if (data.name.length > 32) {
				const ext = "." + data.name.split('.').pop();
				const shorterName = data.name.substr(0, 31 - ext.length) + ext
				Object.defineProperty(data, 'name', {
					writable: true,
					value: shorterName
				});
			}

			this.uploadFiles.push({
				status: "pending",
				result: null,
				file: data
			});
		},

		onUpload() {
			console.log("Files to upload", this.uploadFiles.length);

			try {
				this.uploadMultipleFiles(this.uploadFiles)
			} catch (err) {
				console.log("File upload error", err);

				for (let i = 0; i < this.uploadFiles.length; i++) {
					this.uploadFiles[i].status = "error"
				}

				this.loading = false
			}

			// for (let i = 0; i < this.uploadFiles.length; i++) {
			// 	try {
			// 		this.uploadSingleFile(this.uploadFiles[i]);
			// 	} catch (err) {
			// 		console.log("File upload error", err);
			// 		this.uploadFiles[i].status = "error"
			// 		this.loading = false
			// 	}
			// }
		},

		uploadMultipleFiles(uploadArr) {

			const files = []
			this.loading = true;

			//Validate file names
			for (let i = 0; i < uploadArr.length; i++) {
				if (uploadArr[i].status !== "pending") {
					console.warn("File already uploaded: ", uploadArr[i])
					continue
				}

				uploadArr[i].status = "uploading"

				const data = uploadArr[i].file
				if (data.name.length > 32) {
					const ext = "." + data.name.split('.').pop();
					const shorterName = data.name.substr(0, 32 - ext.length) + ext
					Object.defineProperty(data, 'name', {
						writable: true,
						value: shorterName
					});
				}

				files.push(uploadArr[i].file)
			}

			this.shadow.uploadMultipleFiles(this.activeDrive, files).then((resp) => {
				console.log("File Uploaded", resp);
				this.$toastr.s("Files Uploaded");

				for (let i = 0; i < uploadArr.length; i++) {
					uploadArr[i].status = "uploaded"
					uploadArr[i].result = resp
				}

				this.indexFiles();

			}).catch((err) => {
				console.log("File upload error", err);

				for (let i = 0; i < err.length; i++) {
					this.$toastr.e(err[i].error, err[i].file);
				}

			}).finally(() => {
				this.loading = false;
			});
		},

		uploadSingleFile(uploadReq) {

			this.loading = true;
			const data = uploadReq.file

			if (data.name.length > 32) {
				const ext = "." + data.name.split('.').pop();
				const shorterName = data.name.substr(0, 32 - ext.length) + ext
				Object.defineProperty(data, 'name', {
					writable: true,
					value: shorterName
				});
			}

			console.log("Attempting to upload file", data);
			uploadReq.status = "uploading"
			this.shadow.uploadFile(this.activeDrive, data).then((resp) => {
				console.log("File Uploaded", resp);
				this.$toastr.s("File Uploaded");

				uploadReq.status = "uploaded"
				uploadReq.result = resp

				this.indexFiles();

			}).catch((err) => {
				console.log("File upload error", err);

				for (let i = 0; i < err.length; i++) {
					this.$toastr.e(err[i].error, err[i].file);
				}

			}).finally(() => {
				this.loading = false;
			});
		},

		onFolderActive(folder) {
			this.activeFolder = folder;
		},

		onVisitDrive(drive) {
			console.log("Setting active drive", drive);
			this.activeDrive = drive
			this.uploadFiles = [];
			this.activeFolder = "_root";
			this.files = {};
			this.showFileInfo = false;
			this.indexFiles();
			this.pingBlokHost();
		},

		indexFiles() {
			this.onDriveInfo();
			// this.shadow.indexFiles(this.activeDrive).then((r) => {
			// 	r.data.keys.forEach((key) => {
			// 		this.files[key] = {
			// 			name: key
			// 		}
			// 	})
			// 	this.onDriveInfo();
			// });
		},

		//Ensure our drive is initialized on blok host (temp while chain listener built)
		pingBlokHost() {
			axios.post("https://webhost2.alphabatem.com/cid/register", {
				address: this.activeDrive,
			})
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
		onFileDelete(f) {
			console.log("Deleting file: ", this.activeDrive, f.url)
			this.loading = true;
			this.shadow.deleteFile(this.activeDrive, f.url).then((resp) => {
				console.log("File deleted", resp);
				this.$toastr.s("File deleted");
				this.indexFiles();

			}).catch((err) => {
				console.log("File delete error", err.message);
				this.$toastr.e("Unable to delete file");
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

		getDriveFolderConfig() {
			axios.get(`https://shdw-drive.genesysgo.net/${this.activeDrive}/_folder`).then((r) => {
				this.structure = new FolderStructure(new DriveConfig(r.data))
			}).catch((e) => {
				console.log("getDriveFolderConfig", e)
				this.structure = new FolderStructure(new DriveConfig({}))
			})
		},

		onDriveInfo() {
			this.shadow.fileInfo(this.currentDrive).then((r) => {
				let folderCalled = false;
				r.forEach((f) => {
					if (!folderCalled && f.name === "_folder") {
						this.getDriveFolderConfig()
						folderCalled = true
					}

					// this.files[f.name] = {
					// 	name: f.name,
					// 	size: f.size.toString(),
					// 	immutable: f.immutable,
					// 	toBeDeleted: f.toBeDeleted,
					// }

					this.$set(this.files, f.name, {
						name: f.name,
						size: f.size.toString(),
						immutable: f.immutable,
						toBeDeleted: f.toBeDeleted,
						storageAccount: f.storageAccount.toString(),
						url: `https://shdw-drive.genesysgo.net/${f.storageAccount.toString()}/${f.name}`
					})
				})

				if (!folderCalled) {
					this.structure = new FolderStructure(new DriveConfig()) //Clear folders (not present in req)
				}

				console.log("File Info:", r)


			}).catch((err) => {
				console.log("DriveShow error", err);
				this.$toastr.e("Unable to load drive");
			})
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
			await this.shadow.getSHDWBalances(this.$store.state.wallet_addr).then(r => {
				const token = r.value[0];
				let amount
				if (!token) {
					amount = 0.0000;
				} else {
					amount = token.account.data.parsed.info.tokenAmount.uiAmount
				}

				this.$store.commit('set_token_balance', {
					key: "shdw",
					value: amount.toFixed(4)
				});
			})

			await this.shadow.getSOLBalance(this.$store.state.wallet_addr).then(r => {
				console.log("SOL", r)
				this.$store.commit('set_token_balance', {key: "sol", value: (r / LAMPORTS_PER_SOL).toFixed(4)});
			})
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
	position: fixed;
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

p.footer {
	font-weight: bold;
}

.balance {
	font-weight: bold;
}
</style>