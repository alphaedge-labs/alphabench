<template>
	<div class="chat-outer-container">
		<div v-if="error" class="error-container">
			<p class="error-message">{{ error }}</p>
			<button @click="handleError" class="error-action">
				Start New Conversation
			</button>
		</div>
		
		<template v-else>
			<div class="chat-container" ref="chatContainer">
				<div class="messages-container">
					<div
						v-for="message in messages"
						:key="message.id"
						class="message"
						:class="message.role"
						:style="{
							animation:
								message.role === 'assistant'
									? 'fadeIn 0.5s ease'
									: 'fadeIn 0.5s ease',
						}"
					>
						<div
							class="message-avatar"
							v-if="message.role === 'assistant'"
						>
							<img
								:src="alphabenchLogo"
								width="24"
								height="24"
								alt="Alphabench Logo"
							/>
						</div>
						<div class="message-content-wrapper">
							<div class="message-content">
								<template v-if="message.type === 'backtest'">
									<BacktestResults :data="message.data" />
								</template>
								<template v-else-if="message.type === 'loading'">
									<div class="loading-message">Processing...</div>
								</template>
								<template v-else>
                                    <!--<TextGenerateEffect 
                                        v-if="message.role === 'assistant'"
                                        :text="message.content"
                                        :duration="0.5"
                                    />
                                    <div v-else>
                                        {{ message.content }}
                                    </div>-->
                                    <div class="message-content-text">
                                        {{ message.content }}
                                    </div>
                                </template>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="!error" class="chat-input-container">
				<div class="input-wrapper">
					<textarea
						class="chat-input"
						v-model="userInput"
						placeholder="Message alphabench"
						@input="adjustTextareaHeight"
						@keydown.enter.prevent="handleSubmit"
						ref="textarea"
						rows="1"
					></textarea>
					<button
						class="send-button"
						@click="handleSubmit"
						:disabled="!userInput.trim()"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="22" y1="2" x2="11" y2="13"></line>
							<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
						</svg>
					</button>
				</div>
				<div class="disclaimer">
					alphabench can make mistakes. Please check important info.
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import alphabenchLogo from "../assets/alphabench-chat.svg";
import BacktestResults from "./BacktestResults.vue";
import TextGenerateEffect from "./TextGenerateEffect.vue";

const route = useRoute();
const router = useRouter();
const chatContainer = ref(null);
const textarea = ref(null);
const userInput = ref("");
const messages = ref([]);
const error = ref(null);
const isLoading = ref(true);

const mockMessages = [
	{
		id: 1,
		role: "user",
		type: "text",
		content: "Backtest some RELIANCE:NSE for past 3 months with a stoploss of 5% and a target of 10% on 1 minute timeframe"
	},
	{
		id: 3,
		role: "assistant",
		type: "loading",
		content: "Processing..."
	}
];

const mockWebSocketMessages = [
	{
		id: 3,
		role: "assistant",
		type: "text",
		content: "Based on my analysis, this is the backtest results for the tech stocks with high growth potential"
	},
	{
		id: 4,
		role: "assistant",
		type: "backtest",
		content: "",
		data: {
			results: [
				{
					Date: "2024-01-01",
					Open: 100,
					High: 105,
					Low: 95,
					Close: 102,
				},
				{
					Date: "2024-01-02",
					Open: 101,
					High: 106,
					Low: 96,
					Close: 103,
				},
			],
			metrics: {
				"Total Return": 10,
				"Max Drawdown": 5,
				"Win Rate": 60,
				"Profit Factor": 1.5,
				"Sharpe Ratio": 0.8,
				"Max Drawdown": 5,
				"Win Rate": 60,
			},
		},
	},
];

const loadConversation = async (conversationId) => {
	try {
        // const response = await fetch(`/api/conversations/${conversationId}`);
        // if (!response.ok) throw new Error('Failed to load conversation');
        // const data = await response.json();
        // messages.value = data.messages;


        // remove everything below here
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// Simulate API error 10% of the time
		if (Math.random() < 0.1) {
			throw new Error('Failed to load conversation');
		}
		
		messages.value = mockMessages;
	} catch (err) {
		error.value = err.message;
	} finally {
		isLoading.value = false;
	}
};

