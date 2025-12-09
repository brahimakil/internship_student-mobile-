# 🚀 Quick Start Guide - Internship Student Mobile App

## Prerequisites
- Node.js 18+ installed
- Expo Go app on your phone (Android/iOS)
- Backend running on your machine

## Step 1: Start the Backend
```bash
cd internship_backend
npm run start:dev
```
✅ Backend should be running on `http://localhost:3000`

## Step 2: Configure API URL (if needed)

### For Android Emulator (Default - Already configured):
No changes needed! Using `http://10.0.2.2:3000`

### For iOS Simulator:
Edit `internship_student/constants/api.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:3000';
```

### For Physical Device (same WiFi network):
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` (look for inet)
   
2. Edit `internship_student/constants/api.ts`:
```typescript
export const API_BASE_URL = 'http://192.168.x.x:3000'; // Replace with your IP
```

## Step 3: Start Expo Dev Server
```bash
cd internship_student
npx expo start
```

## Step 4: Open on Your Device

### Option A: Physical Device (Recommended)
1. Install **Expo Go** from App Store/Play Store
2. Scan the QR code shown in terminal:
   - **Android**: Use Expo Go app
   - **iOS**: Use Camera app (iOS 11+)
3. App will load on your phone!

### Option B: Emulator/Simulator
- **Android**: Press `a` in terminal
- **iOS**: Press `i` in terminal (Mac only)

## Step 5: Test the App

### Create Account:
1. Tap "Sign Up" on login screen
2. Enter:
   - Full Name: `John Doe`
   - Email: `john@test.com`
   - Major: `Computer Science`
   - Password: `password123`
3. Tap "Sign Up"

### Explore Features:
1. **Browse** - Open sidebar (swipe right), tap "Browse Internships"
2. **Filter** - Try different industries (Technology, Finance, etc.)
3. **View Details** - Tap any internship card
4. **Apply** - Tap "Apply Now" button
5. **Check Applications** - Sidebar → "My Applications"
6. **AI Chat** - Sidebar → "AI Assistant"

## Troubleshooting

### ❌ "Network Error" when browsing internships
**Problem**: Backend not running or wrong API URL  
**Solution**: 
1. Check backend is running (`npm run start:dev`)
2. Verify API_BASE_URL in `constants/api.ts`
3. For physical device, use your computer's IP address

### ❌ "Unable to resolve module"
**Problem**: Dependencies not installed  
**Solution**:
```bash
cd internship_student
rm -rf node_modules
npm install
```

### ❌ App crashes on startup
**Problem**: Metro bundler cache issue  
**Solution**:
```bash
npx expo start --clear
```

### ❌ "Firebase auth error"
**Problem**: Firebase credentials issue  
**Solution**: Firebase is already configured, should work out of the box

### ❌ AI Chat not working
**Problem**: No Gemini API key set  
**Solution**: 
1. Get API key from https://makersuite.google.com/app/apikey
2. In backend, add student's Gemini key via admin panel
3. Or implement profile editing to set key in mobile app

## Default Test Accounts

### Student Account (if created in backend):
- Email: `student@test.com`
- Password: `password123`

### Create your own:
Use the Register screen to create new accounts!

## Development Tips

### Hot Reload
- Shake device or press `Cmd+M` (iOS) / `Cmd+M` (Android)
- Tap "Enable Fast Refresh"
- Changes auto-reload on save!

### Debug Menu
- Shake device or press `Cmd+D`
- Options: Remote debugging, Performance monitor, etc.

### View Logs
Terminal where you ran `npx expo start` shows all console.log output

## API Endpoints Being Used

```
GET    /internships              - Browse all
GET    /internships/industry/:id - Filter by industry
GET    /internships/:id          - Details
POST   /applications             - Submit application
GET    /applications/student/:id - My applications
GET    /enrollments/student/:id  - My internships
GET    /assignments/student/:id  - My assignments
POST   /assignments/:id/submit   - Submit assignment
POST   /ai/chat                  - AI chat
GET    /students/:id             - Profile
```

## What's Working Right Now

✅ Browse internships with industry filter  
✅ View internship details  
✅ Apply to internships  
✅ Track application status  
✅ View enrolled internships  
✅ View and submit assignments  
✅ AI chat assistant  
✅ Light/Dark theme toggle  
✅ Left sidebar navigation  
✅ User authentication  

## Need Help?

1. Check IMPLEMENTATION_COMPLETE.md for full feature list
2. Check MOBILE_APP_README.md for architecture details
3. Review error messages in terminal
4. Check backend terminal for API errors

---

## 🎉 You're All Set!

The app should now be running on your device. Start exploring internships, applying, and chatting with the AI assistant!

**Happy Testing! 🚀**
