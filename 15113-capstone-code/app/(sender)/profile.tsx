import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useAuth } from '@/context/auth-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState((user as any)?.address || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState((user as any)?.notificationsEnabled ?? true);
  const [isSaved, setIsSaved] = useState(true);

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
        <Text style={styles.role}>{user?.role === 'sender' ? 'Sender' : 'Sudser'}</Text>
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

        {user?.role === 'sender' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                handleChange();
              }}
              placeholder="Your home address"
              multiline
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.preferenceRow}>
          <View>
            <Text style={styles.prefLabel}>Push Notifications</Text>
            <Text style={styles.prefSubtitle}>Get updates about your bookings</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => {
              setNotificationsEnabled(value);
              handleChange();
            }}
            trackColor={{ false: '#E0E0E0', true: '#00D4FF' }}
            thumbColor={notificationsEnabled ? '#00D4FF' : '#ffffff'}
          />
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
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  prefSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  saveButton: {
    backgroundColor: '#00D4FF',
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
