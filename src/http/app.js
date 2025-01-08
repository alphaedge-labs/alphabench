import client from "./client";

export const getCurrentUser = async () => {
	const response = await client.get("/v1/users/me");
	return response.data;
};

export const createBacktest = async (backtestData) => {
	const response = await client.post("/v1/backtests", {
		instrument_symbol: backtestData.asset,
		from_date: backtestData.dateRange.start,
		to_date: backtestData.dateRange.end,
		strategy_description: backtestData.strategy,
	});
	return response.data;
};

export const getBacktests = async () => {
	const response = await client.get("/v1/backtests");
	return response.data;
};

export const getBacktest = async (id) => {
	const response = await client.get(`/v1/backtests/${id}`);
	return response.data;
};

export const getReports = async () => {
	const response = await client.get("/v1/reports");
	return response.data;
};

export const getReport = async (id) => {
	const response = await client.get(`/v1/reports/${id}`);
	return response.data;
};

export const getPlans = async () => {
	const response = await client.get("/v1/subscriptions");
	return response.data;
};

export const getActiveSubscription = async () => {
	const response = await client.get("/v1/subscriptions/active");
	return response.data;
};

export const createSubscription = async (planId, paymentToken) => {
	const response = await client.post("/v1/subscriptions", {
		plan_id: planId,
		payment_token: paymentToken,
	});
	return response.data;
};

export const joinWaitlist = async (email) => {
	const response = await client.post("/v1/waitlist/join", {
		email: email,
	});
	return response.data;
};

export const getPastBacktests = async () => {
	const response = await client.get("/v1/backtests/past");
	return response.data;
};
