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
						<FolderContainer @visit="onVisitDrive" :folders="drives"></FolderContainer>
					</div>
				</div>

			</div>

			<div class="col-7 col-md-9">
				<div class="card pt-1">
					<div class="card-body">
						<FolderCreate @create="onDriveCreate" v-show="showCreateFolder" @close="hideCreate"></FolderCreate>
						<DriveShow :drive="activeDrive" @edit="onDriveEdit" @resize="onDriveResize" @delete="onDriveDelete" @freeze="onDriveFreeze"></DriveShow>
					</div>
				</div>
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
			showCreateFolder: false,
			activeDrive: null,
			drives: [],
		}
	},
	watch: {
		'$store.state.wallet_addr'() {
			console.log("Wallet address changed", this.$store.state.wallet_addr);
			this.onWalletConnected()
		}
	},
	methods: {
		showCreate() {
			this.showCreateFolder = true;
		},
		hideCreate() {
			this.showCreateFolder = false;
		},


		onDriveCreate(cfg) {
			this.shadow.create(cfg.name, cfg.size, cfg.denom)
		},

		onVisitDrive(drive) {
			this.activeDrive = drive
		},

		onDriveEdit() {
			//TODO
		},
		onDriveResize() {
			//TODO
		},
		onDriveDelete() {
			//TODO
		},
		onDriveFreeze() {
			//TODO
		},

		driveIndex() {
			this.shadow.index().then((resp) => {
				console.log("Accounts", resp);
				this.folders = resp;
			})
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

</style>