<template>
	<div class="loading-container">
		<div class="loading-dots">
			<div class="dot"></div>
			<div class="dot"></div>
			<div class="dot"></div>
		</div>
		<div v-if="message" class="loading-message">{{ message }}</div>
	</div>
</template>

<script setup>
defineProps({
	message: {
		type: String,
		default: "Loading...",
	},
});
</script>

<style scoped>
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 200px;
}

.loading-dots {
	display: flex;
	gap: 8px;
}

.dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: linear-gradient(45deg, #111111, #535bf2);
	animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
	animation-delay: -0.32s;
}

.dot:nth-child(2) {
	animation-delay: -0.16s;
}

.loading-message {
	margin-top: 1rem;
	color: #64748b;
}

@keyframes bounce {
	0%,
	80%,
	100% {
		transform: scale(0);
	}
	40% {
		transform: scale(1);
	}
}
</style>
