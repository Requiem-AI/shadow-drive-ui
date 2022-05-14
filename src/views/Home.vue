<template>
	<div class="home">
		Home

		<Footer></Footer>
	</div>
</template>

<script>
import Footer from "../components/Footer";

export default {
	name: "LandHome",
	components: {
		Footer,
	},
	data() {
		return {
			//
		}
	},
	computed: {
		//
	},
	methods: {
		//
	}
}
</script>

<style scoped>

.home {
	color: white;
}

h6 {
	text-transform: uppercase;
}

link {
	cursor: pointer;
}

.gleam-frame {
	width: 100%;
	height: 1400px;
	overflow: hidden;
	border-radius: 9px;
}

</style>