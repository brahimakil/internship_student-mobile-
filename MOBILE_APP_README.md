# Internship Student Mobile App

React Native mobile application for students to browse internships, apply, track applications, complete assignments, and interact with an AI assistant.

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native 0.76.0 with Expo SDK 52
- **Navigation**: Expo Router with Drawer (left sidebar)
- **UI Library**: React Native Paper + Custom Components
- **Icons**: @expo/vector-icons (Ionicons)
- **API**: Axios with Firebase Auth
- **State**: React Context (Auth, Theme)
- **Backend**: NestJS REST API
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage

### Project Structure

```
internship_student/
├── app/                      # Expo Router pages
│   ├── _layout.tsx          # Root layout with providers
│   ├── index.tsx            # Auth redirect
│   ├── (auth)/              # Authentication group
│   │   ├── _layout.tsx      # Auth stack layout
│   │   ├── login.tsx        # Login screen
│   │   └── register.tsx     # Register screen
│   └── (app)/               # Main app group (protected)
│       ├── _layout.tsx      # Drawer navigation layout
│       ├── browse.tsx       # Browse internships with industry filter
│       ├── applications.tsx # My applications
│       ├── internships.tsx  # My enrolled internships
│       ├── assignments.tsx  # Assignments view/submit
│       ├── profile.tsx      # Student profile
│       └── ai-chat.tsx      # AI assistant chat
│
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx       # Themed button (4 variants, 3 sizes)
│   │   ├── Card.tsx         # Themed card container
│   │   ├── Input.tsx        # Themed text input with icons
│   │   ├── Badge.tsx        # Status badge (5 variants)
│   │   ├── Avatar.tsx       # User avatar with initials fallback
│   │   ├── Chip.tsx         # Filter/tag chip (selectable)
│   │   └── index.ts         # Barrel export
│   └── layout/              # Layout components
│       ├── Screen.tsx       # Screen wrapper with SafeArea, StatusBar
│       ├── Header.tsx       # Page header with back button
│       ├── Sidebar.tsx      # Drawer sidebar navigation
│       └── index.ts         # Barrel export
│
├── contexts/
│   ├── ThemeContext.tsx     # Light/Dark theme provider
│   └── AuthContext.tsx      # Firebase auth state provider
│
├── hooks/
│   ├── useTheme.ts          # Theme context hook
│   └── useAuth.ts           # Auth context hook
│
├── services/
│   ├── firebase/
│   │   ├── config.ts        # Firebase initialization
│   │   ├── auth.ts          # Auth functions (login, register, logout)
│   │   └── storage.ts       # File upload (CV, profile photo)
│   └── api/
│       ├── client.ts        # Axios instance with auth interceptor
│       ├── internships.ts   # Internships API
│       ├── applications.ts  # Applications API
│       ├── enrollments.ts   # Enrollments API
│       ├── assignments.ts   # Assignments API
│       ├── students.ts      # Students/Profile API
│       ├── ai.ts            # AI chat/assistant API
│       └── index.ts         # Barrel export
│
├── types/
│   └── index.ts             # TypeScript interfaces (Student, Internship, etc.)
│
├── constants/
│   ├── theme.ts             # Light/Dark theme definitions
│   ├── api.ts               # API endpoints & base URL
│   └── icons.ts             # Icon mappings
│
└── assets/                  # Images, fonts

```

## 🎨 Features

### Authentication
- ✅ Firebase Authentication
- ✅ Login/Register screens
- ✅ Auto-redirect based on auth state
- ✅ Persistent session

### Navigation
- ✅ Left sidebar drawer (not bottom tabs)
- ✅ Route-based navigation
- ✅ Protected routes
- ✅ Theme toggle in sidebar

### Theming
- ✅ Light/Dark mode support
- ✅ System theme detection
- ✅ Manual theme toggle
- ✅ Consistent color palette

### UI Components (Reusable)
- ✅ Button (primary, secondary, outline, danger variants)
- ✅ Card (elevation support)
- ✅ Input (with icons, password toggle)
- ✅ Badge (success, warning, error, info, default)
- ✅ Avatar (with image or initials)
- ✅ Chip (selectable filters/tags)

