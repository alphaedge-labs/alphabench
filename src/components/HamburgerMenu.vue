<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
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
const { backtestHistory } = storeToRefs(appStore);

const hasBacktestHistory = computed(() => {
	return (
		backtestHistory.value.thisWeek.length > 0 ||
		backtestHistory.value.lastMonth.length > 0 ||
		backtestHistory.value.older.length > 0
	);
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

				<div v-if="hasBacktestHistory" class="history-sections">
					<div class="history-section">
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

					<div class="history-section">
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

					<div class="history-section">
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
					<p>No backtest history yet</p>
					<p class="empty-subtitle">
						Run your first backtest to see it here
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
</style>
