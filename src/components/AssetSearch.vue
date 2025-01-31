<template>
	<div class="asset-search">
		<button
			type="button"
			class="search-trigger"
			@click="isOpen = !isOpen"
			:aria-expanded="isOpen"
			role="combobox"
			ref="trigger"
		>
			<span class="trigger-text">{{
				selectedAsset ? selectedAsset.label : "Select asset..."
			}}</span>
			<span class="chevron" :class="{ 'chevron-open': isOpen }">⌄</span>
		</button>

		<div v-if="isOpen" class="search-popover" :style="popoverStyle">
			<div class="search-container">
				<div class="search-input-wrapper">
					<input
						type="text"
						class="search-input"
						placeholder="Search asset..."
						v-model="searchQuery"
						@input="filterAssets"
						ref="searchInput"
					/>
					<svg
						class="search-icon"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M8.5 3a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 8.5a6.5 6.5 0 1111.5 4.2l4.3 4.3-0.7 0.7-4.3-4.3A6.5 6.5 0 012 8.5z"
						/>
					</svg>
				</div>

				<div class="assets-list">
					<div
						v-if="filteredAssets.length === 0"
						class="empty-message"
					>
						No asset found.
					</div>
					<button
						v-for="asset in filteredAssets"
						:key="asset.value"
						class="asset-item"
						@click="selectAsset(asset)"
						:class="{ selected: modelValue === asset.value }"
					>
						<span
							class="check-icon"
							:class="{ visible: modelValue === asset.value }"
						>
							<svg viewBox="0 0 20 20" fill="currentColor">
								<path
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								/>
							</svg>
						</span>
						{{ asset.label }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import assets from "../assets/instruments-small.json";

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const searchQuery = ref("");
const trigger = ref(null);
const searchInput = ref(null);
const popoverStyle = ref({});

const selectedAsset = computed(() =>
	assets.find((asset) => asset.value === props.modelValue)
);

const filteredAssets = computed(() => {
	const query = searchQuery.value.toLowerCase();
	return assets.filter(
		(asset) =>
			asset.label.toLowerCase().includes(query) ||
			asset.value.toLowerCase().includes(query)
	);
});

const selectAsset = (asset) => {
	emit(
		"update:modelValue",
		asset.value === props.modelValue ? "" : asset.value
	);
	isOpen.value = false;
	searchQuery.value = "";
};

const updatePopoverPosition = () => {
	if (!trigger.value) return;

	const rect = trigger.value.getBoundingClientRect();
	popoverStyle.value = {
		position: "absolute",
		// top: `${rect.bottom + window.scrollY + 5}px`,
		// left: `${rect.left + window.scrollX}px`,
		width: `${rect.width}px`,
	};
};

const closeOnOutsideClick = (event) => {
	if (
		!trigger.value?.contains(event.target) &&
		!event.target.closest(".search-popover")
	) {
		isOpen.value = false;
		searchQuery.value = "";
	}
};

onMounted(() => {
	document.addEventListener("click", closeOnOutsideClick);
	window.addEventListener("resize", updatePopoverPosition);
	window.addEventListener("scroll", updatePopoverPosition);
});

onUnmounted(() => {
	document.removeEventListener("click", closeOnOutsideClick);
	window.removeEventListener("resize", updatePopoverPosition);
	window.removeEventListener("scroll", updatePopoverPosition);
});
</script>

<style scoped>
.asset-search {
	position: relative;
	display: inline-block;
	width: 100%;
	max-width: 300px;
	font-family: system-ui, -apple-system, sans-serif;
}

.search-trigger {
	width: 100%;
	padding: 0.75rem 1rem;
	background: white;
	border: 1px solid #e2e8f0;
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 0.9375rem;
	color: #1f2937;
	text-align: left;
	cursor: pointer;
	transition: all 0.2s ease;
}

.search-trigger:hover {
	border-color: #94a3b8;
	background: #f8fafc;
}

.search-trigger:focus {
	outline: none;
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.trigger-text {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.chevron {
	font-size: 1.25rem;
	opacity: 0.6;
	transform: scaleX(1.5) rotate(0deg);
	transition: transform 0.2s ease;
}

.chevron-open {
	transform: scaleX(1.5) rotate(180deg);
}

.search-popover {
	z-index: 50;
	position: absolute;
	background: white;
	border-radius: 0.75rem;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05);
	margin-top: 0.5rem;
	border: 1px solid #e2e8f0;
	overflow: hidden;
}

.search-container {
	display: flex;
	flex-direction: column;
}

.search-input-wrapper {
	width: 350px;
	padding: 0.75rem;
	border-bottom: 1px solid #e2e8f0;
	position: relative;
}

.search-input {
	padding: 0.625rem 1.25rem 0.625rem 1.25rem;
	border: 1px solid #e2e8f0;
	border-radius: 0.5rem;
	background: #f8fafc;
	font-size: 0.9375rem;
	transition: all 0.2s ease;
}

.search-input:focus {
	outline: none;
	border-color: #3b82f6;
	background: white;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.search-icon {
	position: absolute;
	left: 1.5rem;
	top: 50%;
	transform: translateY(-50%);
	width: 1.25rem;
	height: 1.25rem;
	color: #94a3b8;
	pointer-events: none;
}

.assets-list {
	max-height: 300px;
	overflow-y: auto;
	padding: 0.5rem 0;
}

.empty-message {
	padding: 1rem;
	color: #64748b;
	text-align: center;
	font-size: 0.9375rem;
}

.asset-item {
	width: 100%;
	padding: 0.625rem 1rem;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 0.9375rem;
	color: #1f2937;
	background: transparent;
	border: none;
	cursor: pointer;
	text-align: left;
	transition: all 0.15s ease;
}

.asset-item:hover {
	background: #f1f5f9;
}

.check-icon {
	width: 1.25rem;
	height: 1.25rem;
	color: #3b82f6;
	opacity: 0;
	transition: opacity 0.2s ease;
}

.check-icon.visible {
	opacity: 1;
}

.selected {
	background: #f1f5f9;
	font-weight: 500;
}

.assets-list::-webkit-scrollbar {
	width: 8px;
}

.assets-list::-webkit-scrollbar-track {
	background: transparent;
}

.assets-list::-webkit-scrollbar-thumb {
	background: #cbd5e1;
	border-radius: 4px;
	border: 2px solid white;
}

.assets-list::-webkit-scrollbar-thumb:hover {
	background: #94a3b8;
}
</style>
