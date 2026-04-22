import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';
import { ActivityIndicator, View } from 'react-native';

export default function WearerLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={drip.teal} size="large" />
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;
  if (user.role !== 'wearer') return <Redirect href="/(washer)" />;

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
          title: 'Place Order',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'My Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
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
      <Tabs.Screen
        name="washers"
        options={{
          title: 'Washers',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
