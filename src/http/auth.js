import client from "./client";

export const getLoginUrl = async () => {
	const response = await client.get("/v1/auth/login");
	return response.data;
};

export const getLogoutUrl = async () => {
	const response = await client.get("/v1/auth/logout");
	return response.data;
};

export const googleLogin = async (code, redirectUri) => {
	const response = await client.post("/v1/auth/google", {
		code,
		redirect_uri: redirectUri,
	});
	return response.data;
};
