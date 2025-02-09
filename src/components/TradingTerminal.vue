<template>
  <!-- Add broker connection view -->
  <div v-if="!hasBroker" class="trading-terminal">
    <div v-if="showZerodhaForm" class="broker-header">
      <h2>Add broker keys</h2>
      <button class="close-btn" @click="showZerodhaForm = false; connectionError = ''">
        <span>×</span>
      </button>
    </div>
    <div class="broker-list">
      <div v-if="!showZerodhaForm" class="broker-item">
        <button class="broker-button" @click="showZerodhaForm = true">
          Connect Zerodha Account
        </button>
      </div>

      <!-- Zerodha connection form -->
      <div v-else class="broker-form">
        <div class="form-field">
          <label>API Key</label>
          <input type="text" v-model="zerodhaCredentials.apiKey" />
        </div>
        
        <div class="form-field">
          <label>API Secret</label>
          <input type="password" v-model="zerodhaCredentials.apiSecret" />
        </div>

        <div v-if="connectionError" class="error-message">
          {{ connectionError }}
        </div>
        
        <button 
          class="submit-button" 
          @click="connectZerodha"
          :disabled="isConnecting"
        >
          <span v-if="isConnecting" class="spinner"></span>
          <span v-else>Submit</span>
        </button>

        <!-- Show postback URL after successful connection -->
        <div v-if="postbackUrl" class="postback-info">
          <p>Please copy this URL and paste it in your Zerodha account's Postback URL field:</p>
          <div class="postback-url">{{ postbackUrl }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Existing trading terminal code -->
  <div v-else class="trading-terminal" :class="{ collapsed: isCollapsed }">
    <!-- Terminal Header -->
    <div class="terminal-header" @click="toggleCollapse">
      <template v-if="isCollapsed">
        <span>Place order for {{ symbol }} at {{ priceDisplay }}</span>
      </template>
      <template v-else>
        <span class="terminal-header-text">Trading Terminal</span>
        <button class="collapse-btn">−</button>
      </template>
    </div>

    <!-- Terminal Content -->
    <transition name="fade">
      <div v-if="!isCollapsed" class="terminal-content">
        <div class="grid-container">
          <div class="field">
            <label>Symbol</label>
            <div class="value">{{ symbol }}</div>
          </div>
          <div class="field">
            <label>Quantity</label>
            <input 
              type="number" 
              :value="quantity" 
              @input="handleQuantityChange" 
              :disabled="orderStatus || isPositionActive" />
          </div>
          <div class="field">
            <label>Order Type</label>
            <div class="value">LIMIT</div>
          </div>
          <div class="field">
            <label>Price</label>
            <div class="value">{{ priceDisplay }}</div>
          </div>
          <div class="field">
            <label>Stoploss (%)</label>
            <input 
              type="number" 
              v-model.number="stoploss" 
              min="1"
              :disabled="orderStatus || isPositionActive" />
          </div>
          <div class="field">
            <label>Target (%)</label>
            <input 
              type="number" 
              v-model.number="target" 
              min="3"
              :disabled="orderStatus || isPositionActive" />
          </div>
        </div>

        <!-- Status Section -->
        <div v-if="orderStatus" class="status-container">
          <div class="status">
            <span class="status-text">Status: <strong>{{ orderStatus.toUpperCase() }}</strong></span>
            <span v-if="isPositionActive" class="pnl" :class="{ positive: currentPnL > 0, negative: currentPnL < 0 }">
              P&L: {{ currentPnL > 0 ? '+' : '' }}{{ currentPnL }}
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <button class="action-button" @click="handleAction">
          {{ actionText }}
        </button>
      </div>
    </transition>
  </div>

  <!-- Move modal outside the trading terminal container -->
  <teleport to="body">
    <transition name="fade">
      <div v-if="showExitWarning" class="modal">
        <div class="modal-content">
          <h3>Warning</h3>
          <p>
            You have an active position. Closing this terminal will not close your position.
            Please exit your position if you wish to stop monitoring.
          </p>
          <div class="modal-actions">
            <button @click="showExitWarning = false">Stay</button>
            <button @click="confirmClose">Close Terminal</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';

// Define props with default values for mock testing
const props = defineProps({
  symbol: {
    type: String,
    default: 'AAPL'
  },
  price: {
    type: Number,
    default: 150.00
  }
});

const symbol = props.symbol;
const price = props.price;
const priceDisplay = computed(() => `$${price.toFixed(2)}`);

const isCollapsed = ref(true);
const quantity = ref(1);
const stoploss = ref(1);
const target = ref(3);
const orderStatus = ref(null); // null, pending, active
const currentPnL = ref(0);
const showExitWarning = ref(false);

const isPositionActive = computed(() => orderStatus.value === 'active');
const isPending = computed(() => orderStatus.value === 'pending');

// Compute the action button text based on order status
const actionText = computed(() => {
  if (isPositionActive.value) return 'Exit Position';
  if (isPending.value) return 'Cancel Order';
  return 'Place Order';
});

// Timer IDs for simulating order and PnL updates
let pendingTimeout = null;
let pnlInterval = null;

// Toggle collapse: if trying to collapse while order is live, show a warning modal
const toggleCollapse = () => {
  if (!isCollapsed.value && orderStatus.value) {
    showExitWarning.value = true;
    return;
  }
  isCollapsed.value = !isCollapsed.value;
};

// Ensure quantity is at least 1
const handleQuantityChange = (event) => {
  const value = parseInt(event.target.value);
  quantity.value = isNaN(value) ? 1 : Math.max(1, value);
};

// Simulate live P&L updates via a mock WebSocket connection
const startPnLUpdates = () => {
  currentPnL.value = 0;
  pnlInterval = setInterval(() => {
    // Simulate random P&L fluctuation between -0.5 and +0.5
    const change = (Math.random() - 0.5).toFixed(2);
    currentPnL.value = parseFloat((currentPnL.value + parseFloat(change)).toFixed(2));
  }, 1000);
};

// Stop the P&L simulation
const stopPnLUpdates = () => {
  if (pnlInterval) {
    clearInterval(pnlInterval);
    pnlInterval = null;
  }
};

// Simulate placing an order: pending for 3 seconds then switching to active
const placeOrder = () => {
  orderStatus.value = 'pending';
  pendingTimeout = setTimeout(() => {
    if (orderStatus.value === 'pending') {
      orderStatus.value = 'active';
      startPnLUpdates();
    }
  }, 3000);
};

// Cancel the order if still pending
const cancelOrder = () => {
  if (pendingTimeout) {
    clearTimeout(pendingTimeout);
    pendingTimeout = null;
  }
  orderStatus.value = null;
  stopPnLUpdates();
};

// Exit an active position
const exitPosition = () => {
  orderStatus.value = null;
  stopPnLUpdates();
  currentPnL.value = 0;
};

// Handler for the main action button based on order state
const handleAction = () => {
  if (isPositionActive.value) {
    exitPosition();
  } else if (isPending.value) {
    cancelOrder();
  } else {
    placeOrder();
  }
};

// Confirm closing the terminal (triggered from the warning modal)
const confirmClose = () => {
  showExitWarning.value = false;
  isCollapsed.value = true;
};

// Clean up any running intervals or timeouts when the component is unmounted
onUnmounted(() => {
  if (pendingTimeout) clearTimeout(pendingTimeout);
  stopPnLUpdates();
});

// Add new refs for broker connection
const hasBroker = ref(false);
const showZerodhaForm = ref(false);
const isConnecting = ref(false);
const connectionError = ref('');
const postbackUrl = ref('');
const zerodhaCredentials = ref({
  apiKey: '',
  apiSecret: ''
});

// Check if broker is already connected on component mount
onMounted(async () => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/broker/status');
    const data = await response.json();
    hasBroker.value = data.connected;
  } catch (error) {
    console.error('Failed to check broker status:', error);
  }
});

