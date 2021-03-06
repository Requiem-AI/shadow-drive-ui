import axios from "axios";
import {Transaction} from "@solana/web3.js";
import {web3} from "@project-serum/anchor";

export class JupAg {

	USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
	SOL_MINT = "So11111111111111111111111111111111111111112";
	SHDW_MINT = "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y";

	BASE_URL = "https://quote-api.jup.ag"


	quote(inputMint, outputMint, amount, slippage = -1, feeBps = -1, onlyDirectRoutes = null) {
		let uri = `${this.BASE_URL}/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`

		if (slippage > 0)
			uri = `${uri}&slippage=${slippage}`

		if (feeBps > 0)
			uri = `${uri}&feeBps=${feeBps}`

		if (onlyDirectRoutes !== null)
			uri = `${uri}&onlyDirectRoutes=${onlyDirectRoutes}`

		return axios.get(uri)
	}

	price(t1, t2) {
		let uri = `${this.BASE_URL}/v1/price?id=${t1}&vsToken=${t2}`
		return axios.get(uri)
	}

	swap(route, walletAddr) {

		const payload = {
			route: route,
			wrapUnwrapSOL: true,
			userPublicKey: walletAddr
		}

		console.log("Swapping using route: ", payload)
		return axios.post(`${this.BASE_URL}/v1/swap`, payload)
	}

	getConnection() {
		return new web3.Connection(
			"https://ssc-dao.genesysgo.net/"
		);
	}

	async doSwap(wallet, serializedTransactions) {
		const connection = this.getConnection()
		console.log("Seapping: ", wallet)

		for (let serializedTransaction of serializedTransactions) {
			console.log("Running txn: ", serializedTransaction)
			const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'))

			console.log("TXN: ", transaction)

			const txid = await wallet.signAndSendTransaction(transaction, {
				skipPreflight: true,
				maxRetries: 3,
			})
			console.log("TXN:", txid)

			await connection.confirmTransaction(txid.signature, "processed")
			return txid.signature
		}
	}

	routeMap(onlyDirectRoutes = null) {
		let uri = `${this.BASE_URL}/v1/indexed-route-map`
		if (onlyDirectRoutes !== null)
			uri = uri + `?onlyDirectRoutes=${onlyDirectRoutes}`

		return axios.get(uri)
	}

}

export default new JupAg()