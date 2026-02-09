
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Product, Transaction } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
// IMPORTANT : Remplacez <db_password> par votre vrai mot de passe de base de données
const DEFAULT_URI = 'mongodb+srv://jaafarsellakh:Jaafar%402002@cluster0.jm9tx.mongodb.net/?appName=Cluster0';
const MONGO_URI = process.env.MONGODB_URI || DEFAULT_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connecté'))
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB.');
    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
        console.error('👉 PROBLÈME D\'AUTHENTIFICATION : Vérifiez que vous avez bien remplacé <db_password> par votre vrai mot de passe dans le fichier .env');
    } else {
        console.error('Détail erreur:', err.message);
    }
  });

// --- ROUTES ---

// 1. PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    // On ne renvoie pas les produits des vendeurs en vacances
    // Note: Dans une vraie prod, on ferait un aggregate ou une requête plus complexe
    // Pour l'instant on filtre tout
    const products = await Product.find({ isSold: false }).sort({ createdAt: -1 }).limit(100);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      id: `p_${Date.now()}`, // Génération ID simple pour compatibilité
      createdAt: new Date()
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/products/:id', async (req, res) => {
  try {
    await Product.findOneAndUpdate({ id: req.params.id }, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. USERS
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users/:id/notifications', async (req, res) => {
  // Mock notifications pour la démo, car nous n'avons pas créé de collection Notification
  res.json([
    { id: 'n1', userId: req.params.id, title: 'Bienvenue (Prod)', message: 'Base de données connectée !', type: 'SYSTEM', isRead: false, date: new Date() }
  ]);
});

// 3. TRANSACTIONS
app.post('/api/transactions', async (req, res) => {
  try {
    const newTx = new Transaction({
      ...req.body,
      id: `tx_${Date.now()}`
    });
    await newTx.save();
    
    // Marquer le produit comme vendu
    await Product.findOneAndUpdate({ id: req.body.productId }, { isSold: true });
    
    res.json(newTx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur Backend BalMar démarré sur le port ${PORT}`);
});