const setupWebSocket = (conversationId) => {
	/* 
        const ws = new WebSocket(`${import.meta.env.VITE_APP_WEBSOCKET_BASE_URL}/
        conversations/${conversationId}`);
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const messageIndex = messages.value.findIndex(m => m.id === data.id);
            
            if (messageIndex !== -1) {
                messages.value[messageIndex] = data;
            } else {
                messages.value.push(data);
            }
            scrollToBottom();
        };

        return ws;
    */

    // Simulate WebSocket messages
	const mockWs = {
		close: () => console.log('Mock WebSocket closed')
	};
	
	// Simulate incoming messages with delays
	mockWebSocketMessages.forEach((msg, index) => {
		setTimeout(() => {
			const messageIndex = messages.value.findIndex(m => m.id === msg.id);
			
			if (messageIndex !== -1) {
				messages.value[messageIndex] = msg;
			} else {
				messages.value.push(msg);
			}
			scrollToBottom();
		}, (index + 1) * 2000); // Send a new message every 2 seconds
	});
	
	return mockWs;
};

onMounted(async () => {
	if (route.params.conversationId) {
		await loadConversation(route.params.conversationId);
		const ws = setupWebSocket(route.params.conversationId);
		
		onUnmounted(() => {
			ws.close();
		});
	}
});

const handleError = () => {
	router.push('/chat');
};

const adjustTextareaHeight = () => {
	const element = textarea.value;
	if (!element) return;

	element.style.height = "auto";
	element.style.height = Math.min(element.scrollHeight, 200) + "px";
};

const scrollToBottom = async () => {
	await nextTick();
	if (chatContainer.value) {
		chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
	}
};

const handleSubmit = () => {
	if (!userInput.value.trim()) return;

	// Add user message
	//  messages.value.push({
    const userMessage = {
		id: Date.now(),
		role: "user",
		type: "text",
		content: userInput.value,
	};
	messages.value.push(userMessage);

	// Clear input
	userInput.value = "";
	adjustTextareaHeight();

	/*
    setTimeout(() => {
        messages.value.push({
            id: Date.now(),
            role: "assistant",
            type: "loading",
            content: "Processing...",
        });
    }, 4000);

    // Scroll to bottom
    scrollToBottom();
    */
    
    // Add loading message
	const loadingMessage = {
		id: Date.now() + 1,
		role: "assistant",
		type: "loading",
		content: "Processing...",
	};
	
	setTimeout(() => {
		messages.value.push(loadingMessage);
		scrollToBottom();
	}, 500);

	// Simulate assistant response
	setTimeout(() => {
        /*
        messages.value.push({
            id: Date.now(),
        */
		const assistantMessage = {
			id: loadingMessage.id,
			role: "assistant",
			type: "text",
			content: ["Here's a simulated response to your query. In a real implementation, this would be replaced with actual API responses.", "Here are the results of the backtest:", "What do you think about this?", "Here are some other stocks you might consider: TECH1, TECH2, TECH3", "What do you think about this?"][Math.floor(Math.random() * 5)],
		};
		
		const messageIndex = messages.value.findIndex(m => m.id === loadingMessage.id);
		if (messageIndex !== -1) {
			messages.value[messageIndex] = assistantMessage;
		}
		
		scrollToBottom();
	}, 3000);
};
</script>

<style scoped>
.chat-outer-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 600px;
	margin: 0 auto;
	padding: 0 1rem;
	box-sizing: border-box;
}

@media (max-width: 500px) {
	.chat-outer-container {
		width: 100%;
	}
}

