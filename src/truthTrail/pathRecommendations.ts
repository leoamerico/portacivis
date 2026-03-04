export type TruthTrailQuickPath = {
  id: 'news' | 'compliance' | 'agents' | 'verify' | 'restart';
  href: string;
  priority: number;
  recommended: boolean;
};

type Input = {
  hasTerritory: boolean;
  uf: string;
  cidade: string;
};

function withTerritory(baseHref: string, uf: string, cidade: string) {
  if (!uf || !cidade) {
    return baseHref;
  }

  const separator = baseHref.includes('?') ? '&' : '?';
  return `${baseHref}${separator}uf=${encodeURIComponent(uf)}&cidade=${encodeURIComponent(cidade)}`;
}

export function buildTruthTrailQuickPaths({hasTerritory, uf, cidade}: Input): TruthTrailQuickPath[] {
  if (!hasTerritory) {
    return [
      {id: 'restart', href: '/', priority: 1, recommended: true},
      {id: 'compliance', href: '/conformidade', priority: 2, recommended: false},
      {id: 'agents', href: '/agentes', priority: 3, recommended: false}
    ];
  }

  return [
    {
      id: 'news',
      href: withTerritory('/noticias', uf, cidade),
      priority: 1,
      recommended: true
    },
    {id: 'verify', href: '/verificacao-auditoria', priority: 2, recommended: false},
    {id: 'agents', href: '/agentes', priority: 3, recommended: false},
    {id: 'compliance', href: '/conformidade', priority: 4, recommended: false}
  ];
}
