import { defineStore } from "pinia";
import { format } from "date-fns";

import initialState from "./initialState";

import { googleLogin } from "../../http/auth";
import { getCurrentUser } from "../../http/app";

import tracker from "../../services/tracker";

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

export const useAuthStore = defineStore("auth", {
	state: () => initialState,
	persist: true,
	getters: {
		isAuthenticated: (state) => !!state.token,
		isAnonymous: (state) => state.user?.is_anonymous ?? true,
	},
	actions: {
		async initiateGoogleLogin() {
			try {
				// Generate a random state value
				const state = Math.random().toString(36).substring(7);
				localStorage.setItem('oauth_state', state);
				
				// Construct Google OAuth URL
				const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
				googleAuthUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
				googleAuthUrl.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
				googleAuthUrl.searchParams.append('response_type', 'code');
				googleAuthUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid');
				googleAuthUrl.searchParams.append('state', state);
				
				// Redirect to Google login
				window.location.href = googleAuthUrl.toString();
			} catch (err) {
				console.error('Failed to initiate Google login:', err);
				throw err;
			}
		},
		async loginWithGoogle(code, redirectUri) {
			try {
				const data = await googleLogin(code, redirectUri);
				this.token = data.access_token;
				await this.fetchUser();
			} catch (err) {
				console.error('Google login failed:', err);
				throw err;
			}
		},
		async fetchUser() {
			try {
			  const data = await getCurrentUser();
	  
			  if (data) {
				this.user = data;

				this.user.joinDate = format(new Date(data.created_at), 'dd MMM yyyy');

				tracker.setUserID(data.id);
				tracker.setMetadata("email", data.email);
				tracker.setMetadata("name", data.name);
			  
				return data;
			  }
			} catch (err) {
			  // Don't throw error for 401 (unauthorized)
			  if (err.response?.status !== 401) {
				console.error('Failed to fetch user:', err);
				throw err;
			  }
			  return null;
			}
		},
		logout() {
			this.token = null;
			this.user = null;

			tracker.stop();
		},
	},
});
