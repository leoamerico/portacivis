type LogoVariant = 'horizontal' | 'stacked' | 'mark';

type PortaCivisLogoProps = {
  variant: LogoVariant;
  size: number;
  withSlogan: boolean;
  mono: boolean;
  className?: string;
  title?: string;
};

function resolveAsset(variant: LogoVariant, withSlogan: boolean, mono: boolean) {
  if (variant === 'mark') {
    return mono ? '/brand/portacivis/svg/logo-mono-black.svg' : '/brand/portacivis/svg/logo-mark.svg';
  }

  if (variant === 'stacked') {
    return mono ? '/brand/portacivis/svg/logo-mono-black.svg' : '/brand/portacivis/svg/logo-stacked.svg';
  }

  if (mono) {
    return '/brand/portacivis/svg/logo-mono-black.svg';
  }

  return withSlogan
    ? '/brand/portacivis/svg/logo-horizontal.svg'
    : '/brand/portacivis/svg/logo-horizontal-noslogan.svg';
}

function resolveDimensions(variant: LogoVariant, size: number) {
  if (variant === 'horizontal') {
    return {width: size, height: Math.round(size * 0.28)};
  }

  if (variant === 'stacked') {
    return {width: size, height: Math.round(size * 0.5)};
  }

  return {width: size, height: size};
}

export default function PortaCivisLogo({
  variant,
  size,
  withSlogan,
  mono,
  className,
  title
}: PortaCivisLogoProps) {
  const src = resolveAsset(variant, withSlogan, mono);
  const {width, height} = resolveDimensions(variant, size);

  return (
    <img
      src={src}
      width={width}
      height={height}
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
