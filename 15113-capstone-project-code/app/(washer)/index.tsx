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
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import type { Order, OrderStatus, User } from '@/lib/types';

function itemsSummary(order: Order): string {
  return order.items.map((i) => `${i.quantity} ${i.label}`).join(', ');
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

  async function loadOrders() {
    const [all, users] = await Promise.all([
      getItem<Order[]>(STORAGE_KEYS.ORDERS),
      getItem<User[]>(STORAGE_KEYS.USERS),
    ]);
    const pending = (all ?? [])
      .filter((o) => o.status === 'pending')
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    setOrders(pending);
    const names: Record<string, string> = {};
    (users ?? []).forEach((u) => {
      names[u.id] = u.displayName;
    });
    setWearerNames(names);
  }

  async function handleAccept(order: Order) {
    setError('');
    setAcceptingId(order.id);
    try {
      const all = (await getItem<Order[]>(STORAGE_KEYS.ORDERS)) ?? [];
      const now = new Date().toISOString();
      const updated = all.map((o) =>
        o.id === order.id
          ? { ...o, status: 'accepted' as OrderStatus, washerId: user!.id, updatedAt: now }
          : o,
      );
      await setItem(STORAGE_KEYS.ORDERS, updated);
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
          <Text style={styles.wearer}>
            {wearerNames[item.wearerId] ?? 'Unknown'}
          </Text>
        </View>
        <Text style={styles.cardText}>{itemsSummary(item)}</Text>
        <Text style={styles.cardMuted}>Pickup: {item.pickupTime}</Text>
        <TouchableOpacity
          style={[styles.acceptBtn, isAccepting && styles.btnDisabled]}
          onPress={() => handleAccept(item)}
          disabled={isAccepting || acceptingId !== null}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptBtnText}>
            {isAccepting ? 'Accepting…' : 'Accept'}
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
  cardMuted: { color: drip.mutedText, fontSize: 13 },
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
