import React, { createContext, useContext, useState, useCallback } from 'react';
import { Booking, SudserBooking, BookingStatus } from '@/types';

interface BookingsContextType {
  // For Senders
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  getBooking: (id: string) => Booking | undefined;

  // For Sudsers
  pendingRequests: SudserBooking[];
  acceptedOrders: SudserBooking[];
  completedOrders: SudserBooking[];
  addPendingRequest: (booking: SudserBooking) => void;
  acceptOrder: (id: string) => void;
  declineOrder: (id: string) => void;
  markReadyForPickup: (id: string) => void;

  // Notifications
  notifications: any[];
  addNotification: (notification: any) => void;
  clearNotification: (id: string) => void;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export const BookingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingRequests, setPendingRequests] = useState<SudserBooking[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<SudserBooking[]>([]);
  const [completedOrders, setCompletedOrders] = useState<SudserBooking[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const addBooking = useCallback((booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  }, []);

  const updateBooking = useCallback((id: string, updates: Partial<Booking>) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const getBooking = useCallback(
    (id: string) => bookings.find(b => b.id === id),
    [bookings]
  );

  const addPendingRequest = useCallback((booking: SudserBooking) => {
    setPendingRequests(prev => [...prev, booking]);
    addNotification({
      id: `notif_${Date.now()}`,
      title: 'New booking request',
      message: `New booking from ${booking.senderName}`,
      type: 'info',
      timestamp: new Date().toISOString(),
    });
  }, []);

  const acceptOrder = useCallback((id: string) => {
    const request = pendingRequests.find(r => r.id === id);
    if (request) {
      setPendingRequests(prev => prev.filter(r => r.id !== id));
      setAcceptedOrders(prev => [...prev, { ...request, status: 'accepted' }]);
      addNotification({
        id: `notif_${Date.now()}`,
        title: 'Order accepted',
        message: `You accepted the booking from ${request.senderName}`,
        type: 'success',
        timestamp: new Date().toISOString(),
      });
    }
  }, [pendingRequests]);

  const declineOrder = useCallback((id: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id));
    addNotification({
      id: `notif_${Date.now()}`,
      title: 'Order declined',
      message: 'You declined this booking request',
      type: 'info',
      timestamp: new Date().toISOString(),
    });
  }, []);

  const markReadyForPickup = useCallback((id: string) => {
    const order = acceptedOrders.find(o => o.id === id);
    if (order) {
      setAcceptedOrders(prev => prev.filter(o => o.id !== id));
      setCompletedOrders(prev => [...prev, { ...order, status: 'completed' }]);
      addNotification({
        id: `notif_${Date.now()}`,
        title: 'Ready for pickup',
        message: `Laundry from ${order.senderName} is ready for pickup`,
        type: 'success',
        timestamp: new Date().toISOString(),
      });
    }
  }, [acceptedOrders]);

  const addNotification = useCallback((notification: any) => {
    setNotifications(prev => [...prev, notification]);
    // Auto-remove after 5 seconds
    setTimeout(() => {
      clearNotification(notification.id);
    }, 5000);
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        addBooking,
        updateBooking,
        getBooking,
        pendingRequests,
        acceptedOrders,
        completedOrders,
        addPendingRequest,
        acceptOrder,
        declineOrder,
        markReadyForPickup,
        notifications,
        addNotification,
        clearNotification,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
};