### Screens
- ✅ Browse Internships
  - Industry filter (Technology, Finance, Healthcare, etc.)
  - List view with cards
  - Pull to refresh
- ✅ My Applications
- ✅ My Internships (Enrollments)
- ✅ Assignments (View/Submit)
- ✅ Profile (CV, photo, Gemini API key)
- ✅ AI Assistant Chat

## 🔧 Configuration

### API Configuration
Update `constants/api.ts` for different environments:

```typescript
// Development (Android Emulator)
export const API_BASE_URL = 'http://10.0.2.2:3000';

// Development (iOS Simulator)
export const API_BASE_URL = 'http://localhost:3000';

// Development (Physical Device)
export const API_BASE_URL = 'http://192.168.x.x:3000';

// Production
export const API_BASE_URL = 'https://your-api.com';
```

### Firebase Configuration
Firebase credentials are in `services/firebase/config.ts` (already configured).

## 🚀 Running the App

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Expo Go app (for testing on device)

### Installation
```bash
cd internship_student
npm install
```

### Development
```bash
# Start Expo dev server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on Web
npx expo start --web
```

### Backend
Make sure the NestJS backend is running:
```bash
cd ../internship_backend
npm run start:dev
```

## 📱 Screens Overview

### Browse Internships
- Filter by industry (All, Technology, Finance, Healthcare, etc.)
- Display internship cards with:
  - Title, company, location, dates
  - Status badge (active/inactive)
  - Industry and duration chips
- Tap card to view details

### My Applications
- List of submitted applications
- Status tracking (pending, accepted, rejected)
- Application date

### My Internships
- Active enrollments
- Internship details
- Link to assignments

### Assignments
- View assigned tasks
- Submit work (file upload)
- Track submission status

### Profile
- View/edit student info
- Upload CV (PDF)
- Upload profile photo
- Set Gemini API key for AI features

### AI Assistant
- Chat interface
- CV-based responses (uses uploaded CV)
- Internship-specific Q&A
- Powered by Gemini 2.0 Flash

## 🎯 Design Principles

1. **Reusability**: All UI components are reusable and themeable
2. **Consistency**: Unified color palette and spacing system
3. **Modern Design**: Clean, minimal, professional
4. **Accessibility**: Proper contrast, touch targets, labels
5. **Performance**: Lazy loading, optimized renders, memoization

## 🔐 Authentication Flow

```
1. App Launch → Check auth state
2. Not authenticated → Redirect to /login
3. Authenticated → Redirect to /browse
4. Login/Register → Firebase Auth → Fetch student data → App
5. Logout → Clear state → Redirect to /login
```

## 🌐 API Integration

All API calls use centralized axios client with:
- Auth token auto-injection (Firebase ID token)
- Error handling
- Request/response interceptors

Example:
```typescript
import { internshipsApi } from '@/services/api';

const internships = await internshipsApi.getAll();
const filtered = await internshipsApi.getByIndustry('Technology');
```

## 📦 Key Dependencies

```json
{
  "expo": "~52.0.0",
  "expo-router": "~4.0.0",
  "react-native": "0.76.0",
  "react-native-paper": "^5.12.0",
  "@expo/vector-icons": "^14.0.0",
  "axios": "^1.6.0",
  "firebase": "^10.7.0",
  "expo-document-picker": "~12.0.0",
  "expo-image-picker": "~15.0.0",
  "date-fns": "^3.0.0"
}
```

## 🎨 Theme Structure

```typescript
interface Theme {
  colors: {
    primary, secondary, background, surface, card,
    text, textPrimary, textSecondary, border,
    error, success, warning, info, shadow, disabled
  };
  spacing: { xs, sm, md, lg, xl };
  borderRadius: { sm, md, lg, xl };
  fontSize: { xs, sm, md, lg, xl };
}
```

## 📝 Next Steps

Complete implementation of:
1. Internship details page
2. Application submission form
3. Assignment submission with file upload
4. AI chat interface with message history
5. Profile editing with CV/photo upload
6. Notifications/alerts
7. Error boundaries
8. Loading states
9. Empty states
10. Form validation

## 🐛 Known Issues

None currently - all base functionality implemented.

## 📄 License

Proprietary - Internship Management Platform
