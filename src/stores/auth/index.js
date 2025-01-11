import { defineStore } from "pinia";
import initialState from "./initialState";

import { googleLogin } from "../../http/auth";
import { getCurrentUser } from "../../http/app";

import tracker from "../../services/tracker";

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

			if (data) {
				tracker.setUserID(data.id);
				tracker.setMetadata("email", data.email);
				tracker.setMetadata("name", data.name);
			}

			return data;
		},
		logout() {
			this.token = null;
			this.user = null;

			tracker.stop();
		},
	},
});
