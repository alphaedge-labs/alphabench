import client from "./client";

export const getLoginUrl = async () => {
	const response = await client.get("/auth/login");
	return response.data;
};

export const getLogoutUrl = async () => {
	const response = await client.get("/auth/logout");
	return response.data;
};
