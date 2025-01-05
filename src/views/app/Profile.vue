<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

import ProfileDropdown from "../../components/ProfileDropdown.vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";

import { getActiveSubscription, getBacktests } from "../../http/app";
import { useAuthStore } from "../../stores/auth";

const feedback = ref("");
const feedbackStatus = ref("");

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const subscription = ref(null);
const backtests = ref([]);
const isLoading = ref(true);

onMounted(async () => {
	try {
		const [subData, backtestData] = await Promise.all([
			getActiveSubscription(),
			getBacktests(),
		]);

		subscription.value = subData;
		backtests.value = backtestData;
	} catch (error) {
		console.error("Failed to load profile data:", error);
	} finally {
		isLoading.value = false;
	}
});
</script>

<template>
	<div class="profile-page">
		<div class="header">
			<ProfileDropdown />
		</div>
		<HamburgerMenu />

		<div class="profile-container">
			<div class="profile-header">
				<h1>Your Profile</h1>
			</div>

			<div class="profile-content">
				<div class="profile-section">
					<div class="info-grid">
						<div class="info-item">
							<span class="label">Name</span>
							<span class="value">{{ user.name }}</span>
						</div>
						<div class="info-item">
							<span class="label">Email</span>
							<span class="value">{{ user.email }}</span>
						</div>
						<div class="info-item">
							<span class="label">Member Since</span>
							<span class="value">{{ user.joinDate }}</span>
						</div>
						<div class="info-item">
							<span class="label">Total Backtests</span>
							<span class="value">{{ user.backtestsRun }}</span>
						</div>
						<div class="info-item no-bg">
							<span class="label">Current Plan</span>
							<span class="value plan-badge">{{
								user.plan
							}}</span>
						</div>
					</div>
					<!--<div
						v-if="user.plan !== 'Free Plan'"
						class="subscription-section"
					>
						<button
							@click="handleUnsubscribe"
							class="unsubscribe-button"
						>
							Unsubscribe from {{ user.plan }}
						</button>
					</div>-->
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.profile-page {
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
}

.header {
	position: absolute;
	top: 1rem;
	right: 2rem;
}

.profile-container {
	background: white;
	border-radius: 1rem;
	padding: 2.5rem;
	margin-top: 3rem;
}

.profile-header h1 {
	font-size: 2rem;
	font-weight: 700;
	background: linear-gradient(45deg, #111111, #3b82f6);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	margin-bottom: 2rem;
	text-align: center;
}

.profile-section {
	margin-bottom: 3rem;
}

.info-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.5rem;
}

.info-item {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1rem;
	background: #f9fafb;
	border-radius: 0.5rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.01);
}
.info-item.no-bg {
	background: transparent;
}

.label {
	font-size: 0.875rem;
	color: #6b7280;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-weight: 600;
}

.value {
	font-size: 1.125rem;
	color: #111827;
	font-weight: 500;
}

.plan-badge {
	background: linear-gradient(45deg, #111111, #535bf2);
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 1rem;
	display: inline-block;
	font-size: 0.875rem;
	font-weight: bold;
	text-align: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subscription-section {
	margin-top: 2rem;
	display: flex;
	justify-content: center;
}

.unsubscribe-button {
	padding: 0.75rem 1.5rem;
	color: #ef4444;
	background: white;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: bold;
	border: none;
}

.unsubscribe-button:hover {
	background: #ef4444;
	color: white;
	transform: translateY(-2px);
}

.feedback-section {
	background: #e5e7eb;
	padding: 2rem;
	border-radius: 0.5rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	margin-top: 2rem;
}

.feedback-description {
	color: #4b5563;
	margin-bottom: 1rem;
	font-size: 1rem;
	line-height: 1.5;
}

.feedback-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

textarea {
	padding: 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	resize: vertical;
	font-family: inherit;
	font-size: 1rem;
	background: white;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

textarea:focus {
	outline: none;
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.submit-button {
	padding: 0.75rem 1.5rem;
	background: linear-gradient(45deg, #2563eb, #3b82f6);
	color: white;
	border: none;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: bold;
	text-transform: uppercase;
	align-self: flex-start;
	width: auto;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.feedback-status {
	font-size: 0.875rem;
	margin-top: 0.5rem;
	text-align: center;
}

.feedback-status.success {
	color: #10b981;
}

.feedback-status.error {
	color: #ef4444;
}

@media (max-width: 768px) {
	.profile-page {
		padding: 1.5rem;
		padding-top: 5rem;
	}

	.profile-container {
		padding: 2rem;
	}

	.info-grid {
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.unsubscribe-button {
		width: 100%;
	}

	.submit-button {
		width: 100%;
	}
}
</style>
