'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { AgentMode, AgentMessage, AgentSession, MunicipalContext } from '../../src/transparency/types';

type Props = {
  cityName: string;
  uf: string;
  population: number;
  region: string;
};

const MODES: { id: AgentMode; icon: string }[] = [
  { id: 'orient', icon: '🧭' },
  { id: 'verify', icon: '🔍' },
  { id: 'rights', icon: '⚖️' },
];

const RIGHTS_CATEGORIES = ['saude', 'educacao', 'habitacao', 'mobilidade'] as const;

export default function CitizenAgentPanel({ cityName, uf, population, region }: Props) {
  const t = useTranslations('citizenAgent');
  const [mode, setMode] = useState<AgentMode>('orient');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [consentToSave, setConsentToSave] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAgentMessage = useCallback((content: string, sources?: AgentMessage['sources'], handoff?: AgentMessage['handoff']) => {
    const msg: AgentMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'agent',
      content,
      sources,
      handoff,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  const handleModeChange = useCallback((newMode: AgentMode) => {
    setMode(newMode);
    setMessages([]);
    setInput('');
    setSelectedCategory('');
  }, []);

  const simulateResponse = useCallback((userMessage: string) => {
    setProcessing(true);
    setTimeout(() => {
      if (mode === 'orient') {
        addAgentMessage(
          t('orientResponse', { city: cityName, uf }),
          [
            { id: 'src-cras', name: 'CRAS Municipal', url: '#', type: 'outro' },
            { id: 'src-portal', name: `Portal de ${cityName}`, url: '#', type: 'portal_transparencia' },
          ]
        );
      } else if (mode === 'verify') {
        addAgentMessage(
          t('verifyResponse', { city: cityName }),
          [
            { id: 'src-ibge', name: 'IBGE', url: 'https://cidades.ibge.gov.br', type: 'ibge' },
            { id: 'src-tcu', name: 'TCU', url: 'https://portal.tcu.gov.br', type: 'tcu' },
          ]
        );
      } else if (mode === 'rights') {
        const category = selectedCategory || 'saude';
        addAgentMessage(
          t('rightsResponse', { city: cityName, category: t(`rightsCategories.${category}`) }),
          [{ id: 'src-lac', name: 'Lei de Acesso à Informação', url: '#', type: 'lai' }],
          {
            reason: t('handoffReason'),
            suggestedChannel: t('handoffChannel', { city: cityName }),
            url: `https://ouvidoria.${cityName.toLowerCase().replace(/\s+/g, '')}.${uf.toLowerCase()}.gov.br`,
          }
        );
      }
      setProcessing(false);
    }, 1200);
  }, [mode, cityName, uf, selectedCategory, addAgentMessage, t]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text && mode !== 'rights') return;

    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: mode === 'rights' ? t(`rightsCategories.${selectedCategory || 'saude'}`) : text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    simulateResponse(text);
  }, [input, mode, selectedCategory, simulateResponse, t]);

  const handleExportSession = useCallback(() => {
    const session: AgentSession = {
      id: `session-${Date.now()}`,
      mode,
      context: {
        cityName, uf, population, region,
        complianceIndicators: [],
        activeAlerts: [],
        availableServices: [],
      },
      messages,
      createdAt: messages[0]?.timestamp ?? new Date().toISOString(),
      consentToSave,
    };

    const lines: string[] = [];
    lines.push(`=== Sessão do Agente Cidadão ===`);
    lines.push(`Município: ${cityName} — ${uf}`);
    lines.push(`Modo: ${mode}`);
    lines.push(`Data: ${new Date().toLocaleString('pt-BR')}`);
    lines.push('');
    for (const msg of session.messages) {
      lines.push(`[${msg.role === 'user' ? 'Cidadão' : 'Agente'}] ${new Date(msg.timestamp).toLocaleTimeString('pt-BR')}`);
      lines.push(msg.content);
      if (msg.sources) {
        lines.push(`Fontes: ${msg.sources.map(s => s.name).join(', ')}`);
      }
      if (msg.handoff) {
        lines.push(`⚠ ${msg.handoff.reason}`);
        lines.push(`Canal sugerido: ${msg.handoff.suggestedChannel}`);
      }
      lines.push('');
    }
    lines.push('Gerado pelo PortaCivis — Portal do Cidadão.');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessao-agente-${cityName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [mode, cityName, uf, population, region, messages, consentToSave]);

  return (
    <div className="citizen-agent" role="region" aria-label={t('title')}>
      <div className="citizen-agent-header">
        <h2>{t('title')}</h2>
        <p>{t('description', { city: cityName, uf })}</p>
        <div className="citizen-agent-context">
          <span>{cityName} — {uf}</span>
          <span>{population.toLocaleString('pt-BR')} hab.</span>
          <span>{region}</span>
        </div>
      </div>

      {/* Mode selector */}
      <div className="citizen-agent-modes" role="tablist" aria-label={t('modeLabel')}>
        {MODES.map(m => (
          <button
            key={m.id}
            type="button"
            role="tab"
            className={`citizen-agent-mode ${mode === m.id ? 'citizen-agent-mode--active' : ''}`}
            onClick={() => handleModeChange(m.id)}
            aria-selected={mode === m.id}
            aria-controls={`agent-panel-${m.id}`}
          >
            <span aria-hidden="true">{m.icon}</span>
            {t(`modes.${m.id}`)}
          </button>
        ))}
      </div>

      {/* Mode description */}
      <div
        id={`agent-panel-${mode}`}
        className={`citizen-agent-panel citizen-agent-panel--${mode}`}
        role="tabpanel"
      >
        <p className="citizen-agent-mode-desc">{t(`modeDesc.${mode}`)}</p>

        {/* Rights category selector */}
        {mode === 'rights' && (
          <div className="citizen-agent-categories" role="group" aria-label={t('selectCategory')}>
            {RIGHTS_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`citizen-agent-cat ${selectedCategory === cat ? 'citizen-agent-cat--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {t(`rightsCategories.${cat}`)}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="citizen-agent-messages" role="log" aria-label={t('conversationLog')}>
          {messages.length === 0 && (
            <p className="citizen-agent-empty">{t('startPrompt')}</p>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`citizen-agent-msg citizen-agent-msg--${msg.role}`}>
              <div className="citizen-agent-msg-header">
                <strong>{msg.role === 'user' ? t('you') : t('agent')}</strong>
                <time dateTime={msg.timestamp}>{new Date(msg.timestamp).toLocaleTimeString('pt-BR')}</time>
              </div>
              <p>{msg.content}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="citizen-agent-sources">
                  <small>{t('sourcesLabel')}</small>
                  <ul>
                    {msg.sources.map(s => (
                      <li key={s.id}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {msg.handoff && (
                <div className="citizen-agent-handoff" role="alert">
                  <p><strong>{t('handoffTitle')}</strong></p>
                  <p>{msg.handoff.reason}</p>
                  <p>{msg.handoff.suggestedChannel}</p>
                  {msg.handoff.url && (
                    <a href={msg.handoff.url} target="_blank" rel="noopener noreferrer">
                      {t('handoffLink')} ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
          {processing && (
            <div className="citizen-agent-msg citizen-agent-msg--agent citizen-agent-msg--loading">
              <span aria-label={t('thinking')}>{t('thinking')}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="citizen-agent-input" onSubmit={handleSubmit}>
          {mode === 'rights' ? (
            <button
              type="submit"
              className="citizen-agent-submit"
              disabled={processing || !selectedCategory}
            >
              {t('rightsSubmit')}
            </button>
          ) : (
            <>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={t(`inputPlaceholder.${mode}`)}
                disabled={processing}
                aria-label={t('inputLabel')}
              />
              <button
                type="submit"
                className="citizen-agent-submit"
                disabled={processing || !input.trim()}
              >
                {t('send')}
              </button>
            </>
          )}
        </form>

        {/* Session export */}
        {messages.length > 0 && (
          <div className="citizen-agent-export">
            <label className="citizen-agent-consent">
              <input
                type="checkbox"
                checked={consentToSave}
                onChange={e => setConsentToSave(e.target.checked)}
              />
              {t('consentLabel')}
            </label>
            {consentToSave && (
              <button
                type="button"
                className="citizen-agent-export-btn"
                onClick={handleExportSession}
              >
                {t('exportSession')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
