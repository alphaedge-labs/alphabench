import client from "./client";

export const getLoginUrl = async () => {
	const response = await client.get("/auth/login");
	return response.data;
};

export const getLogoutUrl = async () => {
	const response = await client.get("/auth/logout");
	return response.data;
};

export const googleLogin = async (code, redirectUri) => {
	const response = await client.post("/auth/google", {
		code,
		redirect_uri: redirectUri,
	});
	return response.data;
};

export const getCurrentUser = async () => {
	const response = await client.get("/auth/me");
	return response.data;
};
