import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useBookings } from '@/context/bookings-context';
import { serviceOptions } from '@/lib/mock-data';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { acceptedOrders, markReadyForPickup } = useBookings();
  const order = acceptedOrders.find(o => o.id === id);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const handleMarkReady = () => {
    Alert.alert('Mark as Ready', 'Confirm the laundry is ready for pickup?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Ready',
        onPress: () => {
          markReadyForPickup(order.id);
          Alert.alert('✓ Marked as Ready!', `${order.senderName} has been notified`);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.status}>✓ Accepted</Text>
        <Text style={styles.senderName}>{order.senderName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesList}>
          {order.services.map(service => {
            const serviceOpt = serviceOptions.find(s => s.id === service);
            return (
              <View key={service} style={styles.serviceItem}>
                <Text style={styles.serviceBadge}>{serviceOpt?.name}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{order.pickupDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{order.pickupTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{order.senderAddress}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Return</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{order.returnDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{order.returnTime}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sender</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{order.senderName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{order.senderPhone}</Text>
        </View>
      </View>

      {order.specialNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Notes</Text>
          <Text style={styles.notes}>{order.specialNotes}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings</Text>
        <View style={styles.earningsCard}>
          <Text style={styles.earningsAmount}>${order.estimatedPrice}</Text>
          <Text style={styles.earningsLabel}>You will receive upon completion</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.readyButton} onPress={handleMarkReady}>
        <Text style={styles.readyButtonText}>✓ Mark Ready for Pickup</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactButtonText}>📞 Call {order.senderName}</Text>
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
  header: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 8,
  },
  senderName: {
    fontSize: 24,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceItem: {
    backgroundColor: '#FFE0E8',
    borderRadius: 6,
  },
  serviceBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  notes: {
    fontSize: 13,
    color: '#2C3E50',
    lineHeight: 18,
    backgroundColor: '#F5F7FA',
    padding: 10,
    borderRadius: 6,
  },
  earningsCard: {
    backgroundColor: '#FFE0E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  earningsAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 11,
    color: '#FF6B9D',
  },
  readyButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 12,
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  readyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: '#FF6B9D',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 20,
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
