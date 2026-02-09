
export type Language = 'fr' | 'ari'; // 'ari' = Darija (Arabic script or Latin)

export const translations = {
  fr: {
    home: 'Accueil',
    explore: 'Explorer',
    sellButton: 'Vendre',
    searchPlaceholder: 'Rechercher un caftan, une jellaba...',
    heroTitle: 'La mode marocaine,\nseconde main & première classe.',
    heroSubtitle: 'Achetez et vendez des vêtements authentiques en toute confiance. Paiement à la livraison sécurisé et vérification par IA.',
    popularCategories: 'Catégories Populaires',
    latestItems: 'Dernières Pépites',
    buyNow: 'Acheter maintenant',
    makeOffer: 'Faire une offre',
    condition: 'État',
    brand: 'Marque',
    description: 'Description',
    seller: 'Vendeur',
    securePayment: 'Paiement Sécurisé',
    shipping: 'Livraison',
    total: 'Total',
    login: 'Se connecter',
    signup: 'S\'inscrire',
    // Categories
    caftan: 'Caftans & Beldi',
    women: 'Femmes',
    men: 'Hommes',
    kids: 'Enfants',
    sneakers: 'Sneakers',
    bags: 'Sacs & Accessoires'
  },
  ari: {
    home: 'Raïssiya',
    explore: 'Ktachf',
    sellButton: 'Bi3 Daba',
    searchPlaceholder: 'Qelleb 3la caftan, jellaba...',
    heroTitle: 'Lmoda dyalna,\n2eme main w luxe.',
    heroSubtitle: 'Bi3 w chri hwayj nqyine b tiqa. Khalless mli yweslek (COD) m3a verification IA.',
    popularCategories: 'Anwa3 Matlouba',
    latestItems: 'Akher Ma Kayn',
    buyNow: 'Chri Daba',
    makeOffer: '3ti tamanek',
    condition: 'Hala',
    brand: 'Marque',
    description: 'Wasf',
    seller: 'Lbay3',
    securePayment: 'Khlass Madmoun',
    shipping: 'Tawsil',
    total: 'Total',
    login: 'Dkhoul',
    signup: 'Tsajjel',
    // Categories
    caftan: 'Caftan w Beldi',
    women: '3yalat',
    men: 'Rjal',
    kids: 'Drari Sghar',
    sneakers: 'Sbrdilat',
    bags: 'Sikan w Accessoires'
  }
};

export const formatMoney = (amount: number, currency = 'MAD') => {
  return new Intl.NumberFormat('fr-MA', { 
    style: 'currency', 
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
