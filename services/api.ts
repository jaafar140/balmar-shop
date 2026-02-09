
import { Product, User, Transaction, Notification } from '../types';
import { authService } from './authService';
import { generateProducts, generateUsers, generateTransactions } from './dataGenerator';

const STORAGE_KEYS = {
  PRODUCTS: 'balmar_products_v1',
  USERS: 'balmar_users_v1',
  TRANSACTIONS: 'balmar_transactions_v1',
  NOTIFICATIONS: 'balmar_notifications_v1',
};

// URL de l'API Backend (Express + MongoDB)
// Si REACT_APP_API_URL n'est pas défini, on tente le localhost:5000 par défaut
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Pour basculer en mode PROD, on vérifie si on arrive à joindre l'API (simple check)
// Dans ce contexte démo, on suppose que si API_URL est défini ou défaut, on tente le mode connecté.
const IS_PROD = true; 

const initializeLocalData = () => {
  if (localStorage.getItem(STORAGE_KEYS.PRODUCTS)) return;

  console.log("🌱 Initialisation de la Base de Données Locale (Fallback)...");
  const users = generateUsers(20);
  const products = generateProducts(50, users);
  const transactions = generateTransactions(10, products, users);

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

// Helper pour fetcher l'API
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        }
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  } catch (error) {
      // Si l'API échoue (ex: serveur éteint), on pourrait fallback sur le localStorage
      // Pour l'instant on propage l'erreur pour voir ce qui se passe
      console.warn("API Backend inaccessible, assurez-vous que le serveur tourne sur port 5000");
      throw error;
  }
};

