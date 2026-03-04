'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { Alert, AlertSubscription } from '../../src/transparency/types';
import {
  getSeverityIcon,
  deduplicateAlerts,
  partitionAlerts,
  getSubscriptions,
  saveSubscription,
  removeSubscription,
  buildRssUrl,
  getDemoAlerts,
} from '../../src/transparency/alerts';

const CATEGORIES = [
  { id: 'saude', icon: '🏥' },
  { id: 'educacao', icon: '🎓' },
  { id: 'seguranca', icon: '🛡' },
  { id: 'mobilidade', icon: '🚌' },
  { id: 'meio_ambiente', icon: '🌳' },
  { id: 'fiscal', icon: '💰' },
  { id: 'servicos', icon: '💻' },
] as const;

export default function AlertsPanel() {
  const t = useTranslations('alertsPanel');
  const rawAlerts = useMemo(() => getDemoAlerts(), []);
  const deduplicated = useMemo(() => deduplicateAlerts(rawAlerts), [rawAlerts]);
  const { active, expired } = useMemo(() => partitionAlerts(deduplicated), [deduplicated]);

  const [showExpired, setShowExpired] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [subChannel, setSubChannel] = useState<'web_push' | 'rss' | 'email'>('web_push');
  const [subEmail, setSubEmail] = useState('');
  const [subscriptions, setSubscriptions] = useState<AlertSubscription[]>(() => getSubscriptions());

  const filteredActive = useMemo(
    () => filterCategory ? active.filter(a => a.category === filterCategory) : active,
    [active, filterCategory]
  );

  const handleSubscribe = useCallback(() => {
    const sub: AlertSubscription = {
      id: `sub-${Date.now()}`,
      cityCode: 'aurora-mg',
      categories: subCategories.length > 0 ? subCategories : CATEGORIES.map(c => c.id),
      channel: subChannel,
      emailHash: subEmail ? btoa(subEmail) : undefined,
      createdAt: new Date().toISOString(),
      active: true,
    };
    saveSubscription(sub);
    setSubscriptions(prev => [...prev, sub]);
    setSubscribeOpen(false);
    setSubCategories([]);
    setSubEmail('');
  }, [subCategories, subChannel, subEmail]);

  const handleUnsubscribe = useCallback((id: string) => {
    removeSubscription(id);
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <div className="alerts-panel" role="region" aria-label={t('title')}>
      <div className="alerts-panel-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      {/* Category filter */}
      <div className="alerts-filter" role="group" aria-label={t('filterLabel')}>
        <button
          type="button"
          className={`alerts-filter-chip ${!filterCategory ? 'alerts-filter-chip--active' : ''}`}
          onClick={() => setFilterCategory('')}
        >
          {t('allCategories')}
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`alerts-filter-chip ${filterCategory === cat.id ? 'alerts-filter-chip--active' : ''}`}
            onClick={() => setFilterCategory(filterCategory === cat.id ? '' : cat.id)}
          >
            {cat.icon} {t(`categories.${cat.id}`)}
          </button>
        ))}
      </div>

      {/* Active alerts */}
      <div className="alerts-list" role="list" aria-label={t('activeAlerts')}>
        {filteredActive.length === 0 && (
          <p className="alerts-empty">{t('noAlerts')}</p>
        )}
        {filteredActive.map(alert => (
          <AlertCard key={alert.id} alert={alert} t={t} />
        ))}
      </div>

      {/* Expired alerts toggle */}
      {expired.length > 0 && (
        <div className="alerts-expired-section">
          <button
            type="button"
            className="alerts-expired-toggle"
            onClick={() => setShowExpired(!showExpired)}
            aria-expanded={showExpired}
          >
            {showExpired ? t('hideExpired') : t('showExpired', { count: expired.length })}
          </button>
          {showExpired && (
            <div className="alerts-list alerts-list--expired" role="list" aria-label={t('expiredAlerts')}>
              {expired.map(alert => (
                <AlertCard key={alert.id} alert={alert} t={t} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subscribe section */}
      <div className="alerts-subscribe-section">
        <button
          type="button"
          className="alerts-subscribe-btn"
          onClick={() => setSubscribeOpen(!subscribeOpen)}
        >
          {t('subscribeBtn')}
        </button>

        {subscribeOpen && (
          <div className="alerts-subscribe-form" role="form" aria-label={t('subscribeTitle')}>
            <h3>{t('subscribeTitle')}</h3>

            <fieldset>
              <legend>{t('selectCategories')}</legend>
              {CATEGORIES.map(cat => (
                <label key={cat.id} className="alerts-sub-cat">
                  <input
                    type="checkbox"
                    checked={subCategories.includes(cat.id)}
                    onChange={e => {
                      setSubCategories(prev =>
                        e.target.checked ? [...prev, cat.id] : prev.filter(c => c !== cat.id)
                      );
                    }}
                  />
                  {cat.icon} {t(`categories.${cat.id}`)}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>{t('selectChannel')}</legend>
              <label className="alerts-sub-channel">
                <input
                  type="radio"
                  name="channel"
                  value="web_push"
                  checked={subChannel === 'web_push'}
                  onChange={() => setSubChannel('web_push')}
                />
                {t('channelWebPush')}
              </label>
              <label className="alerts-sub-channel">
                <input
                  type="radio"
                  name="channel"
                  value="rss"
                  checked={subChannel === 'rss'}
                  onChange={() => setSubChannel('rss')}
                />
                {t('channelRss')}
              </label>
              <label className="alerts-sub-channel">
                <input
                  type="radio"
                  name="channel"
                  value="email"
                  checked={subChannel === 'email'}
                  onChange={() => setSubChannel('email')}
                />
                {t('channelEmail')}
              </label>
            </fieldset>

            {subChannel === 'email' && (
              <label className="alerts-sub-email">
                {t('emailLabel')}
                <input
                  type="email"
                  value={subEmail}
                  onChange={e => setSubEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                />
              </label>
            )}

            {subChannel === 'rss' && (
              <p className="alerts-rss-info">
                RSS: <code>{buildRssUrl('aurora-mg', subCategories)}</code>
              </p>
            )}

            <button
              type="button"
              className="alerts-subscribe-confirm"
              onClick={handleSubscribe}
              disabled={subChannel === 'email' && !subEmail}
            >
              {t('confirmSubscribe')}
            </button>
          </div>
        )}

        {/* Active subscriptions */}
        {subscriptions.length > 0 && (
          <div className="alerts-active-subs">
            <h4>{t('activeSubscriptions')}</h4>
            {subscriptions.map(sub => (
              <div key={sub.id} className="alerts-sub-item">
                <span>{t(`channel_${sub.channel}`)} — {sub.categories.length} {t('categoriesLabel')}</span>
                <button
                  type="button"
                  className="alerts-unsub-btn"
                  onClick={() => handleUnsubscribe(sub.id)}
                  aria-label={t('unsubscribe')}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Alert card sub-component ──────────────────────────────────────────────────

function AlertCard({ alert, t }: { alert: Alert; t: ReturnType<typeof useTranslations> }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`alert-card alert-card--${alert.severity} ${alert.isExpired ? 'alert-card--expired' : ''}`}
      role="listitem"
    >
      <div className="alert-card-header">
        <span className="alert-card-severity" aria-label={alert.severity}>
          {getSeverityIcon(alert.severity)}
        </span>
        <div className="alert-card-title-wrap">
          <h3 className="alert-card-title">{alert.title}</h3>
          <span className="alert-card-meta">
            {alert.cityName} · {new Date(alert.createdAt).toLocaleDateString('pt-BR')}
            {alert.isExpired && <span className="alert-card-expired-badge">{t('expired')}</span>}
          </span>
        </div>
      </div>
      <p className="alert-card-desc">{alert.description}</p>

      <button
        type="button"
        className="alert-card-expand"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? t('hideSources') : t('showSources', { count: alert.sources.length })}
      </button>

      {expanded && (
        <div className="alert-card-sources">
          <h4>{t('confirmedSources')}</h4>
          <ul>
            {alert.sources.map(source => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.name} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="alert-card-expires">
            {alert.isExpired
              ? t('expiredOn', { date: new Date(alert.expiresAt).toLocaleDateString('pt-BR') })
              : t('validUntil', { date: new Date(alert.expiresAt).toLocaleDateString('pt-BR') })
            }
          </p>
        </div>
      )}
    </article>
  );
}
