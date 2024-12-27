import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const client = axios.create({
	baseURL: import.meta.env.VITE_APP_API_GATEWAY_BASE_URL,
});

client.interceptors.request.use((config) => {
	const authStore = useAuthStore();
	const token = authStore.token;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default client;
