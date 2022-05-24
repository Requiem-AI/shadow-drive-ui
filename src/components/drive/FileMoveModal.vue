<template>
	<div class="md" @click="onClose">
		<div class="modal-card" @click="(e) => e.stopPropagation()">
			<div class="card">
				<div class="card-body text-center">
					<h4>SET FOLDER</h4>
					<div class="container">
						<form @submit="onFolderCreate" class="mx-auto col-10">
							<input disabled class="form-control mt-3 text-center" placeholder="File" v-model="target">

							<select class="form-control mt-2 text-center" v-model="form.name">
								<option value="" disabled>Select Folder</option>
								<option v-for="(folder,key) in structure.getFolderNames()" :key="key" :value="folder">{{folder}}</option>
							</select>

							<button @click="onFolderCreate" class="btn btn-primary btn-block mt-3">SET FOLDER</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "FileMoveModal",
	props: {
		structure: {
			required: true
		},
		target: {
			type: String,
			required: true,
		}
	},
	data() {
		return {
			form: {
				name: "",
			}
		}
	},
	methods: {
		onClose:function() {
			this.$emit("close")
		},

		onFolderCreate: function (e) {
			e.preventDefault();
			console.log("Creating folder", this.form)
			this.$emit("create-folder", this.form)
		},
	}
}
</script>

<style scoped>
.md {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
	background: rgba(0,0,0,0.6);
}

.modal-card {
	margin: auto;
	width: 25%;
	position: relative;
	margin-top: 10%;
}

input:disabled {
	color: grey;
	background: rgba(0,0,0,0.6);
}

select:focus, select, option {
	background: black;
	color: white;
}
</style>