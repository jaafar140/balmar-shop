
import { User, UserRole, VerificationLevel } from './types';

export const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fes',
  'Tanger',
  'Agadir',
  'Meknes'
];

// Images provenant d'Unsplash pour un look professionnel
export const HERO_IMAGE = "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=2000&auto=format&fit=crop"; 

export const CATEGORIES = [
  { 
    id: 'caftan', 
    name: 'Caftans & Beldi', 
    image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=300&auto=format&fit=crop' 
  },
  { 
    id: 'women', 
    name: 'Femmes', 
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=300&auto=format&fit=crop'
  },
  { 
    id: 'men', 
    name: 'Hommes', 
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=300&auto=format&fit=crop'
  },
  { 
    id: 'sneakers', 
    name: 'Sneakers', 
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=300&auto=format&fit=crop'
  },
  { 
    id: 'kids', 
    name: 'Enfants', 
    image: 'https://images.unsplash.com/photo-1519238263496-634399463fba?q=80&w=300&auto=format&fit=crop'
  },
  { 
    id: 'bags', 
    name: 'Sacs & Accessoires', 
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300&auto=format&fit=crop'
  },
];

// MOCK USER INITIAL (Utilisé uniquement pour le seeding initial)
export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Salma Benali',
  email: 'salma.b@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  roles: [UserRole.BUYER], 
  trustScore: 85,
  verificationLevel: VerificationLevel.BASIC,
  location: 'Casablanca, Maarif',
  defaultAddress: {
    street: '12 Rue des Iris',
    city: 'Casablanca',
    district: 'Maarif',
    postalCode: '20000',
    coordinates: { lat: 33.5898, lng: -7.6038 }
  },
  savedAddresses: [{
    street: '12 Rue des Iris',
    city: 'Casablanca',
    district: 'Maarif',
    postalCode: '20000',
    coordinates: { lat: 33.5898, lng: -7.6038 }
  }],
  favorites: [], // Initialisation vide
  following: [], // Initialisation vide
  badges: ['Membre Actif'],
  reviewsCount: 15,
  averageRating: 4.8,
  successfulTransactions: 12
};