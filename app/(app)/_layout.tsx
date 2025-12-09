import { Drawer } from 'expo-router/drawer';
import { Sidebar } from '@/components/layout';

const DrawerContent = (props: any) => <Sidebar {...props} />;

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Home',
        }}
      />
      <Drawer.Screen
        name="browse"
        options={{
          drawerLabel: 'Browse Internships',
        }}
      />
      <Drawer.Screen
        name="ai-chat"
        options={{
          drawerLabel: 'AI Assistant',
        }}
      />
      <Drawer.Screen
        name="applications"
        options={{
          drawerLabel: 'My Applications',
        }}
      />
      <Drawer.Screen
        name="internships"
        options={{
          drawerLabel: 'My Internships',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
        }}
      />
      <Drawer.Screen
        name="internship"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}
