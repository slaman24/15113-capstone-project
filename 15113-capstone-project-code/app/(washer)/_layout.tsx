import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';
import { ActivityIndicator, View } from 'react-native';

export default function WasherLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={drip.teal} size="large" />
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;
  if (user.role !== 'washer') return <Redirect href="/(wearer)" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: drip.darkTeal,
        tabBarInactiveTintColor: drip.mutedText,
        tabBarStyle: { borderTopColor: drip.lightAqua },
        headerStyle: { backgroundColor: drip.darkTeal },
        headerTintColor: drip.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Available Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'My Jobs',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
