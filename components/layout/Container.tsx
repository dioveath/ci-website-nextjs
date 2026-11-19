import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

const WIDTHS = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-screen-2xl'
} as const;

/**
 * The site's horizontal measure and gutter, in one place.
 *
 * Replaces `px-8 md:px-10 xl:px-20 2xl:px-48`, which was repeated verbatim
 * across eight files and grew the gutter instead of capping the line length --
 * so text on a wide monitor still ran the full width of the screen.
 */
export default function Container({
  children,
  size = 'default',
  className
}: {
  children: ReactNode;
  size?: keyof typeof WIDTHS;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full px-6 md:px-8', WIDTHS[size], className)}>
      {children}
    </div>
  );
}
