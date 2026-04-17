import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useBookings } from '@/context/bookings-context';
import { serviceOptions } from '@/lib/mock-data';

export default function PendingRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pendingRequests, acceptOrder, declineOrder } = useBookings();
  const request = pendingRequests.find(r => r.id === id);

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Request not found</Text>
      </View>
    );
  }

  const handleAccept = () => {
    Alert.alert(
      'Accept Booking',
      `Confirm that you'll pick up laundry from ${request.senderName} on ${request.pickupDate} at ${request.pickupTime}?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Accept',
          onPress: () => {
            acceptOrder(request.id);
            Alert.alert('✓ Accepted!', 'The sender has been notified.');
            router.back();
          },
        },
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      'Decline Booking',
      'Why are you declining this order? (optional)',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Decline',
          onPress: () => {
            declineOrder(request.id);
            Alert.alert('Order declined');
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.newBadge}>NEW REQUEST</Text>
        <Text style={styles.senderName}>{request.senderName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services Requested</Text>
        <View style={styles.servicesList}>
          {request.services.map(service => {
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
        <Text style={styles.sectionTitle}>Pickup Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{request.pickupDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{request.pickupTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{request.senderAddress}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Return Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Return Date</Text>
          <Text style={styles.value}>{request.returnDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Return Time</Text>
          <Text style={styles.value}>{request.returnTime}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sender Contact</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{request.senderPhone}</Text>
        </View>
      </View>

      {request.specialNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Notes</Text>
          <Text style={styles.notes}>{request.specialNotes}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.paymentCard}>
          <Text style={styles.paymentLabel}>You will receive</Text>
          <Text style={styles.paymentAmount}>${request.estimatedPrice}</Text>
          <Text style={styles.paymentSubtext}>Once order is marked as ready for pickup</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.acceptButtonText}>✓ Accept</Text>
        </TouchableOpacity>
      </View>

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
  newBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 8,
    letterSpacing: 1,
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
  paymentCard: {
    backgroundColor: '#FFE0E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 12,
    color: '#FF6B9D',
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  paymentSubtext: {
    fontSize: 11,
    color: '#FF6B9D',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#FF6B9D',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#666',
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
