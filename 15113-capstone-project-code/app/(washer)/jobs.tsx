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

// ─── Helpers ────────────────────────────────────────────────────────────────

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'accepted': return 'Accepted';
    case 'in_progress': return 'In Progress';
    case 'done': return 'Done';
    case 'cancelled': return 'Cancelled';
  }
}

function statusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending': return '#9CA3AF';
    case 'accepted': return drip.teal;
    case 'in_progress': return '#F59E0B';
    case 'done': return drip.success;
    case 'cancelled': return drip.error;
  }
}

function itemsSummary(order: Order): string {
  return order.items.map((i) => `${i.quantity} ${i.label}`).join(', ');
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function MyJobsScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Order[]>([]);
  const [wearerNames, setWearerNames] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [user]),
  );

  async function loadJobs() {
    const [all, users] = await Promise.all([
      getItem<Order[]>(STORAGE_KEYS.ORDERS),
      getItem<User[]>(STORAGE_KEYS.USERS),
    ]);
    const mine = (all ?? []).filter((o) => o.washerId === user?.id);
    setJobs(mine);
    const names: Record<string, string> = {};
    (users ?? []).forEach((u) => {
      names[u.id] = u.displayName;
    });
    setWearerNames(names);
  }

  async function updateStatus(order: Order, nextStatus: OrderStatus) {
    setError('');
    setUpdatingId(order.id);
    try {
      const all = (await getItem<Order[]>(STORAGE_KEYS.ORDERS)) ?? [];
      const now = new Date().toISOString();
      const updated = all.map((o) =>
        o.id === order.id ? { ...o, status: nextStatus, updatedAt: now } : o,
      );
      await setItem(STORAGE_KEYS.ORDERS, updated);
      setJobs((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: nextStatus, updatedAt: now } : o,
        ),
      );
    } catch {
      setError('Could not update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  }

  function renderItem({ item }: { item: Order }) {
    const isUpdating = updatingId === item.id;
    const color = statusColor(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order …{item.id.slice(-6)}</Text>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{statusLabel(item.status)}</Text>
          </View>
        </View>
        <Text style={styles.wearer}>
          Wearer: {wearerNames[item.wearerId] ?? 'Unknown'}
        </Text>
        <Text style={styles.cardText}>{itemsSummary(item)}</Text>
        <Text style={styles.cardMuted}>Pickup: {item.pickupTime}</Text>

        {item.status === 'accepted' && (
          <TouchableOpacity
            style={[styles.actionBtn, isUpdating && styles.btnDisabled]}
            onPress={() => updateStatus(item, 'in_progress')}
            disabled={isUpdating || updatingId !== null}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnText}>
              {isUpdating ? 'Updating…' : 'Mark Picked Up'}
            </Text>
          </TouchableOpacity>
        )}

        {item.status === 'in_progress' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.doneBtn, isUpdating && styles.btnDisabled]}
            onPress={() => updateStatus(item, 'done')}
            disabled={isUpdating || updatingId !== null}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnText}>
              {isUpdating ? 'Updating…' : 'Mark Done'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {jobs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No jobs assigned yet.</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
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
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: drip.white, fontSize: 12, fontWeight: '600' },
  wearer: { color: drip.mutedText, fontSize: 13, marginBottom: 4 },
  cardText: { color: drip.darkText, fontSize: 14, marginBottom: 4 },
  cardMuted: { color: drip.mutedText, fontSize: 13 },
  actionBtn: {
    marginTop: 12,
    backgroundColor: drip.teal,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  doneBtn: { backgroundColor: drip.success },
  btnDisabled: { opacity: 0.5 },
  actionBtnText: { color: drip.white, fontWeight: '700', fontSize: 14 },
  error: { color: drip.error, padding: 16, fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: drip.mutedText, fontSize: 16 },
});
