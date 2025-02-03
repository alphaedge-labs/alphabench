<template>
  <div class="backtest-results">
    <!-- Summary Section -->
    <div class="metrics-summary">
      <div v-for="(value, key) in data.metrics" :key="key" class="metric-card">
        <div class="metric-label">{{ formatLabel(key) }}</div>
        <div class="metric-value">{{ formatValue(value) }}</div>
      </div>
    </div>

    <!-- Results Grid -->
    <div class="results-grid">
      <table>
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header">
              {{ formatLabel(header) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data.results" :key="index">
            <td v-for="header in tableHeaders" :key="header">
              {{ formatValue(row[header]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      metrics: {},
      results: []
    })
  }
});

const tableHeaders = computed(() => {
  return props.data.results.length > 0 
    ? Object.keys(props.data.results[0]) 
    : [];
});

const formatLabel = (str) => {
  return str
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatValue = (value) => {
  if (typeof value === 'number') {
    // Format percentages
    if (Math.abs(value) < 1 && value !== 0) {
      return (value * 100).toFixed(2) + '%';
    }
    // Format large numbers
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString();
    }
    // Format decimals
    return value.toFixed(2);
  }
  return value;
};
</script>

<style scoped>
.backtest-results {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.metrics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.metric-card {
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
}

.metric-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
}

.results-grid {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

td {
  color: #4b5563;
}

tr:hover {
  background-color: #f3f4f6;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .metrics-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .metric-card {
    padding: 0.5rem;
  }

  th, td {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}
</style> 