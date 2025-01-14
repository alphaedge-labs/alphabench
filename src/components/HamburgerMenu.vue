<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAppStore } from "../stores/app";

const isDrawerOpen = ref(false);
const router = useRouter();

const toggleDrawer = () => {
	isDrawerOpen.value = !isDrawerOpen.value;
};

const closeDrawer = () => {
	isDrawerOpen.value = false;
};

const navigateToResult = (id) => {
	router.push(`/results/${id}`);
	closeDrawer();
};

const handleClickOutside = (event) => {
	const drawer = event.target.closest(".drawer");
	const hamburgerButton = event.target.closest(".hamburger-button");

	if (!drawer && !hamburgerButton && isDrawerOpen.value) {
		closeDrawer();
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});

const appStore = useAppStore();
const { searchPastBacktests } = appStore;
const { backtestHistory } = storeToRefs(appStore);

const searchQuery = ref("");
const searchResults = ref(null);
const isSearching = ref(false);

const hasBacktestHistory = computed(() => {
	if (searchResults.value) {
		return (
			searchResults.value.thisWeek.length > 0 ||
			searchResults.value.lastMonth.length > 0 ||
			searchResults.value.older.length > 0
		);
	}

	return (
		backtestHistory.value.thisWeek.length > 0 ||
		backtestHistory.value.lastMonth.length > 0 ||
		backtestHistory.value.older.length > 0
	);
});


const debounce = (fn, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};

const performSearch = async (query) => {
	if (!query.trim()) {
		searchResults.value = null;
		return;
	}
	
	try {
		isSearching.value = true;
		const results = await searchPastBacktests(query);
		searchResults.value = results;
	} catch (error) {
		console.error('Search failed:', error);
	} finally {
		isSearching.value = false;
	}
};

const debouncedSearch = debounce(performSearch, 300);

watch(searchQuery, (newQuery) => {
	debouncedSearch(newQuery);
});
</script>

<template>
	<div class="hamburger-container">
		<button
			class="hamburger-button"
			@click="toggleDrawer"
			:class="{ 'is-open': isDrawerOpen }"
		>
			<div class="hamburger-icon">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</button>

		<div
			class="drawer-backdrop"
			v-if="isDrawerOpen"
			@click="closeDrawer"
		></div>

		<div class="drawer" :class="{ 'drawer-open': isDrawerOpen }">
			<div class="drawer-content">
				<div class="drawer-header">
					<h3>Past backtests</h3>
					<button class="close-button" @click="closeDrawer">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>

				<div class="search-container" :class="{ 'is-searching': isSearching }">
					<div class="search-input-wrapper">
						<input
							type="text"
							v-model="searchQuery"
							placeholder="Search backtests..."
							class="search-input"
							aria-label="Search backtests"
						/>
					</div>
				</div>

				<div v-if="searchResults && hasBacktestHistory" class="history-sections">
					<div v-if="searchResults.thisWeek.length > 0" class="history-section">
						<h4>This Week</h4>
						<div
							v-for="item in searchResults.thisWeek"
							:key="item.id"
							class="history-item"
							@click="navigateToResult(item.id)"
						>
							<span class="item-name">{{ item.name }}</span>
							<span class="item-date">{{ item.date }}</span>
						</div>
					</div>

					<div v-if="searchResults.lastMonth.length > 0" class="history-section">
						<h4>Last Month</h4>
						<div
							v-for="item in searchResults.lastMonth"
							:key="item.id"
							class="history-item"
							@click="navigateToResult(item.id)"
						>
							<span class="item-name">{{ item.name }}</span>
							<span class="item-date">{{ item.date }}</span>
						</div>
					</div>

					<div v-if="searchResults.older.length > 0" class="history-section">
						<h4>Long Time Ago</h4>
						<div
							v-for="item in searchResults.older"
							:key="item.id"
							class="history-item"
							@click="navigateToResult(item.id)"
							>
							<span class="item-name">{{ item.name }}</span>
							<span class="item-date">{{ item.date }}</span>
						</div>
					</div>
				</div>

				<div v-else-if="hasBacktestHistory" class="history-sections">
					<div class="history-section" v-if="backtestHistory.thisWeek.length > 0">
						<h4>This Week</h4>
						<div
							v-for="item in backtestHistory.thisWeek"
							:key="item.id"
							class="history-item"
							@click="navigateToResult(item.id)"
						>
							<span class="item-name">{{ item.name }}</span>
							<span class="item-date">{{ item.date }}</span>
						</div>
					</div>

					<div class="history-section" v-if="backtestHistory.lastMonth.length > 0">
						<h4>Last Month</h4>
						<div
							v-for="item in backtestHistory.lastMonth"
							:key="item.id"
							class="history-item"
							@click="navigateToResult(item.id)"
						>
							<span class="item-name">{{ item.name }}</span>
							<span class="item-date">{{ item.date }}</span>
						</div>
					</div>

					<div class="history-section" v-if="backtestHistory.older.length > 0">
						<h4>Long Time Ago</h4>
						<div
							v-for="item in backtestHistory.older"
							:key="item.id"
							class="history-item"
							@click="navigateToResult(item.id)"
						>
							<span class="item-name">{{ item.name }}</span>
							<span class="item-date">{{ item.date }}</span>
						</div>
					</div>
				</div>

				<div v-else class="empty-state">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="empty-icon"
					>
						<path d="M21 8v13H3V8" />
						<path d="M1 3h22v5H1z" />
						<path d="M10 12h4" />
					</svg>
					<p>{{ searchQuery ? 'No results found' : 'No backtest history yet' }}</p>
					<p class="empty-subtitle">
						{{ searchQuery ? 'Try a different search term' : 'Run your first backtest to see it here' }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.hamburger-container {
	position: fixed;
	left: 2rem;
	top: 1rem;
	z-index: 1000;
}

.hamburger-button {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.75rem;
	border-radius: 8px;
	transition: background-color 0.2s ease;
}

.hamburger-button:hover {
	background-color: rgba(0, 0, 0, 0.05);
}

.hamburger-icon {
	display: flex;
	flex-direction: column;
	gap: 4px;
	width: 18px;
}

.hamburger-icon span {
	display: block;
	height: 2px;
	width: 100%;
	background-color: #333;
	border-radius: 4px;
	transition: transform 0.3s ease, opacity 0.3s ease;
}

.hamburger-button.is-open .hamburger-icon span:nth-child(1) {
	transform: translateY(8px) rotate(45deg);
}

.hamburger-button.is-open .hamburger-icon span:nth-child(2) {
	opacity: 0;
}

.hamburger-button.is-open .hamburger-icon span:nth-child(3) {
	transform: translateY(-8px) rotate(-45deg);
}

.drawer-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(2px);
	z-index: 998;
}

