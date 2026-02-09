
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation API call
    setTimeout(() => {
        setLoading(false);
        setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md text-center">
        {sent ? (
             <div className="animate-in fade-in zoom-in">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle className="w-8 h-8" />
                 </div>
                 <h1 className="text-2xl font-bold text-gray-900 mb-2">Email envoyé !</h1>
                 <p className="text-gray-500 mb-6">
                    Si un compte existe pour <strong>{email}</strong>, vous recevrez les instructions pour réinitialiser votre mot de passe.
                 </p>
                 <Link to="/login" className="block w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                    Retour à la connexion
                 </Link>
             </div>
        ) : (
            <>
                <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-6 font-bold">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
                <div className="w-16 h-16 bg-blue-50 text-majorelle rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié ?</h1>
                <p className="text-gray-500 mb-8">
                    Entrez votre email et nous vous enverrons un lien pour récupérer votre compte.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
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
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-majorelle text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        Envoyer le lien
                    </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
};
