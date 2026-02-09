
import React, { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Product } from '../../types';
import { ProductCard } from '../../components/ProductCard';

export const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      if (user && user.favorites) {
        const allProducts = await api.products.getAll();
        const favProducts = allProducts.filter(p => user.favorites.includes(p.id));
        setFavorites(favProducts);
      }
      setLoading(false);
    };
    fetchFavs();
  }, [user]);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-majorelle"/></div>;

  return (
    <div className="animate-in fade-in space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Vos Favoris ({favorites.length})</h1>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
             <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Rien pour l'instant</h2>
          <p className="text-gray-500 mt-2">Ajoutez des articles à vos favoris pour les retrouver ici.</p>
        </div>
      )}
    </div>
  );
};
