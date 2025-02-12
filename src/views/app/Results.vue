<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { marked } from "marked";

import ProfileDropdown from "../../components/ProfileDropdown.vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";

const route = useRoute();
const router = useRouter();
const resultContent = ref("");
const isLoading = ref(true);
const error = ref(null);
const belongsToUser = ref(false);
const formDetails = ref(null);
const shareableLink = ref("");
const isSharing = ref(false);

import { storeToRefs } from "pinia";
import { useAppStore } from "../../stores/app";
import { useAuthStore } from "../../stores/auth";

const appStore = useAppStore();
const authStore = useAuthStore();

const { getBacktestById, getBacktestReport, getShareLink } = appStore;
const { backtest } = storeToRefs(appStore);
const { user } = storeToRefs(authStore);

const fetchResults = async () => {
	try {
		isLoading.value = true; // Ensure loading state is reset

		const backtestId = route.params.id;
		const backtestData = await getBacktestById(backtestId);

		if (backtestData.user_id === user.value.id) {
			belongsToUser.value = true;
		}

		if (backtestData.report_url) {
			const response = await getBacktestReport(backtestId);

			if (!response) {
				throw new Error('Failed to fetch report content');
			}
			
			resultContent.value = marked(response);
		}

		formDetails.value = {
			asset: backtestData.instrument_symbol,
			dateRange: {
				start: backtestData.from_date,
				end: backtestData.to_date,
			},
			strategy: backtestData.strategy_description,
		};
		error.value = null;
	} catch (err) {
		if (err.response?.status === 404) {
			router.push("/404");
		} else {
			error.value = "Failed to load results. Please try again.";
		}
	}
	isLoading.value = false;
};

const editStrategy = () => {
	// Store form details in localStorage or state management
	localStorage.setItem("editFormData", JSON.stringify(formDetails.value));
	router.push("/app");
};

const shareResult = async () => {
	try {
		isSharing.value = true;
		const response = await getShareLink(route.params.id);
		if (!response) {
			throw new Error("Failed to generate share link");
		}
		shareableLink.value = response.share_url;
		await navigator.clipboard.writeText(response.share_text);
		alert("This backtest link is copied to clipboard and ready to share!");
	} catch (err) {
		// error.value = err.message;
		// handled in openreplay
	} finally {
		isSharing.value = false;
	}
};


// Handle route updates
onBeforeRouteUpdate((to, from, next) => {
  // Reset the state
  resultContent.value = "";
  isLoading.value = true;
  error.value = null;
  formDetails.value = null;
  shareableLink.value = "";
  belongsToUser.value = false;
  backtest.value = null;

  next();
  // Call fetchResults after the navigation is confirmed
  nextTick(() => fetchResults());
});
watch(() => route.params.id, fetchResults);

watch(
  () => backtest.value?.report_url,
  async (newReportUrl) => {
    if (newReportUrl) {
      try {
        const response = await getBacktestReport(backtest.value.id);
        if (!response) {
          throw new Error('Failed to fetch report content');
        }
        resultContent.value = marked(response);
      } catch (err) {
        error.value = "Failed to load report content. Please try again.";
      }
    }
  }
);

onMounted(fetchResults);
</script>

