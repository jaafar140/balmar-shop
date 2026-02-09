
import React from 'react';
import { ShieldCheck, Mail, Phone, MessageCircle, HelpCircle, AlertTriangle, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HelpPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in">
    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Comment pouvons-nous vous aider ?</h1>
    
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-majorelle transition cursor-pointer">
        <Truck className="w-8 h-8 text-majorelle mb-4" />
        <h3 className="font-bold mb-2">Livraison & Suivi</h3>
        <p className="text-sm text-gray-500">Tout savoir sur l'expédition, les délais et les transporteurs.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-majorelle transition cursor-pointer">
        <CreditCard className="w-8 h-8 text-ochre mb-4" />
        <h3 className="font-bold mb-2">Paiement & Escrow</h3>
        <p className="text-sm text-gray-500">Comprendre comment nous sécurisons votre argent.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-majorelle transition cursor-pointer">
        <ShieldCheck className="w-8 h-8 text-green-600 mb-4" />
        <h3 className="font-bold mb-2">Litiges & Retours</h3>
        <p className="text-sm text-gray-500">Procédures en cas de non-conformité (Loi 31-08).</p>
      </div>
    </div>

    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Questions Fréquentes</h2>
      {[
        "Comment devenir vendeur vérifié ?",
        "Quels sont les frais de commission ?",
        "Comment fonctionne le paiement à la livraison sécurisé ?",
        "Puis-je annuler ma commande ?"
      ].map((q, i) => (
        <details key={i} className="bg-white p-4 rounded-xl border border-gray-200 group">
          <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
            {q}
            <span className="text-gray-400 group-open:rotate-180 transition">▼</span>
          </summary>
          <p className="mt-3 text-sm text-gray-600 pl-2 border-l-2 border-majorelle">
            Ceci est une réponse type pour la démonstration. Consultez nos CGU pour plus de détails.
          </p>
        </details>
      ))}
    </div>
  </div>
);

export const SafetyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in">
    <div className="bg-gradient-to-r from-majorelle to-blue-800 rounded-3xl p-8 md:p-12 text-white mb-10 text-center">
      <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-green-400" />
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Confiance & Sécurité</h1>
      <p className="text-lg text-blue-100 max-w-2xl mx-auto">
        Chez BalMar, votre sécurité n'est pas une option. Découvrez comment nous protégeons chaque transaction.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Paiement Séquestre (Escrow)</h3>
            <p className="text-gray-600 text-sm mt-1">
              Lorsque vous payez, l'argent est bloqué sur un compte sécurisé. Le vendeur n'est payé que lorsque vous confirmez la réception et la conformité de l'article.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Lutte anti-contrefaçon</h3>
            <p className="text-gray-600 text-sm mt-1">
              Nous utilisons une IA avancée et une modération humaine pour détecter les contrefaçons. Les vendeurs frauduleux sont bannis immédiatement.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Conseils de sécurité</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-2"><CheckCircleIcon /> Ne sortez jamais de la plateforme pour payer.</li>
          <li className="flex gap-2"><CheckCircleIcon /> Vérifiez le Trust Score du vendeur.</li>
          <li className="flex gap-2"><CheckCircleIcon /> Filmez l'ouverture de votre colis coûteux.</li>
          <li className="flex gap-2"><CheckCircleIcon /> Utilisez la messagerie intégrée uniquement.</li>
        </ul>
      </div>
    </div>
  </div>
);

const CheckCircleIcon = () => <div className="w-5 h-5 text-green-500">✓</div>;

export const ContactPage: React.FC = () => (
  <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in">
    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Contactez-nous</h1>
    <p className="text-gray-500 text-center mb-8">Notre équipe est basée à Casablanca et répond sous 24h.</p>

    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nom</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-majorelle" placeholder="Votre nom" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-majorelle" placeholder="votre@email.com" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Sujet</label>
          <select className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-majorelle bg-white">
            <option>Problème avec une commande</option>
            <option>Question sur mon compte</option>
            <option>Signaler un bug</option>
            <option>Partenariat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
          <textarea rows={5} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-majorelle" placeholder="Détaillez votre demande..."></textarea>
        </div>

        <button type="button" className="w-full bg-majorelle text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition shadow-md">
          Envoyer le message
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center gap-8 text-gray-500">
         <div className="flex flex-col items-center gap-1">
            <Mail className="w-5 h-5 text-majorelle" />
            <span className="text-xs">support@balmar.ma</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <Phone className="w-5 h-5 text-majorelle" />
            <span className="text-xs">+212 522 00 00 00</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <MessageCircle className="w-5 h-5 text-majorelle" />
            <span className="text-xs">WhatsApp Support</span>
         </div>
      </div>
    </div>
  </div>
);
