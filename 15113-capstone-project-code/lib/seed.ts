import { hashPassword } from './hash';
import { createOrder, createUser, getMeta, setMeta } from './database';
import type { Order, User } from './types';

export async function seedIfNeeded(): Promise<void> {
  if (getMeta('seeded') === '1') return;

  const [hash1, hash2, hash3, hash4] = await Promise.all([
    hashPassword('laundry123'),
    hashPassword('campus456'),
    hashPassword('cleanit789'),
    hashPassword('sudsy2024'),
  ]);

  const now = new Date().toISOString();
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString();
  const dayAfterTomorrow = new Date(Date.now() + 2 * 86_400_000).toISOString();
  const yesterday = new Date(Date.now() - 86_400_000).toISOString();

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
      pickupDateTime: tomorrow,
      pickupLocation: 'Mudge House Lobby',
      dropoffDateTime: dayAfterTomorrow,
      dropoffLocation: 'Mudge House Lobby',
      waterTemp: 'cold',
      notes: '',
      price: 10,
      status: 'pending',
      statusTimestamps: { pending: now },
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
      pickupDateTime: tomorrow,
      pickupLocation: 'Morewood Gardens Lobby',
      dropoffDateTime: dayAfterTomorrow,
      dropoffLocation: 'Morewood Gardens Lobby',
      waterTemp: 'warm',
      notes: '',
      price: 12,
      status: 'accepted',
      statusTimestamps: { pending: yesterday, accepted: now },
      createdAt: yesterday,
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
      pickupDateTime: tomorrow,
      pickupLocation: 'Stever Lobby',
      dropoffDateTime: tomorrow,
      dropoffLocation: 'Stever Lobby',
      waterTemp: 'hot',
      notes: 'Please use fragrance-free detergent.',
      price: 16,
      status: 'washing',
      statusTimestamps: { pending: yesterday, accepted: yesterday, picked_up: yesterday, washing: now },
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: 'order-aaa004',
      wearerId: 'seed-user-0002',
      washerId: 'seed-user-0003',
      items: [{ label: 'Pants', quantity: 4 }],
      pickupDateTime: yesterday,
      pickupLocation: 'Gates 5th Floor Commons',
      dropoffDateTime: yesterday,
      dropoffLocation: 'Gates 5th Floor Commons',
      waterTemp: 'cold',
      notes: '',
      price: 18,
      status: 'dropped_off',
      statusTimestamps: { pending: yesterday, accepted: yesterday, picked_up: yesterday, washing: yesterday, dropped_off: now },
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: 'order-aaa005',
      wearerId: 'seed-user-0001',
      washerId: null,
      items: [{ label: 'Bedding', quantity: 1 }],
      pickupDateTime: yesterday,
      pickupLocation: 'Maggie Mo Neighborhood Commons',
      dropoffDateTime: yesterday,
      dropoffLocation: 'Maggie Mo Neighborhood Commons',
      waterTemp: 'warm',
      notes: '',
      price: 15,
      status: 'cancelled',
      statusTimestamps: { pending: yesterday, cancelled: yesterday },
      createdAt: yesterday,
      updatedAt: yesterday,
    },
  ];

  for (const u of users) createUser(u);
  for (const o of orders) createOrder(o);
  setMeta('seeded', '1');
}
