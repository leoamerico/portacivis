/**
 * Module 5 — Demo scenarios and guided tour for Cidade Aurora.
 */
import type { DemoScenario, DemoConfig } from './types';

export const TOUR_STEPS = [
  { id: 'welcome', section: 'hero', icon: '🌆' },
  { id: 'stats', section: 'stats', icon: '📊' },
  { id: 'compliance', section: 'compliance', icon: '✅' },
  { id: 'alerts', section: 'alerts', icon: '🚨' },
  { id: 'agent', section: 'agent', icon: '🤖' },
  { id: 'provenance', section: 'provenance', icon: '🔍' },
  { id: 'services', section: 'servicos', icon: '💻' },
  { id: 'conclusion', section: 'conclusion', icon: '🎯' },
] as const;

export function getDefaultDemoConfig(): DemoConfig {
  return {
    scenario: 'compliant',
    tourStep: 0,
    totalSteps: TOUR_STEPS.length,
    presentationMode: false,
  };
}

export function getScenarioDescription(scenario: DemoScenario, locale: string): string {
  const descriptions: Record<string, Record<DemoScenario, string>> = {
    'pt-BR': {
      compliant: 'Cidade em plena conformidade — transparência ativa, relatórios em dia, cidadão atendido.',
      active_alerts: 'Cidade com alertas ativos — emergência de saúde e obras interditando vias.',
      non_compliant: 'Cidade com não conformidade fiscal — relatórios atrasados e portal desatualizado.',
    },
    'en-US': {
      compliant: 'City in full compliance — active transparency, reports up-to-date, citizens served.',
      active_alerts: 'City with active alerts — health emergency and road works.',
      non_compliant: 'City with fiscal non-compliance — late reports and outdated portal.',
    },
    'es-ES': {
      compliant: 'Ciudad en pleno cumplimiento — transparencia activa, informes al día, ciudadano atendido.',
      active_alerts: 'Ciudad con alertas activos — emergencia sanitaria y obras viales.',
      non_compliant: 'Ciudad con incumplimiento fiscal — informes atrasados y portal desactualizado.',
    },
  };
  return descriptions[locale]?.[scenario] ?? descriptions['pt-BR'][scenario];
}

export function buildDemoReportText(scenario: DemoScenario): string {
  const lines: string[] = [];
  lines.push('═'.repeat(60));
  lines.push('RELATÓRIO DE DEMONSTRAÇÃO — PortaCivis');
  lines.push('═'.repeat(60));
  lines.push('');
  lines.push('Município demonstrativo: Cidade Aurora — MG');
  lines.push(`Cenário: ${scenario}`);
  lines.push(`Data: ${new Date().toLocaleString('pt-BR')}`);
  lines.push('');
  lines.push('─'.repeat(60));
  lines.push('FUNCIONALIDADES DEMONSTRADAS');
  lines.push('─'.repeat(60));
  lines.push('  1. Trilha da Verdade Aumentada');
  lines.push('     - Card de proveniência de dados com hash de verificação');
  lines.push('     - Permalink de trilha para compartilhamento');
  lines.push('     - Alertas de desatualização de fontes');
  lines.push('     - Exportação de relatório cidadão');
  lines.push('');
  lines.push('  2. Agente Cidadão Contextual');
  lines.push('     - Modo "Me oriente" com contexto municipal');
  lines.push('     - Modo "Verifique isso" com contraste de fontes');
  lines.push('     - Modo "Onde está meu direito" por categoria');
  lines.push('     - Handoff explícito para canais oficiais');
  lines.push('');
  lines.push('  3. Mapa de Conformidade Municipal');
  lines.push('     - Score 0-100 por município');
  lines.push('     - Comparação lado a lado (até 5 cidades)');
  lines.push('     - Histórico de 12 meses');
  lines.push('     - Botão "Cobrar" com modelo LAI');
  lines.push('');
  lines.push('  4. Sistema de Alertas Inteligentes');
  lines.push('     - Classificação por severidade');
  lines.push('     - Assinatura por categoria e canal');
  lines.push('     - Deduplicação de fontes');
  lines.push('     - Alertas com prazo de validade');
  lines.push('');
  lines.push('  5. Modo Demo Cidade Aurora');
  lines.push('     - Toggle entre cenários');
  lines.push('     - Tour guiado passo a passo');
  lines.push('     - Relatório de demo para reuniões');
  lines.push('');
  lines.push('─'.repeat(60));
  lines.push('PortaCivis — Portal do Cidadão | EnvNeo');
  lines.push('─'.repeat(60));

  return lines.join('\n');
}
