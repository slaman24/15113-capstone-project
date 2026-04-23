import { useEffect, useState } from 'react';
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
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';
import { createOrder } from '@/lib/database';
import type { LaundryItem, Order, WaterTemp } from '@/lib/types';

const ITEM_LABELS = ['Shirts', 'Pants', 'Socks', 'Towels', 'Bedding', 'Other'] as const;
const WATER_TEMPS: { value: WaterTemp; label: string }[] = [
  { value: 'cold', label: '❄️  Cold' },
  { value: 'warm', label: '🌡️  Warm' },
  { value: 'hot', label: '🔥  Hot' },
];

type QuantityMap = Record<string, number>;

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

function Checkbox({
  checked,
  onToggle,
  label,
  disabled,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.checkRow}
      onPress={onToggle}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[styles.checkBox, checked && styles.checkBoxChecked]}>
        {checked && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PlaceOrderScreen() {
  const { user } = useAuth();

  const [quantities, setQuantities] = useState<QuantityMap>({});

  // ── Pickup ────────────────────────────────────────────────────────────────
  const [pickupDate, setPickupDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setMinutes(0, 0, 0);
    return d;
  });
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');

  // ── Dropoff ───────────────────────────────────────────────────────────────
  const [dropoffDate, setDropoffDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setMinutes(0, 0, 0);
    return d;
  });
  const [showDropoffDatePicker, setShowDropoffDatePicker] = useState(false);
  const [showDropoffTimePicker, setShowDropoffTimePicker] = useState(false);
  const [samePickupDate, setSamePickupDate] = useState(false);
  const [samePickupTime, setSamePickupTime] = useState(false);
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [samePickupLocation, setSamePickupLocation] = useState(false);

  const [waterTemp, setWaterTemp] = useState<WaterTemp>('cold');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  // ── Sync dropoff when "same as pickup" checkboxes are on ─────────────────

  useEffect(() => {
    if (samePickupDate) {
      setDropoffDate((prev) => {
        const d = new Date(prev);
        d.setFullYear(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
        return d;
      });
    }
  }, [pickupDate, samePickupDate]);

  useEffect(() => {
    if (samePickupTime) {
      setDropoffDate((prev) => {
        const d = new Date(prev);
        d.setHours(pickupDate.getHours(), pickupDate.getMinutes(), 0, 0);
        return d;
      });
    }
  }, [pickupDate, samePickupTime]);

  useEffect(() => {
    if (samePickupLocation) setDropoffLocation(pickupLocation);
  }, [pickupLocation, samePickupLocation]);

  function adjust(label: string, delta: number) {
    setQuantities((prev) => ({ ...prev, [label]: Math.max(0, (prev[label] ?? 0) + delta) }));
  }

  // ── Pickup picker handlers ────────────────────────────────────────────────

  function onPickupDateChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS !== 'ios') setShowPickupDatePicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setPickupDate((prev) => {
      const d = new Date(prev);
      d.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      return d;
    });
  }

  function onPickupTimeChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS !== 'ios') setShowPickupTimePicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setPickupDate((prev) => {
      const d = new Date(prev);
      d.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      return d;
    });
  }

  // ── Dropoff picker handlers ───────────────────────────────────────────────

  function onDropoffDateChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS !== 'ios') setShowDropoffDatePicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setSamePickupDate(false);
    setDropoffDate((prev) => {
      const d = new Date(prev);
      d.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      return d;
    });
  }

  function onDropoffTimeChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS !== 'ios') setShowDropoffTimePicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setSamePickupTime(false);
    setDropoffDate((prev) => {
      const d = new Date(prev);
      d.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      return d;
    });
  }

  function reset() {
    setQuantities({});
    const d1 = new Date();
    d1.setDate(d1.getDate() + 1);
    d1.setMinutes(0, 0, 0);
    setPickupDate(d1);
    const d2 = new Date();
    d2.setDate(d2.getDate() + 2);
    d2.setMinutes(0, 0, 0);
    setDropoffDate(d2);
    setPickupLocation('');
    setDropoffLocation('');
    setSamePickupDate(false);
    setSamePickupTime(false);
    setSamePickupLocation(false);
    setWaterTemp('cold');
    setNotes('');
    setError('');
    setSuccessId(null);
    setShowPickupDatePicker(false);
    setShowPickupTimePicker(false);
    setShowDropoffDatePicker(false);
    setShowDropoffTimePicker(false);
  }

  const selectedItems: LaundryItem[] = ITEM_LABELS.filter(
    (l) => (quantities[l] ?? 0) > 0,
  ).map((l) => ({ label: l, quantity: quantities[l]! }));

  const noItems = selectedItems.length === 0;
  const isDisabled = loading || noItems;

  async function handleSubmit() {
    setError('');
    if (noItems) { setError('Please add at least one item.'); return; }
    if (!pickupLocation.trim()) { setError('Please enter a pickup location.'); return; }
    if (!dropoffLocation.trim()) { setError('Please enter a drop-off location.'); return; }
    if (dropoffDate < pickupDate) { setError('Drop-off must be after pickup.'); return; }
    if (notes.length > 200) { setError('Notes must be 200 characters or fewer.'); return; }

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const newOrder: Order = {
        id: generateId(),
        wearerId: user!.id,
        washerId: null,
        items: selectedItems,
        pickupDateTime: pickupDate.toISOString(),
        pickupLocation: pickupLocation.trim(),
        dropoffDateTime: dropoffDate.toISOString(),
        dropoffLocation: dropoffLocation.trim(),
        waterTemp,
        notes: notes.trim(),
        status: 'pending',
        statusTimestamps: { pending: now },
        createdAt: now,
        updatedAt: now,
      };
      createOrder(newOrder);
      const id = newOrder.id;
      reset();
      setSuccessId(id);
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
            <Text style={styles.successText}>Order placed! ID: …{successId.slice(-6)}</Text>
            <TouchableOpacity onPress={() => setSuccessId(null)}>
              <Text style={styles.successLink}>Place another order</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Items ──────────────────────────────────────────────────────── */}
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

        {/* ── Pickup ─────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pickup Date</Text>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => {
              setShowPickupDatePicker((v) => !v);
              setShowPickupTimePicker(false);
            }}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.dateBtnText}>📅  {formatDate(pickupDate)}</Text>
          </TouchableOpacity>
          {showPickupDatePicker && (
            <DateTimePicker
              value={pickupDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={new Date()}
              onChange={onPickupDateChange}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pickup Time</Text>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => {
              setShowPickupTimePicker((v) => !v);
              setShowPickupDatePicker(false);
            }}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.dateBtnText}>🕐  {formatTime(pickupDate)}</Text>
          </TouchableOpacity>
          {showPickupTimePicker && (
            <DateTimePicker
              value={pickupDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onPickupTimeChange}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pickup Location</Text>
          <TextInput
            style={styles.input}
            placeholder='e.g. "Room 204, Forbes Hall"'
            placeholderTextColor={drip.mutedText}
            value={pickupLocation}
            onChangeText={setPickupLocation}
            editable={!loading}
            returnKeyType="done"
          />
        </View>

        {/* ── Drop-off ───────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Drop-off Date</Text>
          <Checkbox
            checked={samePickupDate}
            onToggle={() => {
              if (!samePickupDate) {
                setDropoffDate((prev) => {
                  const d = new Date(prev);
                  d.setFullYear(
                    pickupDate.getFullYear(),
                    pickupDate.getMonth(),
                    pickupDate.getDate(),
                  );
                  return d;
                });
              }
              setSamePickupDate((v) => !v);
            }}
            label="Same date as pickup"
            disabled={loading}
          />
          <TouchableOpacity
            style={[styles.dateBtn, { marginTop: 8 }]}
            onPress={() => {
              setShowDropoffDatePicker((v) => !v);
              setShowDropoffTimePicker(false);
            }}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.dateBtnText}>📅  {formatDate(dropoffDate)}</Text>
          </TouchableOpacity>
          {showDropoffDatePicker && (
            <DateTimePicker
              value={dropoffDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={new Date()}
              onChange={onDropoffDateChange}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Drop-off Time</Text>
          <Checkbox
            checked={samePickupTime}
            onToggle={() => {
              if (!samePickupTime) {
                setDropoffDate((prev) => {
                  const d = new Date(prev);
                  d.setHours(pickupDate.getHours(), pickupDate.getMinutes(), 0, 0);
                  return d;
                });
              }
              setSamePickupTime((v) => !v);
            }}
            label="Same time as pickup"
            disabled={loading}
          />
          <TouchableOpacity
            style={[styles.dateBtn, { marginTop: 8 }]}
            onPress={() => {
              setShowDropoffTimePicker((v) => !v);
              setShowDropoffDatePicker(false);
            }}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.dateBtnText}>🕐  {formatTime(dropoffDate)}</Text>
          </TouchableOpacity>
          {showDropoffTimePicker && (
            <DateTimePicker
              value={dropoffDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDropoffTimeChange}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Drop-off Location</Text>
          <Checkbox
            checked={samePickupLocation}
            onToggle={() => {
              if (!samePickupLocation) setDropoffLocation(pickupLocation);
              setSamePickupLocation((v) => !v);
            }}
            label="Same location as pickup"
            disabled={loading}
          />
          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            placeholder='e.g. "Room 204, Forbes Hall"'
            placeholderTextColor={drip.mutedText}
            value={dropoffLocation}
            onChangeText={(text) => {
              if (samePickupLocation) setSamePickupLocation(false);
              setDropoffLocation(text);
            }}
            editable={!loading}
            returnKeyType="done"
          />
        </View>

        {/* ── Water temperature ──────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Water Temperature</Text>
          <View style={styles.chipRow}>
            {WATER_TEMPS.map(({ value, label }) => (
              <TouchableOpacity
                key={value}
                style={[styles.chip, waterTemp === value && styles.chipSelected]}
                onPress={() => setWaterTemp(value)}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, waterTemp === value && styles.chipTextSelected]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Notes ──────────────────────────────────────────────────────── */}
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
            maxLength={201}
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
  heading: { fontSize: 22, fontWeight: '700', color: drip.darkTeal, marginBottom: 20 },
  successBox: { backgroundColor: '#D1FAE5', borderRadius: 10, padding: 16, marginBottom: 20 },
  successText: { color: drip.success, fontWeight: '600', fontSize: 15 },
  successLink: {
    color: drip.darkTeal,
    textDecorationLine: 'underline',
    marginTop: 8,
    fontSize: 14,
  },
  section: { marginBottom: 20 },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: drip.darkText, marginBottom: 8 },
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
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: drip.darkText,
    minWidth: 20,
    textAlign: 'center',
  },
  dateBtn: {
    borderWidth: 1.5,
    borderColor: drip.lightAqua,
    borderRadius: 10,
    padding: 13,
    backgroundColor: '#F9FAFB',
  },
  dateBtnText: { fontSize: 15, color: drip.darkText },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: drip.lightAqua,
    backgroundColor: drip.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkBoxChecked: { backgroundColor: drip.teal, borderColor: drip.teal },
  checkMark: { color: drip.white, fontSize: 13, fontWeight: '700' },
  checkLabel: { fontSize: 14, color: drip.darkText },
  chipRow: { flexDirection: 'row', gap: 10 },
  chip: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: drip.lightAqua,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  chipSelected: { backgroundColor: drip.teal, borderColor: drip.teal },
  chipText: { fontSize: 14, fontWeight: '600', color: drip.darkText },
  chipTextSelected: { color: drip.white },
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

