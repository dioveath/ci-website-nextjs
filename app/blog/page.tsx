import type { Metadata } from 'next';

import BlogCard from '../../components/blog/BlogCard';
import CardGrid from '../../components/layout/CardGrid';
import PageShell from '../../components/layout/PageShell';
import Section from '../../components/layout/Section';
import SectionHeading from '../../components/layout/SectionHeading';
import { getBlogSummaries } from '../../lib/blog/normalize';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articles from the Charicha Institute team and from students learning with us.'
};

// Merges live Firebase articles with Sanity posts on every request.
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getBlogSummaries();

  return (
    <PageShell>
      <Section tone="brand" space="sm" as="div">
        <SectionHeading
          level={1}
          tone="brand"
          eyebrow="Blog"
          title="What's on the run?"
          description="Handpicked articles from our team and our students."
        />
      </Section>

      <Section>
        {posts.length ? (
          <CardGrid>
            {posts.map((post) => (
              <BlogCard key={post.key} post={post} headingLevel={2} />
            ))}
          </CardGrid>
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            No articles published yet. Check back soon.
          </p>
        )}
      </Section>
    </PageShell>
  );
}
