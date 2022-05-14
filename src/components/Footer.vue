<template>
	<footer class="row py-5">
		<div class="row">
			<div class="col-lg-6 col-sm-12 col-md-6">

				<div class="row">
					<div class="col-3 align-right">
						<img class="footer-img" src="@/assets/images/alpha_logo_new.png">
					</div>
					<div class="col">
						<h5>AlphaBatem</h5>
						<p>© 2022 AlphaBatem All Rights Reserved.</p>

						<div class="row">
							<div class="col-lg-6 col-sm-12">
								<router-link to="/terms-and-conditions">Terms & Conditions</router-link>
							</div>
							<div class="col-lg-6 col-sm-12">
								<router-link to="/privacy">Privacy Policy</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="col col-sm-12 col-md-6 text-center">
				<div class="row mt-4">
					<div class="col"><h6><a class="no-underline" href="#hero">Home</a></h6></div>
					<div class="col"><h6><a class="no-underline" href="#sectors">Sectors</a></h6></div>
					<div class="col"><h6><a class="no-underline" href="#features">Features</a></h6></div>
				</div>
				<div class="row mt-3">
					<div class="col"><h6><a class="no-underline" href="#whitelist">Whitelist</a></h6></div>
					<div class="col"><h6><a class="no-underline" href="#purchase">Buy Land</a></h6></div>
					<div class="col"><h6><a class="no-underline" href="#contact">Contact Us</a></h6></div>
				</div>

			</div>
		</div>

		<div class="row mt-4 text-center">
			<div class="col-lg-4 offset-lg-4 row">
				<div class="col"><a target="_blank" href='https://medium.com/@AlphaBatem'>
					<img class="social-icon" alt="medium" src="@/assets/images/medium.svg"></a>
				</div>
				<div class="col"><a target="_blank" href='https://discord.gg/cgKGFQG4jM'>
					<img class="social-icon" alt="discord" src="@/assets/images/discord.svg"></a>
				</div>
				<div class="col"><a target="_blank" href='https://www.linkedin.com/company/alphabatem'>
					<img
							class="social-icon" alt="linkedin" src="@/assets/images/linkedin.svg"></a></div>
				<div class="col"><a target="_blank" href='https://twitter.com/alpha_batem'>
					<img class="social-icon" alt="twitter" src="@/assets/images/twitter.svg"></a>
				</div>
				<div class="col"><a target="_blank" href='https://t.me/alphabatem'>
					<img class="social-icon" alt="telegram" src="@/assets/images/telegram.svg"></a>
				</div>
			</div>
		</div>

	</footer>
</template>

<script>
export default {
	name: "Footer"
}
</script>

<style scoped>


footer {
	background: black;
	color: white;
	min-height: 350px;
}

.footer-img {
	width: auto;
	height: 100px;
}

a {
	color: white;
}

.no-underline {
	text-decoration: none;
}

.social-icon {
	color: white;
	fill: white;
	max-height: 30px;
	filter: brightness(100%) contrast(1%);
	cursor: pointer;
}

.align-right {
	text-align: right;
}
</style>