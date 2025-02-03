<template>
	<div class="pro-search">
		<button
			type="button"
			@click="showSearchInfo = true"
			class="info-button"
			aria-label="Search information"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="16" x2="12" y2="12"></line>
				<line x1="12" y1="8" x2="12.01" y2="8"></line>
			</svg>
		</button>
		<div v-if="!isLoading" class="search-container">
			<Transition name="fade">
				<div class="snippets-container">
					<button
						v-for="snippet in currentSnippets"
						:key="snippet.title"
						class="snippet-button"
						@click="applySnippet(snippet.text)"
						:disabled="searchQuery.length > 0"
						:title="snippet.text"
					>
						{{ snippet.title }}
					</button>
				</div>
			</Transition>

			<div class="search-input-wrapper">
				<textarea
					class="search-input"
					:placeholder="inputPlaceholder"
					v-model="searchQuery"
					@input="adjustTextareaHeight"
					ref="textarea"
					rows="1"
				></textarea>
				<div class="portfolio-button-wrapper">
					<button
						class="portfolio-button"
						@click="handlePortfolioAction"
						type="button"
						disabled
					>
						<svg
							v-if="!hasPortfolio"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="12" y1="5" x2="12" y2="19"></line>
							<line x1="5" y1="12" x2="19" y2="12"></line>
						</svg>
						<span class="tooltip">Backtest on portfolio, coming soon!</span>
					</button>
				</div>
				<Transition name="fade">
					<button
						v-show="searchQuery"
						class="search-button"
						@click="handleSearch"
						type="button"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="5" y1="12" x2="19" y2="12"></line>
							<polyline points="12 5 19 12 12 19"></polyline>
						</svg>
					</button>
				</Transition>
			</div>

			<div class="search-suggestions">
				<button
					class="search-suggestion"
					:class="{ active: addedFactors.includes(suggestion) }"
					v-for="suggestion in suggestions"
					:key="suggestion"
					@click="addFactor(suggestion)"
				>
					{{ suggestion }}
				</button>
			</div>

			<PortfolioView
				v-if="hasPortfolio"
				:stocks="portfolioStocks"
				@edit="handlePortfolioEdit"
				@delete="handlePortfolioDelete"
			/>
		</div>

		<div v-if="isLoading" class="loading-bar">
			<div class="loading-progress"></div>
		</div>
	</div>

	<PortfolioModal
		:show="showPortfolioModal"
		@close="showPortfolioModal = false"
		@save="handlePortfolioSave"
	/>

	<SearchInfoModal :show="showSearchInfo" @close="showSearchInfo = false" />
	
	<CustomAlert
		v-if="error"
		type="error"
		:message="error"
		position="bottom-right"
		:duration="5000"
	/>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import PortfolioModal from "./PortfolioModal.vue";
import PortfolioView from "./PortfolioView.vue";
import SearchInfoModal from "./SearchInfoModal.vue";
import CustomAlert from "./CustomAlert.vue";

const searchQuery = ref("");
const loading = ref(false);
const results = ref([]);
const addedFactors = ref([]);
const suggestions = ref([]);
const showPortfolioModal = ref(false);
const hasPortfolio = ref(false);
const isLoading = ref(false);
const portfolioStocks = ref([]);
const showSearchInfo = ref(false);
const textarea = ref(null);
const error = ref("");

const strategySnippets = [
	{
		title: "Simple Moving Average Crossover",
		text: "Buy when 5-minute moving average crosses above 20-minute moving average, using closing prices. Sell when 5-minute MA crosses below 20-minute MA. Calculate MAs on closing prices only. Exit all positions at end of day",
	},
	{
		title: "Volume Spike",
		text: "Buy when 14-period RSI drops below 30 using 5-minute intervals and closing prices. Sell when RSI crosses above 70. Stop loss at 1% below entry price. Exit all positions at end of day",
	},
	{
		title: "Triple EMA Strategy",
		text: "Buy when 8-period EMA crosses above 13-period EMA and both cross above 21-period EMA. Sell when 8-period EMA crosses below 13-period EMA. Use 15-minute chart. Stop loss at recent swing low.",
	},
	{
		title: "Support/Resistance Breakout",
		text: "Identify key support/resistance levels from 1-hour chart. Buy on breakout above resistance with volume confirmation. Target: Distance between support and resistance. Stop loss: 50% of that distance.",
	},
	{
		title: "Double bottom pattern strategy",
		text: "Buy when double bottom pattern forms (two lows within 0.1% of each other in 30-minute window). Sell when price moves 0.5% above the peak between the two lows. Stop loss at 0.2% below second low",
	},
	{
		title: "Stochastic RSI Crossover",
		text: "Buy when Stochastic RSI (%K, 3,3,14,14) crosses above %D while both below 20. Sell when they cross below 80. Use 30-minute chart. Stop loss: 2x Average True Range below entry.",
	},
	{
		title: "Opening Range Breakout",
		text: "Calculate first hour's high and low. Buy on break above high with volume confirmation. Sell at 2x initial range or if price falls back into range. Stop loss at range low. Only trade first 3 hours."
	}
];

