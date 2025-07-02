# Firebase Google Analytics Setup

This document provides instructions for setting up Firebase Google Analytics in your Angular portfolio project.

## 🔧 Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "nisha-portfolio")
4. Follow the setup wizard

### 2. Enable Google Analytics

1. In your Firebase project, go to **Analytics** in the left sidebar
2. Click **Get started**
3. Choose your Analytics account or create a new one
4. Accept the terms and continue

### 3. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Add app** and select **Web** (</>)
4. Register your app with a nickname (e.g., "portfolio-web")
5. Copy the Firebase configuration object

### 4. Update Configuration

Replace the placeholder configuration in `src/app/firebase.config.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX" // Your Google Analytics ID
};
```

### 5. Test Analytics

1. Start your development server: `npm start`
2. Open your browser and navigate to your portfolio
3. Check Firebase Console > Analytics > Events to see tracked events

## 📊 Tracked Events

The following events are automatically tracked:

### Page Views
- **Home Page Load**: `home_page_load`
- **Page Views**: `page_view` (with page title and location)

### Contact Interactions
- **Email Click**: `contact_interaction` (type: email)
- **Phone Click**: `contact_interaction` (type: phone)
- **LinkedIn Click**: `contact_interaction` (type: linkedin)
- **GitHub Click**: `contact_interaction` (type: github)

### Project Interactions
- **Project View**: `project_view` (with project name)

### Navigation
- **Navigation Events**: `navigation` (with navigation type)

## 🎯 Analytics Dashboard

Once set up, you can view analytics data in:

1. **Firebase Console** > Analytics > Dashboard
2. **Google Analytics** (if linked to Firebase)
3. **Real-time reports** for immediate feedback

## 🔍 Custom Events

You can add more custom events by using the `AnalyticsService`:

```typescript
import { AnalyticsService } from './firebase.config';

// Log custom event
AnalyticsService.logCustomEvent('button_click', {
  button_name: 'cta_button',
  page: 'home'
});
```

## 🚀 Production Deployment

For production deployment:

1. **Build your project**: `npm run build`
2. **Deploy to your hosting platform** (Netlify, Vercel, Firebase Hosting)
3. **Verify analytics** are working in production

## 📱 Privacy Considerations

- Analytics data is anonymized by default
- No personal information is collected
- Users can opt-out via browser settings
- Consider adding a privacy policy for your portfolio

## 🛠️ Troubleshooting

### Common Issues:

1. **Events not showing**: Check Firebase configuration and measurement ID
2. **Analytics disabled**: Ensure Google Analytics is enabled in Firebase
3. **CORS errors**: Verify domain is added to authorized domains in Firebase
4. **Ad blockers**: Analytics may be blocked by ad blockers in development

### Debug Mode:

Enable debug mode for development:

```typescript
// In firebase.config.ts
import { getAnalytics, setAnalyticsCollectionEnabled } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Enable debug mode in development
if (true) {
  setAnalyticsCollectionEnabled(analytics, true);
}
```

## 📈 Key Metrics to Monitor

- **Page Views**: Most visited pages
- **Contact Interactions**: Which contact methods are most used
- **Project Views**: Most popular projects
- **User Engagement**: Time on site, bounce rate
- **Traffic Sources**: Where visitors come from

---

**Note**: Remember to replace the placeholder Firebase configuration with your actual project credentials before deploying. 