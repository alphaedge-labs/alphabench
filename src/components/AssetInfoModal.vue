<template>
	<div v-if="show" class="modal-overlay" @click="$emit('close')">
		<div class="modal-content" @click.stop>
			<button class="close-button" @click="$emit('close')">
				&times;
			</button>

			<h3>Available Assets</h3>
			<p class="description">
				You can search and select from the following types of assets:
			</p>

			<div class="asset-categories">
				<div
					v-for="(category, index) in assetCategories"
					:key="index"
					class="asset-card"
				>
					<h4>{{ category.title }}</h4>
					<ul class="asset-list">
						<li v-for="(item, idx) in category.examples" :key="idx">
							{{ item }}
						</li>
					</ul>
					<div class="note" v-if="category.note">
						<strong>Note:</strong> {{ category.note }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	show: Boolean,
});

defineEmits(["close"]);

const assetCategories = [
	{
		title: "Individual Stocks",
		examples: [
			"RELIANCE - Reliance Industries Limited",
			"TCS - Tata Consultancy Services",
			"HDFC - HDFC Bank Limited",
			"INFY - Infosys Limited",
		],
		note: "You can search for any NSE listed stock by name or symbol",
	},
	{
		title: "Stock Indices",
		examples: ["NIFTY 50", "NIFTY BANK", "NIFTY IT", "SENSEX"],
	},
	{
		title: "Asset Groups",
		examples: [
			"NIFTY50 Stocks",
			"Bank Nifty Constituents",
			"IT Sector Stocks",
			"Top 10 Market Cap Companies",
		],
		note: "Testing on groups will run the strategy on all constituent stocks",
	},
	{
		title: "ETFs",
		examples: [
			"NIFTYBEES - Nifty 50 ETF",
			"BANKBEES - Bank Nifty ETF",
			"GOLDBEES - Gold ETF",
			"LIQUIDBEES - Liquid ETF",
		],
	},
];
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
	max-height: 80vh;
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

.asset-categories {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-top: 1rem;
}

.asset-card {
	border: 1px solid #e2e8f0;
	border-radius: 0.375rem;
	padding: 1rem;
}

.asset-card h4 {
	margin: 0 0 0.5rem 0;
	/* Replace the color property with these */
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.asset-list {
	margin: 0.5rem 0;
	padding-left: 1.5rem;
	color: #4b5563;
	line-height: 1.5;
	text-align: left;
}

.asset-list li {
	margin-bottom: 0.25rem;
}

.note {
	margin-top: 0.75rem;
	padding: 0.5rem;
	background: #f8fafc;
	border-radius: 0.25rem;
	font-size: 0.875rem;
	color: #64748b;
}

.description {
	color: #666;
	margin-bottom: 1.5rem;
}
</style>
