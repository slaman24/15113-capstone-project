// User types
export type UserRole = 'sender' | 'sudser';

export interface User {
  id: string;
  email: string;
  password: string;
  phone: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface SenderProfile extends User {
  address?: string;
  notificationsEnabled: boolean;
}

export interface SudserProfile extends User {
  bio?: string;
  profilePhoto?: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  services: ServiceType[];
  availability: TimeSlot[];
}

// Service types
export type ServiceType = 'wash_fold' | 'delicates' | 'dry_cleaning' | 'rush';

export interface ServiceOption {
  id: ServiceType;
  name: string;
  description: string;
  basePrice: number;
}

// Booking types
export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  senderId: string;
  sudserName: string;
  sudserPhoto?: string;
  services: ServiceType[];
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  status: BookingStatus;
  estimatedPrice: number;
  specialNotes?: string;
  pickupAddress?: string;
  createdAt: string;
}

export interface SudserBooking extends Booking {
  senderName: string;
  senderAddress: string;
  senderPhone: string;
}

// Time slot
export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: string;
}

// Auth context
export interface AuthContextType {
  user: SenderProfile | SudserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, phone: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}
