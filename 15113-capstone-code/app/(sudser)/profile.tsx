import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useAuth } from '@/context/auth-context';
import { serviceOptions } from '@/lib/mock-data';

export default function SudserProfile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState((user as any)?.bio || '');
  const [hourlyRate, setHourlyRate] = useState((user as any)?.hourlyRate?.toString() || '18');
  const [isSaved, setIsSaved] = useState(true);

  const sudserUser = user as any;

  const handleSave = () => {
    setIsSaved(true);
    // In a real app, this would update the user via API
  };

  const handleChange = () => {
    setIsSaved(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>👤</Text>
        <Text style={styles.role}>Sudser Profile</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {sudserUser?.rating?.toFixed(1) || '4.5'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              handleChange();
            }}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              handleChange();
            }}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              handleChange();
            }}
            editable={false}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Details</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio / About</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={(text) => {
              setBio(text);
              handleChange();
            }}
            placeholder="Tell customers about yourself"
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Hourly Rate ($)</Text>
          <View style={styles.rateInputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.rateInput}
              value={hourlyRate}
              onChangeText={(text) => {
                setHourlyRate(text.replace(/[^0-9.]/g, ''));
                handleChange();
              }}
              keyboardType="decimal-pad"
            />
            <Text style={styles.perHour}>/hr</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Services Offered</Text>
          <FlatList
            data={sudserUser?.services || ['wash_fold']}
            keyExtractor={item => item}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const serviceOpt = serviceOptions.find(s => s.id === item);
              return (
                <View style={styles.serviceBadge}>
                  <Text style={styles.serviceBadgeText}>✓ {serviceOpt?.name}</Text>
                </View>
              );
            }}
          />
          <Text style={styles.hint}>Contact support to modify services</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Availability</Text>
          <FlatList
            data={sudserUser?.availability || []}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.availabilityRow}>
                <Text style={styles.dayText}>{item.day}</Text>
                <Text style={styles.timeText}>
                  {item.startTime} - {item.endTime}
                </Text>
              </View>
            )}
          />
          <Text style={styles.hint}>Contact support to modify availability</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Rating</Text>
          <Text style={styles.metricValue}>⭐ {sudserUser?.rating?.toFixed(1) || '4.5'}</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Reviews</Text>
          <Text style={styles.metricValue}>{sudserUser?.reviewCount || '0'}</Text>
        </View>
      </View>

      {!isSaved && (
        <View style={styles.section}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About Drip</Text>
        <Text style={styles.infoText}>Version 1.0.0</Text>
        <Text style={styles.infoText}>© 2026 Drip Laundry. All rights reserved.</Text>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  role: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  ratingBadge: {
    backgroundColor: '#FFE0E8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2C3E50',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  dollarSign: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginRight: 4,
  },
  rateInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2C3E50',
  },
  perHour: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  hint: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    fontStyle: 'italic',
  },
  serviceBadge: {
    backgroundColor: '#FFE0E8',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 4,
  },
  serviceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  saveButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FFE0E0',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  spacer: {
    height: 40,
  },
});
