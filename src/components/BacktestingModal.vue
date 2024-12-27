<template>
	<div class="modal-overlay">
		<div class="modal-content">
			<h2 class="modal-title">
				{{ progress < 100 ? "Backtesting..." : "Backtesting Complete" }}
			</h2>

			<div class="progress-container">
				<div
					class="progress-bar"
					:style="{ width: `${progress}%` }"
				></div>
			</div>

			<button
				v-if="progress === 100 && uuid"
				@click="navigateToResults"
				class="view-results-button"
			>
				View Results
			</button>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
	progress: {
		type: Number,
		required: true,
	},
	uuid: {
		type: String,
		required: true,
	},
});

const router = useRouter();

const navigateToResults = () => {
	router.push(`/results/${props.uuid}`);
};
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-content {
	background-color: white;
	padding: 1.5rem;
	border-radius: 0.5rem;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	width: 24rem;
}

.modal-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 1rem;
}

.progress-container {
	width: 100%;
	height: 0.5rem;
	background-color: #e2e8f0;
	border-radius: 0.25rem;
	overflow: hidden;
	margin-bottom: 1rem;
}

.progress-bar {
	height: 100%;
	background-color: #2563eb;
	transition: width 0.3s ease;
}

.view-results-button {
	width: 100%;
	padding: 0.75rem;
	background-color: #2563eb;
	color: white;
	border: none;
	border-radius: 0.375rem;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
}

.view-results-button:hover {
	background-color: #1d4ed8;
}

.view-results-button:focus {
	outline: 2px solid #2563eb;
	outline-offset: 2px;
}
</style>
