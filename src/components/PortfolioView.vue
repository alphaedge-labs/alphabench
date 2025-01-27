<template>
  <div class="portfolio-view">
    <div class="portfolio-header">
      <h3>Your Portfolio</h3>
      <div class="header-actions">
        <button class="edit-button" @click="handleEdit">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
        </button>
        <!--<button class="delete-button" @click="confirmDelete">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>-->
      </div>
    </div>

    <div class="portfolio-stats">
      <div class="stat-card">
        <span class="stat-label">Total Value</span>
        <span class="stat-value">₹{{ totalValue.toLocaleString() }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Total Stocks</span>
        <span class="stat-value">{{ stocks.length }}</span>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="confirm-modal" @click.stop>
        <h4>Delete Portfolio?</h4>
        <p>This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="cancel-button" @click="showDeleteConfirm = false">Cancel</button>
          <button class="confirm-button" @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  stocks: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['edit', 'delete']);
const showDeleteConfirm = ref(false);

const totalValue = computed(() => {
  return props.stocks.reduce((total, stock) => {
    return total + (stock.quantity * stock.currentPrice);
  }, 0);
});

const handleEdit = () => {
  emit('edit');
};

const confirmDelete = () => {
  showDeleteConfirm.value = true;
};

const handleDelete = () => {
  emit('delete');
  showDeleteConfirm.value = false;
};
</script>

<style scoped>
.portfolio-view {
  padding: 1.5rem;
  background: white;
  border-radius: 1.25rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 1rem 0 2rem;
  transition: all 0.3s ease;
}

.portfolio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.portfolio-header h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #111111, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.edit-button, .delete-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.edit-button {
  background: #fff;
  color: #535bf2;
}

.edit-button:hover {
  background: #535bf2;
  border: 1px solid #535bf2;
  color: white;
  transform: translateY(-1px);
}

.delete-button {
  background: #fff;
  color: #ef4444;
}

.delete-button:hover {
  background: #ef4444;
  border: 1px solid #ef4444;
  color: white;
  transform: translateY(-1px);
}

.portfolio-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(45deg, #111111, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.025em;
}

.stocks-list {
  display: grid;
  gap: 1rem;
}

.stock-card {
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.stock-info {
  margin-bottom: 1.25rem;
}

.stock-info h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.stock-symbol {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.stock-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.detail-label {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.detail-value {
  font-weight: 600;
  color: #111827;
  font-size: 1rem;
}

/* Confirmation Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.confirm-modal {
  background: white;
  padding: 2rem;
  border-radius: 1.25rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.confirm-modal h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.confirm-modal p {
  margin: 0 0 2rem 0;
  color: #6b7280;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

}

.cancel-button, .confirm-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-button {
  background: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
}

.cancel-button:hover {
  border-color: #6b7280;
  color: #111827;
}

.confirm-button {
  background: #ef4444;
  border: none;
  color: white;
}

.confirm-button:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .portfolio-view {
    padding: 1rem;
    margin: 0.5rem 0 1.5rem;
  }

  .portfolio-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .portfolio-header h3 {
    font-size: 1.5rem;
  }

  .header-actions {
    width: 100%;
  }

  .edit-button, .delete-button {
    flex: 1;
    justify-content: center;
    padding: 0.5rem 1rem;
  }

  .portfolio-stats {
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
    text-align: center;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stock-card {
    padding: 1rem;
  }

  .stock-details {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .confirm-modal {
    margin: 1rem;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .stock-details {
    grid-template-columns: 1fr;
  }
}
</style> 