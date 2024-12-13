import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
	id: string;
	email: string;
	// Add other user properties as needed
}

interface AuthState {
	user: User | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	isLoading: false,
	error: null,
};

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
	const response = await fetch("/api/auth/check");
	if (!response.ok) {
		throw new Error("Authentication check failed");
	}
	return response.json();
});

export const login = createAsyncThunk(
	"auth/login",
	async (credentials: { email: string; password: string }) => {
		const response = await fetch("/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(credentials),
		});
		if (!response.ok) {
			throw new Error("Login failed");
		}
		return response.json();
	}
);

export const logout = createAsyncThunk("auth/logout", async () => {
	const response = await fetch("/api/logout", { method: "POST" });
	if (!response.ok) {
		throw new Error("Logout failed");
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(checkAuth.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				checkAuth.fulfilled,
				(state, action: PayloadAction<User>) => {
					state.isLoading = false;
					state.user = action.payload;
					state.error = null;
				}
			)
			.addCase(checkAuth.rejected, (state, action) => {
				state.isLoading = false;
				state.user = null;
				state.error =
					action.error.message || "Authentication check failed";
			})
			.addCase(login.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
				state.isLoading = false;
				state.user = action.payload;
				state.error = null;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || "Login failed";
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
				state.error = null;
			});
	},
});

export default authSlice.reducer;
