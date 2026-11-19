import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from '@portabletext/types';

import ArticleRenderer from '../../../components/ArticleRenderer';
import PortableBody from '../../../components/blog/PortableBody';
import PageShell from '../../../components/layout/PageShell';
import Section from '../../../components/layout/Section';
import { Badge } from '../../../components/ui/badge';
import { getBlogDetail } from '../../../lib/blog/normalize';
import type { ArticleBody } from '../../../types';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogDetail(id);
  if (!post) return { title: 'Article not found' };

  const description = post.excerpt || 'Charicha Institute blog';

  // Link previews (Facebook, WhatsApp, LinkedIn...). Relative URLs resolve
  // against metadataBase in the root layout.
  return {
    title: post.title,
    description,
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: post.href,
      siteName: 'Charicha Institute',
      locale: 'en_GB',
      images: [{ url: post.coverImg, alt: post.title }],
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {})
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogDetail(id);
  if (!post) notFound();

  return (
    <PageShell>
      <Section tone="brand" space="sm" as="div" width="narrow">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Badge variant="on-brand">{post.category}</Badge>
            {post.publishedAt ? (
              <time dateTime={post.publishedAt} className="text-sm text-on-brand-muted">
                {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            ) : null}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-on-brand md:text-5xl">
            {post.title}
          </h1>

          <div className="flex items-center gap-3">
            <Image
              src={post.authorImg}
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
            <span className="text-sm text-on-brand-muted">{post.authorName}</span>
          </div>
        </div>
      </Section>

      <Section width="narrow" space="sm">
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl shadow-card">
          <Image
            src={post.coverImg}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>

        {post.source === 'sanity' ? (
          <PortableBody value={post.body as PortableTextBlock[] | null} />
        ) : (
          <ArticleRenderer data={post.body as ArticleBody} />
        )}
      </Section>
    </PageShell>
  );
}
