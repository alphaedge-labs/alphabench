<template>
	<div class="pricing-section">
		<div class="pricing-header">
			<h2 class="pricing-label">Pricing</h2>
			<p class="pricing-title">Choose the right plan for you</p>
		</div>

		<div class="pricing-grid">
			<div
				v-for="(plan, index) in plans"
				:key="plan.name"
				:class="['pricing-card', { featured: index === 1 }]"
			>
				<div class="card-header">
					<h3 class="plan-name">{{ plan.name }}</h3>
					<p class="plan-description">{{ plan.description }}</p>
					<p class="plan-price">
						<span class="amount">{{ plan.price }}</span>
						<span class="period">/month</span>
					</p>
				</div>

				<div class="card-content">
					<ul class="features-list">
						<li v-for="feature in plan.features" :key="feature">
							<svg
								class="check-icon"
								viewBox="0 0 24 24"
								width="24"
								height="24"
							>
								<path
									fill="currentColor"
									d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
								/>
							</svg>
							<span>{{ feature }}</span>
						</li>
					</ul>
				</div>

				<div class="card-footer">
					<button
						:class="['cta-button', { primary: index === 1 }]"
						@click="navigateToApp"
					>
						{{ plan.cta }}
					</button>
				</div>
			</div>
		</div>

		<div class="refunds-section">
			<div class="refunds-header">
				<h2 class="refunds-label">Refund Policy</h2>
			</div>
			<div class="refunds-content">
				<section>
					<p>Please review refund policy below:</p>
					<ul>
						<li>
							<strong>Subscription Cancellations:</strong> If you
							choose to cancel your subscription at any time
							during the billing cycle, your subscription will
							remain active until the end of the current billing
							period. You will not be charged for the subsequent
							billing cycle.
						</li>
						<li>
							<strong>Refund Eligibility:</strong> Refunds are
							considered on a case-by-case basis. To request a
							refund, please contact our support team within 14
							days of your subscription renewal date.
						</li>
						<li>
							<strong>Refund Process:</strong> Approved refunds
							will be processed within 5-7 business days. The
							refunded amount will be credited back to your
							original payment method.
						</li>
						<li>
							<strong>Non-Refundable Services:</strong> Please
							note that certain services or features may be
							non-refundable. These will be clearly indicated at
							the time of purchase.
						</li>
					</ul>
					<p>
						For any questions or to request a refund, please cancel
						subscription from your profile or contact me at
						<a href="mailto:corevatsal@gmail.com"
							>corevatsal@gmail.com</a
						>.
					</p>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();

const navigateToApp = () => {
	router.push("/app");
};

const plans = [
	{
		name: "Free",
		price: "$0",
		description: "For beginners, hobbyists, and casual investors",
		features: [
			"Simple strategies in natural language",
			"Basic fields: Asset class, date range, simple asset search",
			"Equity & Mutual Funds (Limited selection)",
			"Minimal FnO (index futures only)",
			"Up to 6 months of historical data",
			"Daily or 30-minute data intervals",
			"Basic search for well-known securities",
			"Single-asset, simple strategies",
			"Basic close-to-close simulations",
			"Total Return, Win Rate, Maximum Drawdown",
			"Standard PDF/HTML report",
			"Basic executive summary & key metrics",
			"Few pre-built template strategies",
			"Basic price data (OHLC) only",
		],
		cta: "Start Free",
	},
	{
		name: "Pro",
		price: "$20",
		description: "For intermediate traders, analysts, and small teams",
		features: [
			"Complex, multi-parameter strategies",
			"Advanced parameters: volatility filters, multiple indicators",
			"Equities (stocks & ETFs), full Mutual Fund coverage",
			"Broad FnO (popular futures & options)",
			"Up to 2 years of historical data",
			"1-minute and 5-minute intervals available",
			"Increased daily request limits",
			"Advanced search with filters",
			"Multi-asset strategies",
			"Technical indicators (RSI, MACD)",
			"Intraday-level simulations with 1-minute granularity",
			"Sharpe Ratio, Sortino Ratio, Annualized Returns",
			"Detailed trade statistics",
			"Extended reports with methodology",
			"Export to PDF, CSV, Excel",
			"Expanded library of strategies",
			"Basic implied volatility for FnO",
			"Invite 1-2 team members",
			"Basic commenting on strategies",
		],
		cta: "Upgrade to Pro",
	},
	{
		name: "Plus",
		price: "$40",
		description:
			"For professional traders, quantitative researchers, and small funds",
		features: [
			"Saved strategy templates for quick re-use",
			"Custom basket backtesting",
			"Up to 5+ years of historical data",
			"Full interval granularity (1-second to 1-day)",
			"Highest daily request limits",
			"Bulk selection from watchlists",
			"Custom asset groupings",
			"User-defined ticker sets",
			"Complex, algorithmic strategies",
			"Dynamic position sizing, advanced volatility models",
			"Rolling Sharpe, Monte Carlo simulations",
			"White-labeled, fully customizable reports",
			"Version-controlled strategy reports",
			"Strategy sharing within a private community",
			"Advanced greeks (Delta, Gamma, Theta, Vega)",
			"Sentiment indicators from integrated market news feeds",
			"Full API access",
			"Integrate custom datasets",
			"Webhook triggers for automated backtesting schedules",
			"Integration with Slack/Teams notifications",
		],
		cta: "Upgrade to Plus",
	},
];
</script>

