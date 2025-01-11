import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VCalendar from "v-calendar";
import VueGtag from "vue-gtag";

import router from "./router";

import "./style.css";
import "v-calendar/style.css";

import App from "./App.vue";
import tracker from "./services/tracker";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

if (!import.meta.env.DEV) {
	tracker.start();
}

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  // Log errors to OpenReplay
  tracker.handleError(err);
//   console.error('Vue Error:', err, info);
};

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
