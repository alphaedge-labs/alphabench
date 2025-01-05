<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

import pencilIcon from "../assets/write-pencil.svg";
import userIconDefault from "../assets/user_default.jpg";
import UpgradeModal from "./UpgradeModal.vue";

const route = useRoute();
const isOpen = ref(false);
const showUpgradeModal = ref(false);

// Dummy user data (replace with your actual user data)
const user = {
	name: "John Doe",
	plan: "Pro Plan",
};

const handleLogout = () => {
	// Implement logout logic
	console.log("Logging out...");
};
</script>

<template>
	<div class="profile-section">
		<router-link
			v-if="route.path !== '/app'"
			to="/app"
			class="app-icon"
			title="Go to App"
		>
			<img :src="pencilIcon" alt="Google" />
		</router-link>

		<div class="profile-dropdown">
			<button class="profile-icon" @click="isOpen = !isOpen" disabled>
				<img :src="userIconDefault" alt="Profile" />
			</button>

			<div v-if="isOpen" class="dropdown-menu">
				<div class="user-info">
					<h4>{{ user.name }}</h4>
					<span class="plan-badge">{{ user.plan }}</span>
				</div>
				<div class="dropdown-divider"></div>
				<router-link to="/app/profile" class="dropdown-item">
					<span>Your Profile</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon"
						viewBox="0 0 24 24"
					>
						<path
							d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0-8a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm9 17v-2a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v2h2v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2z"
						/>
					</svg>
				</router-link>
				<a
					href="#"
					class="dropdown-item"
					@click="showUpgradeModal = true"
				>
					<span>Change Plan</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon"
						viewBox="0 0 24 24"
					>
						<path
							d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2 0H3V6h14v8zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm13 0v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"
						/>
					</svg>
				</a>
				<div class="dropdown-divider"></div>
				<a href="#" class="dropdown-item logout" @click="handleLogout">
					<span>Logout</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon"
						viewBox="0 0 24 24"
					>
						<path
							d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
						/>
					</svg>
				</a>
			</div>
		</div>

		<UpgradeModal
			:show="showUpgradeModal"
			@close="showUpgradeModal = false"
		/>
	</div>
</template>

<style scoped>
.profile-section {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	position: fixed;
	right: 2rem;
	top: 1rem;
	z-index: 1000;
}

.app-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6366f1;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-icon:hover {
	color: #4f46e5;
	transform: scale(1.05);
}

.profile-dropdown {
	position: relative;
}

.profile-icon {
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 9999px;
	border: 2px solid #e5e7eb;
	cursor: pointer;
	padding: 0;
	overflow: hidden;
	background: none;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-icon:hover {
	border-color: #6366f1;
	transform: scale(1.05);
}

.profile-icon img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.dropdown-menu {
	position: absolute;
	top: calc(100% + 0.75rem);
	right: 0;
	background: white;
	border-radius: 1rem;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05);
	width: 16rem;
	z-index: 50;
	border: 1px solid #e5e7eb;
	backdrop-filter: blur(8px);
	animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateY(-0.5rem);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.user-info {
	padding: 1.25rem;
	text-align: left;
}

.user-info h4 {
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 0.5rem 0;
}

.plan-badge {
	background: linear-gradient(45deg, #111111, #535bf2);
	padding: 0.375rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.875rem;
	color: white;
	font-weight: 500;
}

.dropdown-divider {
	border-top: 1px solid #e5e7eb;
	margin: 0;
}

.dropdown-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.875rem 1.25rem;
	color: #4b5563;
	text-decoration: none;
	font-size: 0.875rem;
	transition: all 0.2s ease;
}

.dropdown-item:hover {
	background: #f9fafb;
	color: #111827;
}

.dropdown-item .icon {
	width: 1.25rem;
	height: 1.25rem;
	opacity: 0.7;
}

.dropdown-item:hover .icon {
	opacity: 1;
}

.logout {
	color: #ef4444;
}

.logout:hover {
	background: #fef2f2;
	color: #dc2626;
}
</style>
