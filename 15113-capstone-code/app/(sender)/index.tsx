import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useBookings } from '@/context/bookings-context';

export default function SenderHome() {
  const { user } = useAuth();
  const { bookings, notifications } = useBookings();

  const activeBookings = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <ScrollView style={styles.container}>
      {/* Notifications */}
      {notifications.length > 0 && (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.notification,
                {
                  backgroundColor:
                    item.type === 'success' ? '#E8F5E9' : item.type === 'error' ? '#FFEBEE' : '#E3F2FD',
                },
              ]}
            >
              <Text
                style={[
                  styles.notificationText,
                  {
                    color:
                      item.type === 'success' ? '#2E7D32' : item.type === 'error' ? '#C62828' : '#1565C0',
                  },
                ]}
              >
                {item.message}
              </Text>
            </View>
          )}
        />
      )}

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>Hey {user?.name?.split(' ')[0]}! 👋</Text>
        <Text style={styles.tagline}>Let&apos;s take laundry off your plate</Text>
      </View>

      {/* Main Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/browse-sudsers')}
        >
          <Text style={styles.primaryButtonEmoji}>📋</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.primaryButtonTitle}>Browse Sudsers</Text>
            <Text style={styles.primaryButtonSubtitle}>Find someone to help</Text>
          </View>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        {activeBookings.length > 0 && (
          <TouchableOpacity
            style={[styles.primaryButton, styles.secondaryButton]}
            onPress={() => router.push({ pathname: '/order-detail', params: { id: activeBookings[0].id } })}
          >
            <Text style={styles.primaryButtonEmoji}>📦</Text>
            <View style={styles.buttonContent}>
              <Text style={styles.primaryButtonTitle}>Active Orders</Text>
              <Text style={styles.primaryButtonSubtitle}>{activeBookings.length} booking(s)</Text>
            </View>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Active Orders */}
      {activeBookings.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Active Orders</Text>
          {activeBookings.map(booking => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingCard}
              onPress={() => router.push({ pathname: '/order-detail', params: { id: booking.id } })}
            >
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingName}>{booking.sudserName}</Text>
                <Text style={[styles.status, { color: booking.status === 'accepted' ? '#4CAF50' : '#3498DB' }]}>
                  {booking.status === 'accepted' ? '✓ Confirmed' : '⏳ Pending'}
                </Text>
              </View>
              <Text style={styles.bookingDate}>
                Pickup: {booking.pickupDate} @ {booking.pickupTime}
              </Text>
              <Text style={styles.bookingServices}>
                {booking.services.join(', ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeBookings.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedBookings.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoSection}>
        <TouchableOpacity
          style={styles.infoLink}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.infoText}>👤 View/Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  notification: {
    margin: 12,
    padding: 12,
    borderRadius: 8,
  },
  notificationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hero: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
  },
  actions: {
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#00D4FF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    borderLeftColor: '#FF6B9D',
  },
  primaryButtonEmoji: {
    fontSize: 28,
  },
  buttonContent: {
    flex: 1,
  },
  primaryButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  primaryButtonSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  buttonArrow: {
    fontSize: 20,
    color: '#00D4FF',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00D4FF',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  bookingServices: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00D4FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  infoSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  infoLink: {
    backgroundColor: '#E0F7FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  infoText: {
    color: '#00D4FF',
    fontSize: 14,
    fontWeight: '500',
  },
});
