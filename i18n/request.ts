import {cookies} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, isValidLocale, localeCookieName} from './config';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  const locale = cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}/common.json`)).default
  };
});
