<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="$emit('close')">&times;</button>

      <h3>Manage Portfolio</h3>
      <p class="description">Upload your portfolio or add stocks manually.</p>

      <div class="tabs">
        <button 
          :class="['tab-button', { active: activeTab === 'manual' }]"
          @click="activeTab = 'manual'"
        >
          Add Manually
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'upload' }]"
          @click="activeTab = 'upload'"
        >
          Upload Excel
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'bundles' }]"
          @click="activeTab = 'bundles'"
        >
          Pre-bundled Stocks
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'upload'" class="upload-section">
          <div class="upload-area" @drop.prevent="handleDrop" @dragover.prevent>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              class="upload-icon"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>Drag & drop your Excel file here or</p>
            <input 
              type="file" 
              ref="fileInput" 
              class="file-input" 
              accept=".xlsx,.xls"
              @change="handleFileSelect"
            />
            <button class="browse-button" @click="$refs.fileInput.click()">
              Browse Files
            </button>
          </div>
          
          <div class="template-section">
            <p>Do you want a base template to get started?</p>
            <button class="template-button" @click="downloadTemplate">
              Download Template
            </button>
          </div>
        </div>

        <div v-else-if="activeTab === 'manual'" class="manual-section">
          <div class="stock-inputs">
            <div v-for="(stock, index) in stocks" :key="index" class="stock-input-row">
              <div class="asset-search" v-if="!stock.symbol">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search stock symbol"
                  class="stock-search-input"
                  @focus="currentSearchIndex = index"
                />
                <div v-if="searchQuery && currentSearchIndex === index" class="search-results">
                  <button
                    v-for="asset in filteredAssets"
                    :key="asset.value"
                    class="asset-item"
                    @click="selectAsset(index, asset)"
                  >
                    {{ asset.label }}
                  </button>
                </div>
              </div>
              <div v-else class="stock-symbol">
                {{ stock.symbol }}
              </div>
              <input 
                type="number" 
                v-model="stock.quantity" 
                placeholder="Quantity"
                class="stock-input"
              />
              <button class="remove-button" @click="removeStock(index)">&times;</button>
            </div>
          </div>
          
          <button class="add-button" @click="addStock">
            Add Another Stock
          </button>
        </div>

        <div v-else-if="activeTab === 'bundles'" class="bundles-section">
          <div class="bundle-search">
            <input
              type="text"
              v-model="bundleSearch"
              placeholder="Search stock bundles..."
              class="bundle-search-input"
            />
            <div v-if="filteredBundles.length" class="bundle-list">
              <button
                v-for="bundle in filteredBundles"
                :key="bundle.id"
                class="bundle-item"
                @click="selectBundle(bundle)"
              >
                <div class="bundle-info">
                  <span class="bundle-name">{{ bundle.name }}</span>
                  <span class="bundle-count">{{ bundle.stocks.length }} stocks</span>
                </div>
                <span class="bundle-description">{{ bundle.description }}</span>
              </button>
            </div>
            <div v-else class="no-bundles">
              No bundles found
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="disclaimer">
          <p>We're only supporting NSE stocks for preview version. Mutual funds, futures and options will be supported in future.</p>
        </div>
        <button 
          class="submit-button"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          Add Portfolio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import assets from "../assets/instruments-small.json";

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'save'])

const activeTab = ref('upload')
const stocks = ref([{ symbol: '', quantity: '' }])
const fileInput = ref(null)
const bundleSearch = ref('')
const searchQuery = ref('')
const currentSearchIndex = ref(null)

// Asset search functionality
const filteredAssets = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return assets.filter(
    (asset) =>
      asset.label.toLowerCase().includes(query) ||
      asset.value.toLowerCase().includes(query)
  )
})

const stockBundles = [
  {
    id: 1,
    name: 'NIFTY 50',
    description: '50 equally weighted stocks from India\'s top companies',
    stocks: [
      { 
        value: 'RELIANCE.NS',  // Using value to match with assets list
        label: 'Reliance Industries Ltd',
        quantity: 1 
      },
      { 
        value: 'TCS.NS',
        label: 'Tata Consultancy Services Ltd',
        quantity: 1 
      },
      // Add more stocks as needed
    ]
  },
  {
    id: 2,
    name: 'NIFTY BANK',
    description: 'Top banking sector stocks',
    stocks: [
      { 
        value: 'HDFCBANK.NS',
        label: 'HDFC Bank Ltd',
        quantity: 1 
      },
      { 
        value: 'ICICIBANK.NS',
        label: 'ICICI Bank Ltd',
        quantity: 1 
      },
      // Add more stocks as needed
    ]
  }
]

const filteredBundles = computed(() => {
  if (!bundleSearch.value) return stockBundles
  const search = bundleSearch.value.toLowerCase()
  return stockBundles.filter(bundle => 
    bundle.name.toLowerCase().includes(search) || 
    bundle.description.toLowerCase().includes(search)
  )
})

const selectBundle = (bundle) => {
  // Clear existing stocks first
  stocks.value = [];

  // Add selected bundle stocks to the stocks array
  bundle.stocks.forEach((stock) => {
    stocks.value.push({
      symbol: stock.value, // Using `value` as stock symbol
      quantity: stock.quantity,
    });
  });

  // Switch to the manual tab after updating stocks
  activeTab.value = 'manual';
};

const addStock = () => {
  stocks.value.push({ symbol: '', quantity: '' })
}

