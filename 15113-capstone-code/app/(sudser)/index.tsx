import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useBookings } from '@/context/bookings-context';

export default function SudserDashboard() {
  const { user } = useAuth();
  const { pendingRequests, acceptedOrders, completedOrders, notifications } = useBookings();
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'completed'>('pending');

  const sudserUser = user as any;

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
        <Text style={styles.greeting}>Welcome back, {user?.name?.split(' ')[0]}! 👋</Text>
        <Text style={styles.tagline}>Manage your laundry orders</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingRequests.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{acceptedOrders.length}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedOrders.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Earnings Card */}
      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>Estimated Earnings This Week</Text>
        <Text style={styles.earningsValue}>
          ${(
            acceptedOrders.reduce((sum, order) => sum + order.estimatedPrice, 0) +
            completedOrders.reduce((sum, order) => sum + order.estimatedPrice, 0)
          ).toFixed(2)}
        </Text>
        <Text style={styles.earningsHint}>Based on accepted and completed orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'pending' && styles.tabTextActive,
            ]}
          >
            Pending ({pendingRequests.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'accepted' && styles.tabActive]}
          onPress={() => setActiveTab('accepted')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'accepted' && styles.tabTextActive,
            ]}
          >
            Accepted ({acceptedOrders.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' && styles.tabTextActive,
            ]}
          >
            Completed ({completedOrders.length})
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.ordersSection}>
        {activeTab === 'pending' && (
          <>
            {pendingRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📬</Text>
                <Text style={styles.emptyText}>No pending requests</Text>
                <Text style={styles.emptySubtext}>
                  New booking requests will appear here
                </Text>
              </View>
            ) : (
              pendingRequests.map(request => (
                <TouchableOpacity
                  key={request.id}
                  style={styles.orderCard}
                  onPress={() =>
                    router.push({
                      pathname: '/pending-request',
                      params: { id: request.id },
                    })
                  }
                >
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.senderName}>{request.senderName}</Text>
                      <Text style={styles.orderTime}>
                        Pickup: {request.pickupTime}
                      </Text>
                    </View>
                    <Text style={styles.price}>${request.estimatedPrice}</Text>
                  </View>
                  <Text style={styles.services}>
                    {request.services.join(', ')}
                  </Text>
                  <Text style={styles.actionHint}>Tap to review →</Text>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {activeTab === 'accepted' && (
          <>
            {acceptedOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>✓</Text>
                <Text style={styles.emptyText}>No accepted orders yet</Text>
                <Text style={styles.emptySubtext}>
                  Accept pending requests to see them here
                </Text>
              </View>
            ) : (
              acceptedOrders.map(order => (
                <TouchableOpacity
                  key={order.id}
                  style={[styles.orderCard, styles.acceptedOrderCard]}
                  onPress={() =>
                    router.push({
                      pathname: '/order-detail',
                      params: { id: order.id },
                    })
                  }
                >
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.senderName}>{order.senderName}</Text>
                      <Text style={styles.orderTime}>
                        {order.pickupDate} @ {order.pickupTime}
                      </Text>
                    </View>
                    <Text style={styles.price}>${order.estimatedPrice}</Text>
                  </View>
                  <Text style={styles.services}>
                    {order.services.join(', ')}
                  </Text>
                  <Text style={styles.actionHint}>Tap to manage →</Text>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🎉</Text>
                <Text style={styles.emptyText}>No completed orders yet</Text>
                <Text style={styles.emptySubtext}>
                  Mark orders as ready for pickup to complete them
                </Text>
              </View>
            ) : (
              completedOrders.map(order => (
                <TouchableOpacity
                  key={order.id}
                  style={[styles.orderCard, styles.completedOrderCard]}
                >
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.senderName}>{order.senderName}</Text>
                      <Text style={styles.orderTime}>
                        Completed: {order.returnDate}
                      </Text>
                    </View>
                    <Text style={styles.price}>${order.estimatedPrice}</Text>
                  </View>
                  <Text style={styles.completedBadge}>✓ Completed</Text>
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </View>

      {/* Profile Link */}
      <TouchableOpacity
        style={styles.profileLink}
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.profileLinkText}>👤 View/Edit Profile</Text>
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
    color: '#FF6B9D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  earningsCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  earningsHint: {
    fontSize: 12,
    color: '#999',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF6B9D',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
  },
  tabTextActive: {
    color: '#FF6B9D',
    fontWeight: '600',
  },
  ordersSection: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  acceptedOrderCard: {
    borderLeftColor: '#4CAF50',
  },
  completedOrderCard: {
    borderLeftColor: '#2196F3',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  senderName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  services: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  actionHint: {
    fontSize: 11,
    color: '#FF6B9D',
    fontWeight: '500',
  },
  completedBadge: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  profileLink: {
    backgroundColor: '#FFE0E8',
    marginHorizontal: 24,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  profileLinkText: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '500',
  },
  spacer: {
    height: 40,
  },
});
