import axios from "axios";
import { useAuthStore } from "../stores/auth";
import tracker from "../services/tracker";

const client = axios.create({
	baseURL: import.meta.env.VITE_APP_API_GATEWAY_BASE_URL,
});

client.interceptors.request.use((config) => {
	const authStore = useAuthStore();
	const token = authStore.token;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	config.headers['User-Agent'] = navigator.userAgent;
	config.headers['X-Client-Language'] = navigator.language;
	config.headers['X-Client-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
	
	return config;
});

client.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			tracker.handleError(new Error(`API Error: ${error.response.status} - ${error.response.statusText}`));

			switch (error.response.status) {
				case 401:
					const authStore = useAuthStore();
					authStore.logout();
					break;
				case 429:
					// Handle rate limiting
					break;
			}
		}
		return Promise.reject(error);
	}
);

export default client;
