<template>
	<div>
<!--		<span>{{ storageUsed }} {{ sizeDenom }}</span> / <span>{{ storageTotal }} {{ sizeDenom }}</span>-->
		<span>{{ storageTotal }} {{ sizeDenom }}</span>
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
			const bytes = this.folder.account.storage ||  this.folder.account.reserved_bytes

			if (!bytes)
				return ""

			if (bytes < 1024) {
				return "B";
			}
			if (bytes < 1048576) {
				return "KB";
			}
			if (bytes < 1073741824) {
				return "MB";
			}
			return "GB";
		},

		storageUsed: function () {
			return (this.storageTotal - this.storageAvailable).toFixed(2);
		},

		storageAvailable: function () {
			if (this.isV2)
				return this.toSize(this.folder.account.reserved_bytes - this.folder.account.current_usage).toFixed(2)

			return this.toSize(this.folder.account.storageAvailable).toFixed(2);
		},
		storageTotal: function () {
			let store = this.folder.account.storage
			if (this.isV2)
				store = this.folder.account.reserved_bytes

			if (!store)
				return "Loading"

			console.log("StorageTotal", store)
			return this.toSize(store).toFixed(2);
		},

		isV2: function() {
			return !this.folder.account.owner2 || this.folder.version === "V2";
		}
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

			return s
		}
	}
}
</script>

<style scoped>

</style>