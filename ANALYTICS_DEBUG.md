# Firebase Analytics Debugging Guide

## 🔍 How to Check if Analytics is Working

### 1. Browser Console Check
Open your browser's Developer Tools (F12) and check the console for these messages:
- ✅ "Firebase Analytics initialized: [object]"
- ✅ "Home page load logged"
- ✅ "Test event sent successfully!"

### 2. Network Tab Check
In Developer Tools > Network tab, look for:
- Requests to `google-analytics.com`
- Requests to `googletagmanager.com`
- Requests to `firebaseapp.com`

### 3. Firebase Console Check
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nishaposwal-4e71c`
3. Go to **Analytics** > **Events**
4. Look for events like:
   - `home_page_load`
   - `test_event`
   - `contact_interaction`

## 🚨 Common Issues & Solutions

### Issue 1: No Network Requests
**Symptoms**: No analytics calls in Network tab
**Solutions**:
- Check if ad blockers are enabled (disable for testing)
- Verify Firebase config is correct
- Check browser console for errors

### Issue 2: Analytics Not Initialized
**Symptoms**: "Firebase Analytics initialized: undefined"
**Solutions**:
- Check if `measurementId` is correct
- Verify Google Analytics is enabled in Firebase project
- Check if running on localhost (analytics may be blocked)

### Issue 3: Events Not Appearing in Console
**Symptoms**: No events in Firebase Console
**Solutions**:
- Wait 24-48 hours for data to appear
- Check if events are being sent (Network tab)
- Verify measurement ID matches Firebase project

## 🧪 Testing Steps

### Step 1: Manual Test
1. Open browser console
2. Run: `AnalyticsService.testAnalytics()`
3. Check for success message

### Step 2: Event Test
1. Click on contact links (email, phone, LinkedIn)
2. Check console for "Contact interaction logged" messages
3. Check Network tab for analytics requests

### Step 3: Page Load Test
1. Navigate to home page
2. Check console for "Home page load logged"
3. Check Network tab for page_view events

## 🔧 Debug Commands

Add these to browser console to test:

```javascript
// Test analytics directly
AnalyticsService.testAnalytics();

// Test specific events
AnalyticsService.logContactInteraction('email');
AnalyticsService.logHomePageLoad();

// Check analytics object
console.log('Analytics object:', analytics);
```

## 📱 Environment Issues

### Localhost Development
- Analytics may be blocked by ad blockers
- Use incognito mode for testing
- Check if `localhost` is in Firebase authorized domains

### Production Deployment
- Analytics works better in production
- Verify domain is added to Firebase authorized domains
- Check if HTTPS is enabled

## 🎯 Expected Behavior

### Console Output (Success):
```
Window object available: true
Navigator object available: true
Firebase Analytics initialized: [object]
Firebase app initialized: [object]
Testing Firebase Analytics...
Analytics object: [object]
Firebase config: [object]
Test event sent successfully!
Home page load logged
```

### Network Requests (Success):
- `https://www.google-analytics.com/g/collect`
- `https://www.googletagmanager.com/gtag/js`

## 🚀 Quick Fixes

1. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
2. **Disable Ad Blockers**: Temporarily disable for testing
3. **Check Firebase Config**: Verify all values are correct
4. **Restart Dev Server**: Stop and restart `npm start`
5. **Check Console Errors**: Look for any JavaScript errors

## 📞 Next Steps

If analytics still doesn't work:
1. Check Firebase project settings
2. Verify Google Analytics is enabled
3. Test in production environment
4. Contact Firebase support if needed 