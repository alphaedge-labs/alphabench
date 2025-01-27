<script setup>
import { onMounted } from "vue";

import ProfileDropdown from "../../components/ProfileDropdown.vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";
import SearchForm from "../../components/SearchForm.vue";
</script>

<template>
	<div class="main-app">
		<h1 class="logo">
			alphabench
			<span class="beta-label">preview</span>
		</h1>
		<div class="header">
			<ProfileDropdown />
		</div>
		<HamburgerMenu />
		<SearchForm />
	</div>
</template>

<style scoped>
.main-app {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	background-color: white;
}

.header {
	position: absolute;
	top: 1rem;
	right: 2rem;
}

.logo {
	position: absolute;
	top: 1.5rem;
	left: 50%;
	transform: translateX(-50%);
	font-size: 1.5rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.beta-label {
	font-size: 0.8rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	padding: 0.2rem 0.5rem;
	border-radius: 4px;
	color: white;
	-webkit-text-fill-color: white;
	font-weight: 500;
	letter-spacing: 0.05em;
}

@media (max-width: 768px) {
	.main-app {
		padding: 1rem 0.5rem;
	}

	.header {
		right: 1rem;
	}

	.logo {
		font-size: 1.2rem;
	}

	.beta-label {
		font-size: 0.7rem;
	}
}

@media (max-width: 480px) {
	.main-app {
		padding: 0;
	}

	.header {
		top: 0.5rem;
		right: 0.5rem;
	}

	.logo {
		top: 1rem;
		font-size: 1rem;
		flex-direction: column;
		gap: 0.2rem;
	}

	.beta-label {
		font-size: 0.6rem;
		padding: 0.15rem 0.4rem;
	}
}
</style>
