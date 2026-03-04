import './globals.css';
import type { Metadata } from 'next';
import AccessibilityPanel from './components/AccessibilityPanel';
import ConsentBanner from './components/ConsentBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PortaCivis — Portal do Cidadão',
  description: 'Serviços, informações e transparência da cidade.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo-principal">
          Pular para o conteúdo principal
        </a>
        <AccessibilityPanel />
        <ConsentBanner />
        {children}
        <footer className="site-footer" aria-label="Rodapé institucional">
          <nav>
            <Link href="/privacidade">Privacidade (LGPD)</Link>
            <Link href="/termos">Termos de uso</Link>
            <Link href="/conformidade">Conformidade</Link>
            <Link href="/accessibilidade">Acessibilidade</Link>
          </nav>
          <p>PortaCivis — Portal do Cidadão. Direitos, deveres, serviços e transparência.</p>
        </footer>
      </body>
    </html>
  );
}
