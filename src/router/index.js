import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Layouts
import DefaultLayout from "../layouts/DefaultLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import AppLayout from "../layouts/AppLayout.vue";

import NotFound from "../views/NotFound.vue";

import { updateMetaTags } from "../utils/metaTags";

// Routes
const routes = [
	{
		path: "/",
		component: DefaultLayout,
		children: [
			{
				path: "",
				name: "home",
				meta: {
					title: "Home | alphabench",
					description:
						"Test your trading strategies in natural language",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
				component: () => import("../views/public/Home.vue"),
			},
			{
				path: "how-to",
				name: "how to use",
				meta: {
					title: "How to use | alphabench",
					description:
						"Learn how to use alphabench to test your trading strategies in natural language",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
				component: () => import("../views/public/HowTo.vue"),
			},
			{
				path: "pricing",
				name: "pricing",
				meta: {
					title: "Pricing | alphabench",
					description: "See the pricing plans for alphabench",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
				component: () => import("../views/public/Pricing.vue"),
			},
			{
				path: "terms",
				name: "terms",
				meta: {
					title: "Terms | alphabench",
					description: "Read the terms of service for alphabench",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
				component: () => import("../views/public/Terms.vue"),
			},
			{
				path: "privacy-policy",
				name: "privacy-policy",
				meta: {
					title: "Privacy Policy | alphabench",
					description: "Read the privacy policy for alphabench",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
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
				meta: {
					title: "Login | alphabench",
					description: "Login to your alphabench account",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
				component: () => import("../views/auth/Login.vue"),
			},
			{
				path: "google/callback",
				name: "google-callback",
				meta: {
					title: "Auth Callback | alphabench",
					description: "Auth callback for alphabench",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
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
				meta: {
					title: "Playground | alphabench",
					description: "Playground for alphabench",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
				component: () => import("../views/app/Main.vue"),
			},
			{
				path: "/results/:id",
				name: "results",
				component: () => import("../views/app/Results.vue"),
				meta: {
					title: "Results | alphabench",
					description: "Results for alphabench",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
			},
			{
				path: "profile",
				name: "profile",
				component: () => import("../views/app/Profile.vue"),
				meta: {
					title: "Profile | alphabench",
					description: "Profile for alphabench",
					keywords:
						"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
				},
			},
			{
				path: "/chat",
				name: "chat",
				component: () => import("../views/app/Chat.vue"),
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

	updateMetaTags(to);

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next({ name: "login", query: { redirect: to.fullPath } });
	} else if (authStore.isAuthenticated && to.path.startsWith("/auth/")) {
		next({ name: "main" });
	} else {
		next();
	}
});

export default router;
