
import { supabase, isCloudMode } from './supabaseClient';
import { User, UserRole, VerificationLevel } from '../types';
import { generateUsers } from './dataGenerator';

const STORAGE_KEYS = {
  USERS: 'balmar_users_v1',
  CURRENT_USER: 'balmar_current_user_v1'
};

// --- LOCAL MOCK HELPERS ---
const getLocalUsers = (): User[] => {
  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!usersJson) {
    // Si pas d'utilisateurs, on en génère (First run)
    const initialUsers = generateUsers(5);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(usersJson);
};

export const authService = {
  // --- LOGIN ---
  login: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    // Mode CLOUD (Supabase)
    if (isCloudMode && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { user: null, error: error.message };
      
      const sbUser = data.user;
      const appUser: User = {
        id: sbUser.id,
        email: sbUser.email,
        name: sbUser.user_metadata?.name || 'Utilisateur',
        avatar: 'https://via.placeholder.com/150',
        roles: [UserRole.BUYER],
        trustScore: 50,
        verificationLevel: VerificationLevel.NONE,
        location: 'Maroc',
        savedAddresses: [],
        favorites: [],
        following: [],
        badges: [],
        reviewsCount: 0,
        averageRating: 0,
        successfulTransactions: 0
      };
      return { user: appUser, error: null };
    } 
    
    // Mode LOCAL (Simulation)
    else {
      await new Promise(resolve => setTimeout(resolve, 800)); // Latence réseau simulée
      const users = getLocalUsers();
      
      const foundUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // Migration: Assurer que following existe
        if (!foundUser.following) foundUser.following = [];
        
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(foundUser));
        return { user: foundUser, error: null };
      } else {
        return { user: null, error: "Email introuvable. Essayez 'salma.b@example.com' pour la démo." };
      }
    }
  },

  // --- SIGNUP ---
  signup: async (name: string, email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    // Mode CLOUD
    if (isCloudMode && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) return { user: null, error: error.message };
      return { user: null, error: null }; 
    }
    
    // Mode LOCAL
    else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const users = getLocalUsers();
      
      if (users.find(u => u.email === email)) {
        return { user: null, error: "Cet email existe déjà." };
      }

      const newUser: User = {
        id: `u_${Date.now()}`,
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        roles: [UserRole.BUYER],
        trustScore: 50, // Score de départ neutre
        verificationLevel: VerificationLevel.BASIC, // Email considéré vérifié
        location: 'Casablanca', // Défaut
        savedAddresses: [],
        favorites: [],
        following: [],
        badges: ['Nouveau'],
        reviewsCount: 0,
        averageRating: 0,
        successfulTransactions: 0
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      
      return { user: newUser, error: null };
    }
  },

  // --- LOGOUT ---
  logout: async () => {
    if (isCloudMode && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // --- GET SESSION ---
  getCurrentUser: async (): Promise<User | null> => {
    if (isCloudMode && supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        return {
           id: data.user.id,
           email: data.user.email,
           name: data.user.user_metadata?.name || 'Utilisateur',
           avatar: 'https://via.placeholder.com/150',
           roles: [UserRole.BUYER],
           trustScore: 50,
           verificationLevel: VerificationLevel.NONE,
           location: 'Maroc',
           savedAddresses: [],
           favorites: [],
           following: [],
           badges: [],
           reviewsCount: 0,
           averageRating: 0,
           successfulTransactions: 0
        };
      }
      return null;
    } else {
      const json = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const u = json ? JSON.parse(json) : null;
      if (u && !u.following) u.following = [];
      return u;
    }
  }
};