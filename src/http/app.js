import client from "./client";

export const getApp = async () => {
	const response = await client.get("/app");
	return response.data;
};
