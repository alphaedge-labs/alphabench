<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import googleIcon from "../../assets/google-icon.svg";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const credentials = ref({
	name: "",
	email: "",
	password: "",
});

const signup = async () => {
	try {
		await authStore.signup(credentials.value);
		const redirectPath = route.query.redirect || "/app";
		router.push(redirectPath);
	} catch (error) {
		// Handle error
	}
};

const signupWithGoogle = async () => {
	try {
		await authStore.initiateGoogleLogin();
	} catch (error) {
		// Handle error
		console.error('Failed to initiate Google signup:', error);
	}
};
</script>

<template>
	<div class="signup-page">
		<div class="signup-container">
			<h1>Signup</h1>
			<p class="subtitle">Use your Google account to continue</p>

			<div class="social-signup">
				<button @click="signupWithGoogle" class="google-signup-btn">
					<img :src="googleIcon" alt="Google" />
					Continue with Google
				</button>
			</div>

			<!-- <div class="divider">
				<span>or</span>
			</div> -->

			<!-- <form @submit.prevent="signup">
				<div class="form-group">
					<label for="email">Name</label>
					<input
						id="name"
						v-model="credentials.name"
						type="text"
						placeholder="Enter your name"
						required
					/>
				</div>
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
				<button type="submit" class="primary-btn">Sign up</button>
			</form> -->

			<p class="signup-link">
				Already have an account?
				<router-link to="/auth/login">Login</router-link>
			</p>
		</div>
	</div>
</template>

<style scoped>
.signup-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.signup-container {
	padding: 2.5rem;
	border-radius: 1rem;
	width: 100%;
	background-color: #f9fafb;
	max-width: 400px;
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

.google-signup-btn {
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

.google-signup-btn img {
	width: 1.25rem;
	height: 1.25rem;
}

.google-signup-btn:hover {
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
	margin-top: 1rem;
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
