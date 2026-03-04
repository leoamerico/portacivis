'use client';

import {ChangeEvent, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {locales, localeCookieName, type AppLocale} from '../../i18n/config';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const locale = useLocale() as AppLocale;
  const t = useTranslations('language');

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as AppLocale;
    if (nextLocale === locale) {
      return;
    }

    document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="language-switcher" aria-label={t('label')}>
      <label htmlFor="language-select">{t('label')}</label>
      <select id="language-select" value={locale} onChange={onChange} disabled={isPending}>
        {locales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {t(supportedLocale)}
          </option>
        ))}
      </select>
    </div>
  );
}
