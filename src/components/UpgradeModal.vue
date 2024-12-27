<template>
	<div v-if="show" class="modal-overlay" @click="handleClose">
		<div class="modal-content" @click.stop>
			<button class="close-button" @click="handleClose">&times;</button>

			<h2 class="modal-title">Upgrade your plan</h2>
			<p class="modal-subtitle">
				You've reached your free backtesting limit. Upgrade to continue
				testing your strategies.
			</p>

			<div class="plans-slider">
				<button
					class="nav-button prev"
					@click="prevSlide"
					:disabled="currentSlide === 0"
				>
					‹
				</button>
				<div
					class="plans-container"
					:style="{
						transform: `translateX(-${currentSlide * 100}%)`,
					}"
				>
					<div
						v-for="(plan, index) in plans"
						:key="plan.name"
						class="plan-card"
					>
						<h3>{{ plan.name }}</h3>
						<p class="plan-price">{{ plan.price }}</p>
						<p class="plan-description">{{ plan.description }}</p>
						<button
							class="upgrade-button"
							:class="{ primary: index === 1 }"
							@click="handleSubscribe(plan.id)"
							:disabled="isLoading"
						>
							{{ isLoading ? "Processing..." : plan.cta }}
						</button>
					</div>
				</div>
				<button
					class="nav-button next"
					@click="nextSlide"
					:disabled="currentSlide === plans.length - 1"
				>
					›
				</button>
			</div>

			<div class="slider-dots">
				<button
					v-for="(_, index) in plans"
					:key="index"
					class="dot"
					:class="{ active: currentSlide === index }"
					@click="currentSlide = index"
				></button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
	show: Boolean,
});

const emit = defineEmits(["close"]);

const handleClose = () => {
	currentSlide.value = 0;
	emit("close");
};

const router = useRouter();
const currentSlide = ref(0);
const isLoading = ref(false);

const plans = [
	{
		id: "free",
		name: "Free",
		price: "$0",
		description: "For beginners, hobbyists, and casual investors",
		cta: "Current Plan",
	},
	{
		id: "pro",
		name: "Pro",
		price: "$20",
		description: "For intermediate traders, analysts, and small teams",
		cta: "Upgrade to Pro",
	},
	{
		id: "plus",
		name: "Plus",
		price: "$40",
		description:
			"For professional traders, quantitative researchers, and small funds",
		cta: "Upgrade to Plus",
	},
];

const handleSubscribe = async (planId) => {
	if (planId === "free") return;

	isLoading.value = true;
	try {
		const response = await fetch(`/api/v1/subscribe/${planId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to initiate subscription");
		}

		const data = await response.json();
		// Redirect to payment page or handle subscription flow
		if (data.redirectUrl) {
			window.location.href = data.redirectUrl;
		}
	} catch (error) {
		console.error("Subscription error:", error);
		// Handle error (show notification, etc.)
	} finally {
		isLoading.value = false;
	}
};

const nextSlide = () => {
	if (currentSlide.value < plans.length - 1) {
		currentSlide.value++;
	}
};

const prevSlide = () => {
	if (currentSlide.value > 0) {
		currentSlide.value--;
	}
};
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(4px);
	display: grid;
	place-items: center;
	z-index: 1000;
	padding: 1rem;
}

.modal-content {
	background: white;
	padding: 2.5rem;
	border-radius: 1.5rem;
	max-width: 90%;
	width: 640px;
	position: relative;
	animation: modalEnter 0.3s ease-out;
}

@keyframes modalEnter {
	from {
		opacity: 0;
		transform: scale(0.95);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.close-button {
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	color: #666;
	padding: 0.5rem;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.close-button:hover {
	color: #111827;
	transform: scale(1.1);
}

.modal-title {
	font-size: 1.5rem;
	font-weight: 600;
	margin-bottom: 0.5rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.modal-subtitle {
	color: #666;
	margin-bottom: 2rem;
}

.plans-slider {
	position: relative;
	overflow: hidden;
	margin: 0;
	padding: 0 1rem;
}

.plans-container {
	display: flex;
	transition: transform 0.3s ease;
	width: 100%;
}

.plan-card {
	flex: 0 0 100%;
	padding: 1.5rem;
	text-align: center;
	box-sizing: border-box;
}

.plan-card h3 {
	font-size: 1.25rem;
	font-weight: 600;
	margin-bottom: 0.5rem;
}

.plan-price {
	font-size: 2rem;
	font-weight: 700;
	margin-bottom: 0.5rem;
	color: #111827;
}

.plan-description {
	color: #666;
	margin-bottom: 1.5rem;
}

.upgrade-button {
	width: 100%;
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 1px solid #535bf2;
	background: white;
	color: #535bf2;
}

.upgrade-button.primary {
	background: linear-gradient(45deg, #111111, #535bf2);
	color: white;
	border: none;
}

.upgrade-button:hover {
	transform: translateY(-1px);
}

.upgrade-button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.slider-dots {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	margin-top: 1.5rem;
}

.dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #e5e7eb;
	border: none;
	cursor: pointer;
	padding: 0;
}

.dot.active {
	background: #535bf2;
}

.nav-button {
	position: absolute;
	top: 40%;
	transform: translateY(-50%);
	background: white;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-size: 24px;
	color: #535bf2;
	z-index: 10;
	transition: all 0.3s ease;
	border: none;
}

.nav-button:hover {
	border: none;
	transform: translateY(-50%) scale(1.1);
}

.nav-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.nav-button.prev {
	left: 0;
}

.nav-button.next {
	right: 0;
}

@media (max-width: 640px) {
	.modal-content {
		padding: 1.5rem;
		margin: 1rem;
	}

	.plan-card {
		padding: 1rem;
	}

	.nav-button {
		width: 32px;
		height: 32px;
		font-size: 20px;
	}
}
</style>
