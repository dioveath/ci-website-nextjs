'use client';

import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { urlFor } from '../../lib/sanity/image';

// Renders the Portable Text body of a Sanity blog post. Mirrors the dark theme
// used by the Firebase article renderer. Embedded images go through urlFor().
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = urlFor(value);
      if (!src) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={value?.alt || ''}
          style={{ maxWidth: '100%', borderRadius: '12px', margin: '1rem 0' }}
        />
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold my-4 text-cheeseyellow">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold my-3 text-cheeseyellow">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold my-2 text-cheeseyellow">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-cheeseyellow pl-4 my-4 italic text-white/80">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-6 my-3">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ml-6 my-3">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        rel="noopener noreferrer"
        target="_blank"
        className="text-aquamarine underline"
      >
        {children}
      </a>
    ),
  },
};

export default function PortableBody({ value }: { value?: PortableTextBlock[] | null }) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
