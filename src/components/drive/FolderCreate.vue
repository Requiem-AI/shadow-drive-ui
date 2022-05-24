<template>
	<div class="folder-create">
		<div class="row text-center">
			<h4>Create Drive</h4>
		</div>
		<div class="row">
			<div class="col-12 my-2">
				<label>Name: </label>
				<input class="form-control" type="text" v-model="form.name" placeholder="Drive name">
			</div>
			<div class="col-12 my-2">
				<label>Size: </label>
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

				<p class="small mt-3 fw-bold">
					Estimated Cost: <SHDW></SHDW> <code
						class="fs-6">
					~{{shdwCost}}</code>
					SHDW
				</p>
			</div>

			<div class="row text-center">
				<div class="col-6 offset-3" v-if="!canAfford">
					<div class="alert alert-warning p-1 small">
						<p class="text-white mb-0">You may not have enough funds for this!</p>
						<span class="text-white ">Current Balance:</span> <SHDW class="small"></SHDW> {{$store.state.balances['shdw']}} - <span class="text-white">Missing:
					</span><SHDW class="small"></SHDW>{{amountMissing}} SHDW
					</div>
				</div>
			</div>

			<div class="col-12 text-center mt-3">
				<button :disabled="!canCreate" class="btn btn-primary me-2" @click="onCreate">Create</button>
				<button @click="onCancel" class="btn btn-secondary">Cancel</button>
			</div>
		</div>
	</div>
</template>

<script>
import SHDW from "../tokens/SHDW";
export default {
	name: "FolderCreate",
	components: {SHDW},
	props: {
		loading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			BYTE_TO_SHDW: 1000000000,
			form: {
				name: "",
				size: 1,
				denom: "KB",
			},
		}
	},
	computed: {
		canAfford: function() {
			return this.shdwCost <= parseFloat(this.$store.state.balances['shdw'])
		},

		canCreate: function() {
			return this.form.name !== "" && (this.form.size > 1 || this.form.denom !== "KB")
		},

		amountMissing: function() {
			return this.shdwCost - parseFloat(this.$store.state.balances['shdw'])
		},

		shdwCost: function() {
			return (this.bytes/this.BYTE_TO_SHDW).toFixed(4) //1 Shade == 1 byte
		},

		bytes: function() {
			let byte = 1024 //KB

			switch(this.form.denom) {
				case "KB":
					byte = 1024;
					break
				case "MB":
					byte = 1024 * 1024;
					break
				case "GB":
					byte = 1024 * 1024 * 1024;
					break
			}

			return this.form.size * byte
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