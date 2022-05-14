<template>
	<a v-on:click="handleConnect">
		<slot></slot>
		{{ connected ? shortAddr : wallet_addr }}</a>
</template>

<script>
import Web3 from 'web3'

export default {
	name: "Phantom",
	props: {
		button_text: {
			type: String,
			default: function () {
				return "Connect Wallet"
			}
		}
	},
	data() {
		return {
			metamask_installed: false,
			connected: false,
			wallet_addr: "",
		}
	},
	computed: {
		shortAddr: function () {
			return `${this.wallet_addr.substr(0, 6)}...${this.wallet_addr.substr(-4)}`;
		},
	},
	mounted() {
		this.wallet_addr = this.button_text;

		if (window.solana && this.$route.path !== '/')
			window.solana.connect({onlyIfTrusted: true}).then(this.handleAuthResponse)
	},
	methods: {
		connectWallet: function () {
			if (typeof window.solana !== 'undefined') {
				console.log('Phantom is installed!');

				this.ethEnabled(); //Enable etherum connection
				return
			}
		},

		ethEnabled: function (provider) {
			console.log("Phantom - Setting provider", provider);
			window.web3 = new Web3(provider);
		},

		handleConnect: function () {
			console.log("Connecting")
			const provider = this.getProvider();
			if (provider) {
				this.triggerAuth(provider);
			} else {
				console.log('Please install Phantom!');
			}
		},

		getProvider: function () {
			if ("solana" in window) {
				const provider = window.solana;
				if (provider.isPhantom) {
					return provider;
				}
			}
			return null;
		},

		triggerAuth: function (provider) {
			const isPhantomInstalled = window.solana && window.solana.isPhantom
			if (!isPhantomInstalled) {
				this.wallet_addr = 'Onboarding in progress';

				window.open("https://phantom.app/", "_blank");
			}


			if (typeof window.solana == 'undefined') {
				this.wallet_addr = "Unable to connect";
				return
			}

			console.log('Phantom is installed!');

			this.ethEnabled(provider); //Enable etherum connection


			window.solana.connect().then(this.handleAuthResponse).catch((e) => {
				console.log("Connect err: ", e)
				this.wallet_addr = "Unable to connect"
			});
		},

		handleAuthResponse: function (resp) {
			const acc = resp.publicKey.toString()
			console.log("Public address", acc);
			this.wallet_addr = acc;
			this.connected = true;
			this.$emit("wallet-connected", this.wallet_addr); //Fire connected event
			this.$store.commit('set_wallet_addr', this.wallet_addr);
			this.$store.commit('set_wallet_connected', this.connected);
			this.$emit("connected", this.connected)
		},

		signMessage: async function (msg) {
			const encodedMessage = new TextEncoder().encode(msg);
			return await window.solana.signMessage(encodedMessage, "utf8")
		}
	},
}
</script>

<style scoped>
a {
	color: white !important;
}

</style>