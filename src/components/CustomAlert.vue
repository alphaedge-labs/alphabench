<template>
  <Transition name="fade">
    <div 
      v-if="isVisible" 
      :class="[
        'alert',
        type,
        `position-${position}`,
        { stacked: isStacked }
      ]"
      :style="stackStyle"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'warning', 'error'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 3000
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(value)
  },
  stackIndex: {
    type: Number,
    default: 0
  }
});

const isVisible = ref(true);
const isStacked = ref(false);

// Compute stack offset based on index (max 3 alerts)
const stackStyle = computed(() => {
  if (props.stackIndex > 2) return {};
  
  const offset = props.stackIndex * 60; // 60px spacing between alerts
  const positionParts = props.position.split('-');
  const isTop = positionParts[0] === 'top';
  
  return {
    [isTop ? 'top' : 'bottom']: `${offset + 20}px` // 20px base offset
  };
});

onMounted(() => {
  if (props.stackIndex > 0) {
    isStacked.value = true;
  }
  
  setTimeout(() => {
    isVisible.value = false;
  }, props.duration);
});
</script>

<style scoped>
.alert {
  position: fixed;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 300px;
  max-width: 500px;
  text-align: left;
}

/* Alert Types */
.alert.success {
  background: #dcfce7;
  border: 1px solid #22c55e;
  color: #166534;
}

.alert.warning {
  background: #fef9c3;
  border: 1px solid #eab308;
  color: #854d0e;
}

.alert.error {
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #991b1b;
}

/* Positions */
.position-top-left {
  top: 20px;
  left: 20px;
}

.position-top-center {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.position-top-right {
  top: 20px;
  right: 20px;
}

.position-bottom-left {
  bottom: 20px;
  left: 20px;
}

.position-bottom-center {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.position-bottom-right {
  bottom: 20px;
  right: 20px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Stacking animation */
.stacked {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .alert {
    min-width: auto;
    max-width: calc(100% - 40px);
    margin: 0 20px;
  }

  .position-top-center,
  .position-bottom-center {
    width: calc(100% - 40px);
  }
}
</style>
