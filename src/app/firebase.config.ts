import { initializeApp, type FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';

// Your Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX" 
};

let firebaseApp: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let analyticsModule: (typeof import('firebase/analytics')) | null = null;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function ensureFirebaseApp(): FirebaseApp | null {
  if (!isBrowser()) return null;
  if (firebaseApp) return firebaseApp;
  firebaseApp = initializeApp(firebaseConfig);
  return firebaseApp;
}

async function ensureAnalytics(): Promise<Analytics | null> {
  if (!isBrowser()) return null;
  if (analytics) return analytics;

  const app = ensureFirebaseApp();
  if (!app) return null;

  analyticsModule = await import('firebase/analytics');
  const supported = await analyticsModule.isSupported().catch(() => false);
  if (!supported) return null;

  analytics = analyticsModule.getAnalytics(app);
  return analytics;
}

// Analytics service
export class AnalyticsService {
  
  // Log custom events
  static logCustomEvent(eventName: string, parameters?: { [key: string]: any }) {
    void (async () => {
      const a = await ensureAnalytics();
      if (!a || !analyticsModule) return;
      try {
        analyticsModule.logEvent(a, eventName, parameters);
      } catch {
        // Silent error handling for production
      }
    })();
  }

  // Log page views
  static logPageView(pageName: string) {
    void (async () => {
      const a = await ensureAnalytics();
      if (!a || !analyticsModule) return;
      try {
        analyticsModule.logEvent(a, 'page_view', {
          page_title: pageName,
          page_location: window.location.href
        });
      } catch {
        // Silent error handling for production
      }
    })();
  }

  // Log contact interactions
  static logContactInteraction(contactType: 'email' | 'phone' | 'linkedin' | 'github') {
    void (async () => {
      const a = await ensureAnalytics();
      if (!a || !analyticsModule) return;
      try {
        analyticsModule.logEvent(a, 'contact_interaction', {
          contact_type: contactType,
          timestamp: new Date().toISOString()
        });
      } catch {
        // Silent error handling for production
      }
    })();
  }

  // Log home page load
  static logHomePageLoad() {
    void (async () => {
      const a = await ensureAnalytics();
      if (!a || !analyticsModule) return;
      try {
        analyticsModule.logEvent(a, 'home_page_load', {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        });
      } catch {
        // Silent error handling for production
      }
    })();
  }

  // Log project interactions
  static logProjectView(projectName: string) {
    void (async () => {
      const a = await ensureAnalytics();
      if (!a || !analyticsModule) return;
      try {
        analyticsModule.logEvent(a, 'project_view', {
          project_name: projectName,
          timestamp: new Date().toISOString()
        });
      } catch {
        // Silent error handling for production
      }
    })();
  }

  // Log navigation events
  static logNavigation(navigationType: string) {
    void (async () => {
      const a = await ensureAnalytics();
      if (!a || !analyticsModule) return;
      try {
        analyticsModule.logEvent(a, 'navigation', {
          navigation_type: navigationType,
          timestamp: new Date().toISOString()
        });
      } catch {
        // Silent error handling for production
      }
    })();
  }

  // Test function to verify analytics is working
  static testAnalytics() {
    void (async () => {
      const a = await ensureAnalytics();
      if (!a || !analyticsModule) return;
      try {
        analyticsModule.logEvent(a, 'test_event', {
          test_param: 'test_value',
          timestamp: new Date().toISOString()
        });
      } catch {
        // ignore
      }
    })();
    return true;
  }
}

 