const defaultSnippets = strategySnippets;
const portfolioSnippets = strategySnippets;

const currentSnippets = computed(() =>
	hasPortfolio.value ? portfolioSnippets : defaultSnippets
);

const inputPlaceholder = computed(() =>
	hasPortfolio.value
		? "Run backtest on this portfolio..."
		: "Search in stock universe and run a backtest..."
);

const handlePortfolioAction = () => {
	if (hasPortfolio.value) {
		// Discard portfolio
		hasPortfolio.value = false;
	} else {
		// Show portfolio modal
		showPortfolioModal.value = true;
	}
};

const applySnippet = (snippet) => {
	searchQuery.value = snippet;
	setTimeout(() => {
		adjustTextareaHeight();
	}, 0);
};

const addFactor = (factor) => {
	if (addedFactors.value.includes(factor)) {
		addedFactors.value = addedFactors.value.filter((f) => f !== factor);
	} else {
		addedFactors.value.push(factor);
	}
};

const handlePortfolioSave = (stocks) => {
	portfolioStocks.value = stocks;
	hasPortfolio.value = true;
	showPortfolioModal.value = false;
};

const handlePortfolioEdit = () => {
	showPortfolioModal.value = true;
};

const handlePortfolioDelete = () => {
	portfolioStocks.value = [];
	hasPortfolio.value = false;
};

const handleSearch = async () => {
	if (!searchQuery.value.trim()) return;

	isLoading.value = true;
	error.value = ""; // Clear any previous errors
	
	try {
		// Simulate API call - replace with actual API call
		await new Promise((resolve, reject) => {
			setTimeout(() => {
				// Simulate random failure for demo
				if (Math.random() > 0.5) {
					reject(new Error("Network error: Failed to fetch search results"));
				}
				resolve();
			}, 4000);
		});
		// Handle search result
	} catch (err) {
		error.value = err.message || "An unexpected error occurred";
	} finally {
		isLoading.value = false;
	}
};

onMounted(() => {
	// Adjust textarea height on initial render
	adjustTextareaHeight();
});

const adjustTextareaHeight = () => {
	const element = textarea.value;
	if (!element) return;
	
	// Reset height to auto to get the correct scrollHeight
	element.style.height = 'auto';
	// Set the height to match the content
	element.style.height = element.scrollHeight + 'px';
};
</script>

<style scoped>
.search-heading {
	font-size: 2.5rem;
	font-weight: 600;
	margin-bottom: 1.5rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	text-align: center;
}

/* Add this to the existing media query for mobile responsiveness */
@media (max-width: 768px) {
	.search-heading {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}
}

.pro-search {
	width: 100%;
	max-width: 600px;
	margin: 0 auto;
	border-radius: 1rem;
	box-sizing: border-box;
}

.search-container {
	position: relative;
	width: 600px;
	margin-top: min(20vh, -15vh);
	padding-top: 1rem;
	margin: auto 0;
}

.search-input-wrapper {
	position: relative;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.search-input {
	width: 100%;
	max-width: 100%;
	padding: 0.75rem 1.25rem;
	padding-left: 3rem;
	padding-right: 1rem;
	border: 1px solid #d1d5db;
	border-radius: 1rem;
	font-size: 1rem;
	transition: border-color 0.3s ease, box-shadow 0.3s ease;
	background: #ffffff;
	color: #111827;
	box-sizing: border-box;
	resize: none;
	min-height: 44px;
	max-height: 100px;
	overflow-y: auto;
	font-family: unset;
	height: auto;
	overflow-y: hidden; /* Hide scrollbar when expanding */
}

.search-input::placeholder {
	color: #9ca3af;
}

.search-input:focus {
	outline: none;
	border-color: #2563eb;
	box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.search-input-wrapper::before {
	content: "";
	position: absolute;
	left: 1rem;
	top: 50%;
	transform: translateY(-50%);
	width: 20px;
	height: 20px;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
	background-size: 100%;
	background-repeat: no-repeat;
	background-position: center;
	pointer-events: none;
}

.search-popover {
	position: absolute;
	top: calc(100% + 0.5rem);
	left: 0;
	right: 0;
	background: white;
	border-radius: 1rem;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	border: 1px solid #d1d5db;
	overflow: hidden;
	z-index: 50;
	animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.search-results {
	max-height: 400px;
	overflow-y: auto;
	scrollbar-width: thin;
	scrollbar-color: #e5e7eb #f9fafb;
}

.search-results::-webkit-scrollbar {
	width: 8px;
}

.search-results::-webkit-scrollbar-thumb {
	background-color: #e5e7eb;
	border-radius: 4px;
}

.loading-state,
.empty-state {
	padding: 2rem;
	text-align: center;
	color: #6b7280;
}

.loading-spinner {
	width: 2rem;
	height: 2rem;
	margin: 0 auto 1rem;
	border: 2px solid #e5e7eb;
	border-top-color: #2563eb;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.results-list {
	padding: 0.5rem 0;
}

.result-item {
	width: 100%;
	padding: 0.75rem 1rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.25rem;
	background: transparent;
	border: none;
	cursor: pointer;
	transition: background-color 0.2s ease, box-shadow 0.2s ease;
	text-align: left;
}

.result-item:hover {
	background: #f3f4f6;
	box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
}

.result-title {
	font-size: 1rem;
	font-weight: 600;
	color: #1f2937;
}

.result-description {
	font-size: 0.875rem;
	color: #4b5563;
}

.snippets-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-bottom: 1rem;
	justify-content: flex-start;
	min-height: 2.5rem;
}

.snippet-button {
	padding: 0.5rem 1rem;
	background: #fff;
	border: 1px solid #d1d5db;
	border-radius: 1.5rem;
	font-size: 0.875rem;
	color: #374151;
	cursor: pointer;
	transition: all 0.2s ease;
	text-align: left;
	white-space: nowrap;
	display: inline-block;
	max-width: fit-content;
	position: relative;
}

.snippet-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	pointer-events: none;
}

.snippet-button:hover {
	border-color: #2563eb;
	color: #2563eb;
}

.portfolio-button-wrapper {
	position: relative;
}

.portfolio-button {
	padding: 0.65rem;
	border: 1px solid #d1d5db;
	border-radius: 1rem;
	background: white;
	color: #6b7280;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.2rem;
}

.portfolio-button:hover {
	border-color: #d1d5db;
	color: #6b7280;
}

.portfolio-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.search-button {
	padding: 0.65rem;
	border: 1px solid #d1d5db;
	border-radius: 1rem;
	background: white;
	color: #6b7280;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
}

.search-button:hover {
	border-color: #2563eb;
	color: #2563eb;
	transform: translateX(2px);
}

.loading-bar {
	width: 300px;
	height: 4px;
	background: #f3f4f6;
	border-radius: 2px;
	overflow: hidden;
	margin: 1rem 0;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
}

.loading-progress {
	width: 30%;
	height: 100%;
	background: linear-gradient(45deg, #111111, #535bf2);
	border-radius: 2px;
	position: absolute;
	animation: loading 1.5s infinite ease-in-out;
}

@keyframes loading {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(400%);
	}
}

.search-suggestions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 1rem;
}

