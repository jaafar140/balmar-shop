
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, ShieldCheck, Sparkles, Tag, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserRole } from '../../types';

export const Overview: React.FC = () => {
  const { user } = useAuth();
  const isSeller = user?.roles.includes(UserRole.SELLER);

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.name.split(' ')[0]} ! 👋</h1>
           <p className="text-gray-500">
             {isSeller ? 'Vos affaires marchent bien aujourd\'hui.' : 'Prêt à dénicher de nouvelles pépites ?'}
           </p>
        </div>
        {!isSeller ? (
           <Link to="/create" className="bg-majorelle text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-ochre" />
             Devenir Vendeur
           </Link>
        ) : (
           <Link to="/create" className="bg-majorelle text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition flex items-center gap-2">
             <Tag className="w-5 h-5" />
             Nouvelle Annonce
           </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {isSeller ? (
           // Seller Stats
           <>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                   <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-gray-500 text-sm font-medium">Revenus (Ce mois)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2,450 MAD</p>
             </div>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-majorelle mb-4">
                   <Package className="w-5 h-5" />
                </div>
                <p className="text-gray-500 text-sm font-medium">Ventes en cours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-ochre mb-4">
                   <Eye className="w-5 h-5" />
                </div>
                <p className="text-gray-500 text-sm font-medium">Vues totales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1.2k</p>
             </div>
           </>
         ) : (
           // Buyer Stats
           <>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-majorelle mb-4">
                   <Package className="w-5 h-5" />
                </div>
                <p className="text-gray-500 text-sm font-medium">Commandes en cours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
             </div>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-gray-500 text-sm font-medium">Trust Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{user?.trustScore}/100</p>
             </div>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center cursor-pointer hover:border-ochre transition">
                 <p className="font-bold text-gray-900 mb-2">Invitez des amis</p>
                 <p className="text-xs text-gray-500">Gagnez 50 MAD pour chaque ami parrainé.</p>
             </div>
           </>
         )}
      </div>

      {/* Recent Activity Mock */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Activité Récente</h2>
            <Link to={isSeller ? "/dashboard/sales" : "/dashboard/orders"} className="text-sm text-majorelle font-bold">Voir tout</Link>
         </div>
         <div className="p-8 text-center text-gray-500">
            <p>Aucune activité récente à afficher.</p>
         </div>
      </div>
    </div>
  );
};
