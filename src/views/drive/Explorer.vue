<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12 col-md-4 col-lg-3 mb-2 mb-md-0 ">
				<div class="card">
					<div class="card-header">
						<div class="row">
							<h4 class="col-auto">Drives</h4>
							<div class="col text-right">
								<button @click="driveRefresh" class="btn btn-secondary btn-sm me-1"><i class="fa fa-refresh"></i></button>
								<button @click="showSearch" class="btn btn-secondary btn-sm me-1"><i class="fa fa-search"></i></button>
								<button @click="showCreate" class="btn btn-primary btn-sm">New</button>
							</div>
						</div>
					</div>
					<div class="card-body">
						<FolderContainer @active="onVisitDrive" :folders="drives" :activeDrive="activeDrive" :loading="loading" :key="folderRefreshIdx"></FolderContainer>
						<DriveFolderStructure :key="rand" v-if="structure !== null" v-show="activeDrive !== ''" @active="onFolderActive" @add-folder="onFolderAdd"
								@delete-folder="onFolderDelete"
								:active-drive="activeDrive" :active-folder="activeFolder" :structure="structure"></DriveFolderStructure>

						<div class="row" v-show="activeDrive !== ''">
							<hr>
							<div class="col">
								<button @click="saveFolderStructure" class="btn btn-outline-secondary btn-block btn-sm py-0"><i class="fa fa-save me-2"></i> Save Structure</button>
							</div>
							<div class="col-auto">
								<label class="switch">
									<input type="checkbox" v-model="saveStructureToChain" @change="onToggleSaveLocation">
									<span :class="`${saveStructureToChain ? 'ps-2' : 'ps-4'}`" class="ps-2 slider round noselect">{{ saveStructureToChain ? 'CHAIN' : 'LOCAL' }}</span>
								</label>
							</div>
						</div>
					</div>
				</div>

				<HostInfo class="mt-2"></HostInfo>

			</div>

			<div class="col-sm-12 col-md-8 col-lg-9">
				<div class="card pt-1">
					<div class="card-body">
						<DriveSearch @search="onSearchDrive" v-show="showSearchDrives"></DriveSearch>
						<FolderCreate @create="onDriveCreate" v-show="showCreateFolder" @close="hideCreate"></FolderCreate>
						<DriveShow v-if="activeDrive !== ''" :structure="structure" :active-folder="activeFolder" :show-file-info="showFileInfo" :files="filterFiles"
								:drive="currentDrive" :uploadFiles="uploadFiles"
								@search="onSearch"
								@folder-select="onFolderActive"
								@undelete="onDriveUnDelete"
								@edit="onDriveEdit"
								@add-folder="onFolderAdd"
								@resize="onDriveResize"
								@delete="onDriveDelete"
								@file-info="onToggleFileInfo"
								@file-delete="onFileDelete"
								@file-move="onFileMove"
								@folder-add-file="onFileMoved"
								@upload-add-folder="onFolderAdded"
								@freeze="onDriveFreeze"
								@addFile="onFileUpload"
								@upload="onUpload"></DriveShow>

						<div class="my-5 text-center" v-if="activeDrive === '' && !showCreateFolder && !showSearchDrives">
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

		<FolderAddModal v-if="newFolder !== null" :structure="folderStructure" :target="newFolder.target" @close="onFolderClose" @create-folder="onFolderCreate"></FolderAddModal>
		<FileMoveModal v-if="fileToMove !== null" :structure="structure" :target="fileToMove.target" @close="onFileMoveClose" @create-folder="onFileMoveToFolder"></FileMoveModal>
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
import HostInfo from "../../components/HostInfo";
import FolderAddModal from "../../components/drive/FolderAddModal";
import FileMoveModal from "../../components/drive/FileMoveModal";
import DriveSearch from "../../components/drive/DriveSearch";

