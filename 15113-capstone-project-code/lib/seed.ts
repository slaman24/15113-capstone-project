import { hashPassword } from './hash';
import { getItem, setItem, STORAGE_KEYS } from './storage';
import type { User, Order } from './types';

export async function seedIfNeeded(): Promise<void> {
  const seeded = await getItem<boolean>(STORAGE_KEYS.SEEDED);
  if (seeded) return;

  const [hash1, hash2, hash3, hash4] = await Promise.all([
    hashPassword('laundry123'),
    hashPassword('campus456'),
    hashPassword('cleanit789'),
    hashPassword('sudsy2024'),
  ]);

  const now = new Date().toISOString();

  const users: User[] = [
    {
      id: 'seed-user-0001',
      username: 'alex_w',
      passwordHash: hash1,
      role: 'wearer',
      displayName: 'Alex W.',
      avatar: '👕',
      createdAt: now,
    },
    {
      id: 'seed-user-0002',
      username: 'jamie_w',
      passwordHash: hash2,
      role: 'wearer',
      displayName: 'Jamie W.',
      avatar: '👗',
      createdAt: now,
    },
    {
      id: 'seed-user-0003',
      username: 'morgan_washer',
      passwordHash: hash3,
      role: 'washer',
      displayName: 'Morgan',
      avatar: '✨',
      createdAt: now,
    },
    {
      id: 'seed-user-0004',
      username: 'riley_washer',
      passwordHash: hash4,
      role: 'washer',
      displayName: 'Riley',
      avatar: '🧺',
      createdAt: now,
    },
  ];

  const orders: Order[] = [
    {
      id: 'order-aaa001',
      wearerId: 'seed-user-0001',
      washerId: null,
      items: [
        { label: 'Shirts', quantity: 3 },
        { label: 'Pants', quantity: 2 },
      ],
      pickupTime: 'Tomorrow 10am',
      notes: '',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'order-aaa002',
      wearerId: 'seed-user-0001',
      washerId: 'seed-user-0003',
      items: [
        { label: 'Socks', quantity: 5 },
        { label: 'Towels', quantity: 1 },
      ],
      pickupTime: 'Today 3pm',
      notes: '',
      status: 'accepted',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'order-aaa003',
      wearerId: 'seed-user-0002',
      washerId: 'seed-user-0004',
      items: [
        { label: 'Shirts', quantity: 2 },
        { label: 'Bedding', quantity: 1 },
      ],
      pickupTime: 'Wed 9am',
      notes: '',
      status: 'in_progress',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'order-aaa004',
      wearerId: 'seed-user-0002',
      washerId: 'seed-user-0003',
      items: [{ label: 'Pants', quantity: 4 }],
      pickupTime: 'Last Friday',
      notes: '',
      status: 'done',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'order-aaa005',
      wearerId: 'seed-user-0001',
      washerId: null,
      items: [{ label: 'Bedding', quantity: 1 }],
      pickupTime: 'Mon 8am',
      notes: '',
      status: 'cancelled',
      createdAt: now,
      updatedAt: now,
    },
  ];

  await setItem(STORAGE_KEYS.USERS, users);
  await setItem(STORAGE_KEYS.ORDERS, orders);
  await setItem(STORAGE_KEYS.SEEDED, true);
}
