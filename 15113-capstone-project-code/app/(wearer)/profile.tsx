import { useCallback, useState } from 'react';
import {
  Alert,
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
import { clearDatabase, getReviewsByWearer } from '@/lib/database';
import { removeItem, STORAGE_KEYS } from '@/lib/storage';
import type { Review } from '@/lib/types';

const EMOJI_OPTIONS = ['👕', '👗', '🧦', '🧤', '🎩', '🧴', '🧺', '✨', '🌊', '🌿', '⭐', '😊'];

export default function WearerProfileScreen() {
  const { user, logout, updateDisplayName, updateAvatar } = useAuth();

  const currentAvatar = user?.avatar ?? '🧺';
  const [nameInput, setNameInput] = useState(user?.displayName ?? '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSaved, setNameSaved] = useState(false);  const [reviews, setReviews] = useState<Review[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user) setReviews(getReviewsByWearer(user.id));
    }, [user]),
  );
  async function handleSaveName() {
    setNameError('');
    setNameSaved(false);
    setNameSaving(true);
    try {
      await updateDisplayName(nameInput);
      setNameSaved(true);
    } catch (e: unknown) {
      setNameError(
        e instanceof Error ? e.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setNameSaving(false);
    }
  }

  async function handleAvatarSelect(emoji: string) {
    try {
      await updateAvatar(emoji);
    } catch {
      // best effort — avatar change is non-critical
    }
  }

  function confirmReset() {
    Alert.alert(
      'Reset App Data',
      'This will permanently delete all accounts, orders, and reviews. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            clearDatabase();
            await removeItem(STORAGE_KEYS.SESSION);
            await logout();
          },
        },
      ],
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar display */}
      <Text style={styles.avatarDisplay}>{currentAvatar}</Text>

      {/* Avatar picker */}
      <Text style={styles.sectionLabel}>Choose Avatar</Text>
      <View style={styles.emojiGrid}>
        {EMOJI_OPTIONS.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[
              styles.emojiOption,
              emoji === currentAvatar && styles.emojiSelected,
            ]}
            onPress={() => handleAvatarSelect(emoji)}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Display name edit */}
      <Text style={styles.sectionLabel}>Display Name</Text>
      <View style={styles.nameRow}>
        <TextInput
          style={styles.nameInput}
          value={nameInput}
          onChangeText={(t) => {
            setNameInput(t);
            setNameSaved(false);
          }}
          maxLength={30}
          placeholder="Display name"
          placeholderTextColor={drip.mutedText}
          editable={!nameSaving}
        />
        <TouchableOpacity
          style={[styles.saveBtn, nameSaving && styles.btnDisabled]}
          onPress={handleSaveName}
          disabled={nameSaving}
        >
          <Text style={styles.saveBtnText}>{nameSaving ? '…' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
      {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
      {nameSaved ? <Text style={styles.saved}>Display name updated!</Text> : null}

      {/* Read-only info */}
      <View style={styles.infoCard}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>@{user?.username}</Text>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>Wearer</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Ratings received */}
      {(() => {
        const avg = reviews.length
          ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
          : 0;
        return (
          <>
            <Text style={styles.sectionLabel}>My Rating</Text>
            {reviews.length === 0 ? (
              <Text style={styles.noReviews}>No reviews yet — complete an order to receive one!</Text>
            ) : (
              <>
                <View style={styles.ratingRow}>
                  <Text style={styles.avgRating}>{avg.toFixed(1)}</Text>
                  <Text style={styles.avgStars}>
                    {'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}
                  </Text>
                  <Text style={styles.reviewCount}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</Text>
                </View>
                {reviews.slice(0, 5).map((r) => (
                  <View key={r.id} style={styles.reviewCard}>
                    <Text style={styles.reviewStars}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </Text>
                    {r.text ? <Text style={styles.reviewText}>{r.text}</Text> : null}
                    <Text style={styles.reviewDate}>
                      {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </>
        );
      })()}

      <TouchableOpacity style={styles.resetBtn} onPress={confirmReset} activeOpacity={0.8}>
        <Text style={styles.resetText}>Reset App Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: drip.white,
    flexGrow: 1,
  },
  avatarDisplay: {
    fontSize: 64,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: drip.mutedText,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiSelected: {
    borderColor: drip.teal,
    backgroundColor: drip.lightAqua + '44',
  },
  emojiText: { fontSize: 22 },
  nameRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: drip.lightAqua,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: drip.darkText,
    backgroundColor: '#F9FAFB',
  },
  saveBtn: {
    backgroundColor: drip.teal,
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  saveBtnText: {
    color: drip.white,
    fontWeight: '700',
    fontSize: 15,
  },
  error: {
    color: drip.error,
    fontSize: 13,
    marginBottom: 8,
  },
  saved: {
    color: drip.success,
    fontSize: 13,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: drip.lightAqua,
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: drip.mutedText,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: drip.darkText,
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: drip.error,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutText: {
    color: drip.white,
    fontSize: 17,
    fontWeight: '700',
  },
  resetBtn: {
    borderWidth: 1.5,
    borderColor: drip.mutedText,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetText: {
    color: drip.mutedText,
    fontSize: 15,
    fontWeight: '600',
  },
  noReviews: { color: drip.mutedText, fontSize: 14, marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  avgRating: { fontSize: 28, fontWeight: '700', color: drip.darkTeal },
  avgStars: { fontSize: 22, color: drip.gold },
  reviewCount: { fontSize: 13, color: drip.mutedText },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: drip.lightAqua,
  },
  reviewStars: { fontSize: 18, color: drip.gold, marginBottom: 4 },
  reviewText: { fontSize: 14, color: drip.darkText, marginBottom: 4 },
  reviewDate: { fontSize: 12, color: drip.mutedText },
});

