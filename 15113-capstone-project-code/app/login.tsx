import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
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
import { useFocusEffect, useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';
import { clearDatabase } from '@/lib/database';
import { removeItem, STORAGE_KEYS } from '@/lib/storage';

const LOGO = Asset.fromModule(require('@/assets/images/drip_logo.png'));

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoReady, setLogoReady] = useState(LOGO.downloaded);

  useEffect(() => {
    if (!LOGO.downloaded) {
      LOGO.downloadAsync().then(() => setLogoReady(true));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!LOGO.downloaded) {
        LOGO.downloadAsync().then(() => setLogoReady(true));
      } else {
        setLogoReady(true);
      }
    }, []),
  );

  function confirmReset() {
    Alert.alert(
      'Reset Demo Data',
      'This will permanently delete all accounts, orders, and reviews and restore the original demo data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            clearDatabase();
            await removeItem(STORAGE_KEYS.SESSION);
          },
        },
      ],
    );
  }

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      router.replace('/');
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
        {logoReady && (
          <Image
            source={{ uri: LOGO.localUri ?? LOGO.uri }}
            style={styles.logo}
            resizeMode="contain"
          />
        )}

        <Text style={styles.title}>Welcome to Drip</Text>

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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in…' : 'Log In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/register')}
          disabled={loading}
        >
          <Text style={styles.link}>Don't have an account? Create one</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={confirmReset}
          activeOpacity={0.7}
          disabled={loading}
        >
          <Text style={styles.resetText}>Reset Demo Data</Text>
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
    justifyContent: 'center',
    padding: 24,
    backgroundColor: drip.white,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: drip.darkTeal,
    marginBottom: 32,
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
    marginBottom: 16,
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: drip.white,
    fontSize: 17,
    fontWeight: '700',
  },
  link: {
    color: drip.darkTeal,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  resetBtn: {
    marginTop: 32,
  },
  resetText: {
    color: drip.mutedText,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
