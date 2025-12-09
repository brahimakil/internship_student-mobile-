import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui';
import { useRouter } from 'expo-router';

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const menuItems: MenuItem[] = [
  { id: 'home', title: 'Home', icon: 'home', route: '/home' },
  { id: 'browse', title: 'Browse Internships', icon: 'search', route: '/browse' },
  { id: 'ai-chat', title: 'AI Assistant', icon: 'chatbubbles', route: '/ai-chat' },
  { id: 'applications', title: 'My Applications', icon: 'document-text', route: '/applications' },
  { id: 'internships', title: 'My Internships', icon: 'briefcase', route: '/internships' },
  { id: 'profile', title: 'Profile', icon: 'person', route: '/profile' },
];

export const Sidebar = (props: DrawerContentComponentProps) => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const { student, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* User Profile Section */}
      <View style={[styles.profileSection, { borderBottomColor: theme.colors.border }]}>
        <Avatar
          uri={student?.profilePhotoUrl}
          name={student?.fullName}
          size={60}
        />
        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {student?.fullName || 'Guest'}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
          {student?.email || ''}
        </Text>
        <Text style={[styles.userMajor, { color: theme.colors.textSecondary }]}>
          {student?.major || ''}
        </Text>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => {
          const isActive = props.state.routes[props.state.index]?.name === item.route;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                isActive && {
                  backgroundColor: theme.colors.primary + '20',
                  borderLeftColor: theme.colors.primary,
                  borderLeftWidth: 4,
                },
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                style={styles.menuIcon}
              />
              <Text
                style={[
                  styles.menuText,
                  {
                    color: isActive ? theme.colors.primary : theme.colors.text,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomSection, { borderTopColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={toggleTheme}
        >
          <Ionicons
            name={themeMode === 'dark' ? 'sunny' : 'moon'}
            size={24}
            color={theme.colors.textSecondary}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out"
            size={24}
            color={theme.colors.error}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuText, { color: theme.colors.error }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  userMajor: {
    fontSize: 12,
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
  },
  bottomSection: {
    borderTopWidth: 1,
    paddingVertical: 8,
  },
});
