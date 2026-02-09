import { User, VerificationLevel } from '../types';

/**
 * LOGIC B: Service de Confiance & Vérification
 * Simule les algorithmes backend de scoring.
 */

// Simulation de l'appel API Jumio/Veriff
export const verifyUserIdentity = async (userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`[KYC] Démarrage analyse biométrique pour ${userId}...`);
    setTimeout(() => {
      console.log(`[KYC] Visage match ID à 99.8%. Utilisateur vérifié.`);
      resolve(true);
    }, 4000); // 4 secondes de délai simulé
  });
};

/**
 * Algorithme de calcul du Trust Score (Backend Logic)
 * 60% Notes/Avis + 20% Historique + 20% KYC
 */
export const calculateTrustScore = (user: User): { score: number; details: any } => {
  // 1. Composante Avis (60%)
  // Normalisation: 5 étoiles = 100 points
  const reviewScore = (user.averageRating / 5) * 100;
  const weightedReview = reviewScore * 0.6;

  // 2. Composante Historique (20%)
  // Plafond à 20 transactions pour le score max
  const historyScore = Math.min(user.successfulTransactions * 5, 100);
  const weightedHistory = historyScore * 0.2;

  // 3. Composante Vérification (20%)
  let kycScore = 0;
  if (user.verificationLevel === VerificationLevel.BIOMETRIC) kycScore = 100;
  else if (user.verificationLevel === VerificationLevel.BASIC) kycScore = 40;
  const weightedKyc = kycScore * 0.2;

  const totalScore = Math.round(weightedReview + weightedHistory + weightedKyc);

  return {
    score: totalScore,
    details: {
      reviewPart: weightedReview.toFixed(1),
      historyPart: weightedHistory.toFixed(1),
      kycPart: weightedKyc.toFixed(1)
    }
  };
};

export const canBypassDeposit = (user: User, productPrice: number): boolean => {
  // Règle métier : Si Score > 70 ET Prix < 1500 MAD, pas de dépôt obligatoire pour le COD
  if (user.trustScore >= 70 && productPrice < 1500) return true;
  // Si Utilisateur Biométrique, plafond augmenté
  if (user.verificationLevel === VerificationLevel.BIOMETRIC && productPrice < 3000) return true;
  
  return false;
};