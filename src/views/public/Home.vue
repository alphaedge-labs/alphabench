<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToApp = () => {
	router.push("/app");
};
</script>

<template>
	<div class="home">
		<div class="hero">
			<h1>
				alphabench
				<span class="beta-label">v0.1.0</span>
			</h1>
			<p class="subtitle">
				Test your trading strategies in natural language
			</p>

			<div class="cta-buttons">
				<!--<button class="secondary-btn" @click="router.push('/how-to')">
					How-to
				</button>-->
				<button class="primary-btn" @click="navigateToApp">
					Get Started for Free
				</button>
			</div>
		</div>

		<div class="legal-links">
			<a @click="router.push('/terms')">Terms</a>
			<span class="separator">•</span>
			<a @click="router.push('/privacy-policy')">Privacy Policy</a>
			<span class="separator">•</span>
			<a @click="router.push('/pricing')">Pricing</a>
		</div>
	</div>
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
	font-size: 3.5rem;
	margin-bottom: 1rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
}

.subtitle {
	font-size: 1.5rem;
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
	font-size: 1.1rem;
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
	background: rgba(100, 108, 255, 0.1);
	transform: translateY(-2px);
}

.legal-links {
	margin-top: 2rem;
	font-size: 0.9rem;
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
	font-size: 0.9rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	padding: 0.2rem 0.5rem;
	border-radius: 4px;
	color: white;
	-webkit-text-fill-color: white;
	font-weight: 500;
	letter-spacing: 0.05em;
	vertical-align: super;
}
</style>
