<template>
	<div>
		<!-- Navigation Header -->
		<!--<nav class="nav-header">
			<div class="nav-container">
				<router-link to="/" class="logo">
					alphaedge
				</router-link>
				
				<div class="nav-links">
					<router-link to="/how-to">How to Use</router-link>
					<router-link to="/pricing">Pricing</router-link>
					<router-link to="/terms">Terms</router-link>
				</div>

				<ProfileDropdown :fixed="false"/>
			</div>
		</nav>-->

		<div class="pricing-section">
			<div class="pricing-header">
				<h1 class="pricing-label">Pricing Plans</h1>
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
							@click="navigateToApp(index)"
						>
							{{ plan.cta }}
						</button>
					</div>
				</div>
			</div>

			<div class="refunds-section">
				<div class="refunds-header">
					<h2 class="refunds-label">Refund Policy</h2>
					<p class="refunds-subtitle">Please review our refund policy below</p>
				</div>
				<div class="refunds-content">
					<div class="refunds-grid">
						<div class="refund-card">
							<div class="card-icon">
								<svg viewBox="0 0 24 24" width="24" height="24">
									<path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z"/>
								</svg>
							</div>
							<h3>Subscription Cancellations</h3>
							<p>If you cancel your subscription, it will remain active until the end of the current billing period with no subsequent charges.</p>
						</div>
						
						<div class="refund-card">
							<div class="card-icon">
								<svg viewBox="0 0 24 24" width="24" height="24">
									<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
								</svg>
							</div>
							<h3>Refund Eligibility</h3>
							<p>Refunds are considered case-by-case. Contact support within 14 days of renewal for refund requests.</p>
						</div>
						
						<div class="refund-card">
							<div class="card-icon">
								<svg viewBox="0 0 24 24" width="24" height="24">
									<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
								</svg>
							</div>
							<h3>Refund Process</h3>
							<p>Approved refunds are processed within 5-7 business days, credited back to your original payment method.</p>
						</div>
						
						<div class="refund-card">
							<div class="card-icon">
								<svg viewBox="0 0 24 24" width="24" height="24">
									<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-2h2V7h-2v7z"/>
								</svg>
							</div>
							<h3>Non-Refundable Services</h3>
							<p>Some services or features may be non-refundable. These will be clearly marked at purchase.</p>
						</div>
					</div>
					
					<div class="refunds-contact">
						<p>For questions or refund requests, please <a href="mailto:contact@alphabench.in">contact us</a> or cancel from your profile.</p>
					</div>
				</div>
			</div>

			<div v-if="showWaitlistModal" class="modal-overlay">
				<div class="modal-content">
					<button class="close-button" @click="showWaitlistModal = false">×</button>
					
					<h3 class="modal-title">Join the Waitlist</h3>
					<p class="modal-description">Be the first to know when Pro features are available</p>
					
					<form @submit.prevent="handleWaitlistSubmit" class="waitlist-form">
						<input
							type="email"
							v-model="email"
							placeholder="Enter your email"
							required
							class="email-input"
						/>
						<button type="submit" class="submit-button" :disabled="isSubmitting">
							{{ isSubmitting ? 'Joining...' : 'Join Waitlist' }}
						</button>
					</form>
					
					<p v-if="submitted" class="success-message">
						You'll receive an email from us when we're ready to roll out pro features!
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { ref } from "vue";
import { joinWaitlist } from "../../http/app";
import ProfileDropdown from "../../components/ProfileDropdown.vue";

const router = useRouter();

const showWaitlistModal = ref(false)
const email = ref('')
const isSubmitting = ref(false)
const submitted = ref(false)

const navigateToApp = (index) => {
	if (plans[index].isOnWaitlist) {
		showWaitlistModal.value = true
	} else {
		router.push('/app')
	}
}

const handleWaitlistSubmit = async () => {
	try {
		isSubmitting.value = true
		await joinWaitlist(email.value)
		submitted.value = true
		email.value = ''
		setTimeout(() => {
			showWaitlistModal.value = false
			submitted.value = false
		}, 3000)
	} catch (error) {
		console.error('Error joining waitlist:', error)
	} finally {
		isSubmitting.value = false
	}
}

const plans = [
	{
		name: "Free",
		price: "$0",
		isOnWaitlist: false,
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
			"Basic price data (OHLC) only"
		],
		cta: "Start Free"
	},
	{
		name: "Pro",
		price: "$20",
		isOnWaitlist: true,
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
			"Basic commenting on strategies"
		],
		cta: "Join Waitlist"
	},
];
</script>

<style scoped>
/* New Navigation Styles */
.nav-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 4rem;
	background: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	border-bottom: 1px solid #e5e7eb;
	z-index: 50;
}

.nav-container {
	max-width: 1280px;
	margin: 0 auto;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 2rem;
}

