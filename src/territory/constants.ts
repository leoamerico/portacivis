import type {FederativeUnit, ProspectionLayer} from './types';

export const FEDERATIVE_UNITS: FederativeUnit[] = [
  {code: 'AC', name: 'Acre', lat: -9.9754, lng: -67.8249},
  {code: 'AL', name: 'Alagoas', lat: -9.6498, lng: -35.7089},
  {code: 'AP', name: 'Amapá', lat: 0.0356, lng: -51.0705},
  {code: 'AM', name: 'Amazonas', lat: -3.119, lng: -60.0217},
  {code: 'BA', name: 'Bahia', lat: -12.9777, lng: -38.5016},
  {code: 'CE', name: 'Ceará', lat: -3.7319, lng: -38.5267},
  {code: 'DF', name: 'Distrito Federal', lat: -15.7939, lng: -47.8828},
  {code: 'ES', name: 'Espírito Santo', lat: -20.3155, lng: -40.3128},
  {code: 'GO', name: 'Goiás', lat: -16.6869, lng: -49.2648},
  {code: 'MA', name: 'Maranhão', lat: -2.5307, lng: -44.3068},
  {code: 'MT', name: 'Mato Grosso', lat: -15.6014, lng: -56.0979},
  {code: 'MS', name: 'Mato Grosso do Sul', lat: -20.4697, lng: -54.6201},
  {code: 'MG', name: 'Minas Gerais', lat: -19.9167, lng: -43.9345},
  {code: 'PA', name: 'Pará', lat: -1.4558, lng: -48.5044},
  {code: 'PB', name: 'Paraíba', lat: -7.1195, lng: -34.845},
  {code: 'PR', name: 'Paraná', lat: -25.4284, lng: -49.2733},
  {code: 'PE', name: 'Pernambuco', lat: -8.0476, lng: -34.877},
  {code: 'PI', name: 'Piauí', lat: -5.0919, lng: -42.8034},
  {code: 'RJ', name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729},
  {code: 'RN', name: 'Rio Grande do Norte', lat: -5.7945, lng: -35.211},
  {code: 'RS', name: 'Rio Grande do Sul', lat: -30.0346, lng: -51.2177},
  {code: 'RO', name: 'Rondônia', lat: -8.7612, lng: -63.9039},
  {code: 'RR', name: 'Roraima', lat: 2.8235, lng: -60.6753},
  {code: 'SC', name: 'Santa Catarina', lat: -27.5949, lng: -48.5482},
  {code: 'SP', name: 'São Paulo', lat: -23.5505, lng: -46.6333},
  {code: 'SE', name: 'Sergipe', lat: -10.9472, lng: -37.0731},
  {code: 'TO', name: 'Tocantins', lat: -10.184, lng: -48.3336}
];

export const PROSPECTION_LAYERS: ProspectionLayer[] = [
  {
    id: 'news_signals',
    label: 'Sinais e notícias locais',
    description: 'Fatos recentes e sinais públicos para priorização comunitária.',
    source: 'Base editorial e clipping público'
  },
  {
    id: 'public_services',
    label: 'Serviços públicos',
    description: 'Leitura de oferta e acesso a serviços essenciais para a população.',
    source: 'Bases abertas municipais/estaduais'
  },
  {
    id: 'compliance',
    label: 'Conformidade e transparência',
    description: 'Indicadores de governança, controle social e obrigações públicas.',
    source: 'Portais de transparência e marcos normativos'
  },
  {
    id: 'mobility',
    label: 'Mobilidade urbana',
    description: 'Contexto de deslocamento e gargalos de mobilidade com impacto cidadão.',
    source: 'Dados públicos de mobilidade'
  },
  {
    id: 'alerts',
    label: 'Alertas prioritários',
    description: 'Ocorrências e alertas com potencial efeito imediato para o território.',
    source: 'Fontes oficiais de alerta'
  }
];

export const DEFAULT_LAYERS = ['public_services', 'alerts', 'compliance'];

// BRAND_COLOR_ALLOWLIST — hex values below are CSS variable fallbacks, not hardcoded brand colors
export const MARKER_BORDER_COLOR = 'var(--color-text-primary, rgb(15 23 42))';
export const MARKER_FILL_COLOR = 'var(--color-brand-primary, rgb(29 78 216))';

export const MAP_CENTER: [number, number] = [-14.235, -51.9253];
export const MAP_DEFAULT_ZOOM = 4;
export const MAP_MIN_ZOOM = 3;
export const MAP_MAX_ZOOM = 7;
export const MAP_TILE_URL = '/api/map-tiles/{z}/{x}/{y}.png';
export const MAP_ATTRIBUTION = '&copy; OpenStreetMap contributors';

export const IBGE_MUNICIPIOS_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
export const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
