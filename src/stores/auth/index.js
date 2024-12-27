import { defineStore } from "pinia";
import initialState from "./initialState";

export const useAuthStore = defineStore("auth", {
	state: () => initialState,
	persist: true,
	getters: {
		isAuthenticated: (state) => !!state.token,
	},
	actions: {
		login(credentials) {
			// Implement login logic
			this.token = "dummy-token"; // Replace with actual token
		},
		logout() {
			this.token = null;
		},
		signup(userData) {
			// Implement signup logic
		},
	},
});
