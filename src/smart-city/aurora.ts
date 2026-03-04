/**
 * Cidade Aurora — Ambiente Demonstrativo EnvNeo
 *
 * Prefeitura fictícia totalmente digitalizada para demonstração do ecossistema:
 *   Cidadão   → PortaCivis
 *   Gestão    → Govevia
 *   Especialistas → Env Live
 *   Orquestração  → EnvNeo Core
 *
 * Dados plausíveis mas inteiramente fictícios. Não representa nenhum município real.
 */

export const CIDADE_AURORA = {
  nome: 'Cidade Aurora',
  uf: 'MG',
  ufNome: 'Minas Gerais',
  populacao: 120_000,
  orcamentoAnual: 420_000_000,
  area: '843 km²',
  fundacao: '1932',
  prefeito: 'Maria Clara Fontes (Demo)',
  secretarias: 12,
  servicosDigitais: 84,
  descricao:
    'Cidade Aurora é o ambiente demonstrativo do ecossistema EnvNeo — uma prefeitura inteiramente digitalizada onde cidadãos, gestores e especialistas interagem em um modelo de governo transparente, auditável e orientado ao cidadão.'
} as const;

// ── Secretarias ───────────────────────────────────────────────────────────────

export type Secretaria = {
  id: string;
  nome: string;
  sigla: string;
  responsavel: string;
  orcamento: number;
  icon: string;
  servicosAtivos: number;
};

export const SECRETARIAS: Secretaria[] = [
  {id: 'sec-saude',          nome: 'Secretaria de Saúde',                   sigla: 'SESAU',  responsavel: 'Dr. Paulo Andrade',   orcamento: 84_000_000, icon: '🏥', servicosAtivos: 14},
  {id: 'sec-educacao',       nome: 'Secretaria de Educação',                sigla: 'SEMED',  responsavel: 'Profa. Lúcia Ramos',  orcamento: 76_000_000, icon: '🎓', servicosAtivos: 11},
  {id: 'sec-obras',          nome: 'Secretaria de Obras e Infraestrutura',  sigla: 'SEINF',  responsavel: 'Eng. Carlos Melo',    orcamento: 68_000_000, icon: '🏗', servicosAtivos: 9},
  {id: 'sec-financas',       nome: 'Secretaria de Finanças',                sigla: 'SEFIN',  responsavel: 'Ana Beatriz Torres',  orcamento: 32_000_000, icon: '💰', servicosAtivos: 8},
  {id: 'sec-meio-ambiente',  nome: 'Secretaria de Meio Ambiente',           sigla: 'SEMAM',  responsavel: 'Biol. Felipe Costa',  orcamento: 18_000_000, icon: '🌳', servicosAtivos: 7},
  {id: 'sec-mobilidade',     nome: 'Secretaria de Mobilidade Urbana',       sigla: 'SEMOB',  responsavel: 'Eng. Sara Lima',      orcamento: 24_000_000, icon: '🚌', servicosAtivos: 6},
  {id: 'sec-assistencia',    nome: 'Secretaria de Assistência Social',      sigla: 'SEAS',   responsavel: 'Maria José Nunes',    orcamento: 22_000_000, icon: '🤝', servicosAtivos: 10},
  {id: 'sec-cultura',        nome: 'Secretaria de Cultura e Turismo',       sigla: 'SECULT', responsavel: 'Renato Carvalho',     orcamento: 12_000_000, icon: '🎭', servicosAtivos: 5},
  {id: 'sec-governanca',     nome: 'Secretaria de Governança Digital',      sigla: 'SEGOV',  responsavel: 'Dra. Carla Vieira',   orcamento: 16_000_000, icon: '💻', servicosAtivos: 8},
  {id: 'sec-seguranca',      nome: 'Secretaria de Segurança Pública',       sigla: 'SESEG',  responsavel: 'Cel. Marcos Souza',   orcamento: 28_000_000, icon: '🛡', servicosAtivos: 4},
  {id: 'sec-esportes',       nome: 'Secretaria de Esportes e Lazer',        sigla: 'SELAR',  responsavel: 'Pedro Almeida',       orcamento: 8_000_000,  icon: '⚽', servicosAtivos: 3},
  {id: 'sec-planejamento',   nome: 'Secretaria de Planejamento Urbano',     sigla: 'SEPLAN', responsavel: 'Arq. Joana Ferreira', orcamento: 32_000_000, icon: '📐', servicosAtivos: 4}
];

