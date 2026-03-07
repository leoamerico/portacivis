import './globals.css';
import 'leaflet/dist/leaflet.css';
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
  metadataBase: new URL('https://www.portacivis.com.br'),
  title: 'PortaCivis — Portal do Cidadão',
  description: 'Serviços, informações e transparência da cidade.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    url: 'https://www.portacivis.com.br/',
    siteName: 'PortaCivis',
    title: 'PortaCivis — Portal do Cidadão',
    description: 'Serviços, informações e transparência da cidade.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'PortaCivis — Portal do Cidadão'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PortaCivis — Portal do Cidadão',
    description: 'Serviços, informações e transparência da cidade.',
    images: ['/twitter-image']
  }
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
  const {cssVars, tokens} = await loadBrandCssVars(brandBase).catch(() => ({
    cssVars: ':root { --brand-primary: rgb(30 90 168); --brand-secondary: rgb(47 125 209); --brand-citizen: rgb(243 156 18); --brand-neutral: rgb(74 74 74); --brand-background: rgb(255 255 255); }',
    tokens: {
      primary: 'rgb(30 90 168)',
      secondary: 'rgb(47 125 209)',
      citizen: 'rgb(243 156 18)',
      neutral: 'rgb(74 74 74)',
      background: 'rgb(255 255 255)'
    }
  }));
  const brand = {
    ...brandBase,
    tokens
  };

  return (
    <html lang={locale}>
      <head>
        <style id="brand-vars">{cssVars}</style>
        {/* Sticky header scroll shadow */}
        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            function onScroll(){
              var h=document.querySelector('.site-header');
              if(!h)return;
              h.classList.toggle('scrolled',window.scrollY>8);
            }
            window.addEventListener('scroll',onScroll,{passive:true});
          })();
        `}} />
      </head>
      <body>
        <a className="skip-link" href="#conteudo-principal">
          {t('skipToContent')}
        </a>
        <BrandProvider brand={brand}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <header className="site-header" aria-label="Cabeçalho institucional">
              <div className="site-header-inner">
                <Link href="/" className="site-header-brand" aria-label={`${brand.name} - Página inicial`}>
                  <img
                    src={brand.assets.logo}
                    alt={brand.name}
                    width={220}
                    height={62}
                    loading="eager"
                    decoding="async"
                  />
                </Link>
                <div className="site-utilities" aria-label="Ferramentas de interface">
                  <LanguageSwitcher />
                  <AccessibilityPanel />
                </div>
              </div>
            </header>
            <ConsentBanner />
            {children}
            <footer className="site-footer" aria-label="Rodapé institucional">
              <div className="site-footer-brand">
                <img
                  src={brand.assets.mark}
                  alt={brand.name}
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <strong>{brand.name}</strong>
                  <p>{brand.owner}</p>
                </div>
              </div>
              <nav>
                <Link href="/noticias">{t('nav.news')}</Link>
                <Link href="/agentes">{t('nav.agents')}</Link>
                <Link href="/privacidade">{t('nav.privacy')}</Link>
                <Link href="/meus-dados">{t('nav.myData')}</Link>
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
