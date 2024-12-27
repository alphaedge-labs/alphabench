<template>
	<div class="date-picker-container">
		<DatePicker
			v-model="selectedRange"
			:min-date="minDate"
			:max-date="maxDate"
			mode="range"
			:masks="masks"
			is-range
			:columns="windowWidth >= 1024 ? 2 : 1"
			class="date-picker"
			:attributes="attributes"
			@input="handleDateChange"
		>
			<template #default="{ inputValue, inputEvents }">
				<div class="date-input">
					<input
						:value="`📅  ${inputValue.start || 'Start date'}  to  ${
							inputValue.end || 'End date'
						}`"
						v-on="{ ...inputEvents.start, ...inputEvents.end }"
						placeholder="Select date range"
						class="date-field single-field"
					/>
				</div>
			</template>
		</DatePicker>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { DatePicker } from "v-calendar";

const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({ start: null, end: null }),
	},
});

const emit = defineEmits(["update:modelValue"]);

const windowWidth = ref(window.innerWidth);
const selectedRange = ref({
	start: props.modelValue?.start || null,
	end: props.modelValue?.end || null,
});

const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 1);

const maxDate = new Date();

const masks = {
	input: "DD-MM-YYYY",
};

const attributes = [
	{
		key: "range",
		highlight: {
			start: { fillMode: "outline" },
			base: { fillMode: "light" },
			end: { fillMode: "outline" },
		},
		dates: computed(() => selectedRange.value),
	},
];

const handleDateChange = () => {
	if (selectedRange.value.start && selectedRange.value.end) {
		const diffTime = Math.abs(
			selectedRange.value.end - selectedRange.value.start
		);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 1) {
			selectedRange.value.end = selectedRange.value.start;
		} else if (diffDays > 365) {
			selectedRange.value.end = new Date(selectedRange.value.start);
			selectedRange.value.end.setFullYear(
				selectedRange.value.end.getFullYear() + 1
			);
		}
	}

	emit("update:modelValue", selectedRange.value);
};

const handleResize = () => {
	windowWidth.value = window.innerWidth;
};

onMounted(() => {
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
});

watch(
	() => props.modelValue,
	(newValue) => {
		if (
			newValue &&
			(newValue.start !== selectedRange.value.start ||
				newValue.end !== selectedRange.value.end)
		) {
			selectedRange.value = { ...newValue };
		}
	},
	{ deep: true }
);
</script>

<style scoped>
.date-picker-container {
	width: 100%;
}

.date-input {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
}

.date-field {
	flex: 1;
	padding: 0.75rem 1rem;
	border: 1px solid #e2e8f0;
	border-radius: 0.375rem;
	font-size: 0.9375rem;
	color: #1f2937;
	font-weight: 500;
	background: white;
}

.date-field:focus {
	outline: none;
	border-color: #535bf2;
	box-shadow: 0 0 0 1px #535bf2;
}

.date-separator {
	color: #64748b;
	font-size: 0.875rem;
}

:deep(.vc-container) {
	border: 1px solid #e2e8f0;
	border-radius: 0.5rem;
}

/* Override v-calendar default styles */
:deep(.vc-highlight) {
	background-color: transparent !important;
}

:deep(.vc-day-content:hover) {
	background-color: #111111 !important;
	color: white;
}

.single-field {
	max-width: 220px;
	text-align: left;
}

@media (max-width: 640px) {
	.date-input {
		flex-direction: row;
	}
}
</style>
