export type Role = 'wearer' | 'washer';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
  displayName: string;
  avatar?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  wearerId: string;
  washerId: string;
  rating: number;
  text: string;
  reviewerRole: 'wearer' | 'washer';
  createdAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'picked_up'
  | 'washing'
  | 'dropped_off'
  | 'cancelled';

export type WaterTemp = 'cold' | 'warm' | 'hot';

export interface LaundryItem {
  label: string;
  quantity: number;
}

export interface Order {
  id: string;
  wearerId: string;
  washerId: string | null;
  items: LaundryItem[];
  pickupDateTime: string;
  pickupLocation: string;
  dropoffDateTime: string;
  dropoffLocation: string;
  waterTemp: WaterTemp;
  notes: string;
  price: number;
  status: OrderStatus;
  statusTimestamps: Partial<Record<OrderStatus, string>>;
  createdAt: string;
  updatedAt: string;
}
