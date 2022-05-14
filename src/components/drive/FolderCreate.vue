<template>
	<div class="folder-create">
		<div class="row text-center">
			<h4>Create Drive</h4>
		</div>
		<div class="row">
			<div class="col-12 my-2">
				<input class="form-control" type="text" v-model="form.name" placeholder="Drive name">
			</div>
			<div class="col-12 my-2">
				<div class="input-group">
					<input class="form-control" type="number" min="0" step="1" v-model="form.size" placeholder="Size">
					<select v-model="form.denom" class="form-control">
						<option value="KB">KB</option>
						<option value="MB">MB</option>
						<option value="GB">GB</option>
					</select>
				</div>
			</div>
			<div class="col-12 text-center mt-3">
				<i>Creating a drive called <code>{{form.name ? form.name : '-'}}</code> with an initial size of <code>{{form.size}}{{form.denom}}</code></i>
			</div>
			<div class="col-12 text-center mt-3">
				<button class="btn btn-primary" @click="onCreate">Create</button>
				<button @click="onCancel" class="btn btn-secondary btn-sm">Cancel</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "FolderCreate",
	data() {
		return {
			form: {
				name: "",
				size: 1,
				denom: "KB",
			}
		}
	},
	methods: {
		onCreate: function () {
			console.log("Creating", this.form)
			this.$emit("create", this.form);
		},
		onCancel: function () {
			this.$emit('close');
		}
	}
}
</script>

<style scoped>
.close {
	border: 2px solid white;
	border-radius: 14px;
	font-weight: bold;
	cursor: pointer;
	transition: all .2s;
}

.close:hover {
	border-color: darkred;
	color: darkred;
}
</style>