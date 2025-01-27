<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToApp = () => {
	router.push("/app");
};

// Add this constant for the demo URL
const demoUrl = "https://www.youtube.com/@alphabench";

const openDemo = () => {
  window.open(demoUrl, '_blank');
};
</script>

<template>
	<div class="home">
		<div class="hero">
			<h1>
				alphabench
				<span class="beta-label">preview</span>
			</h1>
			<p class="subtitle">
				Your personal quantitative research assistant <br/>
				analyzing your portfolio and backtesting strategies.
			</p>

			<div class="cta-buttons">
				<!--<button class="secondary-btn" @click="router.push('/how-to')">
					How-to
				</button>-->
				<button class="secondary-btn" @click="openDemo">
					View Demo
				</button>
				<button class="primary-btn" @click="navigateToApp">
					Get Started for Free
				</button>
			</div>
		</div>

		<div class="legal-links">
			<router-link to="/terms">Terms</router-link>
			<span class="separator">•</span>
			<router-link to="/privacy-policy">Privacy Policy</router-link>
			<span class="separator">•</span>
			<router-link to="/pricing">Pricing</router-link>
		</div>
	</div>
    <component :is="'script'" type="application/ld+json">
      {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "alphabench",
		"applicationCategory": "FinanceApplication",
		"description": "Test your trading strategies in natural language",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		}
	}
    </component>
</template>

<style scoped>
.home {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 80vh;
	text-align: center;
	padding: 2rem;
}

.hero {
	max-width: 800px;
}

h1 {
	font-size: 3rem;
	margin-bottom: 1rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.subtitle {
	font-size: 1.2rem;
	color: #666;
	margin-bottom: 2rem;
}

.cta-buttons {
	display: flex;
	gap: 1rem;
	justify-content: center;
}

button {
	padding: 0.8em 1.6em;
	font-size: 1rem;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.primary-btn {
	border: none;
	transition: all 0.3s ease, background 0.3s ease;
	background: linear-gradient(45deg, #111111, #535bf2);
	color: white;
}

.primary-btn:hover {
	background: linear-gradient(45deg, #111111, #111111);
	transform: translateY(-1px);
}

.secondary-btn {
	background: transparent;
	border: 2px solid #535bf2;
	color: #535bf2;
}

.secondary-btn:hover {
	border-color: #111111;
	color: #111111;
	transform: translateY(-1px);
}

.legal-links {
	margin-top: 2rem;
	font-size: 0.8rem;
	color: #666;
}

.legal-links a {
	color: #535bf2;
	text-decoration: none;
	cursor: pointer;
	transition: color 0.3s ease;
}

.legal-links a:hover {
	color: #111111;
}

.separator {
	margin: 0 0.5rem;
	color: #666;
}

.beta-label {
	font-size: 1rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	padding: 0.2rem 0.5rem;
	border-radius: 4px;
	color: white;
	-webkit-text-fill-color: white;
	font-weight: 500;
	letter-spacing: 0.05em;
	vertical-align: super;
}

@media (max-width: 768px) {
	.home {
		padding: 1rem;
		min-height: 70vh;
	}

	h1 {
		font-size: 2.5rem;
	}

	.subtitle {
		font-size: 1rem;
		margin-bottom: 1.5rem;
	}

	.cta-buttons {
		flex-direction: column;
		gap: 0.8rem;
	}

	button {
		width: 100%;
		padding: 0.7em 1.4em;
		font-size: 1rem;
	}
}

@media (max-width: 480px) {
	h1 {
		font-size: 1.5rem;
	}

	.beta-label {
		font-size: 0.6rem;
		padding: 0.15rem 0.4rem;
	}

	.legal-links {
		font-size: 0.6rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.legal-links .separator {
		display: none;
	}
}
</style>
