<template>
	<div class="locker">
		<i class="fa fa-lock" v-if="folder.account.immutable"></i>
		<i class="fa fa-lock-open" v-if="!folder.account.immutable"></i>
	</div>
</template>

<script>
export default {
	name: "DriveLock",
	props: {
		folder: {
			type: Object,
			required: true
		}
	}
}
</script>

<style scoped>

</style>