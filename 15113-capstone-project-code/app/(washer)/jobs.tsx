import { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';
import { createReview, getAllUsers, getOrdersByWasher, updateOrder } from '@/lib/database';
import type { Order, OrderStatus, Review, User } from '@/lib/types';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending':     return 'Pending';
    case 'accepted':    return 'Accepted';
    case 'picked_up':   return 'Picked Up';
    case 'washing':     return 'Washing';
    case 'dropped_off': return 'Dropped Off';
    case 'cancelled':   return 'Cancelled';
  }
}

function statusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':     return '#9CA3AF';
    case 'accepted':    return drip.teal;
    case 'picked_up':   return '#F59E0B';
    case 'washing':     return '#8B5CF6';
    case 'dropped_off': return drip.success;
    case 'cancelled':   return drip.error;
  }
}

function itemsSummary(order: Order): string {
  return order.items.map((i) => `${i.quantity} ${i.label}`).join(', ');
}

function formatDateTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' at ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  );
}

const TEMP_LABEL: Record<string, string> = { cold: '❄️ Cold', warm: '🌡️ Warm', hot: '🔥 Hot' };

const STATUS_SORT: Record<OrderStatus, number> = {
  accepted:    0,
  picked_up:   1,
  washing:     2,
  dropped_off: 3,
  cancelled:   4,
  pending:     5,
};

// ─── Next-status map ─────────────────────────────────────────────────────────

type ActionMap = { nextStatus: OrderStatus; label: string; color: string };

