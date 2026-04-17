import React, { useCallback } from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function SenderLayout() {
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
          title: '💧 Drip',
          headerRight: () => <LogoutButton />,
          headerStyle: {
            backgroundColor: '#F5F7FA',
          },
          headerTintColor: '#00D4FF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="browse-sudsers"
        options={{
          title: 'Browse Sudsers',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#F5F7FA',
          },
          headerTintColor: '#00D4FF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="sudser-detail"
        options={{
          title: 'Sudser Details',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#F5F7FA',
          },
          headerTintColor: '#00D4FF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="create-booking"
        options={{
          title: 'Create Booking',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#F5F7FA',
          },
          headerTintColor: '#00D4FF',
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
          headerTintColor: '#00D4FF',
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
          headerTintColor: '#00D4FF',
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
