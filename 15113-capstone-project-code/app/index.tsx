import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { drip } from '@/constants/theme';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={drip.teal} size="large" />
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;
  if (user.role === 'wearer') return <Redirect href="/(wearer)" />;
  return <Redirect href="/(washer)" />;
}
