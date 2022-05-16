<template>
	<div :class="`folder ${active ? 'active' : ''}`" @click="onClick">
		<div class="row">
			<div class="col">
				<h5 data-toggle="tooltip" data-placement="top" :title="folder.publicKey">{{ folder.account.identifier }}</h5>
			</div>
			<div class="col size text-center">
				<DriveStorage :folder="folder"></DriveStorage>
			</div>
			<div class="col text-center" v-if="folder.account.toBeDeleted">
				<span class="badge bg-danger">Deleting</span>
			</div>
			<div class="col text-right">
				<DriveLock :folder="folder"></DriveLock>
			</div>
		</div>
	</div>
</template>

<script>
import DriveStorage from "./DriveStorage";
import DriveLock from "./DriveLock";
export default {
	name: "Folder",
	components: {DriveLock, DriveStorage},
	props: {
		folder: {
			type: Object,
			required: true
		},
		active: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		createdAt: function () {
			return new Date(this.folder.account.creationTime).toLocaleString();
		}
	},
	methods: {
		onClick: function () {
			this.$emit('active', this.folder.publicKey.toString());
		}
	},
	mounted() {
	}
}
</script>

<style scoped>
.folder {
	font-size: 0.8em;
	cursor: pointer;
	padding: 10px;
	border: 1px solid grey;
	border-radius: 7px;
}

.folder.active {
	background-color: rgba(10, 159, 185, 0.7);
	border: 1px solid white;
}

h5, h6 {
	margin-bottom: 0;
}

h6 {
	font-size: 0.6em;
}
</style>