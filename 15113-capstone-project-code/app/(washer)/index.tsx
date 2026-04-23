import { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';
import { getAllUsers, getPendingOrders, updateOrder } from '@/lib/database';
import type { Order, User } from '@/lib/types';

const TEMP_LABEL: Record<string, string> = { cold: '❄️ Cold', warm: '🌡️ Warm', hot: '🔥 Hot' };

function itemsSummary(order: Order): string {
  return order.items.map((i) => `${i.quantity} ${i.label}`).join(', ');
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    + ' at ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function AvailableOrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wearerNames, setWearerNames] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [user]),
  );

  function loadOrders() {
    const pending = getPendingOrders();
    setOrders(pending);
    const users: User[] = getAllUsers();
    const names: Record<string, string> = {};
    users.forEach((u) => { names[u.id] = u.displayName; });
    setWearerNames(names);
  }

  function handleAccept(order: Order) {
    setError('');
    setAcceptingId(order.id);
    try {
      const now = new Date().toISOString();
      const updated: Order = {
        ...order,
        status: 'accepted',
        washerId: user!.id,
        statusTimestamps: { ...order.statusTimestamps, accepted: now },
        updatedAt: now,
      };
      updateOrder(updated);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch {
      setError('Could not accept this order. Please try again.');
    } finally {
      setAcceptingId(null);
    }
  }

  function renderItem({ item }: { item: Order }) {
    const isAccepting = acceptingId === item.id;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order …{item.id.slice(-6)}</Text>
          <Text style={styles.wearer}>{wearerNames[item.wearerId] ?? 'Unknown'}</Text>
        </View>
        <Text style={styles.cardText}>{itemsSummary(item)}</Text>
        <Text style={styles.cardMuted}>📅 {formatDateTime(item.pickupDateTime)}</Text>
        <Text style={styles.cardMuted}>📍 {item.pickupLocation}</Text>
        {item.dropoffDateTime ? (
          <Text style={styles.cardMuted}>🏠 Drop-off: {formatDateTime(item.dropoffDateTime)}</Text>
        ) : null}
        {item.dropoffLocation && item.dropoffLocation !== item.pickupLocation ? (
          <Text style={styles.cardMuted}>📍 Drop-off: {item.dropoffLocation}</Text>
        ) : null}
        <Text style={styles.cardMuted}>{TEMP_LABEL[item.waterTemp] ?? item.waterTemp}</Text>
        <TouchableOpacity
          style={[styles.acceptBtn, isAccepting && styles.btnDisabled]}
          onPress={() => handleAccept(item)}
          disabled={isAccepting || acceptingId !== null}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptBtnText}>
            {isAccepting ? 'Accepting…' : 'Accept Order'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No pending orders right now.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: drip.white },
  list: { padding: 16 },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: drip.lightAqua,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: { fontWeight: '700', fontSize: 15, color: drip.darkText },
  wearer: { color: drip.mutedText, fontSize: 13 },
  cardText: { color: drip.darkText, fontSize: 14, marginBottom: 4 },
  cardMuted: { color: drip.mutedText, fontSize: 13, marginBottom: 2 },
  acceptBtn: {
    marginTop: 12,
    backgroundColor: drip.gold,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  acceptBtnText: { color: drip.darkText, fontWeight: '700', fontSize: 14 },
  error: { color: drip.error, padding: 16, fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: drip.mutedText, fontSize: 16 },
});
