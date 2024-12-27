import { defineStore } from "pinia";
import initialState from "./intialState";

export const useAppStore = defineStore("app", {
	state: () => initialState,
});
