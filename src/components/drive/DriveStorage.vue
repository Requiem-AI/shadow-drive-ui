<template>
	<div>
		<span>{{ storageUsed }} {{ sizeDenom }}</span> / <span>{{ storageTotal }} {{ sizeDenom }}</span>
	</div>
</template>

<script>
export default {
	name: "DriveStorage",
	props: {
		folder: {
			type: Object,
			required: true
		},
	},
	computed: {
		sizeDenom: function () {
			if (this.folder.account.storage < 1024) {
				return "B";
			}
			if (this.folder.account.storage < 1048576) {
				return "KB";
			}
			if (this.folder.account.storage < 1073741824) {
				return "MB";
			}
			return "GB";
		},

		storageUsed: function () {
			return (this.storageTotal - this.storageAvailable).toFixed(2);
		},

		storageAvailable: function () {
			return this.toSize(this.folder.account.storageAvailable).toFixed(2);
		},
		storageTotal: function () {
			return this.toSize(this.folder.account.storage).toFixed(2);
		},
	},
	methods: {
		toSize: function (s) {
			switch (this.sizeDenom) {
				case "B":
					return s;
				case "KB":
					return s / 1024;
				case "MB":
					return s / 1024 / 1024;
				case "GB":
					return s / 1024 / 1024 / 1024;
			}
		}
	}
}
</script>

<style scoped>

</style>