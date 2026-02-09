
import React, { useEffect, useState } from 'react';
import { Edit2, Eye, Trash2, AlertCircle, Loader2, CheckCircle, Tag, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

export const MyListings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (user) {
        const allProducts = await api.products.getAll();
        const myListings = allProducts.filter(p => p.sellerId === user.id);
        setListings(myListings);
      }
      setLoading(false);
    };
    fetchListings();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.')) {
        setDeletingId(id);
        try {
            await api.products.delete(id);
            setListings(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    }
  };

  const handleMarkSold = async (id: string) => {
      try {
          await api.products.update(id, { isSold: true });
          setListings(prev => prev.map(p => p.id === id ? { ...p, isSold: true } : p));
      } catch (e) {
          alert("Erreur");
      }
  };
  
  const handlePromote = async (id: string, currentStatus: boolean | undefined) => {
      try {
          // Bascule le statut de promotion
          const newStatus = !currentStatus;
          await api.products.update(id, { isPromoted: newStatus });
          setListings(prev => prev.map(p => p.id === id ? { ...p, isPromoted: newStatus } : p));
          if(newStatus) alert("Votre annonce est maintenant sponsorisée et apparaîtra en tête de liste !");
          else alert("Sponsoring désactivé.");
      } catch (e) {
          console.error(e);
      }
  };

  if (loading) return <div className="flex p-10 justify-center"><Loader2 className="animate-spin text-majorelle" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mes Annonces ({listings.length})</h1>
        <Link to="/create" className="bg-majorelle text-white px-4 py-2 rounded-lg font-bold text-sm">
          + Créer une annonce
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {listings.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-bold mb-2">Aucune annonce active</h3>
                <p className="text-gray-500 mb-6">C'est le moment de faire du tri dans vos placards !</p>
                <Link to="/create" className="text-majorelle font-bold hover:underline">Commencer à vendre</Link>
            </div>
        ) : (
            <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Article</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Prix</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Vues</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {listings.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 ${item.isSold ? 'opacity-70 bg-gray-50' : ''}`}>
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                            <img src={item.images[0]} className="w-10 h-10 rounded object-cover bg-gray-100" />
                            <div>
                                <span className="font-medium text-gray-900 line-clamp-1 max-w-[150px]">{item.title}</span>
                                {item.isPromoted && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">Sponsorisé</span>}
                            </div>
                        </div>
                    </td>
                    <td className="p-4 text-gray-600">{item.price} MAD</td>
                    <td className="p-4 text-gray-500 flex items-center gap-1">
                    <Eye className="w-3 h-3"/> {item.likes * 12 + 4}
                    </td>
                    <td className="p-4">
                        {item.isSold ? (
                             <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-600">Vendu</span>
                        ) : (
                             <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">En ligne</span>
                        )}
                    </td>
                    <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                        {!item.isSold && (
                            <>
                                <button 
                                    onClick={() => handlePromote(item.id, item.isPromoted)}
                                    className={`p-2 rounded-lg transition ${item.isPromoted ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`} 
                                    title={item.isPromoted ? "Désactiver sponsoring" : "Sponsoriser (Booster)"}
                                >
                                    <Zap className={`w-4 h-4 ${item.isPromoted ? 'fill-current' : ''}`}/>
                                </button>
                                <button 
                                    onClick={() => handleMarkSold(item.id)}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" 
                                    title="Marquer comme vendu"
                                >
                                    <Tag className="w-4 h-4"/>
                                </button>
                            </>
                        )}
                        <button 
                            onClick={() => navigate(`/create?edit=${item.id}`)}
                            className="p-2 text-gray-400 hover:text-majorelle hover:bg-blue-50 rounded-lg" 
                            title="Modifier"
                        >
                            <Edit2 className="w-4 h-4"/>
                        </button>
                        <button 
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                        >
                            {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4"/>}
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};
