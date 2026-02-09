
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Heart, Settings, LogOut, MessageSquare, Package, Tag, Wallet, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface NavItemProps {
  item: {
    icon: React.ElementType;
    label: string;
    path: string;
  };
}

const NavItem: React.FC<NavItemProps> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition font-medium text-sm ${
        isActive 
          ? 'bg-blue-50 text-majorelle' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <item.icon className="w-4 h-4" />
      {item.label}
    </Link>
  );
};

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isSeller = user?.roles.includes(UserRole.SELLER);

  const buyerMenu = [
    { icon: LayoutDashboard, label: 'Aperçu', path: '/dashboard' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: ShoppingBag, label: 'Mes Achats', path: '/dashboard/orders' },
    { icon: Heart, label: 'Favoris', path: '/dashboard/favorites' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Paramètres', path: '/dashboard/settings' },
  ];

  const sellerMenu = [
    { icon: Tag, label: 'Mes Annonces', path: '/dashboard/listings' },
    { icon: Package, label: 'Mes Ventes', path: '/dashboard/sales' },
    { icon: Wallet, label: 'Mon Solde', path: '/dashboard/wallet' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-sand">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8 px-2">
          <img src={user?.avatar} alt={user?.name} className="w-12 h-12 rounded-full object-cover border-2 border-majorelle" />
          <div className="overflow-hidden">
            <h3 className="font-bold text-gray-900 truncate">{user?.name}</h3>
            <p className="text-xs text-gray-500">{isSeller ? 'Vendeur Vérifié' : 'Membre BalMar'}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto">
          {isSeller && (
            <div>
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Espace Vendeur</p>
              <div className="space-y-1">
                {sellerMenu.map((item) => <NavItem key={item.path} item={item} />)}
              </div>
            </div>
          )}

          <div>
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Espace Acheteur</p>
            <div className="space-y-1">
              {buyerMenu.map((item) => <NavItem key={item.path} item={item} />)}
            </div>
          </div>
        </nav>

        <button onClick={handleLogout} className="mt-6 flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition text-sm">
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
