'use client';

import {useState, useRef, useEffect, useMemo} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {SEARCH_INDEX, searchEntries, type SearchEntry} from '../../src/search/searchIndex';

type NavItem = {
  id: string;
  href: string;
  labelKey: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  {id: 'home', href: '/', labelKey: 'nav.backHome', icon: '🏠'},
  {id: 'trilha', href: '/trilha-da-verdade', labelKey: 'truthTrail.title', icon: '🔍'},
  {id: 'noticias', href: '/noticias', labelKey: 'nav.news', icon: '📰'},
  {id: 'agentes', href: '/agentes', labelKey: 'nav.agents', icon: '🤖'},
  {id: 'conformidade', href: '/conformidade', labelKey: 'nav.compliance', icon: '✅'},
  {id: 'aurora', href: '/cidade-aurora', labelKey: 'cidadeAurora.navLabel', icon: '🌆'},
];

export default function GlobalNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const titleMatches = searchEntries(query, SEARCH_INDEX);
    // Also match against i18n-resolved labels
    if (query.length >= 2) {
      const normalizedQuery = query.toLowerCase();
      const keywordResults = SEARCH_INDEX.filter((entry) => {
        if (titleMatches.includes(entry)) return false;
        const label = safeTranslate(t, entry.titleKey, entry.fallbackTitle);
        const desc = safeTranslate(t, entry.descriptionKey, entry.fallbackDescription);
        const searchable = `${label} ${desc}`.toLowerCase();
        return normalizedQuery.split(/\s+/).every((term) => searchable.includes(term));
      });
      return [...titleMatches, ...keywordResults].slice(0, 8);
    }
    return titleMatches.slice(0, 8);
  }, [query, t]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery('');
  }, [pathname]);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
      return;
    }
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
      if (target) {
        window.location.href = target.href;
      }
    }
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  function getLabel(item: NavItem) {
    return safeTranslate(t, item.labelKey, item.id);
  }

  return (
    <nav className="global-nav" aria-label={safeTranslate(t, 'globalNav.aria', 'Navegação principal')}>
      <div className="global-nav-inner">
        {/* Desktop links */}
        <ul className="global-nav-links" role="menubar">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} role="none">
              <Link
                href={item.href}
                role="menuitem"
                className={`global-nav-link ${isActive(item.href) ? 'global-nav-link--active' : ''}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="global-nav-link-icon" aria-hidden="true">{item.icon}</span>
                {getLabel(item)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search */}
        <div className="global-nav-search" ref={searchRef}>
          <input
            ref={inputRef}
            type="search"
            className="global-nav-search-input"
            placeholder={safeTranslate(t, 'globalNav.search.placeholder', 'Buscar...')}
            aria-label={safeTranslate(t, 'globalNav.search.placeholder', 'Buscar...')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(e.target.value.length >= 2);
            }}
            onFocus={() => {
              if (query.length >= 2) setSearchOpen(true);
            }}
            onKeyDown={handleSearchKeyDown}
            aria-expanded={searchOpen}
            aria-controls="global-nav-search-results"
            role="combobox"
            aria-autocomplete="list"
          />
          {searchOpen && results.length > 0 && (
            <ul id="global-nav-search-results" className="global-nav-search-results" role="listbox">
              {results.map((entry, i) => (
                <li
                  key={entry.id}
                  role="option"
                  aria-selected={i === selectedIndex}
                  className={`global-nav-search-result ${i === selectedIndex ? 'global-nav-search-result--selected' : ''}`}
                >
                  <Link href={entry.href} tabIndex={-1}>
                    <strong>{safeTranslate(t, entry.titleKey, entry.fallbackTitle)}</strong>
                    <span>{safeTranslate(t, entry.descriptionKey, entry.fallbackDescription)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {searchOpen && query.length >= 2 && results.length === 0 && (
            <div id="global-nav-search-results" className="global-nav-search-results global-nav-search-empty" role="status">
              {safeTranslate(t, 'globalNav.search.noResults', 'Nenhum resultado encontrado')}
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          type="button"
          className="global-nav-hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="global-nav-overlay"
          aria-label={menuOpen
            ? safeTranslate(t, 'globalNav.menu.close', 'Fechar menu')
            : safeTranslate(t, 'globalNav.menu.open', 'Abrir menu')
          }
        >
          <span className="global-nav-hamburger-bar" />
          <span className="global-nav-hamburger-bar" />
          <span className="global-nav-hamburger-bar" />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div id="global-nav-overlay" className="global-nav-overlay" role="dialog" aria-modal="true">
          <div className="global-nav-overlay-header">
            <button
              type="button"
              className="global-nav-overlay-close"
              onClick={() => setMenuOpen(false)}
              aria-label={safeTranslate(t, 'globalNav.menu.close', 'Fechar menu')}
            >
              ✕
            </button>
          </div>
          <ul className="global-nav-overlay-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`global-nav-overlay-link ${isActive(item.href) ? 'global-nav-overlay-link--active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {getLabel(item)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

function safeTranslate(
  t: ReturnType<typeof useTranslations>,
  key: string,
  fallback?: string,
): string {
  if (!key) return fallback ?? '';
  try {
    const result = t(key as Parameters<typeof t>[0]);
    return typeof result === 'string' ? result : (fallback ?? key);
  } catch {
    return fallback ?? key;
  }
}
