import React, { useCallback } from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function SudserLayout() {
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    router.replace('/login');
  }, [logout]);

  const LogoutButton = () => (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '💧 Drip Dashboard',
          headerRight: () => <LogoutButton />,
          headerStyle: {
            backgroundColor: '#F5F7FA',
          },
          headerTintColor: '#FF6B9D',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="pending-request"
        options={{
          title: 'Booking Request',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#F5F7FA',
          },
          headerTintColor: '#FF6B9D',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="order-detail"
        options={{
          title: 'Order Details',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#F5F7FA',
          },
          headerTintColor: '#FF6B9D',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#F5F7FA',
          },
          headerTintColor: '#FF6B9D',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFE0E0',
    borderRadius: 4,
  },
  logoutText: {
    color: '#E74C3C',
    fontSize: 12,
    fontWeight: '600',
  },
});
