import Tracker from '@openreplay/tracker';

// Create and configure the tracker
const tracker = new Tracker({
  projectKey: import.meta.env.VITE_OPENREPLAY_PROJECT_KEY,
  __DISABLE_SECURE_MODE: import.meta.env.DEV,
});

export default tracker;