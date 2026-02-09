
import { useState, useEffect } from 'react';
import { translations, Language, formatMoney as fmtMoney } from '../services/i18nService';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  const formatMoney = (amount: number) => fmtMoney(amount);

  return {
    language,
    setLanguage,
    t,
    formatMoney
  };
};
