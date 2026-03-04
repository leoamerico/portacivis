import './globals.css';
import type { Metadata } from 'next';
import {getLocale, getMessages, getTranslations} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import AccessibilityPanel from './components/AccessibilityPanel';
import ConsentBanner from './components/ConsentBanner';
import LanguageSwitcher from './components/LanguageSwitcher';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PortaCivis — Portal do Cidadão',
  description: 'Serviços, informações e transparência da cidade.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations();

  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#conteudo-principal">
          {t('skipToContent')}
        </a>
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
      </body>
    </html>
  );
}
