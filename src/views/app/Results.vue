<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";

import ProfileDropdown from "../../components/ProfileDropdown.vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";

const route = useRoute();
const router = useRouter();
const resultContent = ref("");
const isLoading = ref(true);
const error = ref(null);
const formDetails = ref(null);
const shareableLink = ref("");
const showShareLink = ref(false);

const fetchResult = async (id) => {
	try {
		// Use mock data in development
		const response = await fetch(
			import.meta.env.DEV
				? `/mock/results/${id}.txt`
				: `/api/v1/results/${id}`
		);

		if (!response.ok) {
			if (response.status === 404) {
				router.push("/404");
				return;
			}
			throw new Error("Failed to fetch results");
		}

		// For text files, use text() instead of json()
		const content = await response.text();
		resultContent.value = marked(content);

		// Mock form details - replace with actual API call in production
		formDetails.value = {
			dateRange: {
				start: "2024-01-01",
				end: "2024-03-20",
			},
			asset: "NIFTY 50",
			strategy:
				"Mean reversion strategy focusing on identifying and trading when price deviates significantly from historical mean",
		};
	} catch (err) {
		error.value = err.message;
	} finally {
		isLoading.value = false;
	}
};

const editStrategy = () => {
	// Store form details in localStorage or state management
	localStorage.setItem("editFormData", JSON.stringify(formDetails.value));
	router.push("/app");
};

const shareResult = async () => {
	try {
		const response = await fetch(
			`/api/v1/results/${route.params.id}/share`
		);
		if (!response.ok) {
			throw new Error("Failed to generate share link");
		}
		const data = await response.json();
		shareableLink.value = data.shareUrl;
		showShareLink.value = true;
	} catch (err) {
		error.value = err.message;
	}
};

onMounted(() => {
	fetchResult(route.params.id);
});
</script>

<template>
	<div class="results-container">
		<div class="header">
			<ProfileDropdown />
		</div>
		<HamburgerMenu />
		<!-- Form Details Summary Card -->
		<div v-if="formDetails && !isLoading && !error" class="summary-card">
			<div class="summary-header">
				<div class="title-share-wrapper">
					<h3>Strategy Details</h3>
				</div>
				<div class="button-wrapper">
					<button @click="editStrategy" class="edit-button secondary">
						Edit Strategy
					</button>
					<button @click="shareResult" class="share-button">
						Share Results
					</button>
				</div>
			</div>
			<!-- Show share link if available -->
			<div v-if="showShareLink" class="share-link-container">
				<input
					type="text"
					:value="shareableLink"
					readonly
					class="share-link-input"
				/>
				<button
					@click="navigator.clipboard.writeText(shareableLink)"
					class="copy-button"
				>
					Copy
				</button>
			</div>
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

		<!-- Results Card -->
		<div class="results-card">
			<div v-if="isLoading" class="loading-state">Loading results...</div>

			<div v-else-if="error" class="error-state">
				{{ error }}
			</div>

			<div v-else class="markdown-content" v-html="resultContent"></div>
		</div>
	</div>
</template>

<style scoped>
.header {
	position: absolute;
	top: 1rem;
	right: 2rem;
}

.results-container {
	width: 80%;
	margin: 0 auto;
	padding: 2rem;
	max-width: 1000px;
}

.results-card {
	width: 100%;
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
	width: 100%;
	background: white;
	border-radius: 0.5rem;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	padding: 1.5rem;
	margin-top: 2rem;
	margin-bottom: 2rem;
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
}
</style>
