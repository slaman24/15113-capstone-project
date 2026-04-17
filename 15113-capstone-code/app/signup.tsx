import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { useAuth } from '@/context/auth-context';
import { router } from 'expo-router';

export default function SignupScreen() {
  const { signup, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'sender' | 'sudser'>('sender');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Enter a valid email';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8)
      newErrors.password = 'Password must be 8+ characters';
    else if (!/[A-Z]/.test(password))
      newErrors.password = 'Must include uppercase letter';
    else if (!/[0-9]/.test(password))
      newErrors.password = 'Must include number';

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    if (!phone) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      await signup(email, password, phone, name, role);
      router.dismiss();
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Please try again');
    }
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      setPhone(cleaned);
    } else if (cleaned.length <= 6) {
      setPhone(`(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`);
    } else {
      setPhone(`(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`);
    }
  };

  const isPasswordValid = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
      </View>

      <View style={styles.roleSelector}>
        <Pressable
          style={[styles.roleButton, role === 'sender' && styles.roleButtonActive]}
          onPress={() => setRole('sender')}
        >
          <Text style={[styles.roleButtonText, role === 'sender' && styles.roleButtonTextActive]}>
            📦 I need laundry
          </Text>
        </Pressable>
        <Pressable
          style={[styles.roleButton, role === 'sudser' && styles.roleButtonActive]}
          onPress={() => setRole('sudser')}
        >
          <Text style={[styles.roleButtonText, role === 'sudser' && styles.roleButtonTextActive]}>
            🧺 I do laundry
          </Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text style={[styles.label, { marginTop: 16 }]}>Phone</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="(555) 123-4567"
          value={phone}
          onChangeText={formatPhone}
          editable={!isLoading}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        {password && (
          <View style={styles.passwordHints}>
            <Text style={[styles.hint, password.length >= 8 && styles.hintValid]}>
              ✓ 8+ characters
            </Text>
            <Text style={[styles.hint, /[A-Z]/.test(password) && styles.hintValid]}>
              ✓ Uppercase letter
            </Text>
            <Text style={[styles.hint, /[0-9]/.test(password) && styles.hintValid]}>
              ✓ Number
            </Text>
          </View>
        )}

        <Text style={[styles.label, { marginTop: 16 }]}>Confirm Password</Text>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isLoading}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Creating account...' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    padding: 24,
  },
  backButton: {
    paddingBottom: 16,
  },
  backText: {
    color: '#00D4FF',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#00D4FF',
    backgroundColor: '#E0F7FF',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  roleButtonTextActive: {
    color: '#00D4FF',
    fontWeight: '600',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2C3E50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
  },
  passwordHints: {
    marginTop: 8,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  hintValid: {
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#00D4FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#00D4FF',
    fontSize: 14,
    fontWeight: '600',
  },
});
