
import React, { useState } from 'react';
import { calculateTrustScore, verifyUserIdentity } from '../services/trustService';
import { ShieldCheck, Star, Package, CreditCard, Settings, LogOut, MapPin, Calendar, Loader2, ScanFace } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { VerificationLevel, User } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // Redirection is handled by ProtectedRoute in App.tsx, so user should exist here
  if (!user) return null;

  const trustData = calculateTrustScore(user);

  const handleKYC = async () => {
    setVerifying(true);
    await verifyUserIdentity(user.id);
    
    // Update API & Reload to refresh context
    await api.users.updateCurrent({
      verificationLevel: VerificationLevel.BIOMETRIC,
      trustScore: 100, // Boost score demo
      badges: [...user.badges, 'Identité Vérifiée']
    });
    
    window.location.reload(); 
    setVerifying(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Espace</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar / User Info Card */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-majorelle to-blue-600"></div>
             <div className="relative z-10">
                <div className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-3 relative shadow-md">
                  <img src={user.avatar} className="w-full h-full rounded-full object-cover bg-white" alt="Avatar" />
                  {user.verificationLevel === VerificationLevel.BIOMETRIC && (
                    <div className="absolute bottom-1 right-1 bg-green-500 border-2 border-white rounded-full p-1" title="Vérifié Biométrique">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-4">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {user.badges.map((badge, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded tracking-wide border border-gray-200">
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Trust Score Visual */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                   <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold text-gray-500 uppercase">Trust Score</span>
                      <span className={`text-xl font-bold ${trustData.score > 70 ? 'text-green-600' : 'text-orange-500'}`}>{trustData.score}/100</span>
                   </div>
                   <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${trustData.score > 70 ? 'bg-green-500' : 'bg-orange-500'}`} style={{width: `${trustData.score}%`}}></div>
                   </div>
                   <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                      <span>Avis: {trustData.details.reviewPart}</span>
                      <span>Hist: {trustData.details.historyPart}</span>
                      <span>KYC: {trustData.details.kycPart}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-1 md:col-span-2 space-y-6">
           {/* Verification Status Banner */}
           {user.verificationLevel === VerificationLevel.BIOMETRIC ? (
              <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-6 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> Identité Vérifiée</h3>
                    <p className="text-teal-100 text-sm opacity-90 max-w-md">
                      Félicitations ! Vous avez accès au Paiement à la Livraison sans dépôt et à l'assurance vendeur gratuite.
                    </p>
                  </div>
                  <ShieldCheck className="w-32 h-32 text-white/10 absolute -right-4 -bottom-8 rotate-12" />
              </div>
           ) : (
              <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
                        <ScanFace className="w-5 h-5 text-orange-500"/> 
                        Augmentez votre confiance
                      </h3>
                      <p className="text-gray-500 text-sm max-w-md">
                        Vérifiez votre identité pour débloquer les ventes sans plafond et rassurer vos acheteurs. (+20 points Trust Score)
                      </p>
                    </div>
                    <button 
                      onClick={handleKYC}
                      disabled={verifying}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition flex items-center gap-2"
                    >
                      {verifying ? <Loader2 className="w-4 h-4 animate-spin"/> : <ScanFace className="w-4 h-4"/>}
                      {verifying ? 'Analyse...' : 'Vérifier mon ID'}
                    </button>
                  </div>
              </div>
           )}

           {/* Menu Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-majorelle/50 hover:shadow-md transition text-left group">
                 <div className="w-10 h-10 rounded-full bg-orange-50 text-ochre flex items-center justify-center mb-4 group-hover:bg-ochre group-hover:text-white transition">
                   <Package className="w-5 h-5" />
                 </div>
                 <h3 className="font-bold text-gray-900 mb-1">Mes Transactions</h3>
                 <p className="text-xs text-gray-500">Suivi des achats et ventes en cours</p>
              </button>

              <button className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-majorelle/50 hover:shadow-md transition text-left group">
                 <div className="w-10 h-10 rounded-full bg-blue-50 text-majorelle flex items-center justify-center mb-4 group-hover:bg-majorelle group-hover:text-white transition">
                   <CreditCard className="w-5 h-5" />
                 </div>
                 <h3 className="font-bold text-gray-900 mb-1">Portefeuille</h3>
                 <p className="text-xs text-gray-500">Solde bloqué: <span className="text-gray-900 font-bold">1200 DH</span></p>
              </button>
           </div>
           
           <button 
              onClick={handleLogout}
              className="w-full bg-white border border-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2"
            >
             <LogOut className="w-4 h-4" />
             Déconnexion
           </button>
        </div>
      </div>
    </div>
  );
};
