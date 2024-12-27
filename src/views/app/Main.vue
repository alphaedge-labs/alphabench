<script setup>
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
	padding: 2rem;
	width: 100%;
}

.header {
	position: absolute;
	top: 1rem;
	right: 2rem;
}
</style>