export const api = {
  auth: authService,

  products: {
    getAll: async (): Promise<Product[]> => {
      try {
        return await fetchApi('/products');
      } catch (e) {
        // Fallback LocalStorage si API down
        console.log("Switching to LocalStorage (API Down)");
        initializeLocalData();
        await new Promise(r => setTimeout(r, 600));
        const allProducts: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
        const allUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        return allProducts.filter(p => {
            const seller = allUsers.find(u => u.id === p.sellerId);
            return !(seller && seller.sellerProfile?.vacationMode);
        });
      }
    },
    
    getById: async (id: string): Promise<Product | undefined> => {
      try {
        return await fetchApi(`/products/${id}`);
      } catch (e) {
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
        return products.find((p: Product) => p.id === id);
      }
    },

    create: async (product: Product): Promise<Product> => {
      try {
        return await fetchApi('/products', { method: 'POST', body: JSON.stringify(product) });
      } catch (e) {
        await new Promise(r => setTimeout(r, 800));
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
        const newProduct = { ...product, id: `p_${Date.now()}` };
        products.unshift(newProduct);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

        // Logic Notification Locale
        try {
            const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            const followers = users.filter(u => u.following && u.following.includes(product.sellerId));
            if (followers.length > 0) {
                const notifications: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
                followers.forEach(follower => {
                    const notif: Notification = {
                        id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        userId: follower.id,
                        title: `Nouveauté chez ${product.sellerName}`,
                        message: `${product.sellerName} a publié un nouvel article : "${product.title}"`,
                        type: 'NEW_POST',
                        isRead: false,
                        date: new Date(),
                        link: `/product/${newProduct.id}`
                    };
                    notifications.unshift(notif);
                });
                localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
            }
        } catch (ex) { console.error(ex); }
        return newProduct;
      }
    },

    update: async (productId: string, updates: Partial<Product>): Promise<void> => {
       try {
          await fetchApi(`/products/${productId}`, { method: 'PATCH', body: JSON.stringify(updates) });
       } catch (e) {
          await new Promise(r => setTimeout(r, 500));
          const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
          const index = products.findIndex((p: Product) => p.id === productId);
          if (index !== -1) {
             products[index] = { ...products[index], ...updates };
             localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
          }
       }
    },

    delete: async (productId: string): Promise<void> => {
       try {
           await fetchApi(`/products/${productId}`, { method: 'DELETE' });
       } catch (e) {
           await new Promise(r => setTimeout(r, 500));
           const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
           const filtered = products.filter((p: Product) => p.id !== productId);
           localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
       }
    }
  },

  users: {
    getCurrent: async (): Promise<User | null> => {
       return await authService.getCurrentUser();
    },
    
    getById: async (id: string): Promise<User | null> => {
       try {
           return await fetchApi(`/users/${id}`);
       } catch (e) {
           const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
           return users.find((u: User) => u.id === id) || null;
       }
    },

    updateCurrent: async (updates: Partial<User>): Promise<User> => {
       const currentUser = await authService.getCurrentUser();
       if (!currentUser) throw new Error("No user logged in");

       const updated = { ...currentUser, ...updates };
       
       try {
           await fetchApi(`/users/${currentUser.id}`, { method: 'PATCH', body: JSON.stringify(updates) });
       } catch (e) {
         localStorage.setItem('balmar_current_user_v1', JSON.stringify(updated));
         const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
         const index = users.findIndex((u: User) => u.id === currentUser.id);
         if(index !== -1) {
            users[index] = updated;
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
         }
       }
       return updated;
    },
    
    deleteAccount: async (): Promise<void> => {
        try {
            const currentUser = await authService.getCurrentUser();
            if(currentUser) await fetchApi(`/users/${currentUser.id}`, { method: 'DELETE' });
        } catch (e) {
            await new Promise(r => setTimeout(r, 1000));
            localStorage.removeItem('balmar_current_user_v1');
        }
    },

    getNotifications: async (): Promise<Notification[]> => {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) return [];

        try {
            return await fetchApi(`/users/${currentUser.id}/notifications`);
        } catch (e) {
            await new Promise(r => setTimeout(r, 300));
            const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
            let notifs: Notification[] = [];
            if (stored) {
                notifs = JSON.parse(stored);
                return notifs.filter(n => n.userId === currentUser.id);
            }
            return [
                { id: 'n1', userId: currentUser.id, title: 'Bienvenue !', message: 'Remplissez votre profil.', type: 'SYSTEM', isRead: false, date: new Date() },
                { id: 'n2', userId: currentUser.id, title: 'Promo', message: 'Livraison gratuite ce weekend !', type: 'PROMO', isRead: true, date: new Date(Date.now() - 86400000) }
            ];
        }
    },
    
    markNotificationRead: async (id: string): Promise<void> => {
        try {
            await fetchApi(`/notifications/${id}/read`, { method: 'POST' });
        } catch (e) {
            const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
            if (stored) {
                const notifs: Notification[] = JSON.parse(stored);
                const updated = notifs.map(n => n.id === id ? { ...n, isRead: true } : n);
                localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
            }
        }
    },

    rateSeller: async (sellerId: string, rating: number): Promise<void> => {
        try {
            await fetchApi(`/users/${sellerId}/rate`, { method: 'POST', body: JSON.stringify({ rating }) });
        } catch (e) {
            await new Promise(r => setTimeout(r, 500));
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            const index = users.findIndex((u: User) => u.id === sellerId);
            if (index !== -1) {
                const seller = users[index];
                const newCount = (seller.reviewsCount || 0) + 1;
                const newAvg = ((seller.averageRating || 0) * (seller.reviewsCount || 0) + rating) / newCount;
                users[index] = { 
                    ...seller, 
                    reviewsCount: newCount, 
                    averageRating: parseFloat(newAvg.toFixed(1)),
                    trustScore: Math.min(seller.trustScore + 2, 100)
                };
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            }
        }
    }
  },

  transactions: {
    create: async (transaction: Transaction): Promise<Transaction> => {
       try {
           return await fetchApi('/transactions', { method: 'POST', body: JSON.stringify(transaction) });
       } catch (e) {
         await new Promise(r => setTimeout(r, 1000));
         const txs = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
         const newTx = { ...transaction, id: `tx_${Date.now()}` };
         txs.push(newTx);
         localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
         return newTx;
       }
    },
    
    cancel: async (txId: string): Promise<void> => {
        try {
            await fetchApi(`/transactions/${txId}/cancel`, { method: 'POST' });
        } catch (e) {
            await new Promise(r => setTimeout(r, 500));
            const txs: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
            const index = txs.findIndex(t => t.id === txId);
            if (index !== -1) {
                txs[index].status = 'CANCELLED' as any;
                localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
            }
        }
    },
    
    complete: async (txId: string): Promise<void> => {
        try {
             await fetchApi(`/transactions/${txId}/complete`, { method: 'POST' });
        } catch (e) {
            await new Promise(r => setTimeout(r, 500));
            const txs: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
            const index = txs.findIndex(t => t.id === txId);
            if (index !== -1) {
                txs[index].status = 'COMPLETED' as any;
                localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
            }
        }
    }
  }
};
