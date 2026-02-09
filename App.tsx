
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CreateListing } from './pages/CreateListing';
import { ProductDetails } from './pages/ProductDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { PublicProfile } from './pages/PublicProfile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Import Static Pages
import { AboutPage, CareersPage, PressPage } from './pages/static/About';
import { HelpPage, SafetyPage, ContactPage } from './pages/static/Support';
import { TermsPage, PrivacyPage, LegalMentionsPage } from './pages/static/Legal';

import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { Orders } from './pages/dashboard/Orders';
import { Settings } from './pages/dashboard/Settings';
import { Favorites } from './pages/dashboard/Favorites';
import { Messages } from './pages/dashboard/Messages';
import { MyListings } from './pages/dashboard/MyListings';
import { MySales } from './pages/dashboard/MySales';
import { Wallet } from './pages/dashboard/Wallet';
import { Notifications } from './pages/dashboard/Notifications';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <Loader2 className="w-10 h-10 animate-spin text-majorelle" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
      <Route path="/seller/:id" element={<Layout><PublicProfile /></Layout>} />
      <Route path="/explore" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />
      <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
      
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/careers" element={<Layout><CareersPage /></Layout>} />
      <Route path="/press" element={<Layout><PressPage /></Layout>} />
      <Route path="/help" element={<Layout><HelpPage /></Layout>} />
      <Route path="/safety" element={<Layout><SafetyPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
      <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
      <Route path="/legal" element={<Layout><LegalMentionsPage /></Layout>} />

      <Route path="/create" element={
        <ProtectedRoute>
          <Layout><CreateListing /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><DashboardLayout /></Layout>
        </ProtectedRoute>
      }>
        <Route index element={<Overview />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="orders" element={<Orders />} />
        <Route path="settings" element={<Settings />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="listings" element={<MyListings />} />
        <Route path="sales" element={<MySales />} />
        <Route path="wallet" element={<Wallet />} />
      </Route>

      <Route path="/profile" element={
        <ProtectedRoute>
           <Layout><Profile /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/messages" element={
        <ProtectedRoute>
          <Layout><Messages /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