const removeStock = (index) => {
  stocks.value.splice(index, 1)
  if (stocks.value.length === 0) {
    addStock()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  // Handle file upload logic
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  // Handle file upload logic
}

const downloadTemplate = () => {
  // Download template logic
}

const handleSubmit = () => {
  if (activeTab.value === 'manual') {
    // Filter out empty stocks
    const validStocks = stocks.value.filter(stock => stock.symbol && stock.quantity)
    emit('save', validStocks)
  }
  emit('close')
}

const canSubmit = computed(() => {
  if (activeTab.value === 'manual') {
    return stocks.value.some(stock => stock.symbol && stock.quantity)
  }
  return false
})

// Asset search methods
const selectAsset = (index, asset) => {
  stocks.value[index].symbol = asset.value
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  max-width: 90%;
  width: 600px;
  position: relative;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #111111, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: left;
}

.description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  text-align: left;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  color: #111827;
  transform: scale(1.1);
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
}

.tab-button.active {
  color: #535bf2;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 100%;
  height: 2px;
  background: #535bf2;
  border-radius: 2px;
}

.tab-content {
  margin-bottom: 1.5rem;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.upload-area {
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  transition: all 0.2s;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #535bf2;
  color: #535bf2;
}

.upload-icon {
  margin-bottom: 1rem;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.file-input {
  display: none;
}

.browse-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #535bf2;
  color: #535bf2;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.browse-button:hover {
  background: #535bf2;
  color: white;
}

.template-section {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.template-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  color: #6b7280;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.template-button:hover {
  border-color: #535bf2;
  color: #535bf2;
}

.manual-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stock-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stock-search-input {
  padding: 0.9rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s;
  width: 300px;
}

.stock-symbol {
  text-align: left;
  padding: 0.9rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s;
  width: 300px;
}

.stock-input-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.stock-input {
  flex: 1;
  padding: 0.9rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s;
}
.stock-input::placeholder {
  font-weight: normal;
}

.stock-input:focus {
  outline: none;
  border-color: #535bf2;
  box-shadow: 0 0 0 3px rgba(83, 91, 242, 0.1);
}

.remove-button {
  padding: 0.5rem;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-button:hover {
  transform: scale(1.1);
}

.add-button {
  padding: 0.75rem;
  background: white;
  border: 1px dashed #d1d5db;
  color: #6b7280;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.add-button:hover {
  border-color: #535bf2;
  color: #535bf2;
}

.modal-footer {
  margin-top: 1rem;
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.disclaimer {
  flex: 1;
}

.disclaimer p {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
  margin: 0;
  text-align: left;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #111111, #535bf2);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;
  white-space: nowrap;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.bundles-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bundle-search {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bundle-search-input {
  padding: 0.9rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.bundle-search-input:focus {
  outline: none;
  border-color: #535bf2;
  box-shadow: 0 0 0 3px rgba(83, 91, 242, 0.1);
}

.bundle-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bundle-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.bundle-item:hover {
  border-color: #535bf2;
  transform: translateY(-1px);
}

.bundle-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bundle-name {
  font-weight: 600;
  color: #111827;
}

.bundle-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.bundle-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.no-bundles {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 0.5rem;
}

@media (max-width: 640px) {
  .modal-content {
    padding: 1.5rem;
    width: 100%;
    max-width: 100%;
    margin: 0.5rem;
    border-radius: 1rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  .description {
    font-size: 0.875rem;
  }

  .tabs {
    gap: 0.5rem;
  }

  .tab-button {
    padding: 0.5rem;
    font-size: 0.875rem;
  }

  .upload-area {
    padding: 1.5rem 1rem;
  }

  .upload-icon {
    width: 32px;
    height: 32px;
  }

  .stock-input-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stock-input {
    width: 100%;
  }

  .remove-button {
    align-self: flex-end;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .stock-input-row {
    position: relative;
    padding-right: 2.5rem;
  }

  .browse-button,
  .template-button,
  .add-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .template-section {
    padding: 0.75rem;
  }

  .submit-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .close-button {
    top: 0.5rem;
    right: 0.5rem;
    width: 32px;
    height: 32px;
    font-size: 1.25rem;
  }

  .modal-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .submit-button {
    width: 100%;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-content {
    padding: 1rem;
  }

  .tabs {
    flex-direction: column;
    gap: 0;
    border-bottom: none;
  }

  .tab-button {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
  }

  .tab-button.active {
    background: #535bf2;
    color: white;
  }

  .tab-button.active::after {
    display: none;
  }

  .upload-area {
    padding: 1rem;
  }

  .upload-area p {
    font-size: 0.875rem;
  }

  .template-section p {
    font-size: 0.875rem;
  }

  .stock-inputs {
    gap: 1rem;
  }

  .modal-footer {
    margin-top: 1.5rem;
  }

  .bundle-item {
    padding: 0.75rem;
  }

  .bundle-name {
    font-size: 0.9375rem;
  }

  .bundle-count,
  .bundle-description {
    font-size: 0.813rem;
  }
}

@media (max-height: 700px) {
  .modal-content {
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-content::-webkit-scrollbar {
    width: 4px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }

  .modal-content::-webkit-scrollbar-thumb:hover {
    background: #535bf2;
  }
}

@media (max-width: 360px) {
  .modal-content {
    padding: 0.75rem;
  }

  h3 {
    font-size: 1.125rem;
  }

  .description {
    font-size: 0.813rem;
  }

  .stock-input {
    font-size: 0.813rem;
    padding: 0.625rem;
  }
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content {
  animation: modalEnter 0.3s ease-out;
}

:deep(.asset-search-input) {
  flex: 1;
}

:deep(.asset-search-results) {
  z-index: 1001;
}

.asset-search {
  position: relative;
  flex: 1;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.asset-item {
  width: 100%;
  padding: 0.625rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.asset-item:hover {
  background-color: #f1f5f9;
}
</style> 