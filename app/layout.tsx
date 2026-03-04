import './globals.css';
import '../styles/brand.css';
import type { Metadata } from 'next';
import {getLocale, getMessages, getTranslations} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import {headers, cookies} from 'next/headers';
import AccessibilityPanel from './components/AccessibilityPanel';
import ConsentBanner from './components/ConsentBanner';
import LanguageSwitcher from './components/LanguageSwitcher';
import {BrandProvider} from './brand/BrandProvider';
import {resolveBrand} from '../src/brand/resolve';
import {getBrandConfig} from '../src/brand/load';
import {loadBrandCssVars} from '../src/brand/tokens';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PortaCivis — Portal do Cidadão',
  description: 'Serviços, informações e transparência da cidade.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations();
  const h = await headers();
  const c = await cookies();

  const host = h.get('host') ?? '';
  const tenant = c.get('ENVNEO_TENANT')?.value ?? null;
  const brandHint = c.get('ENVNEO_BRAND')?.value ?? null;
  const {brand_id} = resolveBrand({host, tenant, brandHint});
  const brandBase = getBrandConfig(brand_id);
  const {cssVars, tokens} = await loadBrandCssVars(brandBase);
  const brand = {
    ...brandBase,
    tokens
  };

  return (
    <html lang={locale}>
      <head>
        <style id="brand-vars">{cssVars}</style>
      </head>
      <body>
        <a className="skip-link" href="#conteudo-principal">
          {t('skipToContent')}
        </a>
        <BrandProvider brand={brand}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <AccessibilityPanel />
            <LanguageSwitcher />
            <ConsentBanner />
            {children}
            <footer className="site-footer" aria-label="Rodapé institucional">
              <nav>
                <Link href="/noticias">{t('nav.news')}</Link>
                <Link href="/agentes">{t('nav.agents')}</Link>
                <Link href="/privacidade">{t('nav.privacy')}</Link>
                <Link href="/cookies-e-cache">{t('nav.cookies')}</Link>
                <Link href="/termos">{t('nav.terms')}</Link>
                <Link href="/conformidade">{t('nav.compliance')}</Link>
                <Link href="/accessibilidade">{t('nav.accessibility')}</Link>
              </nav>
              <p>{t('footer.copy')}</p>
            </footer>
          </NextIntlClientProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
