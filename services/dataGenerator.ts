
import { User, Product, Transaction, UserRole, Condition, VerificationLevel, TransactionStatus } from '../types';

const FIRST_NAMES = ['Salma', 'Youssef', 'Mehdi', 'Fatima', 'Karim', 'Sofia', 'Omar', 'Kenza', 'Amine', 'Nadia'];
const LAST_NAMES = ['Benali', 'Alami', 'Idrissi', 'Tazi', 'Berrada', 'Fassi', 'Chraibi', 'Ouazzani'];
const MOROCCAN_CITIES = [
  { name: 'Casablanca', districts: ['Maarif', 'Racine', 'Ain Diab', 'Sidi Bernoussi'], baseLat: 33.5731, baseLng: -7.5898 },
  { name: 'Rabat', districts: ['Agdal', 'Hay Riad', 'Souissi', 'Ocean'], baseLat: 34.0209, baseLng: -6.8416 },
  { name: 'Marrakech', districts: ['Gueliz', 'Hivernage', 'Medina'], baseLat: 31.6295, baseLng: -7.9811 },
  { name: 'Fes', districts: ['Ville Nouvelle', 'Medina'], baseLat: 34.0181, baseLng: -5.0078 },
  { name: 'Tanger', districts: ['Malabata', 'Centre Ville'], baseLat: 35.7595, baseLng: -5.8340 }
];

export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }).map((_, i) => {
    const city = MOROCCAN_CITIES[Math.floor(Math.random() * MOROCCAN_CITIES.length)];
    const district = city.districts[Math.floor(Math.random() * city.districts.length)];
    const isSeller = Math.random() > 0.7;
    const address = {
      street: `${Math.floor(Math.random() * 100)} Rue ${['Des FAR', 'Zerktouni', 'Mohammed V', 'Hassan II'][Math.floor(Math.random() * 4)]}`,
      city: city.name,
      district: district,
      coordinates: { lat: city.baseLat, lng: city.baseLng }
    };

    return {
      id: `u_${i}`,
      name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 80)}.jpg`,
      roles: isSeller ? [UserRole.BUYER, UserRole.SELLER] : [UserRole.BUYER],
      trustScore: Math.floor(Math.random() * 40) + 60, // 60-100
      verificationLevel: Math.random() > 0.6 ? VerificationLevel.BIOMETRIC : VerificationLevel.BASIC,
      location: `${city.name}, ${district}`,
      defaultAddress: address,
      savedAddresses: [address],
      favorites: [],
      following: [],
      badges: isSeller ? ['Vendeur Vérifié'] : [],
      reviewsCount: Math.floor(Math.random() * 50),
      averageRating: 3 + Math.random() * 2,
      successfulTransactions: Math.floor(Math.random() * 30),
      sellerProfile: isSeller ? { isKycVerified: true } : undefined
    };
  });
};

const PRODUCT_TEMPLATES = [
  { title: 'Caftan Mobra Vert Royal', category: 'Caftans & Beldi', priceRange: [1500, 3000] },
  { title: 'Djellaba Mlifa Noir', category: 'Caftans & Beldi', priceRange: [400, 800] },
  { title: 'Gandoura Été Légère', category: 'Hommes', priceRange: [200, 500] },
  { title: 'Sac à main Cuir Artisanal', category: 'Sacs & Accessoires', priceRange: [300, 600] },
  { title: 'Sneakers Nike Air Jordan', category: 'Sneakers', priceRange: [800, 2000] },
  { title: 'Robe Zara Soirée', category: 'Femmes', priceRange: [200, 400] },
  { title: 'Veste Jean Vintage', category: 'Femmes', priceRange: [150, 300] },
  { title: 'Ensemble Bébé 3 mois', category: 'Enfants', priceRange: [80, 200] },
];

export const generateProducts = (count: number, users: User[]): Product[] => {
  return Array.from({ length: count }).map((_, i) => {
    const template = PRODUCT_TEMPLATES[Math.floor(Math.random() * PRODUCT_TEMPLATES.length)];
    const seller = users[Math.floor(Math.random() * users.length)];
    const price = Math.floor(Math.random() * (template.priceRange[1] - template.priceRange[0]) + template.priceRange[0]);
    const sizes = ['S', 'M', 'L', 'XL', '38', '40', '42', '44'];

    return {
      id: `p_${i}`,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerScore: seller.trustScore,
      title: template.title,
      description: `Article en excellent état. Porté très peu de fois. Remise en main propre possible sur ${seller.location.split(',')[0]}. Prix négociable dans la limite du raisonnable.`,
      price: price,
      originalPrice: Math.floor(price * 1.3),
      category: template.category,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      condition: Object.values(Condition)[Math.floor(Math.random() * 5)],
      images: [
        `https://source.unsplash.com/random/400x500/?fashion,${template.category.split(' ')[0]}?sig=${i}`,
        `https://source.unsplash.com/random/400x500/?clothing,detail?sig=${i+1000}`
      ],
      likes: Math.floor(Math.random() * 50),
      isPromoted: Math.random() > 0.9,
      aiVerified: Math.random() > 0.7,
      location: seller.location.split(',')[0].trim() // Extract City
    };
  });
};

export const generateTransactions = (count: number, products: Product[], users: User[]): Transaction[] => {
  return Array.from({ length: count }).map((_, i) => {
    const product = products[Math.floor(Math.random() * products.length)];
    const buyer = users[Math.floor(Math.random() * users.length)];
    const seller = users.find(u => u.id === product.sellerId) || users[0];

    return {
      id: `txn_${i}`,
      productId: product.id,
      buyerId: buyer.id,
      sellerId: seller.id,
      status: Object.values(TransactionStatus)[Math.floor(Math.random() * Object.values(TransactionStatus).length)],
      amounts: {
        productPrice: product.price,
        shippingFee: 35,
        serviceFee: product.price * 0.05,
        depositRequired: 0,
        total: product.price + 35 + (product.price * 0.05)
      },
      paymentMethod: Math.random() > 0.6 ? 'COD' : 'CARD',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      deliveryAddress: buyer.defaultAddress!,
      contactPhone: '0661123456'
    };
  });
};