import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { mockSudsers, serviceOptions } from '@/lib/mock-data';
import { ServiceType } from '@/types';

export default function BrowseSudsersScreen() {
  const [selectedService, setSelectedService] = useState<ServiceType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating');

  // Filter and sort sudsers
  let filtered = mockSudsers;
  if (selectedService !== 'all') {
    filtered = filtered.filter(s => s.services.includes(selectedService));
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else {
      return a.hourlyRate - b.hourlyRate;
    }
  });

  const handleSelectSudser = (sudser: typeof mockSudsers[0]) => {
    router.push({
      pathname: '/sudser-detail',
      params: { id: sudser.id, name: sudser.name },
    });
  };

  return (
    <View style={styles.container}>
      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        <Pressable
          style={[
            styles.filterChip,
            selectedService === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setSelectedService('all')}
        >
          <Text
            style={[
              styles.filterText,
              selectedService === 'all' && styles.filterTextActive,
            ]}
          >
            All Services
          </Text>
        </Pressable>
        {serviceOptions.map(service => (
          <Pressable
            key={service.id}
            style={[
              styles.filterChip,
              selectedService === service.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedService(service.id)}
          >
            <Text
              style={[
                styles.filterText,
                selectedService === service.id && styles.filterTextActive,
              ]}
            >
              {service.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort: </Text>
        <Pressable
          style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
          onPress={() => setSortBy('rating')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'rating' && styles.sortButtonTextActive,
            ]}
          >
            ⭐ Top Rated
          </Text>
        </Pressable>
        <Pressable
          style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
          onPress={() => setSortBy('price')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'price' && styles.sortButtonTextActive,
            ]}
          >
            💰 Price
          </Text>
        </Pressable>
      </View>

      {/* Sudsers List */}
      <FlatList
        data={sorted}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sudserCard}
            onPress={() => handleSelectSudser(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.sudserPhoto}>{item.profilePhoto || '👤'}</Text>
              <View style={styles.sudserInfo}>
                <Text style={styles.sudserName}>{item.name}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
                  <Text style={styles.reviewCount}>({item.reviewCount} reviews)</Text>
                </View>
              </View>
              <Text style={styles.hourlyRate}>${item.hourlyRate}/hr</Text>
            </View>

            {item.bio && (
              <Text style={styles.bio} numberOfLines={2}>
                {item.bio}
              </Text>
            )}

            <View style={styles.servicesContainer}>
              {item.services.map(service => {
                const serviceOption = serviceOptions.find(s => s.id === service);
                return (
                  <View key={service} style={styles.serviceBadge}>
                    <Text style={styles.serviceBadgeText}>
                      {serviceOption?.name || service}
                    </Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => handleSelectSudser(item)}
            >
              <Text style={styles.bookButtonText}>View & Book →</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No Sudsers available for this service. Try another!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  filterScroll: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 4,
  },
  filterChipActive: {
    backgroundColor: '#00D4FF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sortLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#E8E8E8',
  },
  sortButtonActive: {
    backgroundColor: '#00D4FF',
  },
  sortButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sudserCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sudserPhoto: {
    fontSize: 40,
    marginRight: 12,
  },
  sudserInfo: {
    flex: 1,
  },
  sudserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F39C12',
  },
  reviewCount: {
    fontSize: 11,
    color: '#999',
  },
  hourlyRate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00D4FF',
  },
  bio: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  serviceBadge: {
    backgroundColor: '#E0F7FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  serviceBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#00D4FF',
  },
  bookButton: {
    backgroundColor: '#00D4FF',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
