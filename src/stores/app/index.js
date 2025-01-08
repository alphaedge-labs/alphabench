import { defineStore } from "pinia";
import initialState from "./intialState";
import { format } from "date-fns";
import { getBacktest, getPastBacktests } from "../../http/app";

export const useAppStore = defineStore("app", {
	persist: true,
	state: () => initialState,
	actions: {
		toggleWsConnectionState(connected) {
			this.wsConnected = connected;
		},
		pushToBacktestHistory(data) {
			const today = new Date();
			const formattedDate = format(today, "yyyy-MM-dd");

			this.backtestHistory = {
                ...this.backtestHistory,
                thisWeek: [
                    {
                        ...data,
                        date: formattedDate,
                    },
                    ...(this.backtestHistory?.thisWeek || [])
				]
			};
		},
		async getBacktestById(id) {
			const data = await getBacktest(id);
			this.backtest = data;
			return data;
		},
		updateBacktest(data) {
			if (this.backtest && this.backtest.id === data.id) {
				this.backtest = {
					...this.backtest,
					...data,
				};
			}
		},
		async getPastBacktests() {
			const data = await getPastBacktests();
			this.backtestHistory = data;
			return data;
		},
	},
});