.search-suggestion {
	padding: 0.5rem 1rem;
	background: #fff;
	border: 1px solid #d1d5db;
	border-radius: 1.5rem;
	font-size: 0.875rem;
	color: #374151;
	cursor: pointer;
}

.search-suggestion:hover {
	border-color: #535bf2;
	color: #535bf2;
}

.search-suggestion.active {
	border-color: #535bf2;
	color: #535bf2;
}

@media (max-width: 768px) {
	.pro-search {
		width: 100%;
		margin: 0 auto;
	}

	.search-container {
		margin-top: 1rem;
		width: 100%;
	}

	.snippets-container {
		padding: 0 0.5rem;
	}

	.snippet-button {
		font-size: 0.75rem;
		padding: 0.35rem 0.7rem;
		max-width: calc(50% - 0.5rem);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.search-input-wrapper {
		padding: 0 0.5rem;
	}

	.search-input {
		font-size: 0.9rem;
		padding: 0.5rem 1rem;
		padding-left: 2.5rem;
		padding-right: 5rem;
		border-radius: 1rem;
	}

	.search-input-wrapper::before {
		width: 16px;
		height: 16px;
		left: 1.5rem;
	}

	.portfolio-button {
		font-size: 16px;
		padding: 0.4rem;
		border-radius: 0.6rem;
	}

	.search-popover {
		border-radius: 0.5rem;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		border: 1px solid #e5e7eb;
	}

	.search-results {
		max-height: 300px;
	}

	.result-item {
		padding: 0.5rem;
	}

	.result-title {
		font-size: 0.9rem;
	}

	.result-description {
		font-size: 0.75rem;
	}

	.loading-state,
	.empty-state {
		padding: 1.5rem;
	}

	.search-button {
		padding: 0.5rem;
	}

	.loading-bar {
		margin: 0.5rem 0;
	}
}

@media (max-width: 480px) {
	.pro-search {
		padding: 0.5rem;
	}

	.snippet-button {
		max-width: 100%;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* Add margin below PortfolioView */
.portfolio-view {
	margin-bottom: 2rem;
}

.search-header {
	position: absolute;
	right: 0;
	top: -2rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.info-button {
	position: absolute;
	right: 0;
	bottom: 0;
    margin: 1rem;
	padding: 0.5rem;
	background: transparent;
	border: none;
	color: #6b7280;
	cursor: pointer;
	transition: all 0.2s ease;
	border-radius: 50%;
}

.info-button:hover {
	color: #535bf2;
	background: rgba(83, 91, 242, 0.1);
}

.portfolio-button .tooltip {
    position: absolute;
    bottom: 135%;
    left: 50%;
    transform: translateX(-50%) translateY(5px);
    background-color: #535bf2;
    color: white;
    text-align: center;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    pointer-events: none;
}

.portfolio-button .tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #535bf2 transparent transparent transparent;
}

.portfolio-button:hover .tooltip {
    visibility: visible;
    opacity: 1;
}

@media (max-width: 600px) {
    .portfolio-button .tooltip {
        font-size: 12px;
        padding: 6px 10px;
    }
}
</style>
