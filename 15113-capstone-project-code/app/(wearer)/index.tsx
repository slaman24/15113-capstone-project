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

function formatDateTime(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  }) + ' at ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function PlaceOrderScreen() {
  const { user } = useAuth();

  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [pickupDate, setPickupDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setMinutes(0, 0, 0);
    return d;
  });
  // Android needs two-step picker: first date, then time
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [pickupLocation, setPickupLocation] = useState('');
  const [waterTemp, setWaterTemp] = useState<WaterTemp>('cold');
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
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setMinutes(0, 0, 0);
    setPickupDate(d);
    setPickupLocation('');
    setWaterTemp('cold');
    setNotes('');
    setError('');
    setSuccessId(null);
  }

  function openPicker() {
    setPickerMode('date');
    setShowDatePicker(true);
  }

  function onDateChange(event: DateTimePickerEvent, selected?: Date) {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    const d = selected ?? pickupDate;
    if (Platform.OS === 'android') {
      if (pickerMode === 'date') {
        // Keep same time, update just date
        const updated = new Date(pickupDate);
        updated.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
        setPickupDate(updated);
        setPickerMode('time');
        // Stay open for time selection
      } else {
        const updated = new Date(pickupDate);
        updated.setHours(d.getHours(), d.getMinutes(), 0, 0);
        setPickupDate(updated);
        setShowDatePicker(false);
      }
    } else {
      setPickupDate(d);
    }
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
    if (!pickupLocation.trim()) {
      setError('Please enter a pickup location.');
      return;
    }
    if (notes.length > 200) {
      setError('Notes must be 200 characters or fewer.');
      return;
    }

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
        waterTemp,
        notes: notes.trim(),
        status: 'pending',
        statusTimestamps: { pending: now },
        createdAt: now,
        updatedAt: now,
      };
      createOrder(newOrder);
      setSuccessId(newOrder.id);
      reset();
      setSuccessId(newOrder.id); // restore after reset clears it
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
            <TouchableOpacity onPress={() => setSuccessId(null)}>
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

        {/* Pickup date/time */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pickup Date & Time</Text>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={openPicker}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.dateBtnText}>📅  {formatDateTime(pickupDate)}</Text>
          </TouchableOpacity>
          {(showDatePicker) && (
            <DateTimePicker
              value={pickupDate}
              mode={pickerMode}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={new Date()}
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Pickup location */}
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

        {/* Water temperature */}
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
  dateBtn: {
    borderWidth: 1.5,
    borderColor: drip.lightAqua,
    borderRadius: 10,
    padding: 13,
    backgroundColor: '#F9FAFB',
  },
  dateBtnText: { fontSize: 15, color: drip.darkText },
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

