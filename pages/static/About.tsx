
import React from 'react';
import { Users, Briefcase, Newspaper, TrendingUp, Heart, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Notre Histoire</h1>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto">
        Comment BalMar réinvente la mode seconde main au Maroc, entre tradition et modernité.
      </p>
    </div>

    <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Globe className="w-6 h-6 text-majorelle" />
          Né à Casablanca
        </h2>
        <p>
          L'idée de <strong>BalMar</strong> (contraction de "Bale" et "Maroc") est née en 2024, d'un constat simple : 
          le Maroc possède une culture incroyable du vêtement (du Caftan haute couture à la pièce vintage unique dénichée en friperie), 
          mais il manquait une plateforme de confiance pour connecter les passionnés.
        </p>
        <p className="mt-4">
          Nous avons voulu créer une alternative aux groupes Facebook informels et aux marchés physiques parfois chaotiques. 
          Une solution 100% digitale, sécurisée par l'IA, mais qui garde l'âme du souk : la négociation, la découverte et le lien humain.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-2xl">
          <h3 className="font-bold text-majorelle text-lg mb-2">Notre Mission</h3>
          <p>Démocratiser la mode circulaire au Maroc en levant les freins de la confiance et de la logistique.</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-2xl">
          <h3 className="font-bold text-ochre text-lg mb-2">Nos Valeurs</h3>
          <p>Transparence, Authenticité, Durabilité et Innovation technologique.</p>
        </div>
      </div>
    </div>
  </div>
);

export const CareersPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Carrières</h1>
      <p className="text-xl text-gray-500">Rejoignez l'équipe qui digitalise le commerce de demain.</p>
    </div>

    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center py-16">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun poste ouvert pour le moment</h2>
        <p className="text-gray-500 mb-6">
          Nous grandissons vite ! Revenez bientôt pour voir nos offres en Développement, Marketing et Opérations.
        </p>
        <button className="bg-majorelle text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-800 transition">
          Envoyer une candidature spontanée
        </button>
      </div>
    </div>
  </div>
);

export const PressPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Espace Presse</h1>
      <p className="text-xl text-gray-500">Actualités, communiqués et ressources de marque.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <Newspaper className="w-8 h-8 text-majorelle mb-4" />
        <h3 className="font-bold text-lg mb-2">Communiqués de presse</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-400 block">Janvier 2025</span>
            BalMar lance la première IA de vérification de Caftans.
          </li>
          <li className="border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-400 block">Décembre 2024</span>
            Levée de fonds Seed pour conquérir l'Afrique du Nord.
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <TrendingUp className="w-8 h-8 text-ochre mb-4" />
        <h3 className="font-bold text-lg mb-2">Kit Média</h3>
        <p className="text-sm text-gray-600 mb-4">
          Téléchargez nos logos, photos officielles et charte graphique.
        </p>
        <button className="text-majorelle font-bold text-sm hover:underline">
          Télécharger le Kit (.zip)
        </button>
      </div>
    </div>
  </div>
);
