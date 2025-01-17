<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useAppStore } from "../stores/app";
import { connectWebSocket } from "../ws/client";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { fetchUser } = authStore;

const appStore = useAppStore();
const { getPastBacktests } = appStore;

const { user } = storeToRefs(authStore);
const { backtests } = storeToRefs(appStore);

onMounted(async () => {
	if (!user.value) {
		let data = await fetchUser();

		if (!data) {
			data = await fetchUser();
		}
	}

	if (user.value) {
		connectWebSocket(user.value.id);
	}

	if (user.value && !backtests.value.length) {
		await getPastBacktests();
	}
});
</script>

<template>
	<div class="app-layout">
		<nav>
			<!-- Add your app navigation here -->
		</nav>
		<main>
			<router-view />
		</main>
	</div>
</template>
