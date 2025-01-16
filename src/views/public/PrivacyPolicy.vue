<script setup>
const currentDate = new Date().toLocaleDateString();
</script>

<template>
	<div class="privacy-container">
		<div class="privacy-card">
			<header class="card-header">
				<h1>Privacy Policy</h1>
			</header>

			<div class="card-content">
				<div class="privacy-sections">
					<section>
						<h2>1. Introduction</h2>
						<p>
							Welcome to AlphaBench. This Privacy Policy explains
							how we collect, use, disclose, and safeguard your
							information when you use our backtesting platform.
							Please read this privacy policy carefully. If you do
							not agree with the terms of this privacy policy,
							please do not access the platform.
						</p>
					</section>

					<section>
						<h2>2. Information We Collect</h2>
						<h3>2.1 Personal Data</h3>
						<ul>
							<li>
								Name and email address when you create an
								account
							</li>
							<li>
								Payment information when you subscribe to our
								services
							</li>
							<li>
								Trading strategies and preferences you input for
								backtesting
							</li>
							<li>
								Usage data and interaction with our platform
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold">
							3. How We Use Your Information
						</h2>
						<ul className="list-disc pl-6">
							<li>
								To provide and maintain our backtesting service
							</li>
							<li>To notify you about changes to our service</li>
							<li>To provide customer support</li>
							<li>To process your payments</li>
							<li>
								To analyze usage patterns and improve our
								platform
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold">
							4. Data Storage and Security
						</h2>
						<p>
							We implement appropriate technical and
							organizational security measures to protect your
							personal data against unauthorized access,
							alteration, disclosure, or destruction.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold">
							5. Third-Party Services
						</h2>
						<p>
							We use Razorpay for payment processing. Their use of
							your personal information is governed by their
							respective privacy policies.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold">
							6. Your Rights
						</h2>
						<p>You have the right to:</p>
						<ul className="list-disc pl-6">
							<li>Access your personal data</li>
							<li>Correct inaccurate data</li>
							<li>Request deletion of your data</li>
							<li>Object to processing of your data</li>
							<li>Request data portability</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold">
							7. Contact Information
						</h2>
						<p>
							If you have any questions about this Privacy Policy,
							please contact us at:
						</p>
						<p className="mt-2">
							Email: contact@alphabench.in<br />
							Address: Dadar, Mumbai, 400014
						</p>
					</section>

					<section>
						<h2>8. Updates to This Policy</h2>
						<p>
							We may update this privacy policy from time to time.
							We will notify you of any changes by posting the new
							privacy policy on this page and updating the "Last
							Updated" date.
						</p>
					</section>

					<p class="last-updated">Last Updated: {{ currentDate }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.privacy-container {
	max-width: 1200px;
	padding: 1rem 1rem;
}

.privacy-card {
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

.privacy-sections {
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

section h3 {
	font-size: 1.1rem;
	font-weight: 500;
	color: #444;
	margin-bottom: 0.75rem;
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

@media (max-width: 768px) {
	.privacy-container {
		margin: 1rem;
	}

	.card-header,
	.card-content {
		padding: 1rem;
	}

	.privacy-sections {
		gap: 1.5rem;
	}
}
</style>
