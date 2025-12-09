# Internship Student Mobile App - Navigation Guide

## Accessing the Sidebar Menu

The app uses a **drawer navigation** pattern with a sidebar on the left side of the screen.

### How to Open the Sidebar

There are two ways to access the sidebar menu:

#### Method 1: Swipe Gesture (Recommended)
- **Swipe from the left edge of the screen** towards the right
- Start your finger at the very edge of the screen and drag to the right
- The drawer will slide out smoothly

#### Method 2: Header Menu Button (if available)
- Look for a menu icon (☰) in the top-left corner of some screens
- Tap it to open the sidebar

### What's in the Sidebar

The sidebar contains:

1. **Profile Section**
   - Your avatar/profile photo
   - Your name and email
   - Current theme indicator

2. **Navigation Menu**
   - 🔍 **Browse** - Browse and filter internships by industry
   - 📄 **Applications** - View your submitted applications
   - 💼 **My Internships** - Active internships you're enrolled in
   - 📝 **Assignments** - View and submit assignments
   - 👤 **Profile** - Manage your profile and CV
   - 🤖 **AI Chat** - Get help from AI assistant

3. **Theme Toggle**
   - Switch between light and dark mode
   - Toggle icon: 🌙 (dark mode) / ☀️ (light mode)

4. **Logout Button**
   - Sign out of your account

### Tips

- The drawer can be closed by:
  - Swiping back to the left
  - Tapping outside the drawer area
  - Selecting a menu item (navigates and closes drawer)

- The sidebar is accessible from all main screens in the app
- Your current screen is highlighted in the menu

### Industries Filter Feature

On the **Browse** screen, you'll see industry chips at the top. These are **dynamically loaded** from the companies in the database:

- **All** - Shows all internships
- Other industries are fetched from companies (e.g., Technology, Healthcare, Finance, etc.)
- When you select an industry, only internships from companies in that industry are shown
- No hardcoded data - everything is real-time from Firestore

### Troubleshooting

**Sidebar won't open?**
- Make sure you're swiping from the very edge of the screen
- Try using a slower, deliberate swipe motion
- Ensure gesture handler is enabled in your device settings

**Menu items not responding?**
- Check if you're connected to the internet
- Verify the backend server is running at http://192.168.0.103:3000
- Try logging out and logging back in