// ── Serviços simulados ────────────────────────────────────────────────────────

export type StatusServico = 'disponivel' | 'em-breve' | 'manutencao';

export type Servico = {
  id: string;
  nome: string;
  descricao: string;
  secretariaId: string;
  icon: string;
  status: StatusServico;
  tempoMedioResposta: string;
  canal: 'digital' | 'presencial' | 'ambos';
};

export const SERVICOS: Servico[] = [
  {id: 'srv-consulta-medica',      nome: 'Agendamento de consulta médica',        descricao: 'Agende consultas nas UBSs de Cidade Aurora via portal.',                           secretariaId: 'sec-saude',         icon: '📅', status: 'disponivel',  tempoMedioResposta: '1 dia útil',   canal: 'digital'},
  {id: 'srv-poda-arvore',           nome: 'Solicitação de poda de árvore',          descricao: 'Solicite poda ou remoção de árvores em vias públicas.',                           secretariaId: 'sec-meio-ambiente', icon: '🌳', status: 'disponivel',  tempoMedioResposta: '5 dias úteis', canal: 'digital'},
  {id: 'srv-iluminacao',            nome: 'Reclamação de iluminação pública',        descricao: 'Informe pontos de iluminação com defeito ou apagados.',                           secretariaId: 'sec-obras',         icon: '💡', status: 'disponivel',  tempoMedioResposta: '3 dias úteis', canal: 'digital'},
  {id: 'srv-iptu',                  nome: 'Consulta e emissão de IPTU',              descricao: 'Consulte débitos, emita boleto e obtenha certidões de IPTU.',                     secretariaId: 'sec-financas',      icon: '🏘', status: 'disponivel',  tempoMedioResposta: 'Imediato',     canal: 'digital'},
  {id: 'srv-certidao',              nome: 'Certidão de tributos municipais',         descricao: 'Emita certidão negativa de débitos municipais.',                                   secretariaId: 'sec-financas',      icon: '📄', status: 'disponivel',  tempoMedioResposta: 'Imediato',     canal: 'digital'},
  {id: 'srv-lai',                   nome: 'Pedido de informação (LAI)',               descricao: 'Protocole solicitações de acesso à informação pública (Lei 12.527).',             secretariaId: 'sec-governanca',    icon: '📬', status: 'disponivel',  tempoMedioResposta: '20 dias úteis',canal: 'digital'},
  {id: 'srv-matricula-escolar',     nome: 'Matrícula escolar online',                descricao: 'Realize matrícula em escolas municipais de Cidade Aurora.',                       secretariaId: 'sec-educacao',      icon: '✏️', status: 'disponivel',  tempoMedioResposta: '2 dias úteis', canal: 'digital'},
  {id: 'srv-creche',                nome: 'Inscrição em creche municipal',            descricao: 'Inscreva seu filho na fila de espera das creches municipais.',                    secretariaId: 'sec-educacao',      icon: '👶', status: 'disponivel',  tempoMedioResposta: '5 dias úteis', canal: 'digital'},
  {id: 'srv-obra-publica',          nome: 'Acompanhamento de obra pública',           descricao: 'Acompanhe o status e cronograma das obras em andamento na cidade.',              secretariaId: 'sec-obras',         icon: '🏗', status: 'disponivel',  tempoMedioResposta: 'Tempo real',   canal: 'digital'},
  {id: 'srv-pavimentacao',          nome: 'Solicitação de pavimentação',              descricao: 'Solicite pavimentação ou recapeamento de vias do seu bairro.',                   secretariaId: 'sec-obras',         icon: '🛣', status: 'disponivel',  tempoMedioResposta: '10 dias úteis',canal: 'digital'},
  {id: 'srv-transporte-escolar',    nome: 'Transporte escolar gratuito',              descricao: 'Cadastre alunos para uso do transporte escolar municipal.',                       secretariaId: 'sec-mobilidade',    icon: '🚌', status: 'disponivel',  tempoMedioResposta: '3 dias úteis', canal: 'ambos'},
  {id: 'srv-cras',                  nome: 'Atendimento CRAS',                         descricao: 'Agende atendimento no Centro de Referência de Assistência Social.',              secretariaId: 'sec-assistencia',   icon: '🤝', status: 'disponivel',  tempoMedioResposta: '1 dia útil',   canal: 'ambos'},
  {id: 'srv-alvara-funcio',         nome: 'Solicitação de alvará de funcionamento',   descricao: 'Protocole pedido de alvará para abertura de negócio no município.',              secretariaId: 'sec-governanca',    icon: '🏪', status: 'disponivel',  tempoMedioResposta: '15 dias úteis',canal: 'digital'},
  {id: 'srv-licenca-ambiental',     nome: 'Licença ambiental simplificada',           descricao: 'Solicite licença ambiental para atividades de baixo impacto.',                   secretariaId: 'sec-meio-ambiente', icon: '🌿', status: 'disponivel',  tempoMedioResposta: '20 dias úteis',canal: 'digital'},
  {id: 'srv-alerta-enchente',       nome: 'Alerta de áreas de risco',                 descricao: 'Consulte mapa de áreas de risco e alertas de enchente em tempo real.',           secretariaId: 'sec-seguranca',     icon: '⚠️', status: 'disponivel',  tempoMedioResposta: 'Tempo real',   canal: 'digital'},
  {id: 'srv-bikeaurora',            nome: 'Bicicleta pública Bike Aurora',             descricao: 'Cadastre-se no sistema de bicicletas compartilhadas de Cidade Aurora.',          secretariaId: 'sec-mobilidade',    icon: '🚲', status: 'em-breve',    tempoMedioResposta: '—',            canal: 'digital'},
  {id: 'srv-passe-livre',           nome: 'Passe livre transporte coletivo',           descricao: 'Solicite benefício de passe livre para pessoas com deficiência e idosos.',       secretariaId: 'sec-mobilidade',    icon: '🪪', status: 'disponivel',  tempoMedioResposta: '5 dias úteis', canal: 'ambos'},
  {id: 'srv-esporte-lazer',         nome: 'Inscrição em programas esportivos',         descricao: 'Inscreva-se em projetos esportivos e de lazer das praças e ginásios.',           secretariaId: 'sec-esportes',      icon: '🏊', status: 'disponivel',  tempoMedioResposta: '1 dia útil',   canal: 'digital'},
  {id: 'srv-wifi-publico',          nome: 'Acesso ao Wi-Fi público',                   descricao: 'Consulte pontos de Wi-Fi gratuito e cadastre-se para acesso.',                   secretariaId: 'sec-governanca',    icon: '📶', status: 'em-breve',    tempoMedioResposta: '—',            canal: 'digital'},
  {id: 'srv-denuncia',              nome: 'Canal de denúncia anônima',                 descricao: 'Registre denúncias sobre irregularidades públicas com sigilo garantido.',        secretariaId: 'sec-governanca',    icon: '🔒', status: 'disponivel',  tempoMedioResposta: '3 dias úteis', canal: 'digital'}
];

