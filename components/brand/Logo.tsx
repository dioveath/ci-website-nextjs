import Image from 'next/image';
import { cn } from '../../lib/utils';

/**
 * The wordmark, swapped for the active theme.
 *
 * Both files ship and CSS picks one. Reading the theme in JS instead would
 * mean the server cannot know which to render, so the wrong mark would paint
 * first and swap after hydration.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/ci_logo_full.png"
        alt="Charicha Institute"
        width={2048}
        height={699}
        priority
        className={cn('w-auto dark:hidden', className)}
      />
      <Image
        src="/ci_logo_light_blue.png"
        alt=""
        aria-hidden
        width={1669}
        height={553}
        priority
        className={cn('hidden w-auto dark:block', className)}
      />
    </>
  );
}