<template>
	<div class="results-container">
		<h1 class="logo">
			alphabench
			<span class="beta-label">preview</span>
		</h1>
		<div class="header">
			<ProfileDropdown />
		</div>
		<HamburgerMenu />
		<!-- Form Details Summary Card -->
		<div v-if="formDetails && !isLoading" class="summary-card">
			<div class="summary-header">
				<div class="title-share-wrapper">
					<h3>Strategy Details</h3>
				</div>
				<div class="button-wrapper" v-if="backtest.user_id === user.id">
					<!--<button 
						@click="editStrategy" 
						v-if="!belongsToUser"
						class="edit-button secondary"
					>
						Edit Strategy
					</button>-->
					<button 
						@click="shareResult" 
						class="share-button" 
						:disabled="isSharing || !backtest.report_url || [
							'script_generation_failed', 
							'validation_failed', 
							'execution_failed', 
							'report_generation_failed'
						].includes(backtest.status)"
					>
						{{ isSharing ? 'Loading...' : 'Share Results' }}
					</button>
				</div>
			</div>
			<!-- Show share link if available -->
			<div class="summary-content">
				<div class="summary-item">
					<span class="label">Asset:</span>
					<span class="value">{{ formDetails.asset }}</span>
				</div>
				<div class="summary-item">
					<span class="label">Date Range:</span>
					<span class="value"
						>{{ formDetails.dateRange.start }} to
						{{ formDetails.dateRange.end }}</span
					>
				</div>
				<div class="summary-item">
					<span class="label">Strategy:</span>
					<span class="value strategy-text">{{
						formDetails.strategy
					}}</span>
				</div>
			</div>
		</div>

		<!-- Loading timeline -->
		<div
			v-if="backtest && !backtest.generated_report"
			class="loading-timeline"
		>
			<div v-if="[
					'script_generation_failed', 
					'validation_failed', 
					'execution_failed', 
					'report_generation_failed'
				].includes(backtest.status)"
				class="failed-timeline">
				<div class="error-message">
					<span v-if="backtest.status === 'script_generation_failed'">
						Strategy script generation failed...<br />Our team has been notified
					</span>
					<span v-else-if="backtest.status === 'validation_failed'">
						Strategy validation failed...<br />Please check your strategy parameters
					</span>
					<span v-else-if="backtest.status === 'execution_failed'">
						Backtesting execution failed...<br />We're investigating the issue
					</span>
					<span v-else-if="backtest.status === 'report_generation_failed'">
						Report generation failed...<br />Please try again later
					</span>
				</div>
			</div>
			
			<div v-else class="timeline">
				<!-- Script Generation -->
				<div class="timeline-item"
					:class="{
						'active': [
							'script_generation_in_progress', 'ready_for_validation', 
							'validation_in_progress', 'validation_passed',
							'execution_in_progress', 'execution_successful',
							'report_generation_in_progress', 'report_generation_successful'
						].includes(backtest.status),
						'pulse-dot': backtest.status === 'script_generation_in_progress'
					}">
					<div class="timeline-dot"></div>
					<div class="timeline-content">
						<h4>Strategy Preparation</h4>
						<p>Thinking about the strategy and collecting data</p>
					</div>
				</div>

				<!-- Validation -->
				<div class="timeline-item"
					:class="{
						'active': [
							'validation_in_progress', 'validation_passed',
							'execution_in_progress', 'execution_successful',
							'report_generation_in_progress', 'report_generation_successful'
						].includes(backtest.status),
						'pulse-dot': backtest.status === 'validation_in_progress'
					}">
					<div class="timeline-dot"></div>
					<div class="timeline-content">
						<h4>Validation</h4>
						<p>Validating strategy parameters</p>
					</div>
				</div>

				<!-- Execution -->
				<div class="timeline-item"
					:class="{
						'active': [
							'execution_in_progress', 'execution_successful',
							'report_generation_in_progress', 'report_generation_successful'
						].includes(backtest.status),
						'pulse-dot': backtest.status === 'execution_in_progress'
					}">
					<div class="timeline-dot"></div>
					<div class="timeline-content">
						<h4>Backtesting</h4>
						<p>Running strategy against historical data</p>
					</div>
				</div>

				<!-- Report Generation -->
				<div class="timeline-item"
					:class="{
						'active': [
							'report_generation_in_progress', 'report_generation_successful'
						].includes(backtest.status),
						'pulse-dot': backtest.status === 'report_generation_in_progress'
					}">
					<div class="timeline-dot"></div>
					<div class="timeline-content">
						<h4>Report Generation</h4>
						<p>Creating detailed analysis report</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Results Card -->
		<div v-else class="results-card fade-in">
			<div v-if="isLoading" class="loading-state">Loading results...</div>
			<div v-else class="markdown-content" v-html="resultContent"></div>
		</div>
	</div>
</template>

