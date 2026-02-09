
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<string | null>;
  signup: (name: string, email: string, pass: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  followUser: (sellerId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      console.error("Auth Init Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const refreshUser = async () => {
    await initAuth();
  };

  const login = async (email: string, pass: string) => {
    const { user, error } = await authService.login(email, pass);
    if (user) setUser(user);
    return error;
  };

  const signup = async (name: string, email: string, pass: string) => {
    const { user, error } = await authService.signup(name, email, pass);
    if (user) setUser(user);
    return error;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) return;
    
    const currentFavs = user.favorites || [];
    let newFavs;
    if (currentFavs.includes(productId)) {
        newFavs = currentFavs.filter(id => id !== productId);
    } else {
        newFavs = [...currentFavs, productId];
    }
    
    // Update local state immediately for UI snap
    setUser({ ...user, favorites: newFavs });
    
    // Persist
    await api.users.updateCurrent({ favorites: newFavs });
  };

  const followUser = async (sellerId: string) => {
    if (!user) return;
    
    const currentFollowing = user.following || [];
    let newFollowing;
    
    if (currentFollowing.includes(sellerId)) {
      newFollowing = currentFollowing.filter(id => id !== sellerId);
    } else {
      newFollowing = [...currentFollowing, sellerId];
    }
    
    // Optimistic UI Update
    setUser({ ...user, following: newFollowing });
    
    // Persist to API/LocalStorage
    await api.users.updateCurrent({ following: newFollowing });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser, toggleFavorite, followUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);