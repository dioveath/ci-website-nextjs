import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4'
} as const;

/**
 * The card grid, defined once.
 *
 * Each listing page previously set its own columns and gaps in a CSS module,
 * so /courses, /services and /blog disagreed about both.
 */
export default function CardGrid({
  children,
  columns = 3,
  className
}: {
  children: ReactNode;
  columns?: keyof typeof COLUMNS;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-6', COLUMNS[columns], className)}>{children}</div>
  );
}
