import {NextResponse} from 'next/server';

export const runtime = 'nodejs';

const CATALOG = {
  '@context': 'https://project-open-data.cio.gov/v1.1/schema/catalog.jsonld',
  '@type': 'dcat:Catalog',
  conformsTo: 'https://project-open-data.cio.gov/v1.1/schema',
  dataset: [
    {
      '@type': 'dcat:Dataset',
      title: 'Serviços Disponíveis',
      description: 'Catálogo de serviços públicos oferecidos pelo portal PortaCivis',
      keyword: ['serviços', 'gov.br', 'transparência', 'cidadão'],
      issued: '2026-03-07',
      modified: new Date().toISOString().slice(0, 10),
      publisher: {
        name: 'ENV NEO LTDA'
      },
      contactPoint: {
        fn: 'Env Neo - Suporte Técnico',
        hasEmail: 'mailto:api@portacivis.com.br'
      },
      distribution: [
        {
          '@type': 'dcat:Distribution',
          title: 'Serviços em JSON',
          mediaType: 'application/json',
          format: 'JSON',
          accessURL: 'https://www.portacivis.com.br/dados-abertos/servicos.json'
        }
      ],
      license: 'http://opendefinition.org/licenses/cc-by/',
      accrualPeriodicity: 'R/P1D',
      spatial: 'BR',
      language: ['pt-BR']
    },
    {
      '@type': 'dcat:Dataset',
      title: 'Dados de Transparência',
      description: 'Dados públicos, relatórios e atos oficiais com referência de fonte',
      keyword: ['transparência', 'dados-abertos', 'relatórios', 'atos-oficiais'],
      issued: '2026-03-07',
      modified: new Date().toISOString().slice(0, 10),
      publisher: {
        name: 'ENV NEO LTDA'
      },
      contactPoint: {
        fn: 'Env Neo - Suporte Técnico',
        hasEmail: 'mailto:api@portacivis.com.br'
      },
      distribution: [
        {
          '@type': 'dcat:Distribution',
          title: 'Catálogo de Dados Abertos em JSON',
          mediaType: 'application/json',
          format: 'JSON',
          accessURL: 'https://www.portacivis.com.br/dados-abertos/catalog.json'
        }
      ],
      license: 'http://opendefinition.org/licenses/cc-by/',
      accrualPeriodicity: 'R/P1D',
      spatial: 'BR',
      language: ['pt-BR']
    }
  ]
};

export async function GET() {
  return NextResponse.json(CATALOG, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Accept'
    }
  });
}