// ── Contratos vigentes ────────────────────────────────────────────────────────

export type StatusContrato = 'vigente' | 'encerrado' | 'suspenso';

export type Contrato = {
  id: string;
  numero: string;
  objeto: string;
  fornecedor: string;
  valor: number;
  inicioVigencia: string;
  fimVigencia: string;
  secretariaId: string;
  status: StatusContrato;
  modalidade: string;
};

export const CONTRATOS: Contrato[] = [
  {id: 'ct-001', numero: '001/2025', objeto: 'Fornecimento de medicamentos básicos para UBSs',          fornecedor: 'FarmaMed Distribuidora',         valor: 3_200_000, inicioVigencia: '2025-01-15', fimVigencia: '2025-12-31', secretariaId: 'sec-saude',        status: 'vigente',   modalidade: 'Pregão Eletrônico'},
  {id: 'ct-002', numero: '002/2025', objeto: 'Serviços de coleta e destinação de resíduos sólidos',     fornecedor: 'Eco Aurora Saneamento Ltda',      valor: 5_800_000, inicioVigencia: '2025-02-01', fimVigencia: '2026-01-31', secretariaId: 'sec-meio-ambiente',status: 'vigente',   modalidade: 'Concorrência'},
  {id: 'ct-003', numero: '003/2025', objeto: 'Recape asfáltico de 42 km de vias municipais',             fornecedor: 'Construtora Vias Aurora S/A',     valor: 8_400_000, inicioVigencia: '2025-03-10', fimVigencia: '2025-09-10', secretariaId: 'sec-obras',        status: 'vigente',   modalidade: 'Concorrência'},
  {id: 'ct-004', numero: '004/2025', objeto: 'Aquisição de 15 ônibus para transporte escolar',           fornecedor: 'Transportes Horizonte Ltda',      valor: 4_500_000, inicioVigencia: '2025-04-01', fimVigencia: '2026-03-31', secretariaId: 'sec-mobilidade',   status: 'vigente',   modalidade: 'Pregão Eletrônico'},
  {id: 'ct-005', numero: '005/2025', objeto: 'Implantação do sistema de gestão integrada (Govevia)',     fornecedor: 'EnvNeo Tecnologia Governamental',  valor: 1_200_000, inicioVigencia: '2025-05-01', fimVigencia: '2027-04-30', secretariaId: 'sec-governanca',   status: 'vigente',   modalidade: 'Dispensa'},
  {id: 'ct-006', numero: '006/2025', objeto: 'Manutenção de 3.200 pontos de iluminação pública LED',     fornecedor: 'IlumiBrasil Engenharia Ltda',     valor: 2_100_000, inicioVigencia: '2025-06-01', fimVigencia: '2026-05-31', secretariaId: 'sec-obras',        status: 'vigente',   modalidade: 'Pregão Eletrônico'},
  {id: 'ct-007', numero: '007/2025', objeto: 'Construção de 2 novas UBSs nos bairros Norte e Leste',    fornecedor: 'Engecivil Construções Ltda',      valor: 6_800_000, inicioVigencia: '2025-07-01', fimVigencia: '2026-06-30', secretariaId: 'sec-saude',        status: 'vigente',   modalidade: 'Concorrência'},
  {id: 'ct-008', numero: '008/2024', objeto: 'Fornecimento de merenda escolar para 18.000 alunos',       fornecedor: 'NutriAurora Alimentos Ltda',      valor: 4_200_000, inicioVigencia: '2024-02-01', fimVigencia: '2024-12-31', secretariaId: 'sec-educacao',     status: 'encerrado', modalidade: 'Pregão Eletrônico'},
  {id: 'ct-009', numero: '009/2025', objeto: 'Serviços de segurança patrimonial em prédios públicos',    fornecedor: 'VigilarPro Serviços de Segurança',valor: 1_800_000, inicioVigencia: '2025-01-01', fimVigencia: '2025-12-31', secretariaId: 'sec-seguranca',    status: 'vigente',   modalidade: 'Pregão Eletrônico'},
  {id: 'ct-010', numero: '010/2025', objeto: 'Reforma e ampliação do Centro Cultural Aurorense',         fornecedor: 'ConstruArt Reformas e Obras',     valor: 3_600_000, inicioVigencia: '2025-08-01', fimVigencia: '2026-07-31', secretariaId: 'sec-cultura',      status: 'vigente',   modalidade: 'Tomada de Preços'}
];

