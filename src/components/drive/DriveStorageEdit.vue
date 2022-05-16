<template>
	<div class="row">
		<div class="col"><select v-model="form.way" class="form-control">
			<option value="UP">INCREASE BY</option>
			<option value="DOWN">REDUCE BY</option>
		</select>
		</div>
		<div class="col"><input class="form-control" type="number" min="0" step="1" v-model="form.size" placeholder="Size">
		</div>
		<div class="col"><select v-model="form.denom" class="form-control">
			<option value="KB">KB</option>
			<option value="MB">MB</option>
			<option value="GB">GB</option>
		</select></div>
		<div class="col">
			<button @click="$emit('edit', form)" class="btn btn-primary"><i class="fa fa-save"></i></button>
		</div>
	</div>
</template>

<script>
export default {
	name: "DriveStorageEdit",
	props: {
		folder: {
			type: Object,
			required: true
		},
	},
	data() {
		return {
			form: {
				way: "UP",
				size: 0,
				denom: "KB"
			}
		}
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

		storageAvailable: function () {
			return this.toSize(this.folder.account.storageAvailable);
		},
		storageTotal: function () {
			return this.toSize(this.folder.account.storage);
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
	},
	mounted() {
		this.form.size = this.storageTotal
		this.form.denom = this.sizeDenom;
	},
}
</script>

<style scoped>

</style>