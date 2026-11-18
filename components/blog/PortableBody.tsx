import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

import { urlFor } from '../../lib/sanity/image';

/*
 * Renders the Portable Text body of a Sanity post.
 *
 * Typography comes from @tailwindcss/typography, the same as the Firebase
 * article renderer, so both sources read identically and both follow the
 * theme. Previously every heading here was hardcoded amber and the body white,
 * which only worked because the page behind it was always dark.
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = urlFor(value);
      if (!src) return null;

      return (
        <Image
          src={src}
          alt={value?.alt || ''}
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full rounded-xl"
        />
      );
    }
  },
  marks: {
    link: ({ children, value }) => {
      // Only outbound links get the new-tab treatment and rel hardening.
      const external = /^https?:\/\//.test(value?.href ?? '');
      return (
        <a
          href={value?.href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    }
  }
};

export default function PortableBody({ value }: { value?: PortableTextBlock[] | null }) {
  if (!value) return null;

  return (
    <div className="prose max-w-none dark:prose-invert">
      <PortableText value={value} components={components} />
    </div>
  );
}
