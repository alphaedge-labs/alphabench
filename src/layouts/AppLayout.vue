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
	try {
		// Only attempt to fetch user if not already present
		if (!user.value) {
			let data = await fetchUser();
			
			// If first attempt fails with 401, try one more time to handle anonymous users
			if (!data) {
				data = await fetchUser();
			}

			if (!data) {
				throw new Error('Failed to fetch user data');
			}
		}

		// These operations can run in parallel once we have the user
		if (user.value) {
			await Promise.all([
				connectWebSocket(user.value.id),
				// Only fetch backtests if array is empty
				backtests.value.length === 0 ? getPastBacktests() : Promise.resolve()
			]);
		}
	} catch (error) {
		console.error('Error in AppLayout setup:', error);
		// Handle error appropriately (e.g., show notification to user)
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