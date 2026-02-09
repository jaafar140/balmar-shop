
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { User, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ShieldCheck, MapPin, Star, Loader2, UserPlus, Check } from 'lucide-react';
import { messagingService } from '../services/messagingService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const PublicProfile: React.FC = () => {
  const { id } = useParams();
  const { user: currentUser, followUser } = useAuth();
  const navigate = useNavigate();
  
  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        // 1. Get Seller Info
        const sellerData = await api.users.getById(id);
        setSeller(sellerData);

        // 2. Get Seller Products
        const allProducts = await api.products.getAll();
        const sellerProducts = allProducts.filter(p => p.sellerId === id);
        setProducts(sellerProducts);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleContact = async () => {
      if(!currentUser) {
          navigate('/login');
          return;
      }
      if(seller) {
         // Create generic conversation (no specific product linked initially, or link to first one)
         navigate('/messages');
      }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (seller) {
      await followUser(seller.id);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-majorelle"/></div>;
  if (!seller) return <div className="p-10 text-center">Vendeur introuvable</div>;

  const isFollowing = currentUser?.following?.includes(seller.id);
  const isMe = currentUser?.id === seller.id;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Cover / Header */}
      <div className="bg-white rounded-b-3xl shadow-sm border-b border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-majorelle to-blue-600"></div>
        <div className="px-8 pb-8">
           <div className="relative -mt-12 mb-4 flex justify-between items-end">
             <div className="flex items-end gap-4">
               <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white">
                 <img src={seller.avatar} className="w-full h-full rounded-full object-cover" />
               </div>
               <div className="mb-2">
                 <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {seller.name}
                    {seller.trustScore > 70 && <ShieldCheck className="w-5 h-5 text-green-500" />}
                 </h1>
                 <p className="text-gray-500 flex items-center gap-1 text-sm">
                    <MapPin className="w-3 h-3" /> {seller.location}
                 </p>
               </div>
             </div>
             
             {!isMe && (
               <div className="flex gap-3">
                  <button 
                    onClick={handleFollow}
                    className={`px-4 py-2 font-bold rounded-xl transition flex items-center gap-2 ${
                      isFollowing 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-white border-2 border-majorelle text-majorelle hover:bg-blue-50'
                    }`}
                  >
                     {isFollowing ? (
                       <><Check className="w-4 h-4" /> Abonné</>
                     ) : (
                       <><UserPlus className="w-4 h-4" /> Suivre</>
                     )}
                  </button>
                  <button 
                    onClick={handleContact}
                    className="px-4 py-2 bg-majorelle text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-md"
                  >
                     Contacter
                  </button>
               </div>
             )}
           </div>

           <div className="flex gap-8 border-t border-gray-100 pt-6">
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase">Trust Score</p>
                 <p className="text-xl font-bold text-green-600">{seller.trustScore}/100</p>
              </div>
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase">Avis</p>
                 <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    {seller.averageRating} <span className="text-sm font-normal text-gray-400">({seller.reviewsCount})</span>
                 </div>
              </div>
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase">Ventes</p>
                 <p className="text-xl font-bold text-gray-900">{seller.successfulTransactions}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 md:px-0">
         <h2 className="text-xl font-bold text-gray-900 mb-6">Dressing ({products.length})</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map(p => (
               <ProductCard key={p.id} product={p} />
            ))}
         </div>
         {products.length === 0 && (
             <div className="text-center py-20 text-gray-400">Ce vendeur n'a aucune annonce active.</div>
         )}
      </div>
    </div>
  );
};