/**
 * Shared types for transparency modules:
 * - Module 1: Trilha da Verdade Aumentada
 * - Module 3: Mapa de Conformidade Municipal
 * - Module 4: Sistema de Alertas Inteligentes
 */

// ── Module 1: Data Provenance ─────────────────────────────────────────────────

export type DataSource = {
  id: string;
  name: string;
  url: string;
  type: 'portal_transparencia' | 'diario_oficial' | 'ibge' | 'tcu' | 'esic' | 'lai' | 'outro';
};

export type DataProvenance = {
  id: string;
  source: DataSource;
  lastUpdated: string;
  capturedAt: string;
  contentHash: string;
  changeHistory: DataChange[];
};

export type DataChange = {
  date: string;
  description: string;
  previousHash: string;
  newHash: string;
};

export type TrailPermalink = {
  id: string;
  title: string;
  city: string;
  uf: string;
  createdAt: string;
  snapshotHash: string;
  layers: string[];
  provenances: DataProvenance[];
  expiresAt: string | null;
};

export type StalenessAlert = {
  sourceId: string;
  sourceName: string;
  lastUpdated: string;
  thresholdDays: number;
  daysSinceUpdate: number;
  severity: 'warning' | 'critical';
};

export type TrailExportData = {
  title: string;
  city: string;
  uf: string;
  generatedAt: string;
  layers: string[];
  provenances: DataProvenance[];
  stalenessAlerts: StalenessAlert[];
  signatureHash: string;
};

// ── Module 3: Compliance Score ────────────────────────────────────────────────

export type ComplianceDimension = {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'compliant' | 'partial' | 'non_compliant' | 'no_data';
  lastChecked: string;
  source: DataSource;
};

export type ComplianceScore = {
  cityCode: string;
  cityName: string;
  uf: string;
  overallScore: number;
  colorGrade: 'green' | 'yellow' | 'red' | 'gray';
  dimensions: ComplianceDimension[];
  lastCalculated: string;
  history: ComplianceHistoryEntry[];
};

export type ComplianceHistoryEntry = {
  date: string;
  score: number;
  colorGrade: 'green' | 'yellow' | 'red' | 'gray';
};

export type ComplianceComparison = {
  cities: ComplianceScore[];
  generatedAt: string;
};

export type LAIRequest = {
  cityName: string;
  uf: string;
  ouvidoriaEmail: string;
  dimensions: string[];
  templateText: string;
  generatedAt: string;
};

// ── Module 4: Alerts ──────────────────────────────────────────────────────────

export type AlertSeverity = 'urgent' | 'attention' | 'informative';

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  cityCode: string;
  cityName: string;
  uf: string;
  category: 'saude' | 'educacao' | 'seguranca' | 'mobilidade' | 'meio_ambiente' | 'fiscal' | 'servicos';
  sources: DataSource[];
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
  deduplicationKey: string;
};

export type AlertSubscription = {
  id: string;
  cityCode: string;
  categories: string[];
  channel: 'web_push' | 'rss' | 'email';
  emailHash?: string;
  createdAt: string;
  active: boolean;
};

// ── Module 2: Citizen Agent ───────────────────────────────────────────────────

export type AgentMode = 'orient' | 'verify' | 'rights';

export type MunicipalContext = {
  cityName: string;
  uf: string;
  population: number;
  region: string;
  complianceIndicators: ComplianceDimension[];
  activeAlerts: Alert[];
  availableServices: string[];
};

export type AgentMessage = {
  id: string;
  role: 'user' | 'agent';
  content: string;
  sources?: DataSource[];
  timestamp: string;
  handoff?: AgentHandoff;
};

export type AgentHandoff = {
  reason: string;
  suggestedChannel: string;
  url?: string;
};

export type AgentSession = {
  id: string;
  mode: AgentMode;
  context: MunicipalContext;
  messages: AgentMessage[];
  createdAt: string;
  consentToSave: boolean;
};

// ── Module 5: Demo Scenarios ──────────────────────────────────────────────────

export type DemoScenario = 'compliant' | 'active_alerts' | 'non_compliant';

export type DemoConfig = {
  scenario: DemoScenario;
  tourStep: number;
  totalSteps: number;
  presentationMode: boolean;
};
