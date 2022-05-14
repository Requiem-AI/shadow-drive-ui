<template>
	<div class="container-fluid p-3 mt-5">
		<div class="container text-center">

			<div class="row text-center">
				<div class="col">
<!--					<img src="@/assets/images/alpha_logo_new.png" class="login_img mr-3">-->
					<h1 class="mt-1 mb-5">SHADOW DRIVE UI</h1>
				</div>
			</div>

			<div class="login-container col-8 offset-2 wow fadeIn">
				<h1 class="">Login</h1>

				<div class="row">
					<div class="col-12 my-2">
							<Phantom @connected="onConnect" button_text="Phantom" class="btn btn-secondary btn-block">
								<img class="wallet-icon" src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB3aWR0aD0iMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1MzRiYjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1NTFiZjkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9Ii41IiB4Mj0iLjUiIHkxPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii44MiIvPjwvbGluZWFyR3JhZGllbnQ+PGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgZmlsbD0idXJsKCNhKSIgcj0iMTciLz48cGF0aCBkPSJtMjkuMTcwMiAxNy4yMDcxaC0yLjk5NjljMC02LjEwNzQtNC45NjgzLTExLjA1ODE3LTExLjA5NzUtMTEuMDU4MTctNi4wNTMyNSAwLTEwLjk3NDYzIDQuODI5NTctMTEuMDk1MDggMTAuODMyMzctLjEyNDYxIDYuMjA1IDUuNzE3NTIgMTEuNTkzMiAxMS45NDUzOCAxMS41OTMyaC43ODM0YzUuNDkwNiAwIDEyLjg0OTctNC4yODI5IDEzLjk5OTUtOS41MDEzLjIxMjMtLjk2MTktLjU1MDItMS44NjYxLTEuNTM4OC0xLjg2NjF6bS0xOC41NDc5LjI3MjFjMCAuODE2Ny0uNjcwMzggMS40ODQ3LTEuNDkwMDEgMS40ODQ3LS44MTk2NCAwLTEuNDg5OTgtLjY2ODMtMS40ODk5OC0xLjQ4NDd2LTIuNDAxOWMwLS44MTY3LjY3MDM0LTEuNDg0NyAxLjQ4OTk4LTEuNDg0Ny44MTk2MyAwIDEuNDkwMDEuNjY4IDEuNDkwMDEgMS40ODQ3em01LjE3MzggMGMwIC44MTY3LS42NzAzIDEuNDg0Ny0xLjQ4OTkgMS40ODQ3LS44MTk3IDAtMS40OS0uNjY4My0xLjQ5LTEuNDg0N3YtMi40MDE5YzAtLjgxNjcuNjcwNi0xLjQ4NDcgMS40OS0xLjQ4NDcuODE5NiAwIDEuNDg5OS42NjggMS40ODk5IDEuNDg0N3oiIGZpbGw9InVybCgjYikiLz48L3N2Zz4K">
							</Phantom>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Phantom from "../../components/wallet/Phantom";
import store from "../../store";

export default {
	name: "Login",
	components: {Phantom},
	data() {
		return {
			metamaskEnabled: false,
		}
	},
	methods: {
		onConnect: function () {
			let nextPage = "/profile"

			console.log("History", store.state.routerHistory);
			if (store.state.routerHistory.length > 0)
				nextPage = store.state.routerHistory[store.state.routerHistory.length - 1]

			console.log("Connected, redirecting to: ", nextPage)
			this.$router.push(nextPage);
		}
	}
}
</script>

<style scoped>
h1, h2, h3 {
	color: white;
}

h1 {
	line-height: 2em;
	font-size: 3em;
}

.login_img {
	max-height: 100px;
	border-radius: 14px;
	box-shadow: black 0px 0px 10px;
}

.login-container {
	color: white;
	background: #0E0E0F;
	border-radius: 8px;
	padding: 2%;
	transition: all 0.3s ease-in-out;
}

.btn-block {
	font-size: 1.4em;
	line-height: 3em;
}
.wallet-icon {
	margin-right: 10px;
	max-height: 34px;
}

</style>