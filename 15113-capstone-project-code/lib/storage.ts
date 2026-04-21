import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  USERS: 'drip_users',
  ORDERS: 'drip_orders',
  SESSION: 'drip_session',
  SEEDED: 'drip_seeded',
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  const json = await AsyncStorage.getItem(key);
  return json != null ? (JSON.parse(json) as T) : null;
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
