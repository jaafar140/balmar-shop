
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const err = await signup(name, email, password);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      navigate('/');
    }
  };

  const handleSocialMock = async () => {
      setLoading(true);
      // Simulation d'une inscription via social (utilise le compte démo pour l'instant)
      await login('salma.b@example.com', 'password');
      setLoading(false);
      navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-majorelle mb-2">Rejoignez BalMar</h1>
          <p className="text-gray-500">Commencez à acheter et vendre dès aujourd'hui.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nom complet</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-majorelle outline-none"
              placeholder="Prénom Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-majorelle outline-none"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-majorelle outline-none"
              placeholder="Au moins 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-majorelle text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2 mt-4"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Créer mon compte
          </button>
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Ou s'inscrire avec</span></div>
        </div>
        
        <div className="flex gap-4">
            <button onClick={handleSocialMock} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/> Google
            </button>
            <button onClick={handleSocialMock} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook"/> Facebook
            </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-majorelle font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};
