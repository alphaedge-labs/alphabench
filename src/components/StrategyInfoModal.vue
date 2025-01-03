<template>
	<div v-if="show" class="modal-overlay" @click="$emit('close')">
		<div class="modal-content" @click.stop>
			<button class="close-button" @click="$emit('close')">
				&times;
			</button>

			<h3>Strategy Examples</h3>
			<p class="description">
				Here are some example strategies you can use as templates:
			</p>

			<div class="strategy-examples">
				<div
					v-for="(strategy, index) in strategies"
					:key="index"
					class="strategy-card"
				>
					<h4>{{ strategy.title }}</h4>
					<p class="strategy-text">{{ strategy.text }}</p>
					<button
						class="copy-button"
						@click="copyStrategy(strategy.text)"
					>
						Copy Strategy
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
	show: Boolean,
});

const emit = defineEmits(["close"]);

const strategies = [
	{
		title: "Simple Moving Average Crossover",
		text: "Buy when 5-minute moving average crosses above 20-minute moving average, using closing prices. Sell when 5-minute MA crosses below 20-minute MA. Calculate MAs on closing prices only. Exit all positions at end of day",
	},
	{
		title: "Volume Spike",
		text: "Buy when 14-period RSI drops below 30 using 5-minute intervals and closing prices. Sell when RSI crosses above 70. Stop loss at 1% below entry price. Exit all positions at end of day",
	},
	{
		title: "Double bottom pattern strategy",
		text: "Buy when double bottom pattern forms (two lows within 0.1% of each other in 30-minute window). Sell when price moves 0.5% above the peak between the two lows. Stop loss at 0.2% below second low",
	},
];

const copyStrategy = async (text) => {
	try {
		await navigator.clipboard.writeText(text);
		emit("close");
		alert("Strategy copied to clipboard!");
	} catch (err) {
		console.error("Failed to copy text: ", err);
	}
};
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-content {
	background: white;
	padding: 2rem;
	border-radius: 0.5rem;
	max-width: 600px;
	width: 90%;
	max-height: 60vh;
	overflow-y: auto;
	position: relative;
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
}

.strategy-examples {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-top: 1rem;
}

.strategy-card {
	border: 1px solid #e2e8f0;
	border-radius: 0.375rem;
	padding: 1rem;
}

.strategy-card h4 {
	margin: 0 0 0.5rem 0;
	/* Replace the color property with these */
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.strategy-text {
	margin: 0 0 1rem 0;
	color: #4b5563;
	line-height: 1.5;
	text-align: left;
}

.copy-button {
	background: linear-gradient(45deg, #111111, #535bf2);
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: background-color 0.3s ease, transform 0.3s ease;
}

.copy-button:hover {
	transform: translateY(-1px);
}

.description {
	color: #666;
	margin-bottom: 1.5rem;
}
</style>
