import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('dom_shadi_lang') || 'hi'; // Default to Devanagari Hindi as requested!
  });

  useEffect(() => {
    localStorage.setItem('dom_shadi_lang', language);
    if (language === 'hi') {
      document.documentElement.lang = 'hi';
      document.body.classList.add('lang-hi');
    } else {
      document.documentElement.lang = 'en';
      document.body.classList.remove('lang-hi');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
