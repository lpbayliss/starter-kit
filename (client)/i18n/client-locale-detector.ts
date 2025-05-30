import { isValidLocale, DEFAULT_LOCALE } from './config';

export function getClientLocale(): string {
  // Try to get locale from cookie
  const cookieLocale = getCookieLocale();
  if (cookieLocale) return cookieLocale;
  
  // Try to get from browser language
  const browserLocale = getBrowserLocale();
  if (browserLocale) return browserLocale;
  
  // Return default
  return DEFAULT_LOCALE;
}

function getCookieLocale(): string | null {
  if (typeof document === 'undefined') return null;
  
  const match = document.cookie.match(/locale=([^;]+)/);
  const locale = match?.[1];
  return locale && isValidLocale(locale) ? locale : null;
}

function getBrowserLocale(): string | null {
  if (typeof navigator === 'undefined') return null;
  
  const language = navigator.language.split('-')[0];
  return isValidLocale(language) ? language : null;
}