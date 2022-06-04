<template>
	<div class="card">
		<div class="card-body text-center">
			<div v-if="$store.state.wallet_connected" class="balances row text-center">
				<div class="col-12" v-show="$store.state.balances['shdw'] < 0.02">
					<div class="alert p-0 alert-warning">Not Enough SHDW</div>
				</div>
				<div class="col-12" v-show="$store.state.balances['sol'] <= 0">
					<div class="alert p-0 alert-warning">Not Enough SOL</div>
				</div>

<!--				<div class="col-12 col-md-12 col-lg-6 my-2 my-lg-0 balance">-->
<!--					<img alt="solana token" class="sol-icon" src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" height="32px"> {{ $store.state.balances['sol'] }} SOL-->
<!--				</div>-->

<!--				<div class="col-12 col-md-12 col-lg-6 my-2 my-lg-0 balance">-->
<!--					<img alt="shdw token" src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y/logo.png" height="32px"> {{ $store.state.balances['shdw'] }} SHDW-->
<!--				</div>-->
			</div>


			<SwapInfo></SwapInfo>

		</div>

		<div class="card-footer text-center">
			<p class="small footer">Created With ❤️ By <a target="_blank" href="https://twitter.com/alpha_batem">@AlphaBatem</a>
			</p>
			<p class="mb-0 small">
				<a target="_blank" href="https://solana.com">Solana</a> |
				<a target="_blank" href="https://alphabatem.com">AlphaBatem</a> |
				<a target="_blank" href="https://metaverse.alphabatem.com">Metaverse</a> |
				<a target="_blank" href="https://genesysgo.com/">GenesysGo</a>
			</p>
		</div>
	</div>
</template>

<script>
import SwapInfo from "./swap/SwapInfo";
export default {
	name: "HostInfo",
	components: {SwapInfo}
}
</script>

<style scoped>
p.footer {
	font-weight: bold;
}

img {
	border-radius: 36px;
}

.balance {
	font-weight: bold;
}
</style>