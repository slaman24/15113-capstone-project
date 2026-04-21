import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';

export default function WasherProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Display Name</Text>
        <Text style={styles.value}>{user?.displayName}</Text>

        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>@{user?.username}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>Washer</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: drip.white,
    padding: 24,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: drip.lightAqua,
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: drip.mutedText,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: 12,
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
  },
  logoutText: {
    color: drip.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
