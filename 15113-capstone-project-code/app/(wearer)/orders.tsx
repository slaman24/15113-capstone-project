import { useCallback, useEffect, useRef, useState } from 'react';
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
import {
  createReview,
  getAllUsers,
  getOrdersByWearer,
  getReviewByOrderAndRole,
  updateOrder,
} from '@/lib/database';
import type { Order, OrderStatus, Review } from '@/lib/types';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

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
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' at ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  );
}

const TEMP_LABEL: Record<string, string> = {
  cold: '❄️ Cold',
  warm: '🌡️ Warm',
  hot: '🔥 Hot',
};

// ─── GrubHub-style status timeline ──────────────────────────────────────────

type Step = { status: OrderStatus; label: string };

const PIPELINE_STEPS: Step[] = [
  { status: 'pending',     label: 'Order Placed' },
  { status: 'accepted',    label: 'Accepted' },
  { status: 'picked_up',   label: 'Picked Up' },
  { status: 'washing',     label: 'Washing' },
  { status: 'dropped_off', label: 'Dropped Off' },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  cancelled:   -1,
  pending:      0,
  accepted:     1,
  picked_up:    2,
  washing:      3,
  dropped_off:  4,
};

function StatusTimeline({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <View style={tlStyles.cancelledBox}>
        <Text style={tlStyles.cancelledText}>Order Cancelled</Text>
      </View>
    );
  }

  const currentIdx = STATUS_ORDER[order.status] ?? 0;

  return (
    <View style={tlStyles.container}>
      {PIPELINE_STEPS.map((step, idx) => {
        const reached = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const ts = order.statusTimestamps[step.status];

        return (
          <View key={step.status} style={tlStyles.row}>
            <View style={tlStyles.lineCol}>
              {idx > 0 && (
                <View style={[tlStyles.line, reached && tlStyles.lineActive]} />
              )}
            </View>
            <View
              style={[
                tlStyles.circle,
                reached && tlStyles.circleActive,
                isCurrent && tlStyles.circleCurrent,
              ]}
            >
              {reached && <View style={tlStyles.circleDot} />}
            </View>
            <View style={tlStyles.labelCol}>
              <Text style={[tlStyles.stepLabel, reached && tlStyles.stepLabelActive]}>
                {step.label}
              </Text>
              {ts && (
                <Text style={tlStyles.stepTime}>
                  {new Date(ts).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' · '}
                  {new Date(ts).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function MyOrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [washerNames, setWasherNames] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Order | null>(null);
  const [cancelError, setCancelError] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  // Rating prompt pop-up
  const seenPromptRef = useRef(new Set<string>());
  const [promptOrder, setPromptOrder] = useState<Order | null>(null);
  const [promptRating, setPromptRating] = useState(0);
  const [promptText, setPromptText] = useState('');
  const [promptSaving, setPromptSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [user]),
  );

  function loadOrders() {
    if (!user) return;
    const mine = getOrdersByWearer(user.id);
    setOrders(mine);
    const users = getAllUsers();
    const names: Record<string, string> = {};
    users.forEach((u) => {
      names[u.id] = u.displayName;
    });
    setWasherNames(names);
    // Check for unreviewed dropped_off orders to prompt
    const toPrompt = mine.find(
      (o) =>
        o.status === 'dropped_off' &&
        o.washerId &&
        !seenPromptRef.current.has(o.id) &&
        getReviewByOrderAndRole(o.id, 'wearer') === null,
    );
    if (toPrompt) {
      setPromptOrder(toPrompt);
      setPromptRating(0);
      setPromptText('');
    }
  }

  useEffect(() => {
    setReviewRating(0);
    setReviewText('');
    setReviewError('');
    if (selected?.id) {
      setExistingReview(getReviewByOrderAndRole(selected.id, 'wearer'));
    } else {
      setExistingReview(null);
    }
  }, [selected?.id]);

  async function handleSubmitReview() {
    if (!selected || reviewRating === 0 || !selected.washerId) return;
    setReviewError('');
    setReviewSaving(true);
    try {
      const newReview: Review = {
        id: generateId(),
        orderId: selected.id,
        wearerId: user!.id,
        washerId: selected.washerId,
        rating: reviewRating,
        text: reviewText.trim(),
        reviewerRole: 'wearer',
        createdAt: new Date().toISOString(),
      };
      createReview(newReview);
      setExistingReview(newReview);
    } catch {
      setReviewError('Could not submit review. Please try again.');
    } finally {
      setReviewSaving(false);
    }
  }

  function handleSubmitPrompt() {
    if (!promptOrder || promptRating === 0 || !user || !promptOrder.washerId) return;
    setPromptSaving(true);
    try {
      const newReview: Review = {
        id: generateId(),
        orderId: promptOrder.id,
        wearerId: user.id,
        washerId: promptOrder.washerId,
        rating: promptRating,
        text: promptText.trim(),
        reviewerRole: 'wearer',
        createdAt: new Date().toISOString(),
      };
      createReview(newReview);
    } finally {
      setPromptSaving(false);
      dismissPrompt();
    }
  }

  function dismissPrompt() {
    if (promptOrder) seenPromptRef.current.add(promptOrder.id);
    setPromptOrder(null);
    setPromptRating(0);
    setPromptText('');
  }

  function handleCancel(order: Order) {
    setCancelError('');
    try {
      const now = new Date().toISOString();
      const updated: Order = {
        ...order,
        status: 'cancelled',
        statusTimestamps: { ...order.statusTimestamps, cancelled: now },
        updatedAt: now,
      };
      updateOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      if (selected?.id === order.id) setSelected(updated);
    } catch {
      setCancelError('Could not update order status. Please try again.');
    }
  }

  function renderItem({ item }: { item: Order }) {
    const color = statusColor(item.status);
    const labelMap: Partial<Record<OrderStatus, string>> = {
      picked_up: 'Picked Up',
      dropped_off: 'Dropped Off',
    };
    const label =
      labelMap[item.status] ??
      item.status.charAt(0).toUpperCase() + item.status.slice(1);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelected(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order …{item.id.slice(-6)}</Text>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{label}</Text>
          </View>
        </View>
        <Text style={styles.cardText}>{itemsSummary(item)}</Text>
        <Text style={styles.cardMuted}>📅 {formatDateTime(item.pickupDateTime)}</Text>
        <Text style={styles.cardMuted}>📍 {item.pickupLocation}</Text>
        {item.price > 0 && (
          <Text style={styles.cardPrice}>💰 ${item.price.toFixed(2)}</Text>
        )}
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

      {/* Rating prompt pop-up */}
      <Modal
        visible={promptOrder !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={dismissPrompt}
      >
        {promptOrder && (
          <ScrollView contentContainerStyle={styles.promptModal}>
            <Text style={styles.promptTitle}>🎉 Your laundry is back!</Text>
            <Text style={styles.promptSubtitle}>
              Your order was dropped off by{' '}
              {washerNames[promptOrder.washerId!] ?? 'your washer'}. How did it go?
            </Text>
            <Text style={styles.promptBulletHead}>Consider:</Text>
            <Text style={styles.promptBullet}>• Were the clothes returned clean and in good condition?</Text>
            <Text style={styles.promptBullet}>• Was your washer on time for pickup and drop-off?</Text>
            <Text style={styles.promptBullet}>• Were they easy and professional to work with?</Text>
            <Text style={styles.promptBullet}>• Would you use them again?</Text>
            <View style={styles.promptStarRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setPromptRating(n)} disabled={promptSaving}>
                  <Text style={styles.promptStar}>{n <= promptRating ? '★' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.promptInput}
              placeholder="Leave a comment (optional)"
              placeholderTextColor={drip.mutedText}
              value={promptText}
              onChangeText={setPromptText}
              multiline
              maxLength={200}
              editable={!promptSaving}
            />
            <TouchableOpacity
              style={[
                styles.promptSubmitBtn,
                (promptSaving || promptRating === 0) && styles.btnDisabled,
              ]}
              onPress={handleSubmitPrompt}
              disabled={promptSaving || promptRating === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.promptSubmitText}>
                {promptSaving ? 'Saving…' : 'Submit Review'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.promptSkipBtn} onPress={dismissPrompt} activeOpacity={0.8}>
              <Text style={styles.promptSkipText}>Skip for Now</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Modal>

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

            {/* GrubHub-style tracker */}
            <StatusTimeline order={selected} />

            {/* Order details */}
            <Text style={styles.modalSection}>Items</Text>
            {selected.items.map((it) => (
              <Text key={it.label} style={styles.modalItem}>
                • {it.quantity} {it.label}
              </Text>
            ))}

            <Text style={styles.modalSection}>Pickup</Text>
            <Text style={styles.modalDetail}>📅 {formatDateTime(selected.pickupDateTime)}</Text>
            <Text style={styles.modalDetail}>📍 {selected.pickupLocation}</Text>
            <Text style={styles.modalDetail}>{TEMP_LABEL[selected.waterTemp] ?? selected.waterTemp}</Text>

            <Text style={styles.modalSection}>Drop-off</Text>
            <Text style={styles.modalDetail}>📅 {selected.dropoffDateTime ? formatDateTime(selected.dropoffDateTime) : '—'}</Text>
            <Text style={styles.modalDetail}>📍 {selected.dropoffLocation || '—'}</Text>

            {selected.notes ? (
              <>
                <Text style={styles.modalSection}>Notes</Text>
                <Text style={styles.modalDetail}>{selected.notes}</Text>
              </>
            ) : null}

            {selected.washerId && (
              <>
                <Text style={styles.modalSection}>Washer</Text>
                <Text style={styles.modalDetail}>{washerNames[selected.washerId] ?? 'Unknown'}</Text>
              </>
            )}

            {selected.status === 'pending' && (
              <TouchableOpacity
                style={[styles.cancelBtn, { marginTop: 24 }]}
                onPress={() => handleCancel(selected)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel Order</Text>
              </TouchableOpacity>
            )}

            {/* Review section — only after dropped_off */}
            {selected.status === 'dropped_off' &&
              selected.washerId &&
              (existingReview ? (
                <View style={styles.reviewSection}>
                  <Text style={styles.modalSection}>Your Review</Text>
                  <Text style={styles.starDisplay}>
                    {'★'.repeat(existingReview.rating)}
                    {'☆'.repeat(5 - existingReview.rating)}
                  </Text>
                  {existingReview.text ? (
                    <Text style={styles.reviewTextDisplay}>{existingReview.text}</Text>
                  ) : null}
                </View>
              ) : (
                <View style={styles.reviewSection}>
                  <Text style={styles.modalSection}>Rate Your Washer</Text>
                  <Text style={{ fontSize: 13, color: drip.mutedText, marginBottom: 10 }}>
                    Consider: Were they on time for pickup and drop-off? Were clothes returned clean? Were they easy to work with?
                  </Text>
                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <TouchableOpacity
                        key={n}
                        onPress={() => setReviewRating(n)}
                        disabled={reviewSaving}
                      >
                        <Text style={styles.starOption}>
                          {n <= reviewRating ? '★' : '☆'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    style={styles.reviewInput}
                    placeholder="Leave a comment (optional)"
                    placeholderTextColor={drip.mutedText}
                    value={reviewText}
                    onChangeText={setReviewText}
                    multiline
                    maxLength={200}
                    editable={!reviewSaving}
                  />
                  {reviewError ? (
                    <Text style={styles.error}>{reviewError}</Text>
                  ) : null}
                  <TouchableOpacity
                    style={[
                      styles.reviewSubmitBtn,
                      (reviewSaving || reviewRating === 0) && styles.btnDisabled,
                    ]}
                    onPress={handleSubmitReview}
                    disabled={reviewSaving || reviewRating === 0}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.reviewSubmitText}>
                      {reviewSaving ? 'Saving…' : 'Submit Review'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
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
  cardText: { color: drip.darkText, fontSize: 14, marginBottom: 4 },
  cardMuted: { color: drip.mutedText, fontSize: 13, marginBottom: 2 },
  cardPrice: { color: drip.success, fontWeight: '700', fontSize: 13, marginTop: 4 },
  cancelBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: drip.error,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelBtnText: { color: drip.error, fontWeight: '600', fontSize: 14 },
  error: { color: drip.error, fontSize: 14, marginBottom: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: drip.mutedText, fontSize: 16 },
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
  modalDetail: { fontSize: 15, color: drip.darkText, marginBottom: 2 },
  reviewSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: drip.lightAqua,
  },
  starRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  starOption: { fontSize: 32, color: drip.gold },
  starDisplay: { fontSize: 28, color: drip.gold, marginBottom: 6 },
  reviewInput: {
    borderWidth: 1.5,
    borderColor: drip.lightAqua,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: drip.darkText,
    backgroundColor: '#F9FAFB',
    minHeight: 72,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  reviewTextDisplay: { fontSize: 14, color: drip.darkText, marginTop: 4 },
  reviewSubmitBtn: {
    backgroundColor: drip.teal,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  reviewSubmitText: { color: drip.white, fontWeight: '700', fontSize: 14 },
  // Prompt modal
  promptModal: { padding: 28 },
  promptTitle: { fontSize: 22, fontWeight: '700', color: drip.darkTeal, marginBottom: 8 },
  promptSubtitle: { fontSize: 15, color: drip.darkText, marginBottom: 20 },
  promptBulletHead: { fontSize: 14, fontWeight: '600', color: drip.mutedText, marginBottom: 8 },
  promptBullet: { fontSize: 14, color: drip.darkText, marginBottom: 4, paddingLeft: 4 },
  promptStarRow: { flexDirection: 'row', gap: 8, marginTop: 20, marginBottom: 16 },
  promptStar: { fontSize: 36, color: drip.gold },
  promptInput: {
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
  promptSubmitBtn: {
    backgroundColor: drip.teal,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  promptSubmitText: { color: drip.white, fontWeight: '700', fontSize: 16 },
  promptSkipBtn: { paddingVertical: 12, alignItems: 'center' },
  promptSkipText: { color: drip.mutedText, fontSize: 14, textDecorationLine: 'underline' },
});

// ─── Timeline styles ─────────────────────────────────────────────────────────

const tlStyles = StyleSheet.create({
  container: { marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 44 },
  lineCol: { width: 24, alignItems: 'center' },
  line: { width: 2, height: 24, backgroundColor: '#D1D5DB' },
  lineActive: { backgroundColor: drip.teal },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: drip.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  circleActive: { borderColor: drip.teal },
  circleCurrent: { borderColor: drip.teal, backgroundColor: drip.teal },
  circleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: drip.white },
  labelCol: { flex: 1, paddingLeft: 10, paddingBottom: 12 },
  stepLabel: { fontSize: 15, color: '#9CA3AF', fontWeight: '500' },
  stepLabelActive: { color: drip.darkText, fontWeight: '600' },
  stepTime: { fontSize: 12, color: drip.mutedText, marginTop: 2 },
  cancelledBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  cancelledText: { color: drip.error, fontWeight: '700', fontSize: 15 },
});
