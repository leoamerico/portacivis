import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

type QuickNavItem = {
  id: string;
  href: string;
  labelKey: string;
  icon: string;
  variant?: string;
};

const ITEMS: QuickNavItem[] = [
  {id: 'trilha', href: '/trilha-da-verdade', labelKey: 'truthTrail.title', icon: '🔍'},
  {id: 'noticias', href: '/noticias', labelKey: 'nav.news', icon: '📰'},
  {id: 'agentes', href: '/agentes', labelKey: 'nav.agents', icon: '🤖'},
  {id: 'conformidade', href: '/conformidade', labelKey: 'nav.compliance', icon: '✅'},
  {id: 'aurora', href: '/cidade-aurora', labelKey: 'cidadeAurora.navLabel', icon: '🌆', variant: 'aurora'},
  {id: 'home', href: '/', labelKey: 'nav.backHome', icon: '🏠', variant: 'highlight'},
];

type Props = {
  current?: string;
};

export default async function StandardQuickNav({current}: Props) {
  const t = await getTranslations();
  const visible = ITEMS.filter((item) => item.id !== current);

  function getLabel(item: QuickNavItem): string {
    try {
      return t(item.labelKey as Parameters<typeof t>[0]);
    } catch {
      return item.id;
    }
  }

  return (
    <nav className="quicknav" aria-label={t('nav.backNavigation')}>
      {visible.map((item) => {
        const className = [
          'quicknav-item',
          item.variant ? `quicknav-item--${item.variant}` : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <Link key={item.id} href={item.href} className={className}>
            <span className="quicknav-icon" aria-hidden="true">{item.icon}</span>
            {getLabel(item)}
          </Link>
        );
      })}
    </nav>
  );
}