<style scoped>
.pricing-section {
	padding: 2rem 1.5rem;
	max-width: 1280px;
	margin: 0 auto;
}

.pricing-header {
	text-align: center;
	max-width: 48rem;
	margin: 0 auto;
}

.pricing-label {
	color: #535bf2;
	font-size: 1rem;
	font-weight: 600;
	margin-bottom: 0.5rem;
}

.pricing-title {
	font-size: 2rem;
	font-weight: 700;
	color: #111827;
	line-height: 1.2;
}

.pricing-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	margin-top: 4rem;
}

.pricing-card {
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: white;
}

.pricing-card.featured {
	border-color: #535bf2;
	box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1),
		0 2px 4px -1px rgba(79, 70, 229, 0.06);
}

.plan-name {
	font-size: 1.5rem;
	font-weight: 700;
	color: #111827;
}

.plan-description {
	color: #6b7280;
	font-size: 0.875rem;
	margin-top: 0.5rem;
}

.plan-price {
	margin-top: 1.5rem;
}

.plan-price .amount {
	font-size: 2.25rem;
	font-weight: 700;
	color: #111827;
}

.plan-price .period {
	font-size: 0.875rem;
	color: #6b7280;
}

.features-list {
	margin-top: 1.5rem;
	list-style: none;
	padding: 0;
}

.features-list li {
	display: flex;
	align-items: center;
	margin-bottom: 0.75rem;
	color: #6b7280;
	font-size: 0.875rem;
}

.check-icon {
	width: 1.25rem;
	height: 1.25rem;
	color: #535bf2;
	margin-right: 0.75rem;
	flex-shrink: 0;
}

.cta-button {
	width: 100%;
	padding: 0.75rem 1.5rem;
	border-radius: 0.375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
}

.cta-button.primary {
	background: linear-gradient(45deg, #111111, #535bf2);
	color: white;
	border: none;
}

.cta-button:not(.primary) {
	background-color: white;
	color: #535bf2;
	border: 1px solid #535bf2;
	border-color: linear-gradient(45deg, #111111, #535bf2);
}

.cta-button:hover {
	opacity: 0.9;
}

@media (min-width: 640px) {
	.pricing-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.pricing-title {
		font-size: 3rem;
	}
}

@media (min-width: 1024px) {
	.pricing-grid {
		grid-template-columns: repeat(3, 1fr);
	}
}

.refunds-section {
	padding: 2rem 1.5rem;
	margin: 0 auto;
	border-radius: 0.5rem;
}

.refunds-header {
	text-align: center;
	max-width: 48rem;
	margin: 0 auto;
	margin-top: 4rem;
}

.refunds-label {
	color: #535bf2;
	font-size: 1rem;
	font-weight: 600;
	margin-bottom: 1rem;
}

.refunds-content {
	font-size: 1rem;
	color: #4b5563;
	text-align: left;
}

.refunds-content ul {
	list-style-type: disc;
	margin-left: 1.5rem;
	margin-top: 1rem;
}

.refunds-content li {
	margin-bottom: 0.75rem;
}

.refunds-content a {
	color: #535bf2;
	text-decoration: none;
}

.refunds-content a:hover {
	text-decoration: underline;
}
</style>
