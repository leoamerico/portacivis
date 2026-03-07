'use client';

import {useEffect, useRef} from 'react';
import Link from 'next/link';

export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js';
    script.onload = () => {
      const SwaggerUIBundle = (window as unknown as {SwaggerUIBundle: (config: unknown) => void}).SwaggerUIBundle;
      if (SwaggerUIBundle) {
        SwaggerUIBundle({
          url: '/docs/api/openapi.yaml',
          dom_id: '#swagger-ui-container',
          presets: [
            (window as unknown as {SwaggerUIBundle: {presets: {apis: unknown; SwaggerUIStandalonePreset: unknown}}}).SwaggerUIBundle.presets.apis
          ],
          layout: 'BaseLayout',
          deepLinking: true,
          showExtensions: true,
          showCommonExtensions: true
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
      container.innerHTML = '';
    };
  }, []);

  return (
    <main id="conteudo-principal" role="main" style={{padding: 0}}>
      <div style={{padding: '1rem 1.5rem', borderBottom: '1px solid #e0e0e0', background: '#f8f9fa'}}>
        <Link href="/" style={{color: 'var(--brand-primary, #1e5aa8)', textDecoration: 'none', fontSize: '0.875rem'}}>
          ← Início
        </Link>
        <span style={{margin: '0 0.5rem', color: '#666'}} aria-hidden="true">/</span>
        <span style={{fontSize: '0.875rem', color: '#333'}}>Documentação da API</span>
      </div>
      <div
        id="swagger-ui-container"
        ref={containerRef}
        aria-label="Documentação interativa da API PortaCivis"
        style={{minHeight: '80vh'}}
      />
    </main>
  );
}
