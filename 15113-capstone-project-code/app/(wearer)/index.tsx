import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import type { LaundryItem, Order } from '@/lib/types';

const ITEM_LABELS = ['Shirts', 'Pants', 'Socks', 'Towels', 'Bedding', 'Other'] as const;

type QuantityMap = Record<string, number>;

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function PlaceOrderScreen() {
  const { user } = useAuth();

  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  function adjust(label: string, delta: number) {
    setQuantities((prev) => {
      const next = (prev[label] ?? 0) + delta;
      return { ...prev, [label]: Math.max(0, next) };
    });
  }

  function reset() {
    setQuantities({});
    setPickupTime('');
    setNotes('');
    setError('');
    setSuccessId(null);
  }

  const selectedItems: LaundryItem[] = ITEM_LABELS.filter(
    (l) => (quantities[l] ?? 0) > 0,
  ).map((l) => ({ label: l, quantity: quantities[l]! }));

  const noItems = selectedItems.length === 0;
  const isDisabled = loading || noItems;

  async function handleSubmit() {
    setError('');

    if (noItems) {
      setError('Please add at least one item to your order.');
      return;
    }
    if (!pickupTime.trim()) {
      setError('Please enter a pickup time.');
      return;
    }
    if (notes.length > 200) {
      setError('Notes must be 200 characters or fewer.');
      return;
    }

    setLoading(true);
    try {
      const orders = (await getItem<Order[]>(STORAGE_KEYS.ORDERS)) ?? [];
      const now = new Date().toISOString();
      const newOrder: Order = {
        id: generateId(),
        wearerId: user!.id,
        washerId: null,
        items: selectedItems,
        pickupTime: pickupTime.trim(),
        notes: notes.trim(),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      await setItem(STORAGE_KEYS.ORDERS, [...orders, newOrder]);
      setSuccessId(newOrder.id);
      setQuantities({});
      setPickupTime('');
      setNotes('');
    } catch {
      setError('Could not place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Place a Laundry Order</Text>

        {successId && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              Order placed! ID: …{successId.slice(-6)}
            </Text>
            <TouchableOpacity onPress={reset}>
              <Text style={styles.successLink}>Place another order</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Item picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Items</Text>
          {ITEM_LABELS.map((label) => (
            <View key={label} style={styles.itemRow}>
              <Text style={styles.itemLabel}>{label}</Text>
              <View style={styles.counter}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => adjust(label, -1)}
                  disabled={loading}
                >
                  <Text style={styles.counterBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{quantities[label] ?? 0}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => adjust(label, 1)}
                  disabled={loading}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Pickup time */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pickup Time</Text>
          <TextInput
            style={styles.input}
            placeholder='e.g. "Tomorrow 10am"'
            placeholderTextColor={drip.mutedText}
            value={pickupTime}
            onChangeText={setPickupTime}
            editable={!loading}
          />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any special instructions…"
            placeholderTextColor={drip.mutedText}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            editable={!loading}
            maxLength={201} // let validation fire, not hard-cut silently
          />
          <Text style={styles.charCount}>{notes.length}/200</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Placing order…' : 'Submit Order'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: drip.white },
  container: { flexGrow: 1, padding: 20, backgroundColor: drip.white },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: drip.darkTeal,
    marginBottom: 20,
  },
  successBox: {
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  successText: { color: drip.success, fontWeight: '600', fontSize: 15 },
  successLink: {
    color: drip.darkTeal,
    textDecorationLine: 'underline',
    marginTop: 8,
    fontSize: 14,
  },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: drip.darkText,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: drip.lightAqua,
  },
  itemLabel: { fontSize: 16, color: drip.darkText, flex: 1 },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: drip.lightAqua,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: { fontSize: 20, color: drip.darkTeal, lineHeight: 22 },
  counterValue: { fontSize: 16, fontWeight: '600', color: drip.darkText, minWidth: 20, textAlign: 'center' },
  input: {
    borderWidth: 1.5,
    borderColor: drip.lightAqua,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: drip.darkText,
    backgroundColor: '#F9FAFB',
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  charCount: { alignSelf: 'flex-end', color: drip.mutedText, fontSize: 12, marginTop: 4 },
  error: { color: drip.error, fontSize: 14, marginBottom: 12 },
  button: {
    backgroundColor: drip.teal,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: drip.white, fontSize: 17, fontWeight: '700' },
});