// ── Obras em andamento ────────────────────────────────────────────────────────

export type StatusObra = 'em-execucao' | 'concluida' | 'paralisada' | 'licitacao';

export type Obra = {
  id: string;
  nome: string;
  descricao: string;
  bairro: string;
  secretariaId: string;
  valor: number;
  percentualConcluido: number;
  previsaoTermino: string;
  status: StatusObra;
  icon: string;
};

export const OBRAS: Obra[] = [
  {id: 'ob-001', nome: 'Recape Av. das Flores',          descricao: 'Recapeamento asfáltico de 4,2 km da principal avenida do centro.',              bairro: 'Centro',         secretariaId: 'sec-obras',       valor: 1_200_000, percentualConcluido: 67, previsaoTermino: '2026-04-30', status: 'em-execucao', icon: '🛣'},
  {id: 'ob-002', nome: 'UBS Bairro Norte',                descricao: 'Construção da nova Unidade Básica de Saúde no Bairro Norte.',                   bairro: 'Bairro Norte',   secretariaId: 'sec-saude',       valor: 3_400_000, percentualConcluido: 42, previsaoTermino: '2026-08-15', status: 'em-execucao', icon: '🏥'},
  {id: 'ob-003', nome: 'Praça Digital Aurora',            descricao: 'Revitalização da praça central com Wi-Fi gratuito e totem de serviços.',         bairro: 'Centro',         secretariaId: 'sec-governanca',  valor: 820_000,   percentualConcluido: 88, previsaoTermino: '2026-05-10', status: 'em-execucao', icon: '📶'},
  {id: 'ob-004', nome: 'Ciclovia Beira-Rio',              descricao: 'Implantação de 8 km de ciclovia ao longo do Rio Aurora.',                       bairro: 'Zona Sul',       secretariaId: 'sec-mobilidade',  valor: 1_800_000, percentualConcluido: 25, previsaoTermino: '2026-09-30', status: 'em-execucao', icon: '🚲'},
  {id: 'ob-005', nome: 'Quadra Poliesportiva Leste',      descricao: 'Construção de quadra coberta no complexo esportivo do Bairro Leste.',             bairro: 'Bairro Leste',   secretariaId: 'sec-esportes',    valor: 650_000,   percentualConcluido: 100,previsaoTermino: '2025-11-30', status: 'concluida',   icon: '🏟'},
  {id: 'ob-006', nome: 'Centro Cultural Aurorense',       descricao: 'Reforma e ampliação do centro cultural histórico da cidade.',                    bairro: 'Centro Histórico',secretariaId: 'sec-cultura',     valor: 3_600_000, percentualConcluido: 18, previsaoTermino: '2026-07-31', status: 'em-execucao', icon: '🎭'},
  {id: 'ob-007', nome: 'Reurbanização Fav. Santa Luzia',  descricao: 'Reurbanização com drenagem, pavimentação e habitação para 340 famílias.',        bairro: 'Santa Luzia',    secretariaId: 'sec-obras',       valor: 12_000_000,percentualConcluido: 8,  previsaoTermino: '2027-06-30', status: 'licitacao',   icon: '🏘'}
];