<style scoped>
.logo {
	position: absolute;
	top: 1.5rem;
	left: 50%;
	transform: translateX(-50%);
	font-size: 1.5rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.beta-label {
	font-size: 0.8rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	padding: 0.2rem 0.5rem;
	border-radius: 4px;
	color: white;
	-webkit-text-fill-color: white;
	font-weight: 500;
	letter-spacing: 0.05em;
}

.header {
	position: absolute;
	top: 1rem;
	right: 2rem;
}

.results-container {
	width: 80%;
	margin: 0 auto;
	padding: 0 2rem;
	max-width: 1000px;
}

.results-card {
	background: white;
	border-radius: 0.5rem;
	padding: 2rem;
	overflow-x: auto;
}

.loading-state,
.error-state {
	text-align: center;
	padding: 2rem;
	color: #666;
}

.error-state {
	color: #dc2626;
}

/* Markdown Styling */
:deep(.markdown-content) {
	color: #374151;
	line-height: 1.6;
	text-align: left;
}

:deep(.markdown-content h1) {
	font-size: 2.25rem;
	font-weight: 700;
	margin: 2rem 0 1rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

:deep(.markdown-content h2) {
	font-size: 1.75rem;
	font-weight: 600;
	margin: 1.5rem 0 1rem;
	color: #111827;
}

:deep(.markdown-content h3) {
	font-size: 1.25rem;
	font-weight: 600;
	margin: 1.25rem 0 0.75rem;
	color: #1f2937;
}

:deep(.markdown-content p) {
	margin: 1rem 0;
}

:deep(.markdown-content ul) {
	list-style-type: disc;
	padding-left: 1.5rem;
	margin: 1rem 0;
}

:deep(.markdown-content table) {
	width: 100%;
	border-collapse: collapse;
	margin: 1rem 0;
}

:deep(.markdown-content th),
:deep(.markdown-content td) {
	border: 1px solid #e5e7eb;
	padding: 0.75rem;
	text-align: left;
}

:deep(.markdown-content th) {
	background: #f9fafb;
	font-weight: 600;
}

:deep(.markdown-content code) {
	padding: 0.2rem 0.4rem;
	border-radius: 0.25rem;
	font-size: 0.875em;
}

:deep(.markdown-content pre) {
	background: #1f2937;
	color: #f9fafb;
	padding: 1rem;
	border-radius: 0.5rem;
	overflow-x: auto;
	margin: 1rem 0;
}

:deep(.markdown-content blockquote) {
	border-left: 4px solid #e5e7eb;
	padding-left: 1rem;
	margin: 1rem 0;
	color: #6b7280;
}

.summary-card {
	background: white;
	border-radius: 0.5rem;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	padding: 1.5rem;
	margin-top: 4rem;
	margin-bottom: 2rem;
    width: 100%;
}

.summary-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.summary-header h3 {
	margin: 0;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	font-size: 1.25rem;
	font-weight: 600;
}

.edit-button {
	padding: 0.5rem 1rem;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: all 0.3s ease, background 0.3s ease;
	border: 1px solid #535bf2;
	background: white;
	color: #535bf2;
	font-size: 0.875rem;
}

.edit-button:hover {
	transform: translateY(-1px);
}

.summary-content {
	display: grid;
	gap: 1rem;
}

.summary-item {
	display: flex;
	gap: 0.5rem;
}

.summary-item .label {
	font-weight: 600;
	color: #4b5563;
	min-width: 100px;
	text-align: left;
}

.summary-item .value {
	color: #111827;
}

.summary-item .strategy-text {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: left;
}

.title-share-wrapper {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.button-wrapper {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.share-button {
	padding: 0.5rem 1rem;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: all 0.3s ease;
	background: linear-gradient(45deg, #111111, #535bf2);
	font-size: 0.875rem;
}

.share-button:hover {
	transform: translateY(-1px);
}

.share-button:disabled {
	background: #e5e7eb;
	color: #9ca3af;
	cursor: not-allowed;
	transform: none;
}

.share-link-container {
	margin-top: 1rem;
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.share-link-input {
	flex: 1;
	padding: 0.5rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.375rem;
	font-size: 0.875rem;
	background: #f9fafb;
}

.copy-button {
	padding: 0.5rem 1rem;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
	background: linear-gradient(45deg, #111111, #535bf2);
	font-size: 0.875rem;
	white-space: nowrap;
}

.loading-timeline {
	width: 100%;
	background: white;
	border-radius: 0.5rem;
	padding: 2rem 0;
	min-height: 400px;
}

.failed-timeline {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 400px;
	text-align: left;
}

.timeline {
	position: relative;
	max-width: 450px;
	margin: 0 auto;
	padding: 0;
}

.timeline::before {
	content: "";
	position: absolute;
	left: 17px;
	top: 0;
	bottom: 0;
	width: 2px;
	background: #e5e7eb;
}

.timeline-item {
	position: relative;
	margin-bottom: 2rem;
	padding-left: 45px;
	opacity: 0.5;
	transition: opacity 0.3s ease;
	display: flex;
	align-items: center;
	text-align: left;
}

.timeline-item.active {
	opacity: 1;
}

.timeline-dot {
	position: absolute;
	left: 11px;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #e5e7eb;
	border: 2px solid white;
}

.timeline-item.active .timeline-dot {
	background: #535bf2;
	box-shadow: 0 0 0 4px rgba(83, 91, 242, 0.2);
}

.timeline-content {
	background: #f9fafb;
	border-radius: 0.5rem;
	padding: 1rem;
	border: 1px solid #e5e7eb;
	width: 320px;
}

.timeline-content h4 {
	margin: 0 0 0.5rem 0;
	font-size: 1rem;
	font-weight: 600;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.timeline-content p {
	margin: 0;
	font-size: 0.875rem;
	color: #6b7280;
}

.error-message {
    text-align: center;
    color: #dc2626;
    font-weight: 500;
    line-height: 1.5;
}

.failed-timeline {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    padding: 2rem;
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(83, 91, 242, 0.4);
	}
	70% {
		box-shadow: 0 0 0 10px rgba(83, 91, 242, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(83, 91, 242, 0);
	}
}

.pulse-dot .timeline-dot {
	animation: pulse 1s infinite;
}

.fade-in {
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
	.results-container {
		padding: 1rem;
		padding-top: 2.5rem;
		width: 90%;
	}

	.results-card {
		padding: 1rem;
	}

	:deep(.markdown-content h1) {
		font-size: 1.875rem;
	}

	:deep(.markdown-content h2) {
		font-size: 1.5rem;
	}

	:deep(.markdown-content h3) {
		font-size: 1.25rem;
	}

	.summary-header {
		flex-direction: column;
		gap: 1rem;
		align-items: flex-start;
	}

	.button-wrapper {
		width: 100%;
	}

	.edit-button {
		width: 100%;
	}

	.share-button {
		width: 100%;
	}

	.summary-item {
		gap: 0.25rem;
	}

	.summary-item .label {
		min-width: auto;
	}

	.title-share-wrapper {
		width: 100%;
		justify-content: space-between;
	}

	.share-link-container {
		flex-direction: column;
	}

	.share-link-input,
	.copy-button {
		width: 100%;
	}

	.loading-timeline {
		padding: 1rem;
	}

	.timeline {
		padding: 1rem 0;
	}

	.logo {
		font-size: 1.2rem;
	}

	.beta-label {
		font-size: 0.7rem;
	}
}
@media (max-width: 480px) {
	.loading-timeline {
		width: 360px;
	}

	.logo {
		top: 1rem;
		font-size: 1rem;
		flex-direction: column;
		gap: 0.2rem;
	}

	.beta-label {
		font-size: 0.6rem;
		padding: 0.15rem 0.4rem;
	}
}
@media (max-width: 320px) {
	.loading-timeline {
		width: 320px;
	}

	.results-container {
		padding: 1rem;
		max-width: 100%;
	}

	.header {
		padding: 0.5rem;
	}

	.summary-card {
		width: 280px;
		padding: 1rem;
	}

	.summary-header {
		flex-direction: column;
		gap: 1rem;
	}

	.button-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.markdown-content {
		padding: 0.5rem;
	}

	:deep(.markdown-content pre) {
		max-width: 100%;
		overflow-x: scroll;
	}

	:deep(.markdown-content table) {
		display: block;
		overflow-x: auto;
		white-space: nowrap;
	}
}
</style>
