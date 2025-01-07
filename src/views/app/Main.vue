<script setup>
import { onMounted } from "vue";

import BacktestForm from "../../components/BacktestForm.vue";
import ProfileDropdown from "../../components/ProfileDropdown.vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";
</script>

<template>
	<div class="main-app">
		<div class="header">
			<ProfileDropdown />
		</div>
		<HamburgerMenu />
		<BacktestForm />
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

@media (max-width: 768px) {
	.main-app {
		padding: 1rem 0.5rem;
	}

	.header {
		right: 1rem;
	}
}

@media (max-width: 480px) {
	.main-app {
		padding: 0.5rem 0.25rem;
	}

	.header {
		top: 0.5rem;
		right: 0.5rem;
	}
}
</style>
