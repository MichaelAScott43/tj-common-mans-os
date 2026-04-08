import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import pt from './locales/pt';

/**
 * Supported language codes.
 * Add new locales here + create the corresponding file in ./locales/.
 */
export const SupportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
];

/**
 * Derive a supported language code from the device locale.
 * Falls back to 'en' when the device language is not supported.
 */
export function getDeviceLanguage() {
  const deviceLocale = Localization.getLocales()?.[0]?.languageCode ?? 'en';
  const supported = SupportedLanguages.map((l) => l.code);
  return supported.includes(deviceLocale) ? deviceLocale : 'en';
}

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: { en, es, fr, pt },
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already handles XSS
    },
  });

export default i18n;