.drawer {
	position: fixed;
	left: -350px;
	top: 0;
	height: 100vh;
	width: 350px;
	background-color: white;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 999;
 	will-change: transform;
}

.drawer-open {
	transform: translateX(350px);
}

.drawer-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem;
	border-bottom: 1px solid #f0f0f0;
}

.drawer-header h3 {
	margin: 0;
	font-size: 1.25rem;
	font-weight: 600;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.close-button {
	background: none;
	border: none;
	color: #666;
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.close-button:hover {
	background-color: rgba(0, 0, 0, 0.05);
	color: #333;
}

.drawer-content {
	height: 100%;
	overflow-y: auto;
	scrollbar-width: thin;
    scrollbar-color: #c0c0c0 #f1f1f1;

	&::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c0c0c0;
        border-radius: 3px;
        transition: background 0.2s ease;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #535bf2;
    }
}

.history-section {
	padding: 1.5rem;
	border-bottom: 1px solid #f0f0f0;
}

.history-section:last-child {
	border-bottom: none;
}

.history-section h4 {
	color: #666;
	margin: 0 0 1rem 0;
	font-size: 0.8rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	text-align: left;
}

.history-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.75rem 1rem;
	margin-bottom: 0.5rem;
	border-radius: 8px;
	background-color: #f8f8f8;
	cursor: pointer;
	transition: all 0.2s ease;
}

.history-item:hover {
	background-color: #f0f0f0;
	transform: translateX(4px);
}

.item-name {
	font-size: 0.75rem;
	text-align: left;
	font-weight: 500;
	color: #333;
}

.item-date {
	font-size: 0.75rem;
	color: #666;
	background-color: #fff;
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Add media query for mobile responsiveness */
@media (max-width: 768px) {
	.drawer {
		width: 320px;
		left: -320px;
	}

	.drawer-open {
		transform: translateX(320px);
	}

	.hamburger-container {
		left: 1rem;
	}

	.history-section {
		padding: 1rem;
	}

	.history-item {
		padding: 0.6rem 0.75rem;
	}

	.search-input {
		width: 200px;
	}
}

.history-sections {
	height: 100%;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
	text-align: center;
	color: #666;
}

.empty-icon {
	margin-bottom: 1rem;
	color: #ccc;
}

.empty-state p {
	margin: 0;
	font-size: 1rem;
	font-weight: 500;
}

.empty-state .empty-subtitle {
	margin-top: 0.5rem;
	font-size: 0.875rem;
	color: #999;
}

.search-container {
	padding: 1rem 0;
	border-bottom: 1px solid #f0f0f0;
	background: linear-gradient(to bottom, #ffffff, #fafafa);
}

.search-input-wrapper {
	position: relative;
	margin: 0 auto;
	width: 100%;
}

.search-input {
	width: 240px;
	padding: 0.75rem 1rem;
	padding-left: 2.5rem;
	border: 2px solid #e0e0e0;
	border-radius: 10px;
	font-size: 0.875rem;
	transition: all 0.2s ease;
	background: white;
	color: #333;
}

.search-input::placeholder {
	color: #999;
}

.search-input:focus {
	outline: none;
	border-color: #535bf2;
	box-shadow: 0 0 0 3px rgba(83, 91, 242, 0.1);
}

.search-input.with-spinner {
	padding-right: 2.5rem;
}

.search-input-wrapper::before {
	content: '';
	position: absolute;
	left: 2.5rem;
	top: 50%;
	transform: translateY(-50%);
	width: 16px;
	height: 16px;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	pointer-events: none;
}

@media (max-width: 768px) {
	.search-input-wrapper::before {
		left: 1.5rem;
	}
}
</style>