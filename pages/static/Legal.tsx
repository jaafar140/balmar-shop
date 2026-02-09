
import React from 'react';
import { Scale, FileText, Lock } from 'lucide-react';

export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in">
    <div className="prose prose-blue max-w-none">
      <h1>Conditions Générales d'Utilisation (CGU)</h1>
      <p className="text-sm text-gray-500">Dernière mise à jour : 01 Janvier 2025</p>

      <h2>1. Préambule</h2>
      <p>
        Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation de la plateforme BalMar (ci-après "la Plateforme"), éditée par la société BalMar SARL, sise à Casablanca.
      </p>

      <h2>2. Protection du Consommateur (Loi 31-08)</h2>
      <p>
        Conformément à la loi 31-08 édictant des mesures de protection du consommateur au Maroc :
      </p>
      <ul>
        <li><strong>Droit de rétractation :</strong> L'acheteur dispose d'un délai de 7 jours pour exercer son droit de rétractation à compter de la date de réception du bien, sous réserve que celui-ci ne soit pas conforme à la description.</li>
        <li><strong>Information :</strong> Le vendeur s'engage à fournir une description claire, loyale et complète de l'état de l'article.</li>
      </ul>

      <h2>3. Rôle de BalMar</h2>
      <p>
        BalMar agit en tant que Tiers de Confiance. Nous séquestrons les fonds (Escrow) jusqu'à la finalisation de la transaction pour garantir la sécurité des deux parties. BalMar n'est pas propriétaire des objets vendus.
      </p>

      <h2>4. Frais et Commissions</h2>
      <p>
        L'ouverture de compte est gratuite. Une commission de protection acheteur (5%) et des frais de livraison fixes sont appliqués à chaque transaction.
      </p>
      
      <p className="italic text-gray-500 mt-8">Ceci est un document de démonstration.</p>
    </div>
  </div>
);

export const PrivacyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in">
    <div className="prose prose-blue max-w-none">
      <h1>Politique de Confidentialité</h1>
      
      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6 not-prose">
        <h3 className="text-yellow-800 font-bold flex items-center gap-2 m-0 text-sm">
          <Lock className="w-4 h-4" /> Conformité CNDP
        </h3>
        <p className="text-yellow-700 text-xs mt-1">
          Le traitement de vos données personnelles a fait l'objet d'une déclaration auprès de la CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel) sous le numéro D-123456.
        </p>
      </div>

      <h2>1. Collecte des données</h2>
      <p>
        Nous collectons les données suivantes :
      </p>
      <ul>
        <li>Données d'identification (Nom, Prénom, Email, Téléphone).</li>
        <li>Données de transaction et de livraison (Adresse, Historique).</li>
        <li>Données biométriques (Uniquement pour la vérification d'identité KYC, supprimées après validation).</li>
      </ul>

      <h2>2. Finalité du traitement</h2>
      <p>
        Vos données sont utilisées pour :
      </p>
      <ul>
        <li>Gérer votre compte et vos transactions.</li>
        <li>Lutter contre la fraude et assurer la sécurité de la plateforme.</li>
        <li>Améliorer votre expérience utilisateur.</li>
      </ul>

      <h2>3. Vos droits (Loi 09-08)</h2>
      <p>
        Conformément à la loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles. Pour exercer ce droit, contactez : privacy@balmar.ma.
      </p>
    </div>
  </div>
);

export const LegalMentionsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <BuildingIcon /> Éditeur
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><strong>Raison sociale :</strong> BalMar S.A.R.L</li>
          <li><strong>Capital social :</strong> 100.000 MAD</li>
          <li><strong>Siège social :</strong> Technopark Casablanca, Route de Nouaceur, Casablanca, Maroc</li>
          <li><strong>RC :</strong> 123456</li>
          <li><strong>ICE :</strong> 001234567890000</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <GlobeIcon /> Hébergement
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><strong>Hébergeur :</strong> Amazon Web Services (AWS)</li>
          <li><strong>Adresse :</strong> Seattle, WA 98109, USA</li>
          <li><strong>Données :</strong> Stockées en conformité avec la réglementation marocaine.</li>
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm md:col-span-2">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Propriété Intellectuelle
        </h3>
        <p className="text-sm text-gray-600">
          L'ensemble de ce site relève de la législation marocaine et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
        </p>
      </div>
    </div>
  </div>
);

const BuildingIcon = () => <Scale className="w-5 h-5 text-gray-400" />;
const GlobeIcon = () => <FileText className="w-5 h-5 text-gray-400" />;
