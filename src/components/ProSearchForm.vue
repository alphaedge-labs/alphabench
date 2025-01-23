<template>
  <div class="pro-search">
    <div class="search-container">
      <div class="snippets-container">
        <button
          v-for="snippet in searchSnippets"
          :key="snippet"
          class="snippet-button"
          @click="applySnippet(snippet)"
        >
          {{ snippet }}
        </button>
      </div>

      <div class="search-input-wrapper">
        <input
          type="text"
          class="search-input"
          placeholder="Search anything..."
          v-model="searchQuery"
          @focus="showPopover = true"
          @blur="handleBlur"
        />
      </div>

      <div v-if="showPopover" class="search-popover">
        <div class="search-results">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Searching...</p>
          </div>
          
          <div v-else-if="results.length === 0" class="empty-state">
            <p>{{ searchQuery ? 'No results found' : 'Start typing to search' }}</p>
          </div>
          
          <div v-else class="results-list">
            <button
              v-for="result in results"
              :key="result.id"
              class="result-item"
              @click="selectResult(result)"
            >
              <span class="result-title">{{ result.title }}</span>
              <span class="result-description">{{ result.description }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const showPopover = ref(false)
const loading = ref(false)
const results = ref([])

const searchSnippets = [
  "What's the best stock to buy today?",
  "Top performing ETFs this week",
  "Pharma sector analysis this month",
  "Investment strategies for beginners",
  "Market trends this week",
  "Best performing stocks this month"
]

const applySnippet = (snippet) => {
  searchQuery.value = snippet
  showPopover.value = true
}

const handleBlur = () => {
  setTimeout(() => {
    showPopover.value = false
  }, 200)
}

const selectResult = (result) => {
  // Handle result selection
  showPopover.value = false
}
</script>

<style scoped>
.search-heading {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #111111, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: center;
}

/* Add this to the existing media query for mobile responsiveness */
@media (max-width: 768px) {
  .search-heading {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}

.pro-search {
  max-width: 600px; 
  margin: 0 auto; 
  padding: 1rem;
  border-radius: 1rem;
  box-sizing: border-box;
}

.search-container {
  position: relative;
  width: 100%; 
}

.search-input-wrapper {
  position: relative;
  width: 100%; 
  box-sizing: border-box; 
}

.search-input {
  width: 100%; 
  max-width: 100%; 
  padding: 0.75rem 1.25rem;
  padding-left: 3rem;
  border: 1px solid #d1d5db;
  border-radius: 1rem;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background: #ffffff;
  color: #111827;
  box-sizing: border-box; 
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.search-input-wrapper::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.search-popover {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d5db;
  overflow: hidden;
  z-index: 50;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #f9fafb;
}

.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 4px;
}

.loading-state,
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  margin: 0 auto 1rem;
  border: 2px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.results-list {
  padding: 0.5rem 0;
}

.result-item {
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  text-align: left;
}

.result-item:hover {
  background: #f3f4f6;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
}

.result-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.result-description {
  font-size: 0.875rem;
  color: #4b5563;
}

.snippets-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; 
  margin-bottom: 1rem; 
  justify-content: flex-start; 
}

.snippet-button {
  padding: 0.5rem 1rem;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 1.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: left;
  white-space: nowrap;
  display: inline-block;
  max-width: fit-content;
}

.snippet-button:hover {
  border-color: #2563eb;
  color: #2563eb;
}

@media (max-width: 768px) {
  .pro-search {
    max-width: 100%;
    padding: 0.75rem; 
    box-shadow: none; 
    border-radius: 0.5rem; 
  }

  .search-input {
    font-size: 0.9rem; 
    padding: 0.5rem 1rem; 
    padding-left: 2.5rem; 
  }

  .search-input-wrapper::before {
    width: 16px; 
    height: 16px; 
    left: 0.75rem; 
  }

  .snippets-container {
    justify-content: center;
    flex-wrap: wrap; 
    gap: 0.25rem; 
  }

  .snippet-button {
    font-size: 0.8rem; 
    padding: 0.4rem 0.8rem; 
  }

  .search-popover {
    border-radius: 0.5rem; 
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
    border: 1px solid #e5e7eb;
  }

  .search-results {
    max-height: 300px; 
  }

  .result-item {
    padding: 0.5rem; 
  }

  .result-title {
    font-size: 0.9rem; 
  }

  .result-description {
    font-size: 0.75rem; 
  }

  .loading-state,
  .empty-state {
    padding: 1.5rem; 
  }
}
</style>