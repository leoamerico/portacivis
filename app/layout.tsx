import './globals.css';
import type { Metadata } from 'next';
import AccessibilityPanel from './components/AccessibilityPanel';

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
        {children}
      </body>
    </html>
  );
}
