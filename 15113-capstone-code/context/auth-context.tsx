import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthContextType,
  User,
  SenderProfile,
  SudserProfile,
} from '@/types';
import { mockTestUsers, mockSudsers } from '@/lib/mock-data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SenderProfile | SudserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    // For MVP, we'll check localStorage (in a real app, use secure storage)
    try {
      const storedUser = localStorage.getItem('dripUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check against test users
      let foundUser: any = null;
      if (email === mockTestUsers.sender.email && password === mockTestUsers.sender.password) {
        foundUser = mockTestUsers.sender;
      } else if (
        email === mockTestUsers.sudser.email &&
        password === mockTestUsers.sudser.password
      ) {
        foundUser = mockTestUsers.sudser;
      } else {
        // Try to match against any mock sudser
        const sudser = mockSudsers.find(s => s.email === email && s.password === password);
        if (sudser) {
          foundUser = sudser;
        }
      }

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      setUser(foundUser);
      localStorage.setItem('dripUser', JSON.stringify(foundUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    phone: string,
    name: string,
    role: 'sender' | 'sudser'
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if email already exists (in real app, check against backend)
      if (email === mockTestUsers.sender.email || email === mockTestUsers.sudser.email) {
        throw new Error('This email is already registered');
      }

      // Create new user
      const newUser =
        role === 'sender'
          ? {
              id: `sender_${Date.now()}`,
              email,
              password,
              phone,
              name,
              role: 'sender' as const,
              address: '',
              notificationsEnabled: true,
              createdAt: new Date().toISOString(),
            }
          : {
              id: `sudser_${Date.now()}`,
              email,
              password,
              phone,
              name,
              role: 'sudser' as const,
              bio: '',
              rating: 4.5,
              reviewCount: 0,
              hourlyRate: 15,
              services: ['wash_fold'],
              availability: [
                { day: 'Monday', startTime: '5:00 PM', endTime: '8:00 PM' },
                { day: 'Friday', startTime: '5:00 PM', endTime: '8:00 PM' },
                { day: 'Saturday', startTime: '10:00 AM', endTime: '4:00 PM' },
              ],
              createdAt: new Date().toISOString(),
            };

      setUser(newUser);
      localStorage.setItem('dripUser', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dripUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
