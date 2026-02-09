
import React, { useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Lock, Building, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

export const Wallet: React.FC = () => {
  const { user } = useAuth();
  const { formatMoney } = useTranslation();
  
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock Data
  const balance = {
    available: 1250,
    pending: 450, // Escrow
    currency: 'MAD'
  };

  const transactions = [
    { id: 1, type: 'IN', label: 'Vente #TX-8842 (Caftan)', date: '25 Oct 2023', amount: 800, status: 'COMPLETED' },
    { id: 2, type: 'IN', label: 'Vente #TX-1129 (Sneakers)', date: '20 Oct 2023', amount: 450, status: 'PENDING' }, // Pending corresponds to Escrow
    { id: 3, type: 'OUT', label: 'Virement vers CIH Bank', date: '15 Oct 2023', amount: -1000, status: 'COMPLETED' },
  ];

  const handleWithdraw = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setShowWithdraw(false);
        setSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Portefeuille</h1>
          <p className="text-gray-500">Gérez vos revenus et virements.</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-majorelle to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <WalletIcon className="w-24 h-24" />
           </div>
           
           <div className="relative z-10">
             <p className="text-blue-100 font-medium text-sm mb-1">Solde disponible</p>
             <h2 className="text-4xl font-bold mb-6">{formatMoney(balance.available)}</h2>
             
             <div className="flex gap-3">
               <button 
                 onClick={() => setShowWithdraw(true)}
                 className="bg-white text-majorelle px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition flex items-center gap-2"
               >
                 <Building className="w-4 h-4" />
                 Virer vers ma banque
               </button>
             </div>
           </div>
        </div>

        {/* Pending Balance (Escrow) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative">
           <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  En attente (Escrow)
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mt-1">{formatMoney(balance.pending)}</h2>
              </div>
              <div className="bg-orange-50 p-2 rounded-full">
                 <Lock className="w-6 h-6 text-ochre" />
              </div>
           </div>
           
           <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 leading-relaxed">
              Ce montant est temporairement bloqué jusqu'à ce que l'acheteur confirme la réception de l'article (48h max après livraison).
           </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <h3 className="font-bold text-gray-900">Historique des transactions</h3>
        </div>
        <div className="divide-y divide-gray-100">
           {transactions.map(tx => (
             <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                     tx.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                   }`}>
                      {tx.type === 'IN' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                   </div>
                   <div>
                      <p className="font-bold text-gray-900 text-sm">{tx.label}</p>
                      <p className="text-xs text-gray-500">{tx.date} • {tx.status === 'PENDING' ? 'En cours' : 'Terminé'}</p>
                   </div>
                </div>
                <div className={`font-bold ${tx.type === 'IN' ? 'text-green-600' : 'text-gray-900'}`}>
                   {tx.amount > 0 ? '+' : ''}{tx.amount} MAD
                </div>
             </div>
           ))}
        </div>
        <div className="p-4 text-center border-t border-gray-100">
           <button className="text-sm text-majorelle font-bold hover:underline">Voir tout l'historique</button>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
              {success ? (
                <div className="text-center py-8">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900">Virement Initié !</h3>
                   <p className="text-gray-500 mt-2">Les fonds seront sur votre compte sous 2 à 3 jours ouvrés.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Retirer mes fonds</h3>
                  <p className="text-sm text-gray-500 mb-6">Transférez votre solde disponible vers votre compte bancaire enregistré.</p>
                  
                  <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                     <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Compte destination</span>
                        <span className="font-bold text-gray-900">CIH Bank •••• 4291</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Montant à virer</span>
                        <span className="font-bold text-majorelle">{formatMoney(balance.available)}</span>
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <button 
                       onClick={() => setShowWithdraw(false)}
                       className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition"
                     >
                       Annuler
                     </button>
                     <button 
                       onClick={handleWithdraw}
                       disabled={processing}
                       className="flex-1 bg-majorelle text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2"
                     >
                       {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                       Confirmer
                     </button>
                  </div>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
