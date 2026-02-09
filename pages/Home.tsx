
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CATEGORIES, HERO_IMAGE, CITIES } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronRight, Zap, Search, Loader2, Camera, Truck, CheckCircle, X, SlidersHorizontal, ArrowDownWideNarrow, ArrowUpWideNarrow, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { api } from '../services/api';
import { Product, Condition } from '../types';
import { useSearchParams } from 'react-router-dom';

interface FilterState {
  minPrice: string;
  maxPrice: string;
  condition: string;
  city: string;
  sort: 'newest' | 'price_asc' | 'price_desc';
  search: string;
}

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10); // Pagination
  const { t } = useTranslation();
  
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    condition: '',
    city: '',
    sort: 'newest',
    search: urlSearch 
  });

  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: urlSearch }));
    if (urlSearch && productsRef.current) {
      setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [urlSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getAll();
        // Filtrer les articles vendus
        setProducts(data.filter(p => !p.isSold));
      } catch (error) {
        console.error("Erreur chargement produits", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const sponsoredProducts = useMemo(() => {
    return products.filter(p => p.isPromoted);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCat !== 'all') {
      result = result.filter(p => p.category.includes(selectedCat));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }

    if (filters.condition) {
      result = result.filter(p => p.condition === filters.condition);
    }

    if (filters.city) {
      result = result.filter(p => p.location?.includes(filters.city));
    }

    return result.sort((a, b) => {
       if (filters.sort === 'price_asc') return a.price - b.price;
       if (filters.sort === 'price_desc') return b.price - a.price;
       return 0; 
    });
  }, [products, selectedCat, filters]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      condition: '',
      city: '',
      sort: 'newest',
      search: ''
    });
    setSelectedCat('all');
  };

  const activeFilterCount = [
    filters.minPrice, 
    filters.maxPrice, 
    filters.condition, 
    filters.city
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-10 relative">
      <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="BalMar background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-majorelle/60 to-transparent"></div>
        </div>
        <div className="relative z-10 px-8 md:px-12 max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Nouveau au Maroc 🇲🇦
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{t('heroTitle')}</h1>
          <p className="text-gray-100 text-lg md:text-xl mb-8 font-light max-w-lg">{t('heroSubtitle')}</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={scrollToProducts} className="bg-ochre hover:bg-yellow-600 text-white font-bold py-3.5 px-8 rounded-full transition shadow-lg transform hover:scale-105 flex items-center gap-2">
              <Search className="w-4 h-4" /> Voir les offres
            </button>
            <button onClick={() => setShowHowItWorks(true)} className="bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-full transition backdrop-blur-md border border-white/30">
              Comment ça marche ?
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">{t('popularCategories')}</h2>
          <button onClick={() => setSelectedCat('all')} className="text-sm text-majorelle font-bold hover:underline flex items-center gap-1">Voir tout <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.name)} className={`group relative h-32 md:h-40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedCat === cat.name ? 'ring-4 ring-ochre ring-offset-2' : 'hover:shadow-lg'}`}>
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-3 text-center">
                <span className={`text-sm md:text-base font-bold text-white group-hover:text-ochre transition`}>{cat.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* SECTION PRODUITS SPONSORISÉS */}
      {sponsoredProducts.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-yellow-500 fill-current animate-pulse" />
             <h2 className="text-xl md:text-2xl font-bold text-gray-900">À la une (Sponsorisé)</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x">
             {sponsoredProducts.slice(0, 8).map(product => (
               <div key={product.id} className="min-w-[220px] md:min-w-[260px] snap-center">
                  <ProductCard product={product} />
               </div>
             ))}
          </div>
        </div>
      )}

      <div ref={productsRef} className="space-y-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Zap className="w-6 h-6 text-ochre fill-current" />
            {t('latestItems')}
            <span className="text-sm font-normal text-gray-500 ml-2">({filteredProducts.length} articles)</span>
          </h2>
          <div className="flex gap-2">
             <div className="relative">
                <input type="text" placeholder="Rechercher..." value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-majorelle outline-none w-full md:w-64" />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
             </div>
             <button onClick={() => setShowFilters(true)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition text-sm font-bold ${activeFilterCount > 0 ? 'bg-majorelle text-white border-majorelle' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
               <SlidersHorizontal className="w-4 h-4" /> Filtres {activeFilterCount > 0 && <span className="bg-ochre text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{activeFilterCount}</span>}
             </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-majorelle" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayedProducts.length > 0 ? (
                displayedProducts.map(product => <ProductCard key={product.id} product={product} />)
                ) : (
                <div className="col-span-full py-20 text-center">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">Aucun résultat</h3>
                    <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
                    <button onClick={resetFilters} className="mt-4 text-majorelle font-bold hover:underline">Tout effacer</button>
                </div>
                )}
            </div>
            
            {/* PAGINATION / LOAD MORE */}
            {filteredProducts.length > visibleCount && (
                <div className="flex justify-center pt-8">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 10)}
                        className="px-8 py-3 bg-white border border-gray-300 rounded-full font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm"
                    >
                        Charger plus de pépites
                    </button>
                </div>
            )}
          </>
        )}
      </div>

      {showFilters && (
         <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowFilters(false)} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
               <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2"><Filter className="w-5 h-5 text-majorelle" /> Filtres & Tri</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><X className="w-5 h-5 text-gray-500" /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div>
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Trier par</h4>
                     <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-50 transition border-gray-200">
                           <input type="radio" name="sort" checked={filters.sort === 'newest'} onChange={() => setFilters({...filters, sort: 'newest'})} className="text-majorelle focus:ring-majorelle"/>
                           <span className="text-sm font-medium">Plus récents</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-50 transition border-gray-200">
                           <input type="radio" name="sort" checked={filters.sort === 'price_asc'} onChange={() => setFilters({...filters, sort: 'price_asc'})} className="text-majorelle focus:ring-majorelle"/>
                           <div className="flex items-center gap-2 text-sm font-medium"><ArrowDownWideNarrow className="w-4 h-4 text-gray-400" /> Prix croissant</div>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-50 transition border-gray-200">
                           <input type="radio" name="sort" checked={filters.sort === 'price_desc'} onChange={() => setFilters({...filters, sort: 'price_desc'})} className="text-majorelle focus:ring-majorelle"/>
                           <div className="flex items-center gap-2 text-sm font-medium"><ArrowUpWideNarrow className="w-4 h-4 text-gray-400" /> Prix décroissant</div>
                        </label>
                     </div>
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Prix (MAD)</h4>
                     <div className="flex items-center gap-3">
                        <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-majorelle outline-none"/>
                        <span className="text-gray-400">-</span>
                        <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-majorelle outline-none"/>
                     </div>
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">État</h4>
                     <select value={filters.condition} onChange={(e) => setFilters({...filters, condition: e.target.value})} className="w-full p-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-majorelle">
                        <option value="">Tous les états</option>
                        {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Ville</h4>
                     <div className="grid grid-cols-2 gap-2">
                        {CITIES.map(city => (
                           <button key={city} onClick={() => setFilters({...filters, city: filters.city === city ? '' : city})} className={`p-2 rounded-lg text-sm font-medium border transition ${filters.city === city ? 'bg-majorelle text-white border-majorelle' : 'bg-white text-gray-600 border-gray-200 hover:border-majorelle'}`}>{city}</button>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50">
                  <button onClick={resetFilters} className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition">Réinitialiser</button>
                  <button onClick={() => setShowFilters(false)} className="flex-[2] py-3 px-4 rounded-xl font-bold bg-majorelle text-white hover:bg-blue-800 transition shadow-lg">Voir {filteredProducts.length} résultats</button>
               </div>
            </div>
         </div>
      )}

      {showHowItWorks && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative">
             <button onClick={() => setShowHowItWorks(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"><X className="w-5 h-5 text-gray-600" /></button>
             <div className="p-8 text-center bg-majorelle text-white">
                <h2 className="text-2xl font-bold mb-2">Comment ça marche ?</h2>
                <p className="text-blue-100">BalMar sécurise vos achats et ventes de A à Z.</p>
             </div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                   <div className="w-16 h-16 bg-blue-50 text-majorelle rounded-2xl flex items-center justify-center mx-auto mb-2 transform rotate-3"><Camera className="w-8 h-8" /></div>
                   <h3 className="font-bold text-gray-900">1. Vendez</h3>
                   <p className="text-sm text-gray-500">Prenez en photo, l'IA remplit les détails. C'est gratuit.</p>
                </div>
                <div className="text-center space-y-3">
                   <div className="w-16 h-16 bg-orange-50 text-ochre rounded-2xl flex items-center justify-center mx-auto mb-2 transform -rotate-3"><Truck className="w-8 h-8" /></div>
                   <h3 className="font-bold text-gray-900">2. Expédiez</h3>
                   <p className="text-sm text-gray-500">Utilisez notre étiquette prépayée. Le livreur vient chez vous.</p>
                </div>
                <div className="text-center space-y-3">
                   <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-2 transform rotate-3"><CheckCircle className="w-8 h-8" /></div>
                   <h3 className="font-bold text-gray-900">3. Encaissez</h3>
                   <p className="text-sm text-gray-500">Recevez l'argent une fois l'article validé par l'acheteur.</p>
                </div>
             </div>
             <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
                <button onClick={() => setShowHowItWorks(false)} className="bg-majorelle text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-800 transition">J'ai compris, c'est parti !</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
