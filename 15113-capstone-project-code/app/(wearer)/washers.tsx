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
import { drip } from '@/constants/theme';
import { getItem, STORAGE_KEYS } from '@/lib/storage';
import type { Review, User } from '@/lib/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function avgRating(washerId: string, reviews: Review[]): number | null {
  const relevant = reviews.filter((r) => r.washerId === washerId);
  if (relevant.length === 0) return null;
  return relevant.reduce((sum, r) => sum + r.rating, 0) / relevant.length;
}

function ratingLabel(washerId: string, reviews: Review[]): string {
  const relevant = reviews.filter((r) => r.washerId === washerId);
  if (relevant.length === 0) return 'No reviews yet';
  const avg = relevant.reduce((sum, r) => sum + r.rating, 0) / relevant.length;
  return `★ ${avg.toFixed(1)}  (${relevant.length} review${relevant.length !== 1 ? 's' : ''})`;
}

function starBar(rating: number): string {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function WashersScreen() {
  const [washers, setWashers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wearerNames, setWearerNames] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<User | null>(null);

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  async function load() {
    const [users, allReviews] = await Promise.all([
      getItem<User[]>(STORAGE_KEYS.USERS),
      getItem<Review[]>(STORAGE_KEYS.REVIEWS),
    ]);
    setWashers((users ?? []).filter((u) => u.role === 'washer'));
    setReviews(allReviews ?? []);
    const names: Record<string, string> = {};
    (users ?? []).forEach((u) => {
      names[u.id] = u.displayName;
    });
    setWearerNames(names);
  }

  function renderWasher({ item }: { item: User }) {
    const avg = avgRating(item.id, reviews);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelected(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.cardAvatar}>{item.avatar ?? '🧺'}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.displayName}</Text>
          <Text style={styles.cardUsername}>@{item.username}</Text>
          <Text style={[styles.cardRating, avg === null && styles.noRating]}>
            {ratingLabel(item.id, reviews)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Reviews for the selected washer
  const selectedReviews = selected
    ? reviews.filter((r) => r.washerId === selected.id)
    : [];
  const selectedAvg = selected ? avgRating(selected.id, reviews) : null;

  return (
    <View style={styles.container}>
      {washers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No washers found.</Text>
        </View>
      ) : (
        <FlatList
          data={washers}
          keyExtractor={(w) => w.id}
          renderItem={renderWasher}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Washer profile modal */}
      <Modal
        visible={selected !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <ScrollView contentContainerStyle={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Washer Profile</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Text style={styles.closeBtn}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Profile header */}
            <View style={styles.profileHeader}>
              <Text style={styles.profileAvatar}>{selected.avatar ?? '🧺'}</Text>
              <Text style={styles.profileName}>{selected.displayName}</Text>
              <Text style={styles.profileUsername}>@{selected.username}</Text>
              {selectedAvg !== null ? (
                <>
                  <Text style={styles.profileStars}>{starBar(selectedAvg)}</Text>
                  <Text style={styles.profileAvgText}>
                    {selectedAvg.toFixed(1)} / 5 · {selectedReviews.length} review
                    {selectedReviews.length !== 1 ? 's' : ''}
                  </Text>
                </>
              ) : (
                <Text style={styles.noRating}>No reviews yet</Text>
              )}
            </View>

            {/* Reviews list */}
            {selectedReviews.length > 0 && (
              <>
                <Text style={styles.reviewsHeading}>Reviews</Text>
                {selectedReviews.map((rev) => (
                  <View key={rev.id} style={styles.reviewCard}>
                    <View style={styles.reviewMeta}>
                      <Text style={styles.reviewStars}>
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </Text>
                      <Text style={styles.reviewAuthor}>
                        {wearerNames[rev.wearerId] ?? 'Unknown'}
                      </Text>
                    </View>
                    {rev.text ? (
                      <Text style={styles.reviewText}>{rev.text}</Text>
                    ) : null}
                    <Text style={styles.reviewDate}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: drip.lightAqua,
    gap: 14,
  },
  cardAvatar: { fontSize: 40 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '700', color: drip.darkText },
  cardUsername: { fontSize: 13, color: drip.mutedText, marginBottom: 4 },
  cardRating: { fontSize: 14, color: drip.gold, fontWeight: '600' },
  noRating: { color: drip.mutedText, fontWeight: '400' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: drip.mutedText, fontSize: 16 },
  // Modal
  modal: { padding: 24 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: drip.darkTeal },
  closeBtn: { color: drip.teal, fontSize: 16, fontWeight: '600' },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  profileAvatar: { fontSize: 72, marginBottom: 8 },
  profileName: { fontSize: 22, fontWeight: '700', color: drip.darkText },
  profileUsername: { fontSize: 15, color: drip.mutedText, marginBottom: 8 },
  profileStars: { fontSize: 28, color: drip.gold, marginBottom: 2 },
  profileAvgText: { fontSize: 14, color: drip.mutedText },
  reviewsHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: drip.mutedText,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: drip.lightAqua,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewStars: { fontSize: 18, color: drip.gold },
  reviewAuthor: { fontSize: 13, color: drip.mutedText },
  reviewText: { fontSize: 14, color: drip.darkText, marginBottom: 4 },
  reviewDate: { fontSize: 12, color: drip.mutedText },
});
