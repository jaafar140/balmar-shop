import { FeeStructure, TransactionStatus, Product, User } from '../types';

/**
 * LOGIC A: Service de Transaction & Escrow
 * Gère le cycle de vie financier et logistique.
 */

const SHIPPING_BASE_FEE = 35; // MAD
const SERVICE_FEE_PERCENTAGE = 0.05; // 5%

export const calculateTransactionFees = (
  product: Product, 
  buyer: User, 
  paymentMethod: 'COD' | 'CARD' | 'WALLET'
): FeeStructure => {
  const serviceFee = Math.round(product.price * SERVICE_FEE_PERCENTAGE);
  const shipping = SHIPPING_BASE_FEE;
  
  let deposit = 0;
  
  // Logique de COD Intelligent
  if (paymentMethod === 'COD') {
    // Si score faible ou prix élevé, on demande un dépôt (ex: Frais de port + Service Fee)
    // Cela protège contre les "No-Shows"
    if (buyer.trustScore < 70 || product.price > 1000) {
      deposit = shipping + serviceFee + (product.price * 0.1); // 10% du prix en caution
    }
  }

  // Arrondir le dépôt
  deposit = Math.ceil(deposit / 10) * 10;

  return {
    productPrice: product.price,
    shippingFee: shipping,
    serviceFee: serviceFee,
    depositRequired: deposit,
    total: product.price + shipping + serviceFee
  };
};

// Machine à états simplifiée pour simulation
export const getNextStatus = (current: TransactionStatus, action: string): TransactionStatus => {
  switch (current) {
    case TransactionStatus.CREATED:
      return action === 'PAY_DEPOSIT' ? TransactionStatus.DEPOSIT_PAID : TransactionStatus.PAID_ESCROW;
    
    case TransactionStatus.DEPOSIT_PAID:
    case TransactionStatus.PAID_ESCROW:
      return TransactionStatus.SHIPPED;
      
    case TransactionStatus.SHIPPED:
      return TransactionStatus.DELIVERED;
      
    case TransactionStatus.DELIVERED:
      // Loi 31-08: Période de rétractation passée ou validation acheteur
      return action === 'VALIDATE' ? TransactionStatus.COMPLETED : TransactionStatus.DISPUTE;
      
    default:
      return current;
  }
};