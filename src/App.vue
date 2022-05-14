<template>
	<div id="app">
		<Topnav></Topnav>
		<router-view class="container-fluid"></router-view>
	</div>
</template>

<script>

import Topnav from "./components/Topnav";

export default {
	name: 'App',
	components: {
		Topnav,
	},
	mounted() {
	}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap');


.inner-view {
	margin-left: 60px;
	width: 98%;
}
</style>
