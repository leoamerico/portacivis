import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PortaCivis — Portal do Cidadão',
  description: 'Serviços, informações e transparência da cidade.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
