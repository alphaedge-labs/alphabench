<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    // Get code from URL params
    const code = route.query.code;
    const state = route.query.state;
    
    // Verify state to prevent CSRF
    const savedState = localStorage.getItem('oauth_state');
    if (state !== savedState) {
      throw new Error('Invalid OAuth state');
    }
    
    // Clear saved state
    localStorage.removeItem('oauth_state');
    
    // Get redirect URI (must match the one used to generate the login URL)
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    
    // Complete login
    await authStore.loginWithGoogle(code, redirectUri);
    
    // // Redirect to app or saved redirect path
    const redirectPath = route.query.redirect || '/app';
    router.push(redirectPath);
  } catch (error) {
    console.error('Google auth callback failed:', error);
    router.push('/auth/login?error=google_auth_failed');
  }
});
</script>

<template>
  <div class="callback-container">
    <div class="callback-card">
      <div class="loading-spinner"></div>
      <h2>Completing Login</h2>
      <p>Please wait while we complete your authentication...</p>
    </div>
  </div>
</template>

<style scoped>
.callback-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.callback-card {
  border-radius: 1rem;
  padding: 2.5rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: fadeIn 0.5s ease-out;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #535bf2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #111111, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

p {
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .callback-card {
    padding: 2rem;
  }
}
</style>