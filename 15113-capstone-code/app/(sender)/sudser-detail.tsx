import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { mockSudsers, serviceOptions } from '@/lib/mock-data';

export default function SudserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sudser = mockSudsers.find(s => s.id === id);

  if (!sudser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sudser not found</Text>
      </View>
    );
  }

  const handleBook = () => {
    router.push({
      pathname: '/create-booking',
      params: { sudserID: sudser.id, sudserName: sudser.name },
    });
  };

  const availabilityText = sudser.availability?.length > 0
    ? `Available ${sudser.availability.length} days/week`
    : 'Availability TBD';

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.photo}>{sudser.profilePhoto || '👤'}</Text>
        <Text style={styles.name}>{sudser.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {sudser.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({sudser.reviewCount} reviews)</Text>
        </View>
      </View>

      {/* Key Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hourly Rate</Text>
          <Text style={styles.infoValue}>${sudser.hourlyRate}/hr</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Availability</Text>
          <Text style={styles.infoValue}>{availabilityText}</Text>
        </View>
      </View>

      {/* Bio */}
      {sudser.bio && (
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{sudser.bio}</Text>
        </View>
      )}

      {/* Services */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Services Offered</Text>
        <View style={styles.servicesGrid}>
          {sudser.services.map(service => {
            const serviceOption = serviceOptions.find(s => s.id === service);
            return (
              <View key={service} style={styles.serviceCard}>
                <Text style={styles.serviceIcon}>
                  {service === 'wash_fold'
                    ? '🧹'
                    : service === 'delicates'
                    ? '🧴'
                    : service === 'dry_cleaning'
                    ? '👔'
                    : '⚡'}
                </Text>
                <Text style={styles.serviceName}>{serviceOption?.name || service}</Text>
                <Text style={styles.servicePrice}>+${serviceOption?.basePrice || 0}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Availability */}
      <View style={styles.availabilitySection}>
        <Text style={styles.sectionTitle}>Weekly Availability</Text>
        {sudser.availability && sudser.availability.length > 0 ? (
          <FlatList
            data={sudser.availability}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.availabilityRow}>
                <Text style={styles.dayText}>{item.day}</Text>
                <Text style={styles.timeText}>
                  {item.startTime} - {item.endTime}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noDataText}>No availability set yet</Text>
        )}
      </View>

      {/* Book Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
        <Text style={styles.bookButtonText}>Book with {sudser.name}</Text>
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
  photo: {
    fontSize: 64,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F39C12',
  },
  reviewCount: {
    fontSize: 13,
    color: '#999',
  },
  infoSection: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  bioSection: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  servicesSection: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    minWidth: 90,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  serviceIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 11,
    color: '#999',
  },
  availabilitySection: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
    marginBottom: 120,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2C3E50',
  },
  timeText: {
    fontSize: 13,
    color: '#666',
  },
  noDataText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 8,
  },
  bookButton: {
    position: 'absolute',
    bottom: 20,
    left: 12,
    right: 12,
    backgroundColor: '#00D4FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 20,
  },
  spacer: {
    height: 80,
  },
});
