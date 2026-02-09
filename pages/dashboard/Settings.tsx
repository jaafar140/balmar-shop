
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Plus, Trash2, Edit2, Save, Camera, User, Mail, CreditCard, Loader2, CheckCircle, Plane, AlertTriangle } from 'lucide-react';
import { Address, UserRole } from '../../types';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: '',
    avatar: ''
  });
  const [sellerRib, setSellerRib] = useState('');
  const [vacationMode, setVacationMode] = useState(false);
  
  // Address State
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  
  // UI State
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSeller = user?.roles.includes(UserRole.SELLER);

  // Init data on load
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        avatar: user.avatar || ''
      });
      if (user.sellerProfile?.rib) {
        setSellerRib(user.sellerProfile.rib);
      }
      if (user.sellerProfile?.vacationMode) {
          setVacationMode(true);
      }
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, avatar: url }));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSuccessMsg('');

    try {
      const updates: any = {
        name: profileData.name,
        email: profileData.email,
        location: profileData.location,
        avatar: profileData.avatar
      };

      // Update seller specific info
      if (isSeller) {
        updates.sellerProfile = {
          ...user.sellerProfile,
          rib: sellerRib,
          vacationMode: vacationMode
        };
      }

      await api.users.updateCurrent(updates);
      await refreshUser(); // Update global context
      
      setSuccessMsg('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error("Erreur mise à jour profil", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    if(user && newAddress.street && newAddress.city) {
       const updatedAddresses = [...(user.savedAddresses || []), newAddress as Address];
       await api.users.updateCurrent({ savedAddresses: updatedAddresses });
       await refreshUser();
       setIsAddingAddr(false);
       setNewAddress({});
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!user) return;
    const updated = [...user.savedAddresses];
    updated.splice(index, 1);
    await api.users.updateCurrent({ savedAddresses: updated });
    await refreshUser();
  };
  
  const handleDeleteAccount = async () => {
      const confirmText = prompt("Pour confirmer la suppression, tapez 'SUPPRIMER'");
      if (confirmText === 'SUPPRIMER') {
          await api.users.deleteAccount();
          await logout();
          navigate('/');
      }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>

      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
         <button 
           onClick={() => setActiveTab('profile')}
           className={`pb-3 font-medium text-sm px-2 whitespace-nowrap ${activeTab === 'profile' ? 'text-majorelle border-b-2 border-majorelle' : 'text-gray-500 hover:text-gray-700'}`}
         >
           Mon Profil
         </button>
         <button 
           onClick={() => setActiveTab('addresses')}
           className={`pb-3 font-medium text-sm px-2 whitespace-nowrap ${activeTab === 'addresses' ? 'text-majorelle border-b-2 border-majorelle' : 'text-gray-500 hover:text-gray-700'}`}
         >
           Mes Adresses
         </button>
         <button 
           onClick={() => setActiveTab('security')}
           className={`pb-3 font-medium text-sm px-2 whitespace-nowrap ${activeTab === 'security' ? 'text-majorelle border-b-2 border-majorelle' : 'text-gray-500 hover:text-gray-700'}`}
         >
           Sécurité & Compte
         </button>
      </div>

      {/* --- PROFILE TAB --- */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl space-y-8">
           {successMsg && (
             <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2 border border-green-100 animate-in slide-in-from-top-2">
               <CheckCircle className="w-5 h-5" />
               {successMsg}
             </div>
           )}

           {/* Avatar Section */}
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-majorelle transition">
                   <img src={profileData.avatar} className="w-full h-full object-cover" alt="Profile"/>
                 </div>
                 <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                   <Camera className="w-8 h-8 text-white" />
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
              <div className="text-center sm:text-left">
                 <h3 className="font-bold text-gray-900">Photo de profil</h3>
                 <p className="text-sm text-gray-500 mb-3">Formats acceptés : JPG, PNG. Max 5Mo.</p>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="text-sm font-bold text-majorelle hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                 >
                   Modifier la photo
                 </button>
              </div>
           </div>
           
           {/* Personal Info Form */}
           <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-4">Informations Personnelles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nom Complet</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={e => setProfileData({...profileData, name: e.target.value})}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-majorelle outline-none transition" 
                      />
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Ville</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input 
                        type="text" 
                        value={profileData.location}
                        onChange={e => setProfileData({...profileData, location: e.target.value})}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-majorelle outline-none transition" 
                      />
                    </div>
                 </div>

                 <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={e => setProfileData({...profileData, email: e.target.value})}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-majorelle outline-none transition" 
                      />
                    </div>
                 </div>
              </div>
           </div>

           {/* Seller Info (Conditional) */}
           {isSeller && (
             <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                   <CreditCard className="w-5 h-5 text-majorelle" /> Informations Bancaires (Vendeur)
                </h3>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">RIB / Compte Bancaire</label>
                    <input 
                      type="text" 
                      value={sellerRib}
                      onChange={e => setSellerRib(e.target.value)}
                      placeholder="24 chiffres"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-majorelle outline-none transition font-mono" 
                    />
                </div>
                
                {/* Vacation Mode */}
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex gap-3">
                        <div className="p-2 bg-white rounded-full text-orange-500"><Plane className="w-5 h-5"/></div>
                        <div>
                            <p className="font-bold text-gray-900">Mode Vacances</p>
                            <p className="text-xs text-gray-600">Vos annonces seront masquées pendant votre absence.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={vacationMode} onChange={e => setVacationMode(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                </div>
             </div>
           )}

           <div className="flex justify-end pt-4">
              <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-majorelle text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-800 transition shadow-lg flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Enregistrer les modifications
              </button>
           </div>
        </div>
      )}

      {/* --- ADDRESSES TAB --- */}
      {activeTab === 'addresses' && (
        <div className="space-y-4 max-w-2xl">
           <div className="grid grid-cols-1 gap-4">
             {user.savedAddresses?.map((addr, idx) => (
               <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start group hover:border-majorelle/30 transition">
                  <div className="flex gap-4">
                     <div className="bg-blue-50 p-2.5 rounded-full h-fit text-majorelle"><MapPin className="w-5 h-5" /></div>
                     <div>
                        <p className="font-bold text-gray-900">{addr.city}</p>
                        <p className="text-sm text-gray-600">{addr.street}</p>
                        <p className="text-xs text-gray-400 mt-1">{addr.district}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDeleteAddress(idx)} className="text-gray-400 p-2 hover:bg-red-50 rounded-lg hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>
             ))}
           </div>

           {isAddingAddr ? (
             <div className="bg-white p-6 rounded-xl border border-majorelle shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="font-bold text-gray-900">Nouvelle adresse</h3>
                <div className="grid grid-cols-2 gap-4">
                   <input 
                      placeholder="Rue, Numéro..." 
                      className="col-span-2 p-3 border border-gray-300 rounded-xl outline-none focus:border-majorelle"
                      value={newAddress.street || ''}
                      onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                   />
                   <input 
                      placeholder="Ville" 
                      className="p-3 border border-gray-300 rounded-xl outline-none focus:border-majorelle"
                      value={newAddress.city || ''}
                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                   />
                   <input 
                      placeholder="Quartier" 
                      className="p-3 border border-gray-300 rounded-xl outline-none focus:border-majorelle"
                      value={newAddress.district || ''}
                      onChange={e => setNewAddress({...newAddress, district: e.target.value})}
                   />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                   <button onClick={() => setIsAddingAddr(false)} className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition">Annuler</button>
                   <button onClick={handleSaveAddress} className="px-6 py-2 bg-majorelle text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 transition">
                     <Save className="w-4 h-4" /> Enregistrer
                   </button>
                </div>
             </div>
           ) : (
             <button 
               onClick={() => setIsAddingAddr(true)}
               className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-majorelle hover:text-majorelle hover:bg-blue-50/50 transition flex items-center justify-center gap-2"
             >
               <Plus className="w-5 h-5" />
               Ajouter une adresse
             </button>
           )}
        </div>
      )}
      
      {/* --- SECURITY TAB --- */}
      {activeTab === 'security' && (
          <div className="max-w-2xl space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Mot de passe</h3>
                  <button onClick={() => navigate('/forgot-password')} className="text-majorelle font-bold text-sm hover:underline">Changer mon mot de passe</button>
              </div>
              
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5"/> Zone de danger
                  </h3>
                  <p className="text-sm text-red-700 mb-4">La suppression de votre compte est définitive. Toutes vos données seront effacées.</p>
                  <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition">
                      Supprimer mon compte
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