/* Main chat container (scrollable) */
.chat-container {
	flex: 1;
	overflow-y: auto;
	margin-top: 1rem;
	padding: 1rem 0;
	scroll-behavior: smooth;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

/* Messages container: vertical list of messages */
.messages-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* Message bubble */
.message {
	display: flex;
	gap: 0.75rem;
	align-items: flex-start;
	border-radius: 0.75rem;
	padding: 0.5rem 1rem;
	max-width: 85%;
	animation: fadeIn 0.5s ease;
	animation-fill-mode: forwards;
	text-align: left;
}

/* Assistant messages: distinct background */
.message.assistant {
	background-color: #ffffff;
	margin-right: auto;
}

/* User messages: a different color with alignment to the right */
.message.user {
	background-color: #535bf222;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin-left: auto;
}

/* Avatar styling for assistant messages */
.message-avatar {
	width: 30px;
	height: 30px;
	flex-shrink: 0;
	border-radius: 50%;
	overflow: hidden;
	background-color: #f3f4f6;
	display: flex;
	align-items: center;
	justify-content: center;
}

.message-avatar img {
	width: 30px;
	height: 30px;
	object-fit: contain;
}

/* Content wrapper for the text and actions */
.message-content-wrapper {
	flex: 1;
}

/* Actual text content of the message */
.message-content {
	color: #374151;
	font-size: 0.9rem;
	line-height: 1.4;
}

.message-content-text {
	font-size: 0.9rem;
	line-height: 1.4;
}

/* Action buttons that appear under assistant messages */
.message-actions {
	display: flex;
	gap: 0.5rem;
	margin-top: 0.5rem;
}

/* Individual action buttons under messages */
.action-button {
	padding: 0.25rem;
	background: transparent;
	border: none;
	color: #6b7280;
	cursor: pointer;
	border-radius: 0.25rem;
	transition: background-color 0.2s ease, color 0.2s ease;
}

.action-button:hover {
	background: #e5e7eb;
	color: #374151;
}

/* Input area container */
.chat-input-container {
	padding: 1rem 0 1.25rem;
	max-width: 1000px;
	margin: 0 auto;
	width: 100%;
	align-self: left;
}

/* Wrapper to hold the text area and possible action buttons */
.input-wrapper {
	position: relative;
	background: #ffffff;
	padding: 0.25rem 0.75rem;
	border-radius: 1rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.input-wrapper:focus-within {
	box-shadow: 0 2px 8px #535bf255;
	transition: box-shadow 0.5s ease;
	cursor: pointer;
}

/* The text input area */
.chat-input {
	width: 100%;
	resize: none;
	border: none;
	outline: none;
	font-size: 0.95rem;
	line-height: 1.4;
	color: #374151;
	padding: 0.5rem 0.75rem;
	border-radius: 0.5rem;
	box-sizing: border-box;
	font-family: "Inter", sans-serif;
	min-height: 44px;
	max-height: 200px;
	overflow-y: hidden;
}

/* Send button in the corner of the input */
.send-button {
	flex-shrink: 0;
	color: #535bf2;
	border: none;
	padding: 0.45rem 0.7rem;
	border-radius: 0.4rem;
	background-color: #ffffff;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.send-button:disabled {
	color: #9ca3af;
	cursor: not-allowed;
}

.send-button:hover:not(:disabled) {
	color: #535bf2;
}

/* Disclaimer text under the chat input */
.disclaimer {
	text-align: center;
	color: #6b7280;
	font-size: 0.75rem;
	margin-top: 0.5rem;
}

/* Custom scrollbar styling */
.chat-container::-webkit-scrollbar {
	width: 8px;
}

.chat-container::-webkit-scrollbar-track {
	background: transparent;
}

.chat-container::-webkit-scrollbar-thumb {
	background-color: #d1d5db;
	border-radius: 4px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
	background-color: #9ca3af;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
	.chat-outer-container {
		max-width: 100%;
		padding: 0 0.5rem;
	}

	.message {
		max-width: 95%;
	}
}

/* Loading message animation */
.loading-message {
	background: linear-gradient(
		90deg,
		rgba(83, 91, 242, 0.2) 0%,
		rgba(83, 91, 242, 0.8) 50%,
		rgba(83, 91, 242, 0.2) 100%
	);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-size: 200% 100%;
	animation: wave 2s linear infinite;
	padding: 0.25rem 0.5rem 0.25rem 0;
	font-weight: 500;
	border-radius: 0.25rem;
}

@keyframes wave {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}

.error-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	text-align: center;
	gap: 1rem;
}

.error-message {
	color: #ef4444;
	font-size: 0.875rem;
}

.error-action {
	padding: 0.5rem 1rem;
	background: #535bf2;
	color: white;
	border: none;
	border-radius: 0.5rem;
	cursor: pointer;
	font-size: 0.875rem;
	transition: background-color 0.2s;
}

.error-action:hover {
	background: #4347d9;
}
</style>
