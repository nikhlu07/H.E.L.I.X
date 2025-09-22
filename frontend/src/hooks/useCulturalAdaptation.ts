import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface CulturalAdaptation {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  icons: {
    flag: string;
    legal: string;
    transparency: string;
    currency: string;
    success: string;
    error: string;
  };
  phrases: {
    greeting: string;
    welcome: string;
    success: string;
    error: string;
    loading: string;
  };
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
}

export function useCulturalAdaptation(): CulturalAdaptation {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const culturalConfig = useMemo(() => {
    // Default configuration (English/International)
    const baseConfig = {
      colors: {
        primary: '#FFD700', // Gold
        secondary: '#1E40AF', // Royal Blue
        accent: '#10B981', // Emerald Green
        background: '#0F172A', // Dark Blue
        text: '#F8FAFC', // Light Gray
      },
      icons: {
        flag: '🇮🇳',
        legal: '⚖️',
        transparency: '🔍',
        currency: '₹',
        success: '✅',
        error: '❌',
      },
      phrases: {
        greeting: t('greeting', 'Namaste'),
        welcome: t('welcome', 'Welcome to H.E.L.I.X.'),
        success: t('success', 'Operation successful'),
        error: t('error', 'Something went wrong'),
        loading: t('loading', 'Loading...'),
      },
    };

    // Region-specific overrides
    const regionalOverrides: Record<string, Partial<typeof baseConfig>> = {
      'hi-IN': { // Hindi (India)
        icons: {
          ...baseConfig.icons,
          flag: '🇮🇳',
          currency: '₹',
        },
        phrases: {
          ...baseConfig.phrases,
          greeting: 'नमस्ते',
          welcome: 'H.E.L.I.X. में आपका स्वागत है',
        },
      },
      'en-US': { // English (US)
        icons: {
          ...baseConfig.icons,
          currency: '$',
        },
      },
      'en-GB': { // English (UK)
        icons: {
          ...baseConfig.icons,
          currency: '£',
        },
      },
      'es-ES': { // Spanish (Spain)
        icons: {
          ...baseConfig.icons,
          flag: '🇪🇸',
          currency: '€',
        },
        phrases: {
          ...baseConfig.phrases,
          greeting: 'Hola',
          welcome: 'Bienvenido a H.E.L.I.X.',
        },
      },
      'fr-FR': { // French (France)
        icons: {
          ...baseConfig.icons,
          flag: '🇫🇷',
          currency: '€',
        },
        phrases: {
          ...baseConfig.phrases,
          greeting: 'Bonjour',
          welcome: 'Bienvenue sur H.E.L.I.X.',
        },
      },
      'de-DE': { // German (Germany)
        icons: {
          ...baseConfig.icons,
          flag: '🇩🇪',
          currency: '€',
        },
        phrases: {
          ...baseConfig.phrases,
          greeting: 'Hallo',
          welcome: 'Willkommen bei H.E.L.I.X.',
        },
      },
    };

    // Merge base config with regional overrides
    const regionalConfig = regionalOverrides[currentLanguage] || {};
    
    return {
      ...baseConfig,
      ...regionalConfig,
      colors: {
        ...baseConfig.colors,
        ...regionalConfig.colors,
      },
      icons: {
        ...baseConfig.icons,
        ...regionalConfig.icons,
      },
      phrases: {
        ...baseConfig.phrases,
        ...regionalConfig.phrases,
      },
    };
  }, [currentLanguage, t]);

  const formatNumber = (num: number): string => {
    try {
      return new Intl.NumberFormat(currentLanguage).format(num);
    } catch {
      return num.toString();
    }
  };

  const formatCurrency = (amount: number): string => {
    try {
      const currencyCode = currentLanguage === 'en-US' ? 'USD' : 
                         currentLanguage === 'en-GB' ? 'GBP' :
                         currentLanguage === 'es-ES' || currentLanguage === 'fr-FR' || currentLanguage === 'de-DE' ? 'EUR' :
                         'INR';
      
      return new Intl.NumberFormat(currentLanguage, {
        style: 'currency',
        currency: currencyCode,
      }).format(amount);
    } catch {
      return `${culturalConfig.icons.currency}${formatNumber(amount)}`;
    }
  };

  const formatDate = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat(currentLanguage, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  };

  return {
    colors: culturalConfig.colors,
    icons: culturalConfig.icons,
    phrases: culturalConfig.phrases,
    formatNumber,
    formatCurrency,
    formatDate,
  };
}