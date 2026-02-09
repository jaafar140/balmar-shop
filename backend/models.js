const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String, // On garde l'ID string pour compatibilité avec le frontend existant
  name: String,
  email: String,
  avatar: String,
  roles: [String],
  trustScore: Number,
  verificationLevel: String,
  location: String,
  defaultAddress: {
    street: String,
    city: String,
    district: String,
    postalCode: String,
    coordinates: { lat: Number, lng: Number }
  },
  savedAddresses: Array,
  favorites: [String],
  following: [String],
  badges: [String],
  reviewsCount: Number,
  averageRating: Number,
  successfulTransactions: Number,
  sellerProfile: {
    isKycVerified: Boolean,
    rib: String,
    pickupAddress: Object,
    vacationMode: Boolean
  }
});

const productSchema = new mongoose.Schema({
  id: String,
  sellerId: String,
  sellerName: String,
  sellerScore: Number,
  title: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  size: String,
  condition: String,
  images: [String],
  likes: Number,
  isPromoted: Boolean,
  aiVerified: Boolean,
  location: String,
  isSold: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  id: String,
  productId: String,
  buyerId: String,
  sellerId: String,
  status: String,
  amounts: Object,
  paymentMethod: String,
  createdAt: Date,
  deliveryAddress: Object,
  contactPhone: String,
  trackingCode: String,
  disputeReason: String
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { User, Product, Transaction };