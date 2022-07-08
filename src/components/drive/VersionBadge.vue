<template>
	<span :class="`badge ${hasOwner2 ? 'bg-secondary' : 'bg-info'}`">{{ hasOwner2 ? 'V1' : 'V2' }}</span>
</template>

<script>
export default {
	name: "VersionBadge",
	props: {
		folder: {
			type: Object,
			required: true,
		}
	},
	computed: {
		hasOwner2: function() {
			return this.folder.account.owner2
		}
	}
}
</script>

<style scoped>

</style>