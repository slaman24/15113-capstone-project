import { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import type { Order, OrderStatus } from '@/lib/types';

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

export default function MyOrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [cancelError, setCancelError] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [user]),
  );

  async function loadOrders() {
    const all = (await getItem<Order[]>(STORAGE_KEYS.ORDERS)) ?? [];
    const mine = all
      .filter((o) => o.wearerId === user?.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    setOrders(mine);
  }

  async function handleCancel(order: Order) {
    setCancelError('');
    try {
      const all = (await getItem<Order[]>(STORAGE_KEYS.ORDERS)) ?? [];
      const now = new Date().toISOString();
      const updated = all.map((o) =>
        o.id === order.id ? { ...o, status: 'cancelled' as OrderStatus, updatedAt: now } : o,
      );
      await setItem(STORAGE_KEYS.ORDERS, updated);
      // Refresh both the list and the selected modal if open
      const mine = updated
        .filter((o) => o.wearerId === user?.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      setOrders(mine);
      if (selected?.id === order.id) {
        const updatedSelected = updated.find((o) => o.id === order.id) ?? null;
        setSelected(updatedSelected);
      }
    } catch {
      setCancelError('Could not update order status. Please try again.');
    }
  }

  function renderItem({ item }: { item: Order }) {
    const color = statusColor(item.status);
    return (
      <TouchableOpacity style={styles.card} onPress={() => setSelected(item)} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order …{item.id.slice(-6)}</Text>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{statusLabel(item.status)}</Text>
          </View>
        </View>
        <Text style={styles.cardText}>{itemsSummary(item)}</Text>
        <Text style={styles.cardMuted}>Pickup: {item.pickupTime}</Text>
        {item.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancel(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {cancelError ? <Text style={styles.error}>{cancelError}</Text> : null}

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Detail modal */}
      <Modal
        visible={selected !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <ScrollView contentContainerStyle={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order …{selected.id.slice(-6)}</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Text style={styles.closeBtn}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.badge, { backgroundColor: statusColor(selected.status), alignSelf: 'flex-start', marginBottom: 16 }]}>
              <Text style={styles.badgeText}>{statusLabel(selected.status)}</Text>
            </View>

            <Text style={styles.modalSection}>Items</Text>
            {selected.items.map((it) => (
              <Text key={it.label} style={styles.modalItem}>
                • {it.quantity} {it.label}
              </Text>
            ))}

            <Text style={styles.modalSection}>Pickup Time</Text>
            <Text style={styles.modalDetail}>{selected.pickupTime}</Text>

            {selected.notes ? (
              <>
                <Text style={styles.modalSection}>Notes</Text>
                <Text style={styles.modalDetail}>{selected.notes}</Text>
              </>
            ) : null}

            {selected.status === 'pending' && (
              <TouchableOpacity
                style={[styles.cancelBtn, { marginTop: 24 }]}
                onPress={() => handleCancel(selected)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel Order</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </Modal>
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
  cardText: { color: drip.darkText, fontSize: 14, marginBottom: 4 },
  cardMuted: { color: drip.mutedText, fontSize: 13 },
  cancelBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: drip.error,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelBtnText: { color: drip.error, fontWeight: '600', fontSize: 14 },
  error: { color: drip.error, padding: 16, fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: drip.mutedText, fontSize: 16 },
  // Modal
  modal: { padding: 24 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: drip.darkTeal },
  closeBtn: { color: drip.teal, fontSize: 16, fontWeight: '600' },
  modalSection: {
    fontSize: 13,
    fontWeight: '700',
    color: drip.mutedText,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 6,
  },
  modalItem: { fontSize: 15, color: drip.darkText, marginBottom: 2 },
  modalDetail: { fontSize: 15, color: drip.darkText },
});
