<template>
	<div class="container">
		<div class="card">
			<div class="card-body">
				<DriveShow v-if="activeDrive !== ''" :structure="structure" :active-folder="activeFolder" :show-file-info="showFileInfo" :files="filterFiles"
						@file-info="onToggleFileInfo" :show-file="routeToFile"
						:drive="currentDrive" :uploadFiles="[]"></DriveShow>
				<div v-else>
					<div class="loader text-center my-5">
						<h1 class="text-uppercase"><i class="fa fa-spin fa-spinner"></i> <span class="ms-2">Loading Drive</span></h1>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import DriveShow from "../../components/drive/DriveShow";
import axios from "axios";
import {DriveConfig, FolderStructure} from "../../api/folder";
import {Shadow} from "../../api/shadow";

export default {
	name: "DriveInfo",
	components: {DriveShow},
	data() {
		return {
			shadow: null,
			activeDrive: "",
			currentDrive: {},
			activeFolder: "",
			structure: null,
			files: [],
			search: "",
			showFileInfo: false,
			routeToFile: null,
		}
	},
	computed: {


		filterFiles: function () {
			let folderName = this.activeFolder
			let includes = {}

			if (this.structure !== null) {
				if (folderName === "")
					folderName = this.structure.getRootName()
				if (folderName === this.structure.getRootName())
					includes = this.files; //Root so include all files
				else
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

		onToggleFileInfo(v) {
			console.log("Toggle file info", v)
			this.showFileInfo = v;
		},

		driveShow(id) {
			this.shadow.show(id).then((resp) => {
				console.log("Drive", resp);
				this.currentDrive = {publicKey: id, account: resp};
				this.onDriveInfo(id)
			}).catch((err) => {
				console.log("DriveShow error", err);
				this.$toastr.e("Unable to load drive");
			});
		},

		onDriveInfo(id) {
			console.log("Calling fileInfo", id, this.currentDrive)
			this.shadow.fileInfo(this.currentDrive).then((r) => {
				this.activeDrive = id
				let folderCalled = false;

				const fileQ = this.$route.query.file;

				r.forEach((f) => {
					if (f === null)
						return

					if (!folderCalled && f.name === "_folder") {
						this.getDriveFolderConfig()
						folderCalled = true
					}

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
				}

				console.log("File Info:", r)


				if (fileQ) {
					console.log("fileQ", fileQ)
					this.routeToFile = this.files[fileQ]
				}

			}).catch((err) => {
				console.log("DriveShow error", err);
				this.$toastr.e("Unable to load drive");
			})
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

		/**
		 * Unlikely to be on hosts PC if saved locally so just disable for consistency across views
		 * @returns {null}
		 */
		getLocalDriveFolderConfig() {
			return ""
		},
	},
	mounted() {
		this.shadow = new Shadow();
		this.shadow.connect().then(() => {
			this.driveShow(this.$route.params.id)
		});
	}
}
</script>

<style scoped>
.loader {
	min-height: 600px;
}
</style>