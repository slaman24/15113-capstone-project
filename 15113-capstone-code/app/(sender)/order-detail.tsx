import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useBookings } from '@/context/bookings-context';
import { serviceOptions } from '@/lib/mock-data';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getBooking } = useBookings();
  const booking = getBooking(id || '');

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const statusColor =
    booking.status === 'accepted'
      ? '#4CAF50'
      : booking.status === 'completed'
      ? '#2196F3'
      : '#FF9800';

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.statusBanner, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>
          {booking.status === 'accepted'
            ? '✓ Confirmed'
            : booking.status === 'pending'
            ? '⏳ Pending'
            : '✓ Completed'}
        </Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.sudserPhoto}>{booking.sudserName === 'Sarah' ? '👩' : booking.sudserName === 'James' ? '👨' : booking.sudserName === 'Priya' ? '👱‍♀️' : booking.sudserName === 'DeAndre' ? '🧑' : '👤'}</Text>
        <Text style={styles.name}>{booking.sudserName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>{booking.id}</Text>

        <Text style={[styles.label, { marginTop: 12 }]}>Services</Text>
        <View style={styles.services}>
          {booking.services.map(service => {
            const serviceOpt = serviceOptions.find(s => s.id === service);
            return (
              <View key={service} style={styles.serviceBadge}>
                <Text style={styles.serviceBadgeText}>{serviceOpt?.name}</Text>
              </View>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>Special Notes</Text>
        <Text style={styles.value}>
          {booking.specialNotes || 'None'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleColumn}>
            <Text style={styles.scheduleLabel}>Pickup</Text>
            <Text style={styles.scheduleValue}>{booking.pickupDate}</Text>
            <Text style={styles.scheduleTime}>{booking.pickupTime}</Text>
          </View>
          <View style={styles.scheduleArrow}>
            <Text style={styles.arrow}>→</Text>
          </View>
          <View style={styles.scheduleColumn}>
            <Text style={styles.scheduleLabel}>Return</Text>
            <Text style={styles.scheduleValue}>{booking.returnDate}</Text>
            <Text style={styles.scheduleTime}>{booking.returnTime}</Text>
          </View>
        </View>

        {booking.pickupAddress && (
          <>
            <Text style={[styles.label, { marginTop: 12 }]}>Pickup Location</Text>
            <Text style={styles.value}>{booking.pickupAddress}</Text>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Estimated Total</Text>
          <Text style={styles.priceValue}>${booking.estimatedPrice}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactButtonText}>📞 Call {booking.sudserName}</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  statusBanner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
  },
  sudserPhoto: {
    fontSize: 48,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceBadge: {
    backgroundColor: '#E0F7FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  serviceBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#00D4FF',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleColumn: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
    marginBottom: 4,
  },
  scheduleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 12,
    color: '#666',
  },
  scheduleArrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#00D4FF',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00D4FF',
  },
  contactButton: {
    backgroundColor: '#FF6B9D',
    marginHorizontal: 12,
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 20,
  },
  spacer: {
    height: 40,
  },
});
