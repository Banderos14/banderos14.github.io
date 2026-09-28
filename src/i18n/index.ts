import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { createElement } from 'react';
import { en } from './en';
import { fr } from './fr';
import { ru } from './ru';

export type Locale = 'en' | 'fr' | 'ru';
export type Translations = typeof en;

const LOCALES: Record<Locale, Translations> = { en, fr, ru };
const STORAGE_KEY = 'locale';

export const LOCALE_LIST: Locale[] = ['en', 'fr', 'ru'];

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'fr' || stored === 'ru') return stored;
  } catch {
    // storage blocked — fall through to default
  }
  return 'en';
}

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // storage blocked — choice lasts for this visit only
    }
  }, []);

  useEffect(() => {
    document.title = LOCALES[locale].meta.title;
    document.documentElement.lang = locale;
  }, [locale]);

  return createElement(
    LocaleContext.Provider,
    { value: { locale, t: LOCALES[locale], setLocale } },
    children,
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
