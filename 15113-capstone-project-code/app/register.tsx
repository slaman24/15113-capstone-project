import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';
import type { Role } from '@/lib/types';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('wearer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError('');
    setLoading(true);
    try {
      await register(username, password, confirmPassword, role);
      // navigation is handled by app/index.tsx redirect after user state updates
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Image
          source={require('@/assets/images/drip_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={drip.mutedText}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={drip.mutedText}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={drip.mutedText}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />

        {/* Role toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.pill, role === 'wearer' && styles.pillActive]}
            onPress={() => setRole('wearer')}
            disabled={loading}
          >
            <Text style={[styles.pillText, role === 'wearer' && styles.pillTextActive]}>
              Wearer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, role === 'washer' && styles.pillActive]}
            onPress={() => setRole('washer')}
            disabled={loading}
          >
            <Text style={[styles.pillText, role === 'washer' && styles.pillTextActive]}>
              Washer
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: drip.white },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: drip.white,
  },
  backRow: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backText: {
    color: drip.darkTeal,
    fontSize: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: drip.darkTeal,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: drip.lightAqua,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: drip.darkText,
    backgroundColor: '#F9FAFB',
    marginBottom: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  pill: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: drip.teal,
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: drip.teal,
  },
  pillText: {
    color: drip.teal,
    fontWeight: '600',
    fontSize: 15,
  },
  pillTextActive: {
    color: drip.white,
  },
  error: {
    color: drip.error,
    fontSize: 14,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  button: {
    width: '100%',
    backgroundColor: drip.teal,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: drip.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
