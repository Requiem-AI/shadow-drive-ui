<template>
	<router-link :to="href">
		<li class="nav-item">
<!--			<div class="d"><img v-if="src !== ''" :src="src" class="img-fluid wow fadeInLeft" data-wow-duration="0.2s" :alt="title"></div>-->
			<div class="d"><i :class="`fa fa-${src}`"></i></div>
			<div v-if="show_text" class="d"><h5 data-animation-delay="0.3s" data-wow-duration="0.2s" :data-wow-delay="animDuration" class="wow fadeInLeft">
				{{ title }}</h5></div>
		</li>
	</router-link>

</template>

<script>
	export default {
		name: "NavItem",
		props: {
			show_text: Boolean,
			idx: [Number, String],
			title: String,
			src: {
				type: String,
				default: function () {
					return ""
				}
			},
			href: String
		},
		computed: {
			animDuration: function () {
				return (0.3 * this.idx / 10) + "s"
			}
		}
	}
</script>

<style scoped>
	.nav-item {
		border-bottom: 2px solid #0a9fb9;
		/*padding: 15px 0px 0px 15px;*/
		-webkit-transition: all 0.3s ease-in-out;
		transition: all 0.3s ease-in-out;
		text-align: left;
		vertical-align: middle;
		cursor: pointer;
	}
	li {
		color: white;
		list-style: none;
	}
	
	.nav-item:hover {
		background: rgba(22, 99, 117, 1);
	}
	
	h5 {
		font-size: 0.8em;
		text-align: center;
		color: white;
		text-shadow: 2px 2px 8px rgb(4, 24, 28);
	}
	
	.nav-item:hover h5, h5:hover {
		color: whitesmoke;
		transform: scale(1.1);
	}
	
	i {
		vertical-align: middle;
		font-size: 1.8em;
		line-height: 50px;
		/*margin-left: 10px;*/
		/*margin-right: 10px;*/
	}
	.d {
		display: inline-block;
		vertical-align: middle;
		text-align: center;
		min-width: 60px;
	}
</style>