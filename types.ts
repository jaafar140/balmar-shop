
export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export enum Condition {
  NEW_WITH_TAG = 'Neuf avec étiquette',
  NEW_WITHOUT_TAG = 'Neuf sans étiquette',
  VERY_GOOD = 'Très bon état',
  GOOD = 'Bon état',
  SATISFACTORY = 'Satisfaisant'
}

export enum VerificationLevel {
  NONE = 'NONE',
  BASIC = 'BASIC', // Email/Phone
  BIOMETRIC = 'BIOMETRIC' // ID Scan + Selfie
}

export enum TransactionStatus {
  CREATED = 'CREATED',           // Panier validé
  AWAITING_DEPOSIT = 'AWAITING_DEPOSIT', // En attente du dépôt (si COD risqué)
  DEPOSIT_PAID = 'DEPOSIT_PAID', // Dépôt payé, en attente expédition
  PAID_ESCROW = 'PAID_ESCROW',   // Totalité payée (Carte), fonds bloqués
  SHIPPED = 'SHIPPED',           // Colis envoyé
  DELIVERED = 'DELIVERED',       // Colis livré, période rétractation démarre (48h)
  COMPLETED = 'COMPLETED',       // Fonds libérés au vendeur
  DISPUTE = 'DISPUTE',           // Médiation ouverte
  CANCELLED = 'CANCELLED'        // Annulé par acheteur ou vendeur
}

export interface Address {
  street: string;
  city: string;
  district: string;
  postalCode?: string;
  coordinates?: { lat: number; lng: number };
}

export interface SellerProfile {
  isKycVerified: boolean;
  rib?: string;
  pickupAddress?: Address;
  vacationMode?: boolean; // Mode vacances
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  roles: UserRole[]; 
  trustScore: number; 
  verificationLevel: VerificationLevel;
  location: string;
  defaultAddress?: Address;
  savedAddresses: Address[]; 
  favorites: string[]; 
  following: string[]; // Liste des IDs des vendeurs suivis
  badges: string[];
  reviewsCount: number;
  averageRating: number; 
  successfulTransactions: number;
  sellerProfile?: SellerProfile;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerScore: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  size?: string; 
  condition: Condition;
  images: string[];
  likes: number;
  isPromoted?: boolean;
  aiVerified?: boolean;
  location?: string;
  isSold?: boolean;
}

export interface FeeStructure {
  productPrice: number;
  shippingFee: number;
  serviceFee: number; 
  depositRequired: number; 
  total: number;
}

export interface Transaction {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  status: TransactionStatus;
  amounts: FeeStructure;
  paymentMethod: 'COD' | 'CARD' | 'WALLET';
  createdAt: Date;
  deliveryAddress: Address; 
  contactPhone: string;
  trackingCode?: string;
  disputeReason?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'SYSTEM' | 'PROMO' | 'NEW_POST';
  isRead: boolean;
  date: Date;
  link?: string;
}

// --- MESSAGING TYPES ---

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: 'TEXT' | 'OFFER'; 
  offerAmount?: number;
  offerStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED'; // Nouveau champ
  createdAt: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[]; 
  participantDetails?: { id: string; name: string; avatar: string }[]; 
  productId?: string;
  productTitle?: string;
  productImage?: string;
  lastMessage?: Message;
  updatedAt: Date;
  unreadCount: number;
}