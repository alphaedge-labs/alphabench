<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { connectWebSocket } from "../ws/client";

const authStore = useAuthStore();
const { fetchUser } = authStore;

onMounted(async () => {
	const user = await fetchUser();
	if (user) {
		connectWebSocket(user.id);
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