// Handle Zerodha connection
const connectZerodha = async () => {
  connectionError.value = '';
  isConnecting.value = true;

  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/broker/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zerodhaCredentials.value),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to connect broker');
    }

    postbackUrl.value = data.postbackUrl;
    hasBroker.value = true;
  } catch (error) {
    connectionError.value = error.message;
  } finally {
    isConnecting.value = false;
  }
};
</script>

<style scoped>
/* Trading Terminal Container with Glass Effect */
.trading-terminal {
  background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1rem;
  margin: 1rem auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.collapsed {
  cursor: pointer;
  padding: 0.8rem;
}

/* Terminal Header */
.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #fff;
}

.terminal-header span {
  font-size: 0.9rem;
  background: linear-gradient(45deg, #111111, #535bf2);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 1s ease infinite;
}

.terminal-header span.terminal-header-text {
  font-size: 1.1rem;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.collapse-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #111;
  padding: 0;
}

/* Grid Layout for Form Fields */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  width: 150px;
  margin: 0 auto;
}

.field label {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.3rem;
  text-align: center;
}

.field .value {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-weight: 600;
  color: #333;
}

/* Input Styles */
input[type="number"] {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
  color: #333;
  font-weight: 600;
  outline: none;
  transition: border-color 0.2s ease;
  text-align: center;
  font-size: 0.9rem;
}

