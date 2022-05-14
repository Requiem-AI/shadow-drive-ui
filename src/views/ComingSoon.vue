<template>
	<div class="coming-soon">
		<div class="row mt-5">
			<div class="offset-md-1 offset-lg-3 col-md-10 col-lg-6 col-sm-12">
				<div class="card mt-5">
					<div class="card-body text-center">
						<h1 class="blue">Marketplace Coming Soon</h1>

						<h2 class="mt-4"><i class="fa fa-code"></i> Marketplace Under Development</h2>
						<h5 class="mt-4">Release Date</h5>
						<h6 class="blue">April 2022</h6>


						<div class="row mt-5">
							<div class="col-md-6 col-lg-4 offset-lg-2">
								<router-link class="btn btn-primary btn-block" to="/">Home</router-link>
							</div>
							<div class="col-md-6 col-lg-4 mt-3 mt-md-0">
								<a href="https://docs.alphabatem.com/alphabatem/social-and-marketing/roadmap" target="_blank" class="btn btn-secondary btn-block">Roadmap</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "ComingSoon"
}
</script>

<style scoped>
.blue {
	color: #00bcd4;
}

.release {
	color: white;
}
</style>