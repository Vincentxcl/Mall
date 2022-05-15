<template>
	<div class="flicker">
		<slot>
			Hello World
		</slot>
	</div>
</template>

<script>
	export default {
		name: 'Flicker',
	}
</script>

<style scoped>
	.flicker {
		font-style: italic;
		font-size: 25px;
		text-shadow: 3px 3px 5px;
		text-align: center;
		animation-name: graduallyChange;
		animation-duration: 3s;
		animation-iteration-count: infinite;
		animation-direction: alternate;
	}

	@keyframes graduallyChange {
		from {
			color: #444;
		}

		to {
			color: #878787;
		}
	}
</style>
