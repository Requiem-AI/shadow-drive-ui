<template>
	<div class="drive search text-center">
		<h1>Search</h1>

		<div class="my-5 col-6 offset-3">
			<form @submit="onSearch">
				<input pattern="^[1-9A-HJ-NP-Za-km-z]{32,44}$" required v-model="search" class="form-control form-control-lg text-center" placeholder="Drive Address">

				<div class="mt-3">
					<Phantom v-if="!$store.state.wallet_connected" class="btn btn-outline-light"></Phantom>
					<button v-else type="submit" class="btn btn-outline-light"><i class="fa fa-search"></i> Explore Drive</button>
				</div>
			</form>
		</div>

		<div class="col-8 offset-2">
			<p class="small grey"></p>
		</div>
	</div>
</template>

<script>
import Phantom from "../wallet/Phantom";
export default {
	name: "DriveSearch",
	components: {Phantom},
	data() {
		return {
			search: '',
		}
	},
	methods: {
		onSearch(e) {
			e.preventDefault();
			this.$emit("search", this.search)
		}
	}
}
</script>

<style scoped>
input::placeholder, .grey {
	color: grey;
}
</style>