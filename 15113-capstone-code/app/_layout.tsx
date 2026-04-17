import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { BookingsProvider } from '@/context/bookings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'sender',
};

function RootLayoutNav() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return (
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
      </Stack>
    );
  }

  if (!isAuthenticated) {
    return (
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: '',
            headerBackTitle: 'Back',
            headerShown: true,
          }}
        />
      </Stack>
    );
  }

  // Show appropriate stack based on user role
  if (user?.role === 'sender') {
    return (
      <Stack>
        <Stack.Screen name="(sender)" options={{ headerShown: false }} />
      </Stack>
    );
  } else if (user?.role === 'sudser') {
    return (
      <Stack>
        <Stack.Screen name="(sudser)" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <BookingsProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </BookingsProvider>
    </AuthProvider>
  );
}
