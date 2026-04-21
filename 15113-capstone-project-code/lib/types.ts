export type Role = 'wearer' | 'washer';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
  displayName: string;
  createdAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'done'
  | 'cancelled';

export interface LaundryItem {
  label: string;
  quantity: number;
}

export interface Order {
  id: string;
  wearerId: string;
  washerId: string | null;
  items: LaundryItem[];
  pickupTime: string;
  notes: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