export default {
	name: "Explorer",
	components: {DriveSearch, FileMoveModal, FolderAddModal, HostInfo, DriveFolderStructure, DriveShow, FolderCreate, FolderContainer},
	data() {
		return {
			shadow: null,
			loading: false,
			showCreateFolder: false,
			showFileInfo: false,
			showSearchDrives: true,
			activeFolder: "",
			activeDrive: "",
			search: "",
			rand: '',
			drives: [],
			files: {},
			uploadFiles: [],
			folderStructure: {},
			saveStructureToChain: true,
			structure: null,
			newFolder: null,
			fileToMove: null,
			folderRefreshIdx: 0,
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

		filterFiles: function () {
			let folderName = this.activeFolder
			let includes = {}

			if (this.structure !== null) {
				if (folderName === "")
					folderName = this.structure.getRootName()
				if (folderName === this.structure.getRootName())
					includes = this.files; //Root so include all files
				else
					console.log("Files1", this.structure.getFiles(folderName), folderName, this.structure)

					this.structure.getFiles(folderName).forEach((i) => {
						includes[i] = this.files[i]
					}) //Custom folder so filter based on that
			}

			const filtered = {};
			const ok = Object.keys(includes)
			for (let i = 0; i < ok.length; i++) {
				const key = ok[i]

				if (!this.files[key])
					continue

				if (this.search !== '' && !key.toLowerCase().includes(this.search.toLowerCase())) {
					continue;
				}

				filtered[key] = this.files[key]
			}

			return filtered
		}
	},
	methods: {
		reset() {
			this.activeDrive = ""
			this.activeFolder = ""
			this.showCreateFolder = false;
			this.showFileInfo = false;
			this.showSearchDrives = false;
		},

		showCreate() {
			this.reset();
			this.showCreateFolder = true;
		},
		showSearch() {
			this.reset();
			this.showSearchDrives = true;
		},
		hideCreate() {
			this.showCreateFolder = false;
		},

		onToggleSaveLocation: function (e) {
			this.saveStructureToChain = e.target.checked;
			localStorage.setItem("shadow-drive:general:save_structure_to_chain", this.saveStructureToChain ? "1" : "0")
			this.$toastr.i("Save location changed")
		},

		saveFolderStructure: function () {
			const folderOut = this.structure.export()
			console.log(folderOut)

			if (!this.saveStructureToChain) {
				localStorage.setItem(`drive:${this.activeDrive}:structure`, folderOut)
				this.$toastr.s("Folder structure saved")
				return
			}

			const url = `https://shdw-drive.genesysgo.net/${this.activeDrive}/_folder`
			const file = new File([folderOut], "_folder")

			let promise;

			if (this.files["_folder"]) {
				promise = this.$store.state.shadow.editFile(this.activeDrive, url, file)
			} else {
				promise = this.$store.state.shadow.uploadFile(this.activeDrive, file)
			}

			this.loading = true;
			promise.then(() => {
				this.$toastr.s("Structure saved")
			}).catch((err) => {
				console.log("Structure save error", err);
				this.$toastr.e(err.message);
			}).finally(() => {
				this.loading = false;
			});

		},

		onSearch(s) {
			this.search = s;
		},

		onToggleFileInfo(v) {
			console.log("Toggle file info", v)
			this.showFileInfo = v;
		},

		onDriveCreate(cfg) {
			this.loading = true;
			this.$store.state.shadow.create(cfg.name, cfg.size, cfg.denom).then((resp) => {
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
		 * @param folder
		 * @param parent
		 */
		onFileUpload(data, folder = "", parent = "") {
			console.log("On file upload", data, folder, parent)

			if (data.name.length > 32) {
				const ext = "." + data.name.split('.').pop();
				const shorterName = data.name.substr(0, 31 - ext.length) + ext
				Object.defineProperty(data, 'name', {
					writable: true,
					value: shorterName
				});
			}

			if (folder !== "") {
				this.structure.cfg.addFolder(parent, folder)
				this.structure.cfg.addFile(data.name, folder)
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

			this.$store.state.shadow.uploadMultipleFiles(this.activeDrive, files).then((resp) => {
				console.log("File Uploaded", resp);
				this.$toastr.s("Files Uploaded");

				for (let i = 0; i < uploadArr.length; i++) {
					uploadArr[i].status = "uploaded"
					uploadArr[i].result = resp
				}

				this.indexFiles();
				this.uploadFiles = []; //All good so clear down arr

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
			this.$store.state.shadow.uploadFile(this.activeDrive, data).then((resp) => {
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
			this.structure.setActive(this.activeFolder)
		},

		onFileMove(file) {
			this.fileToMove = {
				folder: null,
				target: file.name,
			}
		},

		onFileMoved(folder, file) {
			this.structure.cfg.addFile(folder, file)
		},

		onFolderAdded(parent, folder) {
			return this.structure.cfg.addFolder(parent, folder)
		},

		onFileMoveToFolder(targetFolder) {
			console.log("onFileMoveToFolder", targetFolder)
			this.onFileMoved(targetFolder.name, this.fileToMove.target)
			this.onFileMoveClose()
		},

		onFolderAdd(targetFolder) {
			this.newFolder = {
				name: "",
				target: targetFolder,
			};
		},

		onFolderDelete(targetFolder) {
			this.activeFolder = ""
			this.structure.cfg.deleteFolder(targetFolder)
			console.log("Folder deleted")
			this.$toastr.s("Folder deleted")
			this.rand = Math.round(Math.random() * 1000)
		},

		onFolderClose() {
			this.newFolder = null
		},

		onFileMoveClose() {
			this.fileToMove = null
		},
		onFolderCreate(folder) {
			console.log(`Adding ${folder.name} to ${this.newFolder.target}`)

			const err = this.onFolderAdded(this.newFolder.target, folder.name)

			this.newFolder = null
			if (err === null) {
				this.activeFolder = folder.name
			} else {
				this.$toastr.e(err)
			}
		},

		onSearchDrive(driveAddress) {

			this.loading = true;

			// this.$store.state.shadow.indexFiles(driveAddress).then((resp) => {
			// 	// console.log("Drives", resp);
			// 	this.drives = resp;
			// 	this.onVisitDrive(driveAddress)
			// }).catch((err) => {
			// 	console.log("Drive Show error", err);
			// 	this.$toastr.e("Unable to load drive");
			// }).finally(() => {
			// 	this.loading = false;
			// });

			this.$store.state.shadow.show(driveAddress).then((resp) => {
				console.log("ShowDrives::", resp);

				if (!this.drives.filter((d) => d.publicKey.toString() === driveAddress).length) {
					console.log("Adding drive to array")
					this.drives.push({account: resp, publicKey: this.$store.state.shadow.toPublicKey(driveAddress)});
				}

				this.onVisitDrive(driveAddress)
			}).catch((err) => {
				console.log("Drive Show error", err);
				this.$toastr.e("Unable to load drive");
			}).finally(() => {
				this.loading = false;
			});
		},

		onVisitDrive(drive) {
			console.log("Setting active drive", drive);
			this.reset();
			this.activeDrive = drive
			this.uploadFiles = [];
			this.files = {};

			if (this.structure !== null)
				this.structure.reset();

			this.indexFiles();
			this.pingBlokHost();
		},

		indexFiles() {
			this.onDriveInfo();
			// this.$store.state.shadow.indexFiles(this.activeDrive).then((r) => {
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
			}).catch(() => {
				console.log("Unable to verify on blokhost")
			})
		},

		toggleSaveStructureToChain() {
			this.saveStructureToChain = !this.saveStructureToChain
			localStorage.setItem("shadow-drive:general:save_structure_to_chain", this.saveStructureToChain)
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
			console.log("Increase", data)
			this.$store.state.shadow.increaseSize(this.activeDrive, data.size, data.denom, data).then((resp) => {
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
			this.$store.state.shadow.reduceSize(this.activeDrive, data.size, data.denom).then((resp) => {
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
			this.$store.state.shadow.deleteFile(this.activeDrive, f.url).then((resp) => {
				console.log("File deleted", resp);
				this.$toastr.s("File deleted");
				this.$nextTick(() => {
					this.indexFiles();
				})

			}).catch((err) => {
				console.error("File delete error", err);
				this.$toastr.e("Unable to delete file");
			}).finally(() => {
				this.loading = false;
			});
		},
		onDriveDelete() {
			this.loading = true;
			this.$store.state.shadow.delete(this.activeDrive).then((resp) => {
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
			this.$store.state.shadow.undelete(this.activeDrive).then((resp) => {
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
			this.$store.state.shadow.setImmutable(this.activeDrive).then((resp) => {
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

				//Fallback to looking at local storage
				this.structure = new FolderStructure(new DriveConfig(this.getLocalDriveFolderConfig()))
				this.activeFolder = this.structure.getRootName();
			})
		},


		getLocalDriveFolderConfig() {
			let localData = localStorage.getItem(`drive:${this.activeDrive}:structure`)
			if (localData == null)
				localData = ""
			else
				localData = JSON.parse(localData)

			return localData
		},

		onDriveInfo() {
			this.$store.state.shadow.fileInfo(this.currentDrive).then((r) => {
				let folderCalled = false;
				r.forEach((f) => {
					if (f === null)
						return

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
					this.structure = new FolderStructure(new DriveConfig(this.getLocalDriveFolderConfig()))
					// this.structure = new FolderStructure(new DriveConfig("")) //Clear folders (not present in req)
				}

				console.log("File Info:", r)


			}).catch((err) => {
				console.log("DriveShow error", err);
				this.$toastr.e("Unable to load drive");
			})
		},

		driveShow(id) {
			this.$store.state.shadow.show(id).then((resp) => {
				console.log("Drive", resp);
				this.currenDrive = resp;
			}).catch((err) => {
				console.log("DriveShow error", err);
				this.$toastr.e("Unable to load drive");
			});
		},

		driveRefresh() {
			this.driveIndex(false)
		},

		async loadV2DriveInfo() {
			for (let i = 0; i < this.drives.length; i++) {
				if (this.drives[i].account.owner2) {
					continue
				}

				try {
					const info = await this.$store.state.shadow.driveInfo(this.drives[i].publicKey)
					this.drives[i].account = Object.assign(this.drives[i].account, info.data)
				} catch (e) {
					console.log("e", e)
				}
			}
			this.folderRefreshIdx++;
		},

		driveIndex(loading = true) {
			if (loading)
				this.loading = true;

			this.$store.state.shadow.index().then((resp) => {
				console.log("IndexDrives::", resp);
				this.drives = resp;
				this.$toastr.s("Drives loaded");
				this.loadV2DriveInfo();

			}).catch((err) => {
				console.log("DriveIndex error", err);
				this.$toastr.e("Unable to load drives");
			}).finally(() => {
				if (loading)
					this.loading = false;
			});
		},

		async onWalletConnected() {
			await this.$store.state.shadow.initDrive(this.$store.state.wallet_addr);
			this.driveIndex()
			this.getBalances();
		},

		getBalances() {
			this.$store.state.shadow.getSHDWBalances(this.$store.state.wallet_addr).then(r => {
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

			this.$store.state.shadow.getSOLBalance(this.$store.state.wallet_addr).then(r => {
				console.log("SOL", r)
				this.$store.commit('set_token_balance', {key: "sol", value: (r / LAMPORTS_PER_SOL).toFixed(4)});
			})
		}
	},
	mounted() {
		this.$store.commit('set_shadow', new Shadow());
		if (this.$store.state.wallet_connected) {
			this.onWalletConnected()
		}


		let storageLocation = localStorage.getItem("shadow-drive:general:save_structure_to_chain");
		if (storageLocation === null) {
			localStorage.setItem("shadow-drive:general:save_structure_to_chain", "1")
			storageLocation = "1"
		}

		console.log("Save location: ", storageLocation)
		this.saveStructureToChain = storageLocation === "1";

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
</style>