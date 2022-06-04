<template>
	<img class="token-logo"
			:src="`https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${mintAddr}/logo.png`" alt="shdw logo">
</template>

<script>
export default {
	name: "SHDW",
	props: {
		mintAddr: {
			type: String,
			default: () => {
				return "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y"
			}
		}
	}
}
</script>

<style scoped>

</style>