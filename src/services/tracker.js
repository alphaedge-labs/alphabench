import Tracker from '@openreplay/tracker';

// Create and configure the tracker
const tracker = new Tracker({
  projectKey: import.meta.env.VITE_OPENREPLAY_PROJECT_KEY,
  __DISABLE_SECURE_MODE: !import.meta.env.DEV,
  obscureInputDates: false,
  defaultInputMode: 0,
  obscureInputEmails: false,
  obscureInputNumbers: false,
  obscureTextNumbers: false,
  obscureTextEmails: false,
  capturePerformance: true
});

export default tracker;