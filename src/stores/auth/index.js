import { defineStore } from "pinia";
import initialState from "./initialState";
import { googleLogin } from "../../http/auth";
import { getCurrentUser } from "../../http/app";

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
			const data = await getCurrentUser();
			this.user = data;
			return data;
		},
		logout() {
			this.token = null;
			this.user = null;
		},
	},
});
