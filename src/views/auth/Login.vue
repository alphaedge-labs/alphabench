<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import googleIcon from "../../assets/google-icon.svg";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const credentials = ref({
	email: "",
	password: "",
});

const login = async () => {
	try {
		await authStore.login(credentials.value);
		const redirectPath = route.query.redirect || "/app";
		router.push(redirectPath);
	} catch (error) {
		// Handle error
	}
};

const loginWithGoogle = async () => {
	try {
		await authStore.initiateGoogleLogin();
	} catch (error) {
		// Handle error
		console.error('Failed to initiate Google login:', error);
	}
};
</script>

<template>
	<div class="login-page">
		<div class="login-container">
			<h1>Login</h1>
			<p class="subtitle">Use your Google account to continue</p>

			<div class="social-login">
				<button @click="loginWithGoogle" class="google-login-btn">
					<img :src="googleIcon" alt="Google" />
					Continue with Google
				</button>
			</div>

			<!-- <div class="divider">
				<span>or</span>
			</div> -->

			<!--<form @submit.prevent="login">
				<div class="form-group">
					<label for="email">Email</label>
					<input
						id="email"
						v-model="credentials.email"
						type="email"
						placeholder="Enter your email"
						required
					/>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input
						id="password"
						v-model="credentials.password"
						type="password"
						placeholder="••••••••"
						required
					/>
				</div>
				<button type="submit" class="primary-btn">Sign in</button>
			</form> -->

			<p class="signup-link">
				Don't have an account?
				<router-link to="/auth/signup">Sign up</router-link>
			</p>
		</div>
	</div>
</template>

<style scoped>
.login-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.login-container {
	padding: 2.5rem;
	border-radius: 1rem;
	width: 100%;
	max-width: 400px;
	background-color: #f9fafb;
}

h1 {
	font-size: 1.875rem;
	font-weight: 700;
	color: #111827;
	margin-bottom: 0.5rem;
}

.subtitle {
	color: #6b7280;
	margin-bottom: 2rem;
}

.form-group {
	margin-bottom: 1.5rem;
}

label {
	display: block;
	text-align: left;
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
	margin-bottom: 0.5rem;
}

input {
	padding: 0.75rem 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	font-size: 1rem;
	transition: all 0.3s ease;
}

input:focus {
	outline: none;
	border-color: #535bf2;
	box-shadow: 0 0 0 3px rgba(83, 91, 242, 0.1);
}

.primary-btn {
	width: 100%;
	padding: 0.75rem 1.5rem;
	background: linear-gradient(45deg, #111111, #535bf2);
	color: white;
	border: none;
	border-radius: 0.5rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.primary-btn:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.google-login-btn {
	width: 100%;
	padding: 0.75rem 1.5rem;
	background-color: white;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	color: #374151;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	margin: 1rem 0;
}

.google-login-btn img {
	width: 1.25rem;
	height: 1.25rem;
}

.google-login-btn:hover {
	background-color: #f9fafb;
	transform: translateY(-1px);
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.divider {
	position: relative;
	text-align: center;
	margin: 1.5rem 0;
}

.divider::before {
	content: "";
	position: absolute;
	left: 0;
	top: 50%;
	width: 100%;
	height: 1px;
	background-color: #e5e7eb;
}

.divider span {
	position: relative;
	padding: 0 0.75rem;
	color: #6b7280;
	font-size: 0.875rem;
	background-color: #f9fafb;
}

.signup-link {
	margin-top: 1.5rem;
	text-align: center;
	font-size: 0.875rem;
	color: #6b7280;
	margin-top: 1rem
}

.signup-link a {
	color: #535bf2;
	font-weight: 500;
	text-decoration: none;
}

.signup-link a:hover {
	text-decoration: underline;
}
</style>
