import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setAnalyticsCollectionEnabled } from 'firebase/analytics';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Analytics service
export class AnalyticsService {
  
  // Log custom events
  static logCustomEvent(eventName: string, parameters?: { [key: string]: any }) {
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      // Silent error handling for production
    }
  }

  // Log page views
  static logPageView(pageName: string) {
    try {
      logEvent(analytics, 'page_view', {
        page_title: pageName,
        page_location: window.location.href
      });
    } catch (error) {
      // Silent error handling for production
    }
  }

  // Log contact interactions
  static logContactInteraction(contactType: 'email' | 'phone' | 'linkedin' | 'github') {
    try {
      logEvent(analytics, 'contact_interaction', {
        contact_type: contactType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling for production
    }
  }

  // Log home page load
  static logHomePageLoad() {
    try {
      logEvent(analytics, 'home_page_load', {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      });
    } catch (error) {
      // Silent error handling for production
    }
  }

  // Log project interactions
  static logProjectView(projectName: string) {
    try {
      logEvent(analytics, 'project_view', {
        project_name: projectName,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling for production
    }
  }

  // Log navigation events
  static logNavigation(navigationType: string) {
    try {
      logEvent(analytics, 'navigation', {
        navigation_type: navigationType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling for production
    }
  }

  // Test function to verify analytics is working
  static testAnalytics() {
    try {
      logEvent(analytics, 'test_event', {
        test_param: 'test_value',
        timestamp: new Date().toISOString()
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

 