// ── Indicadores de gestão ────────────────────────────────────────────────────

export type Indicador = {
  id: string;
  nome: string;
  valor: string;
  tendencia: 'alta' | 'baixa' | 'estavel';
  icon: string;
  descricao: string;
};

export const INDICADORES: Indicador[] = [
  {id: 'ind-transparencia',    nome: 'Índice de Transparência',    valor: '94/100', tendencia: 'alta',    icon: '📊', descricao: 'Portal de transparência avaliado pelo TCU — 1º lugar entre municípios de 100-200k hab. de MG.'},
  {id: 'ind-satisfacao',       nome: 'Satisfação do Cidadão',      valor: '87%',    tendencia: 'alta',    icon: '⭐', descricao: 'Pesquisa trimestral com 2.400 munícipes sobre qualidade dos serviços públicos digitais.'},
  {id: 'ind-digitalizacao',    nome: 'Serviços 100% Digitais',     valor: '74%',    tendencia: 'alta',    icon: '💻', descricao: '74% dos serviços municipais disponíveis integralmente via portal e app, sem necessidade de presença física.'},
  {id: 'ind-lgpd',             nome: 'Conformidade LGPD',          valor: '100%',   tendencia: 'estavel', icon: '🔒', descricao: 'Cidade Aurora cumpre integralmente os requisitos da Lei Geral de Proteção de Dados no âmbito municipal.'},
  {id: 'ind-orcamento',        nome: 'Execução Orçamentária',      valor: '91%',    tendencia: 'estavel', icon: '💰', descricao: 'Percentual do orçamento anual executado — acima da média estadual de 84%.'},
  {id: 'ind-response-time',    nome: 'Tempo Médio de Resposta',    valor: '2,4 dias', tendencia: 'baixa', icon: '⚡', descricao: 'Tempo médio de resposta a solicitações cidadãs via portal — meta: 3 dias úteis.'}
];

// ── Orçamento por secretaria ─────────────────────────────────────────────────

export function getOrcamentoTotal(): number {
  return SECRETARIAS.reduce((acc, s) => acc + s.orcamento, 0);
}

export function getSecretariaById(id: string): Secretaria | undefined {
  return SECRETARIAS.find((s) => s.id === id);
}

export function getServicosBySecretaria(secretariaId: string): Servico[] {
  return SERVICOS.filter((s) => s.secretariaId === secretariaId);
}
