// src/ws/client.js
import { ref } from "vue";
import { useAppStore } from "../stores/app";
// import { generateTrade } from './mock-updates'

const socket = ref(null);

function connectWebSocket(userId) {
	if (socket.value) {
		return;
	}

	const appStore = useAppStore();
	const { toggleWsConnectionState, updateBacktest } = appStore;

	const websocketUrl = `${
		import.meta.env.VITE_APP_WEBSOCKET_BASE_URL
	}?user_id=${userId}`;
	socket.value = new WebSocket(websocketUrl);

	socket.value.onopen = () => {
		console.log("WebSocket connection opened");
		toggleWsConnectionState(true);
	};

	socket.value.onmessage = (event) => {
		const eventData = JSON.parse(event.data);

		switch (eventData.event) {
			case "backtest.update":
				updateBacktest(eventData.data);
				break;
		}
	};

	socket.value.onclose = () => {
		console.log("WebSocket connection closed");
		toggleWsConnectionState(false);
	};

	socket.value.onerror = (error) => {
		console.error("WebSocket error:", error);
	};

	// TODO: remove this, this is for testing trades
	// setInterval(() => {
	//   let trade = generateTrade()
	//   addTrade(trade)
	// }, 2000)
}

function disconnectWebSocket() {
	if (!socket.value) {
		return;
	}

	socket.value.close();
}

export { connectWebSocket, disconnectWebSocket };
