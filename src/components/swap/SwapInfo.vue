<template>
	<div class="swap-info" v-if="$store.state.wallet_connected">
		<div class="info" v-if="quote.marketInfos.length > 0">
			<div class="row">
				<div class="col text-left"><h4>SWAP</h4></div>
				<div class="col-auto"><h5 class="small">{{ marketInfoInput.label }}</h5></div>
			</div>

			<div class="row mt-3">
				<div class="col">

					<div class="input-group swap-input">
						<SHDW :mint-addr="marketInfoInput.inputMint"></SHDW>
						<input :disabled="loading" type="number" step="0.1" :min="0.0" :max="9223372036854775807" @keyup="getQuoteKeyed" @change="getQuote" v-model="inputAmount"
								class="form-control">
					</div>

				</div>
				<div class="col-auto"><i class="mt-2 fa fa-arrow-right"></i></div>
				<div class="col">


					<div class="input-group swap-input">
						<SHDW :mint-addr="marketInfoOutput.outputMint"></SHDW>
						<input class="form-control" :disabled="true" :value="uiAmount(quote.outAmountWithSlippage)">
					</div>
				</div>
			</div>
			<div class="row mt-3">
				<div class="col-8 offset-2">
					<button @click="swapToken" :disabled="marketInfoInput.notEnoughLiquidity || loading" class="btn btn-outline-light btn-block">{{ loading ? 'LOADING' : 'SWAP' }}</button>
				</div>
			</div>

			<div class="row mt-3">
				<div class="col-10 offset-1">
					<div class="table-container px-3 py-1">
						<table class="table table-sm table-borderless text-left text-white info-table small">
							<tbody>
							<tr>
								<td>Rate</td>
								<td>{{ 1 }} SOL ≈ {{ price.price }} SHDW</td>
							</tr>
							<tr>
								<td>Price Impact</td>
								<td>~ {{ quote.priceImpactPct.toFixed(4) }}%</td>
							</tr>
							<tr>
								<td>Minimum Received</td>
								<td>{{ uiAmount(quote.outAmountWithSlippage) }} SHDW</td>
							</tr>
							<tr>
								<td>Fees paid to LP</td>
								<td>{{ uiAmount(marketInfoInput.lpFee.amount) }} ({{ marketInfoInput.lpFee.pct }}%)</td>
							</tr>
							<tr>
								<td>Transaction Fee</td>
								<td>{{ marketInfoInput.platformFee.amount }} SOL</td>
							</tr>
							<tr>
								<td>Hops</td>
								<td>{{ quote.marketInfos.length }}</td>
							</tr>
							<tr>
								<td>Swap Provider</td>
								<td><a target="_blank" href="https://jup.ag">Juipter AG</a></td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import JupAg from "../../api/jup_ag";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import SHDW from "../tokens/SHDW";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-wallets";

export default {
	name: "SwapInfo",
	components: {SHDW},
	data() {
		return {
			pk: null,
			isTyping: false,
			loading: false,
			inputAmount: 1,
			keyTimeout: null,
			quote: {
				marketInfos: []
			},
			price: {
				price: 0.0
			}
		}
	},
	computed: {
		marketInfoInput: function () {
			return this.quote.marketInfos[0]
		},
		marketInfoOutput: function () {
			return this.quote.marketInfos[this.quote.marketInfos.length - 1]
		}
	},
	methods: {
		uiAmount: function (a) {
			return (a / LAMPORTS_PER_SOL).toFixed(4)
		},

		getQuoteKeyed: function () {
			this.lastTyped = Date.now();

			if (this.keyTimeout !== null)
				return

			this.keyTimeout = setInterval(() => {
				if (this.lastTyped + 300 < Date.now()) {
					this.getQuote()
					clearInterval(this.keyTimeout)
					this.keyTimeout = null
				}
			}, 600)
		},

		getPrice: function () {
			JupAg.price(JupAg.SOL_MINT, JupAg.SHDW_MINT).then(r => {
				this.price = r.data.data
			})
		},

		getQuote: function () {
			if (this.inputAmount <= 0 || this.loading) {
				return
			}
			this.loading = true;
			if (this.quote.marketInfos.length > 0)
				this.quote.marketInfos[this.quote.marketInfos.length - 1].outAmount = 0

			JupAg.quote(JupAg.SOL_MINT, JupAg.SHDW_MINT, this.inputAmount * LAMPORTS_PER_SOL).then(r => {

				if (r.data.data.length === 0) {
					this.$toastr.e("No swap available!")
					this.quote = {
						marketInfos: [{label: ""}]
					}
					return
				}

				this.quote = r.data.data[0]
			}).finally(() => {
				this.loading = false;
			})
		},

		handleSwap: async function (r) {
			console.log("r", r.data)
			const {setupTransaction, swapTransaction, cleanupTransaction} = r.data

			console.log("Wallet ", this.pk._wallet)

			this.loading = true
			try {
				const txid = await JupAg.doSwap(this.pk._wallet, [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean))
				this.$toastr.s(`https://explorer/solana.com/tx/${txid}` ,"Swap sent")
			} catch (e) {
				this.$toastr.e(e.message, "Swap failed")
			}
			this.loading = false
		},

		swapToken: async function () {
			this.pk = new PhantomWalletAdapter();
			await this.pk.connect();
			console.log("PK Connected: ", this.pk)

			JupAg.swap(this.quote, this.pk.publicKey.toString()).then(this.handleSwap)
		}
	},
	mounted() {
		this.getPrice()
		this.getQuote()
	}
}
</script>

<style scoped>
.swap-input {
	background: black;
	border-radius: 9px;
}

.swap-input input:disabled {
	background: black;
	color: grey;
}

.table-container {
	background: rgba(0,0,0,0.2);
	border-radius: 9px;
}

input:disabled:hover {
	transform: none;
	cursor: not-allowed;
}

.info-table tr, .info-table td {
	padding: 0;
	color: lightgray;
	font-size: 0.9em;
}

tr td:nth-child(2) {
	text-align: right;
}

</style>