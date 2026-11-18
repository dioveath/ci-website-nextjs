import type { ElementType, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import Container from './Container';

/**
 * Surface tones. `brand` is the one legitimate home of the brand gradient:
 * the old `bg-linear-[-45deg] from-eggblue to-slategray` sat behind body text
 * on every page, and white on that gradient's light stop measured 2.65:1.
 */
const TONES = {
  default: 'bg-background text-foreground',
  muted: 'bg-muted text-foreground',
  card: 'bg-card text-card-foreground',
  brand: 'brand-band'
} as const;

/** Vertical rhythm, replacing the `<div className="h-40" />` spacers. */
const SPACES = {
  none: '',
  sm: 'py-10 md:py-14',
  default: 'py-16 md:py-24',
  lg: 'py-20 md:py-32'
} as const;

export default function Section({
  children,
  tone = 'default',
  space = 'default',
  width,
  as: Tag = 'section',
  className,
  containerClassName,
  id
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  space?: keyof typeof SPACES;
  width?: 'narrow' | 'default' | 'wide';
  as?: ElementType;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn(TONES[tone], SPACES[space], className)}>
      <Container size={width} className={containerClassName}>
        {children}
      </Container>
    </Tag>
  );
}
