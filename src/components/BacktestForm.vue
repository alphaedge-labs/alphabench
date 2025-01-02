<template>
	<Transition name="fade" mode="out-in">
		<LoadingDots
			v-if="isLoading"
			:message="`Processing your backtest (${progress}%)`"
		/>
		<div v-else class="card">
			<header class="card-header">
				<h2>What do you want to test today?</h2>
			</header>
			<div class="card-content">
				<div v-if="notification" :class="['alert', notification.type]">
					<p>{{ notification.message }}</p>
				</div>

				<form @submit.prevent="handleSubmit" class="form">
					<div class="form-group">
						<div class="label-with-info">
							<label for="asset"
								>What is the asset (or group of assets) you're
								targeting?</label
							>
							<button
								type="button"
								@click="showAssetInfo = true"
								class="info-button"
							>
								<i class="info-icon">i</i>
							</button>
						</div>
						<AssetSearch v-model="formData.asset" />
					</div>

					<div class="form-group">
						<label>What is the date range you're aiming for?</label>
						<DatePickerWithRange v-model="formData.dateRange" />
					</div>

					<div class="form-group">
						<div class="label-with-info">
							<label for="strategy"
								>Tell me your strategy in simplest words</label
							>
							<button
								type="button"
								@click="showStrategyInfo = true"
								class="info-button"
							>
								<i class="info-icon">i</i>
							</button>
						</div>
						<textarea
							id="strategy"
							v-model="formData.strategy"
							:class="[
								'magical-textarea',
								{ loading: isLoading },
							]"
							placeholder="Describe your strategy here..."
							maxlength="800"
						></textarea>
					</div>

					<button
						type="submit"
						:disabled="isLoading"
						class="submit-button"
					>
						{{ isLoading ? "Submitting..." : "Submit" }}
					</button>
				</form>
			</div>

			<StrategyInfoModal
				:show="showStrategyInfo"
				@close="showStrategyInfo = false"
			/>
			<AssetInfoModal
				:show="showAssetInfo"
				@close="showAssetInfo = false"
			/>
			<UpgradeModal
				:show="showUpgradeModal"
				@close="showUpgradeModal = false"
			/>

			<div v-if="isDevelopment" style="margin-top: 1rem">
				<button
					@click="
						mockScenario = 'success';
						handleSubmit();
					"
				>
					Test Success
				</button>
				<button
					@click="
						mockScenario = 'error';
						handleSubmit();
					"
				>
					Test Error
				</button>
				<button
					@click="
						mockScenario = 'upgrade';
						handleSubmit();
					"
				>
					Test Upgrade Modal
				</button>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import DatePickerWithRange from "./DatePickerWithRange.vue";
import AssetSearch from "./AssetSearch.vue";
import LoadingDots from "./LoadingDots.vue";

// Info modals
import StrategyInfoModal from "./StrategyInfoModal.vue";
import AssetInfoModal from "./AssetInfoModal.vue";
import UpgradeModal from "./UpgradeModal.vue";

const router = useRouter();
const isLoading = ref(false);
const progress = ref(0);
const uuid = ref("");
const notification = ref(null);
const showAssetInfo = ref(false);
const showStrategyInfo = ref(false);
const showUpgradeModal = ref(false);

const formData = reactive({
	dateRange: {
		start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
		end: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
	},
	asset: null,
	strategy: "",
});

const mockScenario = ref("success"); // 'success', 'error', 'upgrade'

const isDevelopment = computed(() => import.meta.env.DEV);

const handleSubmit = async () => {
	isLoading.value = true;
	notification.value = null;

	try {
		const result = await createBacktest({
			asset: formData.asset,
			dateRange: {
				start: formData.dateRange.start.toISOString().split("T")[0],
				end: formData.dateRange.end.toISOString().split("T")[0],
			},
			strategy: formData.strategy,
		});

		// Redirect to results page with the backtest ID
		router.push(`/results/${result.id}`);
	} catch (error) {
		if (error.response?.status === 429) {
			notification.value = {
				type: "error",
				message:
					"Daily backtest limit reached. Please upgrade your plan for more tests.",
			};
		} else {
			notification.value = {
				type: "error",
				message: "Failed to create backtest. Please try again.",
			};
		}
	} finally {
		isLoading.value = false;
	}
};

// Optional: Add this function to test the upgrade modal
const testUpgradeModal = async () => {
	isLoading.value = true;
	await new Promise((resolve) => setTimeout(resolve, 1000));
	showUpgradeModal.value = true;
	isLoading.value = false;
};

onMounted(() => {
	// Check for stored form data
	const storedFormData = localStorage.getItem("editFormData");
	if (storedFormData) {
		const data = JSON.parse(storedFormData);
		formData.dateRange = data.dateRange;
		formData.asset = data.asset;
		formData.strategy = data.strategy;

		// Clear stored data after using it
		localStorage.removeItem("editFormData");
	}
});
</script>

<style scoped>
.card {
	width: 100%;
	max-width: 48rem;
	border-radius: 0.5rem;
	margin: 0 auto;
	padding: 0 1rem;
}

.card-content {
	padding: 1.5rem;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-group label {
	text-align: left;
}

.radio-group {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
}

.radio-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.label-with-info {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.info-button {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
}

.info-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	background: #e2e8f0;
	color: #64748b;
	font-style: normal;
	font-size: 0.75rem;
}

.magical-textarea {
	min-height: 100px;
	padding: 0.75rem;
	border-radius: 0.375rem;
	border: 1px solid transparent;
	background: linear-gradient(white, white) padding-box,
		linear-gradient(90deg, #111111, #0575e6, #535bf2) border-box;
	background-size: 300% 100%;
	transition: background-position 3s linear;
}

.magical-textarea:focus {
	outline: none;
	animation: border-flow 3s linear infinite;
}

@keyframes border-flow {
	0% {
		background-position: 0% 50%;
	}
	100% {
		background-position: 300% 50%;
	}
}

.submit-button {
	width: 100%;
	padding: 0.75rem;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: all 0.3s ease, background 0.3s ease;
	background: linear-gradient(45deg, #111111, #535bf2);
}

.submit-button:hover {
	transform: translateY(-1px);
}

.submit-button:disabled {
	background: #94a3b8;
	cursor: not-allowed;
}

.alert {
	padding: 0.1rem 0.5rem;
	border-radius: 0.375rem;
	margin: 0 1rem 1rem 0;
	position: absolute;
	bottom: 0;
	right: 0;
}

.alert.error {
	background: #fee2e2;
	border: 1px solid #ef4444;
	color: #991b1b;
}

.alert.success {
	background: #dcfce7;
	border: 1px solid #22c55e;
	color: #166534;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

@media (max-width: 768px) {
	.card-content {
		padding: 1rem;
	}

	.form {
		gap: 1rem;
	}

	.radio-group {
		gap: 0.75rem;
	}

	.magical-textarea {
		min-height: 80px;
	}

	.alert {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		margin: 0;
		border-radius: 0.375rem 0.375rem 0 0;
		padding: 0.75rem;
		text-align: center;
	}
}

@media (max-width: 480px) {
	.card-header h2 {
		font-size: 1.25rem;
	}

	.form-group label {
		font-size: 0.9rem;
	}

	.radio-item {
		font-size: 0.9rem;
	}
}

.radio-item label.disabled {
	color: #9ca3af;
	cursor: not-allowed;
}

.radio-item input[disabled] + label {
	cursor: not-allowed;
}
</style>
