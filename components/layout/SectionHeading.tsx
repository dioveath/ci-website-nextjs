import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/**
 * One heading block for every section, so the type scale and the heading
 * hierarchy are decided once rather than per page.
 *
 * `level` sets the tag, which keeps the document outline correct: the old
 * pages styled `<p className="text-[64px]">` as a title, leaving the home page
 * with no headings at all.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  level = 2,
  align = 'start',
  tone = 'default',
  className
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  level?: 1 | 2 | 3;
  align?: 'start' | 'center';
  tone?: 'default' | 'brand';
  className?: string;
}) {
  const Heading = `h${level}` as 'h1' | 'h2' | 'h3';
  const onBrand = tone === 'brand';

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'text-sm font-semibold tracking-widest uppercase',
            onBrand ? 'text-on-brand-muted' : 'text-primary'
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <Heading
        className={cn(
          'font-semibold tracking-tight',
          level === 1
            ? 'text-4xl md:text-5xl xl:text-6xl'
            : 'text-3xl md:text-4xl',
          onBrand ? 'text-on-brand' : 'text-foreground'
        )}
      >
        {title}
      </Heading>

      {description ? (
        <p
          className={cn(
            'max-w-2xl text-base md:text-lg',
            onBrand ? 'text-on-brand-muted' : 'text-muted-foreground'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
