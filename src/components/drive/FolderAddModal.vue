<template>
	<div class="md" @click="onClose">
		<div class="modal-card" @click="(e) => e.stopPropagation()">
			<div class="card">
				<div class="card-body text-center">
					<h4>NEW FOLDER</h4>
					<div class="container">
						<form @submit="onFolderCreate" class="mx-auto col-10">
							<input ref="first" class="form-control mt-3 text-center" placeholder="Folder Name" v-model="form.name">
							<input disabled class="form-control mt-3 text-center" placeholder="Parent" v-model="form.target">
							<button @click="onFolderCreate" class="btn btn-primary btn-block mt-3">ADD</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "FolderAddModal",
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
				target: null,
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
	},
	mounted() {
		this.$refs.first.focus()
		this.form.target = this.target
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
</style>