<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
	router.back();
};

const goHome = () => {
	router.push("/app");
};
</script>

<template>
	<div class="not-found-container">
		<div class="not-found-content">
			<h1 class="gradient-text">404</h1>
			<h2>Page Not Found</h2>
			<p>
				Oops! The page or backtesting report you're looking for doesn't
				exist or has been moved.
			</p>
			<div class="button-group">
				<button @click="goBack" class="secondary-button">
					Go Back
				</button>
				<button @click="goHome" class="primary-button">Go Home</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.not-found-container {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
}

.not-found-content {
	text-align: center;
	background: white;
	padding: 3rem;
	border-radius: 1rem;
	max-width: 500px;
	width: 90%;
}

.gradient-text {
	font-size: 6rem;
	font-weight: 700;
	margin: 0;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

h2 {
	font-size: 2rem;
	color: #1f2937;
	margin: 1rem 0;
}

p {
	color: #6b7280;
	margin-bottom: 2rem;
	font-size: 1.1rem;
	line-height: 1.6;
}

.button-group {
	display: flex;
	gap: 1rem;
	justify-content: center;
}

.primary-button,
.secondary-button {
	padding: 0.75rem 1.5rem;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: all 0.3s ease;
	font-size: 1rem;
	font-weight: 500;
}

.primary-button {
	background: linear-gradient(45deg, #111111, #535bf2);
	color: white;
}

.secondary-button {
	background: white;
	color: #535bf2;
	border: 1px solid #535bf2;
}

.primary-button:hover,
.secondary-button:hover {
	transform: translateY(-2px);
}

@media (max-width: 768px) {
	.not-found-content {
		padding: 2rem;
	}

	.gradient-text {
		font-size: 4rem;
	}

	h2 {
		font-size: 1.5rem;
	}

	.button-group {
		flex-direction: column;
	}

	.primary-button,
	.secondary-button {
		width: 100%;
	}
}
</style>
