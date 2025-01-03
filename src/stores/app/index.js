import { defineStore } from "pinia";
import initialState from "./intialState";
import { format } from "date-fns";

export const useAppStore = defineStore("app", {
	state: () => initialState,
	actions: {
		pushToBacktestHistory(data) {
			const today = new Date();
			const formattedDate = format(today, "yyyy-MM-dd");

			this.backtestHistory.thisWeek.push({
				...data,
				date: formattedDate,
			});
		},
	},
});
