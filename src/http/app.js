import client from "./client";

export const createBacktest = async (backtestData) => {
	const response = await client.post("/backtests", {
		instrument_symbol: backtestData.asset,
		from_date: backtestData.dateRange.start,
		to_date: backtestData.dateRange.end,
		strategy_description: backtestData.strategy,
	});
	return response.data;
};

export const getBacktests = async () => {
	const response = await client.get("/backtests");
	return response.data;
};

export const getBacktest = async (id) => {
	const response = await client.get(`/backtests/${id}`);
	return response.data;
};

export const getReports = async () => {
	const response = await client.get("/reports");
	return response.data;
};

export const getReport = async (id) => {
	const response = await client.get(`/reports/${id}`);
	return response.data;
};

export const getPlans = async () => {
	const response = await client.get("/subscriptions");
	return response.data;
};

export const getActiveSubscription = async () => {
	const response = await client.get("/subscriptions/active");
	return response.data;
};

export const createSubscription = async (planId, paymentToken) => {
	const response = await client.post("/subscriptions", {
		plan_id: planId,
		payment_token: paymentToken,
	});
	return response.data;
};
