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
					aria-label="Previous plan"
				>
					<img :src="arrowLeft" alt="Previous plan" />
				</button>
				
				<div class="plans-container" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
					<div v-for="(plan, index) in plans" :key="plan.id" class="plan-card">
						<h3 class="plan-name">{{ plan.name }}</h3>
						<p class="plan-price">
							<span class="amount">${{ plan.price_usd }}</span>
							<span class="period">/month</span>
						</p>
						<p class="plan-description">{{ plan.description }}</p>
						<p class="plan-feature">
							<span class="feature-highlight">{{ plan.reports_per_day }}</span> 
							backtests per day
						</p>
						<button 
							class="subscribe-button"
							:class="{ primary: plan.name === 'Pro' }"
							@click="handleSubscribe(plan.id)"
							:disabled="isLoading || (user.subscription_plan_id === plan.id) || (!user.subscription_plan_id && plan.name === 'Free')"
						>
							{{ isLoading ? 'Processing...' : 
								(user.subscription_plan_id === plan.id) || (!user.subscription_plan_id && plan.name === 'Free') 
								? 'Active Plan' 
								: `Choose ${plan.name}` 
							}}
						</button>
						<p v-if="error" class="error-message">{{ error }}</p>
					</div>
				</div>
				
				<button 
					class="nav-button next" 
					@click="nextSlide" 
					:disabled="currentSlide === plans.length - 1"
					aria-label="Next plan"
				>
					<img :src="arrowRight" alt="Next plan" />
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { 
	getPlans, 
	createSubscription, 
	createRazorpaySubscription, 
	verifyRazorpayPayment
} from "../http/app";
import { initializeRazorpayCheckout } from "../services/razorpay";

import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

import arrowRight from "../assets/arrow-right.svg";
import arrowLeft from "../assets/arrow-left.svg";
const props = defineProps({
	show: Boolean,
});

const emit = defineEmits(["close"]);
const plans = ref([]);
const isLoading = ref(false);
const error = ref(null);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

onMounted(async () => {
	try {
		const plansData = await getPlans();
		plans.value = plansData;
	} catch (err) {
		error.value = "Failed to load subscription plans";
	}
});

const handleClose = () => {
	currentSlide.value = 0;
	emit("close");
};

const router = useRouter();
const currentSlide = ref(0);

const handleSubscribe = async (planId) => {
	isLoading.value = true;
	error.value = null;

	try {
		// Create subscription on backend
		const { subscription_id, key_id } = await createRazorpaySubscription(planId);

		// Initialize Razorpay checkout
		await initializeRazorpayCheckout({
			keyId: key_id,
			subscriptionId: subscription_id,
			planName: plans.value.find(p => p.id === planId)?.name || 'Pro',
			onSuccess: async (response) => {
				try {
					// Verify payment on backend
					await verifyRazorpayPayment({
						razorpay_payment_id: response.razorpay_payment_id,
						razorpay_subscription_id: response.razorpay_subscription_id,
						razorpay_signature: response.razorpay_signature
					});

					// Close modal and refresh user data
					emit("close");
					await authStore.fetchUser();
				} catch (err) {
					error.value = "Payment verification failed";
					console.error('Payment verification failed:', err);
				}
			},
			onError: (err) => {
				error.value = "Payment failed. Please try again.";
				console.error('Payment failed:', err);
			}
		});

	} catch (err) {
		error.value = "Failed to initialize payment";
		console.error('Failed to initialize payment:', err);
	} finally {
		isLoading.value = false;
	}
};

const nextSlide = () => {
	if (currentSlide.value < plans.value.length - 1) {
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
	padding: 2rem;
	border-radius: 1.5rem;
	max-width: 90%;
	width: 600px;
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
	margin: 2rem 0;
	width: 100%;
}

.plans-container {
	display: flex;
	transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	width: 100%;
}

.plan-card {
	flex: 0 0 100%;
	width: 100%;
	padding: 0.5rem 3rem;
	border-radius: 1rem;
	text-align: center;
	background: white;
	box-sizing: border-box;
}

.plan-name {
	font-size: 1.5rem;
	font-weight: 600;
	margin-bottom: 1rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.plan-price {
	margin-bottom: 1.5rem;
}

.plan-price .amount {
	font-size: 2.25rem;
	font-weight: 700;
	color: #111827;
}

.plan-price .period {
	font-size: 0.875rem;
	color: #6b7280;
}

.plan-description {
	color: #6b7280;
	margin-bottom: 1.5rem;
	font-size: 0.875rem;
	line-height: 1.5;
	text-align: left;
}

.plan-feature {
	margin-bottom: 2rem;
	color: #6b7280;
}

.feature-highlight {
	font-weight: 600;
	color: #535bf2;
}

.subscribe-button {
	width: 100%;
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
	border: 1px solid #535bf2;
	background: white;
	color: #535bf2;
}

.subscribe-button.primary {
	background: linear-gradient(45deg, #111111, #535bf2);
	color: white;
	border: none;
}

.subscribe-button:hover {
	transform: translateY(-1px);
}

.subscribe-button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
	transform: none;
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
	top: 50%;
	transform: translateY(-50%);
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: white;
	border: 1px solid #e5e7eb;
	color: #535bf2;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	z-index: 999;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-button:hover:not(:disabled) {
	background: #f9fafb;
	color: #111827;
	transform: translateY(-50%) scale(1.05);
}

.nav-button:disabled {
	opacity: 0;
	cursor: default;
}

.nav-button.prev {
	left: 0;
}

.nav-button.next {
	right: 0;
}

@media (max-width: 640px) {
	.nav-button {
		display: none;
	}
}

@media (max-width: 640px) {
	.modal-content {
		padding: 1.5rem;
		max-width: 500px;
	}

	.modal-title {
		font-size: 1.25rem;
	}

	.modal-subtitle {
		font-size: 0.875rem;
	}

	.plan-card {
		padding: 1.5rem;
	}

	.plan-name {
		font-size: 1.25rem;
	}

	.plan-price .amount {
		font-size: 1.875rem;
	}

	.plan-description {
		font-size: 0.813rem;
	}

	.subscribe-button {
		padding: 0.625rem 1.25rem;
		font-size: 0.875rem;
	}

	.close-button {
		top: 0.5rem;
		right: 0.5rem;
		width: 32px;
		height: 32px;
	}
}

@media (max-width: 720px) {
	.modal-content {
		padding: 1rem;
		max-width: 500px;
	}
}

@media (max-width: 560px) {
	.modal-content {
		padding: 1rem;
		max-width: 300px;
	}

	.plan-card {
		padding: 0.5rem;
	}
}

.error-message {
	color: #ef4444;
	font-size: 0.875rem;
	margin-top: 0.5rem;
	text-align: center;
}
</style>
