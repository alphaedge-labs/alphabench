import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Layouts
import DefaultLayout from "../layouts/DefaultLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import AppLayout from "../layouts/AppLayout.vue";

import NotFound from "../views/NotFound.vue";

// Routes
const routes = [
	{
		path: "/",
		component: DefaultLayout,
		children: [
			{
				path: "",
				name: "home",
				meta: { title: "Home | alphabench" },
				component: () => import("../views/public/Home.vue"),
			},
			{
				path: "howto",
				name: "how to use",
				meta: { title: "How to use | alphabench" },
				component: () => import("../views/public/HowTo.vue"),
			},
			{
				path: "pricing",
				name: "pricing",
				meta: { title: "Pricing | alphabench" },
				component: () => import("../views/public/Pricing.vue"),
			},
			{
				path: "terms",
				name: "terms",
				meta: { title: "Terms | alphabench" },
				component: () => import("../views/public/Terms.vue"),
			},
			{
				path: "privacy-policy",
				name: "privacy-policy",
				meta: { title: "Privacy Policy | alphabench" },
				component: () => import("../views/public/PrivacyPolicy.vue"),
			},
		],
	},
	{
		path: "/auth",
		component: AuthLayout,
		children: [
			{
				path: "login",
				name: "login",
				meta: { title: "Login | alphabench" },
				component: () => import("../views/auth/Login.vue"),
			},
			{
				path: "signup",
				name: "signup",
				meta: { title: "Signup | alphabench" },
				component: () => import("../views/auth/Signup.vue"),
			},
			{
				path: "google/callback",
				name: "google-callback",
				meta: { title: "Auth Callback | alphabench" },
				component: () => import("../views/auth/GoogleCallback.vue"),
			},
		],
	},
	{
		path: "/app",
		component: AppLayout,
		children: [
			{
				path: "",
				name: "main",
				meta: { title: "Playground | alphabench" },
				component: () => import("../views/app/Main.vue")
			},
			{
				path: "results/:id",
				name: "results",
				component: () => import("../views/app/Results.vue"),
				meta: { title: "Results | alphabench" }
			},
			{
				path: "profile",
				name: "profile",
				component: () => import("../views/app/Profile.vue")
			},
			{
				path: "search",
				name: "search",
				component: () => import("../views/app/ProSearch.vue")
			},
			// Add more protected routes here
		],
	},
	{
		path: "/404",
		name: "Error 404",
		meta: { title: "Error 404 | alphabench" },
		component: NotFound,
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: "/404",
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();

	// Set document title from route meta first
	document.title = to.meta.title || import.meta.env.VITE_APP_DEFAULT_TITLE;

	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next({ name: "login", query: { redirect: to.fullPath } });
	} else if (authStore.isAuthenticated && to.path.startsWith("/auth/")) {
		next({ name: "main" });
	} else {
		next();
	}
});

export default router;