.logo {
	font-size: 1.5rem;
	font-weight: 700;
	text-decoration: none;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.nav-links {
	display: flex;
	gap: 2rem;
	align-items: center;
}

.nav-links a {
	text-decoration: none;
	color: #4b5563;
	font-weight: 500;
	transition: color 0.2s ease;
}

.nav-links a:hover {
	color: #111827;
}

.nav-links a.router-link-active {
	color: #535bf2;
}

/* Update existing styles to account for fixed header */
.pricing-section {
	padding: 2rem 1.5rem;
	padding-top: 5rem; /* Increased to account for fixed header */
	max-width: 1280px;
	margin: 0 auto;
}

.pricing-header {
	text-align: center;
	max-width: 48rem;
	margin: 0 auto;
}

.pricing-label {
	font-size: 1.5rem;
	font-weight: 600;
	color: #333;
	margin: 0;
}

.pricing-title {
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	font-size: 2rem;
	font-weight: 700;
	line-height: 1.2;
}

.pricing-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	margin-top: 4rem;
	max-width: 900px;
	margin-left: auto;
	margin-right: auto;
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

.refunds-section {
	padding: 4rem 1.5rem;
	border-radius: 1rem;
	margin-top: 4rem;
}

.refunds-header {
	text-align: center;
	margin-bottom: 3rem;
}

.refunds-label {
	font-size: 2rem;
	font-weight: 700;
	color: #111827;
	margin-bottom: 1rem;
}

.refunds-subtitle {
	color: #6b7280;
	font-size: 1.1rem;
}

.refunds-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 2rem;
	max-width: 1200px;
	margin: 0 auto;
}

.refund-card {
	background: white;
	padding: 2rem;
	border-radius: 1rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s, box-shadow 0.2s;
}

.refund-card:hover {
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-icon {
	background: #f3f4f6;
	width: 48px;
	height: 48px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1.5rem;
	color: #535bf2;
}

.refund-card h3 {
	font-size: 1.25rem;
	font-weight: 600;
	color: #111827;
	margin-bottom: 1rem;
}

.refund-card p {
	color: #6b7280;
	line-height: 1.5;
}

.refunds-contact {
	text-align: center;
	margin-top: 3rem;
	padding-top: 2rem;
	border-top: 1px solid #e5e7eb;
}

.refunds-contact a {
	color: #535bf2;
	text-decoration: none;
	font-weight: 500;
}

.refunds-contact a:hover {
	text-decoration: underline;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-content {
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
	border: 1px solid rgba(255, 255, 255, 0.18);
	padding: 2rem;
	border-radius: 0.5rem;
	width: 90%;
	max-width: 500px;
	position: relative;
}

.close-button {
	position: absolute;
	top: 1rem;
	right: 1rem;
	border: none;
	background: none;
	font-size: 1.5rem;
	cursor: pointer;
	color: #6b7280;
}

.modal-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: #111827;
	margin-bottom: 0.5rem;
}

.modal-description {
	color: #6b7280;
	margin-bottom: 1.5rem;
}

.waitlist-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.email-input {
	padding: 0.75rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.375rem;
	font-size: 1rem;
}

.submit-button {
	padding: 0.75rem 1.5rem;
	border-radius: 0.375rem;
	font-weight: 600;
	cursor: pointer;
	background: linear-gradient(45deg, #111111, #535bf2);
	color: white;
	border: none;
	transition: opacity 0.2s;
}

.submit-button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.success-message {
	margin-top: 1rem;
	color: #059669;
	text-align: center;
}

@media (max-width: 768px) {
	.nav-container {
		padding: 0 1rem;
	}

	.nav-links {
		gap: 1rem;
	}

	.nav-links a {
		font-size: 0.875rem;
	}

	.logo {
		font-size: 1.25rem;
	}

	.refunds-section {
		padding: 2rem 1rem;
		margin-top: 2rem;
	}

	.refunds-label {
		font-size: 1.75rem;
	}

	.refunds-subtitle {
		font-size: 1rem;
		padding: 0 1rem;
	}

	.refunds-grid {
		grid-template-columns: 1fr;
		gap: 1.5rem;
		padding: 0 1rem;
	}

	.refund-card {
		padding: 1.5rem;
	}

	.card-icon {
		width: 40px;
		height: 40px;
	}

	.refund-card h3 {
		font-size: 1.1rem;
	}

	.refund-card p {
		font-size: 0.95rem;
	}

	.refunds-contact {
		margin-top: 2rem;
		padding: 0 1rem;
	}
}

@media (max-width: 640px) {
	.nav-links {
		display: none; /* Hide navigation links on mobile */
	}

	.refunds-section {
		padding: 1.5rem 0.5rem;
		margin-top: 1.5rem;
		border-radius: 0.5rem;
	}

	.refunds-label {
		font-size: 1.5rem;
	}

	.refunds-subtitle {
		font-size: 0.95rem;
		padding: 0 0.5rem;
	}

	.refunds-grid {
		padding: 0 0.5rem;
		gap: 1rem;
	}

	.refund-card {
		padding: 1.25rem;
	}

	.card-icon {
		width: 36px;
		height: 36px;
	}

	.refund-card h3 {
		font-size: 1rem;
		margin-bottom: 0.75rem;
	}

	.refund-card p {
		font-size: 0.9rem;
	}

	.refunds-contact {
		margin-top: 1.5rem;
		padding: 1.5rem 0.5rem 0;
		font-size: 0.9rem;
	}
}
</style>
