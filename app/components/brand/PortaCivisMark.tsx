type PortaCivisMarkProps = {
  variant: 'horizontal' | 'stacked' | 'mark';
  size: number;
  withSlogan: boolean;
  mono: boolean;
  className?: string;
  title?: string;
};

export default function PortaCivisMark({size, mono, className, title}: PortaCivisMarkProps) {
  const src = mono ? '/brand/portacivis/svg/logo-mono-black.svg' : '/brand/portacivis/svg/logo-mark.svg';

  return (
    <img
      src={src}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="PortaCivis"
      title={title ?? 'PortaCivis'}
      alt={title ?? 'PortaCivis'}
      loading="lazy"
      decoding="async"
    />
  );
}
