
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Home, PlusCircle, Search, MapPin, Menu, X, Globe, User as UserIcon, LogIn, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useTranslation();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  
  const isActive = (path: string) => location.pathname === path ? 'text-majorelle' : 'text-gray-500';

  useEffect(() => {
    const loadNotifications = async () => {
        if (user) {
            try {
                const notifs = await api.users.getNotifications();
                setUnreadCount(notifs.filter(n => !n.isRead).length);
            } catch (e) {
                console.error(e);
            }
        }
    };
    loadNotifications();
  }, [user, location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand font-sans text-gray-900">
      {/* Top Navigation (Web & Mobile Header) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
             <Link to="/" className="font-bold text-2xl text-majorelle tracking-tight hover:opacity-80 transition">
               BalMar<span className="text-ochre">.</span>
             </Link>
             
             {/* Desktop Nav Links */}
             <nav className="hidden md:flex items-center gap-6 ml-8">
               <Link to="/" className={`text-sm font-medium hover:text-majorelle transition ${location.pathname === '/' ? 'text-majorelle' : 'text-gray-600'}`}>{t('home')}</Link>
               <Link to="/explore" className={`text-sm font-medium hover:text-majorelle transition ${location.pathname === '/explore' ? 'text-majorelle' : 'text-gray-600'}`}>{t('explore')}</Link>
               {user && (
                 <Link to="/messages" className={`text-sm font-medium hover:text-majorelle transition ${location.pathname === '/messages' ? 'text-majorelle' : 'text-gray-600'}`}>Commandes</Link>
               )}
             </nav>
          </div>
          
          {/* Desktop Actions */}
          <div className="flex items-center gap-4">
             {/* Language Switcher */}
             <button 
               onClick={() => setLanguage(language === 'fr' ? 'ari' : 'fr')}
               className="hidden md:flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-majorelle px-2 py-1 rounded border border-gray-200 hover:border-majorelle transition"
             >
               <Globe className="w-3 h-3" />
               {language === 'fr' ? 'FR' : 'ARI'}
             </button>

            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600">
               <MapPin className="w-3.5 h-3.5" />
               {user ? user.location.split(',')[0] : 'Maroc'}
            </div>

            <form onSubmit={handleSearch} className="relative hidden sm:block">
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={t('searchPlaceholder')} 
                 className="pl-9 pr-4 py-2 rounded-full bg-gray-100 text-sm w-64 focus:ring-2 focus:ring-majorelle focus:bg-white transition outline-none border border-transparent focus:border-majorelle/20" 
               />
               <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 hover:text-majorelle text-gray-500 transition">
                  <Search className="w-4 h-4" />
               </button>
            </form>

            {user ? (
              <>
                {/* Notifications Bell */}
                <Link to="/dashboard/notifications" className="relative p-2 text-gray-500 hover:text-majorelle transition rounded-full hover:bg-gray-100 hidden md:block">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    )}
                </Link>

                <Link to="/create" className="hidden md:flex items-center gap-2 bg-majorelle text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-800 transition shadow-md transform hover:scale-105">
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('sellButton')}</span>
                </Link>

                <Link to="/dashboard" className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full transition border border-transparent hover:border-gray-200">
                  <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                  <span className="hidden md:block text-sm font-bold text-gray-700">{user.name.split(' ')[0]}</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-majorelle transition px-2">
                  Se connecter
                </Link>
                <Link to="/signup" className="bg-ochre text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-600 transition shadow-sm">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer (Professional) */}
      <footer className="bg-white border-t border-gray-200 mt-auto pt-10 pb-20 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
               <span className="font-bold text-xl text-majorelle">BalMar<span className="text-ochre">.</span></span>
               <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                 La première plateforme de mode seconde main sécurisée au Maroc. Achetez et vendez en toute confiance.
               </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">À propos</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link to="/about" className="hover:text-majorelle">Qui sommes-nous ?</Link></li>
                <li><Link to="/careers" className="hover:text-majorelle">Carrières</Link></li>
                <li><Link to="/press" className="hover:text-majorelle">Presse</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link to="/help" className="hover:text-majorelle">Centre d'aide</Link></li>
                <li><Link to="/safety" className="hover:text-majorelle">Sécurité & Confiance</Link></li>
                <li><Link to="/contact" className="hover:text-majorelle">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Légal (Maroc)</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link to="/terms" className="hover:text-majorelle">Conditions Générales (CGU)</Link></li>
                <li><Link to="/privacy" className="hover:text-majorelle">Politique de Confidentialité</Link></li>
                <li><Link to="/legal" className="hover:text-majorelle">Mentions Légales</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            <p>© 2025 BalMar S.A.R.L. Tous droits réservés. Fait avec ❤️ à Casablanca.</p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t('home')}</span>
        </Link>
        
        <Link to="/explore" className={`flex flex-col items-center gap-1 ${isActive('/explore')}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t('explore')}</span>
        </Link>

        <Link to="/create" className="flex flex-col items-center -mt-8">
          <div className="bg-ochre text-white p-4 rounded-full shadow-lg hover:bg-terracotta transition transform hover:scale-105 ring-4 ring-sand">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-medium mt-1 text-gray-600">{t('sellButton')}</span>
        </Link>

        <Link to="/messages" className={`flex flex-col items-center gap-1 ${isActive('/messages')}`}>
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-medium">Commandes</span>
        </Link>

        {user ? (
          <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/dashboard')}`}>
            <div className={`p-0.5 rounded-full border-2 ${isActive('/dashboard') ? 'border-majorelle' : 'border-transparent'}`}>
              <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
            </div>
            <span className="text-[10px] font-medium">Moi</span>
          </Link>
        ) : (
          <Link to="/login" className={`flex flex-col items-center gap-1 ${isActive('/login')}`}>
             <LogIn className="w-6 h-6" />
             <span className="text-[10px] font-medium">Login</span>
          </Link>
        )}
      </nav>
    </div>
  );
};
