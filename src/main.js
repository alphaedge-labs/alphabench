import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VCalendar from "v-calendar";
import VueGtag from "vue-gtag";

import router from "./router";

import "./style.css";
import "v-calendar/style.css";

import App from "./App.vue";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(
	VueGtag,
	{
		config: { id: import.meta.env.VITE_APP_GOOGLE_MEASUREMENT_ID },
	},
	router
);

app.use(pinia);
app.use(VCalendar, {});
app.use(router);
app.mount("#app");