input[type="number"]:disabled {
  background: rgba(90, 90, 90, 0.1);
  color: #111;
  cursor: not-allowed;
}

input[type="number"]:hover {
  border-color: rgba(255, 255, 255, 0.7);
}

input[type="number"]:focus {
  border-color: #a78bfa;
}

/* Remove default number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Order Status Display */
.status-container {
  margin: 1rem 0;
  padding: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: #fff;
}

.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.pnl {
  font-weight: 600;
}

.pnl.positive {
  color: #4caf50;
}

.pnl.negative {
  color: #f44336;
}


.action-button {
  position: relative;
  display: inline-block;
  width: 100%;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  color: #333;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  border-width: 1px;
  border-color: #111111;
}

/* Update Modal Styling */
.modal {
  position: fixed; /* Change from absolute to fixed */
  inset: 0; /* Shorthand for top: 0, right: 0, bottom: 0, left: 0 */
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #333;
  text-align: left;
}

.modal-content p {
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  color: #555;
  text-align: left;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.modal-actions button:first-child {
  background: #fff;
  color: #333;
}

.modal-actions button:last-child {  
  background: linear-gradient(45deg, #111111, #535bf2);
  color: white;
}

/* Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .trading-terminal {
    width: 100%;
    border-radius: 0;
  }
  .grid-container {
    grid-template-columns: 1fr;
  }
}

/* Broker Setup Styles */
.broker-setup h2 {
  text-align: left;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(45deg, #111111, #535bf2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.broker-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  padding: 0
}

.broker-button {
  width: 100%;
  background: #fff;
  color: #333;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.broker-form {
  margin-top: 1.5rem;
  animation: fadeIn 0.3s ease;
}

.form-field {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
}

.form-field label {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.form-field input {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(100, 100, 100, 0.4);
  background: rgba(255, 255, 255, 0.15);
  color: #333;
  font-weight: 600;
  outline: none;
  transition: border-color 0.2s ease;
  text-align: center;
  font-size: 0.9rem;
}

.form-field input:focus {
  outline: none;
  border-color: #535bf2;
  box-shadow: 0 0 0 3px rgba(83, 91, 242, 0.1);
}

.error-message {
  color: #dc2626;
  padding: 0.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: left;
}

.submit-button {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  background: linear-gradient(45deg, #111111, #535bf2);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(83, 91, 242, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: linear-gradient(45deg, #666666, #888888);
}

.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.postback-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 80, 0.2);
  animation: slideUp 0.3s ease;
}

.postback-info p {
  color: #333;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.postback-url {
  margin-top: 0.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  word-break: break-all;
  font-family: monospace;
  font-size: 0.9rem;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.postback-url:hover {
  background: rgba(0, 0, 0, 0.07);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .broker-setup {
    margin: 1rem;
    padding: 1.5rem;
  }

  .broker-setup h2 {
    font-size: 1.5rem;
  }

  .form-field input,
  .submit-button {
    padding: 0.8rem;
  }
}
</style>