function nextAction(status: OrderStatus): ActionMap | null {
  switch (status) {
    case 'accepted':  return { nextStatus: 'picked_up',   label: 'Mark Picked Up',   color: drip.teal };
    case 'picked_up': return { nextStatus: 'washing',     label: 'Start Washing',    color: '#8B5CF6' };
    case 'washing':   return { nextStatus: 'dropped_off', label: 'Mark Dropped Off', color: drip.success };
    default:          return null;
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function MyJobsScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Order[]>([]);
  const [wearerNames, setWearerNames] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Rating modal state
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingText, setRatingText] = useState('');
  const [ratingSaving, setRatingSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [user]),
  );

  function loadJobs() {
    if (!user) return;
    const mine = getOrdersByWasher(user.id);
    mine.sort((a, b) => (STATUS_SORT[a.status] ?? 5) - (STATUS_SORT[b.status] ?? 5));
    setJobs(mine);
    const users: User[] = getAllUsers();
    const names: Record<string, string> = {};
    users.forEach((u) => { names[u.id] = u.displayName; });
    setWearerNames(names);
  }

  function handleUpdateStatus(order: Order, nextStatus: OrderStatus) {
    setError('');
    setUpdatingId(order.id);
    try {
      const now = new Date().toISOString();
      const updated: Order = {
        ...order,
        status: nextStatus,
        statusTimestamps: { ...order.statusTimestamps, [nextStatus]: now },
        updatedAt: now,
      };
      updateOrder(updated);
      setJobs((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      if (nextStatus === 'dropped_off') {
        setRatingOrder(updated);
        setRating(0);
        setRatingText('');
      }
    } catch {
      setError('Could not update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  }

  function handleSubmitRating() {
    if (!ratingOrder || rating === 0 || !user) return;
    setRatingSaving(true);
    try {
      const newReview: Review = {
        id: generateId(),
        orderId: ratingOrder.id,
        wearerId: ratingOrder.wearerId,
        washerId: user.id,
        rating,
        text: ratingText.trim(),
        reviewerRole: 'washer',
        createdAt: new Date().toISOString(),
      };
      createReview(newReview);
    } finally {
      setRatingSaving(false);
      dismissRatingModal();
    }
  }

  function dismissRatingModal() {
    setRatingOrder(null);
    setRating(0);
    setRatingText('');
  }

  function renderItem({ item }: { item: Order }) {
    const isUpdating = updatingId === item.id;
    const action = nextAction(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order …{item.id.slice(-6)}</Text>
          <View style={[styles.badge, { backgroundColor: statusColor(item.status) }]}>
            <Text style={styles.badgeText}>{statusLabel(item.status)}</Text>
          </View>
        </View>

        <Text style={styles.wearer}>
          Wearer: {wearerNames[item.wearerId] ?? 'Unknown'}
        </Text>
        <Text style={styles.cardText}>{itemsSummary(item)}</Text>
        <Text style={styles.cardMuted}>📅 Pick-up: {formatDateTime(item.pickupDateTime)}</Text>
        <Text style={styles.cardMuted}>📍 {item.pickupLocation}</Text>
        {item.dropoffDateTime ? (
          <Text style={styles.cardMuted}>🏠 Drop-off: {formatDateTime(item.dropoffDateTime)}</Text>
        ) : null}
        {item.dropoffLocation && item.dropoffLocation !== item.pickupLocation ? (
          <Text style={styles.cardMuted}>📍 Drop-off: {item.dropoffLocation}</Text>
        ) : null}
        <Text style={styles.cardMuted}>{TEMP_LABEL[item.waterTemp] ?? item.waterTemp}</Text>
        {item.price > 0 && (
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>
              💰 ${item.price.toFixed(2)}{item.dropoffDateTime && (new Date(item.dropoffDateTime).getTime() - new Date(item.pickupDateTime).getTime()) < 12 * 60 * 60 * 1000 ? '  ⚡ Speed' : ''}
            </Text>
          </View>
        )}

        {action && (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: action.color },
              isUpdating && styles.btnDisabled,
            ]}
            onPress={() => handleUpdateStatus(item, action.nextStatus)}
            disabled={isUpdating || updatingId !== null}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnText}>
              {isUpdating ? 'Updating…' : action.label}
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

      {/* ── Rate Wearer Modal ──────────────────────────────────────────────── */}
      <Modal
        visible={ratingOrder !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={dismissRatingModal}
      >
        {ratingOrder && (
          <ScrollView contentContainerStyle={styles.ratingModal}>
            <Text style={styles.ratingTitle}>Rate Your Wearer</Text>
            <Text style={styles.ratingSubtitle}>
              How was your experience with{' '}
              {wearerNames[ratingOrder.wearerId] ?? 'this wearer'}?
            </Text>

            <Text style={styles.ratingPrompt}>Consider:</Text>
            <Text style={styles.ratingBullet}>• Were they available for pickup on time?</Text>
            <Text style={styles.ratingBullet}>• Were their items ready and as described?</Text>
            <Text style={styles.ratingBullet}>• Were they polite and easy to reach?</Text>
            <Text style={styles.ratingBullet}>• Did they confirm the drop-off location clearly?</Text>

            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRating(n)} disabled={ratingSaving}>
                  <Text style={styles.starOption}>{n <= rating ? '★' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.ratingInput}
              placeholder="Leave a comment (optional)"
              placeholderTextColor={drip.mutedText}
              value={ratingText}
              onChangeText={setRatingText}
              multiline
              maxLength={200}
              editable={!ratingSaving}
            />

            <TouchableOpacity
              style={[
                styles.ratingBtn,
                (ratingSaving || rating === 0) && styles.btnDisabled,
              ]}
              onPress={handleSubmitRating}
              disabled={ratingSaving || rating === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.ratingBtnText}>
                {ratingSaving ? 'Saving…' : 'Submit Rating'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipBtn}
              onPress={dismissRatingModal}
              activeOpacity={0.8}
            >
              <Text style={styles.skipBtnText}>Skip</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

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
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: drip.white, fontSize: 12, fontWeight: '600' },
  wearer: { color: drip.mutedText, fontSize: 13, marginBottom: 4 },
  cardText: { color: drip.darkText, fontSize: 14, marginBottom: 4 },
  cardMuted: { color: drip.mutedText, fontSize: 13, marginBottom: 2 },
  actionBtn: {
    marginTop: 12,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  actionBtnText: { color: drip.white, fontWeight: '700', fontSize: 14 },
  error: { color: drip.error, padding: 16, fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: drip.mutedText, fontSize: 16 },
  priceTag: {
    marginTop: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  priceText: { fontSize: 14, fontWeight: '700', color: drip.success },
  // Rating modal
  ratingModal: { padding: 28 },
  ratingTitle: { fontSize: 22, fontWeight: '700', color: drip.darkTeal, marginBottom: 8 },
  ratingSubtitle: { fontSize: 15, color: drip.darkText, marginBottom: 20 },
  ratingPrompt: { fontSize: 14, fontWeight: '600', color: drip.mutedText, marginBottom: 8 },
  ratingBullet: { fontSize: 14, color: drip.darkText, marginBottom: 4, paddingLeft: 4 },
  starRow: { flexDirection: 'row', gap: 8, marginTop: 20, marginBottom: 16 },
  starOption: { fontSize: 36, color: drip.gold },
  ratingInput: {
    borderWidth: 1.5,
    borderColor: drip.lightAqua,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: drip.darkText,
    backgroundColor: '#F9FAFB',
    minHeight: 72,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  ratingBtn: {
    backgroundColor: drip.success,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBtnText: { color: drip.white, fontWeight: '700', fontSize: 16 },
  skipBtn: { paddingVertical: 12, alignItems: 'center' },
  skipBtnText: { color: drip.mutedText, fontSize: 14, textDecorationLine: 'underline' },
});
