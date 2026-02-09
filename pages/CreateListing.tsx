
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle, AlertTriangle, Sparkles, Loader2, ShieldCheck, ArrowLeft, MapPin, CreditCard, Info } from 'lucide-react';
import { CATEGORIES, CITIES } from '../constants';
import { analyzeImage, estimatePrice } from '../services/aiService';
import { Condition, UserRole, Product } from '../types';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const { user, loading: authLoading, refreshUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{brand: string|null, fraud: number}|null>(null);
  const [priceData, setPriceData] = useState<{min: number, max: number, suggested: number}|null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    size: '',
    condition: Condition.GOOD,
    brand: '',
    price: '',
    description: '',
    location: CITIES[0]
  });

  const [publishing, setPublishing] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [ribError, setRibError] = useState<string | null>(null);
  const [sellerData, setSellerData] = useState({
    rib: '',
    address: '',
    city: 'Casablanca',
    lat: 33.5731,
    lng: -7.5898
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check user role
  useEffect(() => {
    if (user) {
      setIsSeller(user.roles.includes(UserRole.SELLER));
      setSellerData(prev => ({ 
        ...prev, 
        address: user.defaultAddress?.street || '', 
        city: user.defaultAddress?.city || 'Casablanca' 
      }));
    }
  }, [user]);

  // Load product if editing
  useEffect(() => {
      const loadProduct = async () => {
          if (editId) {
              setLoadingEdit(true);
              const p = await api.products.getById(editId);
              if (p) {
                  setFormData({
                      title: p.title,
                      category: p.category,
                      size: p.size || '',
                      condition: p.condition,
                      brand: '', // Backend doesn't store separate brand usually but could
                      price: p.price.toString(),
                      description: p.description,
                      location: p.location || CITIES[0]
                  });
                  setImages(p.images);
                  setStep(2); // Skip image step if editing (or allow change)
              }
              setLoadingEdit(false);
          }
      };
      loadProduct();
  }, [editId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImages(prev => [...prev, url]);
      
      setAnalyzing(true);
      const analysis = await analyzeImage(file);
      setAiResult({ brand: analysis.brandDetected, fraud: analysis.fraudScore });
      
      if (analysis.brandDetected) {
        setFormData(prev => ({ ...prev, brand: analysis.brandDetected! }));
      }
      setAnalyzing(false);
    }
  };

  const handlePriceEstimation = async () => {
    setAnalyzing(true);
    const est = await estimatePrice(formData.category, formData.condition, formData.brand);
    setPriceData(est);
    setFormData(prev => ({ ...prev, price: est.suggested.toString() }));
    setAnalyzing(false);
  };

  const handleUpgradeToSeller = async () => {
    if (!user) return;

    const ribRegex = /^\d{24}$/;
    if (!ribRegex.test(sellerData.rib)) {
        setRibError("Le RIB doit contenir exactement 24 chiffres.");
        return;
    }
    setRibError(null);

    try {
      await api.users.updateCurrent({ 
        roles: [...(user.roles || []), UserRole.SELLER],
        sellerProfile: { isKycVerified: true, rib: sellerData.rib } 
      });
      await refreshUser();
      setIsSeller(true);
    } catch (error) {
      console.error("Erreur upgrade vendeur:", error);
    }
  };

  const handlePublish = async () => {
    if(!user) return;
    setPublishing(true);

    try {
       const productData: Partial<Product> = {
         title: formData.title,
         description: formData.description || `Article ${formData.title} en état ${formData.condition}.`,
         price: parseFloat(formData.price),
         category: formData.category,
         size: formData.size,
         condition: formData.condition as Condition,
         images: images,
         location: formData.location
       };

       if (editId) {
           await api.products.update(editId, productData);
       } else {
           const newProduct: Product = {
                id: '', 
                sellerId: user.id,
                sellerName: user.name,
                sellerScore: user.trustScore,
                likes: 0,
                aiVerified: (aiResult?.fraud || 0) < 20,
                ...productData
           } as Product;
           await api.products.create(newProduct);
       }
       
       setTimeout(() => {
          navigate(editId ? '/dashboard/listings' : '/');
       }, 1000);
    } catch (e) {
       console.error(e);
       setPublishing(false);
    }
  };

  if (authLoading || loadingEdit) return <div className="p-10 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto"/></div>;
  if (!user) return <div>Veuillez vous connecter.</div>;

  // --- SELLER ONBOARDING VIEW ---
  if (!isSeller) {
     return (
        <div className="max-w-2xl mx-auto py-10 px-4">
             <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                 <h2 className="text-2xl font-bold mb-4">Devenez Vendeur</h2>
                 <p className="text-gray-500 mb-6">Pour vendre sur BalMar, nous avons besoin de valider votre profil.</p>
                 <div className="bg-gray-50 p-4 rounded-xl text-left mb-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">RIB (Pour les virements)</label>
                        <input 
                            type="text" 
                            className={`w-full p-2 border rounded-lg mt-1 ${ribError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="24 chiffres" 
                            value={sellerData.rib} 
                            onChange={e => {
                                setSellerData({...sellerData, rib: e.target.value});
                                if (ribError) setRibError(null);
                            }}
                            maxLength={24}
                        />
                        {ribError && <p className="text-red-500 text-xs mt-1">{ribError}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Adresse de ramassage</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg mt-1" value={sellerData.address} onChange={e => setSellerData({...sellerData, address: e.target.value})} />
                    </div>
                 </div>
                 <button onClick={handleUpgradeToSeller} className="bg-majorelle text-white px-6 py-3 rounded-xl font-bold w-full">Activer mon compte vendeur (Simulation)</button>
             </div>
        </div>
     )
  }

  // --- LISTING CREATION VIEW ---
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard/listings" className="inline-flex items-center gap-2 text-gray-500 hover:text-majorelle transition text-sm font-medium mb-4">
           <ArrowLeft className="w-4 h-4" />
           Annuler
         </Link>
        <h1 className="text-3xl font-bold text-gray-900">{editId ? 'Modifier l\'annonce' : 'Vendre un article'}</h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* LEGAL BANNER */}
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex gap-3 text-sm text-blue-900">
           <Info className="w-5 h-5 shrink-0 mt-0.5" />
           <p>
             <strong>Loi 31-08 :</strong> Description fidèle obligatoire.
           </p>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-sand/30 border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 transition cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <div className="w-16 h-16 bg-white shadow-sm text-majorelle rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Ajouter des photos</h3>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                      <img src={img} className="w-full h-full object-cover" alt="Preview" />
                      <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">×</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button 
                  disabled={images.length === 0}
                  onClick={() => setStep(2)}
                  className="bg-majorelle text-white font-bold py-3 px-8 rounded-xl shadow-md disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Titre</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
                    <select 
                      className="w-full p-4 border border-gray-300 rounded-xl bg-white"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Sélectionner</option>
                      {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Taille</label>
                    <input 
                       type="text" 
                       className="w-full p-4 border border-gray-300 rounded-xl bg-white"
                       value={formData.size}
                       onChange={e => setFormData({...formData, size: e.target.value})}
                    />
                 </div>
              </div>
              
              <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">État</label>
                    <select 
                       className="w-full p-4 border border-gray-300 rounded-xl bg-white"
                       value={formData.condition}
                       onChange={e => setFormData({...formData, condition: e.target.value as Condition})}
                    >
                      {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                 <textarea 
                    className="w-full p-4 border border-gray-300 rounded-xl bg-white h-32"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 />
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Prix (MAD)</label>
                 <div className="flex gap-4 items-start">
                   <input 
                      type="number" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="flex-1 p-4 border border-gray-300 rounded-xl font-bold text-lg"
                   />
                   <button 
                      onClick={handlePriceEstimation}
                      className="bg-purple-50 text-purple-700 px-6 py-4 rounded-xl font-bold"
                   >
                     <Sparkles className="w-5 h-5 inline mr-1" /> Estimer
                   </button>
                 </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button onClick={() => setStep(1)} className="text-gray-500 font-bold">Retour (Photos)</button>
                <button onClick={() => setStep(3)} className="bg-majorelle text-white font-bold py-3 px-8 rounded-xl">Suivant</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 text-center animate-fade-in py-8">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{editId ? 'Sauvegarder les changements ?' : 'Tout est bon ?'}</h2>
              <div className="flex justify-center gap-4 pt-4">
                <button onClick={handlePublish} disabled={publishing} className="bg-majorelle text-white font-bold py-4 px-10 rounded-xl shadow-lg">
                  {publishing ? 'Traitement...' : (editId ? 'Mettre à jour' : 'Publier')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
