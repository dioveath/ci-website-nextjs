import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter } from '../ui/card';
import type { BlogSummary } from '../../lib/blog/normalize';

export default function BlogCard({
  post,
  headingLevel = 3
}: {
  post: BlogSummary;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';

  return (
    <Card interactive className="h-full">
      <Link href={post.href} className="flex h-full flex-col">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.coverImg}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <CardContent className="flex-1">
          <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="highlight">{post.category}</Badge>
            {post.publishedAt ? (
              <time dateTime={post.publishedAt} className="text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </time>
            ) : null}
          </div>

          <Heading className="text-lg font-semibold text-card-foreground">
            {post.title}
          </Heading>

          {post.excerpt ? (
            <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter variant="meta">
          <Image
            src={post.authorImg}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
          <span className="text-sm text-muted-foreground">{post.authorName}</span>
        </CardFooter>
      </Link>
    </Card>
  );
}
