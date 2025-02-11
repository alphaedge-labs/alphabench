<template>
  <div class="text-generate-wrapper">
    <div ref="scope">
      <span
        v-for="(word, idx) in wordsArray"
        :key="word + idx"
        class="text-word"
        :style="{
          opacity: 0,
          filter: 'blur(8px)',
        }"
      >
        {{ word }}<span class="word-space"> </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0.5
  }
});

const scope = ref(null);
const wordsArray = computed(() => {
  // Handle multiple spaces and trim the text
  return props.text.trim().split(/\s+/);
});

onMounted(() => {
  const words = scope.value.querySelectorAll('.text-word');
  
  words.forEach((word, index) => {
    setTimeout(() => {
      word.style.transition = `all ${props.duration}s ease-out`;
      word.style.opacity = '1';
      word.style.filter = 'blur(0px)';
    }, index * 200); // 200ms stagger between each word
  });
});
</script>

<style scoped>
.text-generate-wrapper {
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.text-word {
  display: inline-block;
}

.word-space {
  display: inline;
  white-space: pre;
}
</style> 