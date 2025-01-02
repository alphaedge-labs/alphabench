import { defineStore } from "pinia";
import initialState from "./initialState";
import { googleLogin, getCurrentUser } from "../../http/auth";

export const useAuthStore = defineStore("auth", {
	state: () => initialState,
	persist: true,
	getters: {
		isAuthenticated: (state) => !!state.token,
		isAnonymous: (state) => state.user?.is_anonymous ?? true,
	},
	actions: {
		async loginWithGoogle(code, redirectUri) {
			const data = await googleLogin(code, redirectUri);
			this.token = data.access_token;
			await this.fetchUser();
		},
		async fetchUser() {
			this.user = await getCurrentUser();
		},
		logout() {
			this.token = null;
			this.user = null;
		},
	},
});
