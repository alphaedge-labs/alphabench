<script setup>
import { onBeforeMount } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

const router = useRouter();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

onBeforeMount(async () => {
	if (user.value && user.value.email) {
		router.push("/app");
	}
});

// watch(user, (newUser) => {
// 	if (newUser) {
// 		router.push("/app");
// 	}
// });
</script>

<template>
	<div class="auth-layout">
		<main>
			<router-view />
		</main>
	</div>
</template>
