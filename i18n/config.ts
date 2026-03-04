export const locales = ['pt-BR', 'en-US', 'es-ES'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'pt-BR';
export const localeCookieName = 'PORTACIVIS_LOCALE';

export function isValidLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}
