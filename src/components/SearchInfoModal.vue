<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="$emit('close')">&times;</button>
        <h2>Search Guide</h2>
        
        <div class="search-tips">
          <div class="tip-section">
            <div class="tip-header">
              <h3>Natural Language Search</h3>
            </div>
            <p>Type queries as you would speak them:</p>
            <div class="example-block">
              "Show tech stocks with high growth potential"
            </div>
            <p>Unless specified, the backtest will be run on all stocks in with period limited to past one Quarter(3 months).</p>
          </div>

          <div class="tip-section">
            <div class="tip-header">
              <h3>Quick Snippets</h3>
            </div>
            <p>Use predefined snippets above the search bar for common queries</p>
          </div>

          <div class="tip-section">
            <div class="tip-header">
              <h3>Refine Results</h3>
            </div>
            <p>Combine search terms for precision:</p>
            <ul>
              <li>Add time periods: "last 6 months", "YTD"</li>
              <li>Include metrics: "P/E ratio", "market cap"</li>
              <li>Specify sectors: "tech", "energy", "finance"</li>
            </ul>
          </div>
        </div>

        <RouterLink to="/how-to" class="learn-more-link">
          View Full Documentation
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
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </RouterLink>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #374151;
}

h2 {
  font-size: 1.8rem;
  text-align: left;
  margin: 0 0 2rem;
  background: linear-gradient(45deg, #111111, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.search-tips {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tip-section {
  text-align: left;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tip-section h3 {
  color: #111827;
  font-size: 1.2rem;
  margin: 0;
}

.tip-section p {
  color: #4b5563;
  line-height: 1.5;
  margin: 0 0 0.5rem;
}

.example-block {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  border-left: 3px solid #535bf2;
  color: #4b5563;
  font-size: 0.95rem;
  margin: 0.5rem 0;
}

.tip-section ul {
  list-style-type: none;
  padding-left: 0;
  color: #4b5563;
  margin: 0.5rem 0;
}

.tip-section li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.tip-section li::before {
  content: "•";
  position: absolute;
  left: 0.5rem;
  color: #535bf2;
}

.learn-more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #111111, #535bf2);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: transform 0.2s ease;
  font-weight: 500;
}

.learn-more-link:hover {
  transform: translateY(-1px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #111111, #535bf2);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #000000, #4347d9);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
    width: 95%;
    margin: 1rem;
    max-height: 85vh;
  }

  h2 {
    font-size: 1.5rem;
    margin: 0 0 1.5rem;
  }

  .search-tips {
    gap: 1.5rem;
  }

  .tip-header {
    gap: 0.75rem;
  }

  .tip-number {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.9rem;
  }

  .tip-section h3 {
    font-size: 1.1rem;
  }

  .tip-section p {
    font-size: 0.95rem;
  }

  .example-block {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }

  .tip-section li {
    font-size: 0.95rem;
    padding-left: 1.25rem;
  }

  .learn-more-link {
    width: 100%;
    justify-content: center;
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }

  .close-button {
    top: 0.75rem;
    right: 0.75rem;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1.25rem;
  }

  h2 {
    font-size: 1.3rem;
    margin: 0 0 1.25rem;
  }

  .search-tips {
    gap: 1.25rem;
  }

  .tip-section p,
  .tip-section li,
  .example-block {
    font-size: 0.875rem;
  }
}
</style> 