
import { Condition } from '../types';

// Configuration OpenRouter
// Dans un projet réel, utilisez process.env.REACT_APP_OPENROUTER_API_KEY
const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY || ''; 
const SITE_URL = 'https://balmar.ma'; // Pour le ranking OpenRouter
const APP_NAME = 'BalMar';
const MODEL = 'amazon/nova-2-lite-v1:free';

/**
 * Convertit un fichier en base64 pour l'envoi à l'API
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Analyse une image via Amazon Nova-2 Lite
 * Détecte la marque, la catégorie et le risque de fraude
 */
export const analyzeImage = async (file: File): Promise<{
  brandDetected: string | null;
  categoryPrediction: string;
  isSafe: boolean;
  fraudScore: number;
}> => {
  try {
    const base64Image = await fileToBase64(file);

    // Si pas de clé API, on utilise le mock (pour éviter que l'app plante en démo)
    if (!API_KEY) {
      console.warn("⚠️ Clé API OpenRouter manquante. Utilisation du mode simulation.");
      return mockAnalyze();
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": APP_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": MODEL,
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "Tu es un expert en mode seconde main au Maroc. Analyse cette image d'article à vendre. Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) contenant les clés suivantes : 'brand' (nom de la marque détectée ou null), 'category' (catégorie prédite ex: 'Caftan', 'Sneakers', 'Sac'), 'isSafe' (booléen, true si l'image est appropriée), 'fraudScore' (nombre 0-100, 100 étant une contrefaçon évidente ou photo volée)."
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": base64Image
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) throw new Error('Erreur API OpenRouter');

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Nettoyage du JSON (au cas où le modèle ajoute des ```json)
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonString);

    return {
      brandDetected: result.brand || null,
      categoryPrediction: result.category || 'Autre',
      isSafe: result.isSafe !== false,
      fraudScore: result.fraudScore || 0
    };

  } catch (error) {
    console.error("Erreur AI analysis:", error);
    return mockAnalyze();
  }
};

/**
 * Estime le prix via Amazon Nova-2 Lite
 * Basé sur le marché marocain (MAD)
 */
export const estimatePrice = async (
  category: string,
  condition: string,
  brand: string
): Promise<{ min: number; max: number; suggested: number }> => {
  try {
    if (!API_KEY) {
      return mockEstimate(category, condition, brand);
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": APP_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": MODEL,
        "messages": [
          {
            "role": "system",
            "content": "Tu es un expert en tarification pour le marché de l'occasion au Maroc (Dirhams MAD). Réponds uniquement en JSON."
          },
          {
            "role": "user",
            "content": `Estime le prix de vente d'un article avec ces détails : Catégorie: "${category}", Marque: "${brand}", État: "${condition}". Donne une fourchette de prix réaliste pour le marché marocain (Casablanca/Rabat). Réponds UNIQUEMENT avec un JSON valide contenant : 'min' (nombre), 'max' (nombre), 'suggested' (nombre).`
          }
        ]
      })
    });

    if (!response.ok) throw new Error('Erreur API OpenRouter');

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonString);

    return {
      min: result.min || 100,
      max: result.max || 200,
      suggested: result.suggested || 150
    };

  } catch (error) {
    console.error("Erreur AI estimation:", error);
    return mockEstimate(category, condition, brand);
  }
};

// --- FALLBACK MOCKS (Si API indisponible ou erreur) ---

const mockAnalyze = async () => {
  return new Promise<{brandDetected: string|null, categoryPrediction: string, isSafe: boolean, fraudScore: number}>((resolve) => {
    setTimeout(() => {
      resolve({
        brandDetected: Math.random() > 0.5 ? 'Zara' : null,
        categoryPrediction: 'Vêtements',
        isSafe: true,
        fraudScore: Math.floor(Math.random() * 20),
      });
    }, 1500);
  });
};

const mockEstimate = async (cat: string, cond: string, brand: string) => {
  return new Promise<{min: number, max: number, suggested: number}>((resolve) => {
    setTimeout(() => {
      const base = 200;
      const multiplier = brand ? 2 : 1;
      const conditionFactor = cond.includes('Neuf') ? 1.5 : 0.8;
      const suggested = Math.floor(base * multiplier * conditionFactor);
      resolve({
        min: Math.floor(suggested * 0.8),
        max: Math.floor(suggested * 1.2),
        suggested: suggested
      });
    }, 1000);
  });
};