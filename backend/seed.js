
/**
 * SCRIPT DE SEEDING MONGODB - BALMAR
 * Usage: node backend/seed.js
 * Assurez-vous d'avoir remplacé <db_password> ci-dessous ou dans votre .env
 */

const mongoose = require('mongoose');
const { User, Product, Transaction } = require('./models');

// IMPORTANT : Remplacez <db_password> par votre vrai mot de passe
const DEFAULT_URI = 'mongodb+srv://iriealbericcom_db_user:<db_password>@cluster0.tp9rvuv.mongodb.net/balmar_db?appName=Cluster0';
const MONGO_URI = process.env.MONGODB_URI || DEFAULT_URI;

const USER_COUNT = 500;
const PRODUCT_COUNT = 2000;

// Données Marocaines
const CITIES = [
  { name: 'Casablanca', districts: ['Maarif', 'Racine', 'Sidi Belyout', 'Ain Diab', 'Bernoussi'] },
  { name: 'Rabat', districts: ['Agdal', 'Hay Riad', 'Souissi', 'Ocean', 'Yacoub Mansour'] },
  { name: 'Marrakech', districts: ['Gueliz', 'Medina', 'Hivernage', 'Daoudiate'] },
  { name: 'Fes', districts: ['Ville Nouvelle', 'Medina', 'Saiss'] },
  { name: 'Tanger', districts: ['Centre', 'Malabata', 'Mesnana'] },
  { name: 'Agadir', districts: ['Talborjt', 'Sonaba', 'Dakhla'] }
];

const FIRST_NAMES = ['Amine', 'Salma', 'Youssef', 'Kenza', 'Omar', 'Sofia', 'Mehdi', 'Leila', 'Karim', 'Noura', 'Hassan', 'Meryem', 'Driss', 'Fatima', 'Rachid', 'Houda'];
const LAST_NAMES = ['Benali', 'Tazi', 'Berrada', 'Idrissi', 'Alaoui', 'Chraibi', 'Fassi', 'Bennani', 'El Amrani', 'Daoudi', 'Mansouri'];

const CATEGORIES = [
  { name: 'Caftans & Beldi', brands: ['Artisanat', 'Diamantine', 'Beldi Chic', 'Couture'], items: ['Caftan Mobra', 'Djellaba Mlifa', 'Gandoura Soie', 'Jabador', 'Takchita Mariage'] },
  { name: 'Femmes', brands: ['Zara', 'Mango', 'H&M', 'Massimo Dutti', 'Stradivarius'], items: ['Robe Soirée', 'Blazer Chic', 'Jean Mom Fit', 'Chemise Lin', 'Manteau Laine'] },
  { name: 'Hommes', brands: ['Zara Man', 'Celio', 'Nike', 'Adidas', 'Lacoste'], items: ['Polo Classique', 'Jean Slim', 'Veste Cuir', 'Costume Slim', 'T-shirt Vintage'] },
  { name: 'Sneakers', brands: ['Nike', 'Adidas', 'New Balance', 'Jordan', 'Puma'], items: ['Air Jordan 1', 'Yeezy Boost', 'Air Force 1', 'NB 550', 'Dunk Low'] },
  { name: 'Sacs & Accessoires', brands: ['Gucci', 'Louis Vuitton', 'Michael Kors', 'Coach', 'Vintage'], items: ['Sac à main', 'Pochette Soirée', 'Ceinture Cuir', 'Lunettes Soleil', 'Foulard Soie'] },
];

const CONDITIONS = ['Neuf avec étiquette', 'Neuf sans étiquette', 'Très bon état', 'Bon état', 'Satisfaisant'];

// Helpers
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateUser = (i) => {
  const city = rand(CITIES);
  const district = rand(city.districts);
  const isSeller = Math.random() > 0.4;
  const firstName = rand(FIRST_NAMES);
  const lastName = rand(LAST_NAMES);

  return {
    id: `u_${i}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
    avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${randInt(1,99)}.jpg`,
    roles: isSeller ? ['BUYER', 'SELLER'] : ['BUYER'],
    trustScore: randInt(50, 100),
    verificationLevel: Math.random() > 0.7 ? 'BIOMETRIC' : (Math.random() > 0.3 ? 'BASIC' : 'NONE'),
    location: `${city.name}, ${district}`,
    defaultAddress: {
      street: `${randInt(1, 200)} Rue des ${['Fleurs', 'Palmiers', 'Orangers', 'Oliviers'][randInt(0,3)]}`,
      city: city.name,
      district: district,
      coordinates: { lat: 33.5, lng: -7.5 }
    },
    savedAddresses: [],
    favorites: [],
    following: [],
    badges: isSeller && Math.random() > 0.5 ? ['Vendeur Vérifié'] : [],
    reviewsCount: isSeller ? randInt(0, 150) : 0,
    averageRating: isSeller ? (randInt(35, 50) / 10) : 0,
    successfulTransactions: isSeller ? randInt(0, 100) : randInt(0, 20),
    sellerProfile: isSeller ? {
      isKycVerified: true,
      rib: '123456789012345678901234',
      vacationMode: Math.random() > 0.95
    } : undefined
  };
};

const generateProduct = (i, users) => {
  const seller = rand(users.filter(u => u.roles.includes('SELLER')));
  const cat = rand(CATEGORIES);
  const brand = rand(cat.brands);
  const item = rand(cat.items);
  const price = randInt(100, 5000);
  const condition = rand(CONDITIONS);

  return {
    id: `p_${i}`,
    sellerId: seller.id,
    sellerName: seller.name,
    sellerScore: seller.trustScore,
    title: `${item} ${brand} - ${condition}`,
    description: `Je vends ce magnifique ${item} de la marque ${brand}. Porté quelques fois, en ${condition.toLowerCase()}. Prix négociable dans la limite du raisonnable. Dispo sur ${seller.location}.`,
    price: price,
    originalPrice: Math.floor(price * 1.3),
    category: cat.name,
    size: ['S', 'M', 'L', 'XL', '38', '40', '42', '44'][randInt(0, 7)],
    condition: condition,
    images: [
      `https://source.unsplash.com/random/400x500/?fashion,${cat.name.split(' ')[0]}?sig=${i}`,
      `https://source.unsplash.com/random/400x500/?clothing,texture?sig=${i+5000}`
    ],
    likes: randInt(0, 200),
    isPromoted: Math.random() > 0.9,
    aiVerified: Math.random() > 0.8,
    location: seller.location.split(',')[0],
    isSold: Math.random() > 0.8, // 20% d'articles vendus
    createdAt: new Date(Date.now() - randInt(0, 10000000000))
  };
};

const seed = async () => {
  try {
    console.log('🔌 Connexion à MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté.');

    console.log('🧹 Nettoyage de la DB...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Transaction.deleteMany({});

    console.log(`👤 Génération de ${USER_COUNT} utilisateurs...`);
    const usersData = Array.from({ length: USER_COUNT }).map((_, i) => generateUser(i));
    const users = await User.insertMany(usersData);

    console.log(`👗 Génération de ${PRODUCT_COUNT} annonces...`);
    const productsData = Array.from({ length: PRODUCT_COUNT }).map((_, i) => generateProduct(i, users));
    await Product.insertMany(productsData);

    console.log('🚀 Seeding terminé avec succès !');
    console.log('Base de données prête pour la production.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur seeding:', error);
    process.exit(1);
  }
};

seed();
