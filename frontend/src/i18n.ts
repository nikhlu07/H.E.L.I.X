import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Basic translation resources - you can expand this with actual translations
const resources = {
  en: {
    translation: {
      // Common UI elements
      welcome: 'Welcome to H.E.L.I.X',
      loading: 'Loading...',
      login: 'Login',
      logout: 'Logout',
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      
      // Landing page
      hero_title: 'Transparent Procurement & Fraud Detection',
      hero_subtitle: 'Leveraging ICP blockchain for accountable public spending',
      get_started: 'Get Started',
      try_demo: 'Try Demo',
      
      // Branding (used in HeroSection)
      branding: {
        title: 'H.E.L.I.X',
        subtitle: 'Transparent Procurement & Fraud Detection',
        tagline: 'Holistic Ecosystem for Limiting Irregular Expenditure',
      },
      
      // Metrics
      corruption: {
        prevented: 'Corruption Prevented',
      },
      
      // Roles
      national_authority: 'National Authority',
      regional_administrator: 'Regional Administrator',
      district_coordinator: 'District Coordinator',
      implementation_partner: 'Implementation Partner',
      community_representative: 'Community Representative',
      public_oversight: 'Public Oversight',
      
      // Sectors
      government: 'Government',
      healthcare: 'Healthcare',
      education: 'Education',
      infrastructure: 'Infrastructure',
      
      // Error messages
      error_generic: 'Something went wrong',
      error_login: 'Login failed',
      error_network: 'Network error',
    }
  },
  // Add more languages here as needed
  es: {
    translation: {
      welcome: 'Bienvenido a H.E.L.I.X',
      loading: 'Cargando...',
      login: 'Iniciar sesión',
    }
  },
  fr: {
    translation: {
      welcome: 'Bienvenue sur H.E.L.I.X',
      loading: 'Chargement...',
      login: 'Connexion',
    }
  }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Use English if detected language is not available
    debug: process.env.NODE_ENV === 'development', // Enable debug only in development
    
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;