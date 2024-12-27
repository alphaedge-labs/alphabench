<script setup>
const currentDate = new Date().toLocaleDateString();
</script>

<template>
	<div class="terms-container">
		<div class="terms-card">
			<header class="card-header">
				<h1>Terms and Conditions</h1>
			</header>

			<div class="card-content">
				<div class="terms-sections">
					<section>
						<h2>1. Agreement to Terms</h2>
						<p>
							By accessing and using alphabench, you agree to be
							bound by these Terms and Conditions. If you disagree
							with any part of these terms, you may not access the
							service.
						</p>
					</section>

					<section>
						<h2>2. Description of Service</h2>
						<p>
							alphabench is a backtesting platform that allows
							users to test trading strategies using historical
							market data. The service includes:
						</p>
						<ul>
							<li>Access to backtesting tools</li>
							<li>Generation of performance reports</li>
							<li>Storage of backtesting results</li>
							<li>
								Subscription-based access to advanced features
							</li>
						</ul>
					</section>

					<section>
						<h2>3. User Accounts</h2>
						<p>
							3.1. New users receive 3 free backtesting results
							upon registration.<br />
							3.2. Additional backtesting requires a paid
							subscription plan.<br />
							3.3. You are responsible for maintaining the
							confidentiality of your account credentials.
						</p>
					</section>

					<section>
						<h2>4. Subscription and Payments</h2>
						<p>
							4.1. Subscription fees are billed in advance.<br />
							4.2. All payments are processed through Razorpay.<br />
							4.3. Prices are subject to change with notice.
						</p>
					</section>

					<section>
						<h2>5. Intellectual Property</h2>
						<p>
							5.1. The platform and its original content are and
							will remain the exclusive property of alphabench.<br />
							5.2. Your backtesting strategies remain your
							intellectual property.
						</p>
					</section>

					<section>
						<h2>6. Limitation of Liability</h2>
						<p>
							6.1. alphabench is not responsible for any financial
							losses incurred from using our backtesting
							results.<br />
							6.2. Past performance is not indicative of future
							results.
						</p>
					</section>

					<section>
						<h2>7. Termination</h2>
						<p>
							We reserve the right to terminate or suspend access
							to our service immediately, without prior notice,
							for any breach of these Terms and Conditions.
						</p>
					</section>

					<section>
						<h2>8. Changes to Terms</h2>
						<p>
							We reserve the right to modify these terms at any
							time. We will notify users of any changes by
							updating the "Last Updated" date.
						</p>
					</section>

					<section>
						<h2>9. Contact Information</h2>
						<p>
							For any questions regarding these terms, please
							contact:<br />
							Email: corevatsal@gmail.com<br />
							Address: Dadar, Mumbai, 400014
						</p>
					</section>

					<p class="last-updated">Last Updated: {{ currentDate }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.terms-container {
	max-width: 1200px;
	padding: 1rem 1rem;
}

.terms-card {
	border-radius: 12px;
	overflow: hidden;
}

.card-header {
	padding: 1.5rem 2rem;
}

.card-header h1 {
	font-size: 1.5rem;
	font-weight: 600;
	color: #333;
	margin: 0;
}

.card-content {
	text-align: left;
	padding: 2rem;
}

.terms-sections {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

section h2 {
	font-size: 1.25rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 1rem;
}

section p {
	color: #666;
	line-height: 1.6;
	margin-bottom: 1rem;
}

ul {
	list-style-type: disc;
	padding-left: 2rem;
	color: #666;
	margin: 1rem 0;
}

li {
	margin-bottom: 0.5rem;
}

.last-updated {
	margin-top: 2rem;
	color: #888;
	font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.terms-container {
		margin: 1rem;
	}

	.card-header,
	.card-content {
		padding: 1rem;
	}

	.terms-sections {
		gap: 1.5rem;
	}
}
</